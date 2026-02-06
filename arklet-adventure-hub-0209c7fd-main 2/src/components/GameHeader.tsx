import { motion } from "framer-motion";
 import { Sparkles, User } from "lucide-react";

 interface GameHeaderProps {
   nickname?: string | null;
 }
 
 export function GameHeader({ nickname }: GameHeaderProps) {
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
       <div className="ml-auto flex items-center gap-4">
         <div className="text-xs text-primary-foreground/70">
        Press Space to toggle • Enter for preview
         </div>
         {nickname && (
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex items-center gap-2 bg-black/25 px-3 py-1.5 rounded-full"
           >
             <User className="w-4 h-4 text-primary-foreground" />
             <span className="font-bold text-primary-foreground">{nickname}</span>
           </motion.div>
         )}
      </div>
    </motion.header>
  );
}
