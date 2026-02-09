import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { sanitizeNickname } from "@/lib/sanitize";
import { Link } from "react-router-dom";

interface NicknameModalProps {
  isOpen: boolean;
  onSave: (nickname: string) => Promise<{ success: boolean; error?: string }>;
}

export function NicknameModal({ isOpen, onSave }: NicknameModalProps) {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = sanitizeNickname(nickname);
    if (!validation.valid) {
      setError(validation.error || "Invalid nickname");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const result = await onSave(validation.value);

    if (!result.success) {
      setError(result.error || "Failed to save nickname");
    } else {
      window.scrollTo(0, 0);
    }
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
                   rounded-2xl p-8 w-full max-w-md shadow-2xl border border-primary/30"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-black text-foreground">Welcome!</h2>
          <p className="text-muted-foreground mt-2">
            Enter your nickname to join the leaderboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nickname" className="text-foreground">
              Enter your nickname
            </Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="YourCoolName"
              className="mt-2 bg-black/50 border-primary/30 text-foreground"
              autoFocus
              maxLength={20}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl font-bold text-lg
                       bg-gradient-to-r from-primary to-primary/80
                       hover:from-primary/90 hover:to-primary/70
                       text-primary-foreground shadow-lg
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all"
          >
            {isSubmitting ? "Saving..." : "Continue"}
          </motion.button>

          <p className="text-center text-[11px] text-muted-foreground mt-3">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="underline hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
}
