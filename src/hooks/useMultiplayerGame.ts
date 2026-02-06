import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Rarity, rarityOrder } from "@/data/gameData";

export type GameMode = "classic" | "steal_and_get" | "block_buster" | "fishing";

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
      // Create room
      const { data: room, error: roomError } = await supabase
        .from("game_rooms")
        .insert({
          pin_code: pinCode,
          host_nickname: hostNickname,
          target_rarity: targetRarity,
          time_limit_minutes: timeLimitMinutes,
          game_mode: gameMode,
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // Add host as player
      const { data: player, error: playerError } = await supabase
        .from("game_players")
        .insert({
          room_id: room.id,
          nickname: hostNickname,
          is_host: true,
        })
        .select()
        .single();

      if (playerError) throw playerError;

      setCurrentRoom(room as GameRoom);
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

      // Check if nickname is taken
      const { data: existingPlayer } = await supabase
        .from("game_players")
        .select()
        .eq("room_id", room.id)
        .eq("nickname", nickname)
        .single();

      if (existingPlayer) throw new Error("Nickname already taken in this room");

      // Join room
      const { data: player, error: playerError } = await supabase
        .from("game_players")
        .insert({
          room_id: room.id,
          nickname: nickname,
          is_host: false,
        })
        .select()
        .single();

      if (playerError) throw playerError;

      setCurrentRoom(room as GameRoom);
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

      // Only check for winner in classic mode
      if (currentRoom.game_mode === "classic") {
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
      await supabase
        .from("game_rooms")
        .update({ status: "finished" })
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
            setCurrentRoom(payload.new as GameRoom);
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
    leaveRoom,
    endGame,
  };
}
