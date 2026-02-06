import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";
import { useSound } from "@/hooks/useSound";

const CANVAS_W = 400;
const CANVAS_H = 500;
const PADDLE_W = 80;
const PADDLE_H = 12;
const BALL_R = 6;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_W = CANVAS_W / BRICK_COLS - 4;
const BRICK_H = 18;
const BRICK_PAD = 2;
const TOTAL_BRICKS = BRICK_ROWS * BRICK_COLS;

const BRICK_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"];

export function BrickBreaker({ onGameEnd, onExit }: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const stateRef = useRef({
    paddleX: CANVAS_W / 2 - PADDLE_W / 2,
    ballX: CANVAS_W / 2,
    ballY: CANVAS_H - 40,
    ballDX: 3,
    ballDY: -3,
    bricks: [] as { x: number; y: number; alive: boolean; color: string }[],
    destroyed: 0,
    lives: 3,
  });
  const animRef = useRef<number>(0);
  const { playCorrect, playTick } = useSound();
  const touchRef = useRef<number | null>(null);

  const initBricks = useCallback(() => {
    const bricks: { x: number; y: number; alive: boolean; color: string }[] = [];
    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        bricks.push({
          x: c * (BRICK_W + BRICK_PAD * 2) + BRICK_PAD + 2,
          y: r * (BRICK_H + BRICK_PAD * 2) + BRICK_PAD + 30,
          alive: true,
          color: BRICK_COLORS[r],
        });
      }
    }
    stateRef.current.bricks = bricks;
    stateRef.current.destroyed = 0;
  }, []);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    // Move ball
    s.ballX += s.ballDX;
    s.ballY += s.ballDY;

    // Wall collisions
    if (s.ballX <= BALL_R || s.ballX >= CANVAS_W - BALL_R) s.ballDX *= -1;
    if (s.ballY <= BALL_R) s.ballDY *= -1;

    // Paddle collision
    if (
      s.ballY >= CANVAS_H - PADDLE_H - 20 - BALL_R &&
      s.ballY <= CANVAS_H - 20 &&
      s.ballX >= s.paddleX &&
      s.ballX <= s.paddleX + PADDLE_W
    ) {
      s.ballDY = -Math.abs(s.ballDY);
      const hitPos = (s.ballX - s.paddleX) / PADDLE_W - 0.5;
      s.ballDX = hitPos * 6;
      playTick();
    }

    // Ball lost
    if (s.ballY >= CANVAS_H) {
      s.lives--;
      if (s.lives <= 0) {
        setGameOver(true);
        onGameEnd({
          score: s.destroyed,
          maxScore: TOTAL_BRICKS,
          normalizedScore: s.destroyed / TOTAL_BRICKS,
        });
        return;
      }
      s.ballX = CANVAS_W / 2;
      s.ballY = CANVAS_H - 40;
      s.ballDX = 3 * (Math.random() > 0.5 ? 1 : -1);
      s.ballDY = -3;
    }

    // Brick collisions
    for (const brick of s.bricks) {
      if (!brick.alive) continue;
      if (
        s.ballX >= brick.x &&
        s.ballX <= brick.x + BRICK_W &&
        s.ballY >= brick.y &&
        s.ballY <= brick.y + BRICK_H
      ) {
        brick.alive = false;
        s.destroyed++;
        s.ballDY *= -1;
        playCorrect();

        if (s.destroyed >= TOTAL_BRICKS) {
          setGameOver(true);
          onGameEnd({
            score: s.destroyed,
            maxScore: TOTAL_BRICKS,
            normalizedScore: 1,
          });
          return;
        }
        break;
      }
    }

    // Draw
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Bricks
    for (const brick of s.bricks) {
      if (!brick.alive) continue;
      ctx.fillStyle = brick.color;
      ctx.beginPath();
      ctx.roundRect(brick.x, brick.y, BRICK_W, BRICK_H, 4);
      ctx.fill();
    }

    // Paddle
    ctx.fillStyle = "#06b6d4";
    ctx.beginPath();
    ctx.roundRect(s.paddleX, CANVAS_H - PADDLE_H - 20, PADDLE_W, PADDLE_H, 6);
    ctx.fill();

    // Ball
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(s.ballX, s.ballY, BALL_R, 0, Math.PI * 2);
    ctx.fill();

    // Lives
    ctx.fillStyle = "#ffffff80";
    ctx.font = "14px Fredoka";
    ctx.fillText(`Lives: ${"❤️".repeat(s.lives)}`, 8, CANVAS_H - 4);

    // Score
    ctx.textAlign = "right";
    ctx.fillText(`${s.destroyed}/${TOTAL_BRICKS}`, CANVAS_W - 8, CANVAS_H - 4);
    ctx.textAlign = "left";

    animRef.current = requestAnimationFrame(gameLoop);
  }, [onGameEnd, playCorrect, playTick]);

  useEffect(() => {
    if (!started || gameOver) return;

    initBricks();
    animRef.current = requestAnimationFrame(gameLoop);

    const handleMouse = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_W / rect.width;
      stateRef.current.paddleX = Math.max(
        0,
        Math.min(CANVAS_W - PADDLE_W, (e.clientX - rect.left) * scaleX - PADDLE_W / 2)
      );
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_W / rect.width;
      const touch = e.touches[0];
      stateRef.current.paddleX = Math.max(
        0,
        Math.min(CANVAS_W - PADDLE_W, (touch.clientX - rect.left) * scaleX - PADDLE_W / 2)
      );
    };

    const canvas = canvasRef.current;
    canvas?.addEventListener("mousemove", handleMouse);
    canvas?.addEventListener("touchmove", handleTouch, { passive: false });
    canvas?.addEventListener("touchstart", handleTouch, { passive: false });

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas?.removeEventListener("mousemove", handleMouse);
      canvas?.removeEventListener("touchmove", handleTouch);
      canvas?.removeEventListener("touchstart", handleTouch);
    };
  }, [started, gameOver, initBricks, gameLoop]);

  if (!started) {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="flex items-center gap-3 mb-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
            className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft size={20} />
          </motion.button>
          <h3 className="text-xl font-bold text-foreground">🧱 Brick Breaker</h3>
        </div>
        <p className="text-muted-foreground mb-6">Move your mouse or finger to control the paddle!</p>
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
        <h3 className="text-xl font-bold text-foreground">🧱 Brick Breaker</h3>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="w-full max-w-[400px] mx-auto rounded-2xl bg-black/50 border-2 border-white/10 touch-none"
        style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}` }}
      />
    </div>
  );
}
