import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { drawRandomItem, rarityInfo, Rarity } from "@/data/gameData";
import { PlatformRunIcon } from "@/components/GameModeIcons";
import { useSound } from "@/hooks/useSound";

const CANVAS_W = 400;
const CANVAS_H = 500;
const GRAVITY = 0.5;
const JUMP_FORCE = -10;
const MOVE_SPEED = 4;
const PLAYER_W = 20;
const PLAYER_H = 28;
const ITEM_SIZE = 10;
const PLATFORM_H = 10;
const GROUND_Y = 440;

interface CollectedItem {
  name: string;
  rarity: Rarity;
}

interface Platform {
  x: number;
  y: number;
  w: number;
}

interface ItemDrop {
  x: number;
  y: number;
  name: string;
  rarity: Rarity;
  color: string;
  collected: boolean;
}

interface PlatformRunViewProps {
  timeRemaining: number | null;
  onItemObtained: (name: string, rarity: Rarity) => void;
  onScoreChange?: (count: number) => void;
}

// Physics: jump height = v²/(2g) = 100px, air time = 40 frames,
// max horizontal = MOVE_SPEED * 40 = 160px.
// We use generous safety margins so every jump is comfortable.
function generatePlatforms(startX: number, count: number, lastY: number): Platform[] {
  const platforms: Platform[] = [];
  let x = startX;
  let prevY = lastY;
  for (let i = 0; i < count; i++) {
    const w = 80 + Math.random() * 60; // 80-140 wide

    // Vertical change: -50 (up) to +80 (down), clamped to playable zone
    const dy = -50 + Math.random() * 130;
    const y = Math.max(200, Math.min(420, prevY + dy));
    const rise = prevY - y; // positive = going UP

    // Scale gap based on rise: if going up, shrink the gap to keep it reachable
    // Max safe gap when flat: ~120px. When rising 50px: ~60px.
    let maxGap: number;
    if (rise > 0) {
      // Going up: reduce gap proportionally (harder jump)
      maxGap = Math.max(40, 120 - rise * 1.2);
    } else {
      // Going down or flat: can afford bigger gap (gravity helps)
      maxGap = 120 + Math.min(-rise * 0.5, 40);
    }
    const minGap = 30;
    const gap = minGap + Math.random() * (maxGap - minGap);

    platforms.push({ x, y: Math.round(y), w: Math.round(w) });
    prevY = y;
    x += w + gap;
  }
  return platforms;
}

function generateItems(platforms: Platform[]): ItemDrop[] {
  const items: ItemDrop[] = [];
  for (const plat of platforms) {
    const count = Math.random() < 0.4 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      const item = drawRandomItem();
      items.push({
        x: plat.x + 15 + Math.random() * Math.max(10, plat.w - 30),
        y: plat.y - 20 - Math.random() * 10,
        name: item.name,
        rarity: item.rarity,
        color: rarityInfo[item.rarity]?.color || "#fff",
        collected: false,
      });
    }
  }
  return items;
}

