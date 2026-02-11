import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

const W = 400;
const H = 300;
const MAX_SCORE = 20;
const GAME_TIME = 30; // 30 seconds

const BALL_RADIUS = 8;
const GRAVITY = 0.4;
const GOAL_X = W - 60;
const GOAL_WIDTH = 50;
const GOAL_HEIGHT = 80;
const KEEPER_WIDTH = 15;
const KEEPER_HEIGHT = 40;
const KEEPER_SPEED = 2.5;

const POWER_BAR_X = 30;
const POWER_BAR_Y = 50;
const POWER_BAR_WIDTH = 20;
const POWER_BAR_HEIGHT = 150;
const POWER_OSCILLATE_SPEED = 0.08;
const ANGLE_SWEEP_SPEED = 0.03;

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
}

export function RocketGoalGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"menu" | "play" | "dead">("menu");
  const stateRef = useRef({
    ball: { x: 80, y: H - 40, vx: 0, vy: 0, active: false } as Ball,
    score: 0,
    timeLeft: GAME_TIME,
    powerLevel: 0.5, // 0-1
    powerDirection: 1, // 1 or -1
    angle: 45, // degrees
    angleDirection: 1,
    phase: "power" as "power" | "angle" | "flying",
    keeperY: H / 2 - KEEPER_HEIGHT / 2,
    keeperDirection: 1,
    lastTime: Date.now(),
  });
  const animRef = useRef(0);
  const scoreRef = useRef(0);

  const resetState = useCallback(() => {
    stateRef.current = {
      ball: { x: 80, y: H - 40, vx: 0, vy: 0, active: false },
      score: 0,
      timeLeft: GAME_TIME,
      powerLevel: 0.5,
      powerDirection: 1,
      angle: 45,
      angleDirection: 1,
      phase: "power",
      keeperY: H / 2 - KEEPER_HEIGHT / 2,
      keeperDirection: 1,
      lastTime: Date.now(),
    };
    scoreRef.current = 0;
  }, []);

  const resetBall = useCallback(() => {
    const s = stateRef.current;
    s.ball = { x: 80, y: H - 40, vx: 0, vy: 0, active: false };
    s.phase = "power";
    s.powerLevel = 0.5;
    s.powerDirection = 1;
    s.angle = 45;
    s.angleDirection = 1;
  }, []);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    // Time management
    const now = Date.now();
    const dt = (now - s.lastTime) / 1000;
    s.lastTime = now;
    s.timeLeft -= dt;

    if (s.timeLeft <= 0) {
      setPhase("dead");
      onGameEnd({
        score: s.score,
        maxScore: MAX_SCORE,
        normalizedScore: Math.min(1, s.score / MAX_SCORE),
      });
      return;
    }

    // Power bar oscillation (during power phase)
    if (s.phase === "power") {
      s.powerLevel += POWER_OSCILLATE_SPEED * s.powerDirection;
      if (s.powerLevel >= 1) {
        s.powerLevel = 1;
        s.powerDirection = -1;
      } else if (s.powerLevel <= 0) {
        s.powerLevel = 0;
        s.powerDirection = 1;
      }
    }

    // Angle sweep (during angle phase)
    if (s.phase === "angle") {
      s.angle += 60 * ANGLE_SWEEP_SPEED * s.angleDirection;
      if (s.angle >= 75) {
        s.angle = 75;
        s.angleDirection = -1;
      } else if (s.angle <= 15) {
        s.angle = 15;
        s.angleDirection = 1;
      }
    }

    // Ball physics (during flying phase)
    if (s.phase === "flying" && s.ball.active) {
      s.ball.vx *= 0.995; // air resistance
      s.ball.vy += GRAVITY;
      s.ball.x += s.ball.vx;
      s.ball.y += s.ball.vy;

      // Goalkeeper movement
      s.keeperY += KEEPER_SPEED * s.keeperDirection;
      const goalTop = H / 2 - GOAL_HEIGHT / 2;
      const goalBottom = H / 2 + GOAL_HEIGHT / 2;
      if (s.keeperY <= goalTop) {
        s.keeperY = goalTop;
        s.keeperDirection = 1;
      } else if (s.keeperY + KEEPER_HEIGHT >= goalBottom) {
        s.keeperY = goalBottom - KEEPER_HEIGHT;
        s.keeperDirection = -1;
      }

      // Check goal
      if (
        s.ball.x + BALL_RADIUS >= GOAL_X &&
        s.ball.x - BALL_RADIUS <= GOAL_X + GOAL_WIDTH
      ) {
        const goalTop = H / 2 - GOAL_HEIGHT / 2;
        const goalBottom = H / 2 + GOAL_HEIGHT / 2;

        // Check if keeper blocks it
        const keeperBlocks =
          s.ball.y >= s.keeperY &&
          s.ball.y <= s.keeperY + KEEPER_HEIGHT &&
          s.ball.x >= GOAL_X &&
          s.ball.x <= GOAL_X + KEEPER_WIDTH;

        if (!keeperBlocks && s.ball.y >= goalTop && s.ball.y <= goalBottom) {
          // GOAL!
          s.score++;
          scoreRef.current = s.score;
          onScoreChange?.(s.score);
          resetBall();
        }
      }

      // Ball out of bounds - reset
      if (
        s.ball.x > W + 20 ||
        s.ball.y > H + 20 ||
        s.ball.x < -20 ||
        s.ball.y < -20
      ) {
        resetBall();
      }
    }

    // --- Draw ---
    ctx.clearRect(0, 0, W, H);

    // Background (dark green field)
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0f4c2a");
    bg.addColorStop(1, "#1a6e3f");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Field lines
    ctx.strokeStyle = "#ffffff40";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();
    ctx.setLineDash([]);

    // Goal (white rectangle on right)
    const goalTop = H / 2 - GOAL_HEIGHT / 2;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.strokeRect(GOAL_X, goalTop, GOAL_WIDTH, GOAL_HEIGHT);

    // Goal net pattern
    ctx.strokeStyle = "#ffffff40";
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(GOAL_X, goalTop + (i * GOAL_HEIGHT) / 5);
      ctx.lineTo(GOAL_X + GOAL_WIDTH, goalTop + (i * GOAL_HEIGHT) / 5);
      ctx.stroke();
    }
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(GOAL_X + (i * GOAL_WIDTH) / 3, goalTop);
      ctx.lineTo(GOAL_X + (i * GOAL_WIDTH) / 3, goalTop + GOAL_HEIGHT);
      ctx.stroke();
    }

    // Goalkeeper (red block that moves)
    ctx.fillStyle = "#ef4444";
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 8;
    ctx.fillRect(GOAL_X + 5, s.keeperY, KEEPER_WIDTH, KEEPER_HEIGHT);
    ctx.shadowBlur = 0;

    // Ball
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(s.ball.x, s.ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Black hexagon pattern on ball
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      ctx.beginPath();
      ctx.moveTo(s.ball.x, s.ball.y);
      ctx.lineTo(
        s.ball.x + Math.cos(angle) * BALL_RADIUS * 0.6,
        s.ball.y + Math.sin(angle) * BALL_RADIUS * 0.6
      );
      ctx.stroke();
    }

    // Power bar (left side)
    if (s.phase === "power" || s.phase === "angle") {
      ctx.fillStyle = "#00000080";
      ctx.fillRect(
        POWER_BAR_X - 5,
        POWER_BAR_Y - 5,
        POWER_BAR_WIDTH + 10,
        POWER_BAR_HEIGHT + 10
      );

      // Empty bar
      ctx.strokeStyle = "#ffffff80";
      ctx.lineWidth = 2;
      ctx.strokeRect(POWER_BAR_X, POWER_BAR_Y, POWER_BAR_WIDTH, POWER_BAR_HEIGHT);

      // Filled power
      const fillHeight = s.powerLevel * POWER_BAR_HEIGHT;
      const powerGrad = ctx.createLinearGradient(
        POWER_BAR_X,
        POWER_BAR_Y + POWER_BAR_HEIGHT - fillHeight,
        POWER_BAR_X,
        POWER_BAR_Y + POWER_BAR_HEIGHT
      );
      powerGrad.addColorStop(0, "#22ff44");
      powerGrad.addColorStop(1, "#ffdd00");
      ctx.fillStyle = powerGrad;
      ctx.fillRect(
        POWER_BAR_X,
        POWER_BAR_Y + POWER_BAR_HEIGHT - fillHeight,
        POWER_BAR_WIDTH,
        fillHeight
      );

      // Label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px Fredoka, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("POWER", POWER_BAR_X + POWER_BAR_WIDTH / 2, POWER_BAR_Y - 10);
    }

    // Angle indicator (arc from ball position)
    if (s.phase === "angle") {
      ctx.save();
      ctx.translate(s.ball.x, s.ball.y);

      // Arc showing angle range
      ctx.strokeStyle = "#ffffff40";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 40, -Math.PI / 2 - (75 * Math.PI) / 180, -Math.PI / 2 - (15 * Math.PI) / 180);
      ctx.stroke();

      // Current angle line
      const angleRad = -((90 - s.angle) * Math.PI) / 180;
      ctx.strokeStyle = "#ffdd00";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#ffdd00";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angleRad) * 50, Math.sin(angleRad) * 50);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.restore();

      // Angle label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px Fredoka, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`${Math.round(s.angle)}°`, s.ball.x + 60, s.ball.y - 20);
    }

    // HUD - Score
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Fredoka, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`⚽ ${s.score}`, 10, 30);

    // HUD - Timer
    ctx.textAlign = "right";
    const timeColor = s.timeLeft < 10 ? "#ef4444" : "#ffffff";
    ctx.fillStyle = timeColor;
    ctx.fillText(`⏱ ${Math.ceil(s.timeLeft)}s`, W - 10, 30);

    // Instructions
    if (s.phase === "power" || s.phase === "angle") {
      ctx.fillStyle = "#ffffff";
      ctx.font = "14px Fredoka, sans-serif";
      ctx.textAlign = "center";
      const instruction = s.phase === "power" ? "Tap to set POWER" : "Tap to set ANGLE";
      ctx.fillText(instruction, W / 2, H - 20);
    }

    animRef.current = requestAnimationFrame(gameLoop);
  }, [onGameEnd, onScoreChange, resetBall]);

  const handleCanvasClick = useCallback(() => {
    const s = stateRef.current;

    if (s.phase === "power") {
      // Lock power, move to angle phase
      s.phase = "angle";
    } else if (s.phase === "angle") {
      // Lock angle, launch ball
      const power = s.powerLevel * 12; // max speed
      const angleRad = (s.angle * Math.PI) / 180;
      s.ball.vx = Math.cos(angleRad) * power;
      s.ball.vy = -Math.sin(angleRad) * power;
      s.ball.active = true;
      s.phase = "flying";
    }
  }, []);

  useEffect(() => {
    if (phase !== "play") return;

    resetState();
    stateRef.current.lastTime = Date.now();
    animRef.current = requestAnimationFrame(gameLoop);

    const canvas = canvasRef.current;
    canvas?.addEventListener("click", handleCanvasClick);
    canvas?.addEventListener("touchstart", handleCanvasClick, { passive: true });

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas?.removeEventListener("click", handleCanvasClick);
      canvas?.removeEventListener("touchstart", handleCanvasClick);
    };
  }, [phase, resetState, gameLoop, handleCanvasClick]);

  if (phase === "menu") {
    return (
      <div className="w-full min-h-[400px] rounded-2xl relative max-w-md mx-auto text-center p-6">
        <div className="flex items-center gap-3 mb-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onExit}
            className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </motion.button>
          <h3 className="text-xl font-bold text-foreground">Rocket Goal</h3>
        </div>
        <p className="text-muted-foreground mb-2">Score goals past the keeper!</p>
        <p className="text-muted-foreground mb-6 text-sm">
          Tap once to set power, tap again to set angle. Score as many goals as you can in 30 seconds!
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPhase("play")}
          className="gradient-button text-primary-foreground font-bold px-8 py-4 rounded-xl text-xl"
        >
          Start!
        </motion.button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[400px] rounded-2xl relative max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onExit}
          className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </motion.button>
        <h3 className="text-xl font-bold text-foreground">Rocket Goal</h3>
        <span className="ml-auto text-lg font-bold text-foreground">⚽ {scoreRef.current}</span>
      </div>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="w-full max-w-[400px] mx-auto rounded-2xl bg-black/50 border-2 border-white/10 touch-none select-none cursor-pointer"
        style={{ aspectRatio: `${W}/${H}` }}
      />

      {phase === "dead" && (
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold text-green-400">Time's Up!</p>
          <p className="text-muted-foreground">Goals Scored: {scoreRef.current}</p>
        </div>
      )}
    </div>
  );
}
