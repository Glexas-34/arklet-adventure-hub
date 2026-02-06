import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { drawRandomItem, rarityInfo, Rarity } from "@/data/gameData";

interface CollectedItem {
  name: string;
  rarity: Rarity;
}

type FishingState = "idle" | "casting" | "waiting" | "bite" | "reeling" | "caught" | "missed";

interface FishingReelingViewProps {
  timeRemaining: number | null;
  onItemObtained: (name: string, rarity: Rarity) => void;
}

export function FishingReelingView({ timeRemaining, onItemObtained }: FishingReelingViewProps) {
  const [collected, setCollected] = useState<CollectedItem[]>([]);
  const [fishState, setFishState] = useState<FishingState>("idle");
  const [lastCatch, setLastCatch] = useState<CollectedItem | null>(null);
  const committedRef = useRef(false);
  const collectedRef = useRef<CollectedItem[]>([]);
  const biteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const missTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const bobberYRef = useRef(0);

  // Commit items when game ends
  useEffect(() => {
    if (timeRemaining === 0 && !committedRef.current) {
      committedRef.current = true;
      collectedRef.current.forEach((item) => onItemObtained(item.name, item.rarity));
    }
  }, [timeRemaining, onItemObtained]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (biteTimerRef.current) clearTimeout(biteTimerRef.current);
      if (missTimerRef.current) clearTimeout(missTimerRef.current);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Animate canvas scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 400;
    const H = 300;
    let frame = 0;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      // Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 140);
      skyGrad.addColorStop(0, "#1a1a2e");
      skyGrad.addColorStop(1, "#16213e");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, 140);

      // Water
      const waterGrad = ctx.createLinearGradient(0, 140, 0, H);
      waterGrad.addColorStop(0, "#0d47a1");
      waterGrad.addColorStop(1, "#01579b");
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, 140, W, H - 140);

      // Water waves
      ctx.strokeStyle = "#1565c040";
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        for (let x = 0; x < W; x += 2) {
          const waveY = 150 + i * 30 + Math.sin((x + frame * 2 + i * 50) * 0.02) * 5;
          if (x === 0) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.stroke();
      }

      // Dock
      ctx.fillStyle = "#5d4037";
      ctx.fillRect(0, 120, 120, 20);
      ctx.fillStyle = "#4e342e";
      ctx.fillRect(10, 120, 8, 40);
      ctx.fillRect(90, 120, 8, 40);

      // Player silhouette on dock
      ctx.fillStyle = "#263238";
      // Body
      ctx.fillRect(50, 85, 20, 35);
      // Head
      ctx.beginPath();
      ctx.arc(60, 78, 12, 0, Math.PI * 2);
      ctx.fill();

      // Fishing rod
      ctx.strokeStyle = "#8d6e63";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(65, 95);
      ctx.lineTo(180, 60);
      ctx.stroke();

      // Fishing line
      if (fishState !== "idle") {
        ctx.strokeStyle = "#ffffff60";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(180, 60);

        const bobberBaseY = fishState === "bite" ? 160 : 155;
        const bobberBob = fishState === "bite"
          ? Math.sin(frame * 0.3) * 8
          : Math.sin(frame * 0.05) * 3;
        bobberYRef.current = bobberBaseY + bobberBob;

        ctx.lineTo(200, bobberYRef.current);
        ctx.stroke();

        // Bobber
        ctx.fillStyle = fishState === "bite" ? "#ff1744" : "#f44336";
        ctx.beginPath();
        ctx.arc(200, bobberYRef.current, fishState === "bite" ? 6 : 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(200, bobberYRef.current - 3, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Splash effect for bite
        if (fishState === "bite") {
          ctx.fillStyle = "#ffffff40";
          for (let i = 0; i < 4; i++) {
            const angle = (frame * 0.2 + i * 1.57);
            const dist = 10 + Math.sin(frame * 0.3) * 4;
            ctx.beginPath();
            ctx.arc(200 + Math.cos(angle) * dist, bobberYRef.current + Math.sin(angle) * dist, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Stars
      ctx.fillStyle = "#ffffff60";
      for (let i = 0; i < 15; i++) {
        const sx = ((i * 137 + 50) % W);
        const sy = ((i * 73 + 10) % 120);
        const flicker = Math.sin(frame * 0.05 + i) > 0 ? 1.5 : 1;
        ctx.beginPath();
        ctx.arc(sx, sy, flicker, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [fishState]);

  const handleCast = useCallback(() => {
    if (timeRemaining === 0) return;
    setFishState("casting");
    setLastCatch(null);

    setTimeout(() => {
      setFishState("waiting");
      // Random time until bite: 1-3s
      const biteDelay = 1000 + Math.random() * 2000;
      biteTimerRef.current = setTimeout(() => {
        setFishState("bite");
        // Player has 2s to reel
        missTimerRef.current = setTimeout(() => {
          setFishState("missed");
          setTimeout(() => setFishState("idle"), 1500);
        }, 2000);
      }, biteDelay);
    }, 500);
  }, [timeRemaining]);

  const handleReel = useCallback(() => {
    if (fishState !== "bite") return;
    if (missTimerRef.current) clearTimeout(missTimerRef.current);

    setFishState("reeling");
    const item = drawRandomItem();

    setTimeout(() => {
      const newItem = { name: item.name, rarity: item.rarity };
      collectedRef.current = [...collectedRef.current, newItem];
      setCollected([...collectedRef.current]);
      setLastCatch(newItem);
      setFishState("caught");
      setTimeout(() => setFishState("idle"), 2000);
    }, 800);
  }, [fishState]);

  const handleClick = useCallback(() => {
    if (fishState === "idle") {
      handleCast();
    } else if (fishState === "bite") {
      handleReel();
    }
  }, [fishState, handleCast, handleReel]);

  const stateMessages: Record<FishingState, string> = {
    idle: "Click to Cast!",
    casting: "Casting...",
    waiting: "Waiting for a bite...",
    bite: "A BITE! Click to Reel!",
    reeling: "Reeling in...",
    caught: lastCatch ? `Caught: ${lastCatch.name}!` : "Nice catch!",
    missed: "Too slow! The fish got away...",
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 gap-4">
      <h2 className="text-2xl font-bold">🎣 Fishing Reeling</h2>

      {/* Canvas scene */}
      <div className="relative w-full max-w-[400px]">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          onClick={handleClick}
          className="w-full rounded-2xl border-2 border-white/10 cursor-pointer"
          style={{ aspectRatio: "400/300" }}
        />

        {/* State message overlay */}
        <motion.div
          key={fishState}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-sm font-bold
                     ${fishState === "bite" ? "bg-red-500/90 text-white animate-pulse" : "bg-black/70 text-white"}`}
        >
          {stateMessages[fishState]}
        </motion.div>

        {/* Caught item display */}
        <AnimatePresence>
          {fishState === "caught" && lastCatch && (
            <motion.div
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 rounded-xl px-4 py-2 text-center"
            >
              <div className="text-lg font-bold" style={{ color: rarityInfo[lastCatch.rarity]?.color }}>
                {lastCatch.name}
              </div>
              <div className="text-xs" style={{ color: rarityInfo[lastCatch.rarity]?.color }}>
                {lastCatch.rarity}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collected Items */}
      <div className="w-full max-w-md">
        <h3 className="text-sm font-bold text-muted-foreground mb-1">
          Fish Caught: {collected.length}
        </h3>
        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
          {collected.map((item, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded bg-black/30 border border-white/10"
              style={{ color: rarityInfo[item.rarity]?.color }}
            >
              {item.name}
            </span>
          ))}
        </div>
      </div>

      {timeRemaining === 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <p className="text-xl font-bold text-primary">Time's Up!</p>
          <p className="text-muted-foreground">You caught {collected.length} items!</p>
        </motion.div>
      )}
    </div>
  );
}
