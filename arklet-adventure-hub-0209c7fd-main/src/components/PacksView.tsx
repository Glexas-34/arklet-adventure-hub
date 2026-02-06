import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { PackCard } from "./PackCard";
import { PackPreview } from "./PackPreview";
import { ResultBar } from "./ResultBar";
import { packs, BlookItem, Rarity, rollPack } from "@/data/gameData";

interface PacksViewProps {
  onItemObtained: (name: string, rarity: Rarity) => void;
}

export function PacksView({ onItemObtained }: PacksViewProps) {
  const [hoveredPack, setHoveredPack] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [resultItem, setResultItem] = useState<BlookItem | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Toggle preview with Enter key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Enter") {
        e.preventDefault();
        setPreviewVisible((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openPack = useCallback((packName: string) => {
    const [name, rarity] = rollPack(packName);
    const item = { name, rarity, chance: 0 };
    setResultItem(item);
    setShowResult(true);
    onItemObtained(name, rarity);
  }, [onItemObtained]);

  const closeResult = () => {
    setShowResult(false);
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-4 text-foreground"
      >
        🎁 Choose a Pack to Open
      </motion.h2>

      <PackPreview 
        packName={hoveredPack} 
        isVisible={previewVisible && hoveredPack !== null} 
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(packs).map((packName, index) => (
          <motion.div
            key={packName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            onMouseEnter={() => setHoveredPack(packName)}
            onMouseLeave={() => setHoveredPack(null)}
          >
            <PackCard
              name={packName}
              onClick={() => openPack(packName)}
              disabled={showResult}
            />
          </motion.div>
        ))}
      </div>

      <ResultBar
        item={resultItem}
        isVisible={showResult}
        onClose={closeResult}
      />
    </div>
  );
}
