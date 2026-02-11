import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

type GamePhase = "menu" | "play" | "dead";
type RoundState = "waiting" | "ready" | "tapped" | "false-start";

const TOTAL_ROUNDS = 5;
const MIN_WAIT_MS = 1000;
const MAX_WAIT_MS = 4000;
const MAX_SCORE = 500;

export function ReactionGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [roundState, setRoundState] = useState<RoundState>("waiting");
  const [currentRound, setCurrentRound] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [lastReactionTime, setLastReactionTime] = useState<number | null>(null);
  const [isFalseStart, setIsFalseStart] = useState(false);

  const waitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const readyTimeRef = useRef<number>(0);

  const startGame = () => {
    setPhase("play");
    setCurrentRound(0);
    setReactionTimes([]);
    setLastReactionTime(null);
    startRound();
  };

  const startRound = useCallback(() => {
    setRoundState("waiting");
    setLastReactionTime(null);
    setIsFalseStart(false);

    // Random delay before turning green
    const waitTime = MIN_WAIT_MS + Math.random() * (MAX_WAIT_MS - MIN_WAIT_MS);

    waitTimeoutRef.current = setTimeout(() => {
      setRoundState("ready");
      readyTimeRef.current = Date.now();
    }, waitTime);
  }, []);

  const handleTap = useCallback(() => {
    if (roundState === "waiting") {
      // False start!
      setIsFalseStart(true);
      setRoundState("false-start");
      if (waitTimeoutRef.current) {
        clearTimeout(waitTimeoutRef.current);
      }

      // Move to next round after showing false start message
      setTimeout(() => {
        if (currentRound < TOTAL_ROUNDS - 1) {
          setCurrentRound(prev => prev + 1);
          startRound();
        } else {
          endGame();
        }
      }, 1500);
    } else if (roundState === "ready") {
      // Valid tap!
      const reactionTime = Date.now() - readyTimeRef.current;
      setLastReactionTime(reactionTime);
      setRoundState("tapped");

      const newReactionTimes = [...reactionTimes, reactionTime];
      setReactionTimes(newReactionTimes);

      // Update score with rounds completed
      if (onScoreChange) {
        onScoreChange(newReactionTimes.length);
      }

      // Move to next round or end game
      setTimeout(() => {
        if (currentRound < TOTAL_ROUNDS - 1) {
          setCurrentRound(prev => prev + 1);
          startRound();
        } else {
          endGame();
        }
      }, 1500);
    }
  }, [roundState, currentRound, reactionTimes, onScoreChange]);

  const endGame = useCallback(() => {
    setPhase("dead");

    // Calculate average reaction time
    const validTimes = reactionTimes.filter(t => t > 0);
    const averageMs = validTimes.length > 0
      ? validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length
      : 0;

    // Score: faster = higher, max 500
    const score = Math.max(0, Math.round(MAX_SCORE - averageMs));

    onGameEnd({
      score,
      maxScore: MAX_SCORE,
      normalizedScore: score / MAX_SCORE,
    });
  }, [reactionTimes, onGameEnd]);

  useEffect(() => {
    return () => {
      if (waitTimeoutRef.current) {
        clearTimeout(waitTimeoutRef.current);
      }
    };
  }, []);

  // Menu Phase
  if (phase === "menu") {
    return (
      <div className="w-full min-h-[400px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col rounded-2xl relative">
        <button
          onClick={onExit}
          className="absolute top-4 left-4 z-10 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Finger Zapper
            </h1>
            <div className="inline-block px-4 py-2 mb-8 bg-yellow-400/20 rounded-lg border-2 border-yellow-400">
              <p className="text-xl text-yellow-300 font-semibold">
                Test your lightning reflexes!
              </p>
            </div>

            <div className="max-w-md mx-auto mb-8 space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                <p className="text-lg leading-relaxed">
                  Wait for the screen to turn <span className="text-green-400 font-bold">GREEN</span>,
                  then tap as fast as you can!
                </p>
              </div>
              <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-4 text-white">
                <p className="text-lg leading-relaxed">
                  Don't tap on <span className="text-red-400 font-bold">RED</span> or you'll false start!
                </p>
              </div>
            </div>

            <motion.button
              onClick={startGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl font-bold rounded-xl shadow-lg hover:shadow-green-500/50 transition-all"
            >
              Start Game
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Results Phase
  if (phase === "dead") {
    const validTimes = reactionTimes.filter(t => t > 0);
    const averageMs = validTimes.length > 0
      ? validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length
      : 0;
    const score = Math.max(0, Math.round(MAX_SCORE - averageMs));

    return (
      <div className="w-full min-h-[400px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col rounded-2xl relative">
        <button
          onClick={onExit}
          className="absolute top-4 left-4 z-10 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg w-full"
          >
            <h1 className="text-5xl font-bold text-white mb-8">Results</h1>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
              <div className="text-6xl font-bold text-green-400 mb-2">
                {averageMs.toFixed(0)}ms
              </div>
              <div className="text-xl text-white/80">Average Reaction Time</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {score} / {MAX_SCORE}
              </div>
              <div className="text-lg text-white/80">Final Score</div>
            </div>

            <div className="space-y-2 mb-8">
              {reactionTimes.map((time, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-white/5 rounded-lg px-4 py-2"
                >
                  <span className="text-white/60">Round {idx + 1}</span>
                  <span className="text-white font-semibold">{time}ms</span>
                </div>
              ))}
              {reactionTimes.length < TOTAL_ROUNDS && (
                <div className="text-red-400 text-sm">
                  {TOTAL_ROUNDS - reactionTimes.length} false start(s)
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <motion.button
                onClick={startGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-green-500/50 transition-all"
              >
                Play Again
              </motion.button>
              <motion.button
                onClick={onExit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-8 py-3 bg-white/10 text-white text-xl font-bold rounded-xl hover:bg-white/20 transition-all"
              >
                Exit
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Play Phase
  const getRoundDisplay = () => {
    if (roundState === "false-start") {
      return {
        bg: "bg-orange-500",
        text: "FALSE START!",
        glow: "shadow-[0_0_100px_rgba(251,146,60,0.8)]",
        textColor: "text-white",
      };
    } else if (roundState === "tapped" && lastReactionTime !== null) {
      return {
        bg: "bg-blue-500",
        text: `${lastReactionTime}ms`,
        glow: "shadow-[0_0_100px_rgba(59,130,246,0.8)]",
        textColor: "text-white",
      };
    } else if (roundState === "ready") {
      return {
        bg: "bg-green-500",
        text: "TAP NOW!",
        glow: "shadow-[0_0_150px_rgba(34,197,94,0.9)]",
        textColor: "text-white",
      };
    } else {
      return {
        bg: "bg-red-600",
        text: "Wait...",
        glow: "shadow-[0_0_100px_rgba(220,38,38,0.8)]",
        textColor: "text-white/80",
      };
    }
  };

  const display = getRoundDisplay();

  return (
    <div className="w-full min-h-[400px] overflow-hidden rounded-2xl relative">
      <motion.div
        className={`w-full h-full flex flex-col items-center justify-center cursor-pointer select-none ${display.bg} ${display.glow} transition-all duration-200`}
        onClick={handleTap}
        animate={{
          scale: roundState === "ready" ? [1, 1.02, 1] : 1,
        }}
        transition={{
          scale: {
            duration: 0.5,
            repeat: roundState === "ready" ? Infinity : 0,
          },
        }}
      >
        <div className="absolute top-8 left-0 right-0 flex justify-center">
          <div className="bg-black/30 backdrop-blur-sm rounded-full px-6 py-2">
            <span className="text-white text-xl font-bold">
              Round {currentRound + 1} / {TOTAL_ROUNDS}
            </span>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          key={`${currentRound}-${roundState}`}
          className="text-center"
        >
          <h1 className={`text-8xl md:text-9xl font-black ${display.textColor} drop-shadow-2xl`}>
            {display.text}
          </h1>

          {roundState === "tapped" && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl text-white/80 mt-4"
            >
              {reactionTimes.length} / {TOTAL_ROUNDS} complete
            </motion.p>
          )}

          {roundState === "false-start" && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl text-white/80 mt-4"
            >
              Too early! Wait for green!
            </motion.p>
          )}
        </motion.div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onExit();
          }}
          className="absolute top-4 left-4 z-10 p-2 rounded-lg bg-black/30 hover:bg-black/50 transition-colors backdrop-blur-sm"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </motion.div>
    </div>
  );
}