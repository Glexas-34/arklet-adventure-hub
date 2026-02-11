import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps, GameResult } from "./types";

const W = 300;
const H = 500;
const INITIAL_BLOCK_WIDTH = 60;
const INITIAL_BLOCK_HEIGHT = 20;
const INITIAL_SPEED = 2;
const SPEED_INCREMENT = 0.15;
const MAX_SCORE = 40;
const TOLERANCE = 2; // pixels of tolerance for "perfect" alignment

interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  hue: number;
}

export function TowerStackGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"menu" | "play" | "dead">("menu");
  const stateRef = useRef({
    blocks: [] as Block[],
    currentBlock: null as Block | null,
    direction: 1,
    speed: INITIAL_SPEED,
    score: 0,
    gameOver: false,
  });
  const animRef = useRef(0);
  const scoreRef = useRef(0);

  const getHueForHeight = (height: number): number => {
    // Rainbow gradient: 0 (red) -> 60 (yellow) -> 120 (green) -> 180 (cyan) -> 240 (blue) -> 300 (magenta)
    return (height * 9) % 360;
  };

  const resetState = useCallback(() => {
    const firstBlock: Block = {
      x: W / 2 - INITIAL_BLOCK_WIDTH / 2,
      y: H - INITIAL_BLOCK_HEIGHT,
      width: INITIAL_BLOCK_WIDTH,
      height: INITIAL_BLOCK_HEIGHT,
      hue: getHueForHeight(0),
    };

    stateRef.current = {
      blocks: [firstBlock],
      currentBlock: {
        x: 0,
        y: H - INITIAL_BLOCK_HEIGHT * 2,
        width: INITIAL_BLOCK_WIDTH,
        height: INITIAL_BLOCK_HEIGHT,
        hue: getHueForHeight(1),
      },
      direction: 1,
      speed: INITIAL_SPEED,
      score: 0,
      gameOver: false,
    };
    scoreRef.current = 0;
  }, []);

  const dropBlock = useCallback(() => {
    const s = stateRef.current;
    if (!s.currentBlock || s.gameOver) return;

    const lastBlock = s.blocks[s.blocks.length - 1];
    const currentBlock = s.currentBlock;

    // Calculate overlap
    const leftEdge = Math.max(currentBlock.x, lastBlock.x);
    const rightEdge = Math.min(
      currentBlock.x + currentBlock.width,
      lastBlock.x + lastBlock.width
    );
    const overlap = rightEdge - leftEdge;

    if (overlap <= 0) {
      // Missed completely - game over
      s.gameOver = true;
      setPhase("dead");
      onGameEnd({
        score: s.score,
        maxScore: MAX_SCORE,
        normalizedScore: Math.min(1, s.score / MAX_SCORE),
      });
      return;
    }

    // Check if perfect alignment
    const isPerfect = Math.abs(currentBlock.x - lastBlock.x) <= TOLERANCE;
    let newWidth = isPerfect ? lastBlock.width : overlap;
    let newX = isPerfect ? lastBlock.x : leftEdge;

    // Add the new block
    const newBlock: Block = {
      x: newX,
      y: currentBlock.y,
      width: newWidth,
      height: INITIAL_BLOCK_HEIGHT,
      hue: currentBlock.hue,
    };
    s.blocks.push(newBlock);

    // Update score
    s.score++;
    scoreRef.current = s.score;
    onScoreChange?.(s.score);

    // Check if reached max score
    if (s.score >= MAX_SCORE) {
      s.gameOver = true;
      setPhase("dead");
      onGameEnd({
        score: s.score,
        maxScore: MAX_SCORE,
        normalizedScore: 1,
      });
      return;
    }

    // Increase speed
    s.speed += SPEED_INCREMENT;

    // Create next block
    const nextY = newBlock.y - INITIAL_BLOCK_HEIGHT;
    s.currentBlock = {
      x: s.direction > 0 ? 0 : W - newWidth,
      y: nextY,
      width: newWidth,
      height: INITIAL_BLOCK_HEIGHT,
      hue: getHueForHeight(s.blocks.length),
    };

    // Check if block is too small to continue
    if (newWidth < 10) {
      s.gameOver = true;
      setPhase("dead");
      onGameEnd({
        score: s.score,
        maxScore: MAX_SCORE,
        normalizedScore: Math.min(1, s.score / MAX_SCORE),
      });
    }
  }, [onGameEnd, onScoreChange]);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    if (s.gameOver || !s.currentBlock) {
      return;
    }

    // Move current block
    s.currentBlock.x += s.direction * s.speed;

    // Bounce off walls
    if (s.currentBlock.x <= 0) {
      s.currentBlock.x = 0;
      s.direction = 1;
    } else if (s.currentBlock.x + s.currentBlock.width >= W) {
      s.currentBlock.x = W - s.currentBlock.width;
      s.direction = -1;
    }

    // --- Draw ---
    ctx.clearRect(0, 0, W, H);

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0a0a1a");
    bg.addColorStop(1, "#1a1a2e");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Stars
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    for (let i = 0; i < 40; i++) {
      const sx = (i * 67) % W;
      const sy = (i * 113) % H;
      ctx.beginPath();
      ctx.arc(sx, sy, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Calculate camera offset to keep tower centered
    let cameraY = 0;
    if (s.blocks.length > 15) {
      const topBlockY = s.blocks[s.blocks.length - 1].y;
      if (topBlockY < H / 2) {
        cameraY = H / 2 - topBlockY;
      }
    }

    // Draw all stacked blocks
    for (const block of s.blocks) {
      const drawY = block.y + cameraY;

      // Skip if off-screen
      if (drawY > H || drawY + block.height < 0) continue;

      const gradient = ctx.createLinearGradient(
        block.x,
        drawY,
        block.x + block.width,
        drawY + block.height
      );
      gradient.addColorStop(0, `hsl(${block.hue}, 85%, 55%)`);
      gradient.addColorStop(1, `hsl(${block.hue}, 75%, 45%)`);
      ctx.fillStyle = gradient;
      ctx.shadowColor = `hsl(${block.hue}, 100%, 60%)`;
      ctx.shadowBlur = 8;
      ctx.fillRect(block.x, drawY, block.width, block.height);

      // Edge highlight
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `hsl(${block.hue}, 100%, 70%)`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(block.x, drawY, block.width, block.height);
    }

    // Draw current moving block
    if (s.currentBlock) {
      const drawY = s.currentBlock.y + cameraY;
      const gradient = ctx.createLinearGradient(
        s.currentBlock.x,
        drawY,
        s.currentBlock.x + s.currentBlock.width,
        drawY + s.currentBlock.height
      );
      gradient.addColorStop(0, `hsl(${s.currentBlock.hue}, 90%, 60%)`);
      gradient.addColorStop(1, `hsl(${s.currentBlock.hue}, 80%, 50%)`);
      ctx.fillStyle = gradient;
      ctx.shadowColor = `hsl(${s.currentBlock.hue}, 100%, 70%)`;
      ctx.shadowBlur = 12;
      ctx.fillRect(
        s.currentBlock.x,
        drawY,
        s.currentBlock.width,
        s.currentBlock.height
      );

      // Edge highlight
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `hsl(${s.currentBlock.hue}, 100%, 80%)`;
      ctx.lineWidth = 2;
      ctx.strokeRect(
        s.currentBlock.x,
        drawY,
        s.currentBlock.width,
        s.currentBlock.height
      );
    }

    ctx.shadowBlur = 0;

    // HUD
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Fredoka, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`${s.score}`, 12, 30);

    ctx.fillStyle = "#ffffff60";
    ctx.font = "12px Fredoka, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`Goal: ${MAX_SCORE}`, W - 12, 24);

    // Tap indicator
    ctx.fillStyle = "#ffffff40";
    ctx.font = "14px Fredoka, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("TAP TO DROP", W / 2, H - 20);

    animRef.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    if (phase !== "play") return;

    resetState();
    animRef.current = requestAnimationFrame(gameLoop);

    const handleTap = () => {
      dropBlock();
    };

    const canvas = canvasRef.current;
    canvas?.addEventListener("click", handleTap);

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.code === "Enter") handleTap();
    });

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas?.removeEventListener("click", handleTap);
    };
  }, [phase, resetState, gameLoop, dropBlock]);

  if (phase === "menu") {
    return (
      <div className="w-full min-h-[400px] rounded-2xl relative bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6">
        <div className="max-w-md mx-auto text-center">
          <div className="flex items-center gap-3 mb-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onExit}
              className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ArrowLeft size={20} />
            </motion.button>
            <h3 className="text-2xl font-bold text-foreground">Tower Stack</h3>
          </div>
          <div className="mb-6">
            <div className="text-6xl mb-4">🏗️</div>
            <p className="text-muted-foreground mb-3">
              Stack blocks as high as you can! Tap to drop each block.
            </p>
            <p className="text-muted-foreground text-sm mb-2">
              Perfect alignment = no shrink!
            </p>
            <p className="text-muted-foreground text-sm">
              Miss the stack = game over!
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPhase("play")}
            className="gradient-button text-primary-foreground font-bold px-8 py-4 rounded-xl text-xl"
          >
            Start Building!
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[400px] rounded-2xl relative">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onExit}
            className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </motion.button>
          <h3 className="text-xl font-bold text-foreground">Tower Stack</h3>
          <span className="ml-auto text-lg font-bold text-foreground">
            {scoreRef.current} / {MAX_SCORE}
          </span>
        </div>

        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-full max-w-[300px] mx-auto rounded-2xl bg-black/50 border-2 border-white/10 cursor-pointer"
          style={{ aspectRatio: `${W}/${H}` }}
        />

        {phase === "dead" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            {scoreRef.current >= MAX_SCORE ? (
              <>
                <p className="text-2xl font-bold text-green-400">Perfect Tower!</p>
                <p className="text-muted-foreground">You reached the top!</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-orange-400">Tower Fell!</p>
                <p className="text-muted-foreground">Height: {scoreRef.current} blocks</p>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
