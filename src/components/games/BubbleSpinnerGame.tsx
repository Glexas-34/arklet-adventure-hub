import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

const W = 400;
const H = 500;
const MAX_SCORE = 60;
const BUBBLE_R = 15;
const BUBBLE_D = BUBBLE_R * 2;
const COLS = 10;
const ROWS = 6;
const SHOOT_SPEED = 8;
const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7"];
const COLOR_NAMES = ["red", "blue", "green", "yellow", "purple"];
const LOSE_LINE_Y = H - 80;

interface Bubble {
  x: number;
  y: number;
  color: number; // index into COLORS
  row: number;
  col: number;
  popping?: boolean;
  popFrame?: number;
}

interface ShotBubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: number;
}

function gridToPos(row: number, col: number): { x: number; y: number } {
  const offsetX = row % 2 === 1 ? BUBBLE_R : 0;
  return {
    x: col * BUBBLE_D + BUBBLE_R + offsetX + 10,
    y: row * (BUBBLE_D - 4) + BUBBLE_R + 10,
  };
}

function posToNearestGrid(x: number, y: number): { row: number; col: number } {
  // Find nearest row
  let bestRow = 0;
  let bestDist = Infinity;
  for (let r = 0; r < 20; r++) {
    const gy = r * (BUBBLE_D - 4) + BUBBLE_R + 10;
    const dist = Math.abs(y - gy);
    if (dist < bestDist) {
      bestDist = dist;
      bestRow = r;
    }
  }
  const offsetX = bestRow % 2 === 1 ? BUBBLE_R : 0;
  let bestCol = Math.round((x - BUBBLE_R - offsetX - 10) / BUBBLE_D);
  const maxCols = bestRow % 2 === 1 ? COLS - 1 : COLS;
  bestCol = Math.max(0, Math.min(maxCols - 1, bestCol));
  return { row: bestRow, col: bestCol };
}

