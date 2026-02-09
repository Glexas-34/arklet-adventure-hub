import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeChatMessage } from "@/lib/sanitize";

export interface ChatMessage {
  id: string;
  sender_nickname: string;
  message: string;
  created_at: string;
}

const RATE_LIMIT_MS = 2000; // 2 seconds between messages

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchedRef = useRef(false);
  const lastSendRef = useRef(0);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("id, sender_nickname, message, created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setMessages((data as ChatMessage[]) || []);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchMessages();
    }

    const channel = supabase
      .channel("global-chat")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => {
            // Skip if already present (by real id)
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            // Remove matching temp message if exists (same sender + message text)
            const withoutTemp = prev.filter(
              (m) => !(m.id.startsWith("temp-") && m.sender_nickname === newMsg.sender_nickname && m.message === newMsg.message)
            );
            return [newMsg, ...withoutTemp.slice(0, 49)];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sendMessage = useCallback(async (nickname: string, text: string): Promise<string | null> => {
    // Sanitize input
    const result = sanitizeChatMessage(text);
    if (!result.valid) return result.error || "Invalid message";
    if (!nickname) return "Missing nickname";

    // Client-side rate limiting
    const now = Date.now();
    if (now - lastSendRef.current < RATE_LIMIT_MS) {
      return "Please wait a moment before sending another message";
    }
    lastSendRef.current = now;

    const trimmed = result.value;

    // Add message to state immediately
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      sender_nickname: nickname,
      message: trimmed,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [optimisticMsg, ...prev.slice(0, 49)]);

    try {
      const { error } = await supabase
        .from("chat_messages")
        .insert({ sender_nickname: nickname, message: trimmed });

      if (error) {
        console.error("Supabase insert error:", error);
        // Keep the message visible locally, just warn about persistence
        return `DB error: ${error.message}`;
      }
      return null;
    } catch (error: any) {
      console.error("Error sending message:", error);
      // Keep the message visible locally
      return `Error: ${error?.message || "Unknown error"}`;
    }
  }, []);

  return { messages, sendMessage, isLoading };
}
