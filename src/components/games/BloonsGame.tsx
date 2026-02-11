import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

const W = 400;
const H = 400;
const BALLOON_R = 14;
const DART_SPEED = 10;
const TOTAL_DARTS = 30;
const MAX_SCORE = 50;
const DART_LENGTH = 16;
const POP_FRAMES = 12;

const BALLOON_COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#ec4899", "#8b5cf6", "#f97316", "#06b6d4"];

interface Balloon {
  x: number;
  y: number;
  color: string;
  alive: boolean;
  popFrame: number; // -1 = not popping, 0..POP_FRAMES = animating
}

interface Dart {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
}

function generateBalloons(): Balloon[] {
  const balloons: Balloon[] = [];

  // Row pattern: 5 rows of 6
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 6; c++) {
      balloons.push({
        x: 70 + c * 50 + (r % 2 === 1 ? 25 : 0),
        y: 40 + r * 38,
        color: BALLOON_COLORS[(r * 6 + c) % BALLOON_COLORS.length],
        alive: true,
        popFrame: -1,
      });
    }
  }

  // Diamond pattern in the center
  const cx = W / 2;
  const cy = 120;
  const diamondPositions = [
    [0, -2], [-1, -1], [1, -1], [-2, 0], [0, 0], [2, 0],
    [-1, 1], [1, 1], [0, 2],
  ];
  for (const [dx, dy] of diamondPositions) {
    const bx = cx + dx * 28;
    const by = cy + dy * 28;
    // Avoid overlapping with existing
    if (!balloons.some((b) => Math.abs(b.x - bx) < 20 && Math.abs(b.y - by) < 20)) {
      balloons.push({
        x: bx,
        y: by,
        color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        alive: true,
        popFrame: -1,
      });
    }
  }

  // Add a few scattered extras to reach ~50
  while (balloons.length < MAX_SCORE) {
    const x = 30 + Math.random() * (W - 60);
    const y = 30 + Math.random() * 220;
    if (!balloons.some((b) => Math.hypot(b.x - x, b.y - y) < BALLOON_R * 2)) {
      balloons.push({
        x,
        y,
        color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        alive: true,
        popFrame: -1,
      });
    }
  }

  return balloons.slice(0, MAX_SCORE);
}

