import { motion, AnimatePresence } from "framer-motion";
import type { ArcadeReward } from "./games/types";
import type { GameResult } from "./games/types";
import { rarityColors, rarityGlowColors } from "@/data/gameData";

interface ArcadeRewardModalProps {
  isOpen: boolean;
  reward: ArcadeReward | null;
  result: GameResult | null;
  onClose: () => void;
}

export function ArcadeRewardModal({ isOpen, reward, result, onClose }: ArcadeRewardModalProps) {
  if (!reward || !result) return null;

  const pct = Math.round(result.normalizedScore * 100);
  const glowClass = rarityGlowColors[reward.rarity] || "";
  const colorClass = rarityColors[reward.rarity] || "";

  const getMessage = () => {
    if (pct >= 90) return "LEGENDARY play! 🔥";
    if (pct >= 70) return "Amazing score! 🌟";
    if (pct >= 50) return "Nice job! 👏";
    if (pct >= 30) return "Good effort! 💪";
    return "Keep practicing! 🎮";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-card rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl border-2 border-white/10 ${glowClass}`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
              className="text-6xl mb-4"
            >
              🎁
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-bold text-foreground mb-2"
            >
              {getMessage()}
            </motion.p>

            <div className="bg-black/30 rounded-2xl p-4 mb-4">
              <p className="text-sm text-muted-foreground mb-1">Score: {result.score}/{result.maxScore} ({pct}%)</p>
              <p className="text-sm text-muted-foreground">From: {reward.packName}</p>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
              className="mb-4"
            >
              <p className={`text-2xl font-bold ${colorClass}`}>{reward.itemName}</p>
              <p className={`text-sm font-semibold ${colorClass} opacity-80`}>{reward.rarity}</p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="gradient-button text-primary-foreground font-bold px-8 py-3 rounded-xl text-lg w-full"
            >
              Awesome!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
