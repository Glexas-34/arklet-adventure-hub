import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { MiniGameProps, GameResult } from "./types";

const MAX_SCORE = 30;
const GAME_DURATION = 30000; // 30 seconds
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 300;

type Phase = "menu" | "play" | "dead";

interface Egg {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  launched: boolean;
}

interface Target {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

const SLINGSHOT_X = 60;
const SLINGSHOT_Y = 250;
const GRAVITY = 0.4;
const POWER_MULTIPLIER = 0.3;

// Generate random target arrangements
const generateTargets = (level: number): Target[] => {
  const colors = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899"];
  const targets: Target[] = [];
  const baseX = 300;
  const baseY = 250;

  // Create stacks of boxes
  const rows = Math.min(3 + Math.floor(level / 3), 6);
  const cols = Math.min(2 + Math.floor(level / 2), 4);

  for (let row = 0; row < rows; row++) {
    const boxesInRow = Math.max(1, cols - Math.floor(row / 2));
    for (let col = 0; col < boxesInRow; col++) {
      targets.push({
        x: baseX - (boxesInRow * 15) + col * 30,
        y: baseY - row * 25,
        width: 25,
        height: 20,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  return targets;
};

export function EggTossGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const [phase, setPhase] = useState<Phase>("menu");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [egg, setEgg] = useState<Egg>({
    x: SLINGSHOT_X,
    y: SLINGSHOT_Y,
    vx: 0,
    vy: 0,
    radius: 12,
    launched: false
  });
  const [targets, setTargets] = useState<Target[]>([]);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  // Start game
  const handleStart = () => {
    setPhase("play");
    setScore(0);
    setLevel(1);
    setTimeLeft(GAME_DURATION);
    setTargets(generateTargets(1));
    setEgg({
      x: SLINGSHOT_X,
      y: SLINGSHOT_Y,
      vx: 0,
      vy: 0,
      radius: 12,
      launched: false
    });
    startTimeRef.current = Date.now();
  };

  // Update score
  const updateScore = (newScore: number) => {
    setScore(newScore);
    if (onScoreChange) {
      onScoreChange(newScore);
    }
  };

  // End game
  const endGame = () => {
    setPhase("dead");
    const normalizedScore = Math.min(score / MAX_SCORE, 1);
    const result: GameResult = {
      score,
      maxScore: MAX_SCORE,
      normalizedScore
    };
    onGameEnd(result);
  };

  // Mouse/touch handlers
  const getPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (egg.launched) return;

    const pos = getPointerPos(e);
    const dx = pos.x - egg.x;
    const dy = pos.y - egg.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 30) {
      setDragState({
        isDragging: true,
        startX: egg.x,
        startY: egg.y,
        currentX: pos.x,
        currentY: pos.y
      });
    }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragState.isDragging) return;

    const pos = getPointerPos(e);
    setDragState(prev => ({
      ...prev,
      currentX: pos.x,
      currentY: pos.y
    }));
  };

  const handlePointerUp = () => {
    if (!dragState.isDragging) return;

    const dx = dragState.startX - dragState.currentX;
    const dy = dragState.startY - dragState.currentY;

    setEgg(prev => ({
      ...prev,
      vx: dx * POWER_MULTIPLIER,
      vy: dy * POWER_MULTIPLIER,
      launched: true
    }));

    setDragState({
      isDragging: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0
    });
  };

  // Game loop
  useEffect(() => {
    if (phase !== "play") return;

    const gameLoop = () => {
      // Update timer
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, GAME_DURATION - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        endGame();
        return;
      }

      // Update egg physics
      if (egg.launched) {
        const newEgg = { ...egg };
        newEgg.vy += GRAVITY;
        newEgg.x += newEgg.vx;
        newEgg.y += newEgg.vy;

        // Check collision with targets
        let hit = false;
        const remainingTargets = targets.filter(target => {
          const closestX = Math.max(target.x, Math.min(newEgg.x, target.x + target.width));
          const closestY = Math.max(target.y, Math.min(newEgg.y, target.y + target.height));
          const distX = newEgg.x - closestX;
          const distY = newEgg.y - closestY;
          const dist = Math.sqrt(distX * distX + distY * distY);

          if (dist < newEgg.radius) {
            hit = true;
            return false; // Remove this target
          }
          return true;
        });

        if (hit) {
          updateScore(score + 1);
          setTargets(remainingTargets);

          // Reset egg for next shot
          newEgg.x = SLINGSHOT_X;
          newEgg.y = SLINGSHOT_Y;
          newEgg.vx = 0;
          newEgg.vy = 0;
          newEgg.launched = false;
        }

        // Check if all targets cleared
        if (remainingTargets.length === 0) {
          const nextLevel = level + 1;
          setLevel(nextLevel);
          setTargets(generateTargets(nextLevel));
          newEgg.x = SLINGSHOT_X;
          newEgg.y = SLINGSHOT_Y;
          newEgg.vx = 0;
          newEgg.vy = 0;
          newEgg.launched = false;
        }

        // Check if egg is out of bounds
        if (newEgg.x < 0 || newEgg.x > CANVAS_WIDTH || newEgg.y > CANVAS_HEIGHT) {
          newEgg.x = SLINGSHOT_X;
          newEgg.y = SLINGSHOT_Y;
          newEgg.vx = 0;
          newEgg.vy = 0;
          newEgg.launched = false;
        }

        setEgg(newEgg);
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase, egg, targets, score, level]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || phase !== "play") return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Sky gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, "#87CEEB");
    gradient.addColorStop(1, "#E0F6FF");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Ground
    ctx.fillStyle = "#8B7355";
    ctx.fillRect(0, 260, CANVAS_WIDTH, 40);
    ctx.fillStyle = "#90EE90";
    ctx.fillRect(0, 260, CANVAS_WIDTH, 5);

    // Slingshot base
    ctx.fillStyle = "#654321";
    ctx.fillRect(SLINGSHOT_X - 3, SLINGSHOT_Y, 6, 20);

    // Draw trajectory line if dragging
    if (dragState.isDragging && !egg.launched) {
      const dx = dragState.startX - dragState.currentX;
      const dy = dragState.startY - dragState.currentY;

      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(egg.x, egg.y);

      // Show trajectory
      let tx = egg.x;
      let ty = egg.y;
      let tvx = dx * POWER_MULTIPLIER;
      let tvy = dy * POWER_MULTIPLIER;

      for (let i = 0; i < 20; i++) {
        tvy += GRAVITY;
        tx += tvx;
        ty += tvy;
        if (i % 3 === 0) {
          ctx.lineTo(tx, ty);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Rubber band effect
      ctx.strokeStyle = "#8B4513";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(SLINGSHOT_X - 10, SLINGSHOT_Y - 10);
      ctx.lineTo(egg.x, egg.y);
      ctx.lineTo(SLINGSHOT_X + 10, SLINGSHOT_Y - 10);
      ctx.stroke();
    }

    // Draw targets
    targets.forEach(target => {
      ctx.fillStyle = target.color;
      ctx.fillRect(target.x, target.y, target.width, target.height);
      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
      ctx.lineWidth = 1;
      ctx.strokeRect(target.x, target.y, target.width, target.height);
    });

    // Draw egg
    ctx.fillStyle = "#F5F5DC";
    ctx.strokeStyle = "#DEB887";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(egg.x, egg.y, egg.radius, egg.radius * 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Add egg spots
    ctx.fillStyle = "#D2B48C";
    ctx.beginPath();
    ctx.arc(egg.x - 4, egg.y - 3, 2, 0, Math.PI * 2);
    ctx.arc(egg.x + 3, egg.y + 2, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // UI overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.font = "bold 16px monospace";
    ctx.fillText(`Score: ${score}`, 10, 25);
    ctx.fillText(`Time: ${Math.ceil(timeLeft / 1000)}s`, 10, 50);
    ctx.fillText(`Level: ${level}`, 10, 75);
  }, [phase, egg, targets, dragState, score, timeLeft, level]);

  if (phase === "menu") {
    return (
      <div className="w-full min-h-[400px] rounded-2xl relative bg-gradient-to-b from-sky-400 to-blue-300 overflow-hidden">
        <button
          onClick={onExit}
          className="absolute top-4 left-4 p-2 bg-white/80 hover:bg-white rounded-full transition-colors z-10"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>

        <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="text-7xl mb-4">🥚</div>
            <h1 className="text-5xl font-black text-white mb-4 drop-shadow-lg">
              Egg Toss
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-md">
              Launch eggs at targets! Drag to aim and release to fire. Clear all targets to advance!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="px-12 py-4 bg-white text-blue-600 rounded-full font-bold text-2xl shadow-lg hover:shadow-xl transition-all"
            >
              Start Game
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (phase === "play") {
    return (
      <div className="w-full min-h-[400px] rounded-2xl relative bg-gradient-to-b from-sky-400 to-blue-300 overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          className="border-4 border-white/30 rounded-lg shadow-2xl cursor-crosshair touch-none"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
    );
  }

  return null;
}
