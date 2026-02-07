import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send } from "lucide-react";
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
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-3 mb-1">
            <MessageSquare className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-black text-foreground">Global Chat</h1>
          </div>
          <p className="text-sm text-muted-foreground">Chat with other players</p>
        </div>

        {/* Input at the top */}
        <div className="mb-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            maxLength={200}
            placeholder={nickname ? "Type a message..." : "Set a nickname first"}
            disabled={!nickname}
            className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-foreground text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground disabled:opacity-50"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!nickname || !input.trim() || isSending}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/80 text-primary-foreground font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>

        {sendError && (
          <p className="text-red-400 text-sm mb-3 text-center">{sendError}</p>
        )}

        <AdminPanel nickname={nickname} onSimulatePull={onSimulatePull} />

        {/* Messages (newest first) */}
        <div className="rounded-xl bg-black/20 border border-white/5 p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No messages yet. Say hi!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.sender_nickname === nickname;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 ${
                      isOwn
                        ? "bg-primary/30 border border-primary/20"
                        : "bg-white/5 border border-white/5"
                    }`}
                  >
                    <p className="text-sm text-foreground break-words">
                      <span className="font-bold text-primary">{msg.sender_nickname}</span>
                      <span className="text-muted-foreground">:</span>{" "}
                      {msg.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 text-right">
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
