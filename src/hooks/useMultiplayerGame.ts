import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Rarity, rarityOrder } from "@/data/gameData";

export type GameMode = "classic" | "steal_and_get" | "block_buster" | "fishing" | "platform_run" | "flappy_bird";

const VALID_MODES: string[] = ["classic", "steal_and_get", "block_buster", "fishing", "platform_run", "flappy_bird"];

export interface GameRoom {
  id: string;
  pin_code: string;
  host_nickname: string;
  target_rarity: Rarity;
  game_mode: GameMode;
  time_limit_minutes: number;
  status: "waiting" | "playing" | "finished";
  winner_nickname: string | null;
  winning_item: string | null;
  started_at: string | null;
  ends_at: string | null;
}

export interface GamePlayer {
  id: string;
  room_id: string;
  nickname: string;
  is_host: boolean;
  current_item: string | null;
  current_rarity: string | null;
}

function generatePinCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Normalizes a raw DB row into a GameRoom.
 * Handles two scenarios:
 *   1. game_mode column EXISTS in DB → use it directly
 *   2. game_mode column MISSING → parse from target_rarity (e.g. "steal_and_get:Rare")
 */
function normalizeRoom(raw: Record<string, any>): GameRoom {
  let gameMode: GameMode = "classic";
  let targetRarity: string = raw.target_rarity ?? "Rare";

  // If DB has game_mode column and it's a valid mode, use it
  if (raw.game_mode && VALID_MODES.includes(raw.game_mode)) {
    gameMode = raw.game_mode as GameMode;
  } else if (targetRarity.includes(":")) {
    // Fallback: parse game mode encoded in target_rarity ("steal_and_get:Rare")
    const colonIdx = targetRarity.indexOf(":");
    const parsedMode = targetRarity.substring(0, colonIdx);
    if (VALID_MODES.includes(parsedMode)) {
      gameMode = parsedMode as GameMode;
      targetRarity = targetRarity.substring(colonIdx + 1);
    }
  }

  return {
    id: raw.id,
    pin_code: raw.pin_code,
    host_nickname: raw.host_nickname,
    target_rarity: targetRarity as Rarity,
    game_mode: gameMode,
    time_limit_minutes: raw.time_limit_minutes,
    status: raw.status,
    winner_nickname: raw.winner_nickname ?? null,
    winning_item: raw.winning_item ?? null,
    started_at: raw.started_at ?? null,
    ends_at: raw.ends_at ?? null,
  };
}

