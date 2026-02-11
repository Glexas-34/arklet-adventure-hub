import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

type GamePhase = "menu" | "play" | "dead";

interface Mole {
  id: number;
  row: number;
  col: number;
  visible: boolean;
  bonked: boolean;
  appearTime: number;
}

const MAX_SCORE = 30;
const GAME_DURATION = 30000; // 30 seconds
const MOLE_DISPLAY_TIME = 1500; // 1.5 seconds base
const GRID_SIZE = 3;
const HOLE_RADIUS = 25;
const MOLE_RADIUS = 20;

export function WhackAMoleGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION / 1000);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const molesRef = useRef<Mole[]>([]);
  const lastSpawnRef = useRef(0);
  const gameStartTimeRef = useRef(0);

  const getSpawnInterval = useCallback((currentScore: number) => {
    // Start at 1000ms, reduce to 400ms as score increases
    return Math.max(400, 1000 - currentScore * 20);
  }, []);

  const getMoleDisplayTime = useCallback((currentScore: number) => {
    // Start at 1500ms, reduce to 800ms as score increases
    return Math.max(800, MOLE_DISPLAY_TIME - currentScore * 20);
  }, []);

  const getCellPosition = useCallback((row: number, col: number, canvasWidth: number, canvasHeight: number) => {
    const cellWidth = canvasWidth / GRID_SIZE;
    const cellHeight = canvasHeight / GRID_SIZE;
    return {
      x: col * cellWidth + cellWidth / 2,
      y: row * cellHeight + cellHeight / 2,
    };
  }, []);

  const spawnMole = useCallback((now: number, currentScore: number) => {
    const spawnInterval = getSpawnInterval(currentScore);
    if (now - lastSpawnRef.current < spawnInterval) return;

    // Find empty spots
    const occupiedSpots = new Set(
      molesRef.current
        .filter(m => m.visible && !m.bonked)
        .map(m => `${m.row},${m.col}`)
    );

    const emptySpots: { row: number; col: number }[] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!occupiedSpots.has(`${row},${col}`)) {
          emptySpots.push({ row, col });
        }
      }
    }

    if (emptySpots.length > 0) {
      const spot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
      molesRef.current.push({
        id: Date.now() + Math.random(),
        row: spot.row,
        col: spot.col,
        visible: true,
        bonked: false,
        appearTime: now,
      });
      lastSpawnRef.current = now;
    }
  }, [getSpawnInterval]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (phase !== "play") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    // Check if clicked on a visible mole
    for (const mole of molesRef.current) {
      if (!mole.visible || mole.bonked) continue;

      const pos = getCellPosition(mole.row, mole.col, canvas.width, canvas.height);
      const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);

      if (distance <= MOLE_RADIUS) {
        mole.bonked = true;
        const newScore = score + 1;
        setScore(newScore);
        if (onScoreChange) {
          onScoreChange(newScore);
        }
        break;
      }
    }
  }, [phase, score, onScoreChange, getCellPosition]);

  const draw = useCallback((now: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update time
    const elapsed = now - gameStartTimeRef.current;
    const remaining = Math.max(0, GAME_DURATION - elapsed);
    setTimeLeft(Math.ceil(remaining / 1000));

    if (remaining <= 0) {
      setPhase("dead");
      return;
    }

    // Spawn new moles
    spawnMole(now, score);

    // Update and remove expired moles
    const displayTime = getMoleDisplayTime(score);
    molesRef.current = molesRef.current.filter(mole => {
      if (mole.bonked) {
        return now - mole.appearTime < 200; // Keep bonked moles for brief animation
      }
      if (now - mole.appearTime > displayTime) {
        mole.visible = false;
        return false;
      }
      return true;
    });

    // Draw holes with glow
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const pos = getCellPosition(row, col, canvas.width, canvas.height);

        // Glow effect
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, HOLE_RADIUS);
        gradient.addColorStop(0, "rgba(139, 69, 19, 0.3)");
        gradient.addColorStop(0.7, "rgba(101, 67, 33, 0.2)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, HOLE_RADIUS + 5, 0, Math.PI * 2);
        ctx.fill();

        // Hole
        ctx.fillStyle = "#2a2a2a";
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, HOLE_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        // Hole rim
        ctx.strokeStyle = "#654321";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Draw moles
    for (const mole of molesRef.current) {
      if (!mole.visible && !mole.bonked) continue;

      const pos = getCellPosition(mole.row, mole.col, canvas.width, canvas.height);
      const timeSinceAppear = now - mole.appearTime;

      let yOffset = 0;
      if (mole.bonked) {
        // Quick hide animation when bonked
        yOffset = (timeSinceAppear / 200) * MOLE_RADIUS * 2;
      } else if (timeSinceAppear < 200) {
        // Rise animation
        yOffset = -MOLE_RADIUS * 2 * (1 - timeSinceAppear / 200);
      } else if (timeSinceAppear > displayTime - 200) {
        // Hide animation
        const hideProgress = (timeSinceAppear - (displayTime - 200)) / 200;
        yOffset = MOLE_RADIUS * 2 * hideProgress;
      }

      const moleY = pos.y + yOffset;

      // Draw mole body (brown circle)
      ctx.fillStyle = mole.bonked ? "#5a3a1a" : "#8b4513";
      ctx.beginPath();
      ctx.arc(pos.x, moleY, MOLE_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      // Draw mole outline
      ctx.strokeStyle = "#654321";
      ctx.lineWidth = 2;
      ctx.stroke();

      if (!mole.bonked) {
        // Draw eyes (beady)
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(pos.x - 7, moleY - 5, 3, 0, Math.PI * 2);
        ctx.arc(pos.x + 7, moleY - 5, 3, 0, Math.PI * 2);
        ctx.fill();

        // Eye shine
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(pos.x - 6, moleY - 6, 1, 0, Math.PI * 2);
        ctx.arc(pos.x + 8, moleY - 6, 1, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = "#4a2a0a";
        ctx.beginPath();
        ctx.arc(pos.x, moleY + 2, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw score and time
    ctx.font = "bold 20px monospace";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${score}`, 10, 25);

    ctx.textAlign = "right";
    ctx.fillText(`Time: ${timeLeft}s`, canvas.width - 10, 25);

    animationFrameRef.current = requestAnimationFrame(draw);
  }, [score, timeLeft, spawnMole, getMoleDisplayTime, getCellPosition]);

  const startGame = useCallback(() => {
    setPhase("play");
    setScore(0);
    setTimeLeft(GAME_DURATION / 1000);
    molesRef.current = [];
    lastSpawnRef.current = 0;
    gameStartTimeRef.current = performance.now();
    if (onScoreChange) {
      onScoreChange(0);
    }
  }, [onScoreChange]);

  useEffect(() => {
    if (phase === "play") {
      animationFrameRef.current = requestAnimationFrame(draw);
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [phase, draw]);

  useEffect(() => {
    if (phase === "dead") {
      const normalizedScore = Math.min(score / MAX_SCORE, 1);
      onGameEnd({
        score,
        maxScore: MAX_SCORE,
        normalizedScore,
      });
    }
  }, [phase, score, onGameEnd]);

  if (phase === "menu") {
    return (
      <div className="w-full min-h-[400px] bg-black/95 flex items-center justify-center rounded-2xl relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-8 max-w-md w-full mx-4 border-2 border-yellow-600/30 shadow-2xl"
        >
          <div className="flex items-center mb-6">
            <button
              onClick={onExit}
              className="mr-3 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-300" />
            </button>
            <h1 className="text-3xl font-bold text-yellow-500">Bonk Squad</h1>
          </div>

          <p className="text-gray-300 mb-6 leading-relaxed">
            Moles are invading! Tap them quickly to bonk them back into their holes.
            The faster you are, the more moles appear. You have 30 seconds to bonk as many as possible.
          </p>

          <div className="bg-black/30 rounded-lg p-4 mb-6 border border-yellow-600/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Max Score:</span>
              <span className="text-yellow-500 font-bold">{MAX_SCORE}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Duration:</span>
              <span className="text-yellow-500 font-bold">30 seconds</span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Start Game
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[400px] bg-black/95 flex items-center justify-center rounded-2xl p-4 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          onClick={handleCanvasClick}
          onTouchStart={handleCanvasClick}
          className="border-4 border-yellow-600/50 rounded-lg shadow-2xl cursor-pointer touch-none"
          style={{
            maxWidth: "100%",
            height: "auto",
            imageRendering: "crisp-edges"
          }}
        />
      </motion.div>
    </div>
  );
}
