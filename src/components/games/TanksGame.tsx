import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

const W = 400;
const H = 300;
const GRAVITY = 0.15;
const TANK_W = 24;
const TANK_H = 14;
const EXPL_FRAMES = 20;
const HIT_RADIUS = 22;
const MAX_TARGETS = 10;

function generateTerrain(): number[] {
  const pts: number[] = [];
  let y = H * 0.55 + Math.random() * 40 - 20;
  for (let x = 0; x <= W; x++) {
    y += (Math.random() - 0.5) * 3;
    y = Math.max(H * 0.3, Math.min(H * 0.8, y));
    pts.push(y);
  }
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 1; i < pts.length - 1; i++) {
      pts[i] = (pts[i - 1] + pts[i] + pts[i + 1]) / 3;
    }
  }
  return pts;
}

interface Target {
  x: number;
  y: number;
  alive: boolean;
}

function spawnTarget(terrain: number[]): Target {
  const x = Math.floor(W * 0.4 + Math.random() * W * 0.5);
  return { x, y: terrain[x] - TANK_H / 2, alive: true };
}

export function TanksGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"menu" | "aim" | "fire" | "explode" | "done">("menu");
  const [angle, setAngle] = useState(45);
  const [power, setPower] = useState(50);
  const [score, setScore] = useState(0);
  const [shots, setShots] = useState(0);
  const [message, setMessage] = useState("");
  const [targets, setTargets] = useState<Target[]>([]);
  const terrainRef = useRef<number[]>([]);
  const projRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const explRef = useRef({ x: 0, y: 0, frame: 0 });
  const animRef = useRef(0);
  const maxShots = 15;

  const getTankPos = useCallback(() => {
    const t = terrainRef.current;
    if (!t.length) return { x: 0, y: 0 };
    const x = Math.floor(W * 0.12);
    return { x, y: t[x] - TANK_H / 2 };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const t = terrainRef.current;

    ctx.clearRect(0, 0, W, H);

    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#1a1a3e");
    sky.addColorStop(1, "#2d1b69");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Terrain
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x++) ctx.lineTo(x, t[x]);
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = "#2d5a27";
    ctx.fill();

    // Player tank
    const pos = getTankPos();
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(pos.x - TANK_W / 2, pos.y - TANK_H / 2, TANK_W, TANK_H);
    const barrelAngle = -angle * Math.PI / 180;
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y - 2);
    ctx.lineTo(pos.x + Math.cos(barrelAngle) * 18, pos.y + Math.sin(barrelAngle) * 18 - 2);
    ctx.stroke();

    // Targets
    for (const tgt of targets) {
      if (!tgt.alive) continue;
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(tgt.x - TANK_W / 2, tgt.y - TANK_H / 2, TANK_W, TANK_H);
      // Target marker
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(tgt.x, tgt.y - TANK_H - 8, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("!", tgt.x, tgt.y - TANK_H - 5);
    }

    // Projectile
    const proj = projRef.current;
    if (phase === "fire") {
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(251,191,36,0.3)";
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Explosion
    const expl = explRef.current;
    if (phase === "explode" && expl.frame < EXPL_FRAMES) {
      const progress = expl.frame / EXPL_FRAMES;
      const radius = 15 + progress * 20;
      const alpha = 1 - progress;
      ctx.fillStyle = `rgba(255, ${Math.floor(150 - progress * 150)}, 0, ${alpha})`;
      ctx.beginPath();
      ctx.arc(expl.x, expl.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // HUD
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${score}/${MAX_TARGETS}`, 8, 18);
    ctx.textAlign = "right";
    ctx.fillText(`Shots: ${shots}/${maxShots}`, W - 8, 18);
  }, [phase, angle, score, shots, targets, getTankPos]);

  const fire = useCallback(() => {
    const pos = getTankPos();
    const rad = -angle * Math.PI / 180;
    const speed = power * 0.08;
    projRef.current = {
      x: pos.x + Math.cos(rad) * 20,
      y: pos.y + Math.sin(rad) * 20 - 2,
      vx: Math.cos(rad) * speed,
      vy: Math.sin(rad) * speed,
    };
    setShots((s) => s + 1);
    setPhase("fire");
  }, [angle, power, getTankPos]);

  // Animation loop
  useEffect(() => {
    if (phase === "fire") {
      const loop = () => {
        const p = projRef.current;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += GRAVITY;

        // Check hit on targets
        let hitTarget = false;
        for (const tgt of targets) {
          if (!tgt.alive) continue;
          const dx = p.x - tgt.x;
          const dy = p.y - tgt.y;
          if (Math.sqrt(dx * dx + dy * dy) < HIT_RADIUS) {
            tgt.alive = false;
            hitTarget = true;
            explRef.current = { x: p.x, y: p.y, frame: 0 };
            setPhase("explode");
            const newScore = score + 1;
            setScore(newScore);
            onScoreChange?.(newScore);
            setMessage("Hit! +1");
            setTargets([...targets]);
            return;
          }
        }

        // Hit terrain
        const t = terrainRef.current;
        if (p.x >= 0 && p.x < W && p.y >= t[Math.floor(p.x)]) {
          explRef.current = { x: p.x, y: p.y, frame: 0 };
          setPhase("explode");
          setMessage("Miss!");
          return;
        }

        // Off screen
        if (p.x < -20 || p.x > W + 20 || p.y > H + 20) {
          setMessage("Miss!");
          setPhase("aim");
          return;
        }

        draw();
        animRef.current = requestAnimationFrame(loop);
      };
      animRef.current = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(animRef.current);
    }

    if (phase === "explode") {
      const loop = () => {
        explRef.current.frame++;
        draw();
        if (explRef.current.frame >= EXPL_FRAMES) {
          // Check if game over
          const alive = targets.filter((t) => t.alive).length;
          if (alive === 0 || shots >= maxShots) {
            setPhase("done");
          } else {
            setPhase("aim");
          }
          return;
        }
        animRef.current = requestAnimationFrame(loop);
      };
      animRef.current = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(animRef.current);
    }
  }, [phase, targets, score, shots, draw, onScoreChange]);

  useEffect(() => {
    if (phase === "aim" || phase === "done") draw();
  }, [phase, angle, draw]);

  // Check game over after aim
  useEffect(() => {
    if (phase === "aim" && shots >= maxShots) {
      setPhase("done");
    }
  }, [phase, shots]);

  useEffect(() => {
    if (phase === "done") {
      const timer = setTimeout(() => {
        onGameEnd({
          score,
          maxScore: MAX_TARGETS,
          normalizedScore: Math.min(1, score / MAX_TARGETS),
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, score, onGameEnd]);

  const startGame = () => {
    terrainRef.current = generateTerrain();
    const t = terrainRef.current;
    const tgts: Target[] = [];
    for (let i = 0; i < MAX_TARGETS; i++) {
      tgts.push(spawnTarget(t));
    }
    setTargets(tgts);
    setScore(0);
    setShots(0);
    setAngle(45);
    setPower(50);
    setMessage("");
    setPhase("aim");
  };

  if (phase === "menu") {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="flex items-center gap-3 mb-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
            className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft size={20} />
          </motion.button>
          <h3 className="text-xl font-bold text-foreground">Boom Boom Kaboom</h3>
        </div>
        <p className="text-muted-foreground mb-2">Blast all the targets!</p>
        <p className="text-muted-foreground mb-6 text-sm">Adjust angle & power to hit {MAX_TARGETS} targets. You have {maxShots} shots!</p>
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
        <h3 className="text-xl font-bold text-foreground">Boom Boom Kaboom</h3>
        {message && <span className="ml-auto text-sm font-bold text-yellow-400">{message}</span>}
      </div>

      <canvas ref={canvasRef} width={W} height={H}
        className="w-full max-w-[400px] mx-auto rounded-2xl bg-black/50 border-2 border-white/10 touch-none"
        style={{ aspectRatio: `${W}/${H}` }} />

      {phase === "aim" && (
        <div className="mt-3 space-y-3 max-w-[400px] mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-foreground w-14">Angle</span>
            <input type="range" min={10} max={80} value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="flex-1 h-2 accent-cyan-400" />
            <span className="text-sm text-foreground w-10 text-right">{angle}°</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-foreground w-14">Power</span>
            <input type="range" min={10} max={100} value={power}
              onChange={(e) => setPower(Number(e.target.value))}
              className="flex-1 h-2 accent-cyan-400" />
            <span className="text-sm text-foreground w-10 text-right">{power}%</span>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
            onClick={fire}
            className="w-full py-3 rounded-xl font-bold text-white text-lg bg-blue-500 hover:bg-blue-400">
            Fire!
          </motion.button>
        </div>
      )}

      {phase === "done" && (
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">
            {score === MAX_TARGETS ? "Perfect Score!" : `${score}/${MAX_TARGETS} Targets Hit!`}
          </p>
        </div>
      )}
    </div>
  );
}
