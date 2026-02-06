import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { MiniGameProps } from "./types";
import { useSound } from "@/hooks/useSound";

const CELL = 20;
const GRID = 20;
const CANVAS_SIZE = CELL * GRID;
const MAX_SCORE = 25;

type Dir = "up" | "down" | "left" | "right";

export function SnakeGame({ onGameEnd, onExit }: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 10 },
    dir: "right" as Dir,
    nextDir: "right" as Dir,
    score: 0,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const { playCorrect, playWrong } = useSound();
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const spawnFood = useCallback(() => {
    const s = stateRef.current;
    let pos: { x: number; y: number };
    do {
      pos = {
        x: Math.floor(Math.random() * GRID),
        y: Math.floor(Math.random() * GRID),
      };
    } while (s.snake.some((seg) => seg.x === pos.x && seg.y === pos.y));
    s.food = pos;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    for (let i = 0; i < GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(CANVAS_SIZE, i * CELL);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(s.food.x * CELL + CELL / 2, s.food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Snake
    s.snake.forEach((seg, i) => {
      const brightness = 1 - i * 0.03;
      ctx.fillStyle = `hsl(142, 70%, ${Math.max(30, 50 * brightness)}%)`;
      ctx.beginPath();
      ctx.roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, 4);
      ctx.fill();
    });

    // Eyes on head
    const head = s.snake[0];
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(head.x * CELL + CELL / 3, head.y * CELL + CELL / 3, 3, 0, Math.PI * 2);
    ctx.arc(head.x * CELL + (2 * CELL) / 3, head.y * CELL + CELL / 3, 3, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    s.dir = s.nextDir;

    const head = { ...s.snake[0] };
    switch (s.dir) {
      case "up": head.y--; break;
      case "down": head.y++; break;
      case "left": head.x--; break;
      case "right": head.x++; break;
    }

    // Check collision
    if (
      head.x < 0 || head.x >= GRID ||
      head.y < 0 || head.y >= GRID ||
      s.snake.some((seg) => seg.x === head.x && seg.y === head.y)
    ) {
      clearInterval(intervalRef.current);
      setGameOver(true);
      playWrong();
      onGameEnd({
        score: s.score,
        maxScore: MAX_SCORE,
        normalizedScore: Math.min(1, s.score / MAX_SCORE),
      });
      return;
    }

    s.snake.unshift(head);

    if (head.x === s.food.x && head.y === s.food.y) {
      s.score++;
      setScore(s.score);
      spawnFood();
      playCorrect();
    } else {
      s.snake.pop();
    }

    draw();
  }, [draw, spawnFood, onGameEnd, playCorrect, playWrong]);

  useEffect(() => {
    if (!started || gameOver) return;

    draw();
    intervalRef.current = setInterval(tick, 120);

    const handleKey = (e: KeyboardEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const s = stateRef.current;
      switch (e.key) {
        case "ArrowUp": case "w": if (s.dir !== "down") s.nextDir = "up"; break;
        case "ArrowDown": case "s": if (s.dir !== "up") s.nextDir = "down"; break;
        case "ArrowLeft": case "a": if (s.dir !== "right") s.nextDir = "left"; break;
        case "ArrowRight": case "d": if (s.dir !== "left") s.nextDir = "right"; break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("keydown", handleKey);
    };
  }, [started, gameOver, draw, tick]);

  // Touch swipe handling on canvas
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const s = stateRef.current;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 20 && s.dir !== "left") s.nextDir = "right";
      else if (dx < -20 && s.dir !== "right") s.nextDir = "left";
    } else {
      if (dy > 20 && s.dir !== "up") s.nextDir = "down";
      else if (dy < -20 && s.dir !== "down") s.nextDir = "up";
    }
    touchStartRef.current = null;
  };

  const handleDirButton = (dir: Dir) => {
    const s = stateRef.current;
    if (dir === "up" && s.dir !== "down") s.nextDir = "up";
    if (dir === "down" && s.dir !== "up") s.nextDir = "down";
    if (dir === "left" && s.dir !== "right") s.nextDir = "left";
    if (dir === "right" && s.dir !== "left") s.nextDir = "right";
  };

  if (!started) {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="flex items-center gap-3 mb-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
            className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft size={20} />
          </motion.button>
          <h3 className="text-xl font-bold text-foreground">🐍 Snake</h3>
        </div>
        <p className="text-muted-foreground mb-6">Use arrow keys, WASD, swipe, or the D-pad to move!</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setStarted(true)}
          className="gradient-button text-primary-foreground font-bold px-8 py-4 rounded-xl text-xl"
        >
          Start!
        </motion.button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
          className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ArrowLeft size={20} />
        </motion.button>
        <h3 className="text-xl font-bold text-foreground">🐍 Snake</h3>
        <span className="ml-auto text-lg font-bold text-foreground">🍎 {score}</span>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full max-w-[400px] aspect-square mx-auto rounded-2xl bg-black/50 border-2 border-white/10 touch-none"
      />

      {/* Mobile D-pad */}
      <div className="md:hidden mt-4 flex flex-col items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => handleDirButton("up")}
          className="w-14 h-14 rounded-xl bg-black/40 border border-white/20 flex items-center justify-center text-foreground active:bg-white/20"
        >
          <ArrowUp size={24} />
        </motion.button>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => handleDirButton("left")}
            className="w-14 h-14 rounded-xl bg-black/40 border border-white/20 flex items-center justify-center text-foreground active:bg-white/20"
          >
            <ChevronLeft size={24} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => handleDirButton("down")}
            className="w-14 h-14 rounded-xl bg-black/40 border border-white/20 flex items-center justify-center text-foreground active:bg-white/20"
          >
            <ArrowDown size={24} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => handleDirButton("right")}
            className="w-14 h-14 rounded-xl bg-black/40 border border-white/20 flex items-center justify-center text-foreground active:bg-white/20"
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
