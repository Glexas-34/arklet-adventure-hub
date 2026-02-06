import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";
import { useSound } from "@/hooks/useSound";

const GRID_SIZE = 9;
const MAX_LEVEL = 10;
const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#eab308"];

export function PatternMemory({ onGameEnd, onExit }: MiniGameProps) {
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [phase, setPhase] = useState<"showing" | "input" | "done">("showing");
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [showingIndex, setShowingIndex] = useState(-1);
  const [failed, setFailed] = useState(false);
  const { playCorrect, playWrong, playTick } = useSound();
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const generateSequence = useCallback((len: number) => {
    const seq: number[] = [];
    for (let i = 0; i < len; i++) {
      seq.push(Math.floor(Math.random() * GRID_SIZE));
    }
    return seq;
  }, []);

  const showSequence = useCallback((seq: number[]) => {
    setPhase("showing");
    setShowingIndex(-1);

    // Clear any existing timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    seq.forEach((cell, i) => {
      const t1 = setTimeout(() => {
        setActiveCell(cell);
        setShowingIndex(i);
        playTick();
      }, (i + 1) * 600);
      const t2 = setTimeout(() => {
        setActiveCell(null);
      }, (i + 1) * 600 + 400);
      timeoutsRef.current.push(t1, t2);
    });

    const t3 = setTimeout(() => {
      setPhase("input");
      setPlayerInput([]);
    }, (seq.length + 1) * 600);
    timeoutsRef.current.push(t3);
  }, [playTick]);

  useEffect(() => {
    const seq = generateSequence(level + 2);
    setSequence(seq);
    showSequence(seq);
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, [level]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCellClick = useCallback((cell: number) => {
    if (phase !== "input") return;

    const expected = sequence[playerInput.length];
    const newInput = [...playerInput, cell];
    setPlayerInput(newInput);

    if (cell !== expected) {
      setFailed(true);
      playWrong();
      setPhase("done");
      const reachedLevel = level - 1;
      onGameEnd({
        score: reachedLevel,
        maxScore: MAX_LEVEL,
        normalizedScore: Math.min(1, reachedLevel / MAX_LEVEL),
      });
      return;
    }

    playCorrect();
    setActiveCell(cell);
    setTimeout(() => setActiveCell(null), 200);

    if (newInput.length === sequence.length) {
      if (level >= MAX_LEVEL) {
        setPhase("done");
        onGameEnd({
          score: MAX_LEVEL,
          maxScore: MAX_LEVEL,
          normalizedScore: 1,
        });
        return;
      }
      setTimeout(() => setLevel((l) => l + 1), 500);
    }
  }, [phase, sequence, playerInput, level, playCorrect, playWrong, onGameEnd]);

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
          className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ArrowLeft size={20} />
        </motion.button>
        <h3 className="text-xl font-bold text-foreground">🧠 Pattern Memory</h3>
        <span className="ml-auto text-sm text-muted-foreground font-bold">
          Level {level}/{MAX_LEVEL}
        </span>
      </div>

      <div className="bg-card rounded-3xl p-4">
        <p className="text-center text-sm text-muted-foreground mb-3">
          {phase === "showing" ? "Watch the pattern..." : phase === "input" ? "Repeat the pattern!" : failed ? "Game Over!" : "Perfect! 🎉"}
        </p>

        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: GRID_SIZE }, (_, i) => (
            <motion.button
              key={i}
              whileTap={phase === "input" ? { scale: 0.85 } : undefined}
              onClick={() => handleCellClick(i)}
              disabled={phase !== "input"}
              className={`aspect-square rounded-2xl transition-all min-h-[70px] border-2 ${
                activeCell === i
                  ? "bg-cyan-500 border-cyan-400 shadow-lg shadow-cyan-500/50"
                  : "bg-black/30 border-white/10 hover:bg-black/40"
              }`}
            />
          ))}
        </div>

        <div className="mt-3 flex justify-center gap-1">
          {sequence.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < playerInput.length ? "bg-green-400" :
                i === playerInput.length && phase === "input" ? "bg-cyan-400 animate-pulse" :
                "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
