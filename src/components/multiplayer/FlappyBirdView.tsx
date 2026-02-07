import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { drawRandomItem, rarityInfo, Rarity } from "@/data/gameData";
import { FlappyBirdIcon } from "@/components/GameModeIcons";
import { useSound } from "@/hooks/useSound";

const CANVAS_W = 400;
const CANVAS_H = 600;

const GRAVITY = 0.4;
const FLAP_FORCE = -7;
const PIPE_SPEED = 2.5;
const PIPE_W = 50;
const GAP_H = 140;
const PIPE_SPACING = 220;
const BIRD_SIZE = 20;
const BIRD_X = 80;
const DROP_SIZE = 10;

interface CollectedItem {
  name: string;
  rarity: Rarity;
}

interface Pipe {
  x: number;
  gapY: number;
  scored: boolean;
}

interface Drop {
  x: number;
  y: number;
  name: string;
  rarity: Rarity;
  color: string;
}

interface FlappyBirdViewProps {
  timeRemaining: number | null;
  onItemObtained: (name: string, rarity: Rarity) => void;
  onScoreChange?: (count: number) => void;
}

export function FlappyBirdView({ timeRemaining, onItemObtained, onScoreChange }: FlappyBirdViewProps) {
  const { playBounce, playBreak, playCollect, playGameStart, playDeath } = useSound();
  const soundRef = useRef({ playBounce, playBreak, playCollect, playDeath });
  soundRef.current = { playBounce, playBreak, playCollect, playDeath };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [collected, setCollected] = useState<CollectedItem[]>([]);
  const [started, setStarted] = useState(false);
  const committedRef = useRef(false);
  const collectedRef = useRef<CollectedItem[]>([]);
  const animRef = useRef<number>(0);
  const initializedRef = useRef(false);

  const stateRef = useRef({
    birdY: CANVAS_H / 2,
    birdVY: 0,
    pipes: [] as Pipe[],
    drops: [] as Drop[],
    frameCount: 0,
  });

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

  const addCollectedItem = useCallback((item: CollectedItem) => {
    collectedRef.current = [...collectedRef.current, item];
    setCollected([...collectedRef.current]);
  }, []);

  const flap = useCallback(() => {
    stateRef.current.birdVY = FLAP_FORCE;
    soundRef.current.playBounce();
  }, []);

  const respawnBird = useCallback(() => {
    stateRef.current.birdY = CANVAS_H / 2;
    stateRef.current.birdVY = 0;
  }, []);

  const spawnPipe = useCallback(() => {
    const minGapY = GAP_H / 2 + 40;
    const maxGapY = CANVAS_H - GAP_H / 2 - 40;
    const gapY = minGapY + Math.random() * (maxGapY - minGapY);
    stateRef.current.pipes.push({ x: CANVAS_W + PIPE_W, gapY, scored: false });

    // Spawn a drop in the gap
    const item = drawRandomItem();
    stateRef.current.drops.push({
      x: CANVAS_W + PIPE_W + PIPE_W / 2,
      y: gapY,
      name: item.name,
      rarity: item.rarity,
      color: rarityInfo[item.rarity]?.color || "#fff",
    });
  }, []);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    s.frameCount++;

    // Gravity
    s.birdVY += GRAVITY;
    s.birdY += s.birdVY;

    // Spawn pipes
    const lastPipe = s.pipes[s.pipes.length - 1];
    if (!lastPipe || lastPipe.x < CANVAS_W - PIPE_SPACING) {
      spawnPipe();
    }

    // Move pipes & drops
    for (const pipe of s.pipes) {
      pipe.x -= PIPE_SPEED;
    }
    for (const drop of s.drops) {
      drop.x -= PIPE_SPEED;
    }

    // Remove off-screen pipes
    while (s.pipes.length > 0 && s.pipes[0].x < -PIPE_W) {
      s.pipes.shift();
    }

    // Ceiling / floor death
    if (s.birdY - BIRD_SIZE / 2 <= 0 || s.birdY + BIRD_SIZE / 2 >= CANVAS_H) {
      soundRef.current.playDeath();
      respawnBird();
    }

    // Pipe collision
    const birdLeft = BIRD_X - BIRD_SIZE / 2;
    const birdRight = BIRD_X + BIRD_SIZE / 2;
    const birdTop = s.birdY - BIRD_SIZE / 2;
    const birdBottom = s.birdY + BIRD_SIZE / 2;

    for (const pipe of s.pipes) {
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_W;
      const gapTop = pipe.gapY - GAP_H / 2;
      const gapBottom = pipe.gapY + GAP_H / 2;

      // Check horizontal overlap
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Check if bird is outside the gap
        if (birdTop < gapTop || birdBottom > gapBottom) {
          soundRef.current.playBreak();
          respawnBird();
          break;
        }
      }
    }

    // Collect drops
    for (let i = s.drops.length - 1; i >= 0; i--) {
      const drop = s.drops[i];
      const dx = BIRD_X - drop.x;
      const dy = s.birdY - drop.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < BIRD_SIZE / 2 + DROP_SIZE) {
        addCollectedItem({ name: drop.name, rarity: drop.rarity });
        soundRef.current.playCollect();
        s.drops.splice(i, 1);
        continue;
      }
      // Remove if off screen
      if (drop.x < -DROP_SIZE * 2) {
        s.drops.splice(i, 1);
      }
    }

    // --- Draw ---
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    grad.addColorStop(0, "#0c1445");
    grad.addColorStop(1, "#1a2980");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Pipes
    for (const pipe of s.pipes) {
      const gapTop = pipe.gapY - GAP_H / 2;
      const gapBottom = pipe.gapY + GAP_H / 2;

      // Top pipe
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(pipe.x, 0, PIPE_W, gapTop);
      // Top pipe cap
      ctx.fillStyle = "#16a34a";
      ctx.fillRect(pipe.x - 4, gapTop - 20, PIPE_W + 8, 20);

      // Bottom pipe
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(pipe.x, gapBottom, PIPE_W, CANVAS_H - gapBottom);
      // Bottom pipe cap
      ctx.fillStyle = "#16a34a";
      ctx.fillRect(pipe.x - 4, gapBottom, PIPE_W + 8, 20);
    }

    // Drops (diamonds)
    for (const drop of s.drops) {
      ctx.fillStyle = drop.color;
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y - DROP_SIZE);
      ctx.lineTo(drop.x + DROP_SIZE * 0.6, drop.y);
      ctx.lineTo(drop.x, drop.y + DROP_SIZE);
      ctx.lineTo(drop.x - DROP_SIZE * 0.6, drop.y);
      ctx.closePath();
      ctx.fill();
      // Glow
      ctx.shadowColor = drop.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Bird
    const birdAngle = Math.min(Math.max(s.birdVY * 3, -30), 70) * (Math.PI / 180);
    ctx.save();
    ctx.translate(BIRD_X, s.birdY);
    ctx.rotate(birdAngle);

    // Body
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.ellipse(0, 0, BIRD_SIZE / 2 + 2, BIRD_SIZE / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wing
    const wingFlutter = Math.sin(s.frameCount * 0.3) * 4;
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.ellipse(-4, wingFlutter - 2, 8, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(6, -4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(7, -4, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(BIRD_SIZE / 2 + 2, -2);
    ctx.lineTo(BIRD_SIZE / 2 + 10, 2);
    ctx.lineTo(BIRD_SIZE / 2 + 2, 5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Score text
    ctx.fillStyle = "#ffffff80";
    ctx.font = "14px Fredoka";
    ctx.textAlign = "right";
    ctx.fillText(`Collected: ${collectedRef.current.length}`, CANVAS_W - 8, CANVAS_H - 8);
    ctx.textAlign = "left";

    animRef.current = requestAnimationFrame(gameLoop);
  }, [addCollectedItem, respawnBird, spawnPipe]);

  // Stop game loop when time runs out
  useEffect(() => {
    if (timeRemaining === 0) {
      cancelAnimationFrame(animRef.current);
    }
  }, [timeRemaining]);

  // Start game loop and attach input handlers (runs once when started)
  useEffect(() => {
    if (!started || timeRemaining === 0) return;

    // Only initialize state once
    if (!initializedRef.current) {
      initializedRef.current = true;
      stateRef.current.birdY = CANVAS_H / 2;
      stateRef.current.birdVY = 0;
      stateRef.current.pipes = [];
      stateRef.current.drops = [];
      stateRef.current.frameCount = 0;
    }

    animRef.current = requestAnimationFrame(gameLoop);

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        flap();
      }
    };

    const handleClick = () => flap();

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      flap();
    };

    const canvas = canvasRef.current;
    window.addEventListener("keydown", handleKey);
    canvas?.addEventListener("click", handleClick);
    canvas?.addEventListener("touchstart", handleTouch, { passive: false });

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("keydown", handleKey);
      canvas?.removeEventListener("click", handleClick);
      canvas?.removeEventListener("touchstart", handleTouch);
    };
  }, [started, gameLoop, flap]);

  if (!started) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 gap-4">
        <div className="flex items-center gap-2">
          <FlappyBirdIcon size={36} />
          <h2 className="text-2xl font-bold">Flappy Bird</h2>
        </div>
        <p className="text-muted-foreground text-sm text-center">
          Tap or press Space to flap! Fly through the pipes and collect items in the gaps.
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
      <h2 className="text-xl font-bold">🐦 Flappy Bird</h2>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="w-full max-w-[400px] mx-auto rounded-2xl border-2 border-white/10 touch-none cursor-pointer"
        style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}` }}
      />
      <div className="w-full max-w-md">
        <h3 className="text-sm font-bold text-muted-foreground mb-1">
          Items Collected: {collected.length}
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
          <p className="text-muted-foreground">You collected {collected.length} items!</p>
        </motion.div>
      )}
    </div>
  );
}
