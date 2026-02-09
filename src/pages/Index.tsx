import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
import { FriendsView } from "@/components/FriendsView";
import { NewsView } from "@/components/NewsView";
import { ShopView } from "@/components/ShopView";
import { FriendRequestModal } from "@/components/FriendRequestModal";

import { Confetti } from "@/components/Confetti";
import { HostGameModal } from "@/components/HostGameModal";
import { JoinGameModal } from "@/components/JoinGameModal";
import { GameOverlay } from "@/components/GameOverlay";
import { NicknameModal } from "@/components/NicknameModal";
import { BannedScreen } from "@/components/BannedScreen";
import { useBanCheck } from "@/hooks/useBanCheck";
import { useInventory } from "@/hooks/useInventory";
import { useMultiplayerGame, GameMode } from "@/hooks/useMultiplayerGame";
import { usePlayerProfile } from "@/hooks/usePlayerProfile";
import { useTrading } from "@/hooks/useTrading";
import { useOnlinePresence } from "@/hooks/useOnlinePresence";
import { useAdminGifts } from "@/hooks/useAdminGifts";
import { useFriends } from "@/hooks/useFriends";
import { useShop } from "@/hooks/useShop";
import { useAnnouncement } from "@/hooks/useAnnouncement";
import { Rarity, InventoryItem, BlookItem, packs } from "@/data/gameData";
import { getDailyPackName, dailyPacks } from "@/data/dailyPacks";
import { useSpawnedPacks } from "@/hooks/useSpawnedPacks";
import { ResultBar } from "@/components/ResultBar";
import { useSound, unlockAudio, triggerGameAlertSound } from "@/hooks/useSound";
import { trackPageView, trackEvent } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { PRIVILEGED_USERS } from "@/hooks/useInventory";
import { StealAndGetView } from "@/components/multiplayer/StealAndGetView";
import { BlockBusterView } from "@/components/multiplayer/BlockBusterView";
import { FishingReelingView } from "@/components/multiplayer/FishingReelingView";
import { PlatformRunView } from "@/components/multiplayer/PlatformRunView";
import { FlappyBirdView } from "@/components/multiplayer/FlappyBirdView";