export function BloonsGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"menu" | "play" | "done">("menu");
  const stateRef = useRef({
    balloons: [] as Balloon[],
    darts: [] as Dart[],
    dartsLeft: TOTAL_DARTS,
    popped: 0,
    dragging: false,
    dragStart: { x: W / 2, y: H - 30 },
    dragEnd: { x: W / 2, y: H - 30 },
    aimX: W / 2,
    aimY: H / 2,
  });
  const animRef = useRef(0);
  const [dartsLeft, setDartsLeft] = useState(TOTAL_DARTS);
  const [popped, setPopped] = useState(0);

  const resetState = useCallback(() => {
    stateRef.current = {
      balloons: generateBalloons(),
      darts: [],
      dartsLeft: TOTAL_DARTS,
      popped: 0,
      dragging: false,
      dragStart: { x: W / 2, y: H - 30 },
      dragEnd: { x: W / 2, y: H - 30 },
      aimX: W / 2,
      aimY: H / 2,
    };
    setDartsLeft(TOTAL_DARTS);
    setPopped(0);
  }, []);

  const endGame = useCallback(() => {
    const s = stateRef.current;
    setPhase("done");
    onGameEnd({
      score: s.popped,
      maxScore: MAX_SCORE,
      normalizedScore: Math.min(1, s.popped / MAX_SCORE),
    });
  }, [onGameEnd]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    ctx.clearRect(0, 0, W, H);

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#1e1b4b");
    bg.addColorStop(1, "#312e81");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Grid dots for visual interest
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    for (let gx = 0; gx < W; gx += 20) {
      for (let gy = 0; gy < H; gy += 20) {
        ctx.beginPath();
        ctx.arc(gx, gy, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Balloons
    for (const b of s.balloons) {
      if (b.popFrame >= 0 && b.popFrame < POP_FRAMES) {
        // Pop animation
        const progress = b.popFrame / POP_FRAMES;
        const alpha = 1 - progress;
        const size = BALLOON_R * (1 + progress * 0.8);
        ctx.globalAlpha = alpha;

        // Burst particles
        for (let p = 0; p < 6; p++) {
          const pAngle = (p / 6) * Math.PI * 2 + progress * 2;
          const pDist = progress * 25;
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.arc(
            b.x + Math.cos(pAngle) * pDist,
            b.y + Math.sin(pAngle) * pDist,
            3 * (1 - progress),
            0,
            Math.PI * 2
          );
          ctx.fill();
        }

        // Expanding ring
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 2 * (1 - progress);
        ctx.beginPath();
        ctx.arc(b.x, b.y, size, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 1;
        b.popFrame++;
        continue;
      }

      if (!b.alive) continue;

      // Balloon body
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.ellipse(b.x, b.y, BALLOON_R * 0.85, BALLOON_R, 0, 0, Math.PI * 2);
      ctx.fill();

      // Highlight
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.beginPath();
      ctx.ellipse(b.x - 4, b.y - 5, 4, 6, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Knot
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.moveTo(b.x - 3, b.y + BALLOON_R);
      ctx.lineTo(b.x, b.y + BALLOON_R + 5);
      ctx.lineTo(b.x + 3, b.y + BALLOON_R);
      ctx.closePath();
      ctx.fill();

      // String
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y + BALLOON_R + 5);
      ctx.quadraticCurveTo(b.x + 4, b.y + BALLOON_R + 15, b.x - 2, b.y + BALLOON_R + 22);
      ctx.stroke();
    }

    // Active darts
    for (const dart of s.darts) {
      if (!dart.active) continue;
      const angle = Math.atan2(dart.vy, dart.vx);
      ctx.save();
      ctx.translate(dart.x, dart.y);
      ctx.rotate(angle);

      // Dart body
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.moveTo(DART_LENGTH / 2, 0);
      ctx.lineTo(-DART_LENGTH / 2, -3);
      ctx.lineTo(-DART_LENGTH / 2, 3);
      ctx.closePath();
      ctx.fill();

      // Dart tip
      ctx.fillStyle = "#d4d4d8";
      ctx.beginPath();
      ctx.moveTo(DART_LENGTH / 2 + 4, 0);
      ctx.lineTo(DART_LENGTH / 2, -2);
      ctx.lineTo(DART_LENGTH / 2, 2);
      ctx.closePath();
      ctx.fill();

      // Tail feathers
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(-DART_LENGTH / 2, 0);
      ctx.lineTo(-DART_LENGTH / 2 - 5, -4);
      ctx.lineTo(-DART_LENGTH / 2 - 2, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-DART_LENGTH / 2, 0);
      ctx.lineTo(-DART_LENGTH / 2 - 5, 4);
      ctx.lineTo(-DART_LENGTH / 2 - 2, 0);
      ctx.fill();

      ctx.restore();
    }

    // Aim indicator (slingshot style)
    const launchX = W / 2;
    const launchY = H - 30;

    if (s.dragging) {
      // Draw rubber band
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(launchX - 12, launchY);
      ctx.lineTo(s.dragEnd.x, s.dragEnd.y);
      ctx.lineTo(launchX + 12, launchY);
      ctx.stroke();

      // Aim direction indicator
      const dx = launchX - s.dragEnd.x;
      const dy = launchY - s.dragEnd.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len > 5) {
        const nx = dx / len;
        const ny = dy / len;
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(launchX, launchY);
        ctx.lineTo(launchX + nx * 100, launchY + ny * 100);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Launch platform
    ctx.fillStyle = "#78716c";
    ctx.beginPath();
    ctx.roundRect(launchX - 20, launchY - 5, 40, 12, 4);
    ctx.fill();
    ctx.fillStyle = "#a8a29e";
    ctx.beginPath();
    ctx.roundRect(launchX - 16, launchY - 3, 32, 8, 3);
    ctx.fill();

    // Slingshot forks
    ctx.fillStyle = "#92400e";
    ctx.fillRect(launchX - 14, launchY - 15, 4, 15);
    ctx.fillRect(launchX + 10, launchY - 15, 4, 15);

    // HUD
    ctx.fillStyle = "#ffffffcc";
    ctx.font = "bold 14px Fredoka, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Popped: ${s.popped}/${MAX_SCORE}`, 10, H - 8);
    ctx.textAlign = "right";
    ctx.fillText(`Darts: ${s.dartsLeft}`, W - 10, H - 8);

  }, []);

  // Main game loop
  useEffect(() => {
    if (phase !== "play") return;

    resetState();

    const loop = () => {
      const s = stateRef.current;

      // Move darts
      for (const dart of s.darts) {
        if (!dart.active) continue;
        dart.x += dart.vx;
        dart.y += dart.vy;

        // Check off screen
        if (dart.x < -20 || dart.x > W + 20 || dart.y < -20 || dart.y > H + 20) {
          dart.active = false;
          continue;
        }

        // Check balloon hits
        for (const b of s.balloons) {
          if (!b.alive) continue;
          const dx = dart.x - b.x;
          const dy = dart.y - b.y;
          if (Math.sqrt(dx * dx + dy * dy) < BALLOON_R + 4) {
            b.alive = false;
            b.popFrame = 0;
            dart.active = false;
            s.popped++;
            setPopped(s.popped);
            onScoreChange?.(s.popped);

            if (s.popped >= MAX_SCORE) {
              setPhase("done");
              onGameEnd({
                score: s.popped,
                maxScore: MAX_SCORE,
                normalizedScore: 1,
              });
              return;
            }
            break;
          }
        }
      }

      // Clean up inactive darts
      s.darts = s.darts.filter((d) => d.active || false);

      // Check game over (no darts left and no active darts)
      if (s.dartsLeft <= 0 && s.darts.every((d) => !d.active)) {
        // Small delay then end
        if (s.darts.length === 0) {
          setPhase("done");
          onGameEnd({
            score: s.popped,
            maxScore: MAX_SCORE,
            normalizedScore: Math.min(1, s.popped / MAX_SCORE),
          });
          return;
        }
      }

      draw();
      animRef.current = requestAnimationFrame(loop);
    };

    // Initial draw
    draw();
    animRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animRef.current);
  }, [phase, resetState, draw, onGameEnd, onScoreChange]);

  // Input handlers
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
    if (phase !== "play") return;
    const pos = getCanvasPos(e.clientX, e.clientY);
    const s = stateRef.current;
    s.dragging = true;
    s.dragStart = { x: pos.x, y: pos.y };
    s.dragEnd = { x: pos.x, y: pos.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (phase !== "play") return;
    const s = stateRef.current;
    if (!s.dragging) return;
    const pos = getCanvasPos(e.clientX, e.clientY);
    s.dragEnd = pos;
  };

  const handlePointerUp = () => {
    if (phase !== "play") return;
    const s = stateRef.current;
    if (!s.dragging) return;
    s.dragging = false;

    if (s.dartsLeft <= 0) return;

    const launchX = W / 2;
    const launchY = H - 30;
    const dx = launchX - s.dragEnd.x;
    const dy = launchY - s.dragEnd.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 10) return; // Too small drag

    const nx = dx / dist;
    const ny = dy / dist;

    s.darts.push({
      x: launchX,
      y: launchY,
      vx: nx * DART_SPEED,
      vy: ny * DART_SPEED,
      active: true,
    });

    s.dartsLeft--;
    setDartsLeft(s.dartsLeft);
  };

  if (phase === "menu") {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="flex items-center gap-3 mb-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
            className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft size={20} />
          </motion.button>
          <h3 className="text-xl font-bold text-foreground">Pop Pop PANIC</h3>
        </div>
        <p className="text-muted-foreground mb-2">Throw darts at balloons!</p>
        <p className="text-muted-foreground mb-6 text-sm">Drag and release to aim. You have {TOTAL_DARTS} darts to pop {MAX_SCORE} balloons!</p>
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
        <h3 className="text-xl font-bold text-foreground">Pop Pop PANIC</h3>
        <span className="ml-auto text-sm font-bold text-foreground">
          {popped}/{MAX_SCORE} popped | {dartsLeft} darts
        </span>
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
          <p className="text-2xl font-bold text-pink-400">
            {popped >= MAX_SCORE ? "All Popped!" : "Out of Darts!"}
          </p>
          <p className="text-muted-foreground">Popped: {popped}/{MAX_SCORE}</p>
        </div>
      )}
    </div>
  );
}
