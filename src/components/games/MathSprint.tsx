import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";
import { useSound } from "@/hooks/useSound";

function generateProblem(): { question: string; answer: number } {
  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;

  switch (op) {
    case "+":
      a = Math.floor(Math.random() * 50) + 1;
      b = Math.floor(Math.random() * 50) + 1;
      answer = a + b;
      break;
    case "-":
      a = Math.floor(Math.random() * 50) + 10;
      b = Math.floor(Math.random() * a);
      answer = a - b;
      break;
    case "×":
      a = Math.floor(Math.random() * 12) + 1;
      b = Math.floor(Math.random() * 12) + 1;
      answer = a * b;
      break;
    default:
      a = 1; b = 1; answer = 2;
  }

  return { question: `${a} ${op} ${b}`, answer };
}

export function MathSprint({ onGameEnd, onExit }: MiniGameProps) {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [problem, setProblem] = useState(generateProblem);
  const [input, setInput] = useState("");
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { playCorrect, playWrong, playTick } = useSound();
  const MAX_SCORE = 20;

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
      onGameEnd({
        score: correct,
        maxScore: MAX_SCORE,
        normalizedScore: Math.min(1, correct / MAX_SCORE),
      });
    }
  }, [timeLeft, started, correct, onGameEnd]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!started || timeLeft <= 0) return;

      const num = parseInt(input);
      setTotal((t) => t + 1);

      if (num === problem.answer) {
        setCorrect((c) => c + 1);
        setStreak((s) => s + 1);
        setFeedback("correct");
        playCorrect();
      } else {
        setStreak(0);
        setFeedback("wrong");
        playWrong();
      }

      setInput("");
      setProblem(generateProblem());
      setTimeout(() => setFeedback(null), 400);
    },
    [input, problem, started, timeLeft, playCorrect, playWrong]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  const startGame = () => {
    setStarted(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  if (!started) {
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="flex items-center gap-3 mb-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
            className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft size={20} />
          </motion.button>
          <h3 className="text-xl font-bold text-foreground">🧮 Math Sprint</h3>
        </div>
        <p className="text-muted-foreground mb-6">Solve as many math problems as you can in 30 seconds!</p>
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
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
          className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ArrowLeft size={20} />
        </motion.button>
        <h3 className="text-xl font-bold text-foreground">🧮 Math Sprint</h3>
        <span className={`ml-auto text-lg font-bold ${timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-foreground"}`}>
          {timeLeft}s
        </span>
      </div>

      <div className="bg-card rounded-3xl p-6 md:p-8 text-center">
        <div className="flex justify-between mb-4 text-sm">
          <span className="text-green-400 font-bold">✓ {correct}</span>
          {streak >= 3 && <span className="text-orange-400 font-bold">🔥 {streak} streak!</span>}
          <span className="text-muted-foreground">Total: {total}</span>
        </div>

        <motion.div
          key={problem.question}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-4xl md:text-5xl font-bold mb-6 ${
            feedback === "correct" ? "text-green-400" :
            feedback === "wrong" ? "text-red-400" :
            "text-foreground"
          }`}
        >
          {problem.question} = ?
        </motion.div>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            disabled={timeLeft <= 0}
            className="w-full text-center text-3xl font-bold bg-black/30 rounded-xl px-4 py-3
                       text-foreground outline-none focus:ring-2 focus:ring-cyan-400
                       [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="?"
          />
        </form>
      </div>
    </div>
  );
}
