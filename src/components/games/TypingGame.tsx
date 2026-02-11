import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

const WORDS = [
  // Short words (3-4 letters)
  "cat", "dog", "hat", "run", "jump", "star", "moon", "fire", "ice", "wind",
  // Medium words (5-7 letters)
  "house", "rocket", "galaxy", "thunder", "wizard", "dragon", "castle", "forest", "ocean", "pirate",
  "ninja", "zombie", "mystic", "shadow", "knight", "crystal", "phoenix", "hunter", "magic", "storm",
  // Longer words (8+ letters)
  "adventure", "rainbow", "mountain", "universe", "champion", "legendary", "mysterious", "explosive",
  "spectacular", "incredible", "magnificent", "extraordinary"
];

const MAX_SCORE = 30;
const GAME_DURATION = 30; // seconds

type GamePhase = "menu" | "play" | "dead";

export function TypingGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [currentWord, setCurrentWord] = useState("");
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Get word based on current score (progressive difficulty)
  const getNextWord = useCallback(() => {
    if (score < 10) {
      // Easy: short words
      const easyWords = WORDS.slice(0, 10);
      return easyWords[Math.floor(Math.random() * easyWords.length)];
    } else if (score < 20) {
      // Medium: medium words
      const mediumWords = WORDS.slice(10, 30);
      return mediumWords[Math.floor(Math.random() * mediumWords.length)];
    } else {
      // Hard: longer words
      const hardWords = WORDS.slice(30);
      return hardWords[Math.floor(Math.random() * hardWords.length)];
    }
  }, [score]);

  // Start game
  const startGame = () => {
    setPhase("play");
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setInput("");
    setCurrentWord(WORDS[Math.floor(Math.random() * 10)]); // Start with easy word
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Timer countdown
  useEffect(() => {
    if (phase !== "play") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  // End game
  const endGame = () => {
    setPhase("dead");
    const normalizedScore = Math.min(score / MAX_SCORE, 1);
    onGameEnd({
      score,
      maxScore: MAX_SCORE,
      normalizedScore,
    });
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    // Check if word is completed correctly
    if (value === currentWord) {
      const newScore = score + 1;
      setScore(newScore);
      onScoreChange?.(newScore);
      setInput("");
      setCurrentWord(getNextWord());
    }
  };

  // Render letter with correct/incorrect styling
  const renderWord = () => {
    return currentWord.split("").map((letter, index) => {
      let colorClass = "text-gray-400";
      if (index < input.length) {
        if (input[index] === letter) {
          colorClass = "text-green-400";
        } else {
          colorClass = "text-red-400";
        }
      }
      return (
        <span key={index} className={`${colorClass} transition-colors duration-150`}>
          {letter}
        </span>
      );
    });
  };

  // Menu phase
  if (phase === "menu") {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-500 rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Back button */}
        <button
          onClick={onExit}
          className="absolute top-4 left-4 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors z-10"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        {/* Menu content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center z-10 px-8"
        >
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4">
            Keyboard Smash Champions
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">
            Type the words as fast as you can! Words get longer as you progress. You have 30 seconds to prove your typing mastery!
          </p>
          <motion.button
            onClick={startGame}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Game
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Play phase
  if (phase === "play") {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 flex flex-col items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 1 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Score */}
        <div className="absolute top-6 left-6 text-left z-10">
          <div className="text-sm text-gray-400 uppercase tracking-wider">Score</div>
          <div className="text-4xl font-bold text-cyan-400">{score}</div>
        </div>

        {/* Timer */}
        <div className="absolute top-6 right-6 text-right z-10">
          <div className="text-sm text-gray-400 uppercase tracking-wider">Time</div>
          <div className={`text-4xl font-bold ${timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-cyan-400"}`}>
            {timeLeft}s
          </div>
        </div>

        {/* Game content */}
        <div className="z-10 flex flex-col items-center justify-center space-y-8 px-8">
          {/* Current word */}
          <motion.div
            key={currentWord}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-7xl font-bold tracking-wider mb-8"
            style={{
              textShadow: "0 0 20px rgba(34, 211, 238, 0.5)",
            }}
          >
            {renderWord()}
          </motion.div>

          {/* Input field */}
          <div className="relative w-full max-w-md">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-gray-800/50 border-2 border-cyan-500/50 rounded-lg text-white text-2xl text-center focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all"
              placeholder="Type here..."
              autoComplete="off"
              spellCheck={false}
            />
            <motion.div
              className="absolute inset-0 rounded-lg border-2 border-cyan-400 opacity-0 pointer-events-none"
              animate={{
                opacity: input === currentWord ? [0, 1, 0] : 0,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Progress indicator */}
          <div className="text-sm text-gray-400">
            {score < 10 && "Easy Mode"}
            {score >= 10 && score < 20 && "Medium Mode"}
            {score >= 20 && "Hard Mode"}
          </div>
        </div>
      </div>
    );
  }

  // Dead phase
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-red-500 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 0, 1],
              opacity: [0.2, 0, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Game over content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center z-10 px-8"
      >
        <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-6">
          Time's Up!
        </h2>
        <div className="text-4xl text-white mb-4">
          Final Score: <span className="text-cyan-400 font-bold">{score}</span>
        </div>
        <div className="text-xl text-gray-300 mb-8">
          {score >= 25 && "Legendary typing speed!"}
          {score >= 20 && score < 25 && "Amazing performance!"}
          {score >= 15 && score < 20 && "Great job!"}
          {score >= 10 && score < 15 && "Good effort!"}
          {score < 10 && "Keep practicing!"}
        </div>
        <div className="flex gap-4 justify-center">
          <motion.button
            onClick={startGame}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-lg font-bold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Play Again
          </motion.button>
          <motion.button
            onClick={onExit}
            className="px-6 py-3 bg-gray-700 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-gray-600 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Exit
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