export function PlatformRunView({ timeRemaining, onItemObtained, onScoreChange }: PlatformRunViewProps) {
  const { playBounce, playCollect, playGameStart, playDeath } = useSound();
  const soundRef = useRef({ playBounce, playCollect, playDeath });
  soundRef.current = { playBounce, playCollect, playDeath };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [collected, setCollected] = useState<CollectedItem[]>([]);
  const [started, setStarted] = useState(false);
  const committedRef = useRef(false);
  const collectedRef = useRef<CollectedItem[]>([]);
  const keysRef = useRef<Set<string>>(new Set());
  const touchRef = useRef<{ left: boolean; right: boolean; jump: boolean }>({ left: false, right: false, jump: false });
  const animRef = useRef<number>(0);
  const timeRemainingRef = useRef(timeRemaining);
  timeRemainingRef.current = timeRemaining;

  const stateRef = useRef({
    playerX: 50,
    playerY: 300,
    velX: 0,
    velY: 0,
    onGround: false,
    cameraX: 0,
    smoothCameraX: 0,
    platforms: [] as Platform[],
    items: [] as ItemDrop[],
    furthestGenerated: 0,
    lastPlatY: 350,
  });

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

  const addCollectedItem = useCallback((item: CollectedItem) => {
    collectedRef.current = [...collectedRef.current, item];
    setCollected([...collectedRef.current]);
  }, []);

  // Main game effect — only runs when `started` changes to true
  useEffect(() => {
    if (!started) return;

    // Generate initial platforms once
    const freshPlats = generatePlatforms(150, 25, 350);
    // Starting ground segment
    freshPlats.unshift({ x: -100, y: GROUND_Y, w: 300 });
    const s = stateRef.current;
    s.playerX = 50;
    s.playerY = GROUND_Y - PLAYER_H - 5;
    s.velX = 0;
    s.velY = 0;
    s.onGround = false;
    s.cameraX = 0;
    s.smoothCameraX = 0;
    s.platforms = freshPlats;
    s.items = generateItems(freshPlats.slice(1)); // Don't put items on ground
    s.furthestGenerated = freshPlats[freshPlats.length - 1].x + freshPlats[freshPlats.length - 1].w;
    s.lastPlatY = freshPlats[freshPlats.length - 1].y;

    const gameLoop = () => {
      // Check timer via ref
      if (timeRemainingRef.current === 0) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const keys = keysRef.current;
      const touch = touchRef.current;

      // Input
      const moveLeft = keys.has("ArrowLeft") || keys.has("KeyA") || touch.left;
      const moveRight = keys.has("ArrowRight") || keys.has("KeyD") || touch.right;
      const jumpPressed = keys.has("ArrowUp") || keys.has("Space") || keys.has("KeyW") || touch.jump;

      // Horizontal movement
      if (moveLeft) s.velX = -MOVE_SPEED;
      else if (moveRight) s.velX = MOVE_SPEED;
      else s.velX *= 0.8;

      // Jump
      if (jumpPressed && s.onGround) {
        s.velY = JUMP_FORCE;
        s.onGround = false;
        soundRef.current.playBounce();
      }

      // Apply gravity
      s.velY += GRAVITY;

      // Move player
      s.playerX += s.velX;
      s.playerY += s.velY;

      // Platform collisions (only when falling)
      s.onGround = false;
      if (s.velY >= 0) {
        for (const plat of s.platforms) {
          if (
            s.playerX + PLAYER_W > plat.x &&
            s.playerX < plat.x + plat.w &&
            s.playerY + PLAYER_H >= plat.y &&
            s.playerY + PLAYER_H <= plat.y + PLATFORM_H + s.velY + 2
          ) {
            s.playerY = plat.y - PLAYER_H;
            s.velY = 0;
            s.onGround = true;
            break;
          }
        }
      }

      // Fell off bottom — play death sound and respawn on nearest platform
      if (s.playerY > CANVAS_H + 100) {
        soundRef.current.playDeath();
        let bestPlat: Platform | null = null;
        let bestDist = Infinity;
        for (const plat of s.platforms) {
          const dist = Math.abs(plat.x + plat.w / 2 - s.playerX);
          if (dist < bestDist) {
            bestDist = dist;
            bestPlat = plat;
          }
        }
        if (bestPlat) {
          s.playerX = bestPlat.x + bestPlat.w / 2;
          s.playerY = bestPlat.y - PLAYER_H - 10;
        } else {
          s.playerX = 50;
          s.playerY = 300;
        }
        s.velY = 0;
        s.velX = 0;
      }

      // Smooth camera follows player (lerp towards target)
      const targetCameraX = s.playerX - CANVAS_W / 3;
      s.smoothCameraX += (targetCameraX - s.smoothCameraX) * 0.08;

      // Generate more platforms as needed
      if (s.playerX + CANVAS_W > s.furthestGenerated - 500) {
        const newPlats = generatePlatforms(s.furthestGenerated + 80, 15, s.lastPlatY);
        const newItems = generateItems(newPlats);
        s.platforms.push(...newPlats);
        s.items.push(...newItems);
        s.furthestGenerated = newPlats[newPlats.length - 1].x + newPlats[newPlats.length - 1].w;
        s.lastPlatY = newPlats[newPlats.length - 1].y;
      }

      // Cleanup old platforms far behind camera (very generous margin)
      while (s.platforms.length > 2 && s.platforms[0].x + s.platforms[0].w < s.smoothCameraX - 400) {
        s.platforms.shift();
      }
      // Cleanup old collected/offscreen items
      s.items = s.items.filter((it) => !it.collected && it.x > s.smoothCameraX - 400);

      // Item collection
      for (const item of s.items) {
        if (item.collected) continue;
        const dx = (s.playerX + PLAYER_W / 2) - item.x;
        const dy = (s.playerY + PLAYER_H / 2) - item.y;
        if (Math.abs(dx) < 18 && Math.abs(dy) < 18) {
          item.collected = true;
          addCollectedItem({ name: item.name, rarity: item.rarity });
          soundRef.current.playCollect();
        }
      }

      // ---- Draw ----
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
      skyGrad.addColorStop(0, "#0f172a");
      skyGrad.addColorStop(1, "#1e293b");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Stars (parallax)
      ctx.fillStyle = "#ffffff30";
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 137 + 50) % 800) - ((s.smoothCameraX * 0.1) % 800);
        const sy = (i * 73 + 20) % 200;
        ctx.fillRect(((sx % 800) + 800) % 800 - 200, sy, 1.5, 1.5);
      }

      const offX = -s.smoothCameraX;

      // Platforms
      for (const plat of s.platforms) {
        const px = plat.x + offX;
        if (px > CANVAS_W + 50 || px + plat.w < -50) continue;
        // Platform body (dirt)
        ctx.fillStyle = "#6b4226";
        ctx.beginPath();
        ctx.roundRect(px, plat.y + 3, plat.w, PLATFORM_H + 4, [0, 0, 4, 4]);
        ctx.fill();
        // Platform surface (grass)
        ctx.fillStyle = "#4ade80";
        ctx.beginPath();
        ctx.roundRect(px, plat.y, plat.w, PLATFORM_H, 4);
        ctx.fill();
        // Grass highlight
        ctx.fillStyle = "#86efac";
        ctx.fillRect(px + 4, plat.y + 1, plat.w - 8, 2);
      }

      // Items (diamonds)
      for (const item of s.items) {
        if (item.collected) continue;
        const ix = item.x + offX;
        if (ix > CANVAS_W + 20 || ix < -20) continue;
        ctx.fillStyle = item.color;
        ctx.beginPath();
        const bob = Math.sin(Date.now() / 300 + item.x) * 3;
        ctx.moveTo(ix, item.y - ITEM_SIZE + bob);
        ctx.lineTo(ix + ITEM_SIZE * 0.6, item.y + bob);
        ctx.lineTo(ix, item.y + ITEM_SIZE + bob);
        ctx.lineTo(ix - ITEM_SIZE * 0.6, item.y + bob);
        ctx.closePath();
        ctx.fill();
        // Glow
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(ix, item.y + bob, ITEM_SIZE + 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Player
      const playerScreenX = s.playerX + offX;
      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.beginPath();
      ctx.ellipse(playerScreenX + PLAYER_W / 2, s.playerY + PLAYER_H + 2, PLAYER_W / 2, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      // Body
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.roundRect(playerScreenX, s.playerY, PLAYER_W, PLAYER_H, 4);
      ctx.fill();
      // Darker bottom
      ctx.fillStyle = "#2563eb";
      ctx.fillRect(playerScreenX + 2, s.playerY + PLAYER_H - 8, PLAYER_W - 4, 6);
      // Eyes
      ctx.fillStyle = "#fff";
      const eyeDir = s.velX >= 0 ? 1 : -1;
      ctx.beginPath();
      ctx.arc(playerScreenX + PLAYER_W / 2 + eyeDir * 3, s.playerY + 8, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(playerScreenX + PLAYER_W / 2 + eyeDir * 4, s.playerY + 8, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // HUD
      ctx.fillStyle = "#ffffff80";
      ctx.font = "14px Fredoka";
      ctx.textAlign = "right";
      ctx.fillText(`Collected: ${collectedRef.current.length}`, CANVAS_W - 8, CANVAS_H - 4);
      ctx.textAlign = "left";
      ctx.fillStyle = "#ffffff40";
      ctx.font = "12px Fredoka";
      ctx.fillText(`${Math.floor(s.playerX / 10)}m`, 8, CANVAS_H - 4);

      animRef.current = requestAnimationFrame(gameLoop);
    };

    animRef.current = requestAnimationFrame(gameLoop);

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
      if (e.code === "Space" || e.code === "ArrowUp") e.preventDefault();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
    };

    const canvas = canvasRef.current;
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.touches.length; i++) {
        const t = e.touches[i];
        const rect = canvas!.getBoundingClientRect();
        const tx = t.clientX - rect.left;
        const ty = t.clientY - rect.top;
        if (ty < rect.height * 0.4) touchRef.current.jump = true;
        if (tx < rect.width / 2) touchRef.current.left = true;
        else touchRef.current.right = true;
      }
    };
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      touchRef.current = { left: false, right: false, jump: false };
      for (let i = 0; i < e.touches.length; i++) {
        const t = e.touches[i];
        const rect = canvas!.getBoundingClientRect();
        const tx = t.clientX - rect.left;
        const ty = t.clientY - rect.top;
        if (ty < rect.height * 0.4) touchRef.current.jump = true;
        if (tx < rect.width / 2) touchRef.current.left = true;
        else touchRef.current.right = true;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas?.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas?.addEventListener("touchend", handleTouchEnd, { passive: false });
    canvas?.addEventListener("touchcancel", handleTouchEnd, { passive: false });

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas?.removeEventListener("touchstart", handleTouchStart);
      canvas?.removeEventListener("touchend", handleTouchEnd);
      canvas?.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [started]); // Only depends on `started`

  if (!started) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 gap-4">
        <div className="flex items-center gap-2">
          <PlatformRunIcon size={36} />
          <h2 className="text-2xl font-bold">Platform Run</h2>
        </div>
        <p className="text-muted-foreground text-sm text-center max-w-xs">
          Run and jump between platforms to collect items! Arrow keys / WASD to move, Space to jump. On mobile: tap left/right halves to move, upper area to jump.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { playGameStart(); setStarted(true); }}
          className="gradient-button text-primary-foreground font-bold px-8 py-4 rounded-xl text-xl"
        >
          Start!
        </motion.button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 gap-4">
      <h2 className="text-xl font-bold">🏃 Platform Run</h2>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="w-full max-w-[400px] mx-auto rounded-2xl bg-black/50 border-2 border-white/10 touch-none"
        style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}` }}
      />
      <div className="w-full max-w-md">
        <h3 className="text-sm font-bold text-muted-foreground mb-1">
          Items Collected: {collected.length}
        </h3>
        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
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
          <p className="text-muted-foreground">You collected {collected.length} items!</p>
        </motion.div>
      )}
    </div>
  );
}
