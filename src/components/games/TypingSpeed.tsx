import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { MiniGameProps } from "./types";
import { useSound } from "@/hooks/useSound";

const WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
  "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know",
  "take", "people", "into", "year", "your", "good", "some", "could",
  "them", "see", "other", "than", "then", "now", "look", "only", "come",
  "its", "over", "think", "also", "back", "after", "use", "two", "how",
  "our", "work", "first", "well", "way", "even", "new", "want", "day",
  "cat", "dog", "run", "big", "red", "blue", "fast", "play", "game",
  "fun", "cool", "jump", "fish", "bird", "star", "moon", "sun", "tree",
];

function getRandomWords(count: number): string[] {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  return result;
}

export function TypingSpeed({ onGameEnd, onExit }: MiniGameProps) {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [words] = useState(() => getRandomWords(60));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [completed, setCompleted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { playCorrect, playTick } = useSound();
  const MAX_SCORE = 25;

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          return 0;
        }
        if (t <= 5) playTick();
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, playTick]);

  useEffect(() => {
    if (started && timeLeft === 0) {
      onGameEnd({
        score: completed,
        maxScore: MAX_SCORE,
        normalizedScore: Math.min(1, completed / MAX_SCORE),
      });
    }
  }, [timeLeft, started, completed, onGameEnd]);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val.endsWith(" ") || val.endsWith("\n")) {
        const typed = val.trim();
        if (typed === words[currentIndex]) {
          setCompleted((c) => c + 1);
          playCorrect();
        }
        setCurrentIndex((i) => i + 1);
        setInput("");
      } else {
        setInput(val);
      }
    },
    [words, currentIndex, playCorrect]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  const startGame = () => {
    setStarted(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  if (!started) {
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="flex items-center gap-3 mb-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
            className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft size={20} />
          </motion.button>
          <h3 className="text-xl font-bold text-foreground">⌨️ Typing Speed</h3>
        </div>
        <p className="text-muted-foreground mb-6">Type as many words as you can in 30 seconds! Press space after each word.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="gradient-button text-primary-foreground font-bold px-8 py-4 rounded-xl text-xl"
        >
          Start!
        </motion.button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onExit}
          className="p-2 rounded-xl bg-black/30 text-foreground hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ArrowLeft size={20} />
        </motion.button>
        <h3 className="text-xl font-bold text-foreground">⌨️ Typing Speed</h3>
        <span className={`ml-auto text-lg font-bold ${timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-foreground"}`}>
          {timeLeft}s
        </span>
      </div>

      <div className="bg-card rounded-3xl p-6 text-center">
        <div className="mb-4 text-sm text-muted-foreground">
          Words typed: <span className="text-green-400 font-bold">{completed}</span>
        </div>

        <div className="bg-black/30 rounded-xl p-4 mb-4 flex flex-wrap gap-2 justify-center min-h-[80px]">
          {words.slice(currentIndex, currentIndex + 8).map((word, i) => (
            <span
              key={`${currentIndex + i}`}
              className={`text-lg md:text-xl font-bold px-2 py-1 rounded ${
                i === 0 ? "text-cyan-400 bg-cyan-400/10" : "text-foreground/60"
              }`}
            >
              {word}
            </span>
          ))}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          autoFocus
          disabled={timeLeft <= 0}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          className="w-full text-center text-2xl font-bold bg-black/30 rounded-xl px-4 py-3
                     text-foreground outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="Type here..."
        />
      </div>
    </div>
  );
}
