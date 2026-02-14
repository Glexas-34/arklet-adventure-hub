import { useState, useEffect, useMemo } from "react";
import { getCurrentSeason, seasonalThemes } from "@/data/seasonalThemes";
import { packs, packEmojis, setSeasonRarityBoost } from "@/data/gameData";
import { supabase } from "@/integrations/supabase/client";

export function useSeason() {
  const naturalSeason = useMemo(() => getCurrentSeason(), []);
  const [overrideMonth, setOverrideMonth] = useState<number | null>(null);

  // The active season: override if set, otherwise natural month
  const season = overrideMonth !== null && overrideMonth >= 1 && overrideMonth <= 12
    ? seasonalThemes[overrideMonth - 1]
    : naturalSeason;

  // Listen for global season override from Supabase
  useEffect(() => {
    const fetchOverride = async () => {
      const { data, error } = await supabase
        .from("site_announcements")
        .select("message")
        .eq("id", "season")
        .single();

      if (error || !data?.message) {
        setOverrideMonth(null);
        setSeasonRarityBoost(1);
        return;
      }

      const month = parseInt(data.message, 10);
      if (!isNaN(month) && month >= 1 && month <= 12) {
        setOverrideMonth(month);
        setSeasonRarityBoost(1.75);
      } else {
        setOverrideMonth(null);
        setSeasonRarityBoost(1);
      }
    };

    fetchOverride();

    const channel = supabase
      .channel("season-override-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_announcements", filter: "id=eq.season" },
        () => { fetchOverride(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Apply CSS variable overrides to :root
  useEffect(() => {
    const root = document.documentElement;
    const entries = Object.entries(season.css);

    for (const [prop, value] of entries) {
      root.style.setProperty(prop, value);
    }

    return () => {
      for (const [prop] of entries) {
        root.style.removeProperty(prop);
      }
    };
  }, [season]);

  // Register the seasonal pack in the packs object (if not already there)
  useEffect(() => {
    if (!packs[season.packName]) {
      packs[season.packName] = season.packItems;
    }
    if (!packEmojis[season.packName]) {
      packEmojis[season.packName] = season.emoji;
    }
  }, [season]);

  return {
    seasonName: season.name,
    seasonEmoji: season.emoji,
    seasonDescription: season.description,
    seasonalPackName: season.packName,
  };
}
