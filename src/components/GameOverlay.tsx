import { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, Clock, X, Users, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameRoom, GamePlayer } from "@/hooks/useMultiplayerGame";
import { rarityInfo, rarityOrder } from "@/data/gameData";
import { useSound } from "@/hooks/useSound";
import {
  ClassicIcon,
  StealAndGetIcon,
  BlockBusterIcon,
  FishingIcon,
  PlatformRunIcon,
  FlappyBirdIcon,
} from "@/components/GameModeIcons";

interface GameOverlayProps {
  room: GameRoom;
  players: GamePlayer[];
  myPlayer: GamePlayer | null;
  timeRemaining: number | null;
  onLeave: () => void;
}

const modeLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  classic: { label: "Classic Opening", icon: <ClassicIcon size={20} /> },
  steal_and_get: { label: "Steal & Get", icon: <StealAndGetIcon size={20} /> },
  block_buster: { label: "Block Buster", icon: <BlockBusterIcon size={20} /> },
  fishing: { label: "Fishing Reeling", icon: <FishingIcon size={20} /> },
  platform_run: { label: "Platform Run", icon: <PlatformRunIcon size={20} /> },
  flappy_bird: { label: "Flappy Bird", icon: <FlappyBirdIcon size={20} /> },
};

export function GameOverlay({
  room,
  players,
  myPlayer,
  timeRemaining,
  onLeave,
}: GameOverlayProps) {
  const { playTimerWarning, playGameEnd, playGameWin, playGameStart, startArcadeMusic, stopArcadeMusic } = useSound();
  const prevTimeRef = useRef<number | null>(null);
  const prevWinnerRef = useRef<string | null>(null);
  const mountedRef = useRef(false);

  // Play game start sound on mount + start arcade music
  useEffect(() => {
    if (!mountedRef.current && room.status === "playing") {
      mountedRef.current = true;
      playGameStart();
      startArcadeMusic();
    }
    if (room.status === "finished") {
      stopArcadeMusic();
    }
    return () => {
      stopArcadeMusic();
    };
  }, [room.status, playGameStart, startArcadeMusic, stopArcadeMusic]);

  // Timer warning ticks for last 10 seconds
  useEffect(() => {
    if (timeRemaining === null) return;
    const prev = prevTimeRef.current;
    prevTimeRef.current = timeRemaining;

    if (timeRemaining <= 10 && timeRemaining > 0 && prev !== timeRemaining) {
      playTimerWarning();
    }
    if (timeRemaining === 0 && prev !== 0) {
      playGameEnd();
    }
  }, [timeRemaining, playTimerWarning, playGameEnd]);

  // Classic mode winner sound
  useEffect(() => {
    if (room.winner_nickname && prevWinnerRef.current === null) {
      playGameWin();
    }
    prevWinnerRef.current = room.winner_nickname;
  }, [room.winner_nickname, playGameWin]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isClassic = room.game_mode === "classic";

  // Sorted leaderboard
  const rankedPlayers = useMemo(() => {
    const sorted = [...players].sort((a, b) => {
      if (isClassic) {
        // Sort by rarity index (highest first)
        const aIdx = a.current_rarity ? rarityOrder.indexOf(a.current_rarity as any) : -1;
        const bIdx = b.current_rarity ? rarityOrder.indexOf(b.current_rarity as any) : -1;
        return bIdx - aIdx;
      } else {
        // Sort by numeric score (highest first)
        const aScore = a.current_rarity ? parseInt(a.current_rarity, 10) || 0 : 0;
        const bScore = b.current_rarity ? parseInt(b.current_rarity, 10) || 0 : 0;
        return bScore - aScore;
      }
    });
    return sorted;
  }, [players, isClassic]);

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
              <div className="flex items-center gap-1.5 text-sm">
                {modeLabels[room.game_mode]?.icon}
                <span className="font-bold text-primary">{modeLabels[room.game_mode]?.label || room.game_mode}</span>
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

        {/* Live leaderboard */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {rankedPlayers.map((player, idx) => (
            <div
              key={player.id}
              className={`flex-shrink-0 bg-black/50 rounded-lg px-4 py-3 relative
                         ${player.id === myPlayer?.id ? "border border-primary/50" : ""}
                         ${idx === 0 && player.current_item ? "ring-1 ring-yellow-500/50" : ""}`}
            >
              {idx === 0 && player.current_item && (
                <Crown size={14} className="absolute -top-1.5 -right-1.5 text-yellow-500" />
              )}
              <div className="font-semibold text-sm text-muted-foreground">
                <span className="text-muted-foreground/60 mr-1">#{idx + 1}</span>
                {player.nickname}
                {player.is_host && " 👑"}
              </div>
              {player.current_item ? (
                isClassic ? (
                  <div
                    className="font-bold text-base"
                    style={{ color: rarityInfo[player.current_rarity as keyof typeof rarityInfo]?.color }}
                  >
                    {player.current_item}
                  </div>
                ) : (
                  <div className="font-bold text-base text-primary">
                    {player.current_item}
                  </div>
                )
              ) : (
                <div className="text-sm text-muted-foreground italic">
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.7, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 120 }}
            className="bg-gradient-to-br from-primary/20 via-black/60 to-secondary/20 border-2 border-primary/40
                       rounded-3xl p-8 md:p-12 text-center w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Winner / Mode header */}
            {isClassic ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <Trophy size={80} className="mx-auto text-yellow-500 mb-2 drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]" />
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-bold mb-2">Game Over!</h2>
                {room.winner_nickname ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                  >
                    <p className="text-2xl md:text-3xl mt-2">
                      🎉 <span className="font-bold text-yellow-400">{room.winner_nickname}</span> wins!
                    </p>
                    <p className="text-lg text-muted-foreground mt-1">
                      Got{" "}
                      <span
                        className="font-bold text-lg"
                        style={{ color: rarityInfo[room.target_rarity]?.color }}
                      >
                        {room.winning_item}
                      </span>
                    </p>
                  </motion.div>
                ) : (
                  <p className="text-xl mb-6 text-muted-foreground">
                    Time's up! No one got {room.target_rarity} or higher.
                  </p>
                )}
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto mb-2 flex justify-center"
                >
                  {room.game_mode === "steal_and_get" && <StealAndGetIcon size={80} />}
                  {room.game_mode === "block_buster" && <BlockBusterIcon size={80} />}
                  {room.game_mode === "fishing" && <FishingIcon size={80} />}
                  {room.game_mode === "platform_run" && <PlatformRunIcon size={80} />}
                  {room.game_mode === "flappy_bird" && <FlappyBirdIcon size={80} />}
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-bold mb-2">Time's Up!</h2>
                {rankedPlayers.length > 0 && rankedPlayers[0].current_item && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl md:text-3xl mt-2 mb-2"
                  >
                    🏆 <span className="font-bold text-yellow-400">{rankedPlayers[0].nickname}</span> wins!
                  </motion.p>
                )}
                <p className="text-sm text-muted-foreground mb-4">
                  All collected items have been added to your inventory!
                </p>
              </>
            )}

            {/* Full leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full mb-6"
            >
              <h3 className="text-lg font-bold text-muted-foreground mb-3 flex items-center justify-center gap-2">
                <Users size={18} /> Final Standings
              </h3>
              <div className="space-y-2">
                {rankedPlayers.map((player, idx) => {
                  const isWinner = idx === 0 && player.current_item;
                  const isMe = player.id === myPlayer?.id;
                  const score = isClassic
                    ? player.current_rarity || "—"
                    : player.current_rarity ? `${player.current_rarity} items` : "0 items";

                  return (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left
                        ${isWinner
                          ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                          : isMe
                            ? "bg-primary/10 border border-primary/30"
                            : "bg-white/5 border border-white/10"
                        }`}
                    >
                      {/* Rank */}
                      <div className={`text-2xl font-black w-10 text-center
                        ${idx === 0 ? "text-yellow-500" : idx === 1 ? "text-gray-300" : idx === 2 ? "text-amber-600" : "text-muted-foreground"}`}>
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                      </div>

                      {/* Player info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-lg truncate">
                          {player.nickname}
                          {player.is_host && " 👑"}
                          {isMe && <span className="text-xs text-primary ml-2">(you)</span>}
                        </div>
                        {isClassic && player.current_item && (
                          <div
                            className="text-sm font-semibold truncate"
                            style={{ color: rarityInfo[player.current_rarity as keyof typeof rarityInfo]?.color }}
                          >
                            {player.current_item}
                          </div>
                        )}
                      </div>

                      {/* Score */}
                      <div className={`text-right font-bold text-lg
                        ${isWinner ? "text-yellow-400" : "text-muted-foreground"}`}>
                        {score}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <Button onClick={onLeave} size="lg" className="gradient-button text-lg px-10 py-6">
              Back to Menu
            </Button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
