import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { drawRandomItem, rarityInfo, Rarity } from "@/data/gameData";
import { BlockBusterIcon } from "@/components/GameModeIcons";
import { useSound } from "@/hooks/useSound";

const CANVAS_W = 400;
const CANVAS_H = 500;
const PADDLE_W = 100;
const PADDLE_H = 12;
const BALL_R = 6;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_W = CANVAS_W / BRICK_COLS - 4;
const BRICK_H = 18;
const BRICK_PAD = 2;
const DROP_SIZE = 12;
const DROP_SPEED = 4;

const BRICK_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"];

interface CollectedItem {
  name: string;
  rarity: Rarity;
}

interface ItemDrop {
  x: number;
  y: number;
  name: string;
  rarity: Rarity;
  color: string;
}

interface BlockBusterViewProps {
  timeRemaining: number | null;
  onItemObtained: (name: string, rarity: Rarity) => void;
  onScoreChange?: (count: number) => void;
}

export function BlockBusterView({ timeRemaining, onItemObtained, onScoreChange }: BlockBusterViewProps) {
  const { playBounce, playBreak, playCollect, playGameStart, playDeath } = useSound();
  const soundRef = useRef({ playBounce, playBreak, playCollect, playDeath });
  soundRef.current = { playBounce, playBreak, playCollect, playDeath };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [collected, setCollected] = useState<CollectedItem[]>([]);
  const [started, setStarted] = useState(false);
  const committedRef = useRef(false);
  const collectedRef = useRef<CollectedItem[]>([]);
  const stateRef = useRef({
    paddleX: CANVAS_W / 2 - PADDLE_W / 2,
    ballX: CANVAS_W / 2,
    ballY: CANVAS_H - 40,
    ballDX: 3,
    ballDY: -3,
    bricks: [] as { x: number; y: number; alive: boolean; color: string }[],
    drops: [] as ItemDrop[],
    destroyed: 0,
  });
  const animRef = useRef<number>(0);
  const initializedRef = useRef(false);

  // Commit items when game ends
  useEffect(() => {
    if (timeRemaining === 0 && !committedRef.current) {
      committedRef.current = true;
      collectedRef.current.forEach((item) => onItemObtained(item.name, item.rarity));
    }
  }, [timeRemaining, onItemObtained]);

  // Report score when collected changes
  useEffect(() => {
    onScoreChange?.(collected.length);
  }, [collected.length, onScoreChange]);

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
    stateRef.current.drops = [];
  }, []);

  const respawnBricks = useCallback(() => {
    for (const brick of stateRef.current.bricks) {
      brick.alive = true;
    }
    stateRef.current.destroyed = 0;
  }, []);

  const addCollectedItem = useCallback((item: CollectedItem) => {
    collectedRef.current = [...collectedRef.current, item];
    setCollected([...collectedRef.current]);
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
    if (s.ballX <= BALL_R || s.ballX >= CANVAS_W - BALL_R) {
      s.ballDX *= -1;
      soundRef.current.playBounce();
    }
    if (s.ballY <= BALL_R) {
      s.ballDY *= -1;
      soundRef.current.playBounce();
    }

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
      soundRef.current.playBounce();
    }

    // Ball lost — respawn ball (no lives, infinite play)
    if (s.ballY >= CANVAS_H) {
      s.ballX = CANVAS_W / 2;
      s.ballY = CANVAS_H - 40;
      s.ballDX = 3 * (Math.random() > 0.5 ? 1 : -1);
      s.ballDY = -3;
      soundRef.current.playDeath();
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
        soundRef.current.playBreak();

        // Spawn item drop
        const item = drawRandomItem();
        s.drops.push({
          x: brick.x + BRICK_W / 2,
          y: brick.y + BRICK_H,
          name: item.name,
          rarity: item.rarity,
          color: rarityInfo[item.rarity]?.color || "#fff",
        });

        // Respawn all bricks if all destroyed
        if (s.destroyed >= BRICK_ROWS * BRICK_COLS) {
          respawnBricks();
        }
        break;
      }
    }

    // Update drops
    for (let i = s.drops.length - 1; i >= 0; i--) {
      const drop = s.drops[i];
      drop.y += DROP_SPEED;

      // Check if caught by paddle (generous hitbox)
      if (
        drop.y >= CANVAS_H - PADDLE_H - 24 &&
        drop.y <= CANVAS_H &&
        drop.x >= s.paddleX - DROP_SIZE &&
        drop.x <= s.paddleX + PADDLE_W + DROP_SIZE
      ) {
        addCollectedItem({ name: drop.name, rarity: drop.rarity });
        soundRef.current.playCollect();
        s.drops.splice(i, 1);
        continue;
      }

      // Remove if off screen
      if (drop.y > CANVAS_H) {
        s.drops.splice(i, 1);
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

    // Item drops (diamonds)
    for (const drop of s.drops) {
      ctx.fillStyle = drop.color;
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y - DROP_SIZE);
      ctx.lineTo(drop.x + DROP_SIZE * 0.6, drop.y);
      ctx.lineTo(drop.x, drop.y + DROP_SIZE);
      ctx.lineTo(drop.x - DROP_SIZE * 0.6, drop.y);
      ctx.closePath();
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

    // Score
    ctx.fillStyle = "#ffffff80";
    ctx.font = "14px Fredoka";
    ctx.textAlign = "right";
    ctx.fillText(`Caught: ${collectedRef.current.length}`, CANVAS_W - 8, CANVAS_H - 4);
    ctx.textAlign = "left";

    animRef.current = requestAnimationFrame(gameLoop);
  }, [addCollectedItem, respawnBricks]);

  // Stop game loop when time runs out
  useEffect(() => {
    if (timeRemaining === 0) {
      cancelAnimationFrame(animRef.current);
    }
  }, [timeRemaining]);

  // Start game loop and attach input handlers (runs once when started)
  useEffect(() => {
    if (!started || timeRemaining === 0) return;

    // Only initialize bricks once
    if (!initializedRef.current) {
      initializedRef.current = true;
      initBricks();
    }

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
  }, [started, gameLoop, initBricks]);

  if (!started) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 gap-4">
        <div className="flex items-center gap-2">
          <BlockBusterIcon size={36} />
          <h2 className="text-2xl font-bold">Block Buster</h2>
        </div>
        <p className="text-muted-foreground text-sm text-center">
          Break bricks to drop items! Catch them with your paddle to keep them.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { playGameStart(); setStarted(true); }}
          className="gradient-button text-primary-foreground font-bold px-8 py-4 rounded-xl text-xl"
        >
          Start!
        </motion.button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 gap-4">
      <h2 className="text-xl font-bold">🧱 Block Buster</h2>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="w-full max-w-[400px] mx-auto rounded-2xl bg-black/50 border-2 border-white/10 touch-none"
        style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}` }}
      />
      <div className="w-full max-w-md">
        <h3 className="text-sm font-bold text-muted-foreground mb-1">
          Items Caught: {collected.length}
        </h3>
        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
          {collected.map((item, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded bg-black/30 border border-white/10"
              style={{ color: rarityInfo[item.rarity]?.color }}
            >
              {item.name}
            </span>
          ))}
        </div>
      </div>

      {timeRemaining === 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <p className="text-xl font-bold text-primary">Time's Up!</p>
          <p className="text-muted-foreground">You caught {collected.length} items!</p>
        </motion.div>
      )}
    </div>
  );
}
