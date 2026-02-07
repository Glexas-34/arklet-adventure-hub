import { Package, Backpack, BookOpen, Trophy, MessageSquare } from "lucide-react";

type View = "packs" | "inventory" | "index" | "leaderboard" | "trade" | "chat";

interface MobileNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const tabs = [
  { id: "packs" as const, label: "Packs", icon: Package },
  { id: "inventory" as const, label: "Items", icon: Backpack },
  { id: "index" as const, label: "Index", icon: BookOpen },
  { id: "leaderboard" as const, label: "Scores", icon: Trophy },
  { id: "chat" as const, label: "Chat", icon: MessageSquare },
];

export function MobileNav({ currentView, onViewChange }: MobileNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 mobile-nav-safe">
      <div className="bg-black/80 backdrop-blur-lg border-t border-white/10 px-2 py-1">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
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
