import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

const W = 400;
const H = 350;
const PLATE_X = 300;
const PLATE_Y = 230;
const PITCHER_X = 100;
const PITCHER_Y = 170;
const BALL_R = 5;
const TOTAL_OUTS = 3;

type PitchType = "fast" | "curve" | "slow";
type AtBatResult = "strike" | "foul" | "single" | "double" | "triple" | "homerun" | null;

function getPitchSpeed(type: PitchType): number {
  if (type === "fast") return 5;
  if (type === "curve") return 3.5;
  return 2.5;
}

function getSwingResult(timing: number): AtBatResult {
  const accuracy = Math.abs(timing - 0.5);
  if (accuracy > 0.35) return "strike";
  if (accuracy > 0.25) return "foul";
  if (accuracy > 0.15) return "single";
  if (accuracy > 0.08) return "double";
  if (accuracy > 0.03) return "triple";
  return "homerun";
}

function runsForResult(result: AtBatResult): number {
  if (result === "single") return 1;
  if (result === "double") return 2;
  if (result === "triple") return 3;
  if (result === "homerun") return 4;
  return 0;
}

export function PinchHitterGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"menu" | "batting" | "pitch" | "result" | "done">("menu");
  const [score, setScore] = useState(0);
  const [outs, setOuts] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [pitchType, setPitchType] = useState<PitchType>("fast");
  const [lastResult, setLastResult] = useState<AtBatResult>(null);
  const [resultMsg, setResultMsg] = useState("");
  const [swung, setSwung] = useState(false);

  const ballRef = useRef({ x: PITCHER_X, y: PITCHER_Y, active: false });
  const batRef = useRef({ swinging: false, angle: 0, frame: 0 });
  const animRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#1e40af");
    sky.addColorStop(1, "#166534");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Diamond
    ctx.fillStyle = "#92400e";
    ctx.beginPath();
    ctx.moveTo(200, 120);
    ctx.lineTo(320, 230);
    ctx.lineTo(200, 290);
    ctx.lineTo(80, 230);
    ctx.closePath();
    ctx.fill();

    // Infield grass
    ctx.fillStyle = "#15803d";
    ctx.beginPath();
    ctx.arc(200, 210, 60, 0, Math.PI * 2);
    ctx.fill();

    // Mound
    ctx.fillStyle = "#a16207";
    ctx.beginPath();
    ctx.arc(PITCHER_X + 50, PITCHER_Y + 20, 12, 0, Math.PI * 2);
    ctx.fill();

    // Bases
    ctx.fillStyle = "#fff";
    for (const [bx, by] of [[200, 120], [320, 230], [200, 290], [80, 230]]) {
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-5, -5, 10, 10);
      ctx.restore();
    }

    // Pitcher
    ctx.strokeStyle = "#1e3a5f";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(PITCHER_X, PITCHER_Y - 15, 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(PITCHER_X, PITCHER_Y - 9);
    ctx.lineTo(PITCHER_X, PITCHER_Y + 8);
    ctx.moveTo(PITCHER_X, PITCHER_Y + 8);
    ctx.lineTo(PITCHER_X - 5, PITCHER_Y + 20);
    ctx.moveTo(PITCHER_X, PITCHER_Y + 8);
    ctx.lineTo(PITCHER_X + 5, PITCHER_Y + 20);
    ctx.moveTo(PITCHER_X, PITCHER_Y - 4);
    ctx.lineTo(PITCHER_X + 10, PITCHER_Y - 8);
    ctx.stroke();

    // Batter
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(PLATE_X, PLATE_Y - 18, 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(PLATE_X, PLATE_Y - 12);
    ctx.lineTo(PLATE_X, PLATE_Y + 5);
    ctx.moveTo(PLATE_X, PLATE_Y + 5);
    ctx.lineTo(PLATE_X - 6, PLATE_Y + 18);
    ctx.moveTo(PLATE_X, PLATE_Y + 5);
    ctx.lineTo(PLATE_X + 6, PLATE_Y + 18);
    ctx.stroke();

    // Bat
    const bat = batRef.current;
    const batAngle = bat.swinging ? -Math.PI / 4 + bat.angle : -Math.PI / 6;
    ctx.strokeStyle = "#92400e";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(PLATE_X - 5, PLATE_Y - 6);
    ctx.lineTo(
      PLATE_X - 5 + Math.cos(batAngle) * 25,
      PLATE_Y - 6 + Math.sin(batAngle) * 25
    );
    ctx.stroke();

    // Ball
    const ball = ballRef.current;
    if (ball.active) {
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_R, 0.3, 1.2);
      ctx.stroke();
    }

    // Strike zone
    if (phase === "pitch") {
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.strokeRect(PLATE_X - 15, PLATE_Y - 20, 15, 25);
    }

    // HUD
    ctx.fillStyle = "#60a5fa";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Runs: ${score}`, 10, 20);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "12px sans-serif";
    ctx.fillText(`Outs: ${outs}/${TOTAL_OUTS} | Strikes: ${strikes}/3`, W / 2, H - 8);

    if (phase === "batting") {
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Tap/Click to swing!", W / 2, H - 28);
    }

    if (resultMsg) {
      ctx.fillStyle = lastResult === "homerun" ? "#fbbf24" : lastResult === "strike" ? "#ef4444" : "#22c55e";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(resultMsg, W / 2, 70);
    }
  }, [phase, score, outs, strikes, lastResult, resultMsg]);

  // Auto-pitch
  useEffect(() => {
    if (phase !== "batting") return;

    const pitchDelay = 500 + Math.random() * 1000;
    const timer = setTimeout(() => {
      const types: PitchType[] = ["fast", "curve", "slow"];
      setPitchType(types[Math.floor(Math.random() * types.length)]);
      const ball = ballRef.current;
      ball.x = PITCHER_X + 10;
      ball.y = PITCHER_Y - 5;
      ball.active = true;
      setSwung(false);
      setPhase("pitch");
    }, pitchDelay);

    return () => clearTimeout(timer);
  }, [phase]);

  // Pitch animation
  useEffect(() => {
    if (phase !== "pitch") return;

    const speed = getPitchSpeed(pitchType);
    const targetX = PLATE_X - 8;
    const targetY = PLATE_Y - 8;
    const curveAmount = pitchType === "curve" ? 30 : 0;
    const startX = ballRef.current.x;
    const startY = ballRef.current.y;
    const totalDist = Math.sqrt((targetX - startX) ** 2 + (targetY - startY) ** 2);
    let progress = 0;

    const loop = () => {
      progress += speed / totalDist;
      if (progress > 1) progress = 1;

      const ball = ballRef.current;
      const t = progress;
      const midX = (startX + targetX) / 2 + curveAmount;
      const midY = (startY + targetY) / 2 - 20;
      ball.x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * targetX;
      ball.y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * midY + t * t * targetY;

      draw();

      if (progress >= 1) {
        if (!swung) {
          handleStrike();
        }
        ball.active = false;
        return;
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, pitchType, draw, swung]);

  const handleStrike = useCallback(() => {
    const newStrikes = strikes + 1;
    if (newStrikes >= 3) {
      setStrikes(0);
      const newOuts = outs + 1;
      setOuts(newOuts);
      setResultMsg("Strikeout!");
      setLastResult("strike");

      if (newOuts >= TOTAL_OUTS) {
        setPhase("done");
      } else {
        setPhase("result");
      }
    } else {
      setStrikes(newStrikes);
      setResultMsg("Strike!");
      setLastResult("strike");
      setPhase("result");
    }
  }, [strikes, outs]);

  const handleSwing = useCallback(() => {
    if (phase !== "pitch" || swung) return;
    setSwung(true);

    const ball = ballRef.current;
    const distToPlate = Math.sqrt((ball.x - (PLATE_X - 8)) ** 2 + (ball.y - (PLATE_Y - 8)) ** 2);
    const totalDist = Math.sqrt((PLATE_X - 8 - PITCHER_X) ** 2 + (PLATE_Y - 8 - PITCHER_Y) ** 2);
    const timing = 1 - distToPlate / totalDist;

    batRef.current.swinging = true;
    batRef.current.frame = 0;
    let frame = 0;
    const swingAnim = () => {
      frame++;
      batRef.current.angle = (frame / 8) * Math.PI;
      if (frame < 12) {
        requestAnimationFrame(swingAnim);
      } else {
        batRef.current.swinging = false;
        batRef.current.angle = 0;
      }
    };
    requestAnimationFrame(swingAnim);

    const result = getSwingResult(timing);
    ball.active = false;

    if (result === "strike") {
      handleStrike();
    } else if (result === "foul") {
      if (strikes < 2) {
        setStrikes(strikes + 1);
      }
      setResultMsg("Foul Ball!");
      setLastResult("foul");
      setPhase("result");
    } else {
      const runs = runsForResult(result);
      const labels: Record<string, string> = {
        single: "Single! +1",
        double: "Double! +2",
        triple: "Triple! +3",
        homerun: "HOME RUN! +4",
      };
      setResultMsg(labels[result!] || "");
      setLastResult(result);
      const newScore = score + runs;
      setScore(newScore);
      onScoreChange?.(newScore);
      setStrikes(0);
      setPhase("result");
    }
  }, [phase, swung, strikes, score, handleStrike, onScoreChange]);

  const handleCanvasClick = useCallback(() => {
    if (phase === "pitch") handleSwing();
  }, [phase, handleSwing]);

  // Result pause
  useEffect(() => {
    if (phase !== "result") return;
    draw();
    const timer = setTimeout(() => {
      setResultMsg("");
      setLastResult(null);
      setPhase("batting");
    }, 1200);
    return () => clearTimeout(timer);
  }, [phase, draw]);

  // Draw on state changes
  useEffect(() => {
    if (phase === "batting" || phase === "done") draw();
  }, [phase, draw]);

  // Done
  useEffect(() => {
    if (phase !== "done") return;
    draw();
    const timer = setTimeout(() => {
      const maxPossible = TOTAL_OUTS * 4;
      onGameEnd({
        score,
        maxScore: maxPossible,
        normalizedScore: Math.min(1, score / (maxPossible * 0.4)),
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [phase, score, onGameEnd]);

  const startGame = () => {
    setScore(0);
    setOuts(0);
    setStrikes(0);
    setResultMsg("");
    setLastResult(null);
    setSwung(false);
    ballRef.current = { x: PITCHER_X, y: PITCHER_Y, active: false };
    batRef.current = { swinging: false, angle: 0, frame: 0 };
    setPhase("batting");
  };

  if (phase === "menu") {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="flex items-center gap-3 mb-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
            className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft size={20} />
          </motion.button>
          <h3 className="text-xl font-bold text-foreground">Bat Flip Legends</h3>
        </div>
        <p className="text-muted-foreground mb-2">Swing for the fences!</p>
        <p className="text-muted-foreground mb-6 text-sm">Tap/click when the pitch reaches the plate! Better timing = better hits. Score as many runs as you can before {TOTAL_OUTS} outs!</p>
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
        <h3 className="text-xl font-bold text-foreground">Bat Flip Legends</h3>
      </div>

      <canvas ref={canvasRef} width={W} height={H}
        onClick={handleCanvasClick}
        onTouchStart={(e) => { e.preventDefault(); handleCanvasClick(); }}
        className="w-full max-w-[400px] mx-auto rounded-2xl border-2 border-white/10 select-none cursor-pointer"
        style={{ aspectRatio: `${W}/${H}`, touchAction: "none" }} />

      {phase === "done" && (
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">
            {score} Runs!
          </p>
          <p className="text-sm text-muted-foreground">
            {score >= 8 ? "MVP!" : score >= 4 ? "Great batting!" : "Keep practicing!"}
          </p>
        </div>
      )}
    </div>
  );
}
