import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Radio, X } from "lucide-react";
import { useVoiceChat } from "@/hooks/useVoiceChat";

interface VoiceChatToggleProps {
  nickname: string | null;
}

/** Radiating sound wave arcs that appear around the button */
function SoundWaves() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute rounded-full border-2 border-emerald-400/50 pointer-events-none"
          style={{ inset: -4 - i * 6 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.7, 0], scale: [0.8, 1.15, 1.4] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}

export function VoiceChatToggle({ nickname }: VoiceChatToggleProps) {
  const { isActive, peerCount, error, toggleVoice, notification, dismissNotification, activeUsers } = useVoiceChat();

  const othersActive = activeUsers > 0 && !isActive;

  return (
    <>
      {/* Global notification banner when someone activates SAC */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed top-4 left-4 right-4 z-[100] mx-auto max-w-md"
          >
            <div className="relative bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 rounded-2xl p-4 shadow-2xl shadow-emerald-500/30 border border-emerald-400/40 overflow-hidden">
              {/* Animated background shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />

              <button
                onClick={dismissNotification}
                className="absolute top-2 right-2 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <Radio className="w-5 h-5 text-white" />
                </motion.div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm leading-tight">
                    {notification} is on the Ark Communicator!
                  </p>
                  <p className="text-emerald-100/80 text-xs mt-0.5">
                    Tap the SAC button to join the voice channel
                  </p>
                </div>
              </div>

              {/* Tap to join shortcut */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  dismissNotification();
                  toggleVoice(nickname);
                }}
                className="relative mt-3 w-full py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors"
              >
                Join Now
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating toggle button */}
      <motion.button
        onClick={() => toggleVoice(nickname)}
        animate={
          othersActive
            ? { scale: [1, 1.1, 1], boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 18px rgba(16,185,129,0.6)", "0 0 0px rgba(16,185,129,0)"] }
            : {}
        }
        transition={othersActive ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : undefined}
        className={`fixed bottom-20 md:bottom-4 left-4 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border transition-colors ${
          error
            ? "bg-red-900/80 border-red-500/50 text-red-300"
            : isActive
            ? "bg-emerald-600/90 border-emerald-400/50 text-white"
            : othersActive
            ? "bg-emerald-900/80 border-emerald-500/60 text-emerald-300"
            : "bg-gray-900/70 border-gray-600/40 text-gray-400"
        }`}
        whileTap={{ scale: 0.9 }}
        title="Super Ark Communicator"
      >
        {/* Sound wave arcs when others are active (inviting to join) */}
        <AnimatePresence>
          {othersActive && <SoundWaves />}
        </AnimatePresence>

        {/* Pulse ring when user is active */}
        <AnimatePresence>
          {isActive && !error && (
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-emerald-400/60"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          )}
        </AnimatePresence>

        {isActive && !error ? (
          <Mic className="w-5 h-5" />
        ) : othersActive ? (
          <motion.span
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
          >
            <Radio className="w-5 h-5" />
          </motion.span>
        ) : (
          <MicOff className="w-5 h-5" />
        )}

        {/* Peer count badge (own connections) */}
        <AnimatePresence>
          {isActive && peerCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 text-[10px] font-bold flex items-center justify-center text-white"
            >
              {peerCount}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Active users badge when not joined */}
        <AnimatePresence>
          {othersActive && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-[10px] font-bold flex items-center justify-center text-white"
            >
              {activeUsers}
            </motion.span>
          )}
        </AnimatePresence>

        {/* SAC label */}
        <span className={`absolute -bottom-5 text-[9px] font-bold select-none ${othersActive ? "text-emerald-400" : "text-gray-500"}`}>
          SAC
        </span>
      </motion.button>
    </>
  );
}
