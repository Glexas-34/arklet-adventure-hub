import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

type GamePhase = "menu" | "play" | "dead";

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 300;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 12;
const BALL_RADIUS = 6;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_WIDTH = 45;
const BRICK_HEIGHT = 15;
const BRICK_PADDING = 5;
const BRICK_OFFSET_TOP = 40;
const BRICK_OFFSET_LEFT = 10;
const MAX_SCORE = 40;

const BRICK_COLORS = [
  "#ff0080", // Pink
  "#ff8800", // Orange
  "#ffff00", // Yellow
  "#00ff00", // Green
  "#0088ff", // Blue
];

interface Brick {
  x: number;
  y: number;
  status: boolean;
  color: string;
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export function BrickBreakerGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [score, setScore] = useState(0);
  const [paddleX, setPaddleX] = useState(CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2);
  const ballRef = useRef<Ball>({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT - 40,
    dx: 3,
    dy: -3,
  });
  const bricksRef = useRef<Brick[][]>([]);
  const animationFrameRef = useRef<number>();

  // Initialize bricks
  const initBricks = useCallback(() => {
    const bricks: Brick[][] = [];
    for (let row = 0; row < BRICK_ROWS; row++) {
      bricks[row] = [];
      for (let col = 0; col < BRICK_COLS; col++) {
        bricks[row][col] = {
          x: BRICK_OFFSET_LEFT + col * (BRICK_WIDTH + BRICK_PADDING),
          y: BRICK_OFFSET_TOP + row * (BRICK_HEIGHT + BRICK_PADDING),
          status: true,
          color: BRICK_COLORS[row],
        };
      }
    }
    bricksRef.current = bricks;
  }, []);

  // Draw ball
  const drawBall = useCallback((ctx: CanvasRenderingContext2D, ball: Ball) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#00ffff";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00ffff";
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.closePath();
  }, []);

  // Draw paddle
  const drawPaddle = useCallback((ctx: CanvasRenderingContext2D, x: number) => {
    ctx.beginPath();
    ctx.rect(x, CANVAS_HEIGHT - 25, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = "#ff00ff";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ff00ff";
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.closePath();
  }, []);

  // Draw bricks
  const drawBricks = useCallback((ctx: CanvasRenderingContext2D) => {
    bricksRef.current.forEach((row) => {
      row.forEach((brick) => {
        if (brick.status) {
          ctx.beginPath();
          ctx.rect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
          ctx.fillStyle = brick.color;
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.closePath();
        }
      });
    });
  }, []);

  // Collision detection
  const collisionDetection = useCallback(() => {
    let bricksDestroyed = 0;
    bricksRef.current.forEach((row) => {
      row.forEach((brick) => {
        if (brick.status) {
          const ball = ballRef.current;
          if (
            ball.x > brick.x &&
            ball.x < brick.x + BRICK_WIDTH &&
            ball.y > brick.y &&
            ball.y < brick.y + BRICK_HEIGHT
          ) {
            ball.dy = -ball.dy;
            brick.status = false;
            bricksDestroyed++;

            const newScore = score + 1;
            setScore(newScore);
            if (onScoreChange) {
              onScoreChange(newScore);
            }

            // Increase ball speed slightly
            const speedMultiplier = 1.02;
            ball.dx *= speedMultiplier;
            ball.dy *= speedMultiplier;
          }
        }
      });
    });
    return bricksDestroyed;
  }, [score, onScoreChange]);

  // Game loop
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ball = ballRef.current;

    // Clear canvas
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw everything
    drawBricks(ctx);
    drawBall(ctx, ball);
    drawPaddle(ctx, paddleX);

    // Collision detection with bricks
    collisionDetection();

    // Ball movement
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision
    if (ball.x + ball.dx > CANVAS_WIDTH - BALL_RADIUS || ball.x + ball.dx < BALL_RADIUS) {
      ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < BALL_RADIUS) {
      ball.dy = -ball.dy;
    }

    // Paddle collision
    if (ball.y + ball.dy > CANVAS_HEIGHT - 25 - BALL_RADIUS) {
      if (ball.x > paddleX && ball.x < paddleX + PADDLE_WIDTH) {
        // Hit the paddle
        ball.dy = -ball.dy;
        // Add some angle variation based on where the ball hits the paddle
        const hitPos = (ball.x - paddleX) / PADDLE_WIDTH;
        ball.dx = (hitPos - 0.5) * 6;
      } else if (ball.y + ball.dy > CANVAS_HEIGHT - BALL_RADIUS) {
        // Ball lost
        setPhase("dead");
        const normalizedScore = score / MAX_SCORE;
        onGameEnd({
          score,
          maxScore: MAX_SCORE,
          normalizedScore,
        });
        return;
      }
    }

    // Check if all bricks are destroyed
    const allBricksDestroyed = bricksRef.current.every((row) =>
      row.every((brick) => !brick.status)
    );
    if (allBricksDestroyed) {
      setPhase("dead");
      const normalizedScore = MAX_SCORE / MAX_SCORE;
      onGameEnd({
        score: MAX_SCORE,
        maxScore: MAX_SCORE,
        normalizedScore,
      });
      return;
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [paddleX, score, collisionDetection, drawBall, drawBricks, drawPaddle, onGameEnd]);

  // Handle mouse/touch movement
  const handlePointerMove = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (phase !== "play") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let clientX: number;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const x = clientX - rect.left;
    const newPaddleX = Math.max(0, Math.min(x - PADDLE_WIDTH / 2, CANVAS_WIDTH - PADDLE_WIDTH));
    setPaddleX(newPaddleX);
  }, [phase]);

  // Start game
  const startGame = useCallback(() => {
    setPhase("play");
    setScore(0);
    initBricks();
    ballRef.current = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 40,
      dx: 3,
      dy: -3,
    };
    setPaddleX(CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2);
    if (onScoreChange) {
      onScoreChange(0);
    }
  }, [initBricks, onScoreChange]);

  // Game loop effect
  useEffect(() => {
    if (phase === "play") {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [phase, gameLoop]);

  return (
    <div className="w-full min-h-[400px] bg-black/95 flex items-center justify-center rounded-2xl relative">
      <div className="relative">
        {/* Back button */}
        <button
          onClick={onExit}
          className="absolute -top-12 left-0 text-white/70 hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Menu screen */}
        {phase === "menu" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-8"
          >
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
              Block Bonanza
            </h1>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xl font-bold rounded-lg hover:scale-105 transition-transform shadow-lg shadow-pink-500/50"
            >
              Start Game
            </button>
          </motion.div>
        )}

        {/* Game screen */}
        {(phase === "play" || phase === "dead") && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-white text-2xl font-bold">
              Score: {score} / {MAX_SCORE}
            </div>
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              onMouseMove={handlePointerMove}
              onTouchMove={handlePointerMove}
              className="border-2 border-purple-500 rounded-lg shadow-lg shadow-purple-500/50 cursor-none"
              style={{ touchAction: "none" }}
            />
            {phase === "dead" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-black/90 border-2 border-purple-500 rounded-lg p-8 text-center">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {score === MAX_SCORE ? "Perfect!" : "Game Over"}
                  </h2>
                  <p className="text-xl text-white/80 mb-6">
                    Final Score: {score} / {MAX_SCORE}
                  </p>
                  <button
                    onClick={startGame}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg hover:scale-105 transition-transform"
                  >
                    Play Again
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
