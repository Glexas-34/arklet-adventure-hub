import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { MiniGameProps, GameResult } from "./types";

const MAX_SCORE = 25;
const GAME_DURATION = 45;
const GROWTH_TIME = 4000; // 4 seconds per stage
const WEED_SPAWN_MIN = 8000;
const WEED_SPAWN_MAX = 10000;

type PlotState = {
  emoji: string;
  stage: number; // 0 = empty, 1 = seed, 2 = sprout, 3 = grown
  isWeed: boolean;
  plantedAt?: number;
};

type GamePhase = "menu" | "play" | "dead";

const PLANT_EMOJIS = ["🌻", "🌹", "🥕"];

export function GardenRushGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [plots, setPlots] = useState<PlotState[]>(
    Array(9).fill(null).map(() => ({ emoji: "", stage: 0, isWeed: false }))
  );

  const weedTimerRef = useRef<NodeJS.Timeout>();
  const gameTimerRef = useRef<NodeJS.Timeout>();
  const growthIntervalRef = useRef<NodeJS.Timeout>();

  const startGame = () => {
    setPhase("play");
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setPlots(Array(9).fill(null).map(() => ({ emoji: "", stage: 0, isWeed: false })));

    // Start game timer
    const startTime = Date.now();
    gameTimerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, GAME_DURATION - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        endGame();
      }
    }, 100);

    // Start weed spawner
    scheduleWeed();

    // Start growth checker
    growthIntervalRef.current = setInterval(() => {
      setPlots(prev => prev.map(plot => {
        if (plot.stage > 0 && plot.stage < 3 && !plot.isWeed && plot.plantedAt) {
          const elapsed = Date.now() - plot.plantedAt;
          const expectedStage = Math.min(3, Math.floor(elapsed / GROWTH_TIME) + 1);

          if (expectedStage > plot.stage) {
            let newEmoji = plot.emoji;
            if (expectedStage === 2) {
              newEmoji = "🌿";
            } else if (expectedStage === 3) {
              newEmoji = PLANT_EMOJIS[Math.floor(Math.random() * PLANT_EMOJIS.length)];
            }
            return { ...plot, stage: expectedStage, emoji: newEmoji };
          }
        }
        return plot;
      }));
    }, 500);
  };

  const scheduleWeed = () => {
    const delay = Math.random() * (WEED_SPAWN_MAX - WEED_SPAWN_MIN) + WEED_SPAWN_MIN;
    weedTimerRef.current = setTimeout(() => {
      spawnWeed();
      scheduleWeed();
    }, delay);
  };

  const spawnWeed = () => {
    setPlots(prev => {
      const emptyIndices = prev.map((p, i) => p.stage === 0 ? i : -1).filter(i => i !== -1);
      if (emptyIndices.length === 0) return prev;

      const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      const newPlots = [...prev];
      newPlots[randomIndex] = { emoji: "🌵", stage: 3, isWeed: true };
      return newPlots;
    });
  };

  const endGame = useCallback(() => {
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (weedTimerRef.current) clearTimeout(weedTimerRef.current);
    if (growthIntervalRef.current) clearInterval(growthIntervalRef.current);

    setPhase("dead");

    const result: GameResult = {
      score,
      maxScore: MAX_SCORE,
      success: score >= MAX_SCORE * 0.6,
    };

    setTimeout(() => onGameEnd(result), 100);
  }, [score, onGameEnd]);

  const handlePlotClick = (index: number) => {
    const plot = plots[index];

    // Remove weed
    if (plot.isWeed) {
      const newPlots = [...plots];
      newPlots[index] = { emoji: "", stage: 0, isWeed: false };
      setPlots(newPlots);
      return;
    }

    // Harvest grown plant
    if (plot.stage === 3 && !plot.isWeed) {
      const newScore = Math.min(MAX_SCORE, score + 1);
      setScore(newScore);
      if (onScoreChange) onScoreChange(newScore);

      const newPlots = [...plots];
      newPlots[index] = { emoji: "", stage: 0, isWeed: false };
      setPlots(newPlots);
      return;
    }

    // Plant seed
    if (plot.stage === 0) {
      const newPlots = [...plots];
      newPlots[index] = {
        emoji: "🌱",
        stage: 1,
        isWeed: false,
        plantedAt: Date.now()
      };
      setPlots(newPlots);
    }
  };

  useEffect(() => {
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (weedTimerRef.current) clearTimeout(weedTimerRef.current);
      if (growthIntervalRef.current) clearInterval(growthIntervalRef.current);
    };
  }, []);

  if (phase === "menu") {
    return (
      <div className="w-full min-h-[400px] rounded-2xl relative bg-gradient-to-br from-amber-900 via-green-800 to-emerald-900 flex flex-col items-center justify-center p-8">
        <button
          onClick={onExit}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-white mb-4">Garden Rush</h1>
          <p className="text-xl text-green-100 mb-8">Plant, grow, harvest!</p>

          <div className="mb-8 text-6xl">
            🌱🌿🌻
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-2xl font-bold rounded-xl shadow-lg transition-colors"
          >
            Start Game
          </motion.button>

          <div className="mt-6 text-sm text-green-200 max-w-md">
            <p>Tap empty plots to plant seeds. Watch them grow!</p>
            <p>Harvest fully grown plants for points.</p>
            <p>Remove weeds (🌵) before they spread!</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (phase === "play") {
    return (
      <div className="w-full min-h-[400px] rounded-2xl relative bg-gradient-to-br from-amber-900 via-green-800 to-emerald-900 p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-white">
            <div className="text-sm font-medium text-green-200">Score</div>
            <div className="text-3xl font-bold">{score}/{MAX_SCORE}</div>
          </div>

          <div className="text-white">
            <div className="text-sm font-medium text-green-200">Time</div>
            <div className={`text-3xl font-bold ${timeLeft <= 10 ? "text-red-400 animate-pulse" : ""}`}>
              {timeLeft}s
            </div>
          </div>
        </div>

        {/* Garden Grid */}
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-3 max-w-md w-full">
            {plots.map((plot, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePlotClick(index)}
                className={`
                  aspect-square min-h-[80px] rounded-xl flex items-center justify-center
                  text-5xl transition-all shadow-lg
                  ${plot.isWeed
                    ? "bg-red-900/50 border-2 border-red-500"
                    : plot.stage === 0
                      ? "bg-amber-800/50 border-2 border-amber-700 hover:bg-amber-700/50"
                      : "bg-green-700/50 border-2 border-green-600"
                  }
                `}
              >
                <AnimatePresence mode="wait">
                  {plot.emoji && (
                    <motion.span
                      key={plot.emoji + plot.stage}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      {plot.emoji}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-green-950/50 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(score / MAX_SCORE) * 100}%` }}
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
            />
          </div>
        </div>
      </div>
    );
  }

  // Dead phase
  return (
    <div className="w-full min-h-[400px] rounded-2xl relative bg-gradient-to-br from-amber-900 via-green-800 to-emerald-900 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center text-white"
      >
        <div className="text-6xl mb-4">🌻</div>
        <div className="text-3xl font-bold">Garden Complete!</div>
        <div className="text-xl mt-2">Score: {score}/{MAX_SCORE}</div>
      </motion.div>
    </div>
  );
}
