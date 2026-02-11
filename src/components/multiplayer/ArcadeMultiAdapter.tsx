import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { drawRandomItem, Rarity, rarityInfo } from "@/data/gameData";
import { GAME_LIST, type GameResult, type MiniGameProps } from "@/components/games/types";

// Lazy-import all 24 game components
import { HelicopterGame } from "@/components/games/HelicopterGame";
import { BloonsGame } from "@/components/games/BloonsGame";
import { BowmanGame } from "@/components/games/BowmanGame";
import { BubbleSpinnerGame } from "@/components/games/BubbleSpinnerGame";
import { DragRacerGame } from "@/components/games/DragRacerGame";
import { EffingWormsGame } from "@/components/games/EffingWormsGame";
import { ImpossibleQuizGame } from "@/components/games/ImpossibleQuizGame";
import { KittenCannonGame } from "@/components/games/KittenCannonGame";
import { MiniPuttGame } from "@/components/games/MiniPuttGame";
import { MonkeySlap } from "@/components/games/MonkeySlap";
import { PinchHitterGame } from "@/components/games/PinchHitterGame";
import { RaftWarsGame } from "@/components/games/RaftWarsGame";
import { TanksGame } from "@/components/games/TanksGame";
import { ZombocalypseGame } from "@/components/games/ZombocalypseGame";
import { SnakeGame } from "@/components/games/SnakeGame";
import { WhackAMoleGame } from "@/components/games/WhackAMoleGame";
import { ReactionGame } from "@/components/games/ReactionGame";
import { BrickBreakerGame } from "@/components/games/BrickBreakerGame";
import { TypingGame } from "@/components/games/TypingGame";
import { MathGame } from "@/components/games/MathGame";
import { ColorMatchGame } from "@/components/games/ColorMatchGame";
import { MemoryGame } from "@/components/games/MemoryGame";
import { PatternGame } from "@/components/games/PatternGame";
import { TowerStackGame } from "@/components/games/TowerStackGame";
import { SpeedBuilderGame } from "@/components/games/SpeedBuilderGame";
import { GhostHunterGame } from "@/components/games/GhostHunterGame";
import { RocketGoalGame } from "@/components/games/RocketGoalGame";
import { KartDashGame } from "@/components/games/KartDashGame";
import { TargetBlitzGame } from "@/components/games/TargetBlitzGame";
import { EggTossGame } from "@/components/games/EggTossGame";
import { ZoneRunnerGame } from "@/components/games/ZoneRunnerGame";
import { GardenRushGame } from "@/components/games/GardenRushGame";
import { MineClickerGame } from "@/components/games/MineClickerGame";

const GAME_COMPONENTS: Record<string, React.ComponentType<MiniGameProps>> = {
  helicopter: HelicopterGame,
  bloons: BloonsGame,
  bowman: BowmanGame,
  bubblespinner: BubbleSpinnerGame,
  dragracer: DragRacerGame,
  effingworms: EffingWormsGame,
  impossiblequiz: ImpossibleQuizGame,
  kittencannon: KittenCannonGame,
  miniputt: MiniPuttGame,
  monkeyslap: MonkeySlap,
  pinchhitter: PinchHitterGame,
  raftwars: RaftWarsGame,
  tanks: TanksGame,
  zombocalypse: ZombocalypseGame,
  snake: SnakeGame,
  whackamole: WhackAMoleGame,
  reaction: ReactionGame,
  brickbreaker: BrickBreakerGame,
  typing: TypingGame,
  math: MathGame,
  colormatch: ColorMatchGame,
  memory: MemoryGame,
  pattern: PatternGame,
  towerstack: TowerStackGame,
  speedbuilder: SpeedBuilderGame,
  ghosthunter: GhostHunterGame,
  rocketgoal: RocketGoalGame,
  kartdash: KartDashGame,
  targetblitz: TargetBlitzGame,
  eggtoss: EggTossGame,
  zonerunner: ZoneRunnerGame,
  gardenrush: GardenRushGame,
  mineclicker: MineClickerGame,
};

interface CollectedItem {
  name: string;
  rarity: Rarity;
}

interface ArcadeMultiAdapterProps {
  gameId: string;
  timeRemaining: number | null;
  onItemObtained: (name: string, rarity: Rarity) => void;
  onScoreChange?: (count: number) => void;
}

export function ArcadeMultiAdapter({ gameId, timeRemaining, onItemObtained, onScoreChange }: ArcadeMultiAdapterProps) {
  const [collected, setCollected] = useState<CollectedItem[]>([]);
  const [roundKey, setRoundKey] = useState(0);
  const [lastItem, setLastItem] = useState<CollectedItem | null>(null);
  const committedRef = useRef(false);
  const collectedRef = useRef<CollectedItem[]>([]);

  const gameMeta = GAME_LIST.find((g) => g.id === gameId);
  const GameComponent = GAME_COMPONENTS[gameId];

  // When a round ends, award an item and restart the game
  const handleGameEnd = useCallback((_result: GameResult) => {
    const item = drawRandomItem();
    const newItem = { name: item.name, rarity: item.rarity };
    setLastItem(newItem);
    collectedRef.current = [...collectedRef.current, newItem];
    setCollected((prev) => [...prev, newItem]);
    onScoreChange?.(collectedRef.current.length);

    // Auto-restart after a brief flash
    setTimeout(() => {
      setRoundKey((k) => k + 1);
    }, 600);
  }, [onScoreChange]);

  // Restart the round when player hits back/exit in a game
  const handleExit = useCallback(() => {
    setRoundKey((k) => k + 1);
  }, []);

  // Commit all items when time runs out
  useEffect(() => {
    if (timeRemaining === 0 && !committedRef.current) {
      committedRef.current = true;
      for (const item of collectedRef.current) {
        onItemObtained(item.name, item.rarity);
      }
    }
  }, [timeRemaining, onItemObtained]);

  if (!GameComponent) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <p className="text-muted-foreground">Game "{gameId}" not found</p>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-y-auto p-4">
      {/* Collected items counter */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-32 right-4 z-30 bg-black/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-primary/30"
      >
        <div className="text-xs text-muted-foreground">Items</div>
        <div className="text-2xl font-bold text-primary">{collected.length}</div>
      </motion.div>

      {/* Last item flash */}
      {lastItem && (
        <motion.div
          key={collected.length}
          initial={{ opacity: 1, scale: 1.2, y: 0 }}
          animate={{ opacity: 0, scale: 0.8, y: -30 }}
          transition={{ duration: 0.6 }}
          className="fixed top-44 right-4 z-30 text-sm font-bold"
          style={{ color: rarityInfo[lastItem.rarity]?.color || "#fff" }}
        >
          +{lastItem.name}
        </motion.div>
      )}

      {/* Game area */}
      <div className="max-w-lg mx-auto pt-2">
        <GameComponent
          key={roundKey}
          onGameEnd={handleGameEnd}
          onExit={handleExit}
          onScoreChange={onScoreChange}
        />
      </div>
    </div>
  );
}

// Export the list of arcade mode IDs for use in routing
export const ARCADE_MODE_IDS = GAME_LIST.map((g) => g.id);
