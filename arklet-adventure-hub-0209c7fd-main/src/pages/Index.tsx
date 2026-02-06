import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameHeader } from "@/components/GameHeader";
import { Sidebar } from "@/components/Sidebar";
import { PacksView } from "@/components/PacksView";
import { InventoryView } from "@/components/InventoryView";
import { IndexView } from "@/components/IndexView";
import { LeaderboardView } from "@/components/LeaderboardView";
import { HostGameModal } from "@/components/HostGameModal";
import { JoinGameModal } from "@/components/JoinGameModal";
import { GameOverlay } from "@/components/GameOverlay";
import { NicknameModal } from "@/components/NicknameModal";
import { useInventory } from "@/hooks/useInventory";
import { useMultiplayerGame } from "@/hooks/useMultiplayerGame";
import { usePlayerProfile } from "@/hooks/usePlayerProfile";
import { Rarity } from "@/data/gameData";

type View = "packs" | "inventory" | "index" | "leaderboard";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("packs");
  const [isVisible, setIsVisible] = useState(true);
  const [showHostModal, setShowHostModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [gamePinCode, setGamePinCode] = useState<string | null>(null);

  const { inventory, addItem, getTotalItems, getUniqueCount, clearInventory } = useInventory();
  const {
    currentRoom,
    players,
    myPlayer,
    isHost,
    timeRemaining,
    error,
    createRoom,
    joinRoom,
    startGame,
    reportItem,
    leaveRoom,
  } = useMultiplayerGame();
  const {
    nickname,
    showNicknameModal,
    saveNickname,
    updateUniqueCount,
    incrementWins,
  } = usePlayerProfile();

  const isInGame = currentRoom !== null && currentRoom.status === "playing";

  // Space bar toggle for GUI visibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.target?.toString().includes("Input")) {
        e.preventDefault();
        setIsVisible((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // When game starts, switch to packs view
  useEffect(() => {
    if (currentRoom?.status === "playing") {
      setCurrentView("packs");
      setShowHostModal(false);
      setShowJoinModal(false);
    }
  }, [currentRoom?.status]);

  // Sync unique count to profile when it changes
  useEffect(() => {
    const uniqueCount = getUniqueCount();
    if (nickname && uniqueCount > 0) {
      updateUniqueCount(uniqueCount);
    }
  }, [getUniqueCount, nickname, updateUniqueCount]);

  // Increment wins when the player wins a game
  useEffect(() => {
    if (currentRoom?.status === "finished" && nickname && currentRoom.winner_nickname === nickname) {
      incrementWins();
    }
  }, [currentRoom?.status, nickname, currentRoom?.winner_nickname, incrementWins]);

  const handleClearInventory = () => {
    if (confirm("Are you sure you want to clear your inventory?")) {
      clearInventory();
    }
  };

  const handleItemObtained = (name: string, rarity: Rarity) => {
    addItem(name, rarity);
    // Report to multiplayer if in game
    if (currentRoom?.status === "playing") {
      reportItem(name, rarity);
    }
  };

  const handleCreateRoom = async (nickname: string, targetRarity: Rarity, timeLimit: number) => {
    const result = await createRoom(nickname, targetRarity, timeLimit);
    if (result.success && result.pinCode) {
      setGamePinCode(result.pinCode);
    }
    return result;
  };

  const handleJoinRoom = async (pinCode: string, nickname: string) => {
    const result = await joinRoom(pinCode, nickname);
    if (result.success) {
      setShowJoinModal(false);
    }
    return result;
  };

  const handleLeaveGame = () => {
    leaveRoom();
    setGamePinCode(null);
    setShowHostModal(false);
    setShowJoinModal(false);
  };

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="min-h-screen bg-background flex flex-col"
        >
          <GameHeader />
          
          {/* Game overlay when in multiplayer */}
          {currentRoom && currentRoom.status === "playing" && (
            <GameOverlay
              room={currentRoom}
              players={players}
              myPlayer={myPlayer}
              timeRemaining={timeRemaining}
              onLeave={handleLeaveGame}
            />
          )}
          
          <div className="flex-1 flex overflow-hidden">
            <Sidebar
              currentView={currentView}
              onViewChange={setCurrentView}
              totalItems={getTotalItems()}
              uniqueItems={getUniqueCount()}
              onClearInventory={handleClearInventory}
              onHostGame={() => setShowHostModal(true)}
              onJoinGame={() => setShowJoinModal(true)}
              isInGame={isInGame}
            />
            
            <motion.main
              key={currentView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className={`flex-1 overflow-hidden ${currentRoom?.status === "playing" ? "pt-28" : ""}`}
            >
              {currentView === "packs" && (
                <PacksView onItemObtained={handleItemObtained} />
              )}
              {currentView === "inventory" && (
                <InventoryView inventory={inventory} />
              )}
              {currentView === "index" && (
                <IndexView inventory={inventory} />
              )}
              {currentView === "leaderboard" && (
                <LeaderboardView currentNickname={nickname} />
              )}
            </motion.main>
          </div>

          {/* Modals */}
          <HostGameModal
            isOpen={showHostModal}
            onClose={() => {
              if (!currentRoom) {
                setShowHostModal(false);
                setGamePinCode(null);
              }
            }}
            onCreateRoom={handleCreateRoom}
            onStartGame={startGame}
            pinCode={gamePinCode}
            players={players}
            error={error}
          />

          <JoinGameModal
            isOpen={showJoinModal}
            onClose={() => setShowJoinModal(false)}
            onJoin={handleJoinRoom}
            error={error}
          />

          {/* Nickname Modal */}
          <NicknameModal isOpen={showNicknameModal} onSave={saveNickname} />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-background flex items-center justify-center"
        >
          <div className="text-center text-muted-foreground">
            <p className="text-xl font-bold mb-2">Game Hidden</p>
            <p>Press Space to show</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;
