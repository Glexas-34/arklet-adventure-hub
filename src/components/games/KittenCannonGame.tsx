import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

const W = 400;
const H = 300;
const GRAVITY = 0.18;
const GROUND_Y = H - 30;
const CAT_R = 10;
const MAX_SCORE = 2000;

interface Obj {
  x: number;
  y: number;
  type: "trampoline" | "tnt";
  w: number;
  h: number;
  triggered: boolean;
}

function generateObjects(): Obj[] {
  const objs: Obj[] = [];
  // Place trampolines and TNT barrels across the landscape
  for (let i = 0; i < 20; i++) {
    const x = 300 + i * 250 + Math.random() * 150;
    const type = Math.random() < 0.5 ? "trampoline" : "tnt";
    objs.push({
      x,
      y: GROUND_Y - (type === "trampoline" ? 12 : 16),
      type,
      w: type === "trampoline" ? 40 : 24,
      h: type === "trampoline" ? 12 : 16,
      triggered: false,
    });
  }
  return objs;
}

export function KittenCannonGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"menu" | "angle" | "power" | "fly" | "done">("menu");
  const [angle, setAngle] = useState(45);
  const [power, setPower] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const stateRef = useRef({
    catX: 60,
    catY: GROUND_Y - CAT_R,
    catVX: 0,
    catVY: 0,
    cameraX: 0,
    objects: [] as Obj[],
    rotation: 0,
    bounceCount: 0,
    stopped: false,
    maxX: 0,
    powerDir: 1,
    powerVal: 0,
    cloudSeeds: Array.from({ length: 15 }, () => ({
      x: Math.random() * 5000,
      y: 20 + Math.random() * 60,
      w: 30 + Math.random() * 40,
    })),
  });
  const animRef = useRef(0);

  const resetState = useCallback(() => {
    stateRef.current = {
      catX: 60,
      catY: GROUND_Y - CAT_R,
      catVX: 0,
      catVY: 0,
      cameraX: 0,
      objects: generateObjects(),
      rotation: 0,
      bounceCount: 0,
      stopped: false,
      maxX: 0,
      powerDir: 1,
      powerVal: 0,
      cloudSeeds: Array.from({ length: 15 }, () => ({
        x: Math.random() * 5000,
        y: 20 + Math.random() * 60,
        w: 30 + Math.random() * 40,
      })),
    };
  }, []);

  // Power bar animation
  useEffect(() => {
    if (phase !== "power") return;
    const s = stateRef.current;
    const interval = setInterval(() => {
      s.powerVal += s.powerDir * 2;
      if (s.powerVal >= 100) { s.powerVal = 100; s.powerDir = -1; }
      if (s.powerVal <= 0) { s.powerVal = 0; s.powerDir = 1; }
      setPower(Math.round(s.powerVal));
    }, 20);
    return () => clearInterval(interval);
  }, [phase]);

  const launch = useCallback(() => {
    const s = stateRef.current;
    const rad = (angle * Math.PI) / 180;
    const speed = (power / 100) * 14;
    s.catVX = Math.cos(rad) * speed;
    s.catVY = -Math.sin(rad) * speed;
    s.catX = 60;
    s.catY = GROUND_Y - CAT_R;
    setPhase("fly");
  }, [angle, power]);

  const drawScene = useCallback((ctx: CanvasRenderingContext2D) => {
    const s = stateRef.current;

    ctx.clearRect(0, 0, W, H);

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#87CEEB");
    sky.addColorStop(1, "#E0F7FA");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Clouds
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    for (const cloud of s.cloudSeeds) {
      const cx = cloud.x - s.cameraX * 0.3;
      const screenX = ((cx % (W + 200)) + W + 200) % (W + 200) - 100;
      ctx.beginPath();
      ctx.ellipse(screenX, cloud.y, cloud.w / 2, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(screenX - cloud.w * 0.2, cloud.y - 6, cloud.w * 0.3, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(screenX + cloud.w * 0.2, cloud.y - 4, cloud.w * 0.25, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ground
    ctx.fillStyle = "#4ade80";
    ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(0, GROUND_Y, W, 3);

    // Distance markers
    ctx.fillStyle = "#16a34a";
    ctx.font = "9px sans-serif";
    ctx.textAlign = "center";
    const startMarker = Math.floor(s.cameraX / 200) * 200;
    for (let m = startMarker; m < startMarker + W + 200; m += 200) {
      const screenX = m - s.cameraX;
      if (screenX >= -20 && screenX <= W + 20) {
        ctx.fillRect(screenX, GROUND_Y, 1, 8);
        ctx.fillText(`${m}`, screenX, GROUND_Y + 18);
      }
    }

    // Objects
    for (const obj of s.objects) {
      const ox = obj.x - s.cameraX;
      if (ox < -60 || ox > W + 60) continue;

      if (obj.type === "trampoline") {
        // Trampoline: springy platform
        ctx.fillStyle = obj.triggered ? "#fbbf24" : "#f59e0b";
        ctx.beginPath();
        ctx.roundRect(ox - obj.w / 2, obj.y, obj.w, obj.h, 3);
        ctx.fill();
        // Spring coils
        ctx.strokeStyle = "#92400e";
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          const sx = ox - obj.w / 2 + 8 + i * 12;
          ctx.beginPath();
          ctx.moveTo(sx, obj.y + obj.h);
          ctx.lineTo(sx + 3, obj.y + obj.h - 4);
          ctx.lineTo(sx + 6, obj.y + obj.h);
          ctx.stroke();
        }
        // Label
        ctx.fillStyle = "#fff";
        ctx.font = "bold 8px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("BOING", ox, obj.y + 9);
      } else {
        // TNT barrel
        ctx.fillStyle = obj.triggered ? "#ff6b35" : "#dc2626";
        ctx.beginPath();
        ctx.roundRect(ox - obj.w / 2, obj.y, obj.w, obj.h, 4);
        ctx.fill();
        // Label
        ctx.fillStyle = "#fff";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("TNT", ox, obj.y + 11);
        // Fuse
        ctx.strokeStyle = "#854d0e";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ox, obj.y);
        ctx.quadraticCurveTo(ox + 5, obj.y - 8, ox + 2, obj.y - 12);
        ctx.stroke();
        if (obj.triggered) {
          // Explosion effect
          ctx.fillStyle = "rgba(255,200,0,0.5)";
          ctx.beginPath();
          ctx.arc(ox, obj.y, 20, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Cannon (at start)
    const cannonScreenX = 60 - s.cameraX;
    if (cannonScreenX > -100 && cannonScreenX < W + 100) {
      // Cannon base
      ctx.fillStyle = "#374151";
      ctx.beginPath();
      ctx.arc(cannonScreenX, GROUND_Y, 16, Math.PI, 0);
      ctx.fill();
      // Cannon barrel
      const rad = (angle * Math.PI) / 180;
      ctx.strokeStyle = "#1f2937";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cannonScreenX, GROUND_Y - 8);
      ctx.lineTo(
        cannonScreenX + Math.cos(rad) * 30,
        GROUND_Y - 8 - Math.sin(rad) * 30
      );
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.lineCap = "butt";
    }

    // Cat
    const catScreenX = s.catX - s.cameraX;
    ctx.save();
    ctx.translate(catScreenX, s.catY);
    ctx.rotate(s.rotation);

    // Cat body (orange circle)
    ctx.fillStyle = "#fb923c";
    ctx.beginPath();
    ctx.arc(0, 0, CAT_R, 0, Math.PI * 2);
    ctx.fill();

    // Cat face
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(-3, -2, 2.5, 0, Math.PI * 2);
    ctx.arc(3, -2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Cat pupils
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(-3, -2, 1.2, 0, Math.PI * 2);
    ctx.arc(3, -2, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Cat ears
    ctx.fillStyle = "#fb923c";
    ctx.beginPath();
    ctx.moveTo(-7, -7);
    ctx.lineTo(-4, -14);
    ctx.lineTo(-1, -7);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(1, -7);
    ctx.lineTo(4, -14);
    ctx.lineTo(7, -7);
    ctx.fill();

    // Cat mouth
    ctx.strokeStyle = "#92400e";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 1, 3, 0.1, Math.PI - 0.1);
    ctx.stroke();

    ctx.restore();

    // HUD
    ctx.fillStyle = "#000000aa";
    ctx.fillRect(0, 0, W, 28);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px Fredoka, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Distance: ${Math.round(s.maxX)}`, 10, 19);

  }, [angle]);

  // Flight animation
  useEffect(() => {
    if (phase !== "fly") return;

    const loop = () => {
      const s = stateRef.current;

      // Physics
      s.catVY += GRAVITY;
      s.catX += s.catVX;
      s.catY += s.catVY;
      s.rotation += s.catVX * 0.02;

      // Track max distance
      s.maxX = Math.max(s.maxX, s.catX - 60);

      // Update score display
      const currentScore = Math.round(s.maxX);
      setDisplayScore(currentScore);
      onScoreChange?.(currentScore);

      // Camera follows cat
      s.cameraX = Math.max(0, s.catX - W * 0.3);

      // Ground collision
      if (s.catY >= GROUND_Y - CAT_R) {
        s.catY = GROUND_Y - CAT_R;

        // Check for object collisions near landing
        let hitObject = false;
        for (const obj of s.objects) {
          if (obj.triggered) continue;
          const dist = Math.abs(s.catX - obj.x);
          if (dist < obj.w / 2 + CAT_R) {
            obj.triggered = true;
            hitObject = true;
            if (obj.type === "trampoline") {
              s.catVY = -Math.abs(s.catVY) * 0.9 - 3;
              s.catVX *= 1.05;
              s.bounceCount++;
            } else {
              // TNT explosion boost
              s.catVY = -9;
              s.catVX += 4 + Math.random() * 2;
              s.bounceCount++;
            }
            break;
          }
        }

        if (!hitObject) {
          // Normal ground bounce (with friction)
          if (Math.abs(s.catVY) > 1.5) {
            s.catVY = -s.catVY * 0.4;
            s.catVX *= 0.7;
          } else {
            // Rolling / stopping
            s.catVX *= 0.95;
            s.catVY = 0;
            s.catY = GROUND_Y - CAT_R;

            if (Math.abs(s.catVX) < 0.3) {
              s.stopped = true;
              const finalScore = Math.round(s.maxX);
              setDisplayScore(finalScore);
              onScoreChange?.(finalScore);
              setPhase("done");
              onGameEnd({
                score: finalScore,
                maxScore: MAX_SCORE,
                normalizedScore: Math.min(1, finalScore / MAX_SCORE),
              });
              return;
            }
          }
        }
      }

      // Off-screen top: let gravity bring it back
      // No ceiling death

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) drawScene(ctx);
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, drawScene, onGameEnd, onScoreChange]);

  // Draw initial scene when entering angle/power phase
  useEffect(() => {
    if (phase === "angle" || phase === "power") {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) drawScene(ctx);
      }
    }
  }, [phase, angle, power, drawScene]);

  const startGame = () => {
    resetState();
    setDisplayScore(0);
    setAngle(45);
    setPower(0);
    setPhase("angle");
  };

  const confirmAngle = () => {
    stateRef.current.powerVal = 0;
    stateRef.current.powerDir = 1;
    setPhase("power");
  };

  const confirmPower = () => {
    launch();
  };

  if (phase === "menu") {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="flex items-center gap-3 mb-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
            className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft size={20} />
          </motion.button>
          <h3 className="text-xl font-bold text-foreground">Yeet the Cat</h3>
        </div>
        <p className="text-muted-foreground mb-2">Launch a cat from a cannon for max distance!</p>
        <p className="text-muted-foreground mb-6 text-sm">Set angle, then tap to stop the power bar. Hit trampolines and TNT for extra distance!</p>
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
        <h3 className="text-xl font-bold text-foreground">Yeet the Cat</h3>
        <span className="ml-auto text-lg font-bold text-foreground">{displayScore}m</span>
      </div>

      <canvas ref={canvasRef} width={W} height={H}
        className="w-full max-w-[400px] mx-auto rounded-2xl bg-black/50 border-2 border-white/10 touch-none select-none"
        style={{ aspectRatio: `${W}/${H}` }} />

      {phase === "angle" && (
        <div className="mt-3 space-y-3 max-w-[400px] mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-foreground w-14">Angle</span>
            <input type="range" min={10} max={80} value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="flex-1 h-2 accent-orange-400" />
            <span className="text-sm text-foreground w-10 text-right">{angle}°</span>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
            onClick={confirmAngle}
            className="w-full py-3 rounded-xl font-bold text-white text-lg bg-orange-500 hover:bg-orange-400">
            Set Angle
          </motion.button>
        </div>
      )}

      {phase === "power" && (
        <div className="mt-3 space-y-3 max-w-[400px] mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-foreground w-14">Power</span>
            <div className="flex-1 h-6 bg-black/30 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full rounded-full transition-none"
                style={{
                  width: `${power}%`,
                  background: `linear-gradient(90deg, #22c55e ${0}%, #eab308 ${50}%, #ef4444 ${100}%)`,
                }}
              />
            </div>
            <span className="text-sm text-foreground w-10 text-right">{power}%</span>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
            onClick={confirmPower}
            className="w-full py-3 rounded-xl font-bold text-white text-lg bg-red-500 hover:bg-red-400">
            FIRE!
          </motion.button>
        </div>
      )}

      {phase === "done" && (
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold text-orange-400">Landed!</p>
          <p className="text-muted-foreground">Distance: {displayScore}m</p>
        </div>
      )}
    </div>
  );
}
