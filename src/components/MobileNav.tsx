import { useState } from "react";
import { Package, Backpack, BookOpen, Trophy, MessageSquare, Gamepad2, Users, LogIn, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type View = "packs" | "inventory" | "index" | "leaderboard" | "trade" | "chat";

interface MobileNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onHostGame?: () => void;
  onJoinGame?: () => void;
  isInGame?: boolean;
}

const tabs = [
  { id: "packs" as const, label: "Packs", icon: Package },
  { id: "inventory" as const, label: "Inventory", icon: Backpack },
  { id: "index" as const, label: "Arks", icon: BookOpen },
  { id: "leaderboard" as const, label: "Scores", icon: Trophy },
  { id: "chat" as const, label: "Chat", icon: MessageSquare },
];

export function MobileNav({ currentView, onViewChange, onHostGame, onJoinGame, isInGame }: MobileNavProps) {
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
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex gap-2 p-2 bg-black/90 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl"
          >
            <button
              onClick={() => { onHostGame?.(); setShowPlayMenu(false); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm
                         bg-gradient-to-r from-green-600 to-emerald-600 text-white
                         active:scale-95 transition-transform"
            >
              <Users size={18} />
              Host
            </button>
            <button
              onClick={() => { onJoinGame?.(); setShowPlayMenu(false); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm
                         bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                         active:scale-95 transition-transform"
            >
              <LogIn size={18} />
              Join
            </button>
            <button
              onClick={() => setShowPlayMenu(false)}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 text-white/60
                         active:scale-95 transition-transform"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-black/80 backdrop-blur-lg border-t border-white/10 px-2 py-1">
        <div className="flex justify-around items-center">
          {tabs.slice(0, 2).map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onViewChange(tab.id)}
                className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all min-w-[56px]
                  ${isActive
                    ? "text-cyan-400 scale-110"
                    : "text-white/50 active:scale-95"
                  }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[10px] font-bold leading-none">{tab.label}</span>
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
              className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all min-w-[56px]
                ${showPlayMenu
                  ? "text-green-400 scale-110"
                  : "text-white/50 active:scale-95"
                }`}
            >
              <Gamepad2 size={22} strokeWidth={showPlayMenu ? 2.5 : 1.5} />
              <span className="text-[10px] font-bold leading-none">Play</span>
              {showPlayMenu && (
                <div className="w-1 h-1 rounded-full bg-green-400 mt-0.5" />
              )}
            </button>
          )}

          {tabs.slice(2).map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onViewChange(tab.id)}
                className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all min-w-[56px]
                  ${isActive
                    ? "text-cyan-400 scale-110"
                    : "text-white/50 active:scale-95"
                  }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[10px] font-bold leading-none">{tab.label}</span>
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
