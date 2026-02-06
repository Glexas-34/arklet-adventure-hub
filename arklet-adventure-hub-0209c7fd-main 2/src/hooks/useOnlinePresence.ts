 import { useState, useEffect, useCallback } from "react";
 import { supabase } from "@/integrations/supabase/client";
 
 interface OnlinePlayer {
   nickname: string;
   online_at: string;
 }
 
 export function useOnlinePresence(nickname: string | null) {
   const [onlinePlayers, setOnlinePlayers] = useState<OnlinePlayer[]>([]);
 
   useEffect(() => {
     if (!nickname) return;
 
     const channel = supabase.channel("online-players");
 
     channel
       .on("presence", { event: "sync" }, () => {
         const state = channel.presenceState();
         const players: OnlinePlayer[] = [];
         
         Object.values(state).forEach((presences: any[]) => {
           presences.forEach((p) => {
             if (p.nickname) {
               players.push({ nickname: p.nickname, online_at: p.online_at });
             }
           });
         });
         
         setOnlinePlayers(players);
       })
       .subscribe(async (status) => {
         if (status === "SUBSCRIBED") {
           await channel.track({
             nickname,
             online_at: new Date().toISOString(),
           });
         }
       });
 
     return () => {
       supabase.removeChannel(channel);
     };
   }, [nickname]);
 
   const isPlayerOnline = useCallback((targetNickname: string) => {
     return onlinePlayers.some((p) => p.nickname === targetNickname);
   }, [onlinePlayers]);
 
   return {
     onlinePlayers,
     isPlayerOnline,
   };
 }