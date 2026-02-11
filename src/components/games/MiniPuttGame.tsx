import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

const W = 400;
const H = 450;
const BALL_R = 6;
const HOLE_R = 10;
const FRICTION = 0.985;
const MIN_SPEED = 0.15;
const MAX_POWER = 9;

interface Wall {
  x1: number; y1: number; x2: number; y2: number;
}

interface HoleDef {
  walls: Wall[];
  ball: { x: number; y: number };
  hole: { x: number; y: number };
  par: number;
  bounds: { x: number; y: number; w: number; h: number };
}

const HOLES: HoleDef[] = [
  {
    par: 2,
    ball: { x: W / 2, y: H - 60 },
    hole: { x: W / 2, y: 60 },
    bounds: { x: 80, y: 30, w: 240, h: H - 60 },
    walls: [
      { x1: 80, y1: 30, x2: 320, y2: 30 },
      { x1: 80, y1: 30, x2: 80, y2: H - 30 },
      { x1: 320, y1: 30, x2: 320, y2: H - 30 },
      { x1: 80, y1: H - 30, x2: 320, y2: H - 30 },
    ],
  },
  {
    par: 3,
    ball: { x: 120, y: H - 60 },
    hole: { x: 280, y: 60 },
    bounds: { x: 60, y: 30, w: 280, h: H - 60 },
    walls: [
      { x1: 60, y1: 30, x2: 340, y2: 30 },
      { x1: 60, y1: 30, x2: 60, y2: H - 30 },
      { x1: 340, y1: 30, x2: 340, y2: H - 30 },
      { x1: 60, y1: H - 30, x2: 340, y2: H - 30 },
      { x1: 150, y1: 160, x2: 150, y2: 310 },
      { x1: 250, y1: 120, x2: 250, y2: 270 },
    ],
  },
  {
    par: 3,
    ball: { x: 100, y: H - 60 },
    hole: { x: 300, y: 80 },
    bounds: { x: 50, y: 30, w: 300, h: H - 60 },
    walls: [
      { x1: 50, y1: 30, x2: 350, y2: 30 },
      { x1: 50, y1: 30, x2: 50, y2: H - 30 },
      { x1: 350, y1: 30, x2: 350, y2: H - 30 },
      { x1: 50, y1: H - 30, x2: 350, y2: H - 30 },
      { x1: 150, y1: 130, x2: 150, y2: 280 },
      { x1: 150, y1: 280, x2: 280, y2: 280 },
      { x1: 220, y1: 30, x2: 220, y2: 130 },
    ],
  },
];

