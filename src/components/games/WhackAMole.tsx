import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";
import { useSound } from "@/hooks/useSound";

const GRID_SIZE = 9;
const GAME_DURATION = 30;
const MAX_SCORE = 30;

export function WhackAMole({ onGameEnd, onExit }: MiniGameProps) {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [activeMoles, setActiveMoles] = useState<Set<number>>(new Set());
  const [hits, setHits] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastHit, setLastHit] = useState<number | null>(null);
  const moleTimer = useRef<ReturnType<typeof setInterval>>();
  const { playCorrect, playWrong, playTick } = useSound();

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          return 0;
        }
        if (t <= 5) playTick();
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, playTick]);

  useEffect(() => {
    if (started && timeLeft === 0) {
      clearInterval(moleTimer.current);
      onGameEnd({
        score: hits,
        maxScore: MAX_SCORE,
        normalizedScore: Math.min(1, hits / MAX_SCORE),
      });
    }
  }, [timeLeft, started, hits, onGameEnd]);

  const startGame = () => {
    setStarted(true);
    spawnMoles();
  };

  const spawnMoles = () => {
    moleTimer.current = setInterval(() => {
      setActiveMoles((prev) => {
        const next = new Set(prev);
        // Remove old moles
        if (next.size > 0 && Math.random() > 0.3) {
          const arr = Array.from(next);
          next.delete(arr[Math.floor(Math.random() * arr.length)]);
        }
        // Add new mole
        const pos = Math.floor(Math.random() * GRID_SIZE);
        if (!next.has(pos)) next.add(pos);
        return next;
      });
    }, 700);
  };

  const handleWhack = useCallback((pos: number) => {
    if (activeMoles.has(pos)) {
      setHits((h) => h + 1);
      setStreak((s) => s + 1);
      setLastHit(pos);
      setActiveMoles((prev) => {
        const next = new Set(prev);
        next.delete(pos);
        return next;
      });
      playCorrect();
      setTimeout(() => setLastHit(null), 200);
    } else {
      setStreak(0);
      playWrong();
    }
  }, [activeMoles, playCorrect, playWrong]);

  if (!started) {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="flex items-center gap-3 mb-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
            className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft size={20} />
          </motion.button>
          <h3 className="text-xl font-bold text-foreground">🔨 Whack-a-Mole</h3>
        </div>
        <p className="text-muted-foreground mb-6">Bonk the moles before they disappear! 30 seconds!</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="gradient-button text-primary-foreground font-bold px-8 py-4 rounded-xl text-xl"
        >
          Start!
        </motion.button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
          className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ArrowLeft size={20} />
        </motion.button>
        <h3 className="text-xl font-bold text-foreground">🔨 Whack-a-Mole</h3>
        <span className={`ml-auto text-lg font-bold ${timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-foreground"}`}>
          {timeLeft}s
        </span>
      </div>

      <div className="bg-card rounded-3xl p-4">
        <div className="flex justify-between mb-3 text-sm">
          <span className="text-green-400 font-bold">🔨 {hits}</span>
          {streak >= 3 && <span className="text-orange-400 font-bold">🔥 {streak} streak!</span>}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: GRID_SIZE }, (_, i) => {
            const hasMole = activeMoles.has(i);
            const wasHit = lastHit === i;
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.85 }}
                onClick={() => handleWhack(i)}
                className={`aspect-square rounded-2xl text-4xl flex items-center justify-center
                           transition-all min-h-[70px] ${
                  wasHit
                    ? "bg-yellow-500/30 border-2 border-yellow-500"
                    : hasMole
                      ? "bg-amber-700/40 border-2 border-amber-500/50"
                      : "bg-black/30 border-2 border-white/5"
                }`}
              >
                {hasMole && (
                  <motion.span
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    🐹
                  </motion.span>
                )}
                {wasHit && <span>💥</span>}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
