import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FriendRequestModalProps {
  isOpen: boolean;
  requesterNickname: string;
  onAccept: () => void;
  onDecline: () => void;
}

export function FriendRequestModal({
  isOpen,
  requesterNickname,
  onAccept,
  onDecline,
}: FriendRequestModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="gradient-card rounded-2xl p-6 max-w-md w-full mx-4 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-500/20">
              <UserPlus className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-foreground mb-2">Friend Request</h2>
          <p className="text-muted-foreground mb-6">
            <span className="font-bold text-foreground">{requesterNickname}</span> wants to be your friend!
          </p>

          <div className="flex gap-3 justify-center">
            <Button
              onClick={onAccept}
              className="bg-green-600 hover:bg-green-500 text-white px-6"
            >
              <Check className="w-4 h-4 mr-2" />
              Accept
            </Button>
            <Button
              onClick={onDecline}
              variant="destructive"
              className="px-6"
            >
              <X className="w-4 h-4 mr-2" />
              Decline
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
