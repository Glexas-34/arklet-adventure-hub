import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { MiniGameProps, GameResult } from "./types";

const MAX_SCORE = 100;
const GAME_DURATION = 30;
const GRID_ROWS = 5;
const GRID_COLS = 4;

type BlockType = "dirt" | "stone" | "iron" | "gold" | "diamond";

interface BlockData {
  id: string;
  type: BlockType;
  maxHealth: number;
  currentHealth: number;
  emoji: string;
  points: number;
  color: string;
}

const BLOCK_CONFIGS: Record<BlockType, { maxHealth: number; emoji: string; points: number; color: string; weight: number }> = {
  dirt: { maxHealth: 2, emoji: "🟫", points: 1, color: "bg-amber-700", weight: 40 },
  stone: { maxHealth: 4, emoji: "⬜", points: 2, color: "bg-gray-400", weight: 30 },
  iron: { maxHealth: 6, emoji: "🔲", points: 3, color: "bg-gray-300", weight: 15 },
  gold: { maxHealth: 8, emoji: "🟨", points: 5, color: "bg-yellow-400", weight: 10 },
  diamond: { maxHealth: 10, emoji: "💎", points: 10, color: "bg-cyan-400", weight: 5 },
};

function getRandomBlockType(): BlockType {
  const totalWeight = Object.values(BLOCK_CONFIGS).reduce((sum, config) => sum + config.weight, 0);
  let random = Math.random() * totalWeight;

  for (const [type, config] of Object.entries(BLOCK_CONFIGS)) {
    random -= config.weight;
    if (random <= 0) {
      return type as BlockType;
    }
  }

  return "dirt";
}

function createBlock(): BlockData {
  const type = getRandomBlockType();
  const config = BLOCK_CONFIGS[type];

  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    maxHealth: config.maxHealth,
    currentHealth: config.maxHealth,
    emoji: config.emoji,
    points: config.points,
    color: config.color,
  };
}

export function MineClickerGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const [phase, setPhase] = useState<"menu" | "play" | "dead">("menu");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [blocks, setBlocks] = useState<BlockData[][]>([]);
  const [floatingPoints, setFloatingPoints] = useState<{ id: string; points: number; x: number; y: number }[]>([]);

  // Initialize grid
  const initializeGrid = useCallback(() => {
    const grid: BlockData[][] = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      const rowBlocks: BlockData[] = [];
      for (let col = 0; col < GRID_COLS; col++) {
        rowBlocks.push(createBlock());
      }
      grid.push(rowBlocks);
    }
    setBlocks(grid);
  }, []);

  // Start game
  const startGame = () => {
    setPhase("play");
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setFloatingPoints([]);
    initializeGrid();
  };

  // Timer
  useEffect(() => {
    if (phase !== "play") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setPhase("dead");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  // Handle game end
  useEffect(() => {
    if (phase === "dead") {
      const result: GameResult = {
        score,
        maxScore: MAX_SCORE,
        won: score >= MAX_SCORE,
      };
      onGameEnd(result);
    }
  }, [phase, score, onGameEnd]);

  // Update score
  useEffect(() => {
    if (onScoreChange) {
      onScoreChange(score);
    }
  }, [score, onScoreChange]);

  // Handle block click
  const handleBlockClick = (rowIndex: number, colIndex: number) => {
    if (phase !== "play") return;

    setBlocks((prevBlocks) => {
      const newBlocks = prevBlocks.map(row => [...row]);
      const block = newBlocks[rowIndex][colIndex];

      // Damage the block
      block.currentHealth -= 1;

      // If block is destroyed
      if (block.currentHealth <= 0) {
        const points = block.points;

        // Add floating points animation
        const floatingId = Math.random().toString(36).substr(2, 9);
        setFloatingPoints((prev) => [
          ...prev,
          { id: floatingId, points, x: colIndex * 25 + 12.5, y: rowIndex * 20 + 10 },
        ]);

        // Remove floating point after animation
        setTimeout(() => {
          setFloatingPoints((prev) => prev.filter((fp) => fp.id !== floatingId));
        }, 1000);

        // Update score
        setScore((prev) => Math.min(prev + points, MAX_SCORE));

        // Replace with new block
        newBlocks[rowIndex][colIndex] = createBlock();
      }

      return newBlocks;
    });
  };

  // Menu phase
  if (phase === "menu") {
    return (
      <div className="w-full min-h-[400px] rounded-2xl relative bg-gradient-to-b from-slate-900 to-gray-900 flex flex-col items-center justify-center p-6 text-white">
        <button
          onClick={onExit}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-5xl mb-4">⛏️</div>
          <h1 className="text-4xl font-bold mb-3">Mine Clicker</h1>
          <p className="text-gray-300 mb-8 max-w-md">
            Mine blocks, find gems! Click to destroy blocks and earn points. Rarer blocks give more points!
          </p>
          <motion.button
            onClick={startGame}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-xl font-bold hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Mining
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Play phase
  if (phase === "play") {
    return (
      <div className="w-full min-h-[400px] rounded-2xl relative bg-gradient-to-b from-slate-900 via-gray-900 to-slate-800 overflow-hidden p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 text-white">
          <div className="text-2xl font-bold">
            Score: <span className="text-yellow-400">{score}</span>
          </div>
          <div className="text-2xl font-bold">
            Time: <span className={timeLeft <= 5 ? "text-red-400" : "text-cyan-400"}>{timeLeft}s</span>
          </div>
        </div>

        {/* Grid */}
        <div className="relative">
          <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
            {blocks.map((row, rowIndex) =>
              row.map((block, colIndex) => {
                const healthPercent = (block.currentHealth / block.maxHealth) * 100;
                const crackLevel = Math.floor(((block.maxHealth - block.currentHealth) / block.maxHealth) * 3);

                return (
                  <motion.button
                    key={`${rowIndex}-${colIndex}-${block.id}`}
                    onClick={() => handleBlockClick(rowIndex, colIndex)}
                    className={`relative ${block.color} rounded-lg min-h-[70px] flex flex-col items-center justify-center cursor-pointer hover:brightness-110 transition-all shadow-md`}
                    whileTap={{ scale: 0.9 }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Block emoji */}
                    <div className="text-3xl relative z-10">{block.emoji}</div>

                    {/* Crack overlay */}
                    {crackLevel > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: crackLevel * 0.3 }}
                        className="absolute inset-0 bg-black rounded-lg pointer-events-none z-20"
                        style={{
                          backgroundImage: `linear-gradient(45deg, transparent 45%, rgba(0,0,0,0.${crackLevel * 3}) 50%, transparent 55%)`,
                        }}
                      />
                    )}

                    {/* Health bar */}
                    <div className="absolute bottom-1 left-1 right-1 h-1.5 bg-black/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-green-400"
                        initial={{ width: "100%" }}
                        animate={{ width: `${healthPercent}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>

          {/* Floating points */}
          <AnimatePresence>
            {floatingPoints.map((fp) => (
              <motion.div
                key={fp.id}
                initial={{ opacity: 1, y: 0, x: `${fp.x}%` }}
                animate={{ opacity: 0, y: -50 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute top-0 text-2xl font-bold text-yellow-300 pointer-events-none z-30"
                style={{ left: 0 }}
              >
                +{fp.points}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs text-white/70">
          <div>🟫 Dirt (1pt)</div>
          <div>⬜ Stone (2pt)</div>
          <div>🔲 Iron (3pt)</div>
          <div>🟨 Gold (5pt)</div>
          <div>💎 Diamond (10pt)</div>
        </div>
      </div>
    );
  }

  // Dead phase (auto-handled by useEffect)
  return null;
}
