import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameHeader } from "@/components/GameHeader";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { PacksView } from "@/components/PacksView";
import { InventoryView } from "@/components/InventoryView";
import { IndexView } from "@/components/IndexView";
import { LeaderboardView } from "@/components/LeaderboardView";
import { TradeView } from "@/components/TradeView";
import { TradeRequestModal } from "@/components/TradeRequestModal";
import { ChatView } from "@/components/ChatView";

import { Confetti } from "@/components/Confetti";
import { HostGameModal } from "@/components/HostGameModal";
import { JoinGameModal } from "@/components/JoinGameModal";
import { GameOverlay } from "@/components/GameOverlay";
import { NicknameModal } from "@/components/NicknameModal";
import { useInventory } from "@/hooks/useInventory";
import { useMultiplayerGame, GameMode } from "@/hooks/useMultiplayerGame";
import { usePlayerProfile } from "@/hooks/usePlayerProfile";
import { useTrading } from "@/hooks/useTrading";
import { useOnlinePresence } from "@/hooks/useOnlinePresence";
import { Rarity } from "@/data/gameData";
import { trackPageView, trackEvent } from "@/lib/analytics";
import { PRIVILEGED_USERS } from "@/hooks/useInventory";
import { StealAndGetView } from "@/components/multiplayer/StealAndGetView";
import { BlockBusterView } from "@/components/multiplayer/BlockBusterView";
import { FishingReelingView } from "@/components/multiplayer/FishingReelingView";

