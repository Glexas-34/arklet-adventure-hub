import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { AdminPanel } from "@/components/AdminPanel";
import { BlookItem } from "@/data/gameData";

interface ChatViewProps {
  nickname: string | null;
  onSimulatePull?: (item: BlookItem) => void;
}

export function ChatView({ nickname, onSimulatePull }: ChatViewProps) {
  const { messages, sendMessage, isLoading } = useChat();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !nickname || isSending) return;
    const text = input;
    setInput("");
    setSendError(null);
    setIsSending(true);
    const errorMsg = await sendMessage(nickname, text);
    if (errorMsg) {
      setSendError(errorMsg);
    }
    setIsSending(false);
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Reverse so oldest is first (top), newest is last (bottom)
  const chronological = [...messages].reverse();

  // Consistent color per nickname (from a palette of distinct hues)
  const nameColorCache = useRef<Record<string, string>>({});
  const getNameColor = (name: string): string => {
    if (nameColorCache.current[name]) return nameColorCache.current[name];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const palette = [
      "#FF6B6B", "#4ECDC4", "#FFD93D", "#6C5CE7", "#A8E6CF",
      "#FF8A5C", "#EA8685", "#3DC1D3", "#E77F67", "#778BEB",
      "#F8A5C2", "#63CDDA", "#CF6A87", "#58B19F", "#E15F41",
      "#FDA7DF", "#7ED6DF", "#BDC581", "#D6A2E8", "#82CCDD",
    ];
    const idx = Math.abs(hash) % palette.length;
    nameColorCache.current[name] = palette[idx];
    return palette[idx];
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto">
      <AdminPanel nickname={nickname} onSimulatePull={onSimulatePull} />

      {/* Messages area — grows to fill, scrolls */}
      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto px-3 md:px-4 pt-2 pb-2"
      >
        {chronological.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <p className="text-sm">No messages yet. Say hi!</p>
          </div>
        ) : (
          <div className="space-y-1">
            {chronological.map((msg, i) => {
              const isOwn = msg.sender_nickname === nickname;
              const prevMsg = i > 0 ? chronological[i - 1] : null;
              const sameSender = prevMsg?.sender_nickname === msg.sender_nickname;
              const showName = !isOwn && !sameSender;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"} ${sameSender ? "" : "mt-2"}`}
                >
                  <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                    {showName && (
                      <span
                        className="text-[11px] font-semibold ml-3 mb-0.5"
                        style={{ color: getNameColor(msg.sender_nickname) }}
                      >
                        {msg.sender_nickname}
                      </span>
                    )}
                    <div
                      className={`px-3 py-1.5 text-sm break-words ${
                        isOwn
                          ? "bg-[#007AFF] text-white rounded-2xl rounded-br-md"
                          : "text-[#E5E5EA] rounded-2xl rounded-bl-md"
                      }`}
                      style={!isOwn ? { backgroundColor: getNameColor(msg.sender_nickname) + "18" } : undefined}
                    >
                      {msg.message}
                    </div>
                    <span className="text-[10px] text-muted-foreground/50 mt-0.5 px-2">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar — always at bottom */}
      <div className="flex-shrink-0 border-t border-white/10 bg-black/40 backdrop-blur-md px-3 py-2">
        {sendError && (
          <p className="text-red-400 text-xs mb-1 text-center">{sendError}</p>
        )}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            maxLength={200}
            placeholder={nickname ? "iMessage" : "Set a nickname first"}
            disabled={!nickname}
            className="flex-1 px-4 py-2 rounded-full bg-[#1C1C1E] border border-[#3A3A3C] text-[#E5E5EA] text-sm outline-none focus:border-[#007AFF] transition-colors placeholder:text-[#636366] disabled:opacity-50"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!nickname || !input.trim() || isSending}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#007AFF] text-white transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
