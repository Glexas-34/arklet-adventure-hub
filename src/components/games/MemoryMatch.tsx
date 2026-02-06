import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";
import { useSound } from "@/hooks/useSound";

const EMOJIS = ["🐶", "🐱", "🐸", "🦊", "🐼", "🐨", "🐯", "🦁"];

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

export function MemoryMatch({ onGameEnd, onExit }: MiniGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [flips, setFlips] = useState(0);
  const [matches, setMatches] = useState(0);
  const [started, setStarted] = useState(false);
  const { playClick, playCorrect, playWrong } = useSound();
  const TOTAL_PAIRS = 8;

  useEffect(() => {
    const pairs = shuffleArray([...EMOJIS, ...EMOJIS]);
    setCards(pairs.map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false })));
  }, []);

  useEffect(() => {
    if (matches === TOTAL_PAIRS && started) {
      // Score: fewer flips = better. 16 flips (perfect) = 1.0, 40+ = ~0
      const normalized = Math.max(0, Math.min(1, (40 - flips) / 24));
      onGameEnd({
        score: flips,
        maxScore: 16,
        normalizedScore: normalized,
      });
    }
  }, [matches, started, flips, onGameEnd]);

  const handleCardClick = useCallback((cardId: number) => {
    if (!started) setStarted(true);

    const card = cards[cardId];
    if (card.flipped || card.matched || selected.length >= 2) return;

    playClick();
    setFlips((f) => f + 1);

    const newCards = cards.map((c) =>
      c.id === cardId ? { ...c, flipped: true } : c
    );
    setCards(newCards);

    const newSelected = [...selected, cardId];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (newCards[first].emoji === newCards[second].emoji) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first || c.id === second ? { ...c, matched: true } : c
            )
          );
          setMatches((m) => m + 1);
          setSelected([]);
          playCorrect();
        }, 300);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first || c.id === second ? { ...c, flipped: false } : c
            )
          );
          setSelected([]);
          playWrong();
        }, 800);
      }
    }
  }, [cards, selected, started, playClick, playCorrect, playWrong]);

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
          className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ArrowLeft size={20} />
        </motion.button>
        <h3 className="text-xl font-bold text-foreground">🃏 Memory Match</h3>
        <span className="ml-auto text-sm text-muted-foreground font-bold">
          Flips: {flips} | Pairs: {matches}/{TOTAL_PAIRS}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-xl text-3xl md:text-4xl font-bold flex items-center justify-center
                       transition-all min-h-[60px] ${
              card.matched
                ? "bg-green-600/30 border-2 border-green-500/50"
                : card.flipped
                  ? "bg-cyan-600/30 border-2 border-cyan-500/50"
                  : "bg-black/40 hover:bg-black/50 border-2 border-white/10"
            }`}
          >
            {card.flipped || card.matched ? (
              <motion.span
                initial={{ rotateY: 90 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.2 }}
              >
                {card.emoji}
              </motion.span>
            ) : (
              <span className="text-white/20">?</span>
            )}
          </motion.button>
        ))}
      </div>

      {!started && (
        <p className="text-center text-muted-foreground mt-4 text-sm">
          Tap any card to start!
        </p>
      )}
    </div>
  );
}
