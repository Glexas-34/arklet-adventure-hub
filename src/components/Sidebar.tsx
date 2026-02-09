import { motion } from "framer-motion";
import { Package, Backpack, BookOpen, Trash2, Users, LogIn, Trophy, ArrowLeftRight, MessageSquare, UserPlus, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";

type View = "packs" | "inventory" | "index" | "leaderboard" | "trade" | "chat" | "friends" | "news";

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  totalItems: number;
  uniqueItems: number;
  onClearInventory: () => void;
  onHostGame: () => void;
  onJoinGame: () => void;
  isInGame: boolean;
  onStartTrade: () => void;
  onOpenFriends: () => void;
  friendRequestCount?: number;
}

const navItems = [
  { id: "packs" as const, label: "Open Packs", icon: Package },
  { id: "inventory" as const, label: "Your Inventory", icon: Backpack },
  { id: "index" as const, label: "Arks Available", icon: BookOpen },
  { id: "leaderboard" as const, label: "Leaderboard", icon: Trophy },
  { id: "chat" as const, label: "Chat", icon: MessageSquare },
  { id: "news" as const, label: "News", icon: Newspaper },
];

export function Sidebar({
  currentView,
  onViewChange,
  totalItems,
  uniqueItems,
  onClearInventory,
  onHostGame,
  onJoinGame,
  isInGame,
  onStartTrade,
  onOpenFriends,
  friendRequestCount = 0,
}: SidebarProps) {
  return (
    <div className="gradient-sidebar w-56 flex-shrink-0 p-4 hidden md:flex flex-col gap-3">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;

        return (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.04, x: 4 }}
            whileTap={{ scale: 0.92, rotate: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={() => onViewChange(item.id)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 font-bold transition-all
              ${isActive
                ? "gradient-button shadow-lg text-primary-foreground"
                : "bg-black/30 text-foreground/90 hover:bg-black/40"
              }`}
          >
            <Icon size={20} />
            {item.label}
          </motion.button>
        );
      })}

      {/* Multiplayer Section */}
      {!isInGame && (
        <div className="pt-3 border-t border-foreground/20 space-y-2">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider px-1">
            Multiplayer
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.92, rotate: -1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={onHostGame}
            className="flex items-center gap-3 rounded-xl px-4 py-3 font-bold w-full
                       bg-gradient-to-r from-green-600 to-emerald-600
                       hover:from-green-500 hover:to-emerald-500
                       text-white shadow-lg transition-all"
          >
            <Users size={20} />
            Host Game
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.92, rotate: -1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={onJoinGame}
            className="flex items-center gap-3 rounded-xl px-4 py-3 font-bold w-full
                       bg-gradient-to-r from-blue-600 to-indigo-600
                       hover:from-blue-500 hover:to-indigo-500
                       text-white shadow-lg transition-all"
          >
            <LogIn size={20} />
            Join Game
          </motion.button>
        </div>
      )}

       {/* Trade Section */}
       {!isInGame && (
         <div className="pt-3 border-t border-foreground/20 space-y-2">
           <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider px-1">
             Trading
           </p>
           <motion.button
             whileHover={{ scale: 1.04 }}
             whileTap={{ scale: 0.92, rotate: -1 }}
             transition={{ type: "spring", stiffness: 400, damping: 20 }}
             onClick={onStartTrade}
             className="flex items-center gap-3 rounded-xl px-4 py-3 font-bold w-full
                        bg-gradient-to-r from-purple-600 to-violet-600
                        hover:from-purple-500 hover:to-violet-500
                        text-white shadow-lg transition-all"
           >
             <ArrowLeftRight size={20} />
             Trade
           </motion.button>
           <motion.button
             whileHover={{ scale: 1.04 }}
             whileTap={{ scale: 0.92, rotate: -1 }}
             transition={{ type: "spring", stiffness: 400, damping: 20 }}
             onClick={onOpenFriends}
             className={`flex items-center gap-3 rounded-xl px-4 py-3 font-bold w-full
                        ${currentView === "friends"
                          ? "gradient-button shadow-lg text-primary-foreground"
                          : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg"
                        } transition-all relative`}
           >
             <UserPlus size={20} />
             Friends
             {friendRequestCount > 0 && (
               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                 {friendRequestCount}
               </span>
             )}
           </motion.button>
         </div>
       )}

      <div className="mt-auto space-y-4">
        <div className="pt-4 border-t border-foreground/20">
          <div className="text-sm text-foreground/80 space-y-1">
            <p>Total: <span className="font-bold text-foreground">{totalItems}</span></p>
            <p>Unique: <span className="font-bold text-foreground">{uniqueItems}</span></p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          onClick={onClearInventory}
          disabled={totalItems === 0}
          className="flex items-center justify-center gap-2 w-full rounded-xl px-4 py-2
                     bg-destructive/80 hover:bg-destructive text-destructive-foreground
                     font-semibold text-sm transition-colors disabled:opacity-50
                     disabled:cursor-not-allowed"
        >
          <Trash2 size={16} />
          Clear All
        </motion.button>

        <Link
          to="/terms"
          className="block text-center text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors mt-2"
        >
          Terms of Service
        </Link>
      </div>
    </div>
  );
}
