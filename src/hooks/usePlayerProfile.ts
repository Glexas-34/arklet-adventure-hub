import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const NICKNAME_KEY = "playerNickname";

export interface PlayerProfile {
  id: string;
  nickname: string;
  unique_count: number;
  wins: number;
}

export function usePlayerProfile() {
  const [nickname, setNickname] = useState<string | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNicknameModal, setShowNicknameModal] = useState(false);

  // Load nickname from localStorage on mount
  useEffect(() => {
    const savedNickname = localStorage.getItem(NICKNAME_KEY);
    if (savedNickname) {
      setNickname(savedNickname);
      fetchOrCreateProfile(savedNickname);
    } else {
      setShowNicknameModal(true);
      setIsLoading(false);
    }
  }, []);

  const fetchOrCreateProfile = async (nick: string) => {
    setIsLoading(true);
    try {
      // Try to fetch existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from("player_profiles")
        .select("*")
        .eq("nickname", nick)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingProfile) {
        setProfile(existingProfile as PlayerProfile);
      } else {
        // Create new profile
        const { data: newProfile, error: createError } = await supabase
          .from("player_profiles")
          .insert({ nickname: nick })
          .select()
          .single();

        if (createError) throw createError;
        setProfile(newProfile as PlayerProfile);
      }
    } catch (error) {
      console.error("Error fetching/creating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNickname = useCallback(async (newNickname: string) => {
    // Check if nickname is already taken
    const { data: existing } = await supabase
      .from("player_profiles")
      .select("id")
      .eq("nickname", newNickname)
      .maybeSingle();

    if (existing) {
      return { success: false, error: "Nickname already taken" };
    }

    localStorage.setItem(NICKNAME_KEY, newNickname);
    setNickname(newNickname);
    setShowNicknameModal(false);
    await fetchOrCreateProfile(newNickname);
    return { success: true };
  }, []);

  const updateUniqueCount = useCallback(async (newCount: number) => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from("player_profiles")
        .update({ unique_count: newCount, updated_at: new Date().toISOString() })
        .eq("id", profile.id);

      if (error) throw error;
      setProfile((prev) => prev ? { ...prev, unique_count: newCount } : null);
    } catch (error) {
      console.error("Error updating unique count:", error);
    }
  }, [profile]);

  const incrementWins = useCallback(async () => {
    if (!profile) return;

    try {
      const newCount = profile.wins + 1;
      const { error } = await supabase
        .from("player_profiles")
        .update({ wins: newCount, updated_at: new Date().toISOString() })
        .eq("id", profile.id);

      if (error) throw error;
      setProfile((prev) => prev ? { ...prev, wins: newCount } : null);
    } catch (error) {
      console.error("Error incrementing wins:", error);
    }
  }, [profile]);

  const changeNickname = useCallback(async (newNickname: string) => {
    const { data: existing } = await supabase
      .from("player_profiles")
      .select("id")
      .eq("nickname", newNickname)
      .maybeSingle();

    if (existing) {
      return { success: false, error: "Nickname already taken" };
    }

    if (profile) {
      const { error } = await supabase
        .from("player_profiles")
        .update({ nickname: newNickname, updated_at: new Date().toISOString() })
        .eq("id", profile.id);

      if (error) {
        return { success: false, error: "Failed to update nickname" };
      }
      setProfile((prev) => prev ? { ...prev, nickname: newNickname } : null);
    } else {
      await fetchOrCreateProfile(newNickname);
    }

    localStorage.setItem(NICKNAME_KEY, newNickname);
    setNickname(newNickname);
    return { success: true };
  }, [profile]);

  return {
    nickname,
    profile,
    isLoading,
    showNicknameModal,
    setShowNicknameModal,
    saveNickname,
    changeNickname,
    updateUniqueCount,
    incrementWins,
  };
}
