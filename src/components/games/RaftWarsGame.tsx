import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

const W = 400;
const H = 300;
const GRAVITY = 0.18;
const MAX_ROUNDS = 10;
const MAX_SCORE = 100;

interface Target {
  x: number;
  y: number;
  radius: number;
}

function generateTarget(round: number): Target {
  const baseX = 250 + Math.random() * (100 + round * 8);
  const baseY = 80 + Math.random() * 120;
  const radius = Math.max(8, 22 - round * 1.4);
  return { x: Math.min(baseX, W - 20), y: baseY, radius };
}

export function RaftWarsGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"menu" | "aim" | "fire" | "result" | "done">("menu");
  const [round, setRound] = useState(1);
  const [angle, setAngle] = useState(45);
  const [power, setPower] = useState(50);
  const [score, setScore] = useState(0);
  const [roundResult, setRoundResult] = useState("");
  const [target, setTarget] = useState<Target>({ x: 300, y: 150, radius: 20 });
  const projRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const splashRef = useRef({ x: 0, y: 0, frame: 0, active: false });
  const animRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.6);
    sky.addColorStop(0, "#87ceeb");
    sky.addColorStop(1, "#b0e0e6");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H * 0.6);

    // Water
    const water = ctx.createLinearGradient(0, H * 0.6, 0, H);
    water.addColorStop(0, "#1e90ff");
    water.addColorStop(0.5, "#1a75d4");
    water.addColorStop(1, "#0e4d92");
    ctx.fillStyle = water;
    ctx.fillRect(0, H * 0.6, W, H * 0.4);

    // Water waves
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const waveY = H * 0.6 + 15 + i * 18 + Math.sin(x * 0.03 + i * 2 + Date.now() * 0.002) * 3;
        if (x === 0) ctx.moveTo(x, waveY);
        else ctx.lineTo(x, waveY);
      }
      ctx.stroke();
    }

    // Raft (left side)
    const raftX = 40;
    const raftY = H * 0.6 - 5;
    // Raft body (brown logs)
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(raftX - 25, raftY, 50, 10);
    ctx.fillStyle = "#A0522D";
    ctx.fillRect(raftX - 25, raftY + 2, 50, 3);
    ctx.fillRect(raftX - 25, raftY + 7, 50, 3);
    // Player on raft (circle body)
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(raftX, raftY - 15, 10, 0, Math.PI * 2);
    ctx.fill();
    // Eyes
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(raftX - 3, raftY - 17, 1.5, 0, Math.PI * 2);
    ctx.arc(raftX + 3, raftY - 17, 1.5, 0, Math.PI * 2);
    ctx.fill();
    // Smile
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(raftX, raftY - 14, 4, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    // Aim line (when aiming)
    if (phase === "aim") {
      const rad = -angle * Math.PI / 180;
      const lineLen = 30 + power * 0.3;
      ctx.strokeStyle = "rgba(255,0,0,0.5)";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(raftX + 10, raftY - 15);
      ctx.lineTo(raftX + 10 + Math.cos(rad) * lineLen, raftY - 15 + Math.sin(rad) * lineLen);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Target
    if (phase !== "done") {
      // Target outer glow
      ctx.fillStyle = "rgba(255, 50, 50, 0.2)";
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius + 5, 0, Math.PI * 2);
      ctx.fill();
      // Target body
      ctx.fillStyle = "#ff4444";
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
      ctx.fill();
      // Inner ring
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius * 0.6, 0, Math.PI * 2);
      ctx.fill();
      // Bullseye
      ctx.fillStyle = "#ff4444";
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Projectile
    const proj = projRef.current;
    if (phase === "fire") {
      // Trail
      ctx.fillStyle = "rgba(50,50,50,0.4)";
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, 7, 0, Math.PI * 2);
      ctx.fill();
      // Ball
      ctx.fillStyle = "#333";
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, 5, 0, Math.PI * 2);
      ctx.fill();
      // Highlight
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.arc(proj.x - 1.5, proj.y - 1.5, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Splash effect
    const splash = splashRef.current;
    if (splash.active && splash.frame < 15) {
      const progress = splash.frame / 15;
      const alpha = 1 - progress;
      // Water splash
      for (let i = 0; i < 6; i++) {
        const sAngle = (i / 6) * Math.PI * 2 + progress * 0.5;
        const dist = 10 + progress * 25;
        const sx = splash.x + Math.cos(sAngle) * dist;
        const sy = splash.y + Math.sin(sAngle) * dist - progress * 10;
        ctx.fillStyle = `rgba(100, 180, 255, ${alpha * 0.7})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 3 - progress * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // HUD
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Round: ${round}/${MAX_ROUNDS}`, 8, 18);
    ctx.textAlign = "right";
    ctx.fillText(`Score: ${score}`, W - 8, 18);

    // Round result text
    if (phase === "result" && roundResult) {
      ctx.fillStyle = roundResult.includes("HIT") ? "#22c55e" :
                       roundResult.includes("NEAR") ? "#eab308" : "#ef4444";
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(roundResult, W / 2, H / 2 - 20);
    }
  }, [phase, round, score, angle, power, target, roundResult]);

  const fireShot = useCallback(() => {
    const raftX = 40;
    const raftY = H * 0.6 - 5;
    const rad = -angle * Math.PI / 180;
    const speed = power * 0.065;
    projRef.current = {
      x: raftX + 10,
      y: raftY - 15,
      vx: Math.cos(rad) * speed,
      vy: Math.sin(rad) * speed,
    };
    splashRef.current = { x: 0, y: 0, frame: 0, active: false };
    setPhase("fire");
  }, [angle, power]);

  // Animation loop for projectile
  useEffect(() => {
    if (phase === "fire") {
      const loop = () => {
        const p = projRef.current;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += GRAVITY;

        // Check hit on target
        const dx = p.x - target.x;
        const dy = p.y - target.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < target.radius) {
          // Direct hit
          splashRef.current = { x: p.x, y: p.y, frame: 0, active: true };
          const pts = 10;
          const newScore = score + pts;
          setScore(newScore);
          onScoreChange?.(newScore);
          setRoundResult(`HIT! +${pts}`);
          setPhase("result");
          return;
        }

        if (dist < target.radius + 20) {
          // Near miss check - only trigger if projectile is past target or going down significantly
          if (p.vy > 1 || p.x > target.x + target.radius + 20) {
            splashRef.current = { x: p.x, y: p.y, frame: 0, active: true };
            const pts = 5;
            const newScore = score + pts;
            setScore(newScore);
            onScoreChange?.(newScore);
            setRoundResult(`NEAR MISS! +${pts}`);
            setPhase("result");
            return;
          }
        }

        // Hit water or off screen
        if (p.y > H * 0.6 + 10 || p.x > W + 20 || p.x < -20 || p.y > H + 20) {
          splashRef.current = { x: p.x, y: Math.min(p.y, H * 0.6 + 5), frame: 0, active: true };
          setRoundResult("MISS!");
          setPhase("result");
          return;
        }

        draw();
        animRef.current = requestAnimationFrame(loop);
      };
      animRef.current = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(animRef.current);
    }
  }, [phase, target, score, draw, onScoreChange]);

  // Splash animation during result
  useEffect(() => {
    if (phase === "result") {
      const splash = splashRef.current;
      if (splash.active && splash.frame < 15) {
        const loop = () => {
          splash.frame++;
          draw();
          if (splash.frame < 15) {
            animRef.current = requestAnimationFrame(loop);
          }
        };
        animRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animRef.current);
      }
    }
  }, [phase, draw]);

  // After result, advance round
  useEffect(() => {
    if (phase === "result") {
      const timer = setTimeout(() => {
        if (round >= MAX_ROUNDS) {
          setPhase("done");
        } else {
          const nextRound = round + 1;
          setRound(nextRound);
          setTarget(generateTarget(nextRound));
          setRoundResult("");
          setPhase("aim");
        }
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [phase, round]);

  // Draw on state changes
  useEffect(() => {
    if (phase === "aim" || phase === "done" || phase === "result") draw();
  }, [phase, angle, power, draw]);

  // Game end
  useEffect(() => {
    if (phase === "done") {
      const timer = setTimeout(() => {
        onGameEnd({
          score,
          maxScore: MAX_SCORE,
          normalizedScore: Math.min(1, score / MAX_SCORE),
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, score, onGameEnd]);

  const startGame = () => {
    setRound(1);
    setScore(0);
    setAngle(45);
    setPower(50);
    setRoundResult("");
    setTarget(generateTarget(1));
    splashRef.current = { x: 0, y: 0, frame: 0, active: false };
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
          <h3 className="text-xl font-bold text-foreground">Splash Attack</h3>
        </div>
        <p className="text-muted-foreground mb-2">Aim and fire from your raft!</p>
        <p className="text-muted-foreground mb-6 text-sm">Set angle and power, then fire cannonballs at targets. 10 rounds, targets get smaller and further away!</p>
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
        <h3 className="text-xl font-bold text-foreground">Splash Attack</h3>
        <span className="ml-auto text-sm font-bold text-cyan-400">Score: {score}</span>
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
            <span className="text-sm text-foreground w-10 text-right">{angle}&deg;</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-foreground w-14">Power</span>
            <input type="range" min={10} max={100} value={power}
              onChange={(e) => setPower(Number(e.target.value))}
              className="flex-1 h-2 accent-cyan-400" />
            <span className="text-sm text-foreground w-10 text-right">{power}%</span>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
            onClick={fireShot}
            className="w-full py-3 rounded-xl font-bold text-white text-lg bg-blue-500 hover:bg-blue-400">
            Fire!
          </motion.button>
        </div>
      )}

      {phase === "done" && (
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold text-cyan-400">
            Final Score: {score}/{MAX_SCORE}
          </p>
        </div>
      )}
    </div>
  );
}