type View = "packs" | "inventory" | "index" | "leaderboard" | "trade" | "chat";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("packs");
  const [isVisible, setIsVisible] = useState(true);
  const [showHostModal, setShowHostModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [gamePinCode, setGamePinCode] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiIntensity, setConfettiIntensity] = useState<"normal" | "mystical">("normal");

  const { inventory, addItem, getTotalItems, getUniqueCount, clearInventory, updateItemCount, grantAllBlooks } = useInventory();
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
    profile,
    showNicknameModal,
    saveNickname,
    changeNickname,
    updateUniqueCount,
    incrementWins,
  } = usePlayerProfile();

  const {
    activeSession,
    incomingRequest,
    myOffers,
    theirOffers,
    tradeAccepted,
    tradeCompleted,
    initiateTradeRequest,
    acceptTradeRequest,
    declineTradeRequest,
    addItemToOffer,
    removeItemFromOffer,
    acceptTrade,
    declineTrade,
    cancelTrade,
    completeTrade,
    resetTradeState,
    getPartnerNickname,
  } = useTrading(nickname);

  const { isPlayerOnline } = useOnlinePresence(nickname);

  const isInGame = currentRoom !== null && currentRoom.status === "playing";
  const isTrading = activeSession?.status === "trading";
  const waitingForTradeResponse = activeSession?.status === "pending";
  const partnerNickname = getPartnerNickname();

  // Check if partner has accepted
  const partnerAccepted = activeSession
    ? activeSession.requester_nickname === nickname
      ? activeSession.target_accepted
      : activeSession.requester_accepted
    : false;

  // Complete trade when both accept
  useEffect(() => {
    if (activeSession?.requester_accepted && activeSession?.target_accepted && !tradeCompleted) {
      completeTrade();
    }
  }, [activeSession?.requester_accepted, activeSession?.target_accepted, tradeCompleted, completeTrade]);

  // Handle trade completion - transfer items
  useEffect(() => {
    if (tradeCompleted && activeSession) {
      trackEvent("trade_completed", { items_given: myOffers.length, items_received: theirOffers.length });
      // Remove items I offered
      myOffers.forEach((offer) => {
        if (inventory[offer.item_name]) {
          updateItemCount(offer.item_name, -offer.quantity);
        }
      });

      // Add items I received
      theirOffers.forEach((offer) => {
        for (let i = 0; i < offer.quantity; i++) {
          addItem(offer.item_name, offer.item_rarity as Rarity);
        }
      });

      // Reset trade state and go back to inventory
      resetTradeState();
      setCurrentView("inventory");
    }
  }, [tradeCompleted]);

  // Switch to trade view when trade starts
  useEffect(() => {
    if (isTrading && currentView !== "trade") {
      setCurrentView("trade");
    }
  }, [isTrading, currentView]);

  // Grant all blooks to privileged users
  useEffect(() => {
    if (nickname && PRIVILEGED_USERS.includes(nickname)) {
      grantAllBlooks();
    }
  }, [nickname, grantAllBlooks]);

  // Track view changes
  useEffect(() => {
    trackPageView(currentView);
  }, [currentView]);

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

  // When game starts, switch to packs view (classic only; other modes render inline)
  useEffect(() => {
    if (currentRoom?.status === "playing") {
      if (currentRoom.game_mode === "classic") {
        setCurrentView("packs");
      }
      setShowHostModal(false);
      setShowJoinModal(false);
    }
  }, [currentRoom?.status, currentRoom?.game_mode]);

  // Sync unique count to profile when it changes (skip admin)
  useEffect(() => {
    const uniqueCount = getUniqueCount();
    if (nickname && !PRIVILEGED_USERS.includes(nickname) && uniqueCount > 0) {
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
    trackEvent("item_obtained", { item_name: name, rarity });
    // Report to multiplayer if in game
    if (currentRoom?.status === "playing") {
      reportItem(name, rarity);
    }
  };

  const handleRareReveal = useCallback((rarity: Rarity) => {
    if (["Legendary", "Mythic", "Secret", "Ultra Secret", "Mystical"].includes(rarity)) {
      setConfettiIntensity(rarity === "Mystical" ? "mystical" : "normal");
      setShowConfetti(true);
    }
  }, []);

  const handleCreateRoom = async (nickname: string, targetRarity: Rarity, timeLimit: number, gameMode: GameMode) => {
    const result = await createRoom(nickname, targetRarity, timeLimit, gameMode);
    if (result.success && result.pinCode) {
      setGamePinCode(result.pinCode);
      trackEvent("game_created", { game_mode: gameMode, target_rarity: targetRarity, time_limit: timeLimit });
    }
    return result;
  };

  const handleJoinRoom = async (pinCode: string, nickname: string) => {
    const result = await joinRoom(pinCode, nickname);
    if (result.success) {
      setShowJoinModal(false);
      trackEvent("game_joined");
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
          className="min-h-screen bg-background flex flex-col animated-bg"
        >
          <GameHeader nickname={nickname} userNumber={profile?.user_number} onChangeNickname={changeNickname} />

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
              onStartTrade={() => setCurrentView("trade")}
            />

            <motion.main
              key={currentView + (isInGame && currentRoom?.game_mode !== "classic" ? `-${currentRoom?.game_mode}` : "")}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`flex-1 overflow-hidden pb-16 md:pb-0 ${currentRoom?.status === "playing" ? "pt-28" : ""}`}
            >
              {/* Non-classic game mode views (take over main area) */}
              {isInGame && currentRoom?.game_mode === "steal_and_get" ? (
                <StealAndGetView
                  roomId={currentRoom.id}
                  players={players}
                  myPlayer={myPlayer}
                  timeRemaining={timeRemaining}
                  onItemObtained={handleItemObtained}
                />
              ) : isInGame && currentRoom?.game_mode === "block_buster" ? (
                <BlockBusterView
                  timeRemaining={timeRemaining}
                  onItemObtained={handleItemObtained}
                />
              ) : isInGame && currentRoom?.game_mode === "fishing" ? (
                <FishingReelingView
                  timeRemaining={timeRemaining}
                  onItemObtained={handleItemObtained}
                />
              ) : (
                <>
                  {currentView === "packs" && (
                    <PacksView
                      onItemObtained={handleItemObtained}
                      onRareReveal={handleRareReveal}
                    />
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
                  {currentView === "trade" && (
                    <TradeView
                      inventory={inventory}
                      nickname={nickname}
                      partnerNickname={partnerNickname}
                      isTrading={isTrading}
                      myOffers={myOffers}
                      theirOffers={theirOffers}
                      tradeAccepted={tradeAccepted}
                      partnerAccepted={partnerAccepted}
                      onInitiateTrade={initiateTradeRequest}
                      onAddItem={addItemToOffer}
                      onRemoveItem={removeItemFromOffer}
                      onAcceptTrade={acceptTrade}
                      onDeclineTrade={declineTrade}
                      onCancelTrade={cancelTrade}
                      checkPlayerOnline={isPlayerOnline}
                      waitingForResponse={waitingForTradeResponse}
                    />
                  )}
                  {currentView === "chat" && (
                    <ChatView nickname={nickname} />
                  )}
                </>
              )}
            </motion.main>
          </div>

          {/* Mobile bottom navigation */}
          <MobileNav currentView={currentView} onViewChange={setCurrentView} />

          {/* Confetti overlay */}
          <Confetti trigger={showConfetti} intensity={confettiIntensity} onComplete={() => setShowConfetti(false)} />

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

          {/* Trade Request Modal */}
          <TradeRequestModal
            isOpen={!!incomingRequest}
            requesterNickname={incomingRequest?.requester_nickname || ""}
            onAccept={acceptTradeRequest}
            onDecline={declineTradeRequest}
          />
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
