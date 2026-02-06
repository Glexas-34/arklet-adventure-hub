import { motion } from "framer-motion";
import { InventoryItem as InventoryItemType, rarityColors, rarityGlowColors } from "@/data/gameData";

interface InventoryItemProps {
  item: InventoryItemType;
  index: number;
}

export function InventoryItemCard({ item, index }: InventoryItemProps) {
  const colorClass = rarityColors[item.rarity];
  const glowClass = rarityGlowColors[item.rarity];
  const borderClass = `border-rarity-${item.rarity.toLowerCase().replace(" ", "-")}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.02 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`gradient-card rounded-2xl p-4 border-4 ${glowClass}`}
      style={{
        borderColor: `hsl(var(--rarity-${item.rarity.toLowerCase().replace(" ", "-")}))`
      }}
    >
      <div className="text-center">
        <h3 className={`text-lg font-bold ${colorClass}`}>{item.name}</h3>
        <p className={`text-sm ${colorClass} opacity-80 mb-2`}>{item.rarity}</p>
        <div className="bg-black/40 rounded-full px-4 py-1 inline-block">
          <span className="font-bold text-foreground">×{item.count}</span>
        </div>
      </div>
    </motion.div>
  );
}
