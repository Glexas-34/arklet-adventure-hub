import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

const W = 400;
const H = 350;
const GRAVITY = 0.12;
const GROUND_Y = H - 30;
const TOTAL_TARGETS = 10;

interface Target {
  x: number;
  y: number;
  radius: number;
  hit: boolean;
}

interface Arrow {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
  trail: { x: number; y: number }[];
}

function drawStickFigure(ctx: CanvasRenderingContext2D, x: number, y: number, facing: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(x, y - 40, 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y - 32);
  ctx.lineTo(x, y - 10);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x - 8 * facing, y);
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x + 4 * facing, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y - 26);
  ctx.lineTo(x + 14 * facing, y - 30);
  ctx.moveTo(x, y - 26);
  ctx.lineTo(x + 10 * facing, y - 20);
  ctx.stroke();
}

function generateTargets(): Target[] {
  const targets: Target[] = [];
  for (let i = 0; i < TOTAL_TARGETS; i++) {
    targets.push({
      x: 180 + Math.random() * 180,
      y: GROUND_Y - 30 - Math.random() * 200,
      radius: 12 + Math.random() * 8,
      hit: false,
    });
  }
  return targets;
}

export function BowmanGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"menu" | "aim" | "fly" | "done">("menu");
  const [score, setScore] = useState(0);
  const [arrows, setArrows] = useState(15);
  const [targets, setTargets] = useState<Target[]>([]);
  const [lastHit, setLastHit] = useState("");
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragEnd, setDragEnd] = useState({ x: 0, y: 0 });
  const arrowRef = useRef<Arrow>({ x: 0, y: 0, vx: 0, vy: 0, active: false, trail: [] });
  const animRef = useRef(0);
  const windRef = useRef((Math.random() - 0.5) * 0.04);

  const archerPos = { x: 60, y: GROUND_Y };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);

    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#0f172a");
    sky.addColorStop(1, "#1e293b");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Ground
    ctx.fillStyle = "#365314";
    ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
    ctx.fillStyle = "#4d7c0f";
    ctx.fillRect(0, GROUND_Y, W, 3);

    // Wind
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    const windStr = windRef.current > 0 ? `Wind >>> ${(windRef.current * 100).toFixed(1)}` : `Wind <<< ${(-windRef.current * 100).toFixed(1)}`;
    ctx.fillText(windStr, W / 2, 16);

    // Archer
    drawStickFigure(ctx, archerPos.x, archerPos.y, 1, "#3b82f6");

    // Targets
    for (const tgt of targets) {
      if (tgt.hit) continue;
      // Bullseye target
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(tgt.x, tgt.y, tgt.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(tgt.x, tgt.y, tgt.radius * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(tgt.x, tgt.y, tgt.radius * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Drag line
    if (dragging && phase === "aim") {
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(archerPos.x, archerPos.y - 26);
      ctx.lineTo(dragEnd.x, dragEnd.y);
      ctx.stroke();
      ctx.setLineDash([]);

      const dx = dragStart.x - dragEnd.x;
      const dy = dragStart.y - dragEnd.y;
      const power = Math.min(100, Math.sqrt(dx * dx + dy * dy) * 0.8);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${Math.round(power)}%`, archerPos.x, archerPos.y - 55);
    }

    // Arrow
    const arrow = arrowRef.current;
    if (arrow.active) {
      ctx.strokeStyle = "rgba(251,191,36,0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < arrow.trail.length; i++) {
        if (i === 0) ctx.moveTo(arrow.trail[i].x, arrow.trail[i].y);
        else ctx.lineTo(arrow.trail[i].x, arrow.trail[i].y);
      }
      ctx.stroke();

      const arrowAngle = Math.atan2(arrow.vy, arrow.vx);
      ctx.save();
      ctx.translate(arrow.x, arrow.y);
      ctx.rotate(arrowAngle);
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.lineTo(8, 0);
      ctx.stroke();
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(4, -3);
      ctx.lineTo(4, 3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // HUD
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${score}/${TOTAL_TARGETS}`, 8, H - 8);
    ctx.textAlign = "right";
    ctx.fillText(`Arrows: ${arrows}`, W - 8, H - 8);

    if (phase === "aim") {
      ctx.fillStyle = "#60a5fa";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Drag to aim & shoot!", W / 2, H - 8);
    }

    if (lastHit) {
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(lastHit, W / 2, 32);
    }
  }, [phase, score, arrows, targets, dragging, dragEnd, dragStart, lastHit]);

  const getCanvasPos = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (W / rect.width),
      y: (clientY - rect.top) * (H / rect.height),
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (phase !== "aim") return;
    const pos = getCanvasPos(e.clientX, e.clientY);
    setDragStart(pos);
    setDragEnd(pos);
    setDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragEnd(getCanvasPos(e.clientX, e.clientY));
  };

  const handlePointerUp = () => {
    if (!dragging || phase !== "aim") return;
    setDragging(false);

    const dx = dragStart.x - dragEnd.x;
    const dy = dragStart.y - dragEnd.y;
    const power = Math.min(100, Math.sqrt(dx * dx + dy * dy) * 0.8);

    if (power < 5) return;

    const aimAngle = Math.atan2(dy, dx);
    const speed = power * 0.065;

    arrowRef.current = {
      x: archerPos.x,
      y: archerPos.y - 26,
      vx: Math.cos(aimAngle) * speed,
      vy: -Math.sin(aimAngle) * speed,
      active: true,
      trail: [],
    };
    setArrows((a) => a - 1);
    setPhase("fly");
  };

  // Arrow flight
  useEffect(() => {
    if (phase !== "fly") return;

    const loop = () => {
      const a = arrowRef.current;
      a.vx += windRef.current;
      a.vy += GRAVITY;
      a.x += a.vx;
      a.y += a.vy;
      a.trail.push({ x: a.x, y: a.y });
      if (a.trail.length > 20) a.trail.shift();

      // Check targets
      for (const tgt of targets) {
        if (tgt.hit) continue;
        const dx = a.x - tgt.x;
        const dy = a.y - tgt.y;
        if (Math.sqrt(dx * dx + dy * dy) < tgt.radius + 4) {
          a.active = false;
          tgt.hit = true;
          const newScore = score + 1;
          setScore(newScore);
          onScoreChange?.(newScore);
          setLastHit("Bullseye! +1");
          windRef.current = (Math.random() - 0.5) * 0.04;
          setTargets([...targets]);

          const allHit = targets.every((t) => t.hit);
          if (allHit) {
            setPhase("done");
          } else {
            setPhase("aim");
          }
          return;
        }
      }

      // Ground or off screen
      if (a.y >= GROUND_Y || a.x < -30 || a.x > W + 30 || a.y > H + 30) {
        a.active = false;
        setLastHit("Miss!");
        windRef.current = (Math.random() - 0.5) * 0.04;
        if (arrows - 1 <= 0) {
          setPhase("done");
        } else {
          setPhase("aim");
        }
        return;
      }

      draw();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, targets, score, arrows, draw, onScoreChange]);

  useEffect(() => {
    if (phase === "aim" || phase === "done") draw();
  }, [phase, draw, dragging, dragEnd]);

  // Game over check
  useEffect(() => {
    if (phase === "aim" && arrows <= 0) {
      setPhase("done");
    }
  }, [phase, arrows]);

  useEffect(() => {
    if (phase === "done") {
      const timer = setTimeout(() => {
        onGameEnd({
          score,
          maxScore: TOTAL_TARGETS,
          normalizedScore: Math.min(1, score / TOTAL_TARGETS),
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, score, onGameEnd]);

  const startGame = () => {
    setTargets(generateTargets());
    setScore(0);
    setArrows(15);
    setLastHit("");
    windRef.current = (Math.random() - 0.5) * 0.04;
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
          <h3 className="text-xl font-bold text-foreground">Stick Figure Suffering</h3>
        </div>
        <p className="text-muted-foreground mb-2">Hit the archery targets!</p>
        <p className="text-muted-foreground mb-6 text-sm">Drag to aim and set power. Hit all {TOTAL_TARGETS} targets with {15} arrows! Watch the wind!</p>
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
        <h3 className="text-xl font-bold text-foreground">Stick Figure Suffering</h3>
      </div>

      <canvas ref={canvasRef} width={W} height={H}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full max-w-[400px] mx-auto rounded-2xl bg-black/50 border-2 border-white/10 touch-none select-none"
        style={{ aspectRatio: `${W}/${H}` }} />

      {phase === "done" && (
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">
            {score === TOTAL_TARGETS ? "Perfect Aim!" : `${score}/${TOTAL_TARGETS} Targets Hit!`}
          </p>
        </div>
      )}
    </div>
  );
}
