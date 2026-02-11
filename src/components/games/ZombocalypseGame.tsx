import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

const W = 400;
const H = 400;
const GAME_DURATION = 30;
const MAX_SCORE = 50;
const CENTER_X = W / 2;
const CENTER_Y = H / 2;
const DANGER_RADIUS = 100;
const ZOMBIE_RADIUS = 16;
const HIT_RADIUS = 25;

interface Zombie {
  id: number;
  x: number;
  y: number;
  speed: number;
  alive: boolean;
}

export function ZombocalypseGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"menu" | "play" | "done">("menu");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const zombiesRef = useRef<Zombie[]>([]);
  const nextIdRef = useRef(0);
  const animRef = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const timeRef = useRef(GAME_DURATION);
  const lastSpawnRef = useRef(0);
  const gameStartRef = useRef(0);
  const killFlashesRef = useRef<{ x: number; y: number; frame: number }[]>([]);

  // Keep refs in sync
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { livesRef.current = lives; }, [lives]);
  useEffect(() => { timeRef.current = timeLeft; }, [timeLeft]);

  const getCanvasPos = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (W / rect.width),
      y: (clientY - rect.top) * (H / rect.height),
    };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (phase !== "play") return;
    const pos = getCanvasPos(e.clientX, e.clientY);

    let hitAny = false;
    for (const z of zombiesRef.current) {
      if (!z.alive) continue;
      const dx = pos.x - z.x;
      const dy = pos.y - z.y;
      if (Math.sqrt(dx * dx + dy * dy) < HIT_RADIUS) {
        z.alive = false;
        hitAny = true;
        killFlashesRef.current.push({ x: z.x, y: z.y, frame: 0 });
        const newScore = scoreRef.current + 1;
        setScore(newScore);
        onScoreChange?.(newScore);
        break; // Only kill one per click
      }
    }

    if (!hitAny) {
      // Miss flash at click position
      killFlashesRef.current.push({ x: pos.x, y: pos.y, frame: -1 }); // -1 = miss indicator
    }
  }, [phase, getCanvasPos, onScoreChange]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, W, H);

    // Grid lines for atmosphere
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Danger zone (center)
    const dangerGrad = ctx.createRadialGradient(CENTER_X, CENTER_Y, 0, CENTER_X, CENTER_Y, DANGER_RADIUS);
    dangerGrad.addColorStop(0, "rgba(239, 68, 68, 0.15)");
    dangerGrad.addColorStop(0.7, "rgba(239, 68, 68, 0.08)");
    dangerGrad.addColorStop(1, "rgba(239, 68, 68, 0.02)");
    ctx.fillStyle = dangerGrad;
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, DANGER_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Danger zone border
    ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, DANGER_RADIUS, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Player icon at center
    ctx.fillStyle = "#60a5fa";
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#93c5fd";
    ctx.beginPath();
    ctx.arc(CENTER_X - 2, CENTER_Y - 2, 3, 0, Math.PI * 2);
    ctx.fill();

    // Zombies
    for (const z of zombiesRef.current) {
      if (!z.alive) continue;

      // Zombie shadow
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(z.x, z.y + ZOMBIE_RADIUS + 2, ZOMBIE_RADIUS * 0.8, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Zombie body
      const zombieGrad = ctx.createRadialGradient(z.x - 3, z.y - 3, 0, z.x, z.y, ZOMBIE_RADIUS);
      zombieGrad.addColorStop(0, "#4ade80");
      zombieGrad.addColorStop(1, "#166534");
      ctx.fillStyle = zombieGrad;
      ctx.beginPath();
      ctx.arc(z.x, z.y, ZOMBIE_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      // Zombie border
      ctx.strokeStyle = "#14532d";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(z.x, z.y, ZOMBIE_RADIUS, 0, Math.PI * 2);
      ctx.stroke();

      // "Z" letter
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Z", z.x, z.y);

      // Eyes (menacing red dots)
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      const angleTo = Math.atan2(CENTER_Y - z.y, CENTER_X - z.x);
      ctx.arc(z.x + Math.cos(angleTo) * 5 - 4, z.y - 4, 2.5, 0, Math.PI * 2);
      ctx.arc(z.x + Math.cos(angleTo) * 5 + 4, z.y - 4, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Kill flashes
    for (const flash of killFlashesRef.current) {
      if (flash.frame === -1) {
        // Miss indicator (fading red X)
        // We just skip rendering miss, it was for a brief moment
      } else if (flash.frame < 10) {
        const progress = flash.frame / 10;
        const alpha = 1 - progress;
        const radius = 10 + progress * 20;
        ctx.strokeStyle = `rgba(255, 200, 50, ${alpha})`;
        ctx.lineWidth = 3;
        // Starburst
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(flash.x + Math.cos(a) * 5, flash.y + Math.sin(a) * 5);
          ctx.lineTo(flash.x + Math.cos(a) * radius, flash.y + Math.sin(a) * radius);
          ctx.stroke();
        }
        // Score popup
        ctx.fillStyle = `rgba(74, 222, 128, ${alpha})`;
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("+1", flash.x, flash.y - 15 - progress * 15);
      }
    }

    // HUD
    ctx.textBaseline = "top";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Kills: ${scoreRef.current}`, 10, 10);

    ctx.textAlign = "right";
    const tColor = timeRef.current <= 5 ? "#ef4444" : "#fff";
    ctx.fillStyle = tColor;
    ctx.fillText(`${timeRef.current}s`, W - 10, 10);

    // Lives
    ctx.textAlign = "center";
    let livesText = "";
    for (let i = 0; i < 3; i++) {
      livesText += i < livesRef.current ? "\u2764" : "\u2661";
    }
    ctx.fillStyle = "#ef4444";
    ctx.font = "18px sans-serif";
    ctx.fillText(livesText, W / 2, 8);
  }, []);

  // Main game loop
  useEffect(() => {
    if (phase !== "play") return;

    gameStartRef.current = Date.now();
    lastSpawnRef.current = Date.now();
    zombiesRef.current = [];
    killFlashesRef.current = [];
    nextIdRef.current = 0;
    scoreRef.current = 0;
    livesRef.current = 3;
    timeRef.current = GAME_DURATION;
    setScore(0);
    setLives(3);
    setTimeLeft(GAME_DURATION);

    let lastTimerUpdate = Date.now();

    const loop = () => {
      const now = Date.now();
      const elapsed = (now - gameStartRef.current) / 1000;
      const remaining = Math.max(0, GAME_DURATION - Math.floor(elapsed));

      // Update timer (once per second)
      if (now - lastTimerUpdate >= 1000) {
        lastTimerUpdate = now;
        timeRef.current = remaining;
        setTimeLeft(remaining);
      }

      // Check game over conditions
      if (remaining <= 0 || livesRef.current <= 0) {
        setPhase("done");
        return;
      }

      // Spawn zombies
      const difficultyMult = 1 + elapsed / 10; // Gets harder over time
      const spawnInterval = Math.max(300, 1200 - elapsed * 25);
      if (now - lastSpawnRef.current > spawnInterval) {
        lastSpawnRef.current = now;
        // Choose spawn edge
        const edge = Math.floor(Math.random() * 4);
        let zx: number, zy: number;
        switch (edge) {
          case 0: zx = Math.random() * W; zy = -ZOMBIE_RADIUS; break; // Top
          case 1: zx = Math.random() * W; zy = H + ZOMBIE_RADIUS; break; // Bottom
          case 2: zx = -ZOMBIE_RADIUS; zy = Math.random() * H; break; // Left
          default: zx = W + ZOMBIE_RADIUS; zy = Math.random() * H; break; // Right
        }
        const baseSpeed = 0.6 + difficultyMult * 0.2;
        const speed = baseSpeed + Math.random() * 0.4;
        zombiesRef.current.push({
          id: nextIdRef.current++,
          x: zx,
          y: zy,
          speed,
          alive: true,
        });
      }

      // Move zombies toward center
      for (const z of zombiesRef.current) {
        if (!z.alive) continue;
        const dx = CENTER_X - z.x;
        const dy = CENTER_Y - z.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          z.x += (dx / dist) * z.speed;
          z.y += (dy / dist) * z.speed;
        }

        // Check if zombie reached center
        if (dist < DANGER_RADIUS * 0.4) {
          z.alive = false;
          livesRef.current = Math.max(0, livesRef.current - 1);
          setLives(livesRef.current);
        }
      }

      // Clean up dead zombies (keep array manageable)
      if (zombiesRef.current.length > 60) {
        zombiesRef.current = zombiesRef.current.filter(z => z.alive);
      }

      // Advance kill flashes
      killFlashesRef.current = killFlashesRef.current.filter(f => {
        if (f.frame === -1) return false; // Remove miss indicators immediately
        f.frame++;
        return f.frame < 10;
      });

      draw();
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, draw]);

  // Game end
  useEffect(() => {
    if (phase === "done") {
      draw(); // Final draw
      const finalScore = scoreRef.current;
      const timer = setTimeout(() => {
        onGameEnd({
          score: finalScore,
          maxScore: MAX_SCORE,
          normalizedScore: Math.min(1, finalScore / MAX_SCORE),
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, draw, onGameEnd]);

  const startGame = () => {
    setPhase("play");
  };

  if (phase === "menu") {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="flex items-center gap-3 mb-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
            className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft size={20} />
          </motion.button>
          <h3 className="text-xl font-bold text-foreground">Zombie Bonanza</h3>
        </div>
        <p className="text-muted-foreground mb-2">Tap the zombies before they reach you!</p>
        <p className="text-muted-foreground mb-6 text-sm">Zombies approach from all sides for 30 seconds. Tap/click to kill them! Don't let them reach the center - you only have 3 lives!</p>
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
        <h3 className="text-xl font-bold text-foreground">Zombie Bonanza</h3>
        <span className={`ml-auto text-sm font-bold ${timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-green-400"}`}>
          {score} kills | {timeLeft}s
        </span>
      </div>

      <canvas ref={canvasRef} width={W} height={H}
        onPointerDown={handlePointerDown}
        className="w-full max-w-[400px] mx-auto rounded-2xl bg-black/50 border-2 border-white/10 touch-none select-none cursor-crosshair"
        style={{ aspectRatio: `${W}/${H}` }} />

      {phase === "done" && (
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold text-green-400">
            {lives <= 0 ? "You were overwhelmed!" : "Time's up!"}
          </p>
          <p className="text-lg text-foreground mt-1">
            Zombies killed: {score}
          </p>
        </div>
      )}
    </div>
  );
}
