import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Star, Crown, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LeaderboardEntry {
  id: string;
  nickname: string;
  unique_count: number;
  wins: number;
}

interface LeaderboardViewProps {
  currentNickname: string | null;
}

export function LeaderboardView({ currentNickname }: LeaderboardViewProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("leaderboard-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "player_profiles",
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from("player_profiles")
        .select("id, nickname, unique_count, wins")
        .order("unique_count", { ascending: false })
        .limit(10);

      if (error) throw error;
      setLeaderboard(data as LeaderboardEntry[]);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-slate-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Star className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRankBg = (rank: number, isCurrentPlayer: boolean) => {
    if (isCurrentPlayer) {
      return "bg-gradient-to-r from-primary/30 to-primary/10 border-primary/50";
    }
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border-yellow-500/30";
      case 2:
        return "bg-gradient-to-r from-slate-400/20 to-slate-300/10 border-slate-400/30";
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-orange-500/10 border-amber-600/30";
      default:
        return "bg-black/30 border-foreground/10";
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-10 h-10 text-yellow-400" />
            <h1 className="text-4xl font-black text-foreground">Leaderboard</h1>
            <Trophy className="w-10 h-10 text-yellow-400" />
          </div>
          <p className="text-muted-foreground">Top 10 Collectors Worldwide</p>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-[60px_1fr_120px_120px] gap-4 px-4 py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          <div>Rank</div>
          <div>Player</div>
          <div className="text-center">Uniques</div>
          <div className="text-center">Wins</div>
        </div>

        {/* Leaderboard Entries */}
        <div className="space-y-2">
          {leaderboard.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No players yet. Be the first!</p>
            </div>
          ) : (
            leaderboard.map((entry, index) => {
              const rank = index + 1;
              const isCurrentPlayer = entry.nickname === currentNickname;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`grid grid-cols-[60px_1fr_120px_120px] gap-4 items-center 
                             rounded-xl px-4 py-4 border transition-all
                             ${getRankBg(rank, isCurrentPlayer)}
                             ${isCurrentPlayer ? "ring-2 ring-primary/50" : ""}`}
                >
                  {/* Rank */}
                  <div className="flex items-center gap-2">
                    {getRankIcon(rank)}
                    <span className={`font-bold text-lg ${rank <= 3 ? "text-foreground" : "text-muted-foreground"}`}>
                      #{rank}
                    </span>
                  </div>

                  {/* Nickname */}
                  <div className="font-bold text-foreground truncate flex items-center gap-2">
                    {entry.nickname}
                    {isCurrentPlayer && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                  </div>

                  {/* Uniques */}
                  <div className="text-center">
                    <div className="font-black text-xl text-foreground">{entry.unique_count}</div>
                    <div className="text-xs text-muted-foreground">Uniques</div>
                  </div>

                  {/* Wins */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Trophy className="w-4 h-4 text-muted-foreground" />
                      <span className="font-bold text-foreground">{entry.wins}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Wins</div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
