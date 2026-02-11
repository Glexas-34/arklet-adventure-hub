import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps, GameResult } from "./types";

const W = 400;
const H = 400;
const MAX_SCORE = 50;
const PLAYER_R = 8;
const GEM_SIZE = 6;
const HEALTH_PICKUP_SIZE = 8;
const INITIAL_ZONE_R = 180;
const FINAL_ZONE_R = 30;
const ZONE_SHRINK_TIME = 60000; // 60 seconds
const DAMAGE_RATE = 2; // health per second outside zone
const MAX_HEALTH = 100;
const PLAYER_SPEED = 3.5;

interface Gem {
  x: number;
  y: number;
  type: "cyan" | "purple" | "gold";
  collected: boolean;
  pulse: number;
}

interface HealthPickup {
  x: number;
  y: number;
  collected: boolean;
  pulse: number;
}

interface GameState {
  playerX: number;
  playerY: number;
  health: number;
  score: number;
  zoneR: number;
  zoneCenterX: number;
  zoneCenterY: number;
  gems: Gem[];
  healthPickups: HealthPickup[];
  keys: Set<string>;
  touchDir: { x: number; y: number } | null;
  startTime: number;
  damageFlash: number;
}

function randomInCircle(cx: number, cy: number, r: number): { x: number; y: number } {
  const angle = Math.random() * Math.PI * 2;
  const dist = Math.random() * r;
  return {
    x: cx + Math.cos(angle) * dist,
    y: cy + Math.sin(angle) * dist,
  };
}

function generateGems(cx: number, cy: number, r: number, count: number): Gem[] {
  const gems: Gem[] = [];
  for (let i = 0; i < count; i++) {
    const pos = randomInCircle(cx, cy, r * 0.85);
    const types: ("cyan" | "purple" | "gold")[] = ["cyan", "purple", "gold"];
    const weights = [0.5, 0.35, 0.15]; // cyan most common, gold rare
    const rand = Math.random();
    let type: "cyan" | "purple" | "gold" = "cyan";
    let cumulative = 0;
    for (let j = 0; j < types.length; j++) {
      cumulative += weights[j];
      if (rand < cumulative) {
        type = types[j];
        break;
      }
    }
    gems.push({
      x: pos.x,
      y: pos.y,
      type,
      collected: false,
      pulse: Math.random() * Math.PI * 2,
    });
  }
  return gems;
}

