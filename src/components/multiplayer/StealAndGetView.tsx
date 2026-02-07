import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { drawStealOrItem, rarityInfo, Rarity } from "@/data/gameData";
import { GamePlayer } from "@/hooks/useMultiplayerGame";
import { supabase } from "@/integrations/supabase/client";
import { StealAndGetIcon } from "@/components/GameModeIcons";
import { useSound } from "@/hooks/useSound";

interface CollectedItem {
  name: string;
  rarity: Rarity;
}

interface StealAndGetViewProps {
  roomId: string;
  players: GamePlayer[];
  myPlayer: GamePlayer | null;
  timeRemaining: number | null;
  onItemObtained: (name: string, rarity: Rarity) => void;
  onScoreChange?: (count: number) => void;
}

export function StealAndGetView({
  roomId,
  players,
  myPlayer,
  timeRemaining,
  onItemObtained,
  onScoreChange,
}: StealAndGetViewProps) {
  const { playCollect, playSteal, playStolenAlert } = useSound();
  const [collected, setCollected] = useState<CollectedItem[]>([]);
  const [revealing, setRevealing] = useState(false);
  const [revealedBox, setRevealedBox] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<{ type: "steal" } | { type: "item"; name: string; rarity: Rarity } | null>(null);
  const [stealMode, setStealMode] = useState(false);
  const [otherPlayerItems, setOtherPlayerItems] = useState<{ nickname: string; item: string; rarity: string }[]>([]);
  const [stolenMessage, setStolenMessage] = useState<string | null>(null);
  const committedRef = useRef(false);

  // Listen for steal events via broadcast
  useEffect(() => {
    if (!roomId || !myPlayer) return;

    const channel = supabase.channel(`steal-${roomId}`);
    channel
      .on("broadcast", { event: "steal" }, (payload) => {
        const { thief, victimNickname, itemName } = payload.payload;
        if (victimNickname === myPlayer.nickname) {
          // Someone stole from me
          setCollected((prev) => {
            const idx = prev.findIndex((i) => i.name === itemName);
            if (idx >= 0) {
              const next = [...prev];
              next.splice(idx, 1);
              return next;
            }
            return prev;
          });
          setStolenMessage(`${thief} stole your ${itemName}!`);
          setTimeout(() => setStolenMessage(null), 3000);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, myPlayer]);

  // Commit items to inventory when game ends
  useEffect(() => {
    if (timeRemaining === 0 && !committedRef.current) {
      committedRef.current = true;
      collected.forEach((item) => onItemObtained(item.name, item.rarity));
    }
  }, [timeRemaining, collected, onItemObtained]);

  // Report score when collected changes
  useEffect(() => {
    onScoreChange?.(collected.length);
  }, [collected.length, onScoreChange]);

  // Play stolen alert sound
  useEffect(() => {
    if (stolenMessage) playStolenAlert();
  }, [stolenMessage, playStolenAlert]);

  // Build list of other players' items from their current_item
  useEffect(() => {
    const items: { nickname: string; item: string; rarity: string }[] = [];
    for (const p of players) {
      if (p.id !== myPlayer?.id && p.current_item && p.current_rarity) {
        items.push({ nickname: p.nickname, item: p.current_item, rarity: p.current_rarity });
      }
    }
    setOtherPlayerItems(items);
  }, [players, myPlayer]);

  const handleBoxClick = useCallback((boxIndex: number) => {
    if (revealing || stealMode || timeRemaining === 0) return;

    setRevealing(true);
    setRevealedBox(boxIndex);
    const result = drawStealOrItem();
    setLastResult(result);

    if (result.type === "item") {
      playCollect();
      setCollected((prev) => [...prev, { name: result.name, rarity: result.rarity }]);
      onItemObtained(result.name, result.rarity);
    } else {
      // Steal mode
      playSteal();
      setStealMode(true);
    }

    setTimeout(() => {
      if (result.type !== "steal") {
        setRevealing(false);
        setRevealedBox(null);
        setLastResult(null);
      }
    }, 1500);
  }, [revealing, stealMode, timeRemaining, onItemObtained]);

  const handleSteal = useCallback(async (targetNickname: string, itemName: string, itemRarity: string) => {
    playCollect();
    // Add the stolen item to our collection
    setCollected((prev) => [...prev, { name: itemName, rarity: itemRarity as Rarity }]);

    // Broadcast steal event
    const channel = supabase.channel(`steal-${roomId}`);
    await channel.send({
      type: "broadcast",
      event: "steal",
      payload: {
        thief: myPlayer?.nickname,
        victimNickname: targetNickname,
        itemName,
      },
    });

    setStealMode(false);
    setRevealing(false);
    setRevealedBox(null);
    setLastResult(null);
  }, [roomId, myPlayer]);

  const cancelSteal = useCallback(() => {
    setStealMode(false);
    setRevealing(false);
    setRevealedBox(null);
    setLastResult(null);
  }, []);

  const boxColors = ["from-purple-500 to-pink-500", "from-blue-500 to-cyan-500", "from-orange-500 to-yellow-500"];

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 gap-6">
      {/* Stolen notification */}
      <AnimatePresence>
        {stolenMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-36 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-xl font-bold z-50"
          >
            {stolenMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <StealAndGetIcon size={36} />
        <h2 className="text-2xl font-bold">Steal & Get</h2>
      </div>
      <p className="text-muted-foreground text-sm">Click a mystery box to reveal an item!</p>

      {/* Steal mode overlay */}
      {stealMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4 text-red-400">🕵️ Steal an Item!</h3>
            {otherPlayerItems.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {otherPlayerItems.map((entry, i) => (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSteal(entry.nickname, entry.item, entry.rarity)}
                    className="w-full p-3 rounded-xl bg-black/30 border border-white/10 hover:border-red-500/50 text-left"
                  >
                    <div className="text-xs text-muted-foreground">{entry.nickname}</div>
                    <div className="font-bold" style={{ color: rarityInfo[entry.rarity as Rarity]?.color }}>
                      {entry.item}
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No items to steal yet!</p>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={cancelSteal}
              className="mt-4 w-full p-2 rounded-xl bg-white/10 text-sm text-muted-foreground hover:bg-white/20"
            >
              Skip Steal
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Mystery Boxes */}
      <div className="flex gap-4">
        {[0, 1, 2].map((i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleBoxClick(i)}
            disabled={revealing || timeRemaining === 0}
            className={`w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br ${boxColors[i]}
                       flex items-center justify-center text-4xl md:text-5xl shadow-lg border-2 border-white/20
                       disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden`}
          >
            {revealedBox === i && lastResult ? (
              <motion.div
                initial={{ rotateY: 180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                className="text-center"
              >
                {lastResult.type === "steal" ? (
                  <div className="text-2xl">🕵️</div>
                ) : (
                  <div>
                    <div className="text-lg md:text-xl font-bold" style={{ color: rarityInfo[lastResult.rarity]?.color }}>
                      {lastResult.name}
                    </div>
                    <div className="text-xs" style={{ color: rarityInfo[lastResult.rarity]?.color }}>
                      {lastResult.rarity}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <span>❓</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Collected Items */}
      <div className="w-full max-w-md">
        <h3 className="text-sm font-bold text-muted-foreground mb-2">
          Items Collected: {collected.length}
        </h3>
        <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
          {collected.map((item, i) => (
            <span
              key={i}
              className="text-xs px-2 py-1 rounded-lg bg-black/30 border border-white/10"
              style={{ color: rarityInfo[item.rarity]?.color }}
            >
              {item.name}
            </span>
          ))}
        </div>
      </div>

      {timeRemaining === 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <p className="text-xl font-bold text-primary">Time's Up!</p>
          <p className="text-muted-foreground">You collected {collected.length} items!</p>
        </motion.div>
      )}
    </div>
  );
}
