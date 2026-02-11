import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

const MAX_SCORE = 15;
const SEQUENCE_DELAY = 600; // ms per step
const SEQUENCE_GAP = 300; // ms between steps

type GamePhase = "menu" | "play" | "dead";
type Color = "red" | "blue" | "green" | "yellow";

const COLORS: Record<Color, { normal: string; bright: string; glow: string }> = {
  red: { normal: "#ef4444", bright: "#fca5a5", glow: "rgba(239, 68, 68, 0.6)" },
  blue: { normal: "#3b82f6", bright: "#93c5fd", glow: "rgba(59, 130, 246, 0.6)" },
  green: { normal: "#22c55e", bright: "#86efac", glow: "rgba(34, 197, 94, 0.6)" },
  yellow: { normal: "#eab308", bright: "#fde047", glow: "rgba(234, 179, 8, 0.6)" },
};

const COLOR_ORDER: Color[] = ["red", "blue", "green", "yellow"];

export function PatternGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [sequence, setSequence] = useState<Color[]>([]);
  const [playerSequence, setPlayerSequence] = useState<Color[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeColor, setActiveColor] = useState<Color | null>(null);
  const [round, setRound] = useState(0);
  const [message, setMessage] = useState("");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const addToSequence = useCallback(() => {
    const randomColor = COLOR_ORDER[Math.floor(Math.random() * COLOR_ORDER.length)];
    setSequence((prev) => [...prev, randomColor]);
  }, []);

  const playSequence = useCallback((seq: Color[]) => {
    setIsShowingSequence(true);
    setPlayerSequence([]);
    setMessage("Watch...");

    let index = 0;
    const showNext = () => {
      if (index >= seq.length) {
        timeoutRef.current = setTimeout(() => {
          setActiveColor(null);
          setIsShowingSequence(false);
          setMessage(`Your turn! (${round + 1}/${MAX_SCORE})`);
        }, SEQUENCE_GAP);
        return;
      }

      setActiveColor(seq[index]);
      timeoutRef.current = setTimeout(() => {
        setActiveColor(null);
        index++;
        timeoutRef.current = setTimeout(showNext, SEQUENCE_GAP);
      }, SEQUENCE_DELAY);
    };

    showNext();
  }, [round]);

  const startGame = () => {
    setPhase("play");
    setRound(1);
    setSequence([]);
    setPlayerSequence([]);
    const firstColor = COLOR_ORDER[Math.floor(Math.random() * COLOR_ORDER.length)];
    const initialSequence = [firstColor];
    setSequence(initialSequence);
    onScoreChange?.(0);

    // Small delay before showing first sequence
    timeoutRef.current = setTimeout(() => {
      playSequence(initialSequence);
    }, 500);
  };

  const handleColorClick = useCallback((color: Color) => {
    if (isShowingSequence || phase !== "play") return;

    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    // Flash the button
    setActiveColor(color);
    timeoutRef.current = setTimeout(() => {
      setActiveColor(null);
    }, 200);

    // Check if correct
    const currentIndex = newPlayerSequence.length - 1;
    if (sequence[currentIndex] !== color) {
      // Wrong! Game over
      cleanup();
      setPhase("dead");
      setMessage("Wrong sequence!");
      onScoreChange?.(round);
      onGameEnd({
        score: round,
        maxScore: MAX_SCORE,
        normalizedScore: round / MAX_SCORE,
      });
      return;
    }

    // Check if sequence is complete
    if (newPlayerSequence.length === sequence.length) {
      // Correct! Next round
      const nextRound = round + 1;
      setRound(nextRound);
      onScoreChange?.(round);

      if (nextRound > MAX_SCORE) {
        // Won the game!
        cleanup();
        setPhase("dead");
        setMessage("Perfect! You won!");
        onGameEnd({
          score: MAX_SCORE,
          maxScore: MAX_SCORE,
          normalizedScore: 1,
        });
        return;
      }

      // Add to sequence and replay
      const newSequence = [...sequence, COLOR_ORDER[Math.floor(Math.random() * COLOR_ORDER.length)]];
      setSequence(newSequence);
      setPlayerSequence([]);

      timeoutRef.current = setTimeout(() => {
        playSequence(newSequence);
      }, 800);
    }
  }, [isShowingSequence, phase, playerSequence, sequence, round, playSequence, cleanup, onScoreChange, onGameEnd]);

  return (
    <div className="w-full min-h-[400px] bg-slate-950 flex flex-col rounded-2xl relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur">
        <button
          onClick={onExit}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">Simon Says HARDER</h1>
        <div className="w-10" />
      </div>

      <AnimatePresence mode="wait">
        {phase === "menu" && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-8 p-8"
          >
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Simon Says HARDER</h2>
              <p className="text-lg text-slate-300">Remember the sequence!</p>
              <p className="text-sm text-slate-400 mt-2">
                Watch the pattern, then tap the colors in order.
              </p>
              <p className="text-sm text-slate-400">
                Can you reach round {MAX_SCORE}?
              </p>
            </div>

            <motion.button
              onClick={startGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-xl shadow-lg"
            >
              Start Game
            </motion.button>
          </motion.div>
        )}

        {phase === "play" && (
          <motion.div
            key="play"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-4 gap-8"
          >
            {/* Status Message */}
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{message}</p>
              {!isShowingSequence && (
                <p className="text-sm text-slate-400 mt-2">
                  Step {playerSequence.length + 1} of {sequence.length}
                </p>
              )}
            </div>

            {/* Game Grid */}
            <div className="grid grid-cols-2 gap-4 max-w-md w-full">
              {COLOR_ORDER.map((color) => {
                const isActive = activeColor === color;
                const colorConfig = COLORS[color];

                return (
                  <motion.button
                    key={color}
                    onClick={() => handleColorClick(color)}
                    disabled={isShowingSequence}
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      boxShadow: isActive
                        ? `0 0 40px ${colorConfig.glow}`
                        : "0 4px 6px rgba(0, 0, 0, 0.3)",
                    }}
                    transition={{ duration: 0.1 }}
                    style={{
                      backgroundColor: isActive ? colorConfig.bright : colorConfig.normal,
                    }}
                    className="aspect-square rounded-2xl min-h-[120px] min-w-[120px] sm:min-h-[140px] sm:min-w-[140px] disabled:opacity-70 active:scale-95 transition-all"
                  />
                );
              })}
            </div>

            {/* Round Counter */}
            <div className="text-center">
              <p className="text-lg text-slate-300">
                Round <span className="font-bold text-white">{round}</span> / {MAX_SCORE}
              </p>
            </div>
          </motion.div>
        )}

        {phase === "dead" && (
          <motion.div
            key="dead"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-8 p-8"
          >
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
              <p className="text-2xl text-slate-300 mb-2">{message}</p>
              <p className="text-xl text-slate-400">
                Rounds completed: <span className="font-bold text-white">{round}</span>
              </p>
            </div>

            <div className="flex gap-4">
              <motion.button
                onClick={startGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold rounded-xl shadow-lg"
              >
                Play Again
              </motion.button>
              <motion.button
                onClick={onExit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-slate-700 text-white text-lg font-bold rounded-xl shadow-lg"
              >
                Exit
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
