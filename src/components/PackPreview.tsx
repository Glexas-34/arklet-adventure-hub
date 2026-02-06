import { motion } from "framer-motion";
import { packs, rarityInfo, rarityColors, packEmojis } from "@/data/gameData";

interface PackPreviewProps {
  packName: string | null;
  isVisible: boolean;
}

export function PackPreview({ packName, isVisible }: PackPreviewProps) {
  const items = packName ? packs[packName] : null;
  const emoji = packName ? (packEmojis[packName] || "📦") : "📦";

  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-4 mb-4 h-[180px] overflow-y-auto">
      {!isVisible || !packName || !items ? (
        <div className="flex flex-col items-center justify-center h-[140px] text-muted-foreground">
          <span className="text-3xl mb-2">📦</span>
          <p className="text-sm">Hover over a pack to see its contents</p>
          <p className="text-xs mt-1 opacity-70">Press Enter to toggle preview</p>
        </div>
      ) : (
        <motion.div
          key={packName}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-foreground">
            <span>{emoji}</span>
            {packName} Contents
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {items.map(([name, rarity, chance]) => {
              const info = rarityInfo[rarity];
              if (!info.show) return null;
              
              const colorClass = rarityColors[rarity];
              
              return (
                <div
                  key={name}
                  className="bg-black/30 rounded-lg px-3 py-2"
                >
                  <div className={`font-semibold ${colorClass}`}>{name}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`${colorClass} opacity-80`}>{rarity}</span>
                    <span className="text-muted-foreground">{chance}%</span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Press Enter to toggle preview • Hidden rarities exist...
          </p>
        </motion.div>
      )}
    </div>
  );
}
