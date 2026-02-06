 import { useState, useEffect, useCallback } from "react";
 import { supabase } from "@/integrations/supabase/client";
 import { InventoryItem, Rarity } from "@/data/gameData";
 
 export interface TradeSession {
   id: string;
   requester_nickname: string;
   target_nickname: string;
   status: string;
   requester_accepted: boolean;
   target_accepted: boolean;
   created_at: string;
   updated_at: string;
 }
 
 export interface TradeOffer {
   id: string;
   session_id: string;
   nickname: string;
   item_name: string;
   item_rarity: string;
   quantity: number;
 }
 
 export function useTrading(nickname: string | null) {
   const [activeSession, setActiveSession] = useState<TradeSession | null>(null);
   const [incomingRequest, setIncomingRequest] = useState<TradeSession | null>(null);
   const [myOffers, setMyOffers] = useState<TradeOffer[]>([]);
   const [theirOffers, setTheirOffers] = useState<TradeOffer[]>([]);
   const [tradeAccepted, setTradeAccepted] = useState(false);
   const [tradeCompleted, setTradeCompleted] = useState(false);
   const [tradeError, setTradeError] = useState<string | null>(null);
 
   // Subscribe to trade sessions for incoming requests
   useEffect(() => {
     if (!nickname) return;
 
     // Check for existing pending requests to this user
     const checkPendingRequests = async () => {
       const { data } = await supabase
         .from("trade_sessions")
         .select("*")
         .eq("target_nickname", nickname)
         .eq("status", "pending")
         .order("created_at", { ascending: false })
         .limit(1);
 
       if (data && data.length > 0) {
         setIncomingRequest(data[0] as TradeSession);
       }
     };
     checkPendingRequests();
 
     // Subscribe to new trade requests
     const channel = supabase
       .channel(`trade-requests-${nickname}`)
       .on(
         "postgres_changes",
         {
           event: "*",
           schema: "public",
           table: "trade_sessions",
         },
         (payload) => {
           const session = payload.new as TradeSession;
           const oldSession = payload.old as TradeSession;
 
           // Handle incoming request
           if (payload.eventType === "INSERT" && session.target_nickname === nickname && session.status === "pending") {
             setIncomingRequest(session);
           }
 
           // Handle session updates
           if (payload.eventType === "UPDATE") {
             // If this is our active session, update it
             if (activeSession?.id === session.id) {
               setActiveSession(session);
               
               // Check if trade is completed
               if (session.status === "completed") {
                 setTradeCompleted(true);
               }
               
               // Check if declined or cancelled
               if (session.status === "declined" || session.status === "cancelled") {
                 setActiveSession(null);
                 setMyOffers([]);
                 setTheirOffers([]);
               }
             }
             
             // Clear incoming request if it was handled
             if (incomingRequest?.id === session.id && session.status !== "pending") {
               setIncomingRequest(null);
             }
           }
 
           // Handle session deletion
           if (payload.eventType === "DELETE" && oldSession) {
             if (activeSession?.id === oldSession.id) {
               setActiveSession(null);
               setMyOffers([]);
               setTheirOffers([]);
             }
             if (incomingRequest?.id === oldSession.id) {
               setIncomingRequest(null);
             }
           }
         }
       )
       .subscribe();
 
     return () => {
       supabase.removeChannel(channel);
     };
   }, [nickname, activeSession?.id, incomingRequest?.id]);
 
   // Subscribe to trade offers when in active session
   useEffect(() => {
     if (!activeSession || !nickname) return;
 
     const fetchOffers = async () => {
       const { data } = await supabase
         .from("trade_offers")
         .select("*")
         .eq("session_id", activeSession.id);
 
       if (data) {
         setMyOffers(data.filter((o) => o.nickname === nickname) as TradeOffer[]);
         setTheirOffers(data.filter((o) => o.nickname !== nickname) as TradeOffer[]);
       }
     };
     fetchOffers();
 
     const channel = supabase
       .channel(`trade-offers-${activeSession.id}`)
       .on(
         "postgres_changes",
         {
           event: "*",
           schema: "public",
           table: "trade_offers",
           filter: `session_id=eq.${activeSession.id}`,
         },
         () => {
           fetchOffers();
         }
       )
       .subscribe();
 
     return () => {
       supabase.removeChannel(channel);
     };
   }, [activeSession?.id, nickname]);
 
   const initiateTradeRequest = useCallback(async (targetNickname: string) => {
     if (!nickname) return { success: false, error: "Not logged in" };
     
     setTradeError(null);
 
     // Check if target nickname exists
     const { data: profile } = await supabase
       .from("player_profiles")
       .select("nickname")
       .eq("nickname", targetNickname)
       .maybeSingle();
 
     if (!profile) {
       return { success: false, error: "Not a nickname" };
     }
 
     // Create trade session
     const { data: session, error } = await supabase
       .from("trade_sessions")
       .insert({
         requester_nickname: nickname,
         target_nickname: targetNickname,
         status: "pending",
       })
       .select()
       .single();
 
     if (error) {
       return { success: false, error: "Failed to create trade request" };
     }
 
     setActiveSession(session as TradeSession);
     return { success: true };
   }, [nickname]);
 
   const acceptTradeRequest = useCallback(async () => {
     if (!incomingRequest || !nickname) return;
 
     await supabase
       .from("trade_sessions")
       .update({ status: "trading" })
       .eq("id", incomingRequest.id);
 
     setActiveSession({ ...incomingRequest, status: "trading" });
     setIncomingRequest(null);
   }, [incomingRequest, nickname]);
 
   const declineTradeRequest = useCallback(async () => {
     if (!incomingRequest) return;
 
     await supabase
       .from("trade_sessions")
       .update({ status: "declined" })
       .eq("id", incomingRequest.id);
 
     setIncomingRequest(null);
   }, [incomingRequest]);
 
   const addItemToOffer = useCallback(async (item: InventoryItem) => {
     if (!activeSession || !nickname) return;
 
     // Check if item already in offer
     const existing = myOffers.find((o) => o.item_name === item.name);
 
     if (existing) {
       // Increment quantity
       await supabase
         .from("trade_offers")
         .update({ quantity: existing.quantity + 1 })
         .eq("id", existing.id);
     } else {
       // Add new offer
       await supabase
         .from("trade_offers")
         .insert({
           session_id: activeSession.id,
           nickname: nickname,
           item_name: item.name,
           item_rarity: item.rarity,
           quantity: 1,
         });
     }
   }, [activeSession, nickname, myOffers]);
 
   const removeItemFromOffer = useCallback(async (itemName: string) => {
     if (!activeSession || !nickname) return;
 
     const existing = myOffers.find((o) => o.item_name === itemName);
     if (!existing) return;
 
     if (existing.quantity > 1) {
       await supabase
         .from("trade_offers")
         .update({ quantity: existing.quantity - 1 })
         .eq("id", existing.id);
     } else {
       await supabase
         .from("trade_offers")
         .delete()
         .eq("id", existing.id);
     }
   }, [activeSession, nickname, myOffers]);
 
   const acceptTrade = useCallback(async () => {
     if (!activeSession || !nickname) return;
 
     const isRequester = activeSession.requester_nickname === nickname;
     const updateField = isRequester ? "requester_accepted" : "target_accepted";
 
     await supabase
       .from("trade_sessions")
       .update({ [updateField]: true })
       .eq("id", activeSession.id);
 
     setTradeAccepted(true);
   }, [activeSession, nickname]);
 
   const declineTrade = useCallback(async () => {
     if (!activeSession) return;
 
     await supabase
       .from("trade_sessions")
       .update({ status: "declined" })
       .eq("id", activeSession.id);
 
     setActiveSession(null);
     setMyOffers([]);
     setTheirOffers([]);
     setTradeAccepted(false);
   }, [activeSession]);
 
   const cancelTrade = useCallback(async () => {
     if (!activeSession) return;
 
     await supabase
       .from("trade_sessions")
       .update({ status: "cancelled" })
       .eq("id", activeSession.id);
 
     setActiveSession(null);
     setMyOffers([]);
     setTheirOffers([]);
     setTradeAccepted(false);
   }, [activeSession]);
 
   const completeTrade = useCallback(async () => {
     if (!activeSession) return;
 
     await supabase
       .from("trade_sessions")
       .update({ status: "completed" })
       .eq("id", activeSession.id);
 
     // Increment successful trades for both players
     const { data: requesterProfile } = await supabase
       .from("player_profiles")
       .select("successful_trades")
       .eq("nickname", activeSession.requester_nickname)
       .single();
 
     const { data: targetProfile } = await supabase
       .from("player_profiles")
       .select("successful_trades")
       .eq("nickname", activeSession.target_nickname)
       .single();
 
     if (requesterProfile) {
       await supabase
         .from("player_profiles")
         .update({ successful_trades: (requesterProfile.successful_trades || 0) + 1 })
         .eq("nickname", activeSession.requester_nickname);
     }
 
     if (targetProfile) {
       await supabase
         .from("player_profiles")
         .update({ successful_trades: (targetProfile.successful_trades || 0) + 1 })
         .eq("nickname", activeSession.target_nickname);
     }
 
     setTradeCompleted(true);
   }, [activeSession]);
 
   const resetTradeState = useCallback(() => {
     setActiveSession(null);
     setMyOffers([]);
     setTheirOffers([]);
     setTradeAccepted(false);
     setTradeCompleted(false);
     setTradeError(null);
   }, []);
 
   const getPartnerNickname = useCallback(() => {
     if (!activeSession || !nickname) return null;
     return activeSession.requester_nickname === nickname
       ? activeSession.target_nickname
       : activeSession.requester_nickname;
   }, [activeSession, nickname]);
 
   return {
     activeSession,
     incomingRequest,
     myOffers,
     theirOffers,
     tradeAccepted,
     tradeCompleted,
     tradeError,
     initiateTradeRequest,
     acceptTradeRequest,
     declineTradeRequest,
     addItemToOffer,
     removeItemFromOffer,
     acceptTrade,
     declineTrade,
     cancelTrade,
     completeTrade,
     resetTradeState,
     getPartnerNickname,
   };
 }