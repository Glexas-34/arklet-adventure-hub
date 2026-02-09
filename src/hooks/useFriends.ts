import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Friend {
  id: string;
  nickname: string;
  status: "pending" | "accepted";
  isIncoming: boolean;
}

export function useFriends(nickname: string | null) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<Friend[]>([]);

  const fetchFriends = useCallback(async () => {
    if (!nickname) {
      setFriends([]);
      setIncomingRequests([]);
      return;
    }

    const { data, error } = await supabase
      .from("friendships")
      .select("*")
      .or(`requester_nickname.eq.${nickname},target_nickname.eq.${nickname}`)
      .in("status", ["pending", "accepted"]);

    if (error) {
      if (error.code === "42P01") return;
      console.error("Error fetching friends:", error);
      return;
    }

    const accepted: Friend[] = [];
    const incoming: Friend[] = [];

    for (const row of data) {
      const isIncoming = row.target_nickname === nickname;
      const friendNick = isIncoming ? row.requester_nickname : row.target_nickname;

      if (row.status === "accepted") {
        accepted.push({ id: row.id, nickname: friendNick, status: "accepted", isIncoming });
      } else if (row.status === "pending" && isIncoming) {
        incoming.push({ id: row.id, nickname: friendNick, status: "pending", isIncoming: true });
      }
    }

    setFriends(accepted);
    setIncomingRequests(incoming);
  }, [nickname]);

  useEffect(() => {
    fetchFriends();

    if (!nickname) return;

    const channel = supabase
      .channel("friendships-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "friendships" },
        () => {
          fetchFriends();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [nickname, fetchFriends]);

  const sendRequest = useCallback(async (targetNickname: string): Promise<{ success: boolean; error?: string }> => {
    if (!nickname) return { success: false, error: "Not logged in" };
    if (targetNickname === nickname) return { success: false, error: "You can't friend yourself" };

    // Check if already friends or pending
    const { data: existing } = await supabase
      .from("friendships")
      .select("id, status")
      .or(
        `and(requester_nickname.eq.${nickname},target_nickname.eq.${targetNickname}),and(requester_nickname.eq.${targetNickname},target_nickname.eq.${nickname})`
      );

    if (existing && existing.length > 0) {
      const row = existing[0];
      if (row.status === "accepted") return { success: false, error: "Already friends" };
      if (row.status === "pending") return { success: false, error: "Request already pending" };
      // If declined, delete old row and re-send
      if (row.status === "declined") {
        await supabase.from("friendships").delete().eq("id", row.id);
      }
    }

    const { error } = await supabase
      .from("friendships")
      .insert({ requester_nickname: nickname, target_nickname: targetNickname });

    if (error) {
      if (error.code === "23505") return { success: false, error: "Request already sent" };
      return { success: false, error: error.message };
    }

    return { success: true };
  }, [nickname]);

  const sendRequestByIdOrName = useCallback(async (query: string): Promise<{ success: boolean; error?: string; targetName?: string }> => {
    const trimmed = query.trim();
    if (!trimmed) return { success: false, error: "Enter a username or ID number" };

    // Check if it's a number (user_number lookup)
    const asNumber = parseInt(trimmed, 10);
    if (!isNaN(asNumber) && String(asNumber) === trimmed) {
      const { data, error } = await supabase
        .from("player_profiles")
        .select("nickname")
        .eq("user_number", asNumber)
        .limit(1)
        .single();

      if (error || !data) return { success: false, error: `No player found with ID #${asNumber}` };
      const result = await sendRequest(data.nickname);
      return { ...result, targetName: data.nickname };
    }

    // Otherwise treat as nickname
    // Verify the player exists
    const { data, error } = await supabase
      .from("player_profiles")
      .select("nickname")
      .eq("nickname", trimmed)
      .limit(1)
      .single();

    if (error || !data) return { success: false, error: `Player "${trimmed}" not found` };
    const result = await sendRequest(data.nickname);
    return { ...result, targetName: data.nickname };
  }, [sendRequest]);

  const acceptRequest = useCallback(async (friendshipId: string) => {
    const { error } = await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("id", friendshipId);
    if (error) console.error("Error accepting friend request:", error);
    fetchFriends();
  }, [fetchFriends]);

  const declineRequest = useCallback(async (friendshipId: string) => {
    const { error } = await supabase
      .from("friendships")
      .update({ status: "declined" })
      .eq("id", friendshipId);
    if (error) console.error("Error declining friend request:", error);
    fetchFriends();
  }, [fetchFriends]);

  const removeFriend = useCallback(async (friendshipId: string) => {
    const { error } = await supabase
      .from("friendships")
      .delete()
      .eq("id", friendshipId);
    if (error) console.error("Error removing friend:", error);
    fetchFriends();
  }, [fetchFriends]);

  return {
    friends,
    incomingRequests,
    sendRequest,
    sendRequestByIdOrName,
    acceptRequest,
    declineRequest,
    removeFriend,
  };
}
