import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";
import { useSound } from "@/hooks/useSound";

type Phase = "waiting" | "ready" | "go" | "clicked" | "done";

export function ReactionTime({ onGameEnd, onExit }: MiniGameProps) {
  const [phase, setPhase] = useState<Phase>("waiting");
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [tooEarly, setTooEarly] = useState(false);
  const goTime = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const { playCorrect, playWrong, playTick } = useSound();
  const TOTAL_ROUNDS = 10;

  const startRound = useCallback(() => {
    setPhase("ready");
    setTooEarly(false);
    playTick();
    const delay = 1500 + Math.random() * 3000;
    timerRef.current = setTimeout(() => {
      goTime.current = performance.now();
      setPhase("go");
    }, delay);
  }, [playTick]);

  const handleClick = () => {
    if (phase === "waiting") {
      startRound();
      return;
    }

    if (phase === "ready") {
      clearTimeout(timerRef.current);
      setTooEarly(true);
      setPhase("waiting");
      playWrong();
      return;
    }

    if (phase === "go") {
      const reaction = Math.round(performance.now() - goTime.current);
      setCurrentTime(reaction);
      setTimes((prev) => [...prev, reaction]);
      playCorrect();

      const nextRound = round + 1;
      setRound(nextRound);

      if (nextRound >= TOTAL_ROUNDS) {
        setPhase("done");
        const allTimes = [...times, reaction];
        const avg = allTimes.reduce((a, b) => a + b, 0) / allTimes.length;
        // Score: faster = better. 200ms = perfect(1.0), 600ms+ = 0
        const normalized = Math.max(0, Math.min(1, (600 - avg) / 400));
        onGameEnd({
          score: Math.round(avg),
          maxScore: 200,
          normalizedScore: normalized,
        });
      } else {
        setPhase("clicked");
        setTimeout(() => setPhase("waiting"), 1000);
      }
    }
  };

  const getColor = () => {
    if (phase === "ready") return "bg-red-600";
    if (phase === "go") return "bg-green-500";
    return "bg-card";
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onExit}
          className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </motion.button>
        <h3 className="text-xl font-bold text-foreground">🎯 Reaction Time</h3>
        <span className="ml-auto text-sm text-muted-foreground font-bold">
          {round}/{TOTAL_ROUNDS}
        </span>
      </div>

      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className={`${getColor()} rounded-3xl p-8 md:p-16 text-center cursor-pointer select-none
                   transition-colors duration-200 min-h-[250px] flex flex-col items-center justify-center`}
      >
        {phase === "waiting" && !tooEarly && (
          <>
            <p className="text-4xl mb-4">🎯</p>
            <p className="text-xl font-bold text-foreground">
              {round === 0 ? "Tap to start!" : `${currentTime}ms — Tap for next round`}
            </p>
          </>
        )}
        {phase === "waiting" && tooEarly && (
          <>
            <p className="text-4xl mb-4">😬</p>
            <p className="text-xl font-bold text-red-400">Too early! Tap to retry</p>
          </>
        )}
        {phase === "ready" && (
          <>
            <p className="text-4xl mb-4">🔴</p>
            <p className="text-xl font-bold text-white">Wait for green...</p>
          </>
        )}
        {phase === "go" && (
          <>
            <p className="text-4xl mb-4">🟢</p>
            <p className="text-xl font-bold text-white">TAP NOW!</p>
          </>
        )}
        {phase === "clicked" && (
          <>
            <p className="text-4xl mb-4">⚡</p>
            <p className="text-xl font-bold text-foreground">{currentTime}ms</p>
          </>
        )}
        {phase === "done" && (
          <>
            <p className="text-4xl mb-4">🏆</p>
            <p className="text-xl font-bold text-foreground">
              Average: {Math.round(times.reduce((a, b) => a + b, 0) / times.length)}ms
            </p>
            <p className="text-sm text-muted-foreground mt-2">Reward incoming...</p>
          </>
        )}
      </motion.div>

      {times.length > 0 && phase !== "done" && (
        <div className="mt-4 flex gap-2 flex-wrap">
          {times.map((t, i) => (
            <span
              key={i}
              className={`text-xs px-2 py-1 rounded-full font-bold ${
                t < 250 ? "bg-green-600/30 text-green-400" :
                t < 400 ? "bg-yellow-600/30 text-yellow-400" :
                "bg-red-600/30 text-red-400"
              }`}
            >
              {t}ms
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
