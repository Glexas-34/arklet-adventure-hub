import { motion } from "framer-motion";
import type { ArcadeProgress } from "./games/types";

interface ArcadePlayerTickerProps {
  players: ArcadeProgress[];
}

export function ArcadePlayerTicker({ players }: ArcadePlayerTickerProps) {
  if (players.length === 0) return null;

  return (
    <div className="bg-black/40 backdrop-blur rounded-xl p-3 mb-4">
      <p className="text-xs text-muted-foreground font-bold uppercase mb-2 tracking-wider">
        🎮 Live Players
      </p>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {players.map((p, i) => (
          <motion.div
            key={`${p.nickname}-${i}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex-shrink-0 rounded-lg px-3 py-2 text-sm font-bold ${
              p.status === "playing"
                ? "bg-green-600/30 border border-green-500/40"
                : "bg-blue-600/30 border border-blue-500/40"
            }`}
          >
            <span className="text-foreground">{p.nickname}</span>
            <span className="text-muted-foreground ml-2">
              {p.gameName} — {p.score}pts
            </span>
            {p.status === "playing" && (
              <span className="ml-1 inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
