import { motion, AnimatePresence } from "framer-motion";
import { BlookItem, rarityColors, rarityGlowColors } from "@/data/gameData";

interface ResultBarProps {
  item: BlookItem | null;
  isVisible: boolean;
  onClose: () => void;
}

export function ResultBar({ item, isVisible, onClose }: ResultBarProps) {
  if (!item) return null;
  
  const colorClass = rarityColors[item.rarity];
  const glowClass = rarityGlowColors[item.rarity];
  const isRare = item.rarity === "Ultra Secret" || item.rarity === "Mystical";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
          }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          onClick={onClose}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 cursor-pointer
                      bg-black/90 backdrop-blur-md rounded-2xl px-8 py-4
                      border-2 ${glowClass} ${isRare ? "animate-jump" : ""}`}
          style={{ 
            borderColor: `var(--rarity-${item.rarity.toLowerCase().replace(" ", "-")})` 
          }}
        >
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">You got</p>
            <h3 className={`text-2xl font-bold ${colorClass}`}>{item.name}</h3>
            <p className={`text-lg font-semibold ${colorClass}`}>{item.rarity}</p>
            <p className="text-xs text-muted-foreground mt-2">Click to dismiss</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
