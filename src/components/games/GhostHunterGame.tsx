import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { MiniGameProps, GameResult } from "./types";

const MAX_SCORE = 50;

interface Ghost {
  id: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
}

type Phase = "menu" | "play" | "dead";

export function GhostHunterGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const [phase, setPhase] = useState<Phase>("menu");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [ghosts, setGhosts] = useState<Ghost[]>([]);
  const ghostIdRef = useRef(0);
  const spawnIntervalRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Calculate spawn rate based on score (starts at 1.5s, speeds up to 0.5s)
  const getSpawnInterval = () => {
    const progress = Math.min(score / MAX_SCORE, 1);
    return 1500 - progress * 1000; // 1500ms -> 500ms
  };

  // Start game
  const startGame = () => {
    setPhase("play");
    setScore(0);
    setLives(3);
    setGhosts([]);
    ghostIdRef.current = 0;
    onScoreChange?.(0);
  };

  // Spawn a ghost at random edge position
  const spawnGhost = () => {
    const edge = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
    let x = 0, y = 0;

    switch (edge) {
      case 0: // top
        x = Math.random() * 100;
        y = 0;
        break;
      case 1: // right
        x = 100;
        y = Math.random() * 100;
        break;
      case 2: // bottom
        x = Math.random() * 100;
        y = 100;
        break;
      case 3: // left
        x = 0;
        y = Math.random() * 100;
        break;
    }

    const newGhost: Ghost = {
      id: ghostIdRef.current++,
      x,
      y,
      startX: x,
      startY: y,
    };

    setGhosts(prev => [...prev, newGhost]);
  };

  // Update ghost positions (move toward center)
  useEffect(() => {
    if (phase !== "play") return;

    const animate = () => {
      setGhosts(prev => {
        const updated = prev.map(ghost => {
          const centerX = 50;
          const centerY = 50;
          const dx = centerX - ghost.x;
          const dy = centerY - ghost.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // If ghost reached center, lose a life
          if (distance < 5) {
            setLives(current => {
              const newLives = current - 1;
              if (newLives <= 0) {
                setPhase("dead");
              }
              return newLives;
            });
            return null; // Remove this ghost
          }

          // Move toward center (speed increases with score)
          const speed = 0.2 + (score / MAX_SCORE) * 0.3; // 0.2 -> 0.5
          const newX = ghost.x + (dx / distance) * speed;
          const newY = ghost.y + (dy / distance) * speed;

          return { ...ghost, x: newX, y: newY };
        }).filter(Boolean) as Ghost[];

        return updated;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase, score]);

  // Spawn ghosts at intervals
  useEffect(() => {
    if (phase !== "play") return;

    const spawn = () => {
      spawnGhost();
      // Update interval based on current score
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
      spawnIntervalRef.current = window.setInterval(spawn, getSpawnInterval());
    };

    spawn(); // Spawn first ghost immediately

    return () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
    };
  }, [phase, score]);

  // Handle ghost click
  const handleGhostClick = (ghostId: number) => {
    setGhosts(prev => prev.filter(g => g.id !== ghostId));
    const newScore = Math.min(score + 1, MAX_SCORE);
    setScore(newScore);
    onScoreChange?.(newScore);

    // Check if won
    if (newScore >= MAX_SCORE) {
      setPhase("dead");
    }
  };

  // Handle game end
  useEffect(() => {
    if (phase === "dead") {
      const result: GameResult = {
        score,
        maxScore: MAX_SCORE,
        normalizedScore: score / MAX_SCORE,
      };
      onGameEnd(result);
    }
  }, [phase, score, onGameEnd]);

  // Menu phase
  if (phase === "menu") {
    return (
      <div className="w-full min-h-[400px] rounded-2xl relative overflow-hidden bg-gradient-to-br from-purple-950 via-purple-900 to-black flex flex-col items-center justify-center p-8">
        <button
          onClick={onExit}
          className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6"
        >
          <div className="text-8xl mb-4 filter drop-shadow-lg">👻</div>
          <h1 className="text-5xl font-bold text-purple-200 mb-2">Ghost Hunter</h1>
          <p className="text-purple-300 text-lg max-w-md">
            Hunt ghosts in the dark! Click them before they reach the center. Don't let 3 ghosts escape!
          </p>

          <button
            onClick={startGame}
            className="mt-8 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white text-xl font-bold rounded-xl transition-colors shadow-lg"
          >
            Start Hunting
          </button>
        </motion.div>
      </div>
    );
  }

  // Play phase
  if (phase === "play") {
    return (
      <div className="w-full min-h-[400px] rounded-2xl relative overflow-hidden bg-gradient-to-br from-black via-purple-950 to-black">
        {/* HUD */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="text-2xl">
                {i < lives ? "❤️" : "🖤"}
              </span>
            ))}
          </div>
          <div className="text-2xl font-bold text-purple-200 bg-black/50 px-4 py-2 rounded-lg">
            {score}/{MAX_SCORE}
          </div>
        </div>

        {/* Ghost container */}
        <div className="absolute inset-0">
          <AnimatePresence>
            {ghosts.map(ghost => (
              <motion.button
                key={ghost.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                style={{
                  position: "absolute",
                  left: `${ghost.x}%`,
                  top: `${ghost.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => handleGhostClick(ghost.id)}
                className="text-4xl cursor-pointer hover:scale-125 transition-transform filter drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              >
                👻
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Center danger zone indicator */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 rounded-full border-2 border-red-500/30 animate-pulse" />
        </div>
      </div>
    );
  }

  // Dead phase (handled by useEffect)
  return null;
}
