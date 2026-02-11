import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { MiniGameProps, GameResult } from "./types";

const MAX_SCORE = 100;
const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 500;
const LANE_WIDTH = CANVAS_WIDTH / 3;
const KART_SIZE = 40;
const OBSTACLE_WIDTH = 60;
const OBSTACLE_HEIGHT = 40;
const COIN_SIZE = 20;

type Phase = "menu" | "play" | "dead";
type Lane = 0 | 1 | 2;

interface GameObject {
  lane: Lane;
  y: number;
  type: "obstacle" | "coin" | "boost";
}

export function KartDashGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const [phase, setPhase] = useState<Phase>("menu");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const gameStateRef = useRef({
    lane: 1 as Lane,
    score: 0,
    speed: 3,
    objects: [] as GameObject[],
    spawnTimer: 0,
    boosted: false,
    boostTimer: 0,
  });

  const spawnObject = useCallback(() => {
    const state = gameStateRef.current;
    const lanes: Lane[] = [0, 1, 2];
    const randomLane = lanes[Math.floor(Math.random() * lanes.length)];

    // 60% obstacle, 30% coin, 10% boost
    const rand = Math.random();
    const type = rand < 0.6 ? "obstacle" : rand < 0.9 ? "coin" : "boost";

    state.objects.push({
      lane: randomLane,
      y: -50,
      type,
    });
  }, []);

  const handleLaneChange = useCallback((direction: "left" | "right") => {
    const state = gameStateRef.current;
    if (direction === "left" && state.lane > 0) {
      state.lane = (state.lane - 1) as Lane;
    } else if (direction === "right" && state.lane < 2) {
      state.lane = (state.lane + 1) as Lane;
    }
  }, []);

  const checkCollision = useCallback(() => {
    const state = gameStateRef.current;
    const kartY = CANVAS_HEIGHT - 100;

    for (let i = state.objects.length - 1; i >= 0; i--) {
      const obj = state.objects[i];

      // Check if object is in kart's lane and Y range
      if (obj.lane === state.lane) {
        const objCenterY = obj.y + (obj.type === "coin" ? COIN_SIZE / 2 : OBSTACLE_HEIGHT / 2);

        if (Math.abs(objCenterY - kartY) < 30) {
          if (obj.type === "obstacle") {
            // Game over
            setPhase("dead");
            return true;
          } else if (obj.type === "coin") {
            // Collect coin
            state.score = Math.min(state.score + 1, MAX_SCORE);
            onScoreChange?.(state.score);
            state.objects.splice(i, 1);
          } else if (obj.type === "boost") {
            // Activate boost
            state.boosted = true;
            state.boostTimer = 60; // 1 second at 60fps
            state.objects.splice(i, 1);
          }
        }
      }
    }
    return false;
  }, [onScoreChange]);

  const gameLoop = useCallback(() => {
    const state = gameStateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw road lanes
    ctx.strokeStyle = "#ffffff";
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 2;

    // Left lane line
    ctx.beginPath();
    ctx.moveTo(LANE_WIDTH, 0);
    ctx.lineTo(LANE_WIDTH, CANVAS_HEIGHT);
    ctx.stroke();

    // Right lane line
    ctx.beginPath();
    ctx.moveTo(LANE_WIDTH * 2, 0);
    ctx.lineTo(LANE_WIDTH * 2, CANVAS_HEIGHT);
    ctx.stroke();

    ctx.setLineDash([]);

    // Update boost timer
    if (state.boosted) {
      state.boostTimer--;
      if (state.boostTimer <= 0) {
        state.boosted = false;
      }
    }

    // Spawn objects
    state.spawnTimer++;
    const currentSpeed = state.boosted ? state.speed * 1.5 : state.speed;
    const spawnRate = Math.max(40, 80 - Math.floor(state.score / 5) * 5);

    if (state.spawnTimer > spawnRate) {
      spawnObject();
      state.spawnTimer = 0;
    }

    // Update and draw objects
    for (let i = state.objects.length - 1; i >= 0; i--) {
      const obj = state.objects[i];
      obj.y += currentSpeed;

      // Remove off-screen objects
      if (obj.y > CANVAS_HEIGHT + 50) {
        state.objects.splice(i, 1);
        continue;
      }

      const x = obj.lane * LANE_WIDTH + LANE_WIDTH / 2;

      if (obj.type === "obstacle") {
        // Draw obstacle (barrier)
        ctx.fillStyle = "#e74c3c";
        ctx.fillRect(x - OBSTACLE_WIDTH / 2, obj.y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
        ctx.fillStyle = "#c0392b";
        ctx.fillRect(x - OBSTACLE_WIDTH / 2 + 5, obj.y + 5, OBSTACLE_WIDTH - 10, OBSTACLE_HEIGHT - 10);
      } else if (obj.type === "coin") {
        // Draw coin
        ctx.fillStyle = "#f1c40f";
        ctx.beginPath();
        ctx.arc(x, obj.y + COIN_SIZE / 2, COIN_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#f39c12";
        ctx.beginPath();
        ctx.arc(x, obj.y + COIN_SIZE / 2, COIN_SIZE / 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (obj.type === "boost") {
        // Draw boost (lightning bolt shape)
        ctx.fillStyle = "#3498db";
        ctx.beginPath();
        ctx.moveTo(x, obj.y);
        ctx.lineTo(x - 10, obj.y + 15);
        ctx.lineTo(x - 5, obj.y + 15);
        ctx.lineTo(x - 12, obj.y + 30);
        ctx.lineTo(x + 8, obj.y + 10);
        ctx.lineTo(x + 3, obj.y + 10);
        ctx.lineTo(x + 10, obj.y);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Draw kart
    const kartX = state.lane * LANE_WIDTH + LANE_WIDTH / 2;
    const kartY = CANVAS_HEIGHT - 100;

    // Kart body
    ctx.fillStyle = state.boosted ? "#e67e22" : "#e74c3c";
    ctx.fillRect(kartX - KART_SIZE / 2, kartY - KART_SIZE / 2, KART_SIZE, KART_SIZE);

    // Kart windshield
    ctx.fillStyle = "#3498db";
    ctx.fillRect(kartX - KART_SIZE / 3, kartY - KART_SIZE / 3, KART_SIZE / 1.5, KART_SIZE / 3);

    // Wheels
    ctx.fillStyle = "#2c3e50";
    ctx.beginPath();
    ctx.arc(kartX - KART_SIZE / 3, kartY + KART_SIZE / 2 + 5, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(kartX + KART_SIZE / 3, kartY + KART_SIZE / 2 + 5, 8, 0, Math.PI * 2);
    ctx.fill();

    // Draw boost indicator
    if (state.boosted) {
      ctx.fillStyle = "#3498db";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("BOOST!", CANVAS_WIDTH / 2, 30);
    }

    // Check collisions
    if (checkCollision()) {
      return; // Game over
    }

    // Increase speed over time
    if (state.score % 10 === 0 && state.score > 0) {
      state.speed = Math.min(3 + state.score / 20, 8);
    }

    // Draw score
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${state.score}`, 10, 30);

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [spawnObject, checkCollision, onScoreChange]);

  const startGame = useCallback(() => {
    gameStateRef.current = {
      lane: 1,
      score: 0,
      speed: 3,
      objects: [],
      spawnTimer: 0,
      boosted: false,
      boostTimer: 0,
    };
    setPhase("play");
    onScoreChange?.(0);
  }, [onScoreChange]);

  useEffect(() => {
    if (phase === "play") {
      animationRef.current = requestAnimationFrame(gameLoop);
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [phase, gameLoop]);

  useEffect(() => {
    if (phase === "dead") {
      const state = gameStateRef.current;
      const result: GameResult = {
        score: state.score,
        maxScore: MAX_SCORE,
        normalizedScore: state.score / MAX_SCORE,
      };
      onGameEnd(result);
    }
  }, [phase, onGameEnd]);

  useEffect(() => {
    if (phase !== "play") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handleLaneChange("left");
      } else if (e.key === "ArrowRight") {
        handleLaneChange("right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, handleLaneChange]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (phase !== "play") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (x < CANVAS_WIDTH / 2) {
      handleLaneChange("left");
    } else {
      handleLaneChange("right");
    }
  }, [phase, handleLaneChange]);

  const handleCanvasTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (phase !== "play") return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;

    if (x < CANVAS_WIDTH / 2) {
      handleLaneChange("left");
    } else {
      handleLaneChange("right");
    }
  }, [phase, handleLaneChange]);

  return (
    <div className="w-full min-h-[400px] rounded-2xl relative bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      {phase === "menu" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <button
            onClick={onExit}
            className="absolute top-4 left-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>

          <div className="space-y-2">
            <div className="text-6xl">🏎️</div>
            <h1 className="text-4xl font-bold text-white">Kart Dash</h1>
            <p className="text-gray-300 text-lg">Dodge & collect!</p>
          </div>

          <div className="space-y-2 text-gray-400 text-sm">
            <p>🏁 Switch lanes to dodge obstacles</p>
            <p>💰 Collect coins for points</p>
            <p>⚡ Grab boosts for speed!</p>
            <p className="text-xs mt-4">Use arrow keys or tap left/right</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold text-xl shadow-lg"
          >
            START RACE
          </motion.button>
        </motion.div>
      )}

      {phase === "play" && (
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onClick={handleCanvasClick}
            onTouchStart={handleCanvasTouchStart}
            className="border-4 border-gray-700 rounded-lg cursor-pointer touch-none"
            style={{ touchAction: "none" }}
          />
          <div className="absolute bottom-2 left-0 right-0 text-center text-white/50 text-xs">
            Tap left or right to switch lanes
          </div>
        </div>
      )}

      {phase === "dead" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="text-6xl">💥</div>
          <h2 className="text-3xl font-bold text-white">CRASH!</h2>
          <p className="text-gray-300 text-xl">
            You scored {gameStateRef.current.score} coins!
          </p>
        </motion.div>
      )}
    </div>
  );
}
