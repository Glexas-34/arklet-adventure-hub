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

    if (item.rarity === "Celestial" || item.rarity === "Divine") {
      // Auto-advance phases for epic animations
      const holdTimer = setTimeout(() => setPhase("hold"), item.rarity === "Divine" ? 800 : 600);
      const readyTimer = setTimeout(() => setPhase("ready"), item.rarity === "Divine" ? 2000 : 1800);
      return () => {
        clearTimeout(holdTimer);
        clearTimeout(readyTimer);
      };
    }
  }, [isVisible, item]);

  if (!item) return null;

  const colorClass = rarityColors[item.rarity];
  const glowClass = rarityGlowColors[item.rarity];
  const isRare = item.rarity === "Ultra Secret" || item.rarity === "Mystical";
  const isCelestial = item.rarity === "Celestial";
  const isDivine = item.rarity === "Divine";

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
