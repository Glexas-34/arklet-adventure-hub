import { useState } from "react";
import { motion } from "framer-motion";
import { X, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JoinGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (pinCode: string, nickname: string) => Promise<{ success: boolean; error?: string }>;
  error: string | null;
}

export function JoinGameModal({ isOpen, onClose, onJoin, error }: JoinGameModalProps) {
  const [pinCode, setPinCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  if (!isOpen) return null;

  const handleJoin = async () => {
    if (!pinCode.trim() || !nickname.trim()) return;
    setIsJoining(true);
    const result = await onJoin(pinCode.trim(), nickname.trim());
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
            <Label htmlFor="pinCode">Pin Code</Label>
            <Input
              id="pinCode"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit PIN"
              className="mt-1 text-center text-2xl font-mono tracking-widest"
              maxLength={6}
            />
          </div>

          <div>
            <Label htmlFor="joinNickname">Nickname</Label>
            <Input
              id="joinNickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your nickname"
              className="mt-1"
            />
          </div>

          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}

          <Button
            onClick={handleJoin}
            disabled={pinCode.length !== 6 || !nickname.trim() || isJoining}
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