type View = "packs" | "inventory" | "index" | "leaderboard" | "trade" | "chat" | "friends" | "news" | "shop";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("packs");
  const [isVisible, setIsVisible] = useState(true);
  const [showHostModal, setShowHostModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [gamePinCode, setGamePinCode] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiIntensity, setConfettiIntensity] = useState<"normal" | "mystical" | "celestial">("normal");
  const [simulatedItem, setSimulatedItem] = useState<BlookItem | null>(null);
  const [showSimulation, setShowSimulation] = useState(false);

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
    reportScore,
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

  const { onlinePlayers, isPlayerOnline } = useOnlinePresence(nickname);
  const { isBanned } = useBanCheck(nickname);
  const { adminItems } = useAdminGifts(nickname);
  const { spawnedPackNames } = useSpawnedPacks();
  const { friends, incomingRequests, sendRequestByIdOrName, acceptRequest, declineRequest, removeFriend } = useFriends(nickname);
  const { listings, listItem, buyItem, returnItem, isLoading: shopLoading } = useShop(nickname);
  const { announcement } = useAnnouncement();
  const { playReveal, playRareReveal, playEpicReveal, playMysticalReveal, playCelestialReveal, playDivineReveal } = useSound();

  // Daily packs: today's pack + admin-spawned packs + all original (non-daily) packs
  const availablePackNames = useMemo(() => {
    const today = getDailyPackName(new Date());
    const spawned = spawnedPackNames.filter((n) => n !== today);
    const originalPacks = Object.keys(packs).filter((n) => !(n in dailyPacks));
    return [today, ...spawned, ...originalPacks];
  }, [spawnedPackNames]);

  // Combined unique count: inventory items + admin-gifted items not already in inventory
  const combinedUniqueCount = useCallback(() => {
    const invCount = getUniqueCount();
    const adminExtra = adminItems.filter((ai) => !inventory[ai.name]).length;
    return invCount + adminExtra;
  }, [getUniqueCount, adminItems, inventory]);

  // Combined inventory for trading: admin-gifted items first, then regular inventory
  const tradeInventory = useMemo(() => {
    const combined: Record<string, InventoryItem> = {};
    // Add admin items first so they appear at the top
    for (const item of adminItems) {
      combined[item.name] = { ...item };
    }
    // Merge regular inventory (add counts if overlap, append if new)
    for (const [name, item] of Object.entries(inventory)) {
      if (combined[name]) {
        combined[name] = { ...combined[name], count: combined[name].count + item.count };
      } else {
        combined[name] = { ...item };
      }
    }
    return combined;
  }, [inventory, adminItems]);

  // Refs for toast callbacks (avoids stale closures in channel listener)
  const joinRoomRef = useRef(joinRoom);
  joinRoomRef.current = joinRoom;
  const nicknameRef = useRef(nickname);
  nicknameRef.current = nickname;
  const processedTradeRef = useRef<string | null>(null);

  // Friend request modal: show the first pending incoming request
  const currentFriendRequest = incomingRequests.length > 0 ? incomingRequests[0] : null;

  const handleAcceptFriend = useCallback(() => {
    if (currentFriendRequest) acceptRequest(currentFriendRequest.id);
  }, [currentFriendRequest, acceptRequest]);

  const handleDeclineFriend = useCallback(() => {
    if (currentFriendRequest) declineRequest(currentFriendRequest.id);
  }, [currentFriendRequest, declineRequest]);

  // Trade from friends page: initiate trade and switch to trade view
  const handleFriendTrade = useCallback((targetNickname: string) => {
    initiateTradeRequest(targetNickname);
    setCurrentView("trade");
  }, [initiateTradeRequest]);

  const handleSellItem = useCallback(async (itemName: string, itemRarity: string) => {
    if (!nickname) return;
    updateItemCount(itemName, -1);
    await listItem(nickname, itemName, itemRarity);
  }, [nickname, updateItemCount, listItem]);

  const handleBuyItem = useCallback(async (listingId: string) => {
    const listing = await buyItem(listingId);
    if (listing) {
      addItem(listing.item_name, listing.item_rarity as Rarity);
    }
  }, [buyItem, addItem]);

  const handleReturnItem = useCallback(async (listingId: string) => {
    const listing = await returnItem(listingId);
    if (listing) {
      addItem(listing.item_name, listing.item_rarity as Rarity);
    }
  }, [returnItem, addItem]);

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

  // Complete trade when both accept — both players call completeTrade for reliability
  // (counter increment is guarded inside completeTrade, item transfer guarded by processedTradeRef)
  useEffect(() => {
    if (activeSession?.requester_accepted && activeSession?.target_accepted && !tradeCompleted) {
      completeTrade();
    }
  }, [activeSession?.requester_accepted, activeSession?.target_accepted, tradeCompleted, completeTrade]);

  // Handle trade completion - transfer items
  useEffect(() => {
    if (!tradeCompleted || !activeSession || processedTradeRef.current === activeSession.id) return;
    processedTradeRef.current = activeSession.id;

    trackEvent("trade_completed", { items_given: myOffers.length, items_received: theirOffers.length });

    // Remove items I offered
    for (const offer of myOffers) {
      updateItemCount(offer.item_name, -offer.quantity);
    }

    // Add items I received
    for (const offer of theirOffers) {
      for (let i = 0; i < offer.quantity; i++) {
        addItem(offer.item_name, offer.item_rarity as Rarity);
      }
    }

    // Reset trade state and go back to inventory
    resetTradeState();
    setCurrentView("inventory");
  }, [tradeCompleted]);

  // Reset processed trade ref when a new trade session starts
  useEffect(() => {
    if (activeSession) {
      processedTradeRef.current = null;
    }
  }, [activeSession?.id]);

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

  // Unlock audio on first user interaction (needed for iOS Safari)
  useEffect(() => {
    const handler = () => {
      unlockAudio();
      document.removeEventListener("touchstart", handler);
      document.removeEventListener("click", handler);
    };
    document.addEventListener("touchstart", handler, { once: true });
    document.addEventListener("click", handler, { once: true });
    return () => {
      document.removeEventListener("touchstart", handler);
      document.removeEventListener("click", handler);
    };
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

  // Sync unique count to profile when it changes (skip admin users)
  useEffect(() => {
    const uniqueCount = combinedUniqueCount();
    if (nickname && !PRIVILEGED_USERS.includes(nickname) && uniqueCount > 0) {
      updateUniqueCount(uniqueCount);
    }
  }, [combinedUniqueCount, nickname, updateUniqueCount]);

  // Increment wins when the player wins a game
  useEffect(() => {
    if (currentRoom?.status === "finished" && nickname && currentRoom.winner_nickname === nickname) {
      incrementWins();
    }
  }, [currentRoom?.status, nickname, currentRoom?.winner_nickname, incrementWins]);

  // Notify when someone hosts a game
  useEffect(() => {
    const channel = supabase
      .channel("game-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "game_rooms" },
        (payload) => {
          const room = payload.new as { host_nickname: string; game_mode: string; pin_code: string };
          // Don't notify yourself
          if (room.host_nickname === nickname) return;
          const modeLabel: Record<string, string> = {
            classic: "Classic Opening",
            steal_and_get: "Steal & Get",
            block_buster: "Block Buster",
            fishing: "Fishing Reeling",
            platform_run: "Platform Run",
            flappy_bird: "Flappy Bird",
          };
          const pin = room.pin_code;
          triggerGameAlertSound();
          toast({
            title: "🎮 New Game Hosted!",
            description: `${room.host_nickname} is hosting ${modeLabel[room.game_mode] || room.game_mode} — PIN: ${pin}`,
            variant: "game",
            action: nicknameRef.current ? (
              <ToastAction
                altText="Join game"
                onClick={() => {
                  if (nicknameRef.current) {
                    joinRoomRef.current(pin, nicknameRef.current);
                  }
                }}
                className="bg-green-500 hover:bg-green-400 text-white border-0 font-bold px-5 py-2 text-base rounded-lg"
              >
                Join Game
              </ToastAction>
            ) : undefined,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [nickname]);

  const handleClearInventory = () => {
    if (confirm("Are you sure you want to clear your inventory?")) {
      clearInventory();
    }
  };

  const handleItemObtained = (name: string, rarity: Rarity) => {
    addItem(name, rarity);
    trackEvent("item_obtained", { item_name: name, rarity });
    // Report to multiplayer if in classic game (non-classic modes use reportScore for standings)
    if (currentRoom?.status === "playing" && currentRoom?.game_mode === "classic") {
      reportItem(name, rarity);
    }
  };

  const handleScoreChange = useCallback((count: number) => {
    if (currentRoom?.status === "playing") {
      reportScore(count);
    }
  }, [currentRoom?.status, reportScore]);

  const handleRareReveal = useCallback((rarity: Rarity) => {
    if (["Legendary", "Mythic", "Secret", "Ultra Secret", "Mystical", "Celestial", "Divine"].includes(rarity)) {
      setConfettiIntensity(
        rarity === "Celestial" || rarity === "Divine" ? "celestial"
          : rarity === "Mystical" ? "mystical"
          : "normal"
      );
      setShowConfetti(true);
    }
  }, []);

  // Admin /pull simulation — shows animation + sounds but no inventory change
  const handleSimulatePull = useCallback((item: BlookItem) => {
    setSimulatedItem(item);
    setShowSimulation(true);

    const rarity = item.rarity;
    if (rarity === "Divine") playDivineReveal();
    else if (rarity === "Celestial") playCelestialReveal();
    else if (rarity === "Mystical") playMysticalReveal();
    else if (rarity === "Ultra Secret") playEpicReveal();
    else if (["Legendary", "Mythic", "Secret"].includes(rarity)) playRareReveal();
    else playReveal();

    handleRareReveal(rarity);
  }, [handleRareReveal, playReveal, playRareReveal, playEpicReveal, playMysticalReveal, playCelestialReveal, playDivineReveal]);

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
          {currentRoom && (currentRoom.status === "playing" || currentRoom.status === "finished") && (
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
              uniqueItems={combinedUniqueCount()}
              onClearInventory={handleClearInventory}
              onHostGame={() => setShowHostModal(true)}
              onJoinGame={() => setShowJoinModal(true)}
              isInGame={isInGame}
              onStartTrade={() => setCurrentView("trade")}
              onOpenFriends={() => setCurrentView("friends")}
              friendRequestCount={incomingRequests.length}
            />

            <motion.main
              key={currentView + (isInGame && currentRoom?.game_mode !== "classic" ? `-${currentRoom?.game_mode}` : "")}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`flex-1 overflow-hidden pb-24 md:pb-0 ${currentRoom?.status === "playing" ? "pt-28" : ""}`}
            >
              {/* Non-classic game mode views (take over main area) */}
              {isInGame && currentRoom?.game_mode === "steal_and_get" ? (
                <StealAndGetView
                  roomId={currentRoom.id}
                  players={players}
                  myPlayer={myPlayer}
                  timeRemaining={timeRemaining}
                  onItemObtained={handleItemObtained}
                  onScoreChange={handleScoreChange}
                />
              ) : isInGame && currentRoom?.game_mode === "block_buster" ? (
                <BlockBusterView
                  timeRemaining={timeRemaining}
                  onItemObtained={handleItemObtained}
                  onScoreChange={handleScoreChange}
                />
              ) : isInGame && currentRoom?.game_mode === "fishing" ? (
                <FishingReelingView
                  timeRemaining={timeRemaining}
                  onItemObtained={handleItemObtained}
                  onScoreChange={handleScoreChange}
                />
              ) : isInGame && currentRoom?.game_mode === "platform_run" ? (
                <PlatformRunView
                  timeRemaining={timeRemaining}
                  onItemObtained={handleItemObtained}
                  onScoreChange={handleScoreChange}
                />
              ) : isInGame && currentRoom?.game_mode === "flappy_bird" ? (
                <FlappyBirdView
                  timeRemaining={timeRemaining}
                  onItemObtained={handleItemObtained}
                  onScoreChange={handleScoreChange}
                />
              ) : (
                <>
                  {currentView === "packs" && (
                    <PacksView
                      onItemObtained={handleItemObtained}
                      onRareReveal={handleRareReveal}
                      availablePackNames={availablePackNames}
                      announcement={announcement}
                    />
                  )}
                  {currentView === "inventory" && (
                    <InventoryView inventory={inventory} adminItems={adminItems} />
                  )}
                  {currentView === "index" && (
                    <IndexView inventory={inventory} announcement={announcement} />
                  )}
                  {currentView === "leaderboard" && (
                    <LeaderboardView currentNickname={nickname} />
                  )}
                  {currentView === "trade" && (
                    <TradeView
                      inventory={tradeInventory}
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
                      onlinePlayers={onlinePlayers.filter((p) => p.nickname !== nickname)}
                      waitingForResponse={waitingForTradeResponse}
                    />
                  )}
                  {currentView === "chat" && (
                    <ChatView nickname={nickname} onSimulatePull={handleSimulatePull} />
                  )}
                  {currentView === "friends" && (
                    <FriendsView
                      friends={friends}
                      nickname={nickname}
                      onSendRequest={sendRequestByIdOrName}
                      onRemoveFriend={removeFriend}
                      onRequestTrade={handleFriendTrade}
                      checkPlayerOnline={isPlayerOnline}
                      onlinePlayers={onlinePlayers.filter((p) => p.nickname !== nickname)}
                    />
                  )}
                  {currentView === "news" && <NewsView />}
                  {currentView === "shop" && (
                    <ShopView
                      inventory={inventory}
                      listings={listings}
                      nickname={nickname}
                      isLoading={shopLoading}
                      onSell={handleSellItem}
                      onBuy={handleBuyItem}
                      onReturn={handleReturnItem}
                    />
                  )}
                </>
              )}
            </motion.main>
          </div>

          {/* Mobile bottom navigation */}
          <MobileNav
            currentView={currentView}
            onViewChange={setCurrentView}
            onHostGame={() => setShowHostModal(true)}
            onJoinGame={() => setShowJoinModal(true)}
            isInGame={isInGame}
            friendRequestCount={incomingRequests.length}
          />

          {/* Confetti overlay */}
          <Confetti trigger={showConfetti} intensity={confettiIntensity} onComplete={() => setShowConfetti(false)} />

          {/* Simulated pull result (admin /pull command) */}
          <ResultBar
            item={simulatedItem}
            isVisible={showSimulation}
            onClose={() => setShowSimulation(false)}
          />

          {/* Modals */}
          <HostGameModal
            isOpen={showHostModal}
            onClose={() => {
              if (currentRoom) {
                leaveRoom();
              }
              setShowHostModal(false);
              setGamePinCode(null);
            }}
            nickname={nickname}
            onCreateRoom={handleCreateRoom}
            onStartGame={startGame}
            pinCode={gamePinCode}
            players={players}
            error={error}
          />

          <JoinGameModal
            isOpen={showJoinModal}
            onClose={() => setShowJoinModal(false)}
            nickname={nickname}
            onJoin={handleJoinRoom}
            error={error}
          />

          {/* Nickname Modal */}
          <NicknameModal isOpen={showNicknameModal} onSave={saveNickname} />

          {/* Banned Screen */}
          <BannedScreen isVisible={isBanned} />

          {/* Trade Request Modal */}
          <TradeRequestModal
            isOpen={!!incomingRequest}
            requesterNickname={incomingRequest?.requester_nickname || ""}
            onAccept={acceptTradeRequest}
            onDecline={declineTradeRequest}
          />

          {/* Friend Request Modal */}
          <FriendRequestModal
            isOpen={!!currentFriendRequest}
            requesterNickname={currentFriendRequest?.nickname || ""}
            onAccept={handleAcceptFriend}
            onDecline={handleDeclineFriend}
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
