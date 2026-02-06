import { Rarity } from "@/data/gameData";

export interface GameResult {
  score: number;
  maxScore: number;
  normalizedScore: number; // 0-1
}

export interface ArcadeProgress {
  nickname: string;
  gameName: string;
  score: number;
  status: "playing" | "finished";
}

export interface MiniGameProps {
  onGameEnd: (result: GameResult) => void;
  onExit: () => void;
  onProgressUpdate?: (progress: ArcadeProgress) => void;
}

export interface ArcadeReward {
  itemName: string;
  rarity: Rarity;
  packName: string;
}

export interface GameMeta {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
}

export const GAME_LIST: GameMeta[] = [
  { id: "reaction", name: "Reaction Time", emoji: "🎯", description: "Click as fast as you can!", color: "from-red-500 to-orange-500" },
  { id: "math", name: "Math Sprint", emoji: "🧮", description: "Solve equations at lightning speed!", color: "from-blue-500 to-cyan-500" },
  { id: "color", name: "Color Match", emoji: "🎨", description: "Match the color, not the word!", color: "from-green-500 to-emerald-500" },
  { id: "typing", name: "Typing Speed", emoji: "⌨️", description: "Type as many words as you can!", color: "from-purple-500 to-violet-500" },
  { id: "memory", name: "Memory Match", emoji: "🃏", description: "Find all the matching pairs!", color: "from-pink-500 to-rose-500" },
  { id: "whack", name: "Whack-a-Mole", emoji: "🔨", description: "Bonk the moles before they hide!", color: "from-yellow-500 to-amber-500" },
  { id: "pattern", name: "Pattern Memory", emoji: "🧠", description: "Remember the sequence!", color: "from-teal-500 to-cyan-500" },
  { id: "brick", name: "Brick Breaker", emoji: "🧱", description: "Smash all the bricks!", color: "from-orange-500 to-red-500" },
  { id: "snake", name: "Snake", emoji: "🐍", description: "Eat and grow without crashing!", color: "from-lime-500 to-green-500" },
];
