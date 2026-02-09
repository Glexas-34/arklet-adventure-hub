import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAnnouncement() {
  const [announcement, setAnnouncement] = useState<string>("");

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("site_announcements")
        .select("message")
        .eq("id", "current")
        .single();

      if (error) {
        if (error.code === "42P01" || error.code === "PGRST116") return;
        console.error("Error fetching announcement:", error);
        return;
      }

      setAnnouncement(data?.message || "");
    };

    fetch();

    const channel = supabase
      .channel("announcements-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_announcements" },
        () => { fetch(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { announcement };
}
