import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

const W = 400;
const H = 300;
const MAX_ROUNDS = 10;
const MAX_SCORE = 1000;
const MONKEY_RADIUS = 28;
const BASE_SPEED = 3;

export function MonkeySlap({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"menu" | "play" | "roundResult" | "done">("menu");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [roundPoints, setRoundPoints] = useState(0);
  const [roundLabel, setRoundLabel] = useState("");
  const monkeyRef = useRef({ x: W / 2, y: H / 2, vx: BASE_SPEED, bouncing: true });
  const animRef = useRef(0);
  const scoreRef = useRef(0);
  const roundRef = useRef(1);
  const slapFlashRef = useRef<{ x: number; y: number; frame: number; label: string } | null>(null);

  // Keep refs in sync
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { roundRef.current = round; }, [round]);

  const getSpeed = useCallback((r: number) => BASE_SPEED + (r - 1) * 1, []);

  const getCanvasPos = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (W / rect.width),
      y: (clientY - rect.top) * (H / rect.height),
    };
  }, []);

  const drawMonkey = useCallback((ctx: CanvasRenderingContext2D, mx: number, my: number) => {
    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.ellipse(mx, my + MONKEY_RADIUS + 5, MONKEY_RADIUS * 0.7, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = "#8B6914";
    ctx.beginPath();
    ctx.arc(mx - MONKEY_RADIUS - 4, my - 4, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.arc(mx + MONKEY_RADIUS + 4, my - 4, 10, 0, Math.PI * 2);
    ctx.fill();
    // Inner ear
    ctx.fillStyle = "#DEB887";
    ctx.beginPath();
    ctx.arc(mx - MONKEY_RADIUS - 4, my - 4, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.arc(mx + MONKEY_RADIUS + 4, my - 4, 6, 0, Math.PI * 2);
    ctx.fill();

    // Head (brown circle)
    const headGrad = ctx.createRadialGradient(mx - 5, my - 5, 0, mx, my, MONKEY_RADIUS);
    headGrad.addColorStop(0, "#CD853F");
    headGrad.addColorStop(1, "#8B6914");
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.arc(mx, my, MONKEY_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Face (lighter oval)
    ctx.fillStyle = "#DEB887";
    ctx.beginPath();
    ctx.ellipse(mx, my + 4, MONKEY_RADIUS * 0.65, MONKEY_RADIUS * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    // Eye whites
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.ellipse(mx - 9, my - 6, 7, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.ellipse(mx + 9, my - 6, 7, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Pupils (follow center or look direction)
    const lookDir = monkeyRef.current.vx > 0 ? 1 : -1;
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(mx - 9 + lookDir * 2, my - 6, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.arc(mx + 9 + lookDir * 2, my - 6, 3.5, 0, Math.PI * 2);
    ctx.fill();
    // Eye shine
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath();
    ctx.arc(mx - 8 + lookDir * 2, my - 8, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.arc(mx + 10 + lookDir * 2, my - 8, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = "#8B6914";
    ctx.beginPath();
    ctx.ellipse(mx, my + 3, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mouth (cheeky grin)
    ctx.strokeStyle = "#6B4226";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(mx, my + 6, 10, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();

    // Cheek blush
    ctx.fillStyle = "rgba(255, 150, 150, 0.3)";
    ctx.beginPath();
    ctx.arc(mx - 16, my + 4, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.arc(mx + 16, my + 4, 6, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);

    // Jungle background gradient
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#1a472a");
    bg.addColorStop(0.5, "#2d5a27");
    bg.addColorStop(1, "#1a3d1a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Decorative leaves
    ctx.fillStyle = "rgba(34, 139, 34, 0.15)";
    for (let i = 0; i < 8; i++) {
      const lx = (i * 57 + 20) % W;
      const ly = (i * 41 + 10) % (H * 0.3);
      ctx.beginPath();
      ctx.ellipse(lx, ly, 30, 12, (i * 0.5), 0, Math.PI * 2);
      ctx.fill();
    }

    // Vines on sides
    ctx.strokeStyle = "rgba(34, 100, 34, 0.3)";
    ctx.lineWidth = 3;
    for (let side = 0; side < 2; side++) {
      const sx = side === 0 ? 15 : W - 15;
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      for (let y = 0; y < H; y += 5) {
        ctx.lineTo(sx + Math.sin(y * 0.04) * 10, y);
      }
      ctx.stroke();
    }

    // Ground
    ctx.fillStyle = "#3d2b1f";
    ctx.fillRect(0, H - 25, W, 25);
    ctx.fillStyle = "#4a3728";
    ctx.fillRect(0, H - 25, W, 4);

    // Draw monkey
    const m = monkeyRef.current;
    drawMonkey(ctx, m.x, m.y);

    // Slap flash effect
    const flash = slapFlashRef.current;
    if (flash && flash.frame < 15) {
      const progress = flash.frame / 15;
      const alpha = 1 - progress;

      // Impact star
      ctx.strokeStyle = `rgba(255, 255, 0, ${alpha})`;
      ctx.lineWidth = 3;
      const starSize = 15 + progress * 25;
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(flash.x, flash.y);
        ctx.lineTo(flash.x + Math.cos(a) * starSize, flash.y + Math.sin(a) * starSize);
        ctx.stroke();
      }

      // "SLAP!" text
      ctx.fillStyle = `rgba(255, 255, 100, ${alpha})`;
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SLAP!", flash.x, flash.y - 30 - progress * 20);

      // Score popup
      if (flash.label) {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.font = "bold 14px sans-serif";
        ctx.fillText(flash.label, flash.x, flash.y - 50 - progress * 15);
      }
    }

    // HUD
    ctx.textBaseline = "top";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Round: ${roundRef.current}/${MAX_ROUNDS}`, 10, 10);
    ctx.textAlign = "right";
    ctx.fillText(`Score: ${scoreRef.current}`, W - 10, 10);

    // Speed indicator
    const speed = getSpeed(roundRef.current);
    ctx.textAlign = "center";
    ctx.fillStyle = speed >= 10 ? "#ef4444" : speed >= 7 ? "#eab308" : "#4ade80";
    ctx.font = "11px sans-serif";
    ctx.fillText(`Speed: ${speed.toFixed(0)}px/f`, W / 2, 10);

    // Instruction
    if (phase === "play" && !slapFlashRef.current) {
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("Tap the monkey!", W / 2, H - 30);
    }
  }, [phase, drawMonkey, getSpeed]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (phase !== "play") return;
    const pos = getCanvasPos(e.clientX, e.clientY);
    const m = monkeyRef.current;

    const dx = pos.x - m.x;
    const dy = pos.y - m.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < MONKEY_RADIUS + 15) {
      // Calculate points based on precision
      let pts: number;
      let label: string;
      if (dist <= 10) {
        pts = 100;
        label = "PERFECT! +100";
      } else if (dist <= 25) {
        pts = 50;
        label = "Good! +50";
      } else {
        pts = 25;
        label = "OK +25";
      }

      const newScore = scoreRef.current + pts;
      setScore(newScore);
      onScoreChange?.(newScore);
      setRoundPoints(pts);
      setRoundLabel(label);
      slapFlashRef.current = { x: m.x, y: m.y, frame: 0, label };
      m.bouncing = false;

      // Advance after flash
      setTimeout(() => {
        slapFlashRef.current = null;
        if (roundRef.current >= MAX_ROUNDS) {
          setPhase("done");
        } else {
          const nextRound = roundRef.current + 1;
          setRound(nextRound);
          // Reset monkey for next round
          monkeyRef.current = {
            x: MONKEY_RADIUS + 10,
            y: H / 2 + (Math.random() - 0.5) * 80,
            vx: getSpeed(nextRound) * (Math.random() > 0.5 ? 1 : -1),
            bouncing: true,
          };
        }
      }, 800);
    }
  }, [phase, getCanvasPos, getSpeed, onScoreChange]);

  // Main game animation loop
  useEffect(() => {
    if (phase !== "play") return;

    monkeyRef.current = {
      x: MONKEY_RADIUS + 10,
      y: H / 2,
      vx: getSpeed(round),
      bouncing: true,
    };

    const loop = () => {
      const m = monkeyRef.current;

      // Move monkey
      if (m.bouncing) {
        m.x += m.vx;

        // Add slight vertical wobble
        m.y = H / 2 + Math.sin(m.x * 0.04) * 30;

        // Bounce off walls
        if (m.x >= W - MONKEY_RADIUS - 5) {
          m.x = W - MONKEY_RADIUS - 5;
          m.vx = -Math.abs(m.vx);
        }
        if (m.x <= MONKEY_RADIUS + 5) {
          m.x = MONKEY_RADIUS + 5;
          m.vx = Math.abs(m.vx);
        }
      }

      // Advance slap flash
      if (slapFlashRef.current) {
        slapFlashRef.current.frame++;
      }

      draw();
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, round, draw, getSpeed]);

  // Game end
  useEffect(() => {
    if (phase === "done") {
      draw();
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
    setRound(1);
    setScore(0);
    setRoundPoints(0);
    setRoundLabel("");
    scoreRef.current = 0;
    roundRef.current = 1;
    slapFlashRef.current = null;
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
          <h3 className="text-xl font-bold text-foreground">Monkey Slap Pro</h3>
        </div>
        <p className="text-muted-foreground mb-2">Slap the bouncing monkey!</p>
        <p className="text-muted-foreground mb-6 text-sm">Click/tap the monkey as it bounces across the screen. The closer to center, the more points! 10 rounds, monkey gets faster each time.</p>
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
        <h3 className="text-xl font-bold text-foreground">Monkey Slap Pro</h3>
        <span className="ml-auto text-sm font-bold text-yellow-400">Score: {score}</span>
      </div>

      <canvas ref={canvasRef} width={W} height={H}
        onPointerDown={handlePointerDown}
        className="w-full max-w-[400px] mx-auto rounded-2xl bg-black/50 border-2 border-white/10 touch-none select-none cursor-pointer"
        style={{ aspectRatio: `${W}/${H}` }} />

      {phase === "done" && (
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">
            Final Score: {score}/{MAX_SCORE}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {score >= 800 ? "Monkey Slap Master!" :
             score >= 500 ? "Nice slapping!" :
             score >= 300 ? "Not bad!" : "Keep practicing!"}
          </p>
        </div>
      )}
    </div>
  );
}
