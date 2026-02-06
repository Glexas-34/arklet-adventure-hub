import { motion } from "framer-motion";
import { packEmojis } from "@/data/gameData";

interface PackCardProps {
  name: string;
  onClick: () => void;
  disabled?: boolean;
}

export function PackCard({ name, onClick, disabled }: PackCardProps) {
  const emoji = packEmojis[name] || "📦";

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      className="gradient-pack w-full rounded-2xl p-4 text-left shadow-lg 
                 transition-shadow hover:shadow-2xl disabled:opacity-50 
                 disabled:cursor-not-allowed"
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{emoji}</span>
        <span className="text-lg font-bold text-primary-foreground drop-shadow-md">
          {name}
        </span>
      </div>
    </motion.button>
  );
}
