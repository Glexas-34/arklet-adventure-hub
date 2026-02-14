import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Rarity } from "@/data/gameData";

interface PublicGiftItem {
  rarity: Rarity;
  itemName: string;
  givenBy: string;
}

export function usePublicGift(nickname: string | null) {
  const [publicGiftItem, setPublicGiftItem] = useState<PublicGiftItem | null>(null);

  useEffect(() => {
    if (!nickname) return;

    const channel = supabase.channel("public-gift-broadcast");

    channel
      .on("broadcast", { event: "public-gift" }, (payload) => {
        const data = payload.payload as PublicGiftItem;
        if (data && data.rarity && data.itemName) {
          setPublicGiftItem(data);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [nickname]);

  const clearPublicGift = useCallback(() => {
    setPublicGiftItem(null);
  }, []);

  return { publicGiftItem, clearPublicGift };
}
