import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, RotateCcw } from "lucide-react";
import { InventoryItem, rarityColors, rarityGlowColors, rarityInfo } from "@/data/gameData";
import { ShopListing } from "@/hooks/useShop";

interface ShopViewProps {
  inventory: Record<string, InventoryItem>;
  listings: ShopListing[];
  nickname: string | null;
  isLoading: boolean;
  onSell: (itemName: string, itemRarity: string) => void;
  onBuy: (listingId: string) => void;
  onReturn: (listingId: string) => void;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ShopView({ inventory, listings, nickname, isLoading, onSell, onBuy, onReturn }: ShopViewProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const inventoryItems = Object.values(inventory).filter((item) => item.count > 0);

  const handleSell = () => {
    if (!selectedItem) return;
    const item = inventory[selectedItem];
    if (!item) return;
    onSell(item.name, item.rarity);
    setSelectedItem(null);
  };

  return (
    <div className="h-full overflow-y-auto p-4 pb-24">
      {/* Your Stuff Section */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-4 text-foreground"
      >
        Your Stuff
      </motion.h2>

      {inventoryItems.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted-foreground mb-8"
        >
          No items in your inventory. Open some packs first!
        </motion.p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-8">
          {inventoryItems.map((item, index) => {
            const isSelected = selectedItem === item.name;
            const colorClass = rarityColors[item.rarity];
            const glowClass = rarityGlowColors[item.rarity];
            return (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedItem(isSelected ? null : item.name)}
                className={`gradient-card rounded-2xl p-3 border-4 text-left transition-all ${glowClass} ${
                  isSelected ? "ring-4 ring-green-400 ring-offset-2 ring-offset-background" : ""
                }`}
                style={{
                  borderColor: `hsl(var(--rarity-${item.rarity.toLowerCase().replace(" ", "-")}))`,
                }}
              >
                <h3 className={`text-sm font-bold ${colorClass} truncate`}>{item.name}</h3>
                <p className={`text-xs ${colorClass} opacity-80`}>{item.rarity}</p>
                <div className="bg-black/40 rounded-full px-2 py-0.5 inline-block mt-1">
                  <span className="font-bold text-foreground text-xs">x{item.count}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Shop Section */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-bold mb-4 text-foreground"
      >
        Shop
      </motion.h2>

      {isLoading ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted-foreground"
        >
          Loading listings...
        </motion.p>
      ) : listings.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted-foreground"
        >
          No items listed yet. Be the first to sell something!
        </motion.p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {listings.map((listing, index) => {
              const rarity = listing.item_rarity as keyof typeof rarityColors;
              const colorClass = rarityColors[rarity] || "text-foreground";
              const glowClass = rarityGlowColors[rarity] || "";
              const rarityColor = rarityInfo[rarity]?.color || "#cfd8dc";
              const isMine = listing.seller_nickname === nickname;

              return (
                <motion.div
                  key={listing.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.02 }}
                  className={`gradient-card rounded-2xl p-4 border-4 ${glowClass}`}
                  style={{
                    borderColor: `hsl(var(--rarity-${rarity.toLowerCase().replace(" ", "-")}))`,
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-muted-foreground font-semibold truncate max-w-[60%]">
                      {listing.seller_nickname}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {timeAgo(listing.created_at)}
                    </span>
                  </div>

                  <h3 className={`text-lg font-bold ${colorClass}`}>{listing.item_name}</h3>
                  <p className={`text-sm ${colorClass} opacity-80 mb-3`}>{listing.item_rarity}</p>

                  {isMine ? (
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onReturn(listing.id)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2
                                 bg-gradient-to-r from-amber-600 to-orange-600
                                 hover:from-amber-500 hover:to-orange-500
                                 text-white font-bold text-sm shadow-lg transition-all"
                    >
                      <RotateCcw size={16} />
                      Return
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onBuy(listing.id)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2
                                 bg-gradient-to-r from-blue-600 to-indigo-600
                                 hover:from-blue-500 hover:to-indigo-500
                                 text-white font-bold text-sm shadow-lg transition-all"
                    >
                      <ShoppingBag size={16} />
                      Buy
                    </motion.button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Floating Sell Button */}
      <AnimatePresence>
        {selectedItem && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSell}
            className="fixed bottom-28 md:bottom-8 right-6 z-50 flex items-center gap-2 rounded-2xl px-6 py-3
                       bg-gradient-to-r from-green-600 to-emerald-600
                       hover:from-green-500 hover:to-emerald-500
                       text-white font-bold text-lg shadow-2xl transition-all"
          >
            <ShoppingBag size={22} />
            Sell
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
