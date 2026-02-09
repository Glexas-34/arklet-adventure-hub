import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ShopListing {
  id: string;
  seller_nickname: string;
  item_name: string;
  item_rarity: string;
  created_at: string;
}

export function useShop(nickname: string | null) {
  const [listings, setListings] = useState<ShopListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchListings = useCallback(async () => {
    const { data, error } = await supabase
      .from("shop_listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching shop listings:", error);
      return;
    }

    setListings(data || []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchListings();

    const channel = supabase
      .channel("shop-listings-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "shop_listings" },
        (payload) => {
          setListings((prev) => [payload.new as ShopListing, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "shop_listings" },
        (payload) => {
          setListings((prev) => prev.filter((l) => l.id !== (payload.old as ShopListing).id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchListings]);

  const listItem = useCallback(
    async (sellerNickname: string, itemName: string, itemRarity: string) => {
      const { error } = await supabase
        .from("shop_listings")
        .insert({ seller_nickname: sellerNickname, item_name: itemName, item_rarity: itemRarity });

      if (error) {
        console.error("Error listing item:", error);
        return false;
      }
      return true;
    },
    []
  );

  const buyItem = useCallback(
    async (listingId: string): Promise<ShopListing | null> => {
      // Fetch the listing first so we can return its info
      const listing = listings.find((l) => l.id === listingId);
      if (!listing) return null;

      const { error } = await supabase
        .from("shop_listings")
        .delete()
        .eq("id", listingId);

      if (error) {
        console.error("Error buying item:", error);
        return null;
      }

      return listing;
    },
    [listings]
  );

  const returnItem = useCallback(
    async (listingId: string): Promise<ShopListing | null> => {
      return buyItem(listingId);
    },
    [buyItem]
  );

  return { listings, listItem, buyItem, returnItem, isLoading };
}
