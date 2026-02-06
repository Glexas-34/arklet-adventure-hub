import { motion, AnimatePresence } from "framer-motion";
import { BlookItem, rarityColors, rarityGlowColors } from "@/data/gameData";

interface RevealCardProps {
  item: BlookItem | null;
  isRevealing: boolean;
  onClose: () => void;
}

export function RevealCard({ item, isRevealing, onClose }: RevealCardProps) {
  if (!item) return null;

  const colorClass = rarityColors[item.rarity];
  const glowClass = rarityGlowColors[item.rarity];

  return (
    <AnimatePresence>
      {isRevealing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0, rotateY: -180 }}
            transition={{ 
              type: "spring", 
              duration: 0.8,
              bounce: 0.4 
            }}
            className={`gradient-card rounded-3xl p-8 text-center ${glowClass}`}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="mb-4 text-7xl">🎉</div>
              <h2 className={`text-3xl font-bold mb-2 ${colorClass}`}>
                {item.name}
              </h2>
              <p className={`text-xl font-semibold ${colorClass}`}>
                {item.rarity}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="mt-6 gradient-button px-6 py-2 rounded-xl font-bold 
                           text-primary-foreground shadow-lg"
              >
                Awesome!
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
