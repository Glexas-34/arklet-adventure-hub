import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { MiniGameProps, GameResult } from "./types";

const MAX_SCORE = 15;
const GAME_DURATION = 30000; // 30 seconds
const PATTERN_SHOW_TIME = 3000; // 3 seconds
const GRID_SIZE = 4;

type Phase = "menu" | "play" | "dead";
type CellColor = "red" | "blue" | "green" | "yellow" | "empty";

const COLORS: CellColor[] = ["red", "blue", "green", "yellow"];

const COLOR_CLASSES: Record<CellColor, string> = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  empty: "bg-gray-700/50",
};

function generatePattern(): CellColor[][] {
  const pattern: CellColor[][] = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    const row: CellColor[] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      // 70% chance of a colored cell, 30% empty
      if (Math.random() > 0.3) {
        row.push(COLORS[Math.floor(Math.random() * COLORS.length)]);
      } else {
        row.push("empty");
      }
    }
    pattern.push(row);
  }
  return pattern;
}

export function SpeedBuilderGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const [phase, setPhase] = useState<Phase>("menu");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [targetPattern, setTargetPattern] = useState<CellColor[][]>([]);
  const [playerPattern, setPlayerPattern] = useState<CellColor[][]>([]);
  const [showingPattern, setShowingPattern] = useState(false);
  const [wrongCells, setWrongCells] = useState<Set<string>>(new Set());

  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const patternTimerRef = useRef<NodeJS.Timeout | null>(null);

  const initializeEmptyGrid = useCallback((): CellColor[][] => {
    return Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill("empty"));
  }, []);

  const startNewPattern = useCallback(() => {
    const pattern = generatePattern();
    setTargetPattern(pattern);
    setPlayerPattern(initializeEmptyGrid());
    setShowingPattern(true);
    setWrongCells(new Set());

    // Hide pattern after 3 seconds
    patternTimerRef.current = setTimeout(() => {
      setShowingPattern(false);
    }, PATTERN_SHOW_TIME);
  }, [initializeEmptyGrid]);

  const startGame = useCallback(() => {
    setPhase("play");
    setScore(0);
    setTimeLeft(GAME_DURATION);
    onScoreChange?.(0);
    startNewPattern();

    // Game timer
    const startTime = Date.now();
    gameTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, GAME_DURATION - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        setPhase("dead");
      }
    }, 100);
  }, [onScoreChange, startNewPattern]);

  const endGame = useCallback(() => {
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (patternTimerRef.current) clearTimeout(patternTimerRef.current);

    const result: GameResult = {
      score,
      maxScore: MAX_SCORE,
      normalizedScore: score / MAX_SCORE,
    };
    onGameEnd(result);
  }, [score, onGameEnd]);

  useEffect(() => {
    if (phase === "dead") {
      endGame();
    }
  }, [phase, endGame]);

  useEffect(() => {
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (patternTimerRef.current) clearTimeout(patternTimerRef.current);
    };
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (showingPattern) return;

    setPlayerPattern((prev) => {
      const newPattern = prev.map((r) => [...r]);
      const currentColor = newPattern[row][col];
      const currentIndex = currentColor === "empty" ? -1 : COLORS.indexOf(currentColor);
      const nextIndex = (currentIndex + 1) % COLORS.length;
      newPattern[row][col] = COLORS[nextIndex];
      return newPattern;
    });
  };

  const checkPattern = () => {
    const wrong = new Set<string>();
    let isCorrect = true;

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (playerPattern[i][j] !== targetPattern[i][j]) {
          wrong.add(`${i}-${j}`);
          isCorrect = false;
        }
      }
    }

    if (isCorrect) {
      // Correct! Increase score and show new pattern
      const newScore = score + 1;
      setScore(newScore);
      onScoreChange?.(newScore);

      if (newScore >= MAX_SCORE) {
        setPhase("dead");
      } else {
        startNewPattern();
      }
    } else {
      // Wrong cells flash red
      setWrongCells(wrong);
      setTimeout(() => {
        setWrongCells(new Set());
      }, 500);
    }
  };

  // Menu Phase
  if (phase === "menu") {
    return (
      <div className="w-full min-h-[400px] rounded-2xl relative bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-8">
        <button
          onClick={onExit}
          className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center space-y-6">
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-bold text-white"
          >
            Speed Builder
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90"
          >
            Memorize &amp; recreate patterns!
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3 text-white/80 text-sm"
          >
            <p>🧠 Memorize the 4x4 color pattern</p>
            <p>🎨 Click cells to cycle through colors</p>
            <p>✅ Submit to check your answer</p>
            <p>⏱️ Complete as many as you can in 30 seconds!</p>
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="min-h-[44px] px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            Start Game
          </motion.button>
        </div>
      </div>
    );
  }

  // Play Phase
  if (phase === "play") {
    return (
      <div className="w-full min-h-[400px] rounded-2xl relative bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-6 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-white">
            <div className="text-2xl font-bold">Score: {score}</div>
            <div className="text-sm text-white/70">Goal: {MAX_SCORE}</div>
          </div>
          <div className="text-white text-right">
            <div className="text-2xl font-bold">{(timeLeft / 1000).toFixed(1)}s</div>
            <div className="text-sm text-white/70">Time Left</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-white/20 rounded-full mb-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
            initial={{ width: "100%" }}
            animate={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Game Area */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          {showingPattern && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-yellow-300 text-lg font-semibold"
            >
              Memorize this pattern!
            </motion.div>
          )}

          {!showingPattern && (
            <div className="text-white/70 text-sm">
              Click cells to match the pattern
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-4 gap-2">
            {(showingPattern ? targetPattern : playerPattern).map((row, i) =>
              row.map((color, j) => {
                const isWrong = wrongCells.has(`${i}-${j}`);
                return (
                  <motion.button
                    key={`${i}-${j}`}
                    onClick={() => handleCellClick(i, j)}
                    disabled={showingPattern}
                    className={`w-16 h-16 rounded-lg ${COLOR_CLASSES[color]} ${
                      showingPattern ? "cursor-default" : "cursor-pointer hover:opacity-80"
                    } transition-all ${isWrong ? "ring-4 ring-red-500" : ""}`}
                    whileTap={showingPattern ? {} : { scale: 0.9 }}
                    animate={isWrong ? { scale: [1, 1.1, 1] } : {}}
                  />
                );
              })
            )}
          </div>

          {/* Submit Button */}
          {!showingPattern && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={checkPattern}
              className="min-h-[44px] px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              Submit Pattern
            </motion.button>
          )}
        </div>
      </div>
    );
  }

  // Dead phase - handled by useEffect
  return null;
}