export function ZoneRunnerGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"menu" | "play" | "dead">("menu");
  const stateRef = useRef<GameState>({
    playerX: W / 2,
    playerY: H / 2,
    health: MAX_HEALTH,
    score: 0,
    zoneR: INITIAL_ZONE_R,
    zoneCenterX: W / 2,
    zoneCenterY: H / 2,
    gems: [],
    healthPickups: [],
    keys: new Set(),
    touchDir: null,
    startTime: 0,
    damageFlash: 0,
  });
  const animRef = useRef(0);
  const [health, setHealth] = useState(MAX_HEALTH);
  const [score, setScore] = useState(0);
  const lastDamageTime = useRef(0);
  const lastGemSpawnTime = useRef(0);
  const lastHealthSpawnTime = useRef(0);

  const resetState = useCallback(() => {
    const now = Date.now();
    stateRef.current = {
      playerX: W / 2,
      playerY: H / 2,
      health: MAX_HEALTH,
      score: 0,
      zoneR: INITIAL_ZONE_R,
      zoneCenterX: W / 2,
      zoneCenterY: H / 2,
      gems: generateGems(W / 2, H / 2, INITIAL_ZONE_R, 8),
      healthPickups: [],
      keys: new Set(),
      touchDir: null,
      startTime: now,
      damageFlash: 0,
    };
    setHealth(MAX_HEALTH);
    setScore(0);
    lastDamageTime.current = now;
    lastGemSpawnTime.current = now;
    lastHealthSpawnTime.current = now;
  }, []);

  const endGame = useCallback((finalScore: number) => {
    setPhase("dead");
    onGameEnd({
      score: finalScore,
      maxScore: MAX_SCORE,
      normalizedScore: Math.min(1, finalScore / MAX_SCORE),
    });
  }, [onGameEnd]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    ctx.clearRect(0, 0, W, H);

    // Background - dark stormy
    const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.7);
    bg.addColorStop(0, "#1e293b");
    bg.addColorStop(1, "#0f172a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Storm grid
    ctx.strokeStyle = "rgba(71, 85, 105, 0.1)";
    ctx.lineWidth = 1;
    for (let gx = 0; gx < W; gx += 30) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, H);
      ctx.stroke();
    }
    for (let gy = 0; gy < H; gy += 30) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(W, gy);
      ctx.stroke();
    }

    // Safe zone - blue glowing circle
    const zoneGrad = ctx.createRadialGradient(s.zoneCenterX, s.zoneCenterY, s.zoneR * 0.8, s.zoneCenterX, s.zoneCenterY, s.zoneR);
    zoneGrad.addColorStop(0, "rgba(59, 130, 246, 0.08)");
    zoneGrad.addColorStop(0.7, "rgba(59, 130, 246, 0.15)");
    zoneGrad.addColorStop(1, "rgba(59, 130, 246, 0.25)");
    ctx.fillStyle = zoneGrad;
    ctx.beginPath();
    ctx.arc(s.zoneCenterX, s.zoneCenterY, s.zoneR, 0, Math.PI * 2);
    ctx.fill();

    // Zone border
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#3b82f6";
    ctx.beginPath();
    ctx.arc(s.zoneCenterX, s.zoneCenterY, s.zoneR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Danger pulse when outside zone
    const distFromCenter = Math.hypot(s.playerX - s.zoneCenterX, s.playerY - s.zoneCenterY);
    if (distFromCenter > s.zoneR && s.damageFlash > 0) {
      ctx.fillStyle = `rgba(239, 68, 68, ${s.damageFlash * 0.3})`;
      ctx.fillRect(0, 0, W, H);
    }

    // Health pickups
    for (const hp of s.healthPickups) {
      if (hp.collected) continue;
      const pulse = 1 + Math.sin(hp.pulse) * 0.2;
      hp.pulse += 0.1;

      // Glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#22c55e";
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.arc(hp.x, hp.y, HEALTH_PICKUP_SIZE * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Cross symbol
      ctx.fillStyle = "#fff";
      ctx.fillRect(hp.x - 1, hp.y - 4, 2, 8);
      ctx.fillRect(hp.x - 4, hp.y - 1, 8, 2);
    }

    // Gems
    for (const gem of s.gems) {
      if (gem.collected) continue;
      const pulse = 1 + Math.sin(gem.pulse) * 0.15;
      gem.pulse += 0.08;

      const colors = {
        cyan: "#22d3ee",
        purple: "#a855f7",
        gold: "#fbbf24",
      };
      const color = colors[gem.type];

      // Glow
      ctx.shadowBlur = 12;
      ctx.shadowColor = color;

      // Diamond shape
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(gem.x, gem.y - GEM_SIZE * pulse);
      ctx.lineTo(gem.x + GEM_SIZE * 0.7 * pulse, gem.y);
      ctx.lineTo(gem.x, gem.y + GEM_SIZE * pulse);
      ctx.lineTo(gem.x - GEM_SIZE * 0.7 * pulse, gem.y);
      ctx.closePath();
      ctx.fill();

      ctx.shadowBlur = 0;

      // Inner sparkle
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.beginPath();
      ctx.arc(gem.x, gem.y - GEM_SIZE * 0.3, GEM_SIZE * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Player
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#60a5fa";
    ctx.fillStyle = "#60a5fa";
    ctx.beginPath();
    ctx.arc(s.playerX, s.playerY, PLAYER_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Player inner glow
    ctx.fillStyle = "#dbeafe";
    ctx.beginPath();
    ctx.arc(s.playerX - 2, s.playerY - 2, PLAYER_R * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // HUD - Health bar
    const healthBarW = 100;
    const healthBarH = 12;
    const healthBarX = 10;
    const healthBarY = 10;

    // Health bar background
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(healthBarX - 2, healthBarY - 2, healthBarW + 4, healthBarH + 4);

    // Health bar border
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.strokeRect(healthBarX, healthBarY, healthBarW, healthBarH);

    // Health fill
    const healthPct = s.health / MAX_HEALTH;
    const healthColor = healthPct > 0.5 ? "#22c55e" : healthPct > 0.25 ? "#eab308" : "#ef4444";
    ctx.fillStyle = healthColor;
    ctx.fillRect(healthBarX, healthBarY, healthBarW * healthPct, healthBarH);

    // Health text
    ctx.fillStyle = "#fff";
    ctx.font = "bold 10px Fredoka, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${Math.ceil(s.health)}`, healthBarX + healthBarW / 2, healthBarY + healthBarH - 2);

    // Score
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px Fredoka, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`${s.score}`, W - 10, 20);

    // Zone timer
    const elapsed = Date.now() - s.startTime;
    const timeLeft = Math.max(0, (ZONE_SHRINK_TIME - elapsed) / 1000);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 12px Fredoka, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`Zone: ${Math.floor(timeLeft)}s`, W / 2, 20);

  }, []);

  // Main game loop
  useEffect(() => {
    if (phase !== "play") return;

    resetState();

    const loop = () => {
      const s = stateRef.current;
      const now = Date.now();
      const elapsed = now - s.startTime;

      // Update zone shrinking
      const shrinkProgress = Math.min(1, elapsed / ZONE_SHRINK_TIME);
      s.zoneR = INITIAL_ZONE_R - (INITIAL_ZONE_R - FINAL_ZONE_R) * shrinkProgress;

      // Player movement
      let dx = 0;
      let dy = 0;

      // Keyboard
      if (s.keys.has("ArrowLeft") || s.keys.has("a")) dx -= 1;
      if (s.keys.has("ArrowRight") || s.keys.has("d")) dx += 1;
      if (s.keys.has("ArrowUp") || s.keys.has("w")) dy -= 1;
      if (s.keys.has("ArrowDown") || s.keys.has("s")) dy += 1;

      // Touch
      if (s.touchDir) {
        dx = s.touchDir.x;
        dy = s.touchDir.y;
      }

      // Normalize diagonal movement
      if (dx !== 0 || dy !== 0) {
        const len = Math.sqrt(dx * dx + dy * dy);
        dx = (dx / len) * PLAYER_SPEED;
        dy = (dy / len) * PLAYER_SPEED;
      }

      s.playerX = Math.max(PLAYER_R, Math.min(W - PLAYER_R, s.playerX + dx));
      s.playerY = Math.max(PLAYER_R, Math.min(H - PLAYER_R, s.playerY + dy));

      // Check if outside zone - take damage
      const distFromCenter = Math.hypot(s.playerX - s.zoneCenterX, s.playerY - s.zoneCenterY);
      if (distFromCenter > s.zoneR) {
        const timeSinceLastDamage = now - lastDamageTime.current;
        if (timeSinceLastDamage >= 1000) {
          s.health -= DAMAGE_RATE;
          s.damageFlash = 1;
          lastDamageTime.current = now;
          setHealth(Math.max(0, s.health));

          if (s.health <= 0) {
            endGame(s.score);
            return;
          }
        }
      }

      // Decay damage flash
      if (s.damageFlash > 0) {
        s.damageFlash -= 0.05;
      }

      // Check zone completely gone
      if (s.zoneR < 5) {
        if (distFromCenter > 5) {
          s.health = 0;
          setHealth(0);
          endGame(s.score);
          return;
        }
      }

      // Collect gems
      for (const gem of s.gems) {
        if (gem.collected) continue;
        const dist = Math.hypot(s.playerX - gem.x, s.playerY - gem.y);
        if (dist < PLAYER_R + GEM_SIZE) {
          gem.collected = true;
          const points = gem.type === "gold" ? 3 : gem.type === "purple" ? 2 : 1;
          s.score += points;
          setScore(s.score);
          onScoreChange?.(s.score);

          if (s.score >= MAX_SCORE) {
            endGame(s.score);
            return;
          }
        }
      }

      // Collect health pickups
      for (const hp of s.healthPickups) {
        if (hp.collected) continue;
        const dist = Math.hypot(s.playerX - hp.x, s.playerY - hp.y);
        if (dist < PLAYER_R + HEALTH_PICKUP_SIZE) {
          hp.collected = true;
          s.health = Math.min(MAX_HEALTH, s.health + 25);
          setHealth(s.health);
        }
      }

      // Spawn new gems periodically inside zone
      if (now - lastGemSpawnTime.current > 3000) {
        const activeGems = s.gems.filter(g => !g.collected).length;
        if (activeGems < 6 && s.zoneR > 50) {
          const newGems = generateGems(s.zoneCenterX, s.zoneCenterY, s.zoneR * 0.8, 2);
          s.gems.push(...newGems);
          lastGemSpawnTime.current = now;
        }
      }

      // Spawn health pickups occasionally
      if (now - lastHealthSpawnTime.current > 8000) {
        const activePickups = s.healthPickups.filter(h => !h.collected).length;
        if (activePickups < 2 && s.zoneR > 60 && s.health < MAX_HEALTH * 0.7) {
          const pos = randomInCircle(s.zoneCenterX, s.zoneCenterY, s.zoneR * 0.7);
          s.healthPickups.push({
            x: pos.x,
            y: pos.y,
            collected: false,
            pulse: 0,
          });
          lastHealthSpawnTime.current = now;
        }
      }

      draw();
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animRef.current);
  }, [phase, resetState, draw, endGame, onScoreChange]);

  // Keyboard handlers
  useEffect(() => {
    if (phase !== "play") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "w", "a", "s", "d"].includes(e.key)) {
        e.preventDefault();
        stateRef.current.keys.add(e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      stateRef.current.keys.delete(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [phase]);

  // Touch handlers for drag-to-move
  const getCanvasPos = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (W / rect.width),
      y: (clientY - rect.top) * (H / rect.height),
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (phase !== "play") return;
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (phase !== "play") return;
    e.preventDefault();
    const touch = e.touches[0];
    const pos = getCanvasPos(touch.clientX, touch.clientY);
    const s = stateRef.current;

    const dx = pos.x - s.playerX;
    const dy = pos.y - s.playerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 5) {
      s.touchDir = { x: dx / dist, y: dy / dist };
    } else {
      s.touchDir = null;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (phase !== "play") return;
    e.preventDefault();
    stateRef.current.touchDir = null;
  };

  if (phase === "menu") {
    return (
      <div className="w-full min-h-[400px] rounded-2xl relative max-w-md mx-auto text-center">
        <div className="flex items-center gap-3 mb-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onExit}
            className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </motion.button>
          <h3 className="text-xl font-bold text-foreground">Zone Runner</h3>
        </div>
        <p className="text-muted-foreground mb-2">Stay in the zone, grab gems!</p>
        <p className="text-muted-foreground mb-6 text-sm">
          The safe zone shrinks over 60 seconds. Collect gems for points. Being outside the zone damages you. Get {MAX_SCORE} points to win!
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
        <h3 className="text-xl font-bold text-foreground">Zone Runner</h3>
        <span className="ml-auto text-sm font-bold text-foreground">
          Score: {score}/{MAX_SCORE}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full max-w-[400px] mx-auto rounded-2xl bg-black/50 border-2 border-white/10 touch-none select-none"
        style={{ aspectRatio: `${W}/${H}` }}
      />

      {phase === "dead" && (
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold text-red-400">Game Over!</p>
          <p className="text-muted-foreground">Final Score: {score}/{MAX_SCORE}</p>
        </div>
      )}

      <div className="mt-4 text-center text-sm text-muted-foreground">
        Use arrow keys or touch+drag to move
      </div>
    </div>
  );
}
