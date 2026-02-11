import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

const W = 400;
const H = 300;
const CELL_SIZE = 20;
const COLS = W / CELL_SIZE; // 20
const ROWS = H / CELL_SIZE; // 15
const TICK_MS = 125; // 8fps
const MAX_SCORE = 50;

type Direction = "up" | "down" | "left" | "right";

interface Point {
  x: number;
  y: number;
}

export function SnakeGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"menu" | "play" | "dead">("menu");
  const stateRef = useRef({
    snake: [{ x: 10, y: 7 }] as Point[],
    direction: "right" as Direction,
    nextDirection: "right" as Direction,
    apple: { x: 15, y: 7 } as Point,
    score: 0,
  });
  const tickRef = useRef<NodeJS.Timeout | null>(null);
  const scoreRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const resetState = useCallback(() => {
    stateRef.current = {
      snake: [{ x: 10, y: 7 }],
      direction: "right",
      nextDirection: "right",
      apple: { x: 15, y: 7 },
      score: 0,
    };
    scoreRef.current = 0;
  }, []);

  const spawnApple = useCallback((snake: Point[]) => {
    const available: Point[] = [];
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        if (!snake.some((seg) => seg.x === x && seg.y === y)) {
          available.push({ x, y });
        }
      }
    }
    return available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : { x: 15, y: 7 };
  }, []);

  const gameTick = useCallback(() => {
    const s = stateRef.current;
    s.direction = s.nextDirection;

    // Calculate new head position
    const head = s.snake[0];
    let newHead: Point;
    switch (s.direction) {
      case "up":
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case "down":
        newHead = { x: head.x, y: head.y + 1 };
        break;
      case "left":
        newHead = { x: head.x - 1, y: head.y };
        break;
      case "right":
        newHead = { x: head.x + 1, y: head.y };
        break;
    }

    // Check wall collision
    if (newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS) {
      setPhase("dead");
      onGameEnd({
        score: s.score,
        maxScore: MAX_SCORE,
        normalizedScore: Math.min(1, s.score / MAX_SCORE),
      });
      return;
    }

    // Check self collision
    if (s.snake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
      setPhase("dead");
      onGameEnd({
        score: s.score,
        maxScore: MAX_SCORE,
        normalizedScore: Math.min(1, s.score / MAX_SCORE),
      });
      return;
    }

    // Add new head
    s.snake.unshift(newHead);

    // Check apple collision
    if (newHead.x === s.apple.x && newHead.y === s.apple.y) {
      s.score++;
      scoreRef.current = s.score;
      onScoreChange?.(s.score);
      s.apple = spawnApple(s.snake);
    } else {
      // Remove tail if no apple eaten
      s.snake.pop();
    }

    // Draw
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0a0a1a");
    bg.addColorStop(1, "#1a0a2e");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Grid pattern
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, H);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(W, y * CELL_SIZE);
      ctx.stroke();
    }

    // Apple (red with glow)
    ctx.shadowColor = "#ff0000";
    ctx.shadowBlur = 15;
    ctx.fillStyle = "#ff0033";
    ctx.beginPath();
    ctx.arc(
      s.apple.x * CELL_SIZE + CELL_SIZE / 2,
      s.apple.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Apple highlight
    ctx.fillStyle = "#ff3366";
    ctx.beginPath();
    ctx.arc(
      s.apple.x * CELL_SIZE + CELL_SIZE / 2 - 3,
      s.apple.y * CELL_SIZE + CELL_SIZE / 2 - 3,
      3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Snake (neon green with glow)
    ctx.shadowColor = "#22ff44";
    ctx.shadowBlur = 12;
    s.snake.forEach((seg, i) => {
      // Gradient from bright green (head) to darker green (tail)
      const alpha = 1 - (i / s.snake.length) * 0.4;
      ctx.fillStyle = i === 0 ? "#33ff55" : `rgba(34, 255, 68, ${alpha})`;
      ctx.beginPath();
      ctx.roundRect(
        seg.x * CELL_SIZE + 2,
        seg.y * CELL_SIZE + 2,
        CELL_SIZE - 4,
        CELL_SIZE - 4,
        4
      );
      ctx.fill();

      // Head eyes
      if (i === 0) {
        ctx.fillStyle = "#0a0a1a";
        ctx.shadowBlur = 0;
        const eyeSize = 3;
        const eyeOffset = 5;
        let leftEye = { x: seg.x * CELL_SIZE + eyeOffset, y: seg.y * CELL_SIZE + eyeOffset };
        let rightEye = { x: seg.x * CELL_SIZE + CELL_SIZE - eyeOffset, y: seg.y * CELL_SIZE + eyeOffset };

        // Adjust eye position based on direction
        if (s.direction === "down") {
          leftEye.y = seg.y * CELL_SIZE + CELL_SIZE - eyeOffset;
          rightEye.y = seg.y * CELL_SIZE + CELL_SIZE - eyeOffset;
        } else if (s.direction === "left") {
          leftEye = { x: seg.x * CELL_SIZE + eyeOffset, y: seg.y * CELL_SIZE + eyeOffset };
          rightEye = { x: seg.x * CELL_SIZE + eyeOffset, y: seg.y * CELL_SIZE + CELL_SIZE - eyeOffset };
        } else if (s.direction === "right") {
          leftEye = { x: seg.x * CELL_SIZE + CELL_SIZE - eyeOffset, y: seg.y * CELL_SIZE + eyeOffset };
          rightEye = { x: seg.x * CELL_SIZE + CELL_SIZE - eyeOffset, y: seg.y * CELL_SIZE + CELL_SIZE - eyeOffset };
        }

        ctx.beginPath();
        ctx.arc(leftEye.x, leftEye.y, eyeSize, 0, Math.PI * 2);
        ctx.arc(rightEye.x, rightEye.y, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 12;
      }
    });
    ctx.shadowBlur = 0;

    // HUD
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Fredoka, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${s.score}`, 10, 24);

    ctx.fillStyle = "#ffffff60";
    ctx.font = "12px Fredoka, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`Length: ${s.snake.length}`, W - 10, 24);
  }, [onGameEnd, onScoreChange, spawnApple]);

  useEffect(() => {
    if (phase !== "play") return;

    resetState();
    tickRef.current = setInterval(gameTick, TICK_MS);

    const handleKeyDown = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.key === "ArrowUp" && s.direction !== "down") {
        s.nextDirection = "up";
      } else if (e.key === "ArrowDown" && s.direction !== "up") {
        s.nextDirection = "down";
      } else if (e.key === "ArrowLeft" && s.direction !== "right") {
        s.nextDirection = "left";
      } else if (e.key === "ArrowRight" && s.direction !== "left") {
        s.nextDirection = "right";
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      const s = stateRef.current;
      if (absX > absY) {
        // Horizontal swipe
        if (dx > 0 && s.direction !== "left") {
          s.nextDirection = "right";
        } else if (dx < 0 && s.direction !== "right") {
          s.nextDirection = "left";
        }
      } else {
        // Vertical swipe
        if (dy > 0 && s.direction !== "up") {
          s.nextDirection = "down";
        } else if (dy < 0 && s.direction !== "down") {
          s.nextDirection = "up";
        }
      }
      touchStartRef.current = null;
    };

    window.addEventListener("keydown", handleKeyDown);
    const canvas = canvasRef.current;
    canvas?.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas?.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      window.removeEventListener("keydown", handleKeyDown);
      canvas?.removeEventListener("touchstart", handleTouchStart);
      canvas?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [phase, resetState, gameTick]);

  if (phase === "menu") {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="flex items-center gap-3 mb-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onExit}
            className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </motion.button>
          <h3 className="text-xl font-bold text-foreground">Hungry Snek</h3>
        </div>
        <p className="text-muted-foreground mb-2">Use arrow keys or swipe to move!</p>
        <p className="text-muted-foreground mb-6 text-sm">Eat apples to grow, but don't hit yourself or the walls.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPhase("play")}
          className="gradient-button text-primary-foreground font-bold px-8 py-4 rounded-xl text-xl"
        >
          Start!
        </motion.button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onExit}
          className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </motion.button>
        <h3 className="text-xl font-bold text-foreground">Hungry Snek</h3>
        <span className="ml-auto text-lg font-bold text-foreground">{scoreRef.current}</span>
      </div>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="w-full max-w-[400px] mx-auto rounded-2xl bg-black/50 border-2 border-white/10 touch-none select-none"
        style={{ aspectRatio: `${W}/${H}` }}
      />

      {phase === "dead" && (
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold text-red-400">Game Over!</p>
          <p className="text-muted-foreground">Final Score: {scoreRef.current}</p>
          <p className="text-muted-foreground text-sm">Length: {stateRef.current.snake.length}</p>
        </div>
      )}
    </div>
  );
}
