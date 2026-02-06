import { useState } from "react";
import { motion } from "framer-motion";
import { X, Users, Play, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Rarity, rarityOrder, rarityInfo } from "@/data/gameData";
import { GamePlayer } from "@/hooks/useMultiplayerGame";

interface HostGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (nickname: string, targetRarity: Rarity, timeLimit: number) => Promise<{ success: boolean; pinCode?: string; error?: string }>;
  onStartGame: () => void;
  pinCode: string | null;
  players: GamePlayer[];
  error: string | null;
}

export function HostGameModal({
  isOpen,
  onClose,
  onCreateRoom,
  onStartGame,
  pinCode,
  players,
  error,
}: HostGameModalProps) {
  const [nickname, setNickname] = useState("");
  const [targetRarity, setTargetRarity] = useState<Rarity>("Rare");
  const [timeLimit, setTimeLimit] = useState(10);
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!nickname.trim()) return;
    setIsCreating(true);
    await onCreateRoom(nickname.trim(), targetRarity, timeLimit);
    setIsCreating(false);
  };

  const copyPin = () => {
    if (pinCode) {
      navigator.clipboard.writeText(pinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // All rarities available for selection (Common to Mystical)
  const selectableRarities = rarityOrder;
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
          <h2 className="text-2xl font-bold text-foreground">🎮 Host Game</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {!pinCode ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="nickname">Your Nickname (Optional)</Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter your nickname"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Ends in ___ Rarity</Label>
              <Select
                value={targetRarity}
                onValueChange={(v) => setTargetRarity(v as Rarity)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectableRarities.map((rarity) => (
                    <SelectItem key={rarity} value={rarity}>
                      <span style={{ color: rarityInfo[rarity].color }}>
                        {rarity}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Time Limit: {timeLimit} Minutes (Max. 30)</Label>
              <input
                type="range"
                min={1}
                max={30}
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full mt-2 accent-primary"
              />
            </div>

            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}

            <Button
              onClick={handleCreate}
              disabled={!nickname.trim() || isCreating}
              className="w-full gradient-button"
            >
              {isCreating ? "Creating..." : "Create Game"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-muted-foreground text-sm mb-2">PIN Code</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-mono font-bold tracking-widest text-primary">
                  {pinCode}
                </span>
                <Button variant="ghost" size="icon" onClick={copyPin}>
                  {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                </Button>
              </div>
            </div>

            <div className="bg-black/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users size={18} />
                <span className="font-semibold">Players ({players.length})</span>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className={player.is_host ? "text-primary font-bold" : ""}>
                      {player.nickname}
                      {player.is_host && " (Host)"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Target: <span className="font-bold" style={{ color: rarityInfo[targetRarity]?.color }}>{targetRarity}</span> or higher</p>
            </div>

            <Button
              onClick={onStartGame}
              disabled={players.length < 1}
              className="w-full gradient-button"
            >
              <Play size={18} className="mr-2" />
              Start Game
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
