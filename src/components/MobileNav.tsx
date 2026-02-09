import { useState } from "react";
import { Package, Backpack, Trophy, MessageSquare, Gamepad2, Users, LogIn, X, ArrowLeftRight, UserPlus, Newspaper, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type View = "packs" | "inventory" | "index" | "leaderboard" | "trade" | "chat" | "friends" | "news" | "shop";

interface MobileNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onHostGame?: () => void;
  onJoinGame?: () => void;
  isInGame?: boolean;
  friendRequestCount?: number;
}

const tabs: { id: View; icon: typeof Package }[] = [
  { id: "packs", icon: Package },
  { id: "inventory", icon: Backpack },
  { id: "leaderboard", icon: Trophy },
  { id: "trade", icon: ArrowLeftRight },
  { id: "friends", icon: UserPlus },
  { id: "news", icon: Newspaper },
  { id: "shop", icon: ShoppingBag },
  { id: "chat", icon: MessageSquare },
];

export function MobileNav({ currentView, onViewChange, onHostGame, onJoinGame, isInGame, friendRequestCount = 0 }: MobileNavProps) {
  const [showPlayMenu, setShowPlayMenu] = useState(false);

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 mobile-nav-safe">
      {/* Play menu popup */}
      <AnimatePresence>
        {showPlayMenu && !isInGame && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex gap-2 p-2 bg-black/90 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl pointer-events-auto"
          >
            <button
              onClick={() => { onHostGame?.(); setShowPlayMenu(false); }}
              style={{ touchAction: "manipulation" }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm
                         bg-gradient-to-r from-green-600 to-emerald-600 text-white
                         active:scale-95 transition-transform min-h-[44px]"
            >
              <Users size={18} />
              Host
            </button>
            <button
              onClick={() => { onJoinGame?.(); setShowPlayMenu(false); }}
              style={{ touchAction: "manipulation" }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm
                         bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                         active:scale-95 transition-transform min-h-[44px]"
            >
              <LogIn size={18} />
              Join
            </button>
            <button
              onClick={() => setShowPlayMenu(false)}
              style={{ touchAction: "manipulation" }}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 text-white/60
                         active:scale-95 transition-transform min-h-[44px]"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-black/80 backdrop-blur-lg border-t border-white/10 px-1 py-1">
        <div className="relative flex justify-around items-center">
          {/* First half of tabs */}
          {tabs.slice(0, 3).map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onViewChange(tab.id)}
                style={{ touchAction: "manipulation" }}
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all min-h-[44px] min-w-[40px]
                  ${isActive
                    ? "text-cyan-400 scale-110"
                    : "text-white/50 active:scale-95"
                  }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5" />
                )}
              </button>
            );
          })}

          {/* Center Play button */}
          {!isInGame && (
            <button
              onClick={() => setShowPlayMenu((p) => !p)}
              style={{ touchAction: "manipulation" }}
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all min-h-[44px] min-w-[40px]
                ${showPlayMenu
                  ? "text-green-400 scale-110"
                  : "text-white/50 active:scale-95"
                }`}
            >
              <Gamepad2 size={20} strokeWidth={showPlayMenu ? 2.5 : 1.5} />
              {showPlayMenu && (
                <div className="w-1 h-1 rounded-full bg-green-400 mt-0.5" />
              )}
            </button>
          )}

          {/* Second half of tabs */}
          {tabs.slice(3).map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            const showBadge = tab.id === "friends" && friendRequestCount > 0;
            return (
              <button
                key={tab.id}
                onClick={() => onViewChange(tab.id)}
                style={{ touchAction: "manipulation" }}
                className={`relative flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all min-h-[44px] min-w-[40px]
                  ${isActive
                    ? "text-cyan-400 scale-110"
                    : "text-white/50 active:scale-95"
                  }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5" />
                )}
                {showBadge && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {friendRequestCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
