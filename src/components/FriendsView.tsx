import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { UserPlus, ArrowLeftRight, UserMinus, Circle, Search } from "lucide-react";
import { Friend } from "@/hooks/useFriends";
import { supabase } from "@/integrations/supabase/client";

interface OnlinePlayer {
  nickname: string;
  online_at: string;
}

interface FriendsViewProps {
  friends: Friend[];
  nickname: string | null;
  onSendRequest: (query: string) => Promise<{ success: boolean; error?: string; targetName?: string }>;
  onRemoveFriend: (friendshipId: string) => void;
  onRequestTrade: (targetNickname: string) => void;
  checkPlayerOnline: (nickname: string) => boolean;
  onlinePlayers?: OnlinePlayer[];
}

export function FriendsView({
  friends,
  nickname,
  onSendRequest,
  onRemoveFriend,
  onRequestTrade,
  checkPlayerOnline,
  onlinePlayers = [],
}: FriendsViewProps) {
  const [searchInput, setSearchInput] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const friendNicknames = friends.map((f) => f.nickname);

  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      // Local-first: filter online players
      const localMatches = onlinePlayers
        .map((p) => p.nickname)
        .filter(
          (n) =>
            n.toLowerCase().includes(query.toLowerCase()) &&
            n !== nickname &&
            !friendNicknames.includes(n)
        );

      // Also query Supabase for offline players
      const { data } = await supabase
        .from("player_profiles")
        .select("nickname")
        .ilike("nickname", `%${query}%`)
        .limit(10);

      const dbMatches = (data || [])
        .map((p) => p.nickname)
        .filter(
          (n) =>
            n !== nickname &&
            !friendNicknames.includes(n) &&
            !localMatches.includes(n)
        );

      const combined = [...localMatches, ...dbMatches].slice(0, 5);
      setSuggestions(combined);
      setShowSuggestions(combined.length > 0);
    },
    [nickname, friendNicknames, onlinePlayers]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (searchInput.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(searchInput.trim());
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput, fetchSuggestions]);

  // Close suggestions on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSendRequest = async (nameOverride?: string) => {
    const target = nameOverride || searchInput.trim();
    if (!target) return;
    setLoading(true);
    setFeedback(null);
    setShowSuggestions(false);
    const result = await onSendRequest(target);
    setLoading(false);
    if (result.success) {
      setFeedback({ type: "success", text: `Friend request sent to ${result.targetName || target}!` });
      setSearchInput("");
    } else {
      setFeedback({ type: "error", text: result.error || "Failed to send request" });
    }
  };

  const handleSelectSuggestion = (name: string) => {
    setSearchInput(name);
    setShowSuggestions(false);
    handleSendRequest(name);
  };

  // Sort: online friends first
  const sortedFriends = [...friends].sort((a, b) => {
    const aOnline = checkPlayerOnline(a.nickname) ? 0 : 1;
    const bOnline = checkPlayerOnline(b.nickname) ? 0 : 1;
    return aOnline - bOnline;
  });

  return (
    <div className="h-full overflow-y-auto p-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl font-bold mb-4 text-foreground"
      >
        Friends
      </motion.h2>

      {/* Add Friend Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="gradient-card rounded-xl p-4 mb-6"
      >
        <h3 className="text-sm font-semibold text-foreground/80 mb-3 flex items-center gap-2">
          <UserPlus size={16} />
          Add Friend
        </h3>
        <div className="flex gap-2">
          <div className="relative flex-1" ref={inputRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendRequest();
              }}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              placeholder="Type username or ID number"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-black/40 border border-white/10 text-foreground text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-black/95 border border-white/15 rounded-lg overflow-hidden z-50 shadow-xl">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSelectSuggestion(s)}
                    className="w-full px-3 py-2.5 text-left text-sm text-foreground hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <Circle
                      size={8}
                      className={
                        checkPlayerOnline(s)
                          ? "text-green-400 fill-green-400"
                          : "text-gray-500 fill-gray-500"
                      }
                    />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSendRequest()}
            disabled={loading || !searchInput.trim()}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "..." : "Send"}
          </motion.button>
        </div>
        {feedback && (
          <p className={`text-xs mt-2 ${feedback.type === "success" ? "text-green-400" : "text-red-400"}`}>
            {feedback.text}
          </p>
        )}
      </motion.div>

      {/* Friends List */}
      {sortedFriends.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center py-12 text-muted-foreground"
        >
          <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-semibold mb-1">No friends yet</p>
          <p className="text-sm">Add friends by typing their username or ID above!</p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {sortedFriends.map((friend, index) => {
            const isOnline = checkPlayerOnline(friend.nickname);
            return (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="gradient-card rounded-xl p-3 flex items-center gap-3"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Circle
                    size={10}
                    className={isOnline ? "text-green-400 fill-green-400" : "text-gray-500 fill-gray-500"}
                  />
                  <span className="font-bold text-foreground truncate">{friend.nickname}</span>
                  <span className={`text-xs font-semibold ${isOnline ? "text-green-400" : "text-gray-500"}`}>
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {isOnline && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onRequestTrade(friend.nickname)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
                    >
                      <ArrowLeftRight size={14} />
                      Trade
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onRemoveFriend(friend.id)}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-400 text-xs font-bold transition-colors"
                  >
                    <UserMinus size={14} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
