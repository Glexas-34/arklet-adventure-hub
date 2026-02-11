import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

const W = 400;
const H = 400;
const MAX_SCORE = 80;
const GAME_DURATION = 30;
const LERP_SPEED = 0.08;
const SEGMENT_SPACING = 10;
const WORM_RADIUS = 8;
const MAX_SEGMENTS = 30;
const INITIAL_SEGMENTS = 5;

interface FoodItem {
  x: number;
  y: number;
  type: "green" | "blue" | "gold";
  radius: number;
  points: number;
  pulse: number;
}

interface Segment {
  x: number;
  y: number;
}

function spawnFood(): FoodItem {
  const rand = Math.random();
  let type: FoodItem["type"];
  let points: number;
  if (rand < 0.55) { type = "green"; points = 1; }
  else if (rand < 0.85) { type = "blue"; points = 3; }
  else { type = "gold"; points = 5; }

  return {
    x: 30 + Math.random() * (W - 60),
    y: 30 + Math.random() * (H - 60),
    type,
    points,
    radius: type === "gold" ? 10 : type === "blue" ? 8 : 7,
    pulse: Math.random() * Math.PI * 2,
  };
}

export function EffingWormsGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"menu" | "playing" | "done">("menu");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

  const stateRef = useRef({
    segments: [] as Segment[],
    targetX: W / 2,
    targetY: H / 2,
    food: [] as FoodItem[],
    score: 0,
    dirtPatches: [] as { x: number; y: number; r: number; shade: number }[],
    time: 0,
  });
  const animRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const initGame = useCallback(() => {
    const segments: Segment[] = [];
    for (let i = 0; i < INITIAL_SEGMENTS; i++) {
      segments.push({ x: W / 2 - i * SEGMENT_SPACING, y: H / 2 });
    }

    // Generate dirt patches for background texture
    const patches: { x: number; y: number; r: number; shade: number }[] = [];
    for (let i = 0; i < 40; i++) {
      patches.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 10 + Math.random() * 30,
        shade: Math.random() * 0.15,
      });
    }

    // Spawn initial food
    const food: FoodItem[] = [];
    for (let i = 0; i < 8; i++) {
      food.push(spawnFood());
    }

    stateRef.current = {
      segments,
      targetX: W / 2,
      targetY: H / 2,
      food,
      score: 0,
      dirtPatches: patches,
      time: 0,
    };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    // Dirt background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#5c3a1e");
    bg.addColorStop(0.5, "#4a2e16");
    bg.addColorStop(1, "#3d2512");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Dirt patches for texture
    for (const patch of s.dirtPatches) {
      ctx.fillStyle = `rgba(0,0,0,${patch.shade})`;
      ctx.beginPath();
      ctx.arc(patch.x, patch.y, patch.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Small rocks / pebbles
    ctx.fillStyle = "rgba(100,70,40,0.4)";
    for (let i = 0; i < 20; i++) {
      const rx = (i * 97 + 13) % W;
      const ry = (i * 73 + 29) % H;
      ctx.beginPath();
      ctx.arc(rx, ry, 2 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw food items
    const now = s.time;
    for (const food of s.food) {
      const pulseScale = 1 + Math.sin(now * 4 + food.pulse) * 0.15;
      const r = food.radius * pulseScale;

      // Glow
      let color: string;
      let glowColor: string;
      if (food.type === "green") {
        color = "#22c55e";
        glowColor = "rgba(34,197,94,0.3)";
      } else if (food.type === "blue") {
        color = "#3b82f6";
        glowColor = "rgba(59,130,246,0.3)";
      } else {
        color = "#fbbf24";
        glowColor = "rgba(251,191,36,0.4)";
      }

      ctx.fillStyle = glowColor;
      ctx.beginPath();
      ctx.arc(food.x, food.y, r + 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(food.x, food.y, r, 0, Math.PI * 2);
      ctx.fill();

      // Highlight
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.arc(food.x - r * 0.25, food.y - r * 0.25, r * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Point label for non-green
      if (food.type !== "green") {
        ctx.fillStyle = "#fff";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`+${food.points}`, food.x, food.y + r + 12);
      }
    }

    // Draw worm body (back to front)
    for (let i = s.segments.length - 1; i >= 0; i--) {
      const seg = s.segments[i];
      const t = i / s.segments.length;
      const radius = WORM_RADIUS * (1 - t * 0.4); // Taper toward tail

      // Body color: magenta/pink gradient
      const hue = 330 + t * 20;
      const light = 55 - t * 15;
      ctx.fillStyle = `hsl(${hue}, 80%, ${light}%)`;
      ctx.beginPath();
      ctx.arc(seg.x, seg.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Segment shine
      if (i % 2 === 0) {
        ctx.fillStyle = `rgba(255,255,255,${0.15 - t * 0.1})`;
        ctx.beginPath();
        ctx.arc(seg.x - radius * 0.2, seg.y - radius * 0.3, radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Worm head details
    if (s.segments.length > 0) {
      const head = s.segments[0];

      // Eyes
      const dx = s.targetX - head.x;
      const dy = s.targetY - head.y;
      const ang = Math.atan2(dy, dx);
      const eyeDist = 4;

      for (const side of [-1, 1]) {
        const ex = head.x + Math.cos(ang + side * 0.6) * eyeDist;
        const ey = head.y + Math.sin(ang + side * 0.6) * eyeDist;
        // White
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
        ctx.fill();
        // Pupil
        ctx.fillStyle = "#111";
        ctx.beginPath();
        ctx.arc(ex + Math.cos(ang) * 1.2, ey + Math.sin(ang) * 1.2, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Mouth
      ctx.strokeStyle = "#8b0040";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(
        head.x + Math.cos(ang) * 5,
        head.y + Math.sin(ang) * 5,
        3, ang - 0.5, ang + 0.5
      );
      ctx.stroke();
    }

    // HUD
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.beginPath();
    ctx.roundRect(10, 10, 120, 28, 6);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${s.score}`, 20, 29);

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.beginPath();
    ctx.roundRect(W - 100, 10, 90, 28, 6);
    ctx.fill();
    ctx.fillStyle = timeLeft <= 5 ? "#ef4444" : "#fbbf24";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`${timeLeft}s`, W - 20, 29);

    // Worm length indicator
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.roundRect(10, H - 24, 80, 16, 4);
    ctx.fill();
    ctx.fillStyle = "#e879a0";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Length: ${s.segments.length}`, 16, H - 12);
  }, [timeLeft]);

  // Game loop
  useEffect(() => {
    if (phase !== "playing") return;

    const loop = () => {
      const s = stateRef.current;
      s.time += 1 / 60;

      // Move head toward target with lerp
      const head = s.segments[0];
      head.x += (s.targetX - head.x) * LERP_SPEED;
      head.y += (s.targetY - head.y) * LERP_SPEED;

      // Body follows: each segment follows the one before it
      for (let i = 1; i < s.segments.length; i++) {
        const prev = s.segments[i - 1];
        const curr = s.segments[i];
        const dx = prev.x - curr.x;
        const dy = prev.y - curr.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > SEGMENT_SPACING) {
          const ratio = SEGMENT_SPACING / dist;
          curr.x = prev.x - dx * ratio;
          curr.y = prev.y - dy * ratio;
        }
      }

      // Check food collision
      for (let i = s.food.length - 1; i >= 0; i--) {
        const food = s.food[i];
        const dx = head.x - food.x;
        const dy = head.y - food.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < WORM_RADIUS + food.radius) {
          s.score += food.points;
          onScoreChange?.(s.score);
          setScore(s.score);

          // Add body segment
          if (s.segments.length < MAX_SEGMENTS) {
            const tail = s.segments[s.segments.length - 1];
            s.segments.push({ x: tail.x, y: tail.y });
          }

          // Remove food and spawn new one
          s.food.splice(i, 1);
          s.food.push(spawnFood());
        }
      }

      // Keep some food on screen
      while (s.food.length < 6) {
        s.food.push(spawnFood());
      }

      draw();
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, draw, onScoreChange]);

  // Timer
  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setPhase("done");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  // Game end
  useEffect(() => {
    if (phase !== "done") return;
    cancelAnimationFrame(animRef.current);
    const finalScore = stateRef.current.score;
    const timer = setTimeout(() => {
      onGameEnd({
        score: finalScore,
        maxScore: MAX_SCORE,
        normalizedScore: Math.min(1, finalScore / MAX_SCORE),
      });
    }, 1200);
    return () => clearTimeout(timer);
  }, [phase, onGameEnd]);

  // Mouse/touch tracking
  const updateTarget = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    stateRef.current.targetX = (clientX - rect.left) * scaleX;
    stateRef.current.targetY = (clientY - rect.top) * scaleY;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    updateTarget(e.clientX, e.clientY);
  }, [updateTarget]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    updateTarget(touch.clientX, touch.clientY);
  }, [updateTarget]);

  const startGame = () => {
    initGame();
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setPhase("playing");
  };

  if (phase === "menu") {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="flex items-center gap-3 mb-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
            className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft size={20} />
          </motion.button>
          <h3 className="text-xl font-bold text-foreground">Worm Nom Nom</h3>
        </div>
        <p className="text-muted-foreground mb-2">Control a hungry worm underground!</p>
        <p className="text-muted-foreground mb-6 text-sm">
          Move your mouse or finger to guide the worm. Eat food to grow and score points!
          Green = 1pt, Blue = 3pts, Gold = 5pts. 30 seconds!
        </p>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={startGame}
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
        <h3 className="text-xl font-bold text-foreground">Worm Nom Nom</h3>
        <span className="ml-auto text-lg font-bold text-foreground">{score} pts</span>
      </div>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onTouchStart={(e) => {
          e.preventDefault();
          const touch = e.touches[0];
          updateTarget(touch.clientX, touch.clientY);
        }}
        className="w-full max-w-[400px] aspect-square mx-auto rounded-2xl bg-black/50 border-2 border-white/10 touch-none cursor-none"
      />

      {phase === "done" && (
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold text-pink-400">
            Time&apos;s up! Score: {score}
          </p>
        </div>
      )}
    </div>
  );
}
