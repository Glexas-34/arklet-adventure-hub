import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { drawRandomItem, rarityInfo, Rarity } from "@/data/gameData";
import { FishingIcon } from "@/components/GameModeIcons";
import { useSound } from "@/hooks/useSound";

interface CollectedItem {
  name: string;
  rarity: Rarity;
}

type FishingState = "idle" | "casting" | "waiting" | "bite" | "reeling" | "caught" | "missed";

interface FishingReelingViewProps {
  timeRemaining: number | null;
  onItemObtained: (name: string, rarity: Rarity) => void;
  onScoreChange?: (count: number) => void;
}

// Rarities with < 5% chance
const RARE_RARITIES = new Set(["Mythic", "Secret", "Ultra Secret", "Mystical"]);

export function FishingReelingView({ timeRemaining, onItemObtained, onScoreChange }: FishingReelingViewProps) {
  const { playCast, playBite, playCaught, playMissed, playRareReveal, playEpicReveal, playMysticalReveal } = useSound();
  const [collected, setCollected] = useState<CollectedItem[]>([]);
  const [fishState, setFishState] = useState<FishingState>("idle");
  const [lastCatch, setLastCatch] = useState<CollectedItem | null>(null);
  const [isRareCatch, setIsRareCatch] = useState(false);
  const isRareCatchRef = useRef(false);
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

  // Report score when collected changes
  useEffect(() => {
    onScoreChange?.(collected.length);
  }, [collected.length, onScoreChange]);

  // Play sounds on state changes
  useEffect(() => {
    if (fishState === "bite") playBite();
    if (fishState === "missed") playMissed();
  }, [fishState, playBite, playMissed]);

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
      // Dock planks detail
      ctx.strokeStyle = "#3e2723";
      ctx.lineWidth = 1;
      for (let px = 5; px < 115; px += 25) {
        ctx.beginPath();
        ctx.moveTo(px, 120);
        ctx.lineTo(px, 139);
        ctx.stroke();
      }

      // Fisherman animation based on state
      const isReeling = fishState === "reeling";
      const isCasting = fishState === "casting";
      const isBiting = fishState === "bite";
      const isCaught = fishState === "caught";

      // Body bob when reeling
      const bodyBob = isReeling ? Math.sin(frame * 0.3) * 2 : 0;
      const leanBack = isReeling ? -3 : isCasting ? 2 : 0;

      // Legs (on dock)
      ctx.fillStyle = "#1a237e";
      ctx.fillRect(52 + leanBack, 110, 7, 12);
      ctx.fillRect(63 + leanBack, 110, 7, 12);

      // Body (torso)
      ctx.fillStyle = "#c62828";
      ctx.save();
      ctx.translate(60 + leanBack, 108 + bodyBob);
      ctx.rotate(leanBack * 0.02);
      ctx.fillRect(-12, -25, 24, 28);
      ctx.restore();

      // Head
      ctx.fillStyle = "#ffcc80";
      ctx.beginPath();
      ctx.arc(60 + leanBack, 73 + bodyBob, 10, 0, Math.PI * 2);
      ctx.fill();
      // Hat
      ctx.fillStyle = "#5d4037";
      ctx.beginPath();
      ctx.ellipse(60 + leanBack, 66 + bodyBob, 14, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(52 + leanBack, 58 + bodyBob, 16, 10);

      // Arms + Fishing rod (animated)
      const rodTipX = isCasting ? 140 : isReeling ? 160 + Math.sin(frame * 0.4) * 15 : 180;
      const rodTipY = isCasting ? 80 : isReeling ? 55 + Math.sin(frame * 0.4) * 8 : 60;

      // Back arm (holding rod)
      ctx.strokeStyle = "#ffcc80";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(68 + leanBack, 90 + bodyBob);
      const elbowX = 80 + leanBack + (isReeling ? Math.sin(frame * 0.4) * 5 : 0);
      const elbowY = 80 + bodyBob;
      ctx.quadraticCurveTo(elbowX, elbowY, 75 + leanBack, 88 + bodyBob);
      ctx.stroke();

      // Front arm
      ctx.beginPath();
      ctx.moveTo(55 + leanBack, 90 + bodyBob);
      ctx.quadraticCurveTo(48 + leanBack, 95 + bodyBob, 50 + leanBack, 100 + bodyBob);
      ctx.stroke();

      // Fishing rod
      ctx.strokeStyle = "#8d6e63";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(70 + leanBack, 88 + bodyBob);
      ctx.quadraticCurveTo((70 + leanBack + rodTipX) / 2, rodTipY - 10 + bodyBob, rodTipX, rodTipY + bodyBob);
      ctx.stroke();
      // Rod tip (guide)
      ctx.fillStyle = "#bdbdbd";
      ctx.beginPath();
      ctx.arc(rodTipX, rodTipY + bodyBob, 2, 0, Math.PI * 2);
      ctx.fill();

      // Excitement animation when biting
      if (isBiting) {
        // Exclamation marks
        ctx.fillStyle = "#ff1744";
        ctx.font = "bold 16px Fredoka";
        ctx.textAlign = "center";
        const excY = 55 + Math.sin(frame * 0.5) * 3;
        ctx.fillText("!", 45 + leanBack, excY);
        ctx.fillText("!", 75 + leanBack, excY);
      }

      // Celebration when caught rare
      if (isCaught && isRareCatchRef.current) {
        // Sparkle particles around fisherman
        for (let i = 0; i < 8; i++) {
          const angle = (frame * 0.1 + i * Math.PI / 4);
          const dist = 20 + Math.sin(frame * 0.2 + i) * 10;
          const sx = 60 + Math.cos(angle) * dist;
          const sy = 85 + Math.sin(angle) * dist;
          ctx.fillStyle = ["#ffd700", "#ff1744", "#00e5ff", "#e91e63"][i % 4];
          ctx.beginPath();
          ctx.arc(sx, sy, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

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
    playCast();
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
    const rare = RARE_RARITIES.has(item.rarity);

    setTimeout(() => {
      const newItem = { name: item.name, rarity: item.rarity };
      collectedRef.current = [...collectedRef.current, newItem];
      setCollected([...collectedRef.current]);
      setLastCatch(newItem);
      setIsRareCatch(rare);
      isRareCatchRef.current = rare;
      setFishState("caught");

      if (rare) {
        // Play extra exciting sound based on how rare
        if (item.rarity === "Mystical") playMysticalReveal();
        else if (item.rarity === "Ultra Secret") playEpicReveal();
        else playRareReveal();
      } else {
        playCaught();
      }

      setTimeout(() => {
        setFishState("idle");
        setIsRareCatch(false);
        isRareCatchRef.current = false;
      }, rare ? 3000 : 2000);
    }, 800);
  }, [fishState, playCaught, playRareReveal, playEpicReveal, playMysticalReveal]);

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
      <div className="flex items-center gap-2">
        <FishingIcon size={36} />
        <h2 className="text-2xl font-bold">Fishing Reeling</h2>
      </div>

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
            isRareCatch ? (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: [0, 1.3, 1], rotate: [-10, 5, 0] }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* Full screen flash */}
                <motion.div
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 rounded-2xl"
                  style={{ backgroundColor: rarityInfo[lastCatch.rarity]?.color }}
                />
                {/* Rare catch card */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="relative bg-black/90 rounded-2xl px-6 py-4 text-center border-2 shadow-2xl"
                  style={{
                    borderColor: rarityInfo[lastCatch.rarity]?.color,
                    boxShadow: `0 0 30px ${rarityInfo[lastCatch.rarity]?.color}60, 0 0 60px ${rarityInfo[lastCatch.rarity]?.color}30`,
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="text-2xl font-black"
                    style={{ color: rarityInfo[lastCatch.rarity]?.color }}
                  >
                    {lastCatch.name}
                  </motion.div>
                  <div className="text-sm font-bold mt-1" style={{ color: rarityInfo[lastCatch.rarity]?.color }}>
                    ★ {lastCatch.rarity} ★
                  </div>
                  <div className="text-xs text-white/60 mt-1">INCREDIBLE CATCH!</div>
                </motion.div>
              </motion.div>
            ) : (
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
            )
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
