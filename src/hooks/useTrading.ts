import { useState, useEffect, useCallback, useRef } from "react";
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
  const offerLockRef = useRef<Promise<void>>(Promise.resolve());
  const tradeAbortedRef = useRef(false);

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

    setTradeCompleted(false);
    setTradeAccepted(false);
    setActiveSession(session as TradeSession);
    return { success: true };
  }, [nickname]);

  const acceptTradeRequest = useCallback(async () => {
    if (!incomingRequest || !nickname) return;

    await supabase
      .from("trade_sessions")
      .update({ status: "trading" })
      .eq("id", incomingRequest.id);

    setTradeCompleted(false);
    setTradeAccepted(false);
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

    const sessionId = activeSession.id;
    // Optimistic local update for instant UI feedback
    setMyOffers(prev => {
      const existing = prev.find((o) => o.item_name === item.name);
      if (existing) {
        return prev.map(o =>
          o.item_name === item.name ? { ...o, quantity: o.quantity + 1 } : o
        );
      }
      return [...prev, {
        id: `temp-${Date.now()}`,
        session_id: sessionId,
        nickname,
        item_name: item.name,
        item_rarity: item.rarity,
        quantity: 1,
      }];
    });

    // Serialized DB sync — fetches latest from DB to avoid stale state
    offerLockRef.current = offerLockRef.current.then(async () => {
      const { data: existing } = await supabase
        .from("trade_offers")
        .select("*")
        .eq("session_id", sessionId)
        .eq("nickname", nickname)
        .eq("item_name", item.name)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("trade_offers")
          .update({ quantity: existing.quantity + 1 })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("trade_offers")
          .insert({
            session_id: sessionId,
            nickname,
            item_name: item.name,
            item_rarity: item.rarity,
            quantity: 1,
          });
      }
    });
  }, [activeSession, nickname]);

  const removeItemFromOffer = useCallback(async (itemName: string) => {
    if (!activeSession || !nickname) return;

    const sessionId = activeSession.id;
    // Optimistic local update
    setMyOffers(prev => {
      const existing = prev.find((o) => o.item_name === itemName);
      if (!existing) return prev;
      if (existing.quantity > 1) {
        return prev.map(o =>
          o.item_name === itemName ? { ...o, quantity: o.quantity - 1 } : o
        );
      }
      return prev.filter(o => o.item_name !== itemName);
    });

    // Serialized DB sync
    offerLockRef.current = offerLockRef.current.then(async () => {
      const { data: existing } = await supabase
        .from("trade_offers")
        .select("*")
        .eq("session_id", sessionId)
        .eq("nickname", nickname)
        .eq("item_name", itemName)
        .maybeSingle();

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
    });
  }, [activeSession, nickname]);

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
    if (!activeSession || !nickname) return;

    tradeAbortedRef.current = false;

    // Status update is idempotent — both players can call this safely
    await supabase
      .from("trade_sessions")
      .update({ status: "completed" })
      .eq("id", activeSession.id);

    // Only the requester increments trade counters (prevents double-increment)
    if (activeSession.requester_nickname === nickname) {
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
    }

    // Only set if trade hasn't been reset in the meantime (prevents stale flag)
    if (!tradeAbortedRef.current) {
      setTradeCompleted(true);
    }
  }, [activeSession, nickname]);

  const resetTradeState = useCallback(() => {
    tradeAbortedRef.current = true;
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
