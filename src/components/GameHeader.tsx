import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User, Pencil, Hash } from "lucide-react";

interface GameHeaderProps {
  nickname?: string | null;
  userNumber?: number | null;
  onChangeNickname?: (newNickname: string) => Promise<{ success: boolean; error?: string }>;
}

export function GameHeader({ nickname, userNumber, onChangeNickname }: GameHeaderProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close popover on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowProfile(false);
        setIsEditing(false);
        setError(null);
      }
    };
    if (showProfile) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showProfile]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleChangeUsername = async () => {
    if (!onChangeNickname) return;
    const trimmed = newName.trim();
    if (!trimmed) {
      setError("Please enter a name");
      return;
    }
    if (trimmed.length < 2) {
      setError("Must be at least 2 characters");
      return;
    }
    if (trimmed.length > 20) {
      setError("Must be 20 characters or less");
      return;
    }
    if (trimmed === nickname) {
      setIsEditing(false);
      setError(null);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const result = await onChangeNickname(trimmed);
    setIsSubmitting(false);

    if (result.success) {
      setIsEditing(false);
      setNewName("");
      setShowProfile(false);
    } else {
      setError(result.error || "Failed to change name");
    }
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="gradient-header px-3 md:px-6 py-2 md:py-4 flex items-center gap-2 md:gap-3 shadow-lg"
    >
      <motion.div
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground drop-shadow-lg" />
      </motion.div>
      <h1 className="text-lg md:text-2xl font-bold text-primary-foreground drop-shadow-lg">
        Arklet Blooks
      </h1>
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="ml-1 md:ml-2 text-xs md:text-sm bg-black/25 px-2 md:px-3 py-1 rounded-full text-primary-foreground hidden sm:inline-block"
      >
        Pack Simulator
      </motion.span>
      <div className="ml-auto flex items-center gap-2 md:gap-4">
        <div className="hidden md:block text-xs text-primary-foreground/70">
          Press Space to toggle
        </div>
        {nickname && (
          <div className="relative" ref={popoverRef}>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowProfile((prev) => !prev);
                setIsEditing(false);
                setError(null);
              }}
              className="flex items-center gap-1.5 md:gap-2 bg-black/25 hover:bg-black/40 px-2 md:px-3 py-1 md:py-1.5 rounded-full cursor-pointer transition-colors"
            >
              <User className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" />
              <span className="font-bold text-primary-foreground text-xs md:text-sm">{nickname}</span>
            </motion.button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50"
                >
                  <div className="p-4">
                    {/* Profile display */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Username</p>
                        <p className="font-bold text-foreground truncate">{nickname}</p>
                      </div>
                    </div>

                    {/* User ID */}
                    {userNumber != null && (
                      <div className="flex items-center gap-1.5 mb-4 px-2 py-1.5 rounded-lg bg-white/5 border border-white/5">
                        <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">User ID:</span>
                        <span className="text-xs font-mono font-bold text-foreground">{userNumber}</span>
                      </div>
                    )}

                    {/* Change username */}
                    {!isEditing ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setIsEditing(true);
                          setNewName(nickname || "");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-foreground font-medium transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Change username
                      </motion.button>
                    ) : (
                      <div className="space-y-2">
                        <input
                          ref={inputRef}
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleChangeUsername();
                            if (e.key === "Escape") {
                              setIsEditing(false);
                              setError(null);
                            }
                          }}
                          maxLength={20}
                          placeholder="New username"
                          className="w-full px-3 py-2 rounded-lg bg-black/50 border border-primary/30 text-foreground text-sm outline-none focus:border-primary/60 transition-colors"
                        />
                        {error && (
                          <p className="text-xs text-red-400 font-medium">{error}</p>
                        )}
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleChangeUsername}
                            disabled={isSubmitting}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/80 text-primary-foreground text-sm font-bold transition-colors disabled:opacity-50"
                          >
                            {isSubmitting ? "..." : "Save"}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setIsEditing(false);
                              setError(null);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-foreground text-sm font-medium transition-colors"
                          >
                            Cancel
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.header>
  );
}
