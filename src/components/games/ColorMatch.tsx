import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";
import { useSound } from "@/hooks/useSound";

const COLORS = [
  { name: "Red", hex: "#ef4444" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Green", hex: "#22c55e" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Orange", hex: "#f97316" },
];

function generateRound() {
  const word = COLORS[Math.floor(Math.random() * COLORS.length)];
  const display = COLORS[Math.floor(Math.random() * COLORS.length)];
  const correctAnswer = display.name;
  const options = [correctAnswer];

  while (options.length < 3) {
    const c = COLORS[Math.floor(Math.random() * COLORS.length)].name;
    if (!options.includes(c)) options.push(c);
  }

  // Shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return { wordText: word.name, displayColor: display.hex, correctAnswer, options };
}

export function ColorMatch({ onGameEnd, onExit }: MiniGameProps) {
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [current, setCurrent] = useState(generateRound);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const { playCorrect, playWrong } = useSound();
  const TOTAL = 20;

  const handleAnswer = useCallback((answer: string) => {
    const isCorrect = answer === current.correctAnswer;
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setFeedback("correct");
      playCorrect();
    } else {
      setFeedback("wrong");
      playWrong();
    }

    const nextRound = round + 1;
    setRound(nextRound);

    if (nextRound >= TOTAL) {
      const finalCorrect = correct + (isCorrect ? 1 : 0);
      onGameEnd({
        score: finalCorrect,
        maxScore: TOTAL,
        normalizedScore: finalCorrect / TOTAL,
      });
      return;
    }

    setTimeout(() => {
      setCurrent(generateRound());
      setFeedback(null);
    }, 300);
  }, [current, round, correct, onGameEnd, playCorrect, playWrong]);

  if (!started) {
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="flex items-center gap-3 mb-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
            className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft size={20} />
          </motion.button>
          <h3 className="text-xl font-bold text-foreground">🎨 Color Match</h3>
        </div>
        <p className="text-muted-foreground mb-2">
          What COLOR is the text displayed in?
        </p>
        <p className="text-muted-foreground mb-6 text-sm">
          Ignore the word — pick the ink color!
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setStarted(true)}
          className="gradient-button text-primary-foreground font-bold px-8 py-4 rounded-xl text-xl"
        >
          Start!
        </motion.button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
          className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ArrowLeft size={20} />
        </motion.button>
        <h3 className="text-xl font-bold text-foreground">🎨 Color Match</h3>
        <span className="ml-auto text-sm text-muted-foreground font-bold">
          {round}/{TOTAL}
        </span>
      </div>

      <div className="bg-card rounded-3xl p-6 md:p-8 text-center">
        <p className="text-sm text-muted-foreground mb-2">What COLOR is this text?</p>

        <motion.div
          key={round}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400 }}
          className="text-5xl md:text-6xl font-bold mb-8"
          style={{ color: current.displayColor }}
        >
          {current.wordText}
        </motion.div>

        <div className="grid grid-cols-3 gap-3">
          {current.options.map((opt) => (
            <motion.button
              key={opt}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAnswer(opt)}
              disabled={feedback !== null}
              className={`py-4 px-3 rounded-xl font-bold text-lg transition-all min-h-[48px]
                ${feedback === null
                  ? "bg-black/30 text-foreground hover:bg-black/50"
                  : opt === current.correctAnswer
                    ? "bg-green-600/50 text-green-200"
                    : "bg-black/30 text-foreground/50"
                }`}
            >
              {opt}
            </motion.button>
          ))}
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          ✓ {correct} correct
        </div>
      </div>
    </div>
  );
}
