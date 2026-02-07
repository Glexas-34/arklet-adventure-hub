import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";
import { isAdminUser } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";
import { Rarity, rarityOrder } from "@/data/gameData";

interface AdminPanelProps {
  nickname: string | null;
}

export function AdminPanel({ nickname }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!isAdminUser(nickname)) return null;

  const handleCommand = async () => {
    const trimmed = command.trim();
    if (!trimmed) return;

    setFeedback(null);

    const banMatch = trimmed.match(/^\/ban\s+(.+)$/i);
    const unbanMatch = trimmed.match(/^\/unban\s+(.+)$/i);
    const giveMatch = trimmed.match(/^\/give\s+(\S+)\s+(.+)$/i);

    if (giveMatch) {
      const recipient = giveMatch[1];
      const rest = giveMatch[2]; // "Exotic Cool Sword" or "Ultra Secret Cool Sword"

      // Build rarity map (case-insensitive)
      const rarityMap: Record<string, Rarity> = {};
      for (const r of rarityOrder) {
        rarityMap[r.toLowerCase()] = r;
      }

      // Try two-word rarity first (e.g. "ultra secret"), then one-word
      let matchedRarity: Rarity | undefined;
      let itemName: string | undefined;

      const words = rest.split(/\s+/);
      if (words.length >= 3) {
        const twoWord = `${words[0]} ${words[1]}`.toLowerCase();
        if (rarityMap[twoWord]) {
          matchedRarity = rarityMap[twoWord];
          itemName = words.slice(2).join(" ");
        }
      }
      if (!matchedRarity && words.length >= 2) {
        const oneWord = words[0].toLowerCase();
        if (rarityMap[oneWord]) {
          matchedRarity = rarityMap[oneWord];
          itemName = words.slice(1).join(" ");
        }
      }

      if (!matchedRarity || !itemName) {
        setFeedback({ type: "error", text: `Format: /give Username Rarity ItemName` });
        return;
      }

      const { error } = await supabase
        .from("admin_gifts")
        .insert({ recipient_nickname: recipient, item_name: itemName, rarity: matchedRarity, given_by: nickname! });

      if (error) {
        if (error.code === "42P01" || error.message?.includes("admin_gifts")) {
          setFeedback({ type: "error", text: "Table not found. Run the admin_gifts migration SQL in Supabase Dashboard." });
        } else {
          setFeedback({ type: "error", text: error.message });
        }
      } else {
        setFeedback({ type: "success", text: `Gave "${itemName}" (${matchedRarity}) to ${recipient}` });
        setCommand("");
      }
    } else if (banMatch) {
      const target = banMatch[1].trim();
      const { error } = await supabase
        .from("banned_users")
        .insert({ nickname: target, banned_by: nickname! });

      if (error) {
        if (error.code === "42P01" || error.message?.includes("banned_users")) {
          setFeedback({ type: "error", text: "Table not found. Run the migration SQL in Supabase Dashboard." });
        } else if (error.code === "23505") {
          setFeedback({ type: "error", text: `${target} is already banned.` });
        } else {
          setFeedback({ type: "error", text: error.message });
        }
      } else {
        setFeedback({ type: "success", text: `Banned ${target}` });
        setCommand("");
      }
    } else if (unbanMatch) {
      const target = unbanMatch[1].trim();
      const { error, count } = await supabase
        .from("banned_users")
        .delete()
        .eq("nickname", target);

      if (error) {
        if (error.code === "42P01" || error.message?.includes("banned_users")) {
          setFeedback({ type: "error", text: "Table not found. Run the migration SQL in Supabase Dashboard." });
        } else {
          setFeedback({ type: "error", text: error.message });
        }
      } else {
        setFeedback({ type: "success", text: `Unbanned ${target}` });
        setCommand("");
      }
    } else {
      setFeedback({ type: "error", text: "Unknown command. Try /give User Rarity Item, /ban User, /unban User" });
    }
  };

  return (
    <div className="mb-3">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
      >
        <Shield className="w-3.5 h-3.5" />
        AP
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-3 rounded-xl bg-red-950/40 border border-red-500/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCommand();
                  }}
                  placeholder="/give User Rarity Item"
                  className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-red-500/20 text-foreground text-sm outline-none focus:border-red-500/50 transition-colors placeholder:text-muted-foreground"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCommand}
                  className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-colors"
                >
                  Run
                </motion.button>
              </div>
              {feedback && (
                <p className={`text-xs mt-2 ${feedback.type === "success" ? "text-green-400" : "text-red-400"}`}>
                  {feedback.text}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
