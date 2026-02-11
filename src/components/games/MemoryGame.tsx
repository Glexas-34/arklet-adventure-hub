import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";

const MAX_SCORE = 50;
const CARD_EMOJIS = ["🎮", "🎯", "🎪", "🎨", "🎭", "🎵", "🎲", "🎳"];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

type GamePhase = "menu" | "play" | "dead";

export function MemoryGame({ onGameEnd, onExit, onScoreChange }: MiniGameProps) {
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [pairsFound, setPairsFound] = useState(0);
  const [totalFlipPairs, setTotalFlipPairs] = useState(0);
  const [canFlip, setCanFlip] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and shuffle cards
  const initializeGame = useCallback(() => {
    const cardPairs = [...CARD_EMOJIS, ...CARD_EMOJIS];
    const shuffled = cardPairs
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setFlippedIndices([]);
    setPairsFound(0);
    setTotalFlipPairs(0);
    setCanFlip(true);
  }, []);

  // Start game
  const handleStart = () => {
    initializeGame();
    setPhase("play");
  };

  // Handle card flip
  const handleCardClick = (index: number) => {
    if (!canFlip || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setCanFlip(false);
      setTotalFlipPairs(prev => prev + 1);

      const [firstIndex, secondIndex] = newFlippedIndices;
      const firstCard = newCards[firstIndex];
      const secondCard = newCards[secondIndex];

      if (firstCard.emoji === secondCard.emoji) {
        // Match found
        newCards[firstIndex].isMatched = true;
        newCards[secondIndex].isMatched = true;
        setCards(newCards);
        setFlippedIndices([]);
        setCanFlip(true);

        const newPairsFound = pairsFound + 1;
        setPairsFound(newPairsFound);

        if (onScoreChange) {
          onScoreChange(newPairsFound);
        }

        // Check if all pairs found
        if (newPairsFound === 8) {
          const finalScore = Math.max(0, MAX_SCORE - (totalFlipPairs + 1 - 8) * 2);
          setTimeout(() => {
            onGameEnd({
              score: finalScore,
              maxScore: MAX_SCORE,
              normalizedScore: finalScore / MAX_SCORE,
            });
          }, 500);
        }
      } else {
        // No match - flip back after delay
        timeoutRef.current = setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
          setCanFlip(true);
        }, 800);
      }
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Menu phase
  if (phase === "menu") {
    return (
      <div className="w-full min-h-[400px] bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-4 rounded-2xl relative">
        <button
          onClick={onExit}
          className="absolute top-4 left-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Where'd It Go?!
            </h1>
            <p className="text-xl text-purple-300">
              Find all the pairs!
            </p>
          </div>

          <div className="space-y-4 text-purple-200">
            <p>Match 8 pairs of cards</p>
            <p>Fewer moves = higher score</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-lg shadow-lg hover:shadow-purple-500/50 transition-shadow"
          >
            Start Game
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Play phase
  return (
    <div className="w-full min-h-[400px] bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col p-4 rounded-2xl relative">
      <button
        onClick={onExit}
        className="absolute top-4 left-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors z-10"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>

      {/* Score display */}
      <div className="text-center text-white mb-4 mt-12">
        <p className="text-xl font-bold">
          Pairs: {pairsFound} / 8 | Moves: {totalFlipPairs}
        </p>
      </div>

      {/* Card grid */}
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-4 gap-3 max-w-lg w-full">
          {cards.map((card, index) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className="relative aspect-square min-h-[60px] min-w-[60px]"
              whileHover={{ scale: canFlip && !card.isFlipped && !card.isMatched ? 1.05 : 1 }}
              whileTap={{ scale: canFlip && !card.isFlipped && !card.isMatched ? 0.95 : 1 }}
              disabled={!canFlip || card.isFlipped || card.isMatched}
            >
              <AnimatePresence mode="wait">
                {card.isFlipped || card.isMatched ? (
                  <motion.div
                    key="front"
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: 90 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute inset-0 rounded-lg flex items-center justify-center text-4xl ${
                      card.isMatched
                        ? "bg-gradient-to-br from-green-500 to-emerald-600"
                        : "bg-gradient-to-br from-purple-600 to-pink-600"
                    }`}
                  >
                    {card.emoji}
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: 90 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 border-2 border-slate-600 flex items-center justify-center"
                  >
                    <div className="w-8 h-8 border-4 border-slate-500 rounded-lg rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
