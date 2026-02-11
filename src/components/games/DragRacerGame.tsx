import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

const W = 400;
const H = 300;
const MAX_SCORE = 1000;
const MAX_TIME = 20;
const QUARTER_MILE = 1320; // feet

// Gear configs: [rpmRiseRate, maxRPM, gearRatio]
const GEARS = [
  { riseRate: 120, maxRPM: 8000, ratio: 3.5 },
  { riseRate: 95, maxRPM: 8500, ratio: 2.5 },
  { riseRate: 75, maxRPM: 9000, ratio: 1.8 },
  { riseRate: 58, maxRPM: 9200, ratio: 1.4 },
  { riseRate: 44, maxRPM: 9400, ratio: 1.1 },
  { riseRate: 32, maxRPM: 9600, ratio: 0.9 },
];

export function DragRacerGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"menu" | "countdown" | "racing" | "done">("menu");
  const [countdownNum, setCountdownNum] = useState(3);
  const stateRef = useRef({
    rpm: 0,
    gear: 0,
    speed: 0, // mph
    distance: 0, // feet
    time: 0,
    shiftFlash: 0, // flash timer for shift feedback
    shiftQuality: "" as "" | "perfect" | "early" | "late",
    finished: false,
    lastTimestamp: 0,
  });
  const animRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;
    const gearConfig = GEARS[s.gear];

    // Background - road
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, W, H);

    // Road surface
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 160, W, 100);

    // Road lines (move based on distance)
    const lineOffset = (s.distance * 3) % 60;
    ctx.strokeStyle = "#ffff00";
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(-lineOffset, 210);
    ctx.lineTo(W + 60 - lineOffset, 210);
    ctx.stroke();
    ctx.setLineDash([]);

    // Road edges
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 160);
    ctx.lineTo(W, 160);
    ctx.moveTo(0, 260);
    ctx.lineTo(W, 260);
    ctx.stroke();

    // Car body
    const carX = 60;
    const carY = 195;
    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(carX - 2, carY + 22, 62, 6);
    // Body
    const carGrad = ctx.createLinearGradient(carX, carY, carX, carY + 20);
    carGrad.addColorStop(0, "#e63946");
    carGrad.addColorStop(1, "#a8201a");
    ctx.fillStyle = carGrad;
    ctx.beginPath();
    ctx.roundRect(carX, carY, 60, 20, 4);
    ctx.fill();
    // Roof
    ctx.fillStyle = "#c1121f";
    ctx.beginPath();
    ctx.roundRect(carX + 15, carY - 10, 28, 12, [4, 4, 0, 0]);
    ctx.fill();
    // Windows
    ctx.fillStyle = "#a2d2ff";
    ctx.fillRect(carX + 17, carY - 8, 10, 8);
    ctx.fillRect(carX + 30, carY - 8, 10, 8);
    // Wheels
    ctx.fillStyle = "#222";
    ctx.beginPath();
    ctx.arc(carX + 14, carY + 22, 7, 0, Math.PI * 2);
    ctx.arc(carX + 48, carY + 22, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#666";
    ctx.beginPath();
    ctx.arc(carX + 14, carY + 22, 3, 0, Math.PI * 2);
    ctx.arc(carX + 48, carY + 22, 3, 0, Math.PI * 2);
    ctx.fill();

    // Exhaust particles when racing
    if (phase === "racing" && s.rpm > 2000) {
      for (let i = 0; i < 3; i++) {
        const px = carX - 5 - Math.random() * 20;
        const py = carY + 18 + (Math.random() - 0.5) * 6;
        const alpha = 0.3 + Math.random() * 0.3;
        ctx.fillStyle = `rgba(180,180,180,${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, 2 + Math.random() * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Speed lines when fast
    if (s.speed > 60) {
      const intensity = Math.min(1, (s.speed - 60) / 100);
      for (let i = 0; i < 8; i++) {
        const ly = 165 + Math.random() * 90;
        const lx = Math.random() * W;
        ctx.strokeStyle = `rgba(255,255,255,${intensity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(lx - 20 - intensity * 30, ly);
        ctx.stroke();
      }
    }

    // === HUD ===

    // RPM Gauge background
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.beginPath();
    ctx.roundRect(15, 10, 250, 30, 6);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(15, 10, 250, 30, 6);
    ctx.stroke();

    // RPM bar
    const rpmPct = s.rpm / gearConfig.maxRPM;
    const barW = 240;
    const barH = 16;
    const barX = 20;
    const barY = 17;

    // RPM zones on bar
    // Gray base
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 4);
    ctx.fill();

    // Green zone (70-85%)
    ctx.fillStyle = "rgba(34,197,94,0.3)";
    ctx.fillRect(barX + barW * 0.7, barY, barW * 0.15, barH);

    // Red zone (90%+)
    ctx.fillStyle = "rgba(239,68,68,0.3)";
    ctx.fillRect(barX + barW * 0.9, barY, barW * 0.1, barH);

    // Current RPM fill
    let rpmColor: string;
    if (rpmPct < 0.6) rpmColor = "#facc15";
    else if (rpmPct < 0.85) rpmColor = "#22c55e";
    else if (rpmPct < 0.9) rpmColor = "#f97316";
    else rpmColor = "#ef4444";

    const rpmGrad = ctx.createLinearGradient(barX, 0, barX + barW * rpmPct, 0);
    rpmGrad.addColorStop(0, rpmColor);
    rpmGrad.addColorStop(1, rpmColor);
    ctx.fillStyle = rpmGrad;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW * rpmPct, barH, 4);
    ctx.fill();

    // RPM text
    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${Math.floor(s.rpm)} RPM`, barX + barW / 2, barY + 12);

    // Gear display
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.beginPath();
    ctx.roundRect(275, 8, 55, 34, 8);
    ctx.fill();
    ctx.fillStyle = s.shiftFlash > 0 && s.shiftQuality === "perfect" ? "#22c55e" :
                    s.shiftFlash > 0 && s.shiftQuality === "early" ? "#facc15" :
                    s.shiftFlash > 0 && s.shiftQuality === "late" ? "#ef4444" : "#fff";
    ctx.font = "bold 22px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`G${s.gear + 1}`, 302, 32);

    // Speed display
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.beginPath();
    ctx.roundRect(340, 8, 52, 34, 8);
    ctx.fill();
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${Math.floor(s.speed)}`, 366, 26);
    ctx.font = "9px monospace";
    ctx.fillText("MPH", 366, 37);

    // Distance progress bar
    const distPct = Math.min(1, s.distance / QUARTER_MILE);
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.beginPath();
    ctx.roundRect(15, 48, W - 30, 14, 4);
    ctx.fill();
    const distGrad = ctx.createLinearGradient(15, 0, 15 + (W - 30) * distPct, 0);
    distGrad.addColorStop(0, "#8b5cf6");
    distGrad.addColorStop(1, "#c084fc");
    ctx.fillStyle = distGrad;
    ctx.beginPath();
    ctx.roundRect(15, 48, (W - 30) * distPct, 14, 4);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`${Math.floor(s.distance)}ft / ${QUARTER_MILE}ft`, 20, 58);

    // Time
    ctx.textAlign = "right";
    ctx.font = "bold 11px monospace";
    ctx.fillStyle = "#fbbf24";
    ctx.fillText(`${s.time.toFixed(2)}s`, W - 20, 58);

    // Shift quality flash
    if (s.shiftFlash > 0) {
      const flashAlpha = Math.min(1, s.shiftFlash / 30);
      const flashColor = s.shiftQuality === "perfect" ? `rgba(34,197,94,${flashAlpha * 0.3})` :
                         s.shiftQuality === "early" ? `rgba(250,204,21,${flashAlpha * 0.2})` :
                         `rgba(239,68,68,${flashAlpha * 0.3})`;
      ctx.fillStyle = flashColor;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = s.shiftQuality === "perfect" ? "#22c55e" :
                      s.shiftQuality === "early" ? "#facc15" : "#ef4444";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.globalAlpha = flashAlpha;
      const label = s.shiftQuality === "perfect" ? "PERFECT SHIFT!" :
                    s.shiftQuality === "early" ? "TOO EARLY!" : "TOO LATE!";
      ctx.fillText(label, W / 2, 100);
      ctx.globalAlpha = 1;
    }

    // Finish line indicator
    if (distPct > 0.9) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      const finishX = W - 40;
      ctx.beginPath();
      ctx.moveTo(finishX, 160);
      ctx.lineTo(finishX, 260);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [phase]);

  const shift = useCallback(() => {
    const s = stateRef.current;
    if (s.finished || s.gear >= 5) return;
    const gearConfig = GEARS[s.gear];
    const rpmPct = s.rpm / gearConfig.maxRPM;

    if (rpmPct >= 0.7 && rpmPct <= 0.85) {
      // Perfect shift
      s.shiftQuality = "perfect";
      s.rpm = s.rpm * 0.55; // Keep some rpm
      s.speed *= 1.05; // Speed bonus
    } else if (rpmPct < 0.6) {
      // Too early
      s.shiftQuality = "early";
      s.rpm = s.rpm * 0.3;
      s.speed *= 0.85;
    } else {
      // Too late (or in orange zone)
      s.shiftQuality = "late";
      s.rpm = s.rpm * 0.2; // Big RPM drop
      s.speed *= 0.92;
    }

    s.gear++;
    s.shiftFlash = 40;
  }, []);

  // Countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdownNum <= 0) {
      stateRef.current = {
        rpm: 0,
        gear: 0,
        speed: 0,
        distance: 0,
        time: 0,
        shiftFlash: 0,
        shiftQuality: "",
        finished: false,
        lastTimestamp: performance.now(),
      };
      setPhase("racing");
      return;
    }
    const timer = setTimeout(() => setCountdownNum((n) => n - 1), 800);
    return () => clearTimeout(timer);
  }, [phase, countdownNum]);

  // Main game loop
  useEffect(() => {
    if (phase !== "racing") return;

    const loop = (timestamp: number) => {
      const s = stateRef.current;
      if (s.finished) return;

      const dt = Math.min(0.05, (timestamp - s.lastTimestamp) / 1000);
      s.lastTimestamp = timestamp;

      const gearConfig = GEARS[s.gear];

      // RPM rises automatically
      s.rpm += gearConfig.riseRate * dt * 60;

      // Clamp RPM at max (with penalty)
      if (s.rpm >= gearConfig.maxRPM) {
        s.rpm = gearConfig.maxRPM * 0.85; // Blowout bounce
        s.shiftQuality = "late";
        s.shiftFlash = 20;
      }

      // Speed from RPM and gear
      const targetSpeed = (s.rpm / gearConfig.maxRPM) * gearConfig.ratio * 45 * (s.gear + 1);
      s.speed += (targetSpeed - s.speed) * dt * 3;
      s.speed = Math.max(0, s.speed);

      // Distance in feet (speed is in mph, convert to ft/s)
      const ftPerSec = s.speed * 1.467;
      s.distance += ftPerSec * dt;
      s.time += dt;

      // Shift flash decay
      if (s.shiftFlash > 0) s.shiftFlash--;

      // Check finish
      if (s.distance >= QUARTER_MILE) {
        s.finished = true;
        s.distance = QUARTER_MILE;
        const raceTime = s.time;
        const score = Math.max(0, Math.floor((MAX_TIME - raceTime) * 50));
        const clampedScore = Math.min(MAX_SCORE, score);
        onScoreChange?.(clampedScore);
        setTimeout(() => {
          onGameEnd({
            score: clampedScore,
            maxScore: MAX_SCORE,
            normalizedScore: Math.min(1, clampedScore / MAX_SCORE),
          });
        }, 1500);
        draw();
        return;
      }

      onScoreChange?.(Math.floor(s.distance / QUARTER_MILE * 100));
      draw();
      animRef.current = requestAnimationFrame(loop);
    };

    stateRef.current.lastTimestamp = performance.now();
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, draw, onGameEnd, onScoreChange]);

  // Input handlers
  useEffect(() => {
    if (phase !== "racing") return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp" || e.key === "Enter") {
        e.preventDefault();
        shift();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase, shift]);

  const startGame = () => {
    setCountdownNum(3);
    setPhase("countdown");
  };

  if (phase === "menu") {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="flex items-center gap-3 mb-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
            className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft size={20} />
          </motion.button>
          <h3 className="text-xl font-bold text-foreground">Drag Racer Deluxe</h3>
        </div>
        <p className="text-muted-foreground mb-2">Quarter mile drag race!</p>
        <p className="text-muted-foreground mb-6 text-sm">
          RPM rises automatically. Tap SHIFT (or canvas) when the RPM is in the green zone (70-85%).
          Shift through 6 gears to finish the race!
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
        <h3 className="text-xl font-bold text-foreground">Drag Racer Deluxe</h3>
      </div>

      {phase === "countdown" && (
        <div className="flex items-center justify-center h-[300px]">
          <motion.div
            key={countdownNum}
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="text-6xl font-black text-yellow-400"
          >
            {countdownNum > 0 ? countdownNum : "GO!"}
          </motion.div>
        </div>
      )}

      {phase === "racing" || phase === "done" ? (
        <>
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            onClick={() => shift()}
            onTouchStart={(e) => {
              e.preventDefault();
              shift();
            }}
            className="w-full max-w-[400px] mx-auto rounded-2xl bg-black/50 border-2 border-white/10 touch-none cursor-pointer"
            style={{ aspectRatio: `${W}/${H}` }}
          />

          <div className="mt-3 max-w-[400px] mx-auto">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => shift()}
              className="w-full py-4 rounded-xl font-black text-2xl text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 active:from-red-600 active:to-orange-600 shadow-lg"
            >
              SHIFT
            </motion.button>
          </div>

          {stateRef.current.finished && (
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold text-green-400">
                Finished! {stateRef.current.time.toFixed(2)}s
              </p>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
