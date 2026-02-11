import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

const COLORS = [
  { name: "RED", hex: "#ef4444" },
  { name: "BLUE", hex: "#3b82f6" },
  { name: "GREEN", hex: "#22c55e" },
  { name: "YELLOW", hex: "#eab308" },
];

const MAX_SCORE = 30;
const INITIAL_TIME_PER_ROUND = 2500;
const MIN_TIME_PER_ROUND = 800;

type Phase = "menu" | "play" | "dead";

export function ColorMatchGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const [phase, setPhase] = useState<Phase>("menu");
  const [score, setScore] = useState(0);
  const [wordText, setWordText] = useState("");
  const [displayColor, setDisplayColor] = useState("");
  const [correctColor, setCorrectColor] = useState("");
  const [timeLeft, setTimeLeft] = useState(100);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const roundTimerRef = useRef<NodeJS.Timeout | null>(null);

  const getTimePerRound = useCallback((currentScore: number) => {
    const timeReduction = (currentScore / MAX_SCORE) * (INITIAL_TIME_PER_ROUND - MIN_TIME_PER_ROUND);
    return INITIAL_TIME_PER_ROUND - timeReduction;
  }, []);

  const generateRound = useCallback(() => {
    const wordIndex = Math.floor(Math.random() * COLORS.length);
    let colorIndex = Math.floor(Math.random() * COLORS.length);

    // Ensure the display color is different from the word
    while (colorIndex === wordIndex) {
      colorIndex = Math.floor(Math.random() * COLORS.length);
    }

    setWordText(COLORS[wordIndex].name);
    setDisplayColor(COLORS[colorIndex].hex);
    setCorrectColor(COLORS[colorIndex].hex);
    setTimeLeft(100);
  }, []);

  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (roundTimerRef.current) clearTimeout(roundTimerRef.current);

    setPhase("dead");

    const normalizedScore = Math.min(score / MAX_SCORE, 1);
    onGameEnd({
      score,
      maxScore: MAX_SCORE,
      normalizedScore,
    });
  }, [score, onGameEnd]);

  const handleColorChoice = useCallback((chosenHex: string) => {
    if (phase !== "play") return;

    if (chosenHex === correctColor) {
      const newScore = score + 1;
      setScore(newScore);
      onScoreChange?.(newScore);

      if (newScore >= MAX_SCORE) {
        endGame();
      } else {
        generateRound();
      }
    } else {
      endGame();
    }
  }, [phase, correctColor, score, onScoreChange, endGame, generateRound]);

  const startGame = useCallback(() => {
    setPhase("play");
    setScore(0);
    setTimeLeft(100);
    generateRound();
  }, [generateRound]);

  useEffect(() => {
    if (phase === "play") {
      const timePerRound = getTimePerRound(score);
      const tickInterval = timePerRound / 100;

      if (timerRef.current) clearInterval(timerRef.current);
      if (roundTimerRef.current) clearTimeout(roundTimerRef.current);

      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            return prev;
          }
          return prev - 1;
        });
      }, tickInterval);

      roundTimerRef.current = setTimeout(() => {
        endGame();
      }, timePerRound);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (roundTimerRef.current) clearTimeout(roundTimerRef.current);
      };
    }
  }, [phase, score, getTimePerRound, endGame]);

  if (phase === "menu") {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex flex-col items-center justify-center p-6">
        <button
          onClick={onExit}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Brain Melt Rainbow
          </h1>

          <div className="space-y-4 mb-8">
            <p className="text-xl text-white/90">
              Match the colors, not the words!
            </p>
            <p className="text-lg text-white/70 max-w-md mx-auto">
              Tap the button that matches the COLOR of the text, not what the word says!
            </p>
          </div>

          <div className="flex gap-3 justify-center mb-8">
            {COLORS.map((color) => (
              <div
                key={color.name}
                className="w-12 h-12 rounded-full"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-12 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl font-bold rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            Start Game
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (phase === "dead") {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Game Over!
          </h1>

          <div className="text-7xl font-bold text-red-400 mb-4">
            {score}
          </div>

          <p className="text-2xl text-white/80">
            {score >= MAX_SCORE ? "Perfect Score!" : `Out of ${MAX_SCORE}`}
          </p>

          <div className="flex gap-4 justify-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl font-bold rounded-full shadow-lg"
            >
              Play Again
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExit}
              className="px-8 py-3 bg-white/10 text-white text-xl font-bold rounded-full shadow-lg"
            >
              Exit
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 flex flex-col items-center justify-between p-6">
      <div className="w-full flex justify-between items-center">
        <button
          onClick={onExit}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <div className="text-3xl font-bold text-white">
          Score: {score}
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-blue-400"
            initial={{ width: "100%" }}
            animate={{ width: `${timeLeft}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      <motion.div
        key={wordText + displayColor}
        initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        className="flex-1 flex items-center justify-center"
      >
        <div
          className="text-8xl md:text-9xl font-black tracking-wider"
          style={{ color: displayColor }}
        >
          {wordText}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md pb-8">
        {COLORS.map((color) => (
          <motion.button
            key={color.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleColorChoice(color.hex)}
            className="aspect-square rounded-3xl shadow-2xl font-bold text-white text-2xl flex items-center justify-center border-4 border-white/20"
            style={{ backgroundColor: color.hex }}
          >
            {color.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
}