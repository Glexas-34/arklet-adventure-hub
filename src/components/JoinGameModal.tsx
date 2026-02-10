import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, LogIn, RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { GameMode } from "@/hooks/useMultiplayerGame";

const GAME_MODE_LABELS: Record<string, string> = {
  classic: "Classic Opening",
  steal_and_get: "Steal & Get",
  block_buster: "Block Buster",
  fishing: "Fishing Reeling",
  platform_run: "Platform Run",
  flappy_bird: "Flappy Bird",
};

interface AvailableRoom {
  id: string;
  pin_code: string;
  host_nickname: string;
  game_mode: string;
  target_rarity: string;
  time_limit_minutes: number;
  player_count: number;
}

interface JoinGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  nickname: string | null;
  onJoin: (pinCode: string, nickname: string) => Promise<{ success: boolean; error?: string }>;
  error: string | null;
}

export function JoinGameModal({ isOpen, onClose, nickname, onJoin, error }: JoinGameModalProps) {
  const [pinCode, setPinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const fetchAvailableRooms = async () => {
    setLoadingRooms(true);
    try {
      // Fetch waiting rooms
      const { data: rooms, error: roomsError } = await supabase
        .from("game_rooms")
        .select("id, pin_code, host_nickname, game_mode, target_rarity, time_limit_minutes")
        .eq("status", "waiting")
        .order("created_at", { ascending: false });

      if (roomsError || !rooms) {
        setAvailableRooms([]);
        setLoadingRooms(false);
        return;
      }

      // Fetch player counts for each room
      const roomsWithCounts: AvailableRoom[] = await Promise.all(
        rooms.map(async (room: any) => {
          const { count } = await supabase
            .from("game_players")
            .select("*", { count: "exact", head: true })
            .eq("room_id", room.id);

          // Parse game mode from target_rarity if needed
          let gameMode = room.game_mode || "classic";
          if (!room.game_mode && room.target_rarity?.includes(":")) {
            gameMode = room.target_rarity.split(":")[0];
          }

          return {
            id: room.id,
            pin_code: room.pin_code,
            host_nickname: room.host_nickname,
            game_mode: gameMode,
            target_rarity: room.target_rarity,
            time_limit_minutes: room.time_limit_minutes,
            player_count: count ?? 0,
          };
        })
      );

      setAvailableRooms(roomsWithCounts);
    } catch {
      setAvailableRooms([]);
    }
    setLoadingRooms(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchAvailableRooms();
    } else {
      setAvailableRooms([]);
      setPinCode("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleJoin = async (pin?: string) => {
    const code = pin || pinCode;
    if (!code.trim() || !nickname) return;
    setIsJoining(true);
    const result = await onJoin(code.trim(), nickname);
    setIsJoining(false);
    if (result.success) {
      onClose();
    }
  };

  const handleRoomClick = (room: AvailableRoom) => {
    setPinCode(room.pin_code);
    handleJoin(room.pin_code);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30
                   rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Join Game</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Manual PIN entry */}
          <div>
            <label htmlFor="pinCode" className="text-sm font-medium">Enter PIN Code</label>
            <div className="flex gap-2 mt-1">
              <Input
                id="pinCode"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onKeyDown={(e) => { if (e.key === "Enter") handleJoin(); }}
                placeholder="6-digit PIN"
                className="text-center text-2xl font-mono tracking-widest"
                maxLength={6}
              />
              <Button
                onClick={() => handleJoin()}
                disabled={pinCode.length !== 6 || !nickname || isJoining}
                className="gradient-button px-4"
              >
                <LogIn size={18} />
              </Button>
            </div>
          </div>

          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}

          {/* Available rooms section */}
          <div className="border-t border-primary/20 pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Or pick a room</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchAvailableRooms}
                disabled={loadingRooms}
                className="h-7 px-2"
              >
                <RefreshCw size={14} className={loadingRooms ? "animate-spin" : ""} />
              </Button>
            </div>

            {loadingRooms ? (
              <div className="text-center text-muted-foreground text-sm py-4">Loading rooms...</div>
            ) : availableRooms.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-4">
                No games waiting right now
              </div>
            ) : (
              <div className="space-y-2">
                {availableRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => handleRoomClick(room)}
                    disabled={isJoining}
                    className="w-full text-left p-3 rounded-xl border border-primary/20
                               bg-primary/5 hover:bg-primary/15 transition-colors
                               disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">
                          {room.host_nickname}'s game
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {GAME_MODE_LABELS[room.game_mode] || room.game_mode} · {room.time_limit_minutes}min
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-2 shrink-0">
                        <span className="text-xs font-mono bg-primary/20 px-2 py-0.5 rounded">
                          {room.pin_code}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users size={12} />
                          {room.player_count}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
