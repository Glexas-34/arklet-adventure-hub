import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSpawnedPacks() {
  const [spawnedPackNames, setSpawnedPackNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchSpawned = async () => {
      const { data, error } = await supabase
        .from("spawned_packs")
        .select("pack_name");

      if (error) {
        if (error.code === "42P01") {
          // Table doesn't exist yet - graceful degradation
          return;
        }
        console.error("Error fetching spawned packs:", error);
        return;
      }

      setSpawnedPackNames(data.map((row) => row.pack_name));
    };

    fetchSpawned();

    const channel = supabase
      .channel("spawned-packs-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "spawned_packs" },
        () => {
          fetchSpawned();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { spawnedPackNames };
}
