import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { PackCard } from "./PackCard";
import { PackPreview } from "./PackPreview";
import { ResultBar } from "./ResultBar";
import { packs, BlookItem, Rarity, rollPack } from "@/data/gameData";
import { dailyPacks } from "@/data/dailyPacks";
import { useSound } from "@/hooks/useSound";
import { trackEvent } from "@/lib/analytics";

interface PacksViewProps {
  onItemObtained: (name: string, rarity: Rarity) => void;
  onRareReveal?: (rarity: Rarity) => void;
  availablePackNames?: string[];
  announcement?: string;
  seasonalPackName?: string;
}

const RARE_RARITIES: Rarity[] = ["Legendary", "Mythic", "Secret", "Ultra Secret", "Mystical"];

export function PacksView({ onItemObtained, onRareReveal, availablePackNames, announcement, seasonalPackName }: PacksViewProps) {
  const [hoveredPack, setHoveredPack] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [resultItem, setResultItem] = useState<BlookItem | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { playReveal, playRareReveal, playEpicReveal, playMysticalReveal, playCelestialReveal, playDivineReveal, playGalacticReveal, playPrimordialReveal, playExoticReveal, playChromafluxReveal, playVoidflareReveal, playSolaraReveal, playEclipticaReveal, playSingularisReveal, playChronovexReveal, playAetherionReveal, playQuantaraReveal, playParadoxisReveal, playGenesisReveal } = useSound();

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
    trackEvent("pack_opened", { pack_name: packName, item_name: name, rarity });

    // Play sound based on rarity
    if (rarity === "Exotic") {
      playExoticReveal();
      onRareReveal?.(rarity);
    } else if (rarity === "Genesis") {
      playGenesisReveal();
      onRareReveal?.(rarity);
    } else if (rarity === "Primordial") {
      playPrimordialReveal();
      onRareReveal?.(rarity);
    } else if (rarity === "Quantara") {
      playQuantaraReveal();
      onRareReveal?.(rarity);
    } else if (rarity === "Paradoxis") {
      playParadoxisReveal();
      onRareReveal?.(rarity);
    } else if (rarity === "Aetherion") {
      playAetherionReveal();
      onRareReveal?.(rarity);
    } else if (rarity === "Chronovex") {
      playChronovexReveal();
      onRareReveal?.(rarity);
    } else if (rarity === "Galactic") {
      playGalacticReveal();
      onRareReveal?.(rarity);
    } else if (rarity === "Singularis") {
      playSingularisReveal();
      onRareReveal?.(rarity);
    } else if (rarity === "Ecliptica") {
      playEclipticaReveal();
      onRareReveal?.(rarity);
    } else if (rarity === "Solara") {
      playSolaraReveal();
      onRareReveal?.(rarity);
    } else if (rarity === "Voidflare") {
      playVoidflareReveal();
      onRareReveal?.(rarity);
    } else if (rarity === "Chromaflux") {
      playChromafluxReveal();
      onRareReveal?.(rarity);
    } else if (rarity === "Godly" || rarity === "Ascendent" || rarity === "Transcendent") {
      playDivineReveal();
      onRareReveal?.(rarity);
    } else if (rarity === "Divine") {
      playDivineReveal();
      onRareReveal?.(rarity);
    } else if (rarity === "Celestial") {
      playCelestialReveal();
      onRareReveal?.(rarity);
    } else if (rarity === "Mystical") {
      playMysticalReveal();
      onRareReveal?.(rarity);
    } else if (rarity === "Ultra Secret") {
      playEpicReveal();
      onRareReveal?.(rarity);
    } else if (RARE_RARITIES.includes(rarity)) {
      playRareReveal();
      onRareReveal?.(rarity);
    } else {
      playReveal();
    }
  }, [onItemObtained, onRareReveal, playReveal, playRareReveal, playEpicReveal, playMysticalReveal, playCelestialReveal, playDivineReveal, playGalacticReveal, playPrimordialReveal, playExoticReveal, playChromafluxReveal, playVoidflareReveal, playSolaraReveal, playEclipticaReveal, playSingularisReveal, playChronovexReveal, playAetherionReveal, playQuantaraReveal, playParadoxisReveal, playGenesisReveal]);

  const closeResult = () => {
    setShowResult(false);
  };

  // Determine which packs to show
  const packNames = availablePackNames
    ? availablePackNames.filter((name) => packs[name])
    : Object.keys(packs);

  // Split into today's pack, seasonal pack, spawned packs, and original packs
  const todayPack = availablePackNames ? packNames[0] : null;
  const seasonalPack = availablePackNames && seasonalPackName && packNames.includes(seasonalPackName)
    ? seasonalPackName
    : null;
  const spawnedPacks = availablePackNames
    ? packNames.slice(1).filter((n) => n in dailyPacks && n !== seasonalPackName)
    : [];
  const originalPacks = availablePackNames
    ? packNames.filter((n) => !(n in dailyPacks) && n !== seasonalPackName)
    : [];

  return (
    <div className="h-full overflow-y-auto p-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl font-bold mb-4 text-foreground"
      >
        🎁 Choose a Pack to Open
      </motion.h2>

      {announcement && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 px-4 py-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
        >
          <p className="text-sm font-semibold text-yellow-200">
            📢 {announcement}
          </p>
        </motion.div>
      )}

      <PackPreview
        packName={hoveredPack}
        isVisible={previewVisible && hoveredPack !== null}
      />

      {availablePackNames ? (
        <>
          {/* Today's Pack section */}
          {todayPack && (
            <>
              <h3 className="text-lg font-semibold text-foreground/80 mb-3">📅 Today's Pack</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  onMouseEnter={() => setHoveredPack(todayPack)}
                  onMouseLeave={() => setHoveredPack(null)}
                >
                  <PackCard
                    name={todayPack}
                    onClick={() => openPack(todayPack)}
                    disabled={showResult}
                  />
                </motion.div>
              </div>
            </>
          )}

          {/* Seasonal Pack section */}
          {seasonalPack && (
            <>
              <h3 className="text-lg font-semibold text-foreground/80 mb-3">🌟 Seasonal Pack</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  onMouseEnter={() => setHoveredPack(seasonalPack)}
                  onMouseLeave={() => setHoveredPack(null)}
                >
                  <PackCard
                    name={seasonalPack}
                    onClick={() => openPack(seasonalPack)}
                    disabled={showResult}
                  />
                </motion.div>
              </div>
            </>
          )}

          {/* Spawned Packs section */}
          {spawnedPacks.length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-foreground/80 mb-3">✨ Spawned Packs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {spawnedPacks.map((packName, index) => (
                  <motion.div
                    key={packName}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03, type: "spring", stiffness: 300, damping: 25 }}
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
            </>
          )}

          {/* Original Packs section */}
          {originalPacks.length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-foreground/80 mb-3">📦 Packs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {originalPacks.map((packName, index) => (
                  <motion.div
                    key={packName}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03, type: "spring", stiffness: 300, damping: 25 }}
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
            </>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {packNames.map((packName, index) => (
            <motion.div
              key={packName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, type: "spring", stiffness: 300, damping: 25 }}
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
      )}

      <ResultBar
        item={resultItem}
        isVisible={showResult}
        onClose={closeResult}
      />
    </div>
  );
}
