import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

type Phase = "menu" | "play" | "dead";

interface Question {
  equation: string;
  correctAnswer: number;
  options: number[];
}

const MAX_SCORE = 25;
const GAME_DURATION = 30;

export function MathGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const [phase, setPhase] = useState<Phase>("menu");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [question, setQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const timerRef = useRef<number | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);

  const getDifficulty = useCallback((currentScore: number) => {
    if (currentScore < 8) return "easy";
    if (currentScore < 16) return "medium";
    return "hard";
  }, []);

  const generateQuestion = useCallback((currentScore: number): Question => {
    const difficulty = getDifficulty(currentScore);
    let num1: number, num2: number, operator: string, correctAnswer: number;

    if (difficulty === "easy") {
      // Single digit addition/subtraction
      num1 = Math.floor(Math.random() * 9) + 1;
      num2 = Math.floor(Math.random() * 9) + 1;
      operator = Math.random() > 0.5 ? "+" : "-";

      if (operator === "-" && num1 < num2) {
        [num1, num2] = [num2, num1]; // Keep positive results
      }

      correctAnswer = operator === "+" ? num1 + num2 : num1 - num2;
    } else if (difficulty === "medium") {
      // Double digit addition/subtraction
      num1 = Math.floor(Math.random() * 90) + 10;
      num2 = Math.floor(Math.random() * 90) + 10;
      operator = Math.random() > 0.5 ? "+" : "-";

      if (operator === "-" && num1 < num2) {
        [num1, num2] = [num2, num1];
      }

      correctAnswer = operator === "+" ? num1 + num2 : num1 - num2;
    } else {
      // Multiplication
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      operator = "×";
      correctAnswer = num1 * num2;
    }

    const equation = `${num1} ${operator} ${num2}`;

    // Generate wrong answers
    const wrongAnswers = new Set<number>();
    while (wrongAnswers.size < 3) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const wrongAnswer = correctAnswer + offset;
      if (wrongAnswer !== correctAnswer && wrongAnswer >= 0) {
        wrongAnswers.add(wrongAnswer);
      }
    }

    // Shuffle options
    const options = [correctAnswer, ...Array.from(wrongAnswers)];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return { equation, correctAnswer, options };
  }, [getDifficulty]);

  const startGame = useCallback(() => {
    setPhase("play");
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setQuestion(generateQuestion(0));
    setFeedback(null);
  }, [generateQuestion]);

  const handleAnswer = useCallback((answer: number) => {
    if (!question || feedback) return;

    const isCorrect = answer === question.correctAnswer;
    setFeedback(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      const newScore = Math.min(score + 1, MAX_SCORE);
      setScore(newScore);
      onScoreChange?.(newScore);
    }

    // Clear feedback and show next question
    if (feedbackTimeoutRef.current) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }

    feedbackTimeoutRef.current = window.setTimeout(() => {
      setFeedback(null);
      setQuestion(generateQuestion(isCorrect ? score + 1 : score));
    }, 400);
  }, [question, feedback, score, generateQuestion, onScoreChange]);

  // Timer logic
  useEffect(() => {
    if (phase === "play") {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setPhase("dead");
            const normalizedScore = score / MAX_SCORE;
            onGameEnd({
              score,
              maxScore: MAX_SCORE,
              normalizedScore,
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [phase, score, onGameEnd]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  if (phase === "menu") {
    return (
      <div className="w-full min-h-[400px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4 rounded-2xl relative">
        <button
          onClick={onExit}
          className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              Number Cruncher 3000
            </h1>
            <p className="text-xl text-purple-300">
              Speed-solve equations!
            </p>
            <div className="text-purple-400 space-y-1">
              <p>30 seconds to solve as many as you can</p>
              <p className="text-sm">Difficulty increases as you progress</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-xl font-bold shadow-lg shadow-purple-500/50 transition-all min-h-[44px]"
          >
            Start Game
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (phase === "play" && question) {
    return (
      <div className="w-full min-h-[400px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col p-4 rounded-2xl relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
            Score: {score}/{MAX_SCORE}
          </div>
          <div className="text-2xl font-bold text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">
            Time: {timeLeft}s
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          <motion.div
            key={question.equation}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-6xl md:text-8xl font-bold text-center transition-colors duration-300 ${
              feedback === "correct"
                ? "text-green-400 drop-shadow-[0_0_30px_rgba(74,222,128,0.9)]"
                : feedback === "wrong"
                ? "text-red-400 drop-shadow-[0_0_30px_rgba(248,113,113,0.9)]"
                : "text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
            }`}
          >
            {question.equation}
          </motion.div>

          {/* Answer Grid */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {question.options.map((option, index) => (
              <motion.button
                key={`${option}-${index}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(option)}
                disabled={feedback !== null}
                className={`min-h-[80px] text-3xl font-bold rounded-xl transition-all shadow-lg ${
                  feedback === "correct" && option === question.correctAnswer
                    ? "bg-green-500 text-white shadow-green-500/50"
                    : feedback === "wrong" && option === question.correctAnswer
                    ? "bg-green-500 text-white shadow-green-500/50"
                    : "bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-500/50"
                } disabled:cursor-not-allowed`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "dead") {
    return (
      <div className="w-full min-h-[400px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4 rounded-2xl relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6"
        >
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
            Time's Up!
          </h2>
          <div className="text-3xl text-purple-300">
            Final Score: <span className="text-cyan-400 font-bold">{score}</span>/{MAX_SCORE}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExit}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-xl font-bold shadow-lg shadow-purple-500/50 min-h-[44px]"
          >
            Exit
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return null;
}
