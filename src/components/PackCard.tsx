import { motion } from "framer-motion";
import { packEmojis } from "@/data/gameData";
import { useSound } from "@/hooks/useSound";

interface PackCardProps {
  name: string;
  onClick: () => void;
  disabled?: boolean;
}

export function PackCard({ name, onClick, disabled }: PackCardProps) {
  const emoji = packEmojis[name] || "📦";
  const { playHover, playPackOpen } = useSound();

  const handleClick = () => {
    playPackOpen();
    onClick();
  };

  return (
    <motion.button
      onClick={handleClick}
      onMouseEnter={playHover}
      disabled={disabled}
      whileHover={{ scale: 1.06, y: -4, rotate: 1 }}
      whileTap={{ scale: 0.93, rotate: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="gradient-pack w-full rounded-2xl p-4 text-left shadow-lg
                 hover:shadow-2xl
                 disabled:opacity-50 disabled:cursor-not-allowed
                 animate-wiggle-hover"
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl md:text-4xl transition-all">{emoji}</span>
        <span className="text-lg font-bold text-primary-foreground drop-shadow-md">
          {name}
        </span>
      </div>
    </motion.button>
  );
}
