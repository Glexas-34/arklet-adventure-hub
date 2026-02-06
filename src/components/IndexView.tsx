import { motion } from "framer-motion";
import { packs, rarityInfo, rarityColors, packEmojis, InventoryItem } from "@/data/gameData";

interface IndexViewProps {
  inventory: Record<string, InventoryItem>;
}

export function IndexView({ inventory }: IndexViewProps) {
  return (
    <div className="h-full overflow-y-auto p-4">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 text-foreground"
      >
        📖 All Blooks Index
      </motion.h2>

      <div className="space-y-6">
        {Object.entries(packs).map(([packName, items], packIndex) => {
          const emoji = packEmojis[packName] || "📦";
          const visibleItems = items.filter(([_, rarity]) => rarityInfo[rarity].show);
          const hiddenCount = items.length - visibleItems.length;
          
          return (
            <motion.div
              key={packName}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: packIndex * 0.05 }}
              className="gradient-card rounded-2xl p-4"
            >
              <h3 className="text-lg font-bold mb-3 text-foreground flex items-center gap-2">
                <span>{emoji}</span>
                {packName}
                {hiddenCount > 0 && (
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    +{hiddenCount} hidden
                  </span>
                )}
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {visibleItems.map(([name, rarity, chance]) => {
                  const colorClass = rarityColors[rarity];
                  const owned = inventory[name]?.count || 0;
                  
                  return (
                    <div
                      key={`${packName}-${name}`}
                      className={`rounded-lg px-3 py-2 bg-black/30 transition-opacity
                                  ${owned > 0 ? "" : "opacity-50"}`}
                    >
                      <div className={`font-semibold ${colorClass}`}>
                        {name}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={`${colorClass} opacity-80`}>
                          {rarity}
                        </span>
                        <span className="text-muted-foreground">
                          {chance}%
                        </span>
                      </div>
                      {owned > 0 && (
                        <div className="text-xs text-accent mt-1 font-semibold">
                          Owned: {owned}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
