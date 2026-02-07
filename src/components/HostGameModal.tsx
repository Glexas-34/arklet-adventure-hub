import { useState } from "react";
import { motion } from "framer-motion";
import { X, Users, Play, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Rarity, rarityOrder, rarityInfo } from "@/data/gameData";
import { GamePlayer, GameMode } from "@/hooks/useMultiplayerGame";
import {
  ClassicIcon,
  StealAndGetIcon,
  BlockBusterIcon,
  FishingIcon,
  PlatformRunIcon,
  FlappyBirdIcon,
  GameModeCard,
} from "@/components/GameModeIcons";

const gameModes: { id: GameMode; label: string; description: string; gradient: string; icon: React.ReactNode }[] = [
  { id: "classic", label: "Classic Opening", description: "Race to a target rarity", gradient: "from-red-500 to-orange-500", icon: <ClassicIcon size={56} /> },
  { id: "steal_and_get", label: "Steal & Get", description: "Mystery boxes & steal items", gradient: "from-purple-500 to-indigo-500", icon: <StealAndGetIcon size={56} /> },
  { id: "block_buster", label: "Block Buster", description: "Breakout game with drops", gradient: "from-cyan-500 to-blue-500", icon: <BlockBusterIcon size={56} /> },
  { id: "fishing", label: "Fishing Reeling", description: "Cast & reel to catch items", gradient: "from-blue-500 to-teal-500", icon: <FishingIcon size={56} /> },
  { id: "platform_run", label: "Platform Run", description: "Jump & collect items", gradient: "from-green-500 to-emerald-500", icon: <PlatformRunIcon size={56} /> },
  { id: "flappy_bird", label: "Flappy Bird", description: "Flap & collect items", gradient: "from-sky-400 to-blue-500", icon: <FlappyBirdIcon size={56} /> },
];

interface HostGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  nickname: string | null;
  onCreateRoom: (nickname: string, targetRarity: Rarity, timeLimit: number, gameMode: GameMode) => Promise<{ success: boolean; pinCode?: string; error?: string }>;
  onStartGame: () => void;
  pinCode: string | null;
  players: GamePlayer[];
  error: string | null;
}

export function HostGameModal({
  isOpen,
  onClose,
  nickname,
  onCreateRoom,
  onStartGame,
  pinCode,
  players,
  error,
}: HostGameModalProps) {
  const [targetRarity, setTargetRarity] = useState<Rarity>("Rare");
  const [timeLimit, setTimeLimit] = useState(2);
  const [gameMode, setGameMode] = useState<GameMode>("classic");
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!nickname) return;
    setIsCreating(true);
    await onCreateRoom(nickname, targetRarity, timeLimit, gameMode);
    setIsCreating(false);
  };

  const copyPin = () => {
    if (pinCode) {
      navigator.clipboard.writeText(pinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const selectableRarities = rarityOrder.filter((r) => r !== "Exotic");
  const selectedMode = gameModes.find((m) => m.id === gameMode)!;

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
                   rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
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
            {/* Gamemode Selector */}
            <div>
              <Label>Gamemode</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {gameModes.map((mode) => (
                  <GameModeCard
                    key={mode.id}
                    icon={mode.icon}
                    label={mode.label}
                    description={mode.description}
                    selected={gameMode === mode.id}
                    gradient={mode.gradient}
                    onClick={() => setGameMode(mode.id)}
                  />
                ))}
              </div>
            </div>

            {/* Rarity selector — only for Classic */}
            {gameMode === "classic" && (
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
            )}

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
              disabled={!nickname || isCreating}
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
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center">{selectedMode.icon}</div>
                <span className="font-bold text-primary">{selectedMode.label}</span>
              </div>
              {gameMode === "classic" && (
                <p className="mt-1">Target: <span className="font-bold" style={{ color: rarityInfo[targetRarity]?.color }}>{targetRarity}</span> or higher</p>
              )}
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
