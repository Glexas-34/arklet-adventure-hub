import { motion } from "framer-motion";
import { InventoryItemCard } from "./InventoryItem";
import { InventoryItem, packs, packEmojis, rarityOrder } from "@/data/gameData";

interface InventoryViewProps {
  inventory: Record<string, InventoryItem>;
  adminItems?: InventoryItem[];
}

export function InventoryView({ inventory, adminItems }: InventoryViewProps) {
  // Group inventory items by pack
  const groupedByPack: Record<string, InventoryItem[]> = {};
  
  Object.entries(packs).forEach(([packName, packItems]) => {
    const ownedFromPack = packItems
      .map(([name]) => inventory[name])
      .filter((item): item is InventoryItem => !!item)
      .sort((a, b) => {
        const aIndex = rarityOrder.indexOf(a.rarity);
        const bIndex = rarityOrder.indexOf(b.rarity);
        return bIndex - aIndex;
      });
    
    if (ownedFromPack.length > 0) {
      groupedByPack[packName] = ownedFromPack;
    }
  });

  const hasAdminItems = adminItems && adminItems.length > 0;
  const hasItems = Object.keys(groupedByPack).length > 0 || hasAdminItems;

  return (
    <div className="h-full overflow-y-auto p-4">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 text-foreground"
      >
        🎒 Your Collection
      </motion.h2>

      {!hasItems ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-muted-foreground"
        >
          <p className="text-lg">No items yet!</p>
          <p className="text-sm mt-2">Open some packs to start collecting.</p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {hasAdminItems && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <span>🛡️</span>
                Admin Pack
                <span className="text-sm font-normal text-muted-foreground">
                  ({adminItems!.length} unique)
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {adminItems!.map((item, index) => (
                  <InventoryItemCard
                    key={`admin-${item.name}-${item.rarity}`}
                    item={item}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          )}
          {Object.entries(groupedByPack).map(([packName, items], packIndex) => {
            const emoji = packEmojis[packName] || "📦";
            
            return (
              <motion.div
                key={packName}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: packIndex * 0.05 }}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                  <span>{emoji}</span>
                  {packName}
                  <span className="text-sm font-normal text-muted-foreground">
                    ({items.length} unique)
                  </span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((item, index) => (
                    <InventoryItemCard 
                      key={item.name} 
                      item={item} 
                      index={index} 
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
