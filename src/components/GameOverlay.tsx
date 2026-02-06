import { motion } from "framer-motion";
import { Trophy, Clock, X, Users, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameRoom, GamePlayer } from "@/hooks/useMultiplayerGame";
import { rarityInfo } from "@/data/gameData";

interface GameOverlayProps {
  room: GameRoom;
  players: GamePlayer[];
  myPlayer: GamePlayer | null;
  timeRemaining: number | null;
  onLeave: () => void;
}

const modeLabels: Record<string, string> = {
  classic: "Classic Opening",
  steal_and_get: "Steal & Get",
  block_buster: "Block Buster",
  fishing: "Fishing Reeling",
};

export function GameOverlay({
  room,
  players,
  myPlayer,
  timeRemaining,
  onLeave,
}: GameOverlayProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isClassic = room.game_mode === "classic";

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 p-4"
    >
      <div className="max-w-4xl mx-auto bg-black/80 backdrop-blur-lg rounded-2xl border border-primary/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className="flex items-center gap-2 bg-black/50 rounded-xl px-4 py-2">
              <Clock size={20} className={timeRemaining && timeRemaining < 60 ? "text-destructive animate-pulse" : "text-primary"} />
              <span className="text-xl font-mono font-bold">
                {timeRemaining !== null ? formatTime(timeRemaining) : "--:--"}
              </span>
            </div>

            {/* Target (Classic) or Mode label (others) */}
            {isClassic ? (
              <div className="text-sm">
                <span className="text-muted-foreground">Target: </span>
                <span
                  className="font-bold"
                  style={{ color: rarityInfo[room.target_rarity]?.color }}
                >
                  {room.target_rarity}+
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-sm">
                <Package size={16} className="text-primary" />
                <span className="font-bold text-primary">{modeLabels[room.game_mode] || room.game_mode}</span>
              </div>
            )}

            {/* Players */}
            <div className="flex items-center gap-2 text-sm">
              <Users size={16} />
              <span>{players.length} players</span>
            </div>
          </div>

          {/* Winner announcement (Classic only) */}
          {isClassic && room.winner_nickname && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20
                         border border-yellow-500/50 rounded-xl px-4 py-2"
            >
              <Trophy className="text-yellow-500" size={20} />
              <span className="font-bold text-yellow-500">
                {room.winner_nickname} got {room.winning_item}!
              </span>
            </motion.div>
          )}

          {/* Leave button */}
          <Button variant="ghost" size="sm" onClick={onLeave}>
            <X size={18} className="mr-1" />
            Leave
          </Button>
        </div>

        {/* Live feed of players' latest pulls */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {players.map((player) => (
            <div
              key={player.id}
              className={`flex-shrink-0 bg-black/50 rounded-lg px-3 py-2 text-sm
                         ${player.id === myPlayer?.id ? "border border-primary/50" : ""}`}
            >
              <div className="font-semibold text-xs text-muted-foreground">
                {player.nickname}
                {player.is_host && " 👑"}
              </div>
              {player.current_item ? (
                <div
                  className="font-bold"
                  style={{ color: rarityInfo[player.current_rarity as keyof typeof rarityInfo]?.color }}
                >
                  {player.current_item}
                </div>
              ) : (
                <div className="text-muted-foreground italic">
                  {isClassic ? "Opening..." : "Playing..."}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Game over modal */}
      {room.status === "finished" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30
                         rounded-2xl p-8 text-center max-w-md">
            {isClassic ? (
              <>
                <Trophy size={64} className="mx-auto text-yellow-500 mb-4" />
                <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
                {room.winner_nickname ? (
                  <div className="space-y-2 mb-6">
                    <p className="text-xl">
                      🎉 <span className="font-bold text-primary">{room.winner_nickname}</span> wins!
                    </p>
                    <p className="text-muted-foreground">
                      Got <span
                        className="font-bold"
                        style={{ color: rarityInfo[room.target_rarity]?.color }}
                      >
                        {room.winning_item}
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="text-xl mb-6 text-muted-foreground">
                    Time's up! No one got {room.target_rarity} or higher.
                  </p>
                )}
              </>
            ) : (
              <>
                <Package size={64} className="mx-auto text-primary mb-4" />
                <h2 className="text-3xl font-bold mb-4">Time's Up!</h2>
                <p className="text-lg mb-6 text-muted-foreground">
                  All collected items have been added to your inventory!
                </p>
              </>
            )}

            <Button onClick={onLeave} className="gradient-button">
              Back to Menu
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
