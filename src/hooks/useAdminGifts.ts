import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { InventoryItem, Rarity } from "@/data/gameData";

export function useAdminGifts(nickname: string | null) {
  const [adminItems, setAdminItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    if (!nickname) {
      setAdminItems([]);
      return;
    }

    const fetchGifts = async () => {
      const { data, error } = await supabase
        .from("admin_gifts")
        .select("item_name, rarity")
        .eq("recipient_nickname", nickname);

      if (error) {
        if (error.code === "42P01" || error.message?.includes("admin_gifts")) {
          // Table doesn't exist yet - graceful degradation
          return;
        }
        console.error("Error fetching admin gifts:", error);
        return;
      }

      setAdminItems(groupGifts(data));
    };

    fetchGifts();

    const channel = supabase
      .channel("admin-gifts-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "admin_gifts", filter: `recipient_nickname=eq.${nickname}` },
        () => {
          fetchGifts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [nickname]);

  return { adminItems };
}

function groupGifts(rows: { item_name: string; rarity: string }[]): InventoryItem[] {
  const map = new Map<string, InventoryItem>();
  for (const row of rows) {
    const key = `${row.item_name}|${row.rarity}`;
    const existing = map.get(key);
    if (existing) {
      existing.count++;
    } else {
      map.set(key, { name: row.item_name, rarity: row.rarity as Rarity, count: 1 });
    }
  }
  return Array.from(map.values());
}