export function MiniPuttGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"menu" | "aim" | "roll" | "scored" | "done">("menu");
  const [holeIndex, setHoleIndex] = useState(0);
  const [totalStrokes, setTotalStrokes] = useState(0);
  const [holeStrokes, setHoleStrokes] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragEnd, setDragEnd] = useState({ x: 0, y: 0 });

  const ballRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const animRef = useRef(0);

  const totalPar = HOLES.reduce((s, h) => s + h.par, 0);

  const resetBall = useCallback(() => {
    const hole = HOLES[holeIndex];
    ballRef.current = { x: hole.ball.x, y: hole.ball.y, vx: 0, vy: 0 };
  }, [holeIndex]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const hole = HOLES[holeIndex];
    const b = ballRef.current;

    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "#0a1628";
    ctx.fillRect(0, 0, W, H);

    // Green
    ctx.fillStyle = "#1a5c2a";
    ctx.fillRect(hole.bounds.x, hole.bounds.y, hole.bounds.w, hole.bounds.h);

    // Hole target
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(hole.hole.x, hole.hole.y, HOLE_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(hole.hole.x, hole.hole.y, HOLE_R, 0, Math.PI * 2);
    ctx.stroke();
    // Flag
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(hole.hole.x, hole.hole.y - 25, 14, 10);
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(hole.hole.x, hole.hole.y);
    ctx.lineTo(hole.hole.x, hole.hole.y - 25);
    ctx.stroke();

    // Walls
    ctx.strokeStyle = "#8b6914";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    for (const wall of hole.walls) {
      ctx.beginPath();
      ctx.moveTo(wall.x1, wall.y1);
      ctx.lineTo(wall.x2, wall.y2);
      ctx.stroke();
    }

    // Ball
    ctx.fillStyle = "#3b82f6";
    ctx.shadowColor = "#3b82f6";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(b.x, b.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.beginPath();
    ctx.arc(b.x - 2, b.y - 2, 2, 0, Math.PI * 2);
    ctx.fill();

    // Aim line
    if (dragging && phase === "aim") {
      const dx = dragStart.x - dragEnd.x;
      const dy = dragStart.y - dragEnd.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const power = Math.min(MAX_POWER, dist * 0.06);
      const angle = Math.atan2(dy, dx);

      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x + Math.cos(angle) * power * 12, b.y + Math.sin(angle) * power * 12);
      ctx.stroke();
      ctx.setLineDash([]);

      const barW = 60;
      const barH = 6;
      const barX = b.x - barW / 2;
      const barY = b.y + BALL_R + 10;
      ctx.fillStyle = "#333";
      ctx.fillRect(barX, barY, barW, barH);
      const powerRatio = power / MAX_POWER;
      ctx.fillStyle = powerRatio < 0.5 ? "#22c55e" : powerRatio < 0.8 ? "#eab308" : "#ef4444";
      ctx.fillRect(barX, barY, barW * powerRatio, barH);
    }

    // HUD
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Hole ${holeIndex + 1}/${HOLES.length} (Par ${hole.par})`, 8, 20);
    ctx.textAlign = "right";
    ctx.fillText(`Strokes: ${totalStrokes} (this hole: ${holeStrokes})`, W - 8, 20);

    if (phase === "aim") {
      ctx.textAlign = "center";
      ctx.fillStyle = "#60a5fa";
      ctx.fillText("Drag to aim & putt!", W / 2, H - 8);
    }
  }, [phase, holeIndex, totalStrokes, holeStrokes, dragging, dragStart, dragEnd]);

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
    const dist = Math.sqrt(dx * dx + dy * dy);
    const power = Math.min(MAX_POWER, dist * 0.06);

    if (power < 0.5) return;

    const angle = Math.atan2(dy, dx);
    const b = ballRef.current;
    b.vx = Math.cos(angle) * power;
    b.vy = Math.sin(angle) * power;

    setTotalStrokes((s) => s + 1);
    setHoleStrokes((s) => s + 1);
    setPhase("roll");
  };

  // Ball physics
  useEffect(() => {
    if (phase !== "roll") return;

    const loop = () => {
      const b = ballRef.current;
      const hole = HOLES[holeIndex];

      b.x += b.vx;
      b.y += b.vy;
      b.vx *= FRICTION;
      b.vy *= FRICTION;

      // Wall collisions
      for (const wall of hole.walls) {
        const wx = wall.x2 - wall.x1;
        const wy = wall.y2 - wall.y1;
        const wLen = Math.sqrt(wx * wx + wy * wy);
        const wnx = -wy / wLen;
        const wny = wx / wLen;

        const ddx = b.x - wall.x1;
        const ddy = b.y - wall.y1;
        const dist = ddx * wnx + ddy * wny;

        const t = (ddx * wx + ddy * wy) / (wLen * wLen);

        if (t >= -0.05 && t <= 1.05 && Math.abs(dist) < BALL_R + 2) {
          const dot = b.vx * wnx + b.vy * wny;
          b.vx -= 2 * dot * wnx * 0.8;
          b.vy -= 2 * dot * wny * 0.8;
          b.x += wnx * (BALL_R + 2 - Math.abs(dist)) * Math.sign(dist);
          b.y += wny * (BALL_R + 2 - Math.abs(dist)) * Math.sign(dist);
        }
      }

      // Check hole
      const hx = b.x - hole.hole.x;
      const hy = b.y - hole.hole.y;
      const hDist = Math.sqrt(hx * hx + hy * hy);
      const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);

      if (hDist < HOLE_R && speed < 5) {
        b.vx = 0;
        b.vy = 0;
        b.x = hole.hole.x;
        b.y = hole.hole.y;

        onScoreChange?.(totalStrokes);

        if (holeIndex + 1 >= HOLES.length) {
          setPhase("done");
        } else {
          setPhase("scored");
        }
        return;
      }

      // Ball stopped
      if (speed < MIN_SPEED) {
        b.vx = 0;
        b.vy = 0;
        setPhase("aim");
        draw();
        return;
      }

      draw();
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, holeIndex, totalStrokes, draw, onScoreChange]);

  useEffect(() => {
    if (phase === "aim" || phase === "done" || phase === "scored") draw();
  }, [phase, draw, dragging, dragEnd]);

  // Scored transition
  useEffect(() => {
    if (phase !== "scored") return;
    const timer = setTimeout(() => {
      const nextHole = holeIndex + 1;
      setHoleIndex(nextHole);
      setHoleStrokes(0);
      ballRef.current = { x: HOLES[nextHole].ball.x, y: HOLES[nextHole].ball.y, vx: 0, vy: 0 };
      setPhase("aim");
    }, 1200);
    return () => clearTimeout(timer);
  }, [phase, holeIndex]);

  // Done
  useEffect(() => {
    if (phase !== "done") return;
    const timer = setTimeout(() => {
      // Score: under par = great, at par = ok, over par = poor
      const diff = totalStrokes - totalPar;
      // Normalize: -4 under par → 1.0, at par → 0.6, +8 over → 0.1
      const normalized = Math.max(0.1, Math.min(1, 1 - (diff + 2) / 12));
      onGameEnd({
        score: totalStrokes,
        maxScore: totalPar,
        normalizedScore: normalized,
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [phase, totalStrokes, onGameEnd]);

  const startGame = () => {
    setHoleIndex(0);
    setTotalStrokes(0);
    setHoleStrokes(0);
    ballRef.current = { x: HOLES[0].ball.x, y: HOLES[0].ball.y, vx: 0, vy: 0 };
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
          <h3 className="text-xl font-bold text-foreground">Smol Golf</h3>
        </div>
        <p className="text-muted-foreground mb-2">Under par = big score!</p>
        <p className="text-muted-foreground mb-6 text-sm">Drag to aim and set power. Complete {HOLES.length} holes with the fewest strokes. Par: {totalPar}</p>
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
        <h3 className="text-xl font-bold text-foreground">Smol Golf</h3>
      </div>

      <canvas ref={canvasRef} width={W} height={H}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full max-w-[400px] mx-auto rounded-2xl border-2 border-white/10 touch-none select-none"
        style={{ aspectRatio: `${W}/${H}` }} />

      {phase === "scored" && (
        <div className="mt-3 text-center">
          <p className="text-lg font-bold text-green-400">Hole in {holeStrokes}! Next hole...</p>
        </div>
      )}

      {phase === "done" && (
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">
            {totalStrokes} strokes (Par {totalPar}) — {totalStrokes <= totalPar ? `${totalPar - totalStrokes} under par!` : `${totalStrokes - totalPar} over par`}
          </p>
          <p className="text-2xl font-bold text-green-400">
            {totalStrokes <= totalPar - 2 ? "Amazing!" : totalStrokes <= totalPar ? "Great!" : "Good game!"}
          </p>
        </div>
      )}
    </div>
  );
}
