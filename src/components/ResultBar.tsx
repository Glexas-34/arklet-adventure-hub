import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlookItem, rarityColors, rarityGlowColors, rarityInfo } from "@/data/gameData";

interface ResultBarProps {
  item: BlookItem | null;
  isVisible: boolean;
  onClose: () => void;
}

// Sparkle particle for Celestial
function CelestialSparkles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 80,
    y: 50 + (Math.random() - 0.5) * 80,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 1.5,
    duration: 0.8 + Math.random() * 1.2,
  }));

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, #fff, #ffd700)`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1.5, 1, 0],
          }}
          transition={{
            delay: p.delay,
            duration: p.duration,
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
          }}
        />
      ))}
    </>
  );
}

// Comet trail particles for Divine
function CometTrail() {
  const trails = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: i * 0.02,
    offsetX: (Math.random() - 0.5) * 30,
    offsetY: (Math.random() - 0.5) * 30,
    size: 3 + Math.random() * 6,
  }));

  return (
    <>
      {trails.map((t) => (
        <motion.div
          key={t.id}
          className="absolute rounded-full"
          style={{
            width: t.size,
            height: t.size,
            background: `radial-gradient(circle, #e0c0ff, #8040ff)`,
            filter: "blur(1px)",
          }}
          initial={{ x: -200 + t.offsetX, y: -200 + t.offsetY, opacity: 0.8, scale: 1 }}
          animate={{ x: t.offsetX, y: t.offsetY, opacity: 0, scale: 0 }}
          transition={{ delay: t.delay + 0.1, duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </>
  );
}

// Shockwave ring for Divine impact
function ShockwaveRing() {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
      style={{ borderColor: "hsl(270 100% 80% / 0.6)" }}
      initial={{ width: 0, height: 0, opacity: 1 }}
      animate={{ width: 600, height: 600, opacity: 0 }}
      transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
    />
  );
}

export function ResultBar({ item, isVisible, onClose }: ResultBarProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "ready">("enter");

  useEffect(() => {
    if (!isVisible || !item) {
      setPhase("enter");
      return;
    }

    if (item.rarity === "Exotic") {
      const holdTimer = setTimeout(() => setPhase("hold"), 5000);
      const readyTimer = setTimeout(() => setPhase("ready"), 20000);
      return () => {
        clearTimeout(holdTimer);
        clearTimeout(readyTimer);
      };
    } else if (item.rarity === "Primordial") {
      const holdTimer = setTimeout(() => setPhase("hold"), 5000);
      const readyTimer = setTimeout(() => setPhase("ready"), 10000);
      return () => {
        clearTimeout(holdTimer);
        clearTimeout(readyTimer);
      };
    } else if (item.rarity === "Galactic") {
      const holdTimer = setTimeout(() => setPhase("hold"), 4000);
      const readyTimer = setTimeout(() => setPhase("ready"), 8000);
      return () => {
        clearTimeout(holdTimer);
        clearTimeout(readyTimer);
      };
    } else if (item.rarity === "Godly") {
      const holdTimer = setTimeout(() => setPhase("hold"), 4000);
      const readyTimer = setTimeout(() => setPhase("ready"), 7000);
      return () => {
        clearTimeout(holdTimer);
        clearTimeout(readyTimer);
      };
    } else if (item.rarity === "Ascendent") {
      const holdTimer = setTimeout(() => setPhase("hold"), 3000);
      const readyTimer = setTimeout(() => setPhase("ready"), 6000);
      return () => {
        clearTimeout(holdTimer);
        clearTimeout(readyTimer);
      };
    } else if (item.rarity === "Transcendent") {
      const holdTimer = setTimeout(() => setPhase("hold"), 2000);
      const readyTimer = setTimeout(() => setPhase("ready"), 4000);
      return () => {
        clearTimeout(holdTimer);
        clearTimeout(readyTimer);
      };
    } else if (item.rarity === "Celestial" || item.rarity === "Divine") {
      // Auto-advance phases for epic animations
      const holdTimer = setTimeout(() => setPhase("hold"), item.rarity === "Divine" ? 800 : 600);
      const readyTimer = setTimeout(() => setPhase("ready"), item.rarity === "Divine" ? 2000 : 1800);
      return () => {
        clearTimeout(holdTimer);
        clearTimeout(readyTimer);
      };
    } else if (item.rarity === "Genesis") {
      const holdTimer = setTimeout(() => setPhase("hold"), 6000);
      const readyTimer = setTimeout(() => setPhase("ready"), 12000);
      return () => { clearTimeout(holdTimer); clearTimeout(readyTimer); };
    } else if (item.rarity === "Paradoxis" || item.rarity === "Quantara") {
      const holdTimer = setTimeout(() => setPhase("hold"), 4000);
      const readyTimer = setTimeout(() => setPhase("ready"), 8000);
      return () => { clearTimeout(holdTimer); clearTimeout(readyTimer); };
    } else if (item.rarity === "Aetherion") {
      const holdTimer = setTimeout(() => setPhase("hold"), 3000);
      const readyTimer = setTimeout(() => setPhase("ready"), 7000);
      return () => { clearTimeout(holdTimer); clearTimeout(readyTimer); };
    } else if (item.rarity === "Chronovex") {
      const holdTimer = setTimeout(() => setPhase("hold"), 3000);
      const readyTimer = setTimeout(() => setPhase("ready"), 6000);
      return () => { clearTimeout(holdTimer); clearTimeout(readyTimer); };
    } else if (item.rarity === "Singularis") {
      const holdTimer = setTimeout(() => setPhase("hold"), 4000);
      const readyTimer = setTimeout(() => setPhase("ready"), 8000);
      return () => { clearTimeout(holdTimer); clearTimeout(readyTimer); };
    } else if (item.rarity === "Ecliptica") {
      const holdTimer = setTimeout(() => setPhase("hold"), 3000);
      const readyTimer = setTimeout(() => setPhase("ready"), 7000);
      return () => { clearTimeout(holdTimer); clearTimeout(readyTimer); };
    } else if (item.rarity === "Solara") {
      const holdTimer = setTimeout(() => setPhase("hold"), 2000);
      const readyTimer = setTimeout(() => setPhase("ready"), 5000);
      return () => { clearTimeout(holdTimer); clearTimeout(readyTimer); };
    } else if (item.rarity === "Voidflare") {
      const holdTimer = setTimeout(() => setPhase("hold"), 3000);
      const readyTimer = setTimeout(() => setPhase("ready"), 6000);
      return () => { clearTimeout(holdTimer); clearTimeout(readyTimer); };
    } else if (item.rarity === "Chromaflux") {
      const holdTimer = setTimeout(() => setPhase("hold"), 2000);
      const readyTimer = setTimeout(() => setPhase("ready"), 4000);
      return () => { clearTimeout(holdTimer); clearTimeout(readyTimer); };
    }
  }, [isVisible, item]);

  if (!item) return null;

  const colorClass = rarityColors[item.rarity];
  const glowClass = rarityGlowColors[item.rarity];
  const isRare = item.rarity === "Ultra Secret" || item.rarity === "Mystical";
  const isExotic = item.rarity === "Exotic";
  const isCelestial = item.rarity === "Celestial";
  const isDivine = item.rarity === "Divine";
  const isTranscendent = item.rarity === "Transcendent";
  const isAscendent = item.rarity === "Ascendent";
  const isGodly = item.rarity === "Godly";
  const isChromaflux = item.rarity === "Chromaflux";
  const isVoidflare = item.rarity === "Voidflare";
  const isSolara = item.rarity === "Solara";
  const isEcliptica = item.rarity === "Ecliptica";
  const isSingularis = item.rarity === "Singularis";
  const isGalactic = item.rarity === "Galactic";
  const isChronovex = item.rarity === "Chronovex";
  const isAetherion = item.rarity === "Aetherion";
  const isParadoxis = item.rarity === "Paradoxis";
  const isQuantara = item.rarity === "Quantara";
  const isGenesis = item.rarity === "Genesis";
  const isPrimordial = item.rarity === "Primordial";

  // --- EXOTIC: 20s cosmic animation — nebula → lightning → black hole → card emerge ---
  if (isExotic) {
    // Generate star particles for the galaxy formation
    const starParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      angle: (i / 50) * Math.PI * 2,
      distance: 30 + Math.random() * 40,
      size: 1 + Math.random() * 3,
      delay: Math.random() * 3,
    }));

    // Lightning bolts
    const lightningBolts = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      angle: (i / 8) * 360,
      delay: 5 + i * 0.4 + Math.random() * 0.3,
    }));

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={phase === "ready" ? onClose : undefined}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ cursor: phase === "ready" ? "pointer" : "default" }}
          >
            {/* Phase 1 (0-5s): Deep space nebula background */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse at center, #0a001a 0%, #000005 40%, #000000 100%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
            />

            {/* Nebula color clouds */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 30% 40%, rgba(255,0,100,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(0,100,255,0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 30%, rgba(100,0,255,0.1) 0%, transparent 40%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 1, 0.3, 0] }}
              transition={{ duration: 10, times: [0, 0.2, 0.4, 0.7, 1] }}
            />

            {/* Star particles gravitating toward center forming galaxy (0-5s) */}
            {starParticles.map((star) => (
              <motion.div
                key={star.id}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: star.size,
                  height: star.size,
                  background: "#ffffff",
                  left: "50%",
                  top: "50%",
                }}
                initial={{
                  x: Math.cos(star.angle) * star.distance * 4,
                  y: Math.sin(star.angle) * star.distance * 4,
                  opacity: 0,
                }}
                animate={{
                  x: [
                    Math.cos(star.angle) * star.distance * 4,
                    Math.cos(star.angle + 1) * star.distance * 2,
                    Math.cos(star.angle + 2) * star.distance * 0.5,
                    0,
                  ],
                  y: [
                    Math.sin(star.angle) * star.distance * 4,
                    Math.sin(star.angle + 1) * star.distance * 2,
                    Math.sin(star.angle + 2) * star.distance * 0.5,
                    0,
                  ],
                  opacity: [0, 0.8, 1, 0],
                }}
                transition={{
                  delay: star.delay,
                  duration: 5,
                  times: [0, 0.3, 0.7, 1],
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Spinning galaxy core (forms from stars 2-5s) */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                width: 120,
                height: 120,
                background: "conic-gradient(from 0deg, rgba(255,255,255,0.3), rgba(100,0,255,0.2), rgba(255,0,100,0.2), rgba(0,200,255,0.2), rgba(255,255,255,0.3))",
                borderRadius: "50%",
                filter: "blur(8px)",
              }}
              initial={{ opacity: 0, scale: 0, rotate: 0 }}
              animate={{
                opacity: [0, 0, 0.8, 1, 0.5, 0],
                scale: [0, 0, 1, 1.2, 0.3, 0],
                rotate: [0, 0, 360, 720, 1080, 1440],
              }}
              transition={{
                duration: 12,
                times: [0, 0.15, 0.35, 0.5, 0.7, 0.85],
                ease: "easeInOut",
              }}
            />

            {/* Phase 2 (5-10s): Galaxy vibrates, turns grey. Rainbow lightning bolts */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "rgba(128,128,128,0.15)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0.4, 0.4, 0] }}
              transition={{ duration: 12, times: [0, 0.4, 0.45, 0.7, 0.85] }}
            />

            {/* Lightning bolts shooting from center (5-10s) */}
            {lightningBolts.map((bolt) => (
              <motion.div
                key={bolt.id}
                className="absolute pointer-events-none"
                style={{
                  left: "50%",
                  top: "50%",
                  width: 3,
                  height: "60vh",
                  transformOrigin: "top center",
                  transform: `rotate(${bolt.angle}deg)`,
                  background: `linear-gradient(180deg, #ffffff, hsl(${bolt.angle} 100% 60%), transparent)`,
                  filter: "blur(1px)",
                }}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{
                  opacity: [0, 0, 1, 0.8, 0],
                  scaleY: [0, 0, 1, 1, 0],
                }}
                transition={{
                  delay: bolt.delay,
                  duration: 1.5,
                  times: [0, 0.1, 0.3, 0.7, 1],
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Lightning burn marks on edges */}
            {lightningBolts.map((bolt) => (
              <motion.div
                key={`burn-${bolt.id}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: `${50 + Math.cos((bolt.angle * Math.PI) / 180) * 45}%`,
                  top: `${50 + Math.sin((bolt.angle * Math.PI) / 180) * 45}%`,
                  width: 30,
                  height: 30,
                  background: `radial-gradient(circle, hsl(${bolt.angle} 100% 60% / 0.5), transparent)`,
                  filter: "blur(5px)",
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 0, 0.8, 0.4, 0], scale: [0, 0, 1.5, 1, 0] }}
                transition={{
                  delay: bolt.delay + 0.5,
                  duration: 6,
                  times: [0, 0.05, 0.15, 0.5, 1],
                }}
              />
            ))}

            {/* Phase 3 (10-15s): Black hole collapse → silence → rainbow event horizon */}
            {/* Black hole pull-in (10-12s) */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{
                width: 40,
                height: 40,
                background: "#000000",
                boxShadow: "0 0 60px 30px rgba(0,0,0,0.9)",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0, 1, 1, 1, 1],
                scale: [0, 0, 0.5, 3, 20, 0],
              }}
              transition={{
                duration: 16,
                times: [0, 0.5, 0.6, 0.65, 0.75, 0.82],
                ease: "easeInOut",
              }}
            />

            {/* Full darkness moment (12-13s) */}
            <motion.div
              className="absolute inset-0 bg-black pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0, 1, 1, 0] }}
              transition={{
                duration: 16,
                times: [0, 0.55, 0.65, 0.7, 0.78, 0.85],
              }}
            />

            {/* Rainbow event horizon expanding (13-15s) */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{
                width: 10,
                height: 10,
                background: "conic-gradient(from 0deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff, #ff0088, #ff0000)",
                filter: "blur(20px)",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0, 0, 0, 1, 1, 0.3],
                scale: [0, 0, 0, 0, 1, 80, 100],
              }}
              transition={{
                duration: 18,
                times: [0, 0.55, 0.65, 0.72, 0.75, 0.85, 0.95],
                ease: "easeOut",
              }}
            />

            {/* Phase 4 (15-20s): Card emerges from black hole center */}
            <motion.div
              className={`relative z-10 bg-black/95 backdrop-blur-xl rounded-3xl border-4 text-center overflow-hidden ${glowClass}`}
              style={{ borderColor: "#ff00ff" }}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{
                opacity: [0, 0, 0, 0, 0, 1, 1],
                scale: [0, 0, 0, 0, 0, 1.2, 1],
                rotate: [-180, -180, -180, -180, -180, 10, 0],
              }}
              transition={{
                duration: 20,
                times: [0, 0.25, 0.5, 0.6, 0.72, 0.85, 0.95],
                ease: "easeOut",
              }}
            >
              <div className="px-12 py-10">
                {/* Iridescent rotating glow */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "conic-gradient(from 0deg, rgba(255,0,0,0.08), rgba(255,136,0,0.08), rgba(255,255,0,0.08), rgba(0,255,0,0.08), rgba(0,136,255,0.08), rgba(136,0,255,0.08), rgba(255,0,136,0.08), rgba(255,0,0,0.08))",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 17 }}
                >
                  <motion.p
                    className="text-sm font-bold uppercase tracking-widest mb-2 rarity-exotic"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    EXOTIC
                  </motion.p>
                  <motion.h3
                    className={`text-3xl font-black mb-1 ${colorClass}`}
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    {item.name}
                  </motion.h3>
                </motion.div>

                {phase === "ready" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-muted-foreground mt-4"
                  >
                    Click anywhere to dismiss
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Rainbow shockwave when card appears */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 pointer-events-none"
              style={{
                borderImage: "conic-gradient(from 0deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff, #ff0088, #ff0000) 1",
                borderStyle: "solid",
              }}
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{ width: [0, 0, 1000], height: [0, 0, 1000], opacity: [0, 1, 0] }}
              transition={{ delay: 16, duration: 1.5, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // --- PRIMORDIAL: Screen inversion, UI melt, cosmic void, off-center reveal, glitchy "Game Over?" ---
  if (isPrimordial) {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={phase === "ready" ? onClose : undefined}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ cursor: phase === "ready" ? "pointer" : "default" }}
          >
            {/* Screen inversion filter */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ backdropFilter: "invert(1)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 4, times: [0, 0.1, 0.5, 0.7] }}
            />

            {/* Cosmic background revealed behind the "melted" UI */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse at center, #0a001a 0%, #000000 50%, #1a0033 100%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0.3, 1] }}
              transition={{ duration: 4, times: [0, 0.3, 0.5, 0.7] }}
            />

            {/* Distant stars in cosmic void */}
            {Array.from({ length: 60 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 1 + Math.random() * 2,
                  height: 1 + Math.random() * 2,
                  background: "#ffffff",
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, Math.random() * 0.8 + 0.2] }}
                transition={{ delay: 2 + Math.random() * 2, duration: 1 }}
              />
            ))}

            {/* Sidebar buttons melting off screen */}
            {[
              { label: "Open Packs", icon: "📦", bg: "linear-gradient(135deg, #6d28d9, #7c3aed)" },
              { label: "Your Inventory", icon: "🎒", bg: "rgba(0,0,0,0.4)" },
              { label: "Arks Available", icon: "📖", bg: "rgba(0,0,0,0.4)" },
              { label: "Leaderboard", icon: "🏆", bg: "rgba(0,0,0,0.4)" },
              { label: "Chat", icon: "💬", bg: "rgba(0,0,0,0.4)" },
              { label: "Host Game", icon: "👥", bg: "linear-gradient(to right, #16a34a, #059669)" },
              { label: "Join Game", icon: "🔑", bg: "linear-gradient(to right, #2563eb, #4f46e5)" },
              { label: "Trade", icon: "🔄", bg: "linear-gradient(to right, #9333ea, #7c3aed)" },
            ].map((btn, i) => (
              <motion.div
                key={`melt-sidebar-${i}`}
                className="absolute pointer-events-none rounded-xl flex items-center gap-2 px-4 py-3 font-bold text-white text-sm"
                style={{
                  width: 200,
                  background: btn.bg,
                  left: 16,
                  top: `${60 + i * 52}px`,
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
                initial={{ y: 0, rotate: 0, opacity: 0.9 }}
                animate={{
                  y: [0, 0, 0, "120vh"],
                  rotate: [0, 0, -3 - i * 1.5, -8 - i * 3],
                  opacity: [0, 0.9, 0.9, 0],
                  scaleY: [1, 1, 1.3, 1.8],
                }}
                transition={{
                  duration: 4.5,
                  times: [0, 0.1, 0.35, 0.65],
                  ease: "easeIn",
                  delay: 0.3 + i * 0.12,
                }}
              >
                <span>{btn.icon}</span>
                <span>{btn.label}</span>
              </motion.div>
            ))}

            {/* Pack cards melting off screen */}
            {[
              { label: "Safari Pack", color: "#854d0e" },
              { label: "Ocean Pack", color: "#0369a1" },
              { label: "Jungle Pack", color: "#15803d" },
              { label: "Dino Pack", color: "#9a3412" },
              { label: "Space Pack", color: "#1e1b4b" },
            ].map((pack, i) => (
              <motion.div
                key={`melt-pack-${i}`}
                className="absolute pointer-events-none rounded-2xl flex flex-col items-center justify-center text-white font-bold text-xs"
                style={{
                  width: 120,
                  height: 140,
                  background: `linear-gradient(145deg, ${pack.color}, ${pack.color}dd)`,
                  right: `${40 + i * 140}px`,
                  top: `${80 + (i % 2) * 60}px`,
                  border: "2px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                }}
                initial={{ y: 0, rotate: 0, opacity: 0.85 }}
                animate={{
                  y: [0, 0, 0, "120vh"],
                  rotate: [0, 0, 5 + i * 2, 15 + i * 4],
                  opacity: [0, 0.85, 0.85, 0],
                  scaleY: [1, 1, 1.4, 2],
                }}
                transition={{
                  duration: 5,
                  times: [0, 0.1, 0.4, 0.7],
                  ease: "easeIn",
                  delay: 0.5 + i * 0.18,
                }}
              >
                <span className="text-3xl mb-1">📦</span>
                <span>{pack.label}</span>
              </motion.div>
            ))}

            {/* The card - appears off-center after delay, intentionally misaligned */}
            <motion.div
              className={`relative z-10 bg-black/95 backdrop-blur-xl rounded-3xl border-4 text-center overflow-hidden ${glowClass}`}
              style={{ borderColor: "#1a0033" }}
              initial={{ opacity: 0, scale: 0, x: 40, y: -30, rotate: 3 }}
              animate={{
                opacity: [0, 0, 0, 0.7, 1],
                scale: [0, 0, 0, 0.9, 0.95],
                x: [40, 40, 40, 35, 30],
                y: [-30, -30, -30, -25, -20],
                rotate: [3, 3, 3, 2.5, 2],
              }}
              transition={{
                duration: 8,
                times: [0, 0.3, 0.5, 0.7, 0.85],
                ease: "easeOut",
              }}
            >
              <div className="px-12 py-10">
                {/* Dark void rotating glow */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `conic-gradient(from 0deg, transparent, #1a003310, transparent, #00000020, transparent)`,
                  }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 7 }}
                >
                  <motion.p
                    className="text-sm font-bold uppercase tracking-widest mb-2 rarity-primordial"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Primordial
                  </motion.p>
                  <motion.h3
                    className={`text-3xl font-black mb-1 ${colorClass}`}
                    animate={{ scale: [1, 1.02, 1], x: [0, -1, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {item.name}
                  </motion.h3>
                </motion.div>

                {phase === "ready" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-muted-foreground mt-4"
                  >
                    Click anywhere to dismiss
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Glitchy "Game Over?" text above the card */}
            <motion.div
              className="absolute z-20 pointer-events-none"
              style={{ top: "15%", left: "50%", transform: "translateX(-50%)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0, 1, 0.6, 1, 0.8, 1] }}
              transition={{ duration: 8, times: [0, 0.3, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85] }}
            >
              <motion.h1
                className="text-5xl md:text-7xl font-black tracking-wider select-none"
                style={{
                  color: "#ff0000",
                  textShadow: "0 0 20px #ff000080, 0 0 40px #ff000040, 3px 0 #00ffff50, -3px 0 #ff00ff50",
                  fontFamily: "monospace",
                }}
                animate={{
                  x: [0, -3, 2, -1, 4, -2, 0],
                  y: [0, 1, -2, 1, -1, 2, 0],
                  skewX: [0, -2, 1, -1, 2, 0, 0],
                  opacity: [1, 0.7, 1, 0.5, 1, 0.8, 1],
                }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
              >
                Game Over?
              </motion.h1>
            </motion.div>

            {/* Glitch scanlines */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-30"
              style={{
                background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.03) 2px, rgba(255,0,0,0.03) 4px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0.5, 0.3] }}
              transition={{ duration: 5, times: [0, 0.4, 0.6, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // --- CHROMAFLUX: Vibrant gradient ignition → expanding neon ripples → sparks drift ---
  if (isChromaflux) {
    const ripples = Array.from({ length: 3 }, (_, i) => ({ id: i, delay: 0.5 + i * 0.4 }));
    const sparks = Array.from({ length: 20 }, (_, i) => ({
      id: i, x: (Math.random() - 0.5) * 60, delay: 1 + Math.random() * 2, size: 2 + Math.random() * 3,
    }));
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={phase === "ready" ? onClose : undefined}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ cursor: phase === "ready" ? "pointer" : "default" }}>
            {/* Gradient background cycling */}
            <motion.div className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, #00e5ff, #ff0066, #7fff00, #00e5ff)" , backgroundSize: "400% 400%" }}
              animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
            <motion.div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.7)" }} />
            {/* Expanding neon ripples */}
            {ripples.map((r) => (
              <motion.div key={r.id}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 pointer-events-none"
                style={{ borderColor: r.id % 2 === 0 ? "#00e5ff" : "#ff0066" }}
                initial={{ width: 0, height: 0, opacity: 1 }}
                animate={{ width: 600, height: 600, opacity: 0 }}
                transition={{ delay: r.delay, duration: 1.2, ease: "easeOut", repeat: Infinity, repeatDelay: 2 }} />
            ))}
            {/* Sparks drifting upward */}
            {sparks.map((s) => (
              <motion.div key={s.id} className="absolute rounded-full pointer-events-none"
                style={{ width: s.size, height: s.size, background: ["#00e5ff", "#ff0066", "#7fff00"][s.id % 3], left: `${50 + s.x}%`, bottom: "10%" }}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], y: [-20, -200 - Math.random() * 200] }}
                transition={{ delay: s.delay, duration: 2, repeat: Infinity, repeatDelay: Math.random() * 2 }} />
            ))}
            {/* Card with glossy glow */}
            <motion.div className={`relative z-10 bg-black/95 backdrop-blur-xl rounded-3xl border-4 text-center overflow-hidden ${glowClass}`}
              style={{ borderColor: "#00e5ff" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0, 1, 1], scale: [0, 0, 1.2, 1] }}
              transition={{ duration: 3, times: [0, 0.3, 0.7, 0.9], ease: "easeOut" }}>
              <div className="px-12 py-10">
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{ background: "conic-gradient(from 0deg, #00e5ff15, #ff006615, #7fff0015, #00e5ff15)" }}
                  animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }}>
                  <motion.p className="text-sm font-bold uppercase tracking-widest mb-2 rarity-chromaflux"
                    animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1, repeat: Infinity }}>CHROMAFLUX</motion.p>
                  <motion.h3 className={`text-3xl font-black mb-1 ${colorClass}`}
                    animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1, repeat: Infinity }}>{item.name}</motion.h3>
                </motion.div>
                {phase === "ready" && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground mt-4">Click anywhere to dismiss</motion.p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // --- VOIDFLARE: Dark mist → violet energy veins → jagged halo crown → lightning arcs ---
  if (isVoidflare) {
    const lightningArcs = Array.from({ length: 6 }, (_, i) => ({
      id: i, angle: (i / 6) * 360, delay: 2 + Math.random() * 2,
    }));
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={phase === "ready" ? onClose : undefined}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ cursor: phase === "ready" ? "pointer" : "default" }}>
            {/* Black mist background */}
            <motion.div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, #0a0020, #000000)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
            {/* Heavy black mist */}
            <motion.div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(0,0,0,0.8) 0%, transparent 60%)" }}
              initial={{ opacity: 0 }} animate={{ opacity: [0, 0.8, 0.6, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }} />
            {/* Violet energy veins flickering */}
            {Array.from({ length: 8 }, (_, i) => (
              <motion.div key={i} className="absolute pointer-events-none"
                style={{ left: "50%", top: "50%", width: 2, height: `${20 + Math.random() * 30}vh`, transformOrigin: "top center",
                  transform: `rotate(${(i / 8) * 360}deg)`, background: "linear-gradient(180deg, #7b00ff, #4400aa, transparent)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0.8, 0.2, 0.6, 0.3] }}
                transition={{ delay: 0.5 + i * 0.2, duration: 2, repeat: Infinity, repeatType: "mirror" }} />
            ))}
            {/* Jagged halo crown */}
            <motion.div className="absolute left-1/2 top-[35%] -translate-x-1/2 pointer-events-none"
              style={{ width: 160, height: 40, borderTop: "3px solid #7b00ff", borderRadius: "50%",
                boxShadow: "0 -10px 30px #7b00ff80", filter: "blur(1px)" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0, 0.8, 1], scale: [0, 0, 1, 1.05] }}
              transition={{ duration: 4, times: [0, 0.3, 0.6, 0.8] }} />
            {/* Random lightning arcs */}
            {lightningArcs.map((arc) => (
              <motion.div key={arc.id} className="absolute pointer-events-none"
                style={{ left: "50%", top: "50%", width: 2, height: "15vh", transformOrigin: "top center",
                  transform: `rotate(${arc.angle}deg)`, background: "linear-gradient(180deg, #ffffff, #7b00ff, transparent)" }}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 0] }}
                transition={{ delay: arc.delay, duration: 0.3, repeat: Infinity, repeatDelay: 1 + Math.random() * 2 }} />
            ))}
            {/* Card */}
            <motion.div className={`relative z-10 bg-black/95 backdrop-blur-xl rounded-3xl border-4 text-center overflow-hidden ${glowClass}`}
              style={{ borderColor: "#7b00ff" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0, 0, 1, 1], scale: [0, 0, 0, 1.15, 1] }}
              transition={{ duration: 5, times: [0, 0.2, 0.4, 0.7, 0.85], ease: "easeOut" }}>
              <div className="px-12 py-10">
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{ background: "conic-gradient(from 0deg, transparent, #7b00ff10, transparent)" }}
                  animate={{ rotate: -360 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 4 }}>
                  <motion.p className="text-sm font-bold uppercase tracking-widest mb-2 rarity-voidflare"
                    animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>VOIDFLARE</motion.p>
                  <motion.h3 className={`text-3xl font-black mb-1 ${colorClass}`}
                    animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>{item.name}</motion.h3>
                </motion.div>
                {phase === "ready" && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground mt-4">Click anywhere to dismiss</motion.p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // --- SOLARA: Blinding white flash → golden rays rotating → ember particles ---
  if (isSolara) {
    const rays = Array.from({ length: 12 }, (_, i) => ({ id: i, angle: (i / 12) * 360 }));
    const embers = Array.from({ length: 25 }, (_, i) => ({
      id: i, x: (Math.random() - 0.5) * 80, delay: 1 + Math.random() * 3, size: 2 + Math.random() * 4,
    }));
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={phase === "ready" ? onClose : undefined}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ cursor: phase === "ready" ? "pointer" : "default" }}>
            {/* Warm golden backdrop */}
            <motion.div className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at center, #3d2800, #1a0a00, #000000)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
            {/* Blinding white flash */}
            <motion.div className="absolute inset-0 bg-white pointer-events-none"
              initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, times: [0, 0.15, 1] }} />
            {/* Golden rays rotating clockwise */}
            <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ width: 400, height: 400 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
              {rays.map((ray) => (
                <motion.div key={ray.id} className="absolute" style={{ left: "50%", top: "50%", width: 3, height: "50%",
                  transformOrigin: "top center", transform: `rotate(${ray.angle}deg)`,
                  background: "linear-gradient(180deg, #ffc800, #ff8800, transparent)" }}
                  initial={{ opacity: 0 }} animate={{ opacity: [0, 0, 0.6, 0.8] }}
                  transition={{ delay: 0.5, duration: 1.5 }} />
              ))}
            </motion.div>
            {/* Heat shimmer distortion */}
            <motion.div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(255,200,0,0.1) 0%, transparent 50%)" }}
              animate={{ scale: [1, 1.05, 1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity }} />
            {/* Ember particles falling */}
            {embers.map((e) => (
              <motion.div key={e.id} className="absolute rounded-full pointer-events-none"
                style={{ width: e.size, height: e.size, background: `radial-gradient(circle, #ffc800, #ff4400)`,
                  left: `${50 + e.x}%`, top: "30%" }}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 0.8, 0], y: [0, 200 + Math.random() * 200] }}
                transition={{ delay: e.delay, duration: 2 + Math.random(), repeat: Infinity, repeatDelay: Math.random() * 2 }} />
            ))}
            {/* Card */}
            <motion.div className={`relative z-10 bg-black/95 backdrop-blur-xl rounded-3xl border-4 text-center overflow-hidden ${glowClass}`}
              style={{ borderColor: "#ffc800" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0, 1, 1], scale: [0, 0, 1.15, 1] }}
              transition={{ duration: 4, times: [0, 0.2, 0.6, 0.8], ease: "easeOut" }}>
              <div className="px-12 py-10">
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{ background: "conic-gradient(from 0deg, transparent, #ffc80015, transparent, #ff880010, transparent)" }}
                  animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3 }}>
                  <motion.p className="text-sm font-bold uppercase tracking-widest mb-2 rarity-solara"
                    animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>SOLARA</motion.p>
                  <motion.h3 className={`text-3xl font-black mb-1 ${colorClass}`}
                    animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>{item.name}</motion.h3>
                </motion.div>
                {phase === "ready" && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground mt-4">Click anywhere to dismiss</motion.p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // --- ECLIPTICA: Environment darkens → black sphere → crimson corona ignites → ash drifts ---
  if (isEcliptica) {
    const ashParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i, x: (Math.random() - 0.5) * 100, delay: 3 + Math.random() * 3, size: 1 + Math.random() * 3,
    }));
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={phase === "ready" ? onClose : undefined}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ cursor: phase === "ready" ? "pointer" : "default" }}>
            {/* Environment darkens */}
            <motion.div className="absolute inset-0 bg-black"
              initial={{ opacity: 0 }} animate={{ opacity: [0, 0.5, 1] }}
              transition={{ duration: 2, times: [0, 0.3, 1] }} />
            {/* Black sphere */}
            <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{ width: 80, height: 80, background: "#000000", boxShadow: "0 0 40px 20px rgba(0,0,0,1)" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0, 1, 1], scale: [0, 0, 1, 1] }}
              transition={{ duration: 4, times: [0, 0.2, 0.5, 1] }} />
            {/* Crimson corona ring */}
            <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{ width: 120, height: 120, border: "none",
                boxShadow: "0 0 40px 15px rgba(204,0,0,0.8), 0 0 80px 30px rgba(204,0,0,0.4), inset 0 0 30px 15px rgba(0,0,0,1)" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0, 0, 0.5, 1, 1], scale: [0, 0, 0, 0.8, 1, 1.05] }}
              transition={{ duration: 6, times: [0, 0.2, 0.4, 0.55, 0.7, 0.85] }} />
            {/* Crimson corona flare */}
            <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{ width: 200, height: 200, background: "radial-gradient(circle, transparent 30%, rgba(204,0,0,0.3) 50%, transparent 70%)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0, 0, 1, 0.5] }}
              transition={{ duration: 6, times: [0, 0.3, 0.5, 0.65, 0.75, 1] }} />
            {/* Ash particles drifting outward */}
            {ashParticles.map((a) => (
              <motion.div key={a.id} className="absolute rounded-full pointer-events-none"
                style={{ width: a.size, height: a.size, background: "#666666", left: "50%", top: "50%" }}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{ opacity: [0, 0.6, 0], x: a.x * 3, y: (Math.random() - 0.5) * 300 }}
                transition={{ delay: a.delay, duration: 3, repeat: Infinity, repeatDelay: Math.random() * 2 }} />
            ))}
            {/* Card */}
            <motion.div className={`relative z-10 bg-black/95 backdrop-blur-xl rounded-3xl border-4 text-center overflow-hidden ${glowClass}`}
              style={{ borderColor: "#cc0000" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0, 0, 0, 1, 1], scale: [0, 0, 0, 0, 1.15, 1] }}
              transition={{ duration: 6, times: [0, 0.2, 0.4, 0.6, 0.8, 0.9], ease: "easeOut" }}>
              <div className="px-12 py-10">
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{ background: "conic-gradient(from 0deg, transparent, #cc000010, transparent)" }}
                  animate={{ rotate: -360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 5 }}>
                  <motion.p className="text-sm font-bold uppercase tracking-widest mb-2 rarity-ecliptica"
                    animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>ECLIPTICA</motion.p>
                  <motion.h3 className={`text-3xl font-black mb-1 ${colorClass}`}
                    animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>{item.name}</motion.h3>
                </motion.div>
                {phase === "ready" && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground mt-4">Click anywhere to dismiss</motion.p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // --- SINGULARIS: Starfield → galaxy spiral forms → stars orbit → light bends inward ---
  if (isSingularis) {
    const orbitStars = Array.from({ length: 20 }, (_, i) => ({
      id: i, angle: (i / 20) * Math.PI * 2, distance: 80 + Math.random() * 120, size: 1 + Math.random() * 3, speed: 4 + Math.random() * 4,
    }));
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={phase === "ready" ? onClose : undefined}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ cursor: phase === "ready" ? "pointer" : "default" }}>
            {/* Deep space */}
            <motion.div className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at center, #0a0030, #000010, #000000)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
            {/* Background starfield */}
            {Array.from({ length: 50 }, (_, i) => (
              <motion.div key={i} className="absolute rounded-full pointer-events-none"
                style={{ width: 1 + Math.random() * 2, height: 1 + Math.random() * 2, background: "#ffffff",
                  left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                initial={{ opacity: 0 }} animate={{ opacity: [0, Math.random() * 0.8 + 0.2] }}
                transition={{ delay: Math.random() * 2, duration: 1 }} />
            ))}
            {/* Spiral galaxy */}
            <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ width: 250, height: 250,
                background: "conic-gradient(from 0deg, rgba(68,0,170,0.3), rgba(136,0,204,0.2), transparent, rgba(68,0,170,0.3), rgba(255,255,255,0.1), transparent)",
                borderRadius: "50%", filter: "blur(6px)" }}
              initial={{ opacity: 0, scale: 0, rotate: 0 }}
              animate={{ opacity: [0, 0, 0.8, 0.6], scale: [0, 0, 1.2, 1], rotate: [0, 0, 180, 720] }}
              transition={{ duration: 7, times: [0, 0.15, 0.4, 1], ease: "easeInOut" }} />
            {/* Orbiting stars */}
            {orbitStars.map((star) => (
              <motion.div key={star.id} className="absolute rounded-full pointer-events-none"
                style={{ width: star.size, height: star.size, background: "#ffffff", left: "50%", top: "50%" }}
                animate={{ x: [Math.cos(star.angle) * star.distance, Math.cos(star.angle + Math.PI) * star.distance, Math.cos(star.angle + Math.PI * 2) * star.distance],
                  y: [Math.sin(star.angle) * star.distance * 0.5, Math.sin(star.angle + Math.PI) * star.distance * 0.5, Math.sin(star.angle + Math.PI * 2) * star.distance * 0.5] }}
                transition={{ duration: star.speed, repeat: Infinity, ease: "linear" }} />
            ))}
            {/* Light bending inward effect */}
            <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{ width: 60, height: 60, background: "radial-gradient(circle, rgba(255,255,255,0.3), transparent)",
                boxShadow: "inset 0 0 30px rgba(68,0,170,0.5)" }}
              initial={{ opacity: 0 }} animate={{ opacity: [0, 0, 0.5, 0.8], scale: [1, 1, 1.5, 0.8] }}
              transition={{ duration: 6, times: [0, 0.3, 0.6, 1], repeat: Infinity, repeatType: "mirror" }} />
            {/* Card */}
            <motion.div className={`relative z-10 bg-black/95 backdrop-blur-xl rounded-3xl border-4 text-center overflow-hidden ${glowClass}`}
              style={{ borderColor: "#4400aa" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0, 0, 1, 1], scale: [0, 0, 0, 1.15, 1] }}
              transition={{ duration: 6, times: [0, 0.2, 0.45, 0.7, 0.85], ease: "easeOut" }}>
              <div className="px-12 py-10">
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{ background: "conic-gradient(from 0deg, transparent, #4400aa12, transparent, #ffffff08, transparent)" }}
                  animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 5 }}>
                  <motion.p className="text-sm font-bold uppercase tracking-widest mb-2 rarity-singularis"
                    animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>SINGULARIS</motion.p>
                  <motion.h3 className={`text-3xl font-black mb-1 ${colorClass}`}
                    animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>{item.name}</motion.h3>
                </motion.div>
                {phase === "ready" && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground mt-4">Click anywhere to dismiss</motion.p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // --- GALACTIC: Applause → beam of light → slide down → beam disappears ---
  if (isGalactic) {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={phase === "ready" ? onClose : undefined}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ cursor: phase === "ready" ? "pointer" : "default" }}
          >
            {/* Dark cosmic backdrop */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at center, #001133, #000000)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />

            {/* Distant stars */}
            {Array.from({ length: 40 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 1 + Math.random() * 3,
                  height: 1 + Math.random() * 3,
                  background: "#ffffff",
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, Math.random() * 0.6 + 0.2, Math.random() * 0.3 + 0.1] }}
                transition={{ delay: Math.random() * 2, duration: 2, repeat: Infinity, repeatType: "mirror" }}
              />
            ))}

            {/* Beam of light - vertical column from top, appears after 2s */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none"
              style={{
                width: 80,
                height: "100vh",
                background: "linear-gradient(180deg, #00ccff 0%, #ffffff80 30%, #00ccff40 60%, transparent 100%)",
                filter: "blur(8px)",
              }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{
                opacity: [0, 0, 1, 1, 1, 0],
                scaleX: [0, 0, 1, 1.2, 1, 0],
              }}
              transition={{
                duration: 7,
                times: [0, 0.28, 0.32, 0.5, 0.75, 0.85],
                ease: "easeOut",
              }}
            />
            {/* Inner bright beam core */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none"
              style={{
                width: 20,
                height: "100vh",
                background: "linear-gradient(180deg, #ffffff 0%, #00eeff 40%, transparent 100%)",
                filter: "blur(3px)",
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0, 1, 1, 1, 0],
              }}
              transition={{
                duration: 7,
                times: [0, 0.28, 0.32, 0.5, 0.75, 0.85],
                ease: "easeOut",
              }}
            />

            {/* The card - slides down the beam of light */}
            <motion.div
              className={`relative z-10 bg-black/95 backdrop-blur-xl rounded-3xl border-4 text-center overflow-hidden ${glowClass}`}
              style={{ borderColor: "#00ccff" }}
              initial={{ opacity: 0, y: "-120vh", scale: 0.6 }}
              animate={{
                opacity: [0, 0, 0, 1, 1, 1],
                y: ["-120vh", "-120vh", "-120vh", "-30vh", "0vh", "0vh"],
                scale: [0.6, 0.6, 0.6, 0.9, 1.1, 1],
              }}
              transition={{
                duration: 7,
                times: [0, 0.2, 0.3, 0.5, 0.7, 0.8],
                ease: "easeOut",
              }}
            >
              <div className="px-12 py-10">
                {/* Galactic rotating glow */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `conic-gradient(from 0deg, transparent, #00ccff12, transparent, #00ccff08, transparent)`,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 5.5 }}
                >
                  <motion.p
                    className="text-sm font-bold uppercase tracking-widest mb-2 rarity-galactic"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Galactic
                  </motion.p>
                  <motion.h3
                    className={`text-3xl font-black mb-1 ${colorClass}`}
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    {item.name}
                  </motion.h3>
                </motion.div>

                {phase === "ready" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-muted-foreground mt-4"
                  >
                    Click anywhere to dismiss
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Flash when card reaches center */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle, #00ccff60, transparent 60%)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0, 1, 0] }}
              transition={{ duration: 6, times: [0, 0.5, 0.68, 0.72, 0.85] }}
            />

            {/* Shockwave on arrival */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 pointer-events-none"
              style={{ borderColor: "hsl(195 100% 60% / 0.6)" }}
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{ width: [0, 0, 800], height: [0, 0, 800], opacity: [0, 1, 0] }}
              transition={{ delay: 4.5, duration: 1, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // --- CHRONOVEX: Glass crack → floating shards → motion reversal → shards reform ---
  if (isChronovex) {
    const shards = Array.from({ length: 15 }, (_, i) => ({
      id: i, x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 200,
      size: 8 + Math.random() * 20, rotate: Math.random() * 90, delay: 0.5 + i * 0.1,
    }));
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={phase === "ready" ? onClose : undefined}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ cursor: phase === "ready" ? "pointer" : "default" }}>
            {/* Metallic silver backdrop */}
            <motion.div className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at center, #2a2a2a, #0a0a0a, #000000)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
            {/* Glass crack flash */}
            <motion.div className="absolute inset-0 bg-white pointer-events-none"
              initial={{ opacity: 0 }} animate={{ opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.4, times: [0, 0.2, 1] }} />
            {/* Crack lines */}
            {Array.from({ length: 6 }, (_, i) => (
              <motion.div key={`crack-${i}`} className="absolute pointer-events-none"
                style={{ left: "50%", top: "50%", width: 1, height: `${15 + Math.random() * 25}vh`,
                  transformOrigin: "top center", transform: `rotate(${(i / 6) * 360 + Math.random() * 30}deg)`,
                  background: "linear-gradient(180deg, rgba(0,128,128,0.8), rgba(192,192,192,0.4), transparent)" }}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: [0, 1, 0.5, 0], scaleY: [0, 1, 1, 0] }}
                transition={{ duration: 3, times: [0, 0.1, 0.5, 0.8] }} />
            ))}
            {/* Floating shard fragments */}
            {shards.map((s) => (
              <motion.div key={s.id} className="absolute pointer-events-none"
                style={{ left: "50%", top: "50%", width: s.size, height: s.size * 0.6,
                  background: "linear-gradient(135deg, rgba(192,192,192,0.6), rgba(0,128,128,0.3))",
                  clipPath: "polygon(20% 0%, 100% 10%, 80% 100%, 0% 80%)" }}
                initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
                animate={{ opacity: [0, 0, 0.8, 0.8, 0], x: [0, 0, s.x, s.x, 0], y: [0, 0, s.y - 40, s.y - 80, 0],
                  rotate: [0, 0, s.rotate, s.rotate + 30, 0] }}
                transition={{ duration: 5, times: [0, 0.1, 0.3, 0.7, 0.9], ease: "easeInOut" }} />
            ))}
            {/* Distortion ripple */}
            <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border pointer-events-none"
              style={{ borderColor: "rgba(0,128,128,0.5)" }}
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{ width: [0, 400], height: [0, 400], opacity: [0.8, 0] }}
              transition={{ delay: 2.5, duration: 0.8, ease: "easeOut" }} />
            {/* Card */}
            <motion.div className={`relative z-10 bg-black/95 backdrop-blur-xl rounded-3xl border-4 text-center overflow-hidden ${glowClass}`}
              style={{ borderColor: "#008080" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0, 0, 0, 1, 1], scale: [0, 0, 0, 0, 1.15, 1] }}
              transition={{ duration: 5, times: [0, 0.2, 0.4, 0.6, 0.8, 0.9], ease: "easeOut" }}>
              <div className="px-12 py-10">
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{ background: "conic-gradient(from 0deg, transparent, #00808012, transparent, #c0c0c008, transparent)" }}
                  animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 4.5 }}>
                  <motion.p className="text-sm font-bold uppercase tracking-widest mb-2 rarity-chronovex"
                    animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>CHRONOVEX</motion.p>
                  <motion.h3 className={`text-3xl font-black mb-1 ${colorClass}`}
                    animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>{item.name}</motion.h3>
                </motion.div>
                {phase === "ready" && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground mt-4">Click anywhere to dismiss</motion.p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // --- AETHERION: Soft white bloom → vertical light beam → feather particles → serene glow ---
  if (isAetherion) {
    const feathers = Array.from({ length: 20 }, (_, i) => ({
      id: i, x: (Math.random() - 0.5) * 80, delay: 2 + Math.random() * 3, size: 3 + Math.random() * 5,
    }));
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={phase === "ready" ? onClose : undefined}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ cursor: phase === "ready" ? "pointer" : "default" }}>
            {/* Soft white/pastel backdrop */}
            <motion.div className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at center, #1a1a2e, #0a0a15, #000000)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
            {/* Soft white bloom */}
            <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{ width: 300, height: 300, background: "radial-gradient(circle, rgba(255,255,255,0.3), transparent 70%)" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.5, 0.8, 0.6], scale: [0, 0.5, 1, 1.2] }}
              transition={{ duration: 4, times: [0, 0.3, 0.6, 1] }} />
            {/* Vertical beam of light */}
            <motion.div className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none"
              style={{ width: 40, height: "100vh", background: "linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.1), transparent)",
                filter: "blur(4px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0.6, 0.8, 0.4] }}
              transition={{ duration: 5, times: [0, 0.2, 0.4, 0.6, 1] }} />
            {/* Feather-light particles drifting upward */}
            {feathers.map((f) => (
              <motion.div key={f.id} className="absolute rounded-full pointer-events-none"
                style={{ width: f.size, height: f.size,
                  background: `radial-gradient(circle, ${["#ffffff", "#ffd4e8", "#d4f0ff", "#e8ffd4"][f.id % 4]}, transparent)`,
                  left: `${50 + f.x}%`, top: "70%" }}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 0.6, 0], y: [0, -300 - Math.random() * 200] }}
                transition={{ delay: f.delay, duration: 3 + Math.random(), repeat: Infinity, repeatDelay: Math.random() * 2 }} />
            ))}
            {/* Gentle circular ripples */}
            {[0, 1, 2].map((i) => (
              <motion.div key={`ripple-${i}`}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border pointer-events-none"
                style={{ borderColor: "rgba(255,255,255,0.2)" }}
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{ width: 400 + i * 100, height: 400 + i * 100, opacity: [0, 0.3, 0] }}
                transition={{ delay: 3 + i * 1, duration: 2, repeat: Infinity, repeatDelay: 3 }} />
            ))}
            {/* Card */}
            <motion.div className={`relative z-10 bg-black/90 backdrop-blur-xl rounded-3xl border-4 text-center overflow-hidden ${glowClass}`}
              style={{ borderColor: "#ffffff" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0, 0, 1, 1], scale: [0, 0, 0, 1.1, 1] }}
              transition={{ duration: 5, times: [0, 0.2, 0.4, 0.7, 0.85], ease: "easeOut" }}>
              <div className="px-12 py-10">
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{ background: "conic-gradient(from 0deg, transparent, #ffffff08, transparent, #ffd4e808, transparent)" }}
                  animate={{ rotate: -360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 4.5 }}>
                  <motion.p className="text-sm font-bold uppercase tracking-widest mb-2 rarity-aetherion"
                    animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>AETHERION</motion.p>
                  <motion.h3 className={`text-3xl font-black mb-1 ${colorClass}`}
                    animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 2, repeat: Infinity }}>{item.name}</motion.h3>
                </motion.div>
                {phase === "ready" && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground mt-4">Click anywhere to dismiss</motion.p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // --- PARADOXIS: Morphing gradient patterns → fractal bloom → 4D rotation illusion ---
  if (isParadoxis) {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={phase === "ready" ? onClose : undefined}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ cursor: phase === "ready" ? "pointer" : "default" }}>
            {/* Impossible shifting background */}
            <motion.div className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff, #ff0088, #00ffff, #ff00ff)",
                backgroundSize: "800% 800%" }}
              animate={{ backgroundPosition: ["0% 0%", "50% 100%", "100% 50%", "25% 75%", "75% 25%", "0% 0%"] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }} />
            <motion.div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.75)" }} />
            {/* Fractal shapes blooming */}
            {Array.from({ length: 8 }, (_, i) => (
              <motion.div key={i} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ width: 60 + i * 30, height: 60 + i * 30,
                  border: `1px solid hsl(${(i * 45) % 360} 100% 60% / 0.3)`,
                  borderRadius: i % 2 === 0 ? "50%" : "0%",
                  transform: `rotate(${i * 22.5}deg)` }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 0, 0.5, 0.3, 0.5], scale: [0, 0, 1, 0.8, 1], rotate: [0, 0, 180, 360, 540] }}
                transition={{ delay: 1 + i * 0.3, duration: 6, repeat: Infinity, repeatType: "mirror" }} />
            ))}
            {/* Mirrored symmetry pulses */}
            <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ width: 200, height: 200,
                background: "conic-gradient(from 0deg, rgba(255,0,0,0.2), rgba(0,255,0,0.2), rgba(0,0,255,0.2), rgba(255,255,0,0.2), rgba(255,0,255,0.2), rgba(0,255,255,0.2), rgba(255,0,0,0.2))",
                borderRadius: "50%", filter: "blur(10px)" }}
              animate={{ rotate: [0, 360], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
            {/* Card with rotational depth illusion */}
            <motion.div className={`relative z-10 bg-black/95 backdrop-blur-xl rounded-3xl border-4 text-center overflow-hidden ${glowClass}`}
              style={{ borderImage: "linear-gradient(135deg, #ff0000, #00ff00, #0000ff, #ff00ff) 1", borderStyle: "solid" }}
              initial={{ opacity: 0, scale: 0, rotateY: -180 }}
              animate={{ opacity: [0, 0, 0, 1, 1], scale: [0, 0, 0, 1.1, 1], rotateY: [-180, -180, -180, 10, 0] }}
              transition={{ duration: 6, times: [0, 0.15, 0.35, 0.65, 0.8], ease: "easeOut" }}>
              <div className="px-12 py-10">
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{ background: "conic-gradient(from 0deg, #ff000008, #00ff0008, #0000ff08, #ff00ff08, #ffff0008, #00ffff08, #ff000008)" }}
                  animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 5 }}>
                  <motion.p className="text-sm font-bold uppercase tracking-widest mb-2 rarity-paradoxis"
                    animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>PARADOXIS</motion.p>
                  <motion.h3 className={`text-3xl font-black mb-1 ${colorClass}`}
                    animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1.3, repeat: Infinity }}>{item.name}</motion.h3>
                </motion.div>
                {phase === "ready" && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground mt-4">Click anywhere to dismiss</motion.p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // --- QUANTARA: Pixelation → scan lines → micro-teleport → grid flash → digital reform ---
  if (isQuantara) {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={phase === "ready" ? onClose : undefined}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ cursor: phase === "ready" ? "pointer" : "default" }}>
            {/* Deep black digital backdrop */}
            <motion.div className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at center, #001a1a, #000505, #000000)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
            {/* Scan lines sweeping upward */}
            <motion.div className="absolute inset-0 pointer-events-none"
              style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,204,0.03) 3px, rgba(0,255,204,0.03) 4px)" }}
              animate={{ backgroundPosition: ["0 0", "0 -100px"] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
            {/* Blue scan line bars */}
            {Array.from({ length: 5 }, (_, i) => (
              <motion.div key={i} className="absolute left-0 right-0 pointer-events-none"
                style={{ height: 2, background: "linear-gradient(90deg, transparent, #0066ff, #00ffcc, #0066ff, transparent)" }}
                initial={{ top: "100%", opacity: 0 }}
                animate={{ top: ["-5%"], opacity: [0, 0.6, 0] }}
                transition={{ delay: 0.5 + i * 0.8, duration: 1.5, repeat: Infinity, repeatDelay: 2 }} />
            ))}
            {/* Grid overlay flash */}
            <motion.div className="absolute inset-0 pointer-events-none"
              style={{ background: `repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(0,255,204,0.1) 49px, rgba(0,255,204,0.1) 50px),
                repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(0,102,255,0.1) 49px, rgba(0,102,255,0.1) 50px)` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0, 0.4, 0] }}
              transition={{ duration: 5, times: [0, 0.4, 0.5, 0.55, 0.7] }} />
            {/* Digital pixel fragments dissolving */}
            {Array.from({ length: 20 }, (_, i) => (
              <motion.div key={`pixel-${i}`} className="absolute pointer-events-none"
                style={{ width: 4 + Math.random() * 8, height: 4 + Math.random() * 8,
                  background: i % 2 === 0 ? "#00ffcc" : "#0066ff",
                  left: `${40 + Math.random() * 20}%`, top: `${40 + Math.random() * 20}%` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, 0.8, 0], x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 200 }}
                transition={{ delay: 3 + Math.random() * 2, duration: 1.5, repeat: Infinity, repeatDelay: 2 }} />
            ))}
            {/* Card - with micro-teleport effect */}
            <motion.div className={`relative z-10 bg-black/95 backdrop-blur-xl rounded-3xl border-4 text-center overflow-hidden ${glowClass}`}
              style={{ borderColor: "#00ffcc" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0, 0, 0, 1, 1, 1, 1, 1],
                scale: [0, 0, 0, 0, 1, 1, 1, 1, 1],
                x: [0, 0, 0, 0, -8, 6, -3, 2, 0] }}
              transition={{ duration: 6, times: [0, 0.2, 0.3, 0.5, 0.6, 0.65, 0.7, 0.75, 0.85], ease: "easeOut" }}>
              <div className="px-12 py-10">
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{ background: "conic-gradient(from 0deg, transparent, #00ffcc08, transparent, #0066ff08, transparent)" }}
                  animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 5 }}>
                  <motion.p className="text-sm font-bold uppercase tracking-widest mb-2 rarity-quantara"
                    animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}>QUANTARA</motion.p>
                  <motion.h3 className={`text-3xl font-black mb-1 ${colorClass}`}
                    animate={{ scale: [1, 1.05, 1], x: [0, -1, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>{item.name}</motion.h3>
                </motion.div>
                {phase === "ready" && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground mt-4">Click anywhere to dismiss</motion.p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // --- GENESIS: Complete darkness → Big Bang flash → shockwave sphere → golden rings → eternal glow ---
  if (isGenesis) {
    const starFragments = Array.from({ length: 40 }, (_, i) => ({
      id: i, angle: (i / 40) * Math.PI * 2, distance: 100 + Math.random() * 300,
      size: 1 + Math.random() * 3, delay: 3 + Math.random() * 2,
    }));
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={phase === "ready" ? onClose : undefined}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ cursor: phase === "ready" ? "pointer" : "default" }}>
            {/* Complete darkness */}
            <motion.div className="absolute inset-0 bg-black"
              initial={{ opacity: 1 }} animate={{ opacity: 1 }} />
            {/* Big Bang white flash */}
            <motion.div className="absolute inset-0 bg-white pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0, 1, 0.8, 0] }}
              transition={{ duration: 6, times: [0, 0.2, 0.24, 0.26, 0.3, 0.5] }} />
            {/* Shockwave sphere expanding */}
            <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 pointer-events-none"
              style={{ borderColor: "rgba(255,255,255,0.6)" }}
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{ width: [0, 0, 1500], height: [0, 0, 1500], opacity: [0, 1, 0] }}
              transition={{ delay: 1.6, duration: 2, ease: "easeOut" }} />
            {/* Second golden shockwave */}
            <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 pointer-events-none"
              style={{ borderColor: "rgba(255,215,0,0.5)" }}
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{ width: [0, 0, 1200], height: [0, 0, 1200], opacity: [0, 0.8, 0] }}
              transition={{ delay: 2, duration: 1.8, ease: "easeOut" }} />
            {/* Golden rings orbiting */}
            {[0, 1, 2].map((i) => (
              <motion.div key={`ring-${i}`}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border pointer-events-none"
                style={{ width: 100 + i * 60, height: 100 + i * 60, borderColor: "rgba(255,215,0,0.4)",
                  transformStyle: "preserve-3d" }}
                initial={{ opacity: 0, rotateX: 60 + i * 10 }}
                animate={{ opacity: [0, 0, 0, 0.6, 0.8], rotate: [0, 0, 0, 0, 360] }}
                transition={{ delay: 3 + i * 0.5, duration: 8 - i, repeat: Infinity, ease: "linear" }} />
            ))}
            {/* Star fragments drifting outward */}
            {starFragments.map((s) => (
              <motion.div key={s.id} className="absolute rounded-full pointer-events-none"
                style={{ width: s.size, height: s.size, background: "#ffffff", left: "50%", top: "50%" }}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{ opacity: [0, 0, 0.8, 0],
                  x: Math.cos(s.angle) * s.distance, y: Math.sin(s.angle) * s.distance }}
                transition={{ delay: s.delay, duration: 4, repeat: Infinity, repeatDelay: 3 }} />
            ))}
            {/* White core pulse */}
            <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{ width: 30, height: 30, background: "radial-gradient(circle, #ffffff, #ffd700, transparent)",
                boxShadow: "0 0 60px 30px rgba(255,255,255,0.5), 0 0 120px 60px rgba(255,215,0,0.3)" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0, 0, 1, 0.8, 1], scale: [0, 0, 0, 3, 1, 1.2] }}
              transition={{ duration: 8, times: [0, 0.15, 0.24, 0.28, 0.5, 0.7] }} />
            {/* Overwhelming intensity pulse */}
            <motion.div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3), transparent 50%)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0, 0, 0, 0, 0.6, 0.2] }}
              transition={{ duration: 10, times: [0, 0.2, 0.3, 0.4, 0.5, 0.7, 0.75, 0.85] }} />
            {/* Card */}
            <motion.div className={`relative z-10 bg-black/95 backdrop-blur-xl rounded-3xl border-4 text-center overflow-hidden ${glowClass}`}
              style={{ borderColor: "#ffd700" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0, 0, 0, 0, 1, 1], scale: [0, 0, 0, 0, 0, 1.2, 1] }}
              transition={{ duration: 10, times: [0, 0.15, 0.25, 0.4, 0.55, 0.75, 0.9], ease: "easeOut" }}>
              <div className="px-12 py-10">
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{ background: "conic-gradient(from 0deg, transparent, #ffd70015, transparent, #ffffff10, transparent, #ffd70015, transparent)" }}
                  animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 8 }}>
                  <motion.p className="text-sm font-bold uppercase tracking-widest mb-2 rarity-genesis"
                    animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>GENESIS</motion.p>
                  <motion.h3 className={`text-3xl font-black mb-1 ${colorClass}`}
                    animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>{item.name}</motion.h3>
                </motion.div>
                {phase === "ready" && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground mt-4">Click anywhere to dismiss</motion.p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // --- GODLY: Cards multiply, cover screen, then stack into center. Black/red theme ---
  if (isGodly) {
    // Generate random positions for multiplying cards covering the screen
    const cardPositions = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: (i % 6) * 17 - 42 + (Math.random() - 0.5) * 8,
      y: Math.floor(i / 6) * 25 - 38 + (Math.random() - 0.5) * 8,
      rotate: Math.random() * 30 - 15,
      delay: i * 0.06,
    }));

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={phase === "ready" ? onClose : undefined}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ cursor: phase === "ready" ? "pointer" : "default" }}
          >
            {/* Black backdrop */}
            <motion.div
              className="absolute inset-0 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Red shimmer overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, #cc000008, #00000008, #cc000008, #00000008)`,
                backgroundSize: "400% 400%",
              }}
              animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            {/* Red/black particles */}
            {Array.from({ length: 30 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 2 + Math.random() * 4,
                  height: 2 + Math.random() * 4,
                  background: i % 2 === 0 ? "#cc0000" : "#330000",
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.8, 0.8, 0],
                  scale: [0, 1.5, 1, 0],
                }}
                transition={{
                  delay: 0.5 + Math.random() * 3,
                  duration: 1 + Math.random() * 1.5,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 2,
                }}
              />
            ))}

            {/* Multiplying cards that appear all over the screen */}
            {cardPositions.map((pos) => (
              <motion.div
                key={pos.id}
                className="absolute z-10 bg-black/90 backdrop-blur-sm rounded-xl border-2 pointer-events-none"
                style={{
                  borderColor: "#cc0000",
                  width: 90,
                  height: 60,
                  boxShadow: "0 0 20px rgba(204,0,0,0.4)",
                }}
                initial={{
                  opacity: 0,
                  left: `${50 + pos.x}%`,
                  top: `${50 + pos.y}%`,
                  rotate: pos.rotate,
                  scale: 0,
                }}
                animate={{
                  opacity: [0, 0, 1, 1, 1, 0],
                  scale: [0, 0, 1, 1, 0.8, 0],
                  left: [`${50 + pos.x}%`, `${50 + pos.x}%`, `${50 + pos.x}%`, `${50 + pos.x}%`, "50%", "50%"],
                  top: [`${50 + pos.y}%`, `${50 + pos.y}%`, `${50 + pos.y}%`, `${50 + pos.y}%`, "50%", "50%"],
                  rotate: [pos.rotate, pos.rotate, pos.rotate, pos.rotate, 0, 0],
                }}
                transition={{
                  duration: 5.5,
                  times: [0, 0.15, 0.2 + pos.delay * 0.01, 0.55, 0.75, 0.82],
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center justify-center h-full">
                  <span className="text-xs text-red-500 font-bold opacity-60">{item.name}</span>
                </div>
              </motion.div>
            ))}

            {/* The final stacked card at center */}
            <motion.div
              className={`relative z-20 bg-black/95 backdrop-blur-xl rounded-3xl border-4 text-center overflow-hidden ${glowClass}`}
              style={{ borderColor: "#cc0000" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0, 0, 0, 1, 1],
                scale: [0, 0, 0, 0, 1.2, 1],
              }}
              transition={{
                duration: 6,
                times: [0, 0.3, 0.5, 0.7, 0.8, 0.9],
                ease: "easeOut",
              }}
            >
              <div className="px-12 py-10">
                {/* Dark red rotating glow */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `conic-gradient(from 0deg, transparent, #cc000015, transparent, #00000015, transparent, #cc000015, transparent)`,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 5 }}
                >
                  <motion.p
                    className="text-sm font-bold uppercase tracking-widest mb-2 rarity-godly"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    Godly
                  </motion.p>
                  <motion.h3
                    className={`text-3xl font-black mb-1 ${colorClass}`}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {item.name}
                  </motion.h3>
                </motion.div>

                {phase === "ready" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-muted-foreground mt-4"
                  >
                    Click anywhere to dismiss
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Red shockwave on final stack */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 pointer-events-none"
              style={{ borderColor: "rgba(204, 0, 0, 0.6)" }}
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{ width: [0, 0, 1000], height: [0, 0, 1000], opacity: [0, 1, 0] }}
              transition={{ delay: 4.5, duration: 1.2, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // --- ASCENDENT: X-formation slide pattern ---
  if (isAscendent) {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={phase === "ready" ? onClose : undefined}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ cursor: phase === "ready" ? "pointer" : "default" }}
          >
            {/* Dark backdrop */}
            <motion.div
              className="absolute inset-0 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* White flash when card crosses center each time */}
            <motion.div
              className="absolute inset-0 bg-white pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0.7, 0, 0, 0.7, 0, 0, 1, 0.15] }}
              transition={{ duration: 6, times: [0, 0.24, 0.25, 0.3, 0.49, 0.5, 0.55, 0.74, 0.75, 0.85] }}
            />

            {/* X-formation trail lines */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0.3, 0, 0, 0.3, 0] }}
              transition={{ duration: 6, times: [0, 0.2, 0.3, 0.4, 0.45, 0.55, 0.65] }}
            >
              {/* Diagonal line top-left to bottom-right */}
              <div className="absolute inset-0" style={{
                background: "linear-gradient(135deg, transparent 45%, rgba(255,255,255,0.2) 49%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.2) 51%, transparent 55%)",
              }} />
              {/* Diagonal line top-right to bottom-left */}
              <div className="absolute inset-0" style={{
                background: "linear-gradient(-135deg, transparent 45%, rgba(255,255,255,0.2) 49%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.2) 51%, transparent 55%)",
              }} />
            </motion.div>

            {/* The card - slides from top-left to bottom-right (1st diagonal), then top-right to bottom-left (2nd diagonal), settles at center */}
            <motion.div
              className={`relative z-10 bg-black/95 backdrop-blur-xl rounded-3xl border-4 text-center overflow-hidden ${glowClass}`}
              style={{ borderColor: rarityInfo.Ascendent.color }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 1, 1, 1, 0.3, 1, 1, 1, 1, 1],
                scale: [0.7, 0.8, 0.9, 0.8, 0.7, 0.8, 0.9, 0.8, 1.2, 1],
                x: ["-60vw", "-30vw", "0vw", "30vw", "60vw", "30vw", "0vw", "-30vw", "0vw", "0vw"],
                y: ["-60vh", "-30vh", "0vh", "30vh", "60vh", "-30vh", "0vh", "30vh", "0vh", "0vh"],
              }}
              transition={{
                duration: 6,
                times: [0, 0.12, 0.25, 0.37, 0.45, 0.55, 0.65, 0.72, 0.82, 0.95],
                ease: "easeInOut",
              }}
            >
              <div className="px-12 py-10">
                {/* Radiant white rotating glow */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `conic-gradient(from 0deg, transparent, #ffffff20, transparent, #ffffff15, transparent, #ffffff20, transparent)`,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 5 }}
                >
                  <motion.p
                    className="text-sm font-bold uppercase tracking-widest mb-2"
                    style={{
                      color: rarityInfo.Ascendent.color,
                      WebkitTextStroke: "1px white",
                      textShadow: "0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.4)",
                    }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Ascendent
                  </motion.p>
                  <motion.h3
                    className={`text-3xl font-black mb-1 ${colorClass}`}
                    style={{
                      WebkitTextStroke: "0.5px white",
                      textShadow: "0 0 8px rgba(255,255,255,0.6), 0 0 16px rgba(255,255,255,0.3)",
                    }}
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    {item.name}
                  </motion.h3>
                </motion.div>

                {phase === "ready" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-muted-foreground mt-4"
                  >
                    Click anywhere to dismiss
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Shockwave on final center arrival */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 pointer-events-none"
              style={{ borderColor: "hsl(0 0% 100% / 0.6)" }}
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{ width: [0, 0, 800], height: [0, 0, 800], opacity: [0, 1, 0] }}
              transition={{ delay: 4.8, duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // --- TRANSCENDENT: waits 2s then spins in from center ---
  if (isTranscendent) {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={phase === "ready" ? onClose : undefined}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ cursor: phase === "ready" ? "pointer" : "default" }}
          >
            {/* Deep red/black backdrop */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "radial-gradient(circle, #ff000030, #000000)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1] }}
              transition={{ duration: 2.2, times: [0, 0.9, 1] }}
            />

            {/* Red flash on arrival */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle, #ff404080, transparent 60%)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1, 0] }}
              transition={{ delay: 2, duration: 0.6 }}
            />

            {/* The card - invisible for 2s, then spins into center */}
            <motion.div
              className={`relative z-10 bg-black/95 backdrop-blur-xl rounded-3xl border-4 text-center overflow-hidden ${glowClass}`}
              style={{ borderColor: rarityInfo.Transcendent.color }}
              initial={{ opacity: 0, scale: 0, rotate: -720 }}
              animate={{
                opacity: [0, 0, 1, 1],
                scale: [0, 0, 1.3, 1],
                rotate: [-720, -720, 0, 0],
              }}
              transition={{
                duration: 3.5,
                times: [0, 0.57, 0.85, 1],
                ease: [
                  [0.22, 1, 0.36, 1],
                  [0.22, 1, 0.36, 1],
                  [0.22, 1, 0.36, 1],
                  [0.22, 1, 0.36, 1],
                ],
              }}
            >
              <div className="px-12 py-10">
                {/* Red rotating glow */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `conic-gradient(from 0deg, transparent, #ff404018, transparent, #ff404012, transparent, #ff404018, transparent)`,
                  }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3 }}
                >
                  <motion.p
                    className="text-sm font-bold uppercase tracking-widest mb-2"
                    style={{ color: rarityInfo.Transcendent.color }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Transcendent
                  </motion.p>
                  <motion.h3
                    className={`text-3xl font-black mb-1 ${colorClass}`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {item.name}
                  </motion.h3>
                </motion.div>

                {phase === "ready" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-muted-foreground mt-4"
                  >
                    Click anywhere to dismiss
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Shockwave ring on arrival */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 pointer-events-none"
              style={{ borderColor: "hsl(0 100% 55% / 0.6)" }}
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{ width: [0, 0, 600], height: [0, 0, 600], opacity: [0, 1, 0] }}
              transition={{ delay: 2, duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // --- CELESTIAL: Card grows to fill entire screen, then shrinks back ---
  if (isCelestial) {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={phase === "ready" ? onClose : undefined}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ cursor: phase === "ready" ? "pointer" : "default" }}
          >
            {/* Golden screen flash */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "radial-gradient(circle, #ffd70080, #000000)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0.3] }}
              transition={{ duration: 0.6, times: [0, 0.3, 1] }}
            />

            {/* Sparkles behind card */}
            <CelestialSparkles />

            {/* The card itself - grows huge then shrinks */}
            <motion.div
              className={`relative z-10 bg-black/95 backdrop-blur-xl rounded-3xl border-4 text-center overflow-hidden ${glowClass}`}
              style={{ borderColor: rarityInfo.Celestial.color }}
              initial={{ scale: 0, rotateZ: -10 }}
              animate={{
                scale: [0, 3.5, 3.5, 1],
                rotateZ: [-10, 0, 0, 0],
                borderRadius: ["24px", "0px", "0px", "24px"],
              }}
              transition={{
                duration: 2.2,
                times: [0, 0.25, 0.55, 0.85],
                ease: [
                  [0.22, 1, 0.36, 1],
                  [0.22, 1, 0.36, 1],
                  [0.22, 1, 0.36, 1],
                  [0.22, 1, 0.36, 1],
                ],
              }}
            >
              <div className="px-12 py-10">
                {/* Star burst rays */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `conic-gradient(from 0deg, transparent, #ffd70020, transparent, #ffd70015, transparent, #ffd70020, transparent)`,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.p
                    className="text-sm font-bold uppercase tracking-widest mb-2"
                    style={{ color: rarityInfo.Celestial.color }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Celestial
                  </motion.p>
                  <motion.h3
                    className={`text-3xl font-black mb-1 ${colorClass}`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {item.name}
                  </motion.h3>
                </motion.div>

                {phase === "ready" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-muted-foreground mt-4"
                  >
                    Click anywhere to dismiss
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Radial light burst */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, #ffd70040, transparent 70%)`,
              }}
              initial={{ width: 0, height: 0 }}
              animate={{ width: 800, height: 800 }}
              transition={{ delay: 0.2, duration: 1.5, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // --- DIVINE: Card flies in like a comet and crashes like a meteor ---
  if (isDivine) {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={phase === "ready" ? onClose : undefined}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ cursor: phase === "ready" ? "pointer" : "default" }}
          >
            {/* Dark backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/95"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            />

            {/* Shockwave on impact */}
            <ShockwaveRing />

            {/* Second shockwave, delayed */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
              style={{ borderColor: "hsl(270 100% 90% / 0.4)" }}
              initial={{ width: 0, height: 0, opacity: 1 }}
              animate={{ width: 400, height: 400, opacity: 0 }}
              transition={{ delay: 0.55, duration: 0.6, ease: "easeOut" }}
            />

            {/* Screen shake wrapper */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={phase !== "enter" ? {
                x: [0, -8, 6, -4, 3, -1, 0],
                y: [0, 5, -7, 4, -2, 1, 0],
              } : {}}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              {/* Comet trail particles - positioned at center */}
              <div className="absolute left-1/2 top-1/2">
                <CometTrail />
              </div>

              {/* The card - flies in from top-left */}
              <motion.div
                className={`relative z-10 bg-black/95 backdrop-blur-xl rounded-3xl border-4 text-center overflow-hidden ${glowClass}`}
                style={{ borderColor: rarityInfo.Divine.color }}
                initial={{
                  x: "-120vw",
                  y: "-120vh",
                  scale: 0.3,
                  rotate: -45,
                }}
                animate={{
                  x: 0,
                  y: 0,
                  scale: [0.3, 0.3, 1.3, 1],
                  rotate: [-45, -45, 5, 0],
                }}
                transition={{
                  duration: 1.0,
                  times: [0, 0.3, 0.5, 0.7],
                  ease: [
                    [0.45, 0, 0.55, 1],
                    [0.45, 0, 0.55, 1],
                    [0.22, 1, 0.36, 1],
                    [0.22, 1, 0.36, 1],
                  ],
                }}
              >
                <div className="px-12 py-10">
                  {/* Rotating ethereal glow */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `conic-gradient(from 0deg, transparent, #c8a2ff15, transparent, #c8a2ff10, transparent, #c8a2ff15, transparent)`,
                    }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <motion.p
                      className="text-sm font-bold uppercase tracking-widest mb-2"
                      style={{ color: rarityInfo.Divine.color }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Divine
                    </motion.p>
                    <motion.h3
                      className={`text-3xl font-black mb-1 ${colorClass}`}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
                    >
                      {item.name}
                    </motion.h3>
                  </motion.div>

                  {phase === "ready" && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-muted-foreground mt-4"
                    >
                      Click anywhere to dismiss
                    </motion.p>
                  )}
                </div>
              </motion.div>
            </motion.div>

            {/* Impact flash */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle, #c8a2ff60, transparent 60%)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ delay: 0.35, duration: 0.4 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // --- NORMAL result bar (existing behavior) ---
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`bg-black/90 backdrop-blur-md rounded-2xl px-8 py-4
                        border-2 ${glowClass} ${isRare ? "animate-jump" : ""}`}
            style={{
              borderColor: `var(--rarity-${item.rarity.toLowerCase().replace(" ", "-")})`
            }}
          >
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">You got</p>
              <h3 className={`text-2xl font-bold ${colorClass}`}>{item.name}</h3>
              <p className={`text-lg font-semibold ${colorClass}`}>{item.rarity}</p>
              <p className="text-xs text-muted-foreground mt-2">Click anywhere to dismiss</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
