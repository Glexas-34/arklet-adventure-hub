import { useState } from "react";
import { motion } from "framer-motion";
import { X, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface JoinGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  nickname: string | null;
  onJoin: (pinCode: string, nickname: string) => Promise<{ success: boolean; error?: string }>;
  error: string | null;
}

export function JoinGameModal({ isOpen, onClose, nickname, onJoin, error }: JoinGameModalProps) {
  const [pinCode, setPinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  if (!isOpen) return null;

  const handleJoin = async () => {
    if (!pinCode.trim() || !nickname) return;
    setIsJoining(true);
    const result = await onJoin(pinCode.trim(), nickname);
    setIsJoining(false);
    if (result.success) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 
                   rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">🎯 Join Game</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="pinCode" className="text-sm font-medium">Pin Code</label>
            <Input
              id="pinCode"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(e) => { if (e.key === "Enter") handleJoin(); }}
              placeholder="Enter 6-digit PIN"
              className="mt-1 text-center text-2xl font-mono tracking-widest"
              maxLength={6}
            />
          </div>

          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}

          <Button
            onClick={handleJoin}
            disabled={pinCode.length !== 6 || !nickname || isJoining}
            className="w-full gradient-button"
          >
            <LogIn size={18} className="mr-2" />
            {isJoining ? "Joining..." : "Join Game"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
