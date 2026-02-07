import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useBanCheck(nickname: string | null) {
  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    if (!nickname) {
      setIsBanned(false);
      return;
    }

    let channel: ReturnType<typeof supabase.channel> | null = null;

    const checkBan = async () => {
      const { data, error } = await supabase
        .from("banned_users")
        .select("id")
        .eq("nickname", nickname)
        .maybeSingle();

      if (error) {
        // 42P01 = table doesn't exist yet
        if (error.code === "42P01" || error.message?.includes("banned_users")) {
          setIsBanned(false);
          return;
        }
        console.error("Ban check error:", error);
        setIsBanned(false);
        return;
      }

      setIsBanned(data !== null);
    };

    checkBan();

    // Subscribe to realtime changes
    channel = supabase
      .channel("banned_users_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "banned_users" },
        () => {
          checkBan();
        }
      )
      .subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [nickname]);

  return { isBanned };
}
