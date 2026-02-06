import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function GameHeader() {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="gradient-header px-6 py-4 flex items-center gap-3 shadow-lg"
    >
      <motion.div
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <Sparkles className="w-8 h-8 text-primary-foreground drop-shadow-lg" />
      </motion.div>
      <h1 className="text-2xl font-bold text-primary-foreground drop-shadow-lg">
        Arklet Blooks
      </h1>
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="ml-2 text-sm bg-black/25 px-3 py-1 rounded-full text-primary-foreground"
      >
        Pack Simulator
      </motion.span>
      <div className="ml-auto text-xs text-primary-foreground/70">
        Press Space to toggle • Enter for preview
      </div>
    </motion.header>
  );
}
