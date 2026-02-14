import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { setHiddenRarityBoost } from "@/data/gameData";

interface LuckState {
  multiplier: number;
  activatedBy: string;
}

export function useLuckBoost() {
  const [luckState, setLuckState] = useState<LuckState>({ multiplier: 1, activatedBy: "" });

  useEffect(() => {
    const fetchLuck = async () => {
      const { data, error } = await supabase
        .from("site_announcements")
        .select("message, set_by")
        .eq("id", "luck")
        .single();

      if (error || !data?.message) {
        setHiddenRarityBoost(1);
        setLuckState({ multiplier: 1, activatedBy: "" });
        return;
      }

      const mult = parseFloat(data.message);
      if (!isNaN(mult) && mult > 0) {
        setHiddenRarityBoost(mult);
        setLuckState({ multiplier: mult, activatedBy: data.set_by || "" });
      }
    };

    fetchLuck();

    const channel = supabase
      .channel("luck-boost-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_announcements", filter: "id=eq.luck" },
        () => { fetchLuck(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return luckState;
}