export function useMultiplayerGame() {
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [players, setPlayers] = useState<GamePlayer[]>([]);
  const [myPlayer, setMyPlayer] = useState<GamePlayer | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate unique pin code
  const createRoom = useCallback(async (
    hostNickname: string,
    targetRarity: Rarity,
    timeLimitMinutes: number,
    gameMode: GameMode = "classic"
  ) => {
    setError(null);
    const pinCode = generatePinCode();

    try {
      let room: Record<string, any> | null = null;

      // Attempt 1: try with game_mode column (works if migration was applied)
      const { data: d1, error: e1 } = await supabase
        .from("game_rooms")
        .insert({
          pin_code: pinCode,
          host_nickname: hostNickname,
          target_rarity: targetRarity,
          time_limit_minutes: timeLimitMinutes,
          game_mode: gameMode,
        } as any)
        .select()
        .single();

      if (e1 && (e1.code === "42703" || e1.message?.includes("game_mode"))) {
        // Attempt 2: game_mode column doesn't exist — encode mode into target_rarity
        const encodedRarity = gameMode === "classic"
          ? targetRarity
          : `${gameMode}:${targetRarity}`;

        const { data: d2, error: e2 } = await supabase
          .from("game_rooms")
          .insert({
            pin_code: pinCode,
            host_nickname: hostNickname,
            target_rarity: encodedRarity,
            time_limit_minutes: timeLimitMinutes,
          })
          .select()
          .single();

        if (e2) throw e2;
        room = d2;
      } else if (e1) {
        throw e1;
      } else {
        room = d1;
      }

      const normalizedRoom = normalizeRoom(room!);

      // Add host as player
      const { data: player, error: playerError } = await supabase
        .from("game_players")
        .insert({
          room_id: normalizedRoom.id,
          nickname: hostNickname,
          is_host: true,
        })
        .select()
        .single();

      if (playerError) throw playerError;

      setCurrentRoom(normalizedRoom);
      setMyPlayer(player as GamePlayer);
      setIsHost(true);
      setPlayers([player as GamePlayer]);

      return { success: true, pinCode };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  // Join existing room
  const joinRoom = useCallback(async (pinCode: string, nickname: string) => {
    setError(null);

    try {
      // Find room
      const { data: room, error: roomError } = await supabase
        .from("game_rooms")
        .select()
        .eq("pin_code", pinCode)
        .eq("status", "waiting")
        .single();

      if (roomError) throw new Error("Room not found or game already started");

      const normalizedRoom = normalizeRoom(room);

      // Check if nickname is taken
      const { data: existingPlayer } = await supabase
        .from("game_players")
        .select()
        .eq("room_id", normalizedRoom.id)
        .eq("nickname", nickname)
        .single();

      if (existingPlayer) throw new Error("Nickname already taken in this room");

      // Join room
      const { data: player, error: playerError } = await supabase
        .from("game_players")
        .insert({
          room_id: normalizedRoom.id,
          nickname: nickname,
          is_host: false,
        })
        .select()
        .single();

      if (playerError) throw playerError;

      setCurrentRoom(normalizedRoom);
      setMyPlayer(player as GamePlayer);
      setIsHost(false);

      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  // Start game (host only)
  const startGame = useCallback(async () => {
    if (!currentRoom || !isHost) return;

    const now = new Date();
    const endsAt = new Date(now.getTime() + currentRoom.time_limit_minutes * 60 * 1000);

    try {
      const { error } = await supabase
        .from("game_rooms")
        .update({
          status: "playing",
          started_at: now.toISOString(),
          ends_at: endsAt.toISOString(),
        })
        .eq("id", currentRoom.id);

      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  }, [currentRoom, isHost]);

  // Report item obtained
  const reportItem = useCallback(async (itemName: string, rarity: Rarity) => {
    if (!currentRoom || !myPlayer || currentRoom.status !== "playing") return;

    try {
      // Update player's current item
      await supabase
        .from("game_players")
        .update({
          current_item: itemName,
          current_rarity: rarity,
        })
        .eq("id", myPlayer.id);

      // Only check for winner in classic mode — Exotic rarity never counts
      if (currentRoom.game_mode === "classic" && rarity !== "Exotic") {
        const targetIndex = rarityOrder.indexOf(currentRoom.target_rarity);
        const obtainedIndex = rarityOrder.indexOf(rarity);

        if (obtainedIndex >= targetIndex && !currentRoom.winner_nickname) {
          // This player wins!
          await supabase
            .from("game_rooms")
            .update({
              winner_nickname: myPlayer.nickname,
              winning_item: itemName,
            })
            .eq("id", currentRoom.id)
            .is("winner_nickname", null); // Only update if no winner yet
        }
      }
    } catch (err: any) {
      console.error("Error reporting item:", err);
    }
  }, [currentRoom, myPlayer]);

  // Report score for non-classic modes (updates current_item to count display, current_rarity to numeric string for sorting)
  const reportScore = useCallback(async (itemCount: number) => {
    if (!currentRoom || !myPlayer || currentRoom.status !== "playing") return;
    try {
      await supabase
        .from("game_players")
        .update({
          current_item: `${itemCount} items`,
          current_rarity: String(itemCount),
        })
        .eq("id", myPlayer.id);
    } catch (err: any) {
      console.error("Error reporting score:", err);
    }
  }, [currentRoom, myPlayer]);

  // Leave room
  const leaveRoom = useCallback(async () => {
    if (myPlayer) {
      await supabase
        .from("game_players")
        .delete()
        .eq("id", myPlayer.id);
    }
    
    setCurrentRoom(null);
    setMyPlayer(null);
    setIsHost(false);
    setPlayers([]);
    setTimeRemaining(null);
  }, [myPlayer]);

  // End game (for timer expiry)
  const endGame = useCallback(async () => {
    if (!currentRoom || currentRoom.status === "finished") return;

    try {
      // For non-classic modes, determine the winner by highest score before finishing
      let winnerNickname: string | null = null;
      if (currentRoom.game_mode !== "classic") {
        const { data: finalPlayers } = await supabase
          .from("game_players")
          .select("nickname, current_rarity")
          .eq("room_id", currentRoom.id);

        if (finalPlayers && finalPlayers.length > 0) {
          const sorted = [...finalPlayers].sort((a, b) => {
            const aScore = a.current_rarity ? parseInt(a.current_rarity, 10) || 0 : 0;
            const bScore = b.current_rarity ? parseInt(b.current_rarity, 10) || 0 : 0;
            return bScore - aScore;
          });
          // Only set a winner if they have a score > 0
          if (sorted[0].current_rarity && parseInt(sorted[0].current_rarity, 10) > 0) {
            winnerNickname = sorted[0].nickname;
          }
        }
      }

      await supabase
        .from("game_rooms")
        .update({
          status: "finished",
          ...(winnerNickname ? { winner_nickname: winnerNickname } : {}),
        })
        .eq("id", currentRoom.id);
    } catch (err: any) {
      console.error("Error ending game:", err);
    }
  }, [currentRoom]);

  // Subscribe to room updates
  useEffect(() => {
    if (!currentRoom) return;

    const roomChannel = supabase
      .channel(`room-${currentRoom.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "game_rooms",
          filter: `id=eq.${currentRoom.id}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setCurrentRoom(normalizeRoom(payload.new as Record<string, any>));
          }
        }
      )
      .subscribe();

    const playersChannel = supabase
      .channel(`players-${currentRoom.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "game_players",
          filter: `room_id=eq.${currentRoom.id}`,
        },
        async () => {
          // Refetch all players when changes occur
          const { data } = await supabase
            .from("game_players")
            .select()
            .eq("room_id", currentRoom.id);
          if (data) setPlayers(data as GamePlayer[]);
        }
      )
      .subscribe();

    // Initial fetch of players
    supabase
      .from("game_players")
      .select()
      .eq("room_id", currentRoom.id)
      .then(({ data }) => {
        if (data) setPlayers(data as GamePlayer[]);
      });

    return () => {
      supabase.removeChannel(roomChannel);
      supabase.removeChannel(playersChannel);
    };
  }, [currentRoom?.id]);

  // Timer countdown
  useEffect(() => {
    if (!currentRoom?.ends_at || currentRoom.status !== "playing") {
      setTimeRemaining(null);
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(currentRoom.ends_at!).getTime();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      setTimeRemaining(remaining);

      if (remaining <= 0 && currentRoom.status === "playing") {
        endGame();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [currentRoom?.ends_at, currentRoom?.status, endGame]);

  return {
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
    endGame,
  };
}
