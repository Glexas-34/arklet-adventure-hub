import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { GAME_LIST } from "./games/types";
import type { GameResult, ArcadeProgress } from "./games/types";
import { rollArcadeReward } from "./games/arcadeRewards";
import { ArcadeRewardModal } from "./ArcadeRewardModal";
import { ArcadePlayerTicker } from "./ArcadePlayerTicker";
import type { ArcadeReward } from "./games/types";
import { useSound } from "@/hooks/useSound";
import { Rarity } from "@/data/gameData";
import { trackEvent } from "@/lib/analytics";

import { TanksGame } from "./games/TanksGame";
import { BowmanGame } from "./games/BowmanGame";
import { CurveBallGame } from "./games/CurveBallGame";
import { MiniPuttGame } from "./games/MiniPuttGame";
import { PinchHitterGame } from "./games/PinchHitterGame";

interface ArcadeViewProps {
  onItemObtained: (name: string, rarity: Rarity) => void;
  nickname?: string | null;
  otherPlayers?: ArcadeProgress[];
}

const GAME_COMPONENTS: Record<string, React.FC<any>> = {
  tanks: TanksGame,
  bowman: BowmanGame,
  curveball: CurveBallGame,
  miniputt: MiniPuttGame,
  pinchhitter: PinchHitterGame,
};

export function ArcadeView({ onItemObtained, nickname, otherPlayers = [] }: ArcadeViewProps) {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [reward, setReward] = useState<ArcadeReward | null>(null);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const { playClick, playGameStart, playGameWin, playGameLose } = useSound();

  const handleGameEnd = useCallback((result: GameResult) => {
    const earned = rollArcadeReward(result.normalizedScore);
    setReward(earned);
    setLastResult(result);
    setShowReward(true);
    onItemObtained(earned.itemName, earned.rarity);
    trackEvent("arcade_game_completed", {
      game_id: result.gameId,
      score: result.score,
      normalized_score: result.normalizedScore,
      reward_item: earned.itemName,
      reward_rarity: earned.rarity,
    });

    if (result.normalizedScore >= 0.5) {
      playGameWin();
    } else {
      playGameLose();
    }
  }, [onItemObtained, playGameWin, playGameLose]);

  const handleStartGame = (gameId: string) => {
    playClick();
    playGameStart();
    setActiveGame(gameId);
    trackEvent("arcade_game_started", { game_id: gameId });
  };

  const handleExit = () => {
    playClick();
    setActiveGame(null);
  };

  const handleCloseReward = () => {
    setShowReward(false);
    setActiveGame(null);
  };

  // Render active game
  if (activeGame) {
    const GameComponent = GAME_COMPONENTS[activeGame];
    if (!GameComponent) return null;

    return (
      <div className="h-full overflow-y-auto p-4">
        <GameComponent
          onGameEnd={handleGameEnd}
          onExit={handleExit}
        />
        <ArcadeRewardModal
          isOpen={showReward}
          reward={reward}
          result={lastResult}
          onClose={handleCloseReward}
        />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold mb-2 text-foreground"
      >
        🕹️ Game Zone
      </motion.h2>
      <p className="text-muted-foreground mb-4 text-sm md:text-base">
        Classic 2-player games! Winner earns rarer rewards!
      </p>

      {otherPlayers.length > 0 && (
        <ArcadePlayerTicker players={otherPlayers} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GAME_LIST.map((game, index) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, type: "spring", stiffness: 300, damping: 25 }}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.96, rotate: -1 }}
            onClick={() => handleStartGame(game.id)}
            className={`bg-gradient-to-br ${game.color} rounded-2xl p-5 text-left shadow-lg
                       transition-shadow hover:shadow-2xl min-h-[48px]`}
          >
            <span className="text-4xl md:text-5xl block mb-2">{game.emoji}</span>
            <p className="text-lg font-bold text-white drop-shadow">{game.name}</p>
            <p className="text-sm text-white/80">{game.description}</p>
          </motion.button>
        ))}
      </div>

      <ArcadeRewardModal
        isOpen={showReward}
        reward={reward}
        result={lastResult}
        onClose={handleCloseReward}
      />
    </div>
  );
}
