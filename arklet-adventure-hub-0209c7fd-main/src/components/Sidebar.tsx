import { motion } from "framer-motion";
import { Package, Backpack, BookOpen, Trash2, Users, LogIn, Trophy } from "lucide-react";

type View = "packs" | "inventory" | "index" | "leaderboard";

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  totalItems: number;
  uniqueItems: number;
  onClearInventory: () => void;
  onHostGame: () => void;
  onJoinGame: () => void;
  isInGame: boolean;
}

const navItems = [
  { id: "packs" as const, label: "Open Packs", icon: Package },
  { id: "inventory" as const, label: "Inventory", icon: Backpack },
  { id: "index" as const, label: "Index", icon: BookOpen },
  { id: "leaderboard" as const, label: "Leaderboard", icon: Trophy },
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
}: SidebarProps) {
  return (
    <div className="gradient-sidebar w-56 flex-shrink-0 p-4 flex flex-col gap-3">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        
        return (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
      
      <div className="mt-auto space-y-4">
        <div className="pt-4 border-t border-foreground/20">
          <div className="text-sm text-foreground/80 space-y-1">
            <p>Total: <span className="font-bold text-foreground">{totalItems}</span></p>
            <p>Unique: <span className="font-bold text-foreground">{uniqueItems}</span></p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
      </div>
    </div>
  );
}
