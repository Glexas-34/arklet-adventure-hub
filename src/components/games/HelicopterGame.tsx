import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

const W = 400;
const H = 300;
const HELI_X = 80;
const HELI_W = 30;
const HELI_H = 18;
const GRAVITY = 0.35;
const LIFT = -0.7;
const WALL_WIDTH = 40;
const INITIAL_GAP = 140;
const MIN_GAP = 60;
const GAP_SHRINK = 0.15;
const WALL_SPEED = 2.5;
const MAX_SCORE = 200;

interface Wall {
  x: number;
  gapY: number;
  gapH: number;
  passed: boolean;
}

export function HelicopterGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"menu" | "play" | "dead">("menu");
  const stateRef = useRef({
    heliY: H / 2,
    heliVY: 0,
    walls: [] as Wall[],
    distance: 0,
    pressing: false,
    score: 0,
    wallTimer: 0,
  });
  const animRef = useRef(0);
  const scoreRef = useRef(0);

  const resetState = useCallback(() => {
    stateRef.current = {
      heliY: H / 2,
      heliVY: 0,
      walls: [],
      distance: 0,
      pressing: false,
      score: 0,
      wallTimer: 0,
    };
    scoreRef.current = 0;
  }, []);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    // Physics
    if (s.pressing) {
      s.heliVY += LIFT;
    } else {
      s.heliVY += GRAVITY;
    }
    s.heliVY = Math.max(-5, Math.min(5, s.heliVY));
    s.heliY += s.heliVY;
    s.distance += WALL_SPEED;

    // Score
    const newScore = Math.floor(s.distance / 10);
    if (newScore !== s.score) {
      s.score = newScore;
      scoreRef.current = newScore;
      onScoreChange?.(newScore);
    }

    // Generate walls
    s.wallTimer += WALL_SPEED;
    if (s.wallTimer >= 160) {
      s.wallTimer = 0;
      const gapH = Math.max(MIN_GAP, INITIAL_GAP - s.walls.length * GAP_SHRINK);
      const gapY = 40 + Math.random() * (H - 80 - gapH);
      s.walls.push({ x: W + WALL_WIDTH, gapY, gapH, passed: false });
    }

    // Move walls
    for (const wall of s.walls) {
      wall.x -= WALL_SPEED;
    }
    // Remove off-screen walls
    s.walls = s.walls.filter((w) => w.x + WALL_WIDTH > -10);

    // Collision detection - ceiling/floor
    if (s.heliY < 0 || s.heliY + HELI_H > H) {
      setPhase("dead");
      onGameEnd({
        score: s.score,
        maxScore: MAX_SCORE,
        normalizedScore: Math.min(1, s.score / MAX_SCORE),
      });
      return;
    }

    // Collision detection - walls
    for (const wall of s.walls) {
      if (
        HELI_X + HELI_W > wall.x &&
        HELI_X < wall.x + WALL_WIDTH
      ) {
        // Check if helicopter is in the gap
        if (s.heliY < wall.gapY || s.heliY + HELI_H > wall.gapY + wall.gapH) {
          setPhase("dead");
          onGameEnd({
            score: s.score,
            maxScore: MAX_SCORE,
            normalizedScore: Math.min(1, s.score / MAX_SCORE),
          });
          return;
        }
      }
    }

    // --- Draw ---
    ctx.clearRect(0, 0, W, H);

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0a0a1a");
    bg.addColorStop(1, "#1a0a2e");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Stars
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    for (let i = 0; i < 30; i++) {
      const sx = ((i * 137 + s.distance * 0.2) % (W + 20)) - 10;
      const sy = (i * 97) % H;
      ctx.beginPath();
      ctx.arc(sx, sy, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Walls
    for (const wall of s.walls) {
      // Top wall
      const topGrad = ctx.createLinearGradient(wall.x, 0, wall.x + WALL_WIDTH, 0);
      topGrad.addColorStop(0, "#6b21a8");
      topGrad.addColorStop(1, "#9333ea");
      ctx.fillStyle = topGrad;
      ctx.fillRect(wall.x, 0, WALL_WIDTH, wall.gapY);

      // Bottom wall
      ctx.fillStyle = topGrad;
      ctx.fillRect(wall.x, wall.gapY + wall.gapH, WALL_WIDTH, H - wall.gapY - wall.gapH);

      // Glow edges
      ctx.strokeStyle = "#c084fc";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(wall.x, wall.gapY);
      ctx.lineTo(wall.x + WALL_WIDTH, wall.gapY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(wall.x, wall.gapY + wall.gapH);
      ctx.lineTo(wall.x + WALL_WIDTH, wall.gapY + wall.gapH);
      ctx.stroke();
    }

    // Helicopter body (neon green)
    ctx.fillStyle = "#22ff44";
    ctx.shadowColor = "#22ff44";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.roundRect(HELI_X, s.heliY, HELI_W, HELI_H, 4);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Helicopter tail
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(HELI_X - 8, s.heliY + 4, 10, 6);

    // Helicopter rotor (animated)
    ctx.strokeStyle = "#88ffaa";
    ctx.lineWidth = 2;
    const rotorPhase = (Date.now() / 30) % 20;
    ctx.beginPath();
    ctx.moveTo(HELI_X + 4, s.heliY);
    ctx.lineTo(HELI_X + HELI_W - 4 + (rotorPhase > 10 ? 6 : -6), s.heliY - 4);
    ctx.stroke();

    // Cockpit window
    ctx.fillStyle = "#bbffdd";
    ctx.beginPath();
    ctx.arc(HELI_X + HELI_W - 6, s.heliY + 6, 4, 0, Math.PI * 2);
    ctx.fill();

    // HUD
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Fredoka, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`${s.score}m`, 10, 24);

    ctx.fillStyle = "#ffffff60";
    ctx.font = "12px Fredoka, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`Best: ${MAX_SCORE}m`, W - 10, 24);

    // Ceiling/floor lines
    ctx.strokeStyle = "#ef444480";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 1);
    ctx.lineTo(W, 1);
    ctx.moveTo(0, H - 1);
    ctx.lineTo(W, H - 1);
    ctx.stroke();

    animRef.current = requestAnimationFrame(gameLoop);
  }, [onGameEnd, onScoreChange]);

  useEffect(() => {
    if (phase !== "play") return;

    resetState();
    animRef.current = requestAnimationFrame(gameLoop);

    const handleDown = () => {
      stateRef.current.pressing = true;
    };
    const handleUp = () => {
      stateRef.current.pressing = false;
    };

    const canvas = canvasRef.current;
    canvas?.addEventListener("mousedown", handleDown);
    canvas?.addEventListener("mouseup", handleUp);
    canvas?.addEventListener("mouseleave", handleUp);
    canvas?.addEventListener("touchstart", handleDown, { passive: true });
    canvas?.addEventListener("touchend", handleUp, { passive: true });

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") handleDown();
    });
    window.addEventListener("keyup", (e) => {
      if (e.code === "Space") handleUp();
    });

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas?.removeEventListener("mousedown", handleDown);
      canvas?.removeEventListener("mouseup", handleUp);
      canvas?.removeEventListener("mouseleave", handleUp);
      canvas?.removeEventListener("touchstart", handleDown);
      canvas?.removeEventListener("touchend", handleUp);
    };
  }, [phase, resetState, gameLoop]);

  if (phase === "menu") {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="flex items-center gap-3 mb-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
            className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft size={20} />
          </motion.button>
          <h3 className="text-xl font-bold text-foreground">Choppa Don't Drop</h3>
        </div>
        <p className="text-muted-foreground mb-2">Tap or hold to fly up, release to fall!</p>
        <p className="text-muted-foreground mb-6 text-sm">Avoid the walls and fly as far as you can.</p>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setPhase("play")}
          className="gradient-button text-primary-foreground font-bold px-8 py-4 rounded-xl text-xl">
          Start!
        </motion.button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
          className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ArrowLeft size={20} />
        </motion.button>
        <h3 className="text-xl font-bold text-foreground">Choppa Don't Drop</h3>
        <span className="ml-auto text-lg font-bold text-foreground">{scoreRef.current}m</span>
      </div>

      <canvas ref={canvasRef} width={W} height={H}
        className="w-full max-w-[400px] mx-auto rounded-2xl bg-black/50 border-2 border-white/10 touch-none select-none"
        style={{ aspectRatio: `${W}/${H}` }} />

      {phase === "dead" && (
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold text-red-400">Crashed!</p>
          <p className="text-muted-foreground">Distance: {scoreRef.current}m</p>
        </div>
      )}
    </div>
  );
}
