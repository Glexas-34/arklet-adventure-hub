import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { MiniGameProps, GameResult } from "./types";

const MAX_SCORE = 40;
const GAME_DURATION = 30000; // 30 seconds
const INITIAL_TARGET_LIFETIME = 1500; // 1.5 seconds
const MIN_TARGET_LIFETIME = 700; // 0.7 seconds
const TARGET_SPAWN_INTERVAL = 1000; // 1 second
const SMALL_TARGET_SIZE = 60;
const LARGE_TARGET_SIZE = 100;
const SMALL_TARGET_POINTS = 2;
const LARGE_TARGET_POINTS = 1;

type GamePhase = "menu" | "play" | "dead";

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  points: number;
  spawnTime: number;
}

export function TargetBlitzGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState<Target[]>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

  const gameStartTimeRef = useRef<number>(0);
  const nextTargetIdRef = useRef(0);
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate target lifetime based on elapsed time
  const getTargetLifetime = useCallback((elapsedTime: number): number => {
    const progress = Math.min(elapsedTime / GAME_DURATION, 1);
    return INITIAL_TARGET_LIFETIME - (INITIAL_TARGET_LIFETIME - MIN_TARGET_LIFETIME) * progress;
  }, []);

  // Spawn a new target at random position
  const spawnTarget = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const isSmall = Math.random() < 0.4; // 40% chance of small target
    const size = isSmall ? SMALL_TARGET_SIZE : LARGE_TARGET_SIZE;
    const points = isSmall ? SMALL_TARGET_POINTS : LARGE_TARGET_POINTS;

    // Random position with padding to keep target fully visible
    const padding = size / 2 + 20;
    const x = padding + Math.random() * (containerRect.width - size - padding * 2);
    const y = padding + Math.random() * (containerRect.height - size - padding * 2);

    const newTarget: Target = {
      id: nextTargetIdRef.current++,
      x,
      y,
      size,
      points,
      spawnTime: Date.now(),
    };

    setTargets((prev) => [...prev, newTarget]);

    // Auto-remove target after lifetime
    const elapsedTime = Date.now() - gameStartTimeRef.current;
    const lifetime = getTargetLifetime(elapsedTime);
    setTimeout(() => {
      setTargets((prev) => prev.filter((t) => t.id !== newTarget.id));
    }, lifetime);
  }, [getTargetLifetime]);

  // Hit a target
  const hitTarget = useCallback((targetId: number, points: number) => {
    setTargets((prev) => prev.filter((t) => t.id !== targetId));
    const newScore = Math.min(score + points, MAX_SCORE);
    setScore(newScore);
    onScoreChange?.(newScore);

    // Check win condition
    if (newScore >= MAX_SCORE) {
      setPhase("dead");
    }
  }, [score, onScoreChange]);

  // Start game
  const startGame = useCallback(() => {
    setPhase("play");
    setScore(0);
    setTargets([]);
    setTimeLeft(GAME_DURATION);
    gameStartTimeRef.current = Date.now();
    nextTargetIdRef.current = 0;
    onScoreChange?.(0);

    // Spawn initial target
    setTimeout(spawnTarget, 500);

    // Spawn targets at intervals
    spawnIntervalRef.current = setInterval(spawnTarget, TARGET_SPAWN_INTERVAL);

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
  }, [spawnTarget, onScoreChange]);

  // Cleanup intervals
  useEffect(() => {
    return () => {
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, []);

  // Handle game end
  useEffect(() => {
    if (phase === "dead") {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
        spawnIntervalRef.current = null;
      }
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
        gameTimerRef.current = null;
      }

      const result: GameResult = {
        score,
        maxScore: MAX_SCORE,
        won: score >= MAX_SCORE,
        timeElapsed: GAME_DURATION - timeLeft,
      };

      setTimeout(() => {
        onGameEnd(result);
      }, 500);
    }
  }, [phase, score, timeLeft, onGameEnd]);

  // Menu phase
  if (phase === "menu") {
    return (
      <div className="w-full min-h-[400px] rounded-2xl relative overflow-hidden bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 flex items-center justify-center">
        <button
          onClick={onExit}
          className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <div className="text-center space-y-6 px-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold text-white mb-2 tracking-wider">
              TARGET BLITZ
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full border-4 border-red-500 border-dashed animate-spin" />
              <div className="w-6 h-6 rounded-full border-3 border-red-400" />
              <div className="w-8 h-8 rounded-full border-4 border-red-500 border-dashed animate-spin" />
            </div>
            <p className="text-xl text-gray-300 mb-6">
              Hit targets fast! Smaller = more points
            </p>
            <div className="text-sm text-gray-400 space-y-1">
              <p>Small targets: +{SMALL_TARGET_POINTS} points</p>
              <p>Large targets: +{LARGE_TARGET_POINTS} point</p>
              <p>30 seconds • Score {MAX_SCORE} to win</p>
            </div>
          </motion.div>

          <motion.button
            onClick={startGame}
            className="px-12 py-4 bg-red-600 hover:bg-red-700 text-white text-xl font-bold rounded-lg transition-colors shadow-lg hover:shadow-red-500/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            START MISSION
          </motion.button>
        </div>
      </div>
    );
  }

  // Play phase
  if (phase === "play") {
    const timeLeftSeconds = Math.ceil(timeLeft / 1000);
    const progress = (score / MAX_SCORE) * 100;

    return (
      <div
        ref={containerRef}
        className="w-full min-h-[400px] rounded-2xl relative overflow-hidden cursor-crosshair bg-gradient-to-br from-gray-900 via-green-950 to-black"
      >
        {/* HUD */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10 pointer-events-none">
          {/* Timer */}
          <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-green-500/30">
            <div className="text-green-400 font-mono text-2xl font-bold">
              {timeLeftSeconds}s
            </div>
          </div>

          {/* Score */}
          <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-red-500/30">
            <div className="text-red-400 font-mono text-2xl font-bold">
              {score} / {MAX_SCORE}
            </div>
            <div className="w-32 h-1 bg-gray-700 rounded-full mt-1 overflow-hidden">
              <motion.div
                className="h-full bg-red-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Crosshair overlay effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5" />
        </div>

        {/* Targets */}
        <AnimatePresence>
          {targets.map((target) => {
            const isSmall = target.size === SMALL_TARGET_SIZE;
            return (
              <motion.div
                key={target.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute cursor-crosshair pointer-events-auto"
                style={{
                  left: target.x,
                  top: target.y,
                  width: target.size,
                  height: target.size,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => hitTarget(target.id, target.points)}
              >
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-pulse" />

                {/* Middle ring */}
                <div
                  className="absolute rounded-full border-3 border-white"
                  style={{
                    top: "20%",
                    left: "20%",
                    right: "20%",
                    bottom: "20%",
                  }}
                />

                {/* Inner ring */}
                <div
                  className="absolute rounded-full border-2 border-red-400"
                  style={{
                    top: "35%",
                    left: "35%",
                    right: "35%",
                    bottom: "35%",
                  }}
                />

                {/* Bullseye */}
                <div
                  className="absolute rounded-full bg-red-600"
                  style={{
                    top: "45%",
                    left: "45%",
                    right: "45%",
                    bottom: "45%",
                  }}
                />

                {/* Points indicator */}
                {isSmall && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-400 font-bold text-sm">
                    +{SMALL_TARGET_POINTS}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Vignette effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent via-transparent to-black/50" />
      </div>
    );
  }

  // Dead phase - handled by useEffect
  return (
    <div className="w-full min-h-[400px] rounded-2xl relative overflow-hidden bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-white text-2xl font-bold"
      >
        Mission Complete!
      </motion.div>
    </div>
  );
}
