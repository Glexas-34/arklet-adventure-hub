import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
  id: string;
  sender_nickname: string;
  message: string;
  created_at: string;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchedRef = useRef(false);

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
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [newMsg, ...prev.slice(0, 49)];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sendMessage = useCallback(async (nickname: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !nickname) return;

    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert({ sender_nickname: nickname, message: trimmed })
        .select("id, sender_nickname, message, created_at")
        .single();

      if (error) throw error;

      if (data) {
        setMessages((prev) => {
          // Avoid duplicate if real-time already delivered it
          if (prev.some((m) => m.id === data.id)) return prev;
          return [data as ChatMessage, ...prev.slice(0, 49)];
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, []);

  return { messages, sendMessage, isLoading };
}