export function BubbleSpinnerGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"menu" | "playing" | "done">("menu");
  const [score, setScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);

  const stateRef = useRef({
    grid: [] as Bubble[],
    shot: null as ShotBubble | null,
    currentColor: 0,
    nextColor: 0,
    score: 0,
    popping: [] as { x: number; y: number; color: number; frame: number }[],
    gameOver: false,
    won: false,
    aimX: W / 2,
    aimY: H / 2,
  });
  const animRef = useRef(0);

  const randomColor = () => Math.floor(Math.random() * COLORS.length);

  const initGrid = useCallback(() => {
    const grid: Bubble[] = [];
    for (let row = 0; row < ROWS; row++) {
      const maxCols = row % 2 === 1 ? COLS - 1 : COLS;
      for (let col = 0; col < maxCols; col++) {
        const pos = gridToPos(row, col);
        grid.push({
          x: pos.x,
          y: pos.y,
          color: randomColor(),
          row,
          col,
        });
      }
    }
    return grid;
  }, []);

  const findConnected = useCallback((grid: Bubble[], startBubble: Bubble): Set<number> => {
    const targetColor = startBubble.color;
    const visited = new Set<number>();
    const stack = [grid.indexOf(startBubble)];

    while (stack.length > 0) {
      const idx = stack.pop()!;
      if (visited.has(idx)) continue;
      const b = grid[idx];
      if (!b || b.color !== targetColor) continue;
      visited.add(idx);

      // Find neighbors (hex grid neighbors)
      for (let i = 0; i < grid.length; i++) {
        if (visited.has(i)) continue;
        const other = grid[i];
        const dx = b.x - other.x;
        const dy = b.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < BUBBLE_D + 2) {
          stack.push(i);
        }
      }
    }
    return visited;
  }, []);

  const findFloating = useCallback((grid: Bubble[]): Set<number> => {
    // BFS from top row bubbles - anything not reachable is floating
    const connected = new Set<number>();
    const stack: number[] = [];

    // Start from all top row bubbles
    for (let i = 0; i < grid.length; i++) {
      if (grid[i].row === 0) {
        stack.push(i);
      }
    }

    while (stack.length > 0) {
      const idx = stack.pop()!;
      if (connected.has(idx)) continue;
      connected.add(idx);

      for (let i = 0; i < grid.length; i++) {
        if (connected.has(i)) continue;
        const b = grid[idx];
        const other = grid[i];
        const dx = b.x - other.x;
        const dy = b.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < BUBBLE_D + 2) {
          stack.push(i);
        }
      }
    }

    // Anything not in connected set is floating
    const floating = new Set<number>();
    for (let i = 0; i < grid.length; i++) {
      if (!connected.has(i)) floating.add(i);
    }
    return floating;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    // Dark background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0f172a");
    bg.addColorStop(1, "#1e1b4b");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Subtle grid pattern
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Lose line
    ctx.strokeStyle = "rgba(239,68,68,0.4)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(0, LOSE_LINE_Y);
    ctx.lineTo(W, LOSE_LINE_Y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw grid bubbles
    for (const bubble of s.grid) {
      drawBubble(ctx, bubble.x, bubble.y, bubble.color, BUBBLE_R);
    }

    // Popping animations
    for (const pop of s.popping) {
      const progress = pop.frame / 15;
      const r = BUBBLE_R * (1 + progress * 0.8);
      const alpha = 1 - progress;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = COLORS[pop.color];
      ctx.beginPath();
      ctx.arc(pop.x, pop.y, r, 0, Math.PI * 2);
      ctx.fill();

      // Sparkles
      for (let i = 0; i < 4; i++) {
        const ang = (i / 4) * Math.PI * 2 + progress * 2;
        const dist = r + progress * 15;
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(
          pop.x + Math.cos(ang) * dist,
          pop.y + Math.sin(ang) * dist,
          2, 0, Math.PI * 2
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Shot bubble
    if (s.shot) {
      drawBubble(ctx, s.shot.x, s.shot.y, s.shot.color, BUBBLE_R);
    }

    // Aim line (when not shooting)
    if (!s.shot && !s.gameOver) {
      const shootX = W / 2;
      const shootY = H - 40;
      const dx = s.aimX - shootX;
      const dy = s.aimY - shootY;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len > 0) {
        const nx = dx / len;
        const ny = dy / len;
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(shootX, shootY);
        ctx.lineTo(shootX + nx * 100, shootY + ny * 100);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Shooter position
    if (!s.gameOver) {
      const shootX = W / 2;
      const shootY = H - 40;

      // Current bubble to shoot
      drawBubble(ctx, shootX, shootY, s.currentColor, BUBBLE_R);

      // Shooter base
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.beginPath();
      ctx.moveTo(shootX - 20, H - 15);
      ctx.lineTo(shootX + 20, H - 15);
      ctx.lineTo(shootX + 10, H - 25);
      ctx.lineTo(shootX - 10, H - 25);
      ctx.closePath();
      ctx.fill();

      // Next bubble preview
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.beginPath();
      ctx.roundRect(W - 60, H - 45, 50, 35, 6);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("NEXT", W - 35, H - 33);
      drawBubble(ctx, W - 35, H - 18, s.nextColor, 10);
    }

    // Score HUD
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.beginPath();
    ctx.roundRect(W / 2 - 50, H - 18, 100, 18, 4);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`Score: ${s.score}`, W / 2, H - 5);
  }, []);

  function drawBubble(ctx: CanvasRenderingContext2D, x: number, y: number, colorIdx: number, r: number) {
    const color = COLORS[colorIdx];

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.arc(x + 1, y + 2, r, 0, Math.PI * 2);
    ctx.fill();

    // Main bubble
    const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
    grad.addColorStop(0, lightenColor(color, 40));
    grad.addColorStop(0.7, color);
    grad.addColorStop(1, darkenColor(color, 30));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // Highlight
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Border
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  function lightenColor(hex: string, amount: number): string {
    const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
    const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
    const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
    return `rgb(${r},${g},${b})`;
  }

  function darkenColor(hex: string, amount: number): string {
    const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
    const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
    const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
    return `rgb(${r},${g},${b})`;
  }

  const shoot = useCallback((targetX: number, targetY: number) => {
    const s = stateRef.current;
    if (s.shot || s.gameOver) return;

    const shootX = W / 2;
    const shootY = H - 40;
    const dx = targetX - shootX;
    const dy = targetY - shootY;
    // Only allow upward shots
    if (dy >= -5) return;
    const len = Math.sqrt(dx * dx + dy * dy);
    const vx = (dx / len) * SHOOT_SPEED;
    const vy = (dy / len) * SHOOT_SPEED;

    s.shot = {
      x: shootX,
      y: shootY,
      vx,
      vy,
      color: s.currentColor,
    };
    s.currentColor = s.nextColor;
    s.nextColor = randomColor();
  }, []);

  // Animation loop
  useEffect(() => {
    if (phase !== "playing") return;

    const loop = () => {
      const s = stateRef.current;
      if (s.gameOver) {
        draw();
        return;
      }

      // Move shot bubble
      if (s.shot) {
        s.shot.x += s.shot.vx;
        s.shot.y += s.shot.vy;

        // Wall bounce
        if (s.shot.x <= BUBBLE_R) {
          s.shot.x = BUBBLE_R;
          s.shot.vx = Math.abs(s.shot.vx);
        }
        if (s.shot.x >= W - BUBBLE_R) {
          s.shot.x = W - BUBBLE_R;
          s.shot.vx = -Math.abs(s.shot.vx);
        }

        // Check collision with top wall
        let snapped = false;
        if (s.shot.y <= BUBBLE_R + 10) {
          const gridPos = posToNearestGrid(s.shot.x, s.shot.y);
          const pos = gridToPos(gridPos.row, gridPos.col);
          s.grid.push({
            x: pos.x,
            y: pos.y,
            color: s.shot.color,
            row: gridPos.row,
            col: gridPos.col,
          });
          snapped = true;
        }

        // Check collision with grid bubbles
        if (!snapped) {
          for (const bubble of s.grid) {
            const dx = s.shot.x - bubble.x;
            const dy = s.shot.y - bubble.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < BUBBLE_D - 2) {
              const gridPos = posToNearestGrid(s.shot.x, s.shot.y);
              const pos = gridToPos(gridPos.row, gridPos.col);
              // Make sure we don't overlap
              const overlap = s.grid.some(
                (b) => b.row === gridPos.row && b.col === gridPos.col
              );
              if (!overlap) {
                s.grid.push({
                  x: pos.x,
                  y: pos.y,
                  color: s.shot.color,
                  row: gridPos.row,
                  col: gridPos.col,
                });
              }
              snapped = true;
              break;
            }
          }
        }

        // Off bottom
        if (s.shot.y > H + 20) {
          s.shot = null;
        }

        if (snapped) {
          const newBubble = s.grid[s.grid.length - 1];
          s.shot = null;

          // Find connected same-color bubbles
          const connected = findConnected(s.grid, newBubble);

          if (connected.size >= 3) {
            // Pop them
            const indices = Array.from(connected).sort((a, b) => b - a);
            for (const idx of indices) {
              const b = s.grid[idx];
              s.popping.push({ x: b.x, y: b.y, color: b.color, frame: 0 });
            }
            // Remove from grid
            const toRemove = new Set(indices);
            s.grid = s.grid.filter((_, i) => !toRemove.has(i));

            s.score += connected.size;

            // Find and remove floating bubbles
            const floating = findFloating(s.grid);
            if (floating.size > 0) {
              const floatIndices = Array.from(floating).sort((a, b) => b - a);
              for (const idx of floatIndices) {
                const b = s.grid[idx];
                s.popping.push({ x: b.x, y: b.y, color: b.color, frame: 0 });
              }
              s.score += floating.size;
              s.grid = s.grid.filter((_, i) => !floating.has(i));
            }

            onScoreChange?.(s.score);
            setScore(s.score);
            setDisplayScore(s.score);
          }

          // Check win
          if (s.grid.length === 0) {
            s.gameOver = true;
            s.won = true;
            setPhase("done");
          }

          // Check lose - any bubble past lose line
          if (s.grid.some((b) => b.y + BUBBLE_R >= LOSE_LINE_Y)) {
            s.gameOver = true;
            s.won = false;
            setPhase("done");
          }
        }
      }

      // Update popping animations
      s.popping = s.popping.filter((p) => {
        p.frame++;
        return p.frame < 15;
      });

      draw();
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, draw, findConnected, findFloating, onScoreChange]);

  // Game end
  useEffect(() => {
    if (phase !== "done") return;
    const finalScore = stateRef.current.score;
    const timer = setTimeout(() => {
      onGameEnd({
        score: finalScore,
        maxScore: MAX_SCORE,
        normalizedScore: Math.min(1, finalScore / MAX_SCORE),
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [phase, onGameEnd]);

  // Input handlers
  const getCanvasPos = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const pos = getCanvasPos(e.clientX, e.clientY);
    shoot(pos.x, pos.y);
  }, [getCanvasPos, shoot]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const pos = getCanvasPos(touch.clientX, touch.clientY);
    shoot(pos.x, pos.y);
  }, [getCanvasPos, shoot]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const pos = getCanvasPos(e.clientX, e.clientY);
    stateRef.current.aimX = pos.x;
    stateRef.current.aimY = pos.y;
  }, [getCanvasPos]);

  const startGame = () => {
    const grid = initGrid();
    stateRef.current = {
      grid,
      shot: null,
      currentColor: randomColor(),
      nextColor: randomColor(),
      score: 0,
      popping: [],
      gameOver: false,
      won: false,
      aimX: W / 2,
      aimY: H / 2,
    };
    setScore(0);
    setDisplayScore(0);
    setPhase("playing");
  };

  if (phase === "menu") {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="flex items-center gap-3 mb-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
            className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft size={20} />
          </motion.button>
          <h3 className="text-xl font-bold text-foreground">Bubble Frenzy</h3>
        </div>
        <p className="text-muted-foreground mb-2">Pop all the bubbles!</p>
        <p className="text-muted-foreground mb-6 text-sm">
          Click or tap to shoot bubbles. Match 3+ same-colored bubbles to pop them.
          Clear the board to win! Don&apos;t let bubbles reach the red line!
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
        <h3 className="text-xl font-bold text-foreground">Bubble Frenzy</h3>
        <span className="ml-auto text-lg font-bold text-foreground">{displayScore} pts</span>
      </div>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onMouseMove={handleMouseMove}
        className="w-full max-w-[400px] mx-auto rounded-2xl bg-black/50 border-2 border-white/10 touch-none cursor-crosshair"
        style={{ aspectRatio: `${W}/${H}` }}
      />

      {phase === "done" && (
        <div className="mt-4 text-center">
          <p className={`text-2xl font-bold ${stateRef.current.won ? "text-green-400" : "text-red-400"}`}>
            {stateRef.current.won ? "You cleared the board!" : "Game Over!"}
          </p>
          <p className="text-lg text-muted-foreground mt-1">
            Score: {displayScore}
          </p>
        </div>
      )}
    </div>
  );
}
