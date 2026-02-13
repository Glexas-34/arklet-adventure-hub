import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface PeerState {
  connection: RTCPeerConnection;
  audioEl: HTMLAudioElement;
}

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export function useVoiceChat() {
  const [isActive, setIsActive] = useState(false);
  const [peerCount, setPeerCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState(0);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const notifyChannelRef = useRef<RealtimeChannel | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<Map<string, PeerState>>(new Map());
  const nicknameRef = useRef<string>("");
  const activeRef = useRef(false);

  const updatePeerCount = useCallback(() => {
    setPeerCount(peersRef.current.size);
  }, []);

  const createPeerConnection = useCallback(
    (remoteNickname: string): RTCPeerConnection => {
      const pc = new RTCPeerConnection(ICE_SERVERS);

      // Add local audio tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      // Handle remote audio
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;

      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0] || new MediaStream([e.track]);
      };

      // Send ICE candidates via broadcast
      pc.onicecandidate = (e) => {
        if (e.candidate && channelRef.current) {
          channelRef.current.send({
            type: "broadcast",
            event: "ice-candidate",
            payload: {
              from: nicknameRef.current,
              to: remoteNickname,
              candidate: e.candidate.toJSON(),
            },
          });
        }
      };

      peersRef.current.set(remoteNickname, { connection: pc, audioEl });
      updatePeerCount();
      return pc;
    },
    [updatePeerCount]
  );

  const closePeer = useCallback(
    (nickname: string) => {
      const peer = peersRef.current.get(nickname);
      if (peer) {
        peer.connection.close();
        peer.audioEl.srcObject = null;
        peer.audioEl.remove();
        peersRef.current.delete(nickname);
        updatePeerCount();
      }
    },
    [updatePeerCount]
  );

  const closeAllPeers = useCallback(() => {
    peersRef.current.forEach((_, nick) => closePeer(nick));
  }, [closePeer]);

  const handleOffer = useCallback(
    async (from: string, sdp: RTCSessionDescriptionInit) => {
      if (!activeRef.current) return;
      // Close existing connection if any
      closePeer(from);
      const pc = createPeerConnection(from);
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      channelRef.current?.send({
        type: "broadcast",
        event: "answer",
        payload: {
          from: nicknameRef.current,
          to: from,
          sdp: answer,
        },
      });
    },
    [createPeerConnection, closePeer]
  );

  const handleAnswer = useCallback(
    async (from: string, sdp: RTCSessionDescriptionInit) => {
      const peer = peersRef.current.get(from);
      if (peer) {
        await peer.connection.setRemoteDescription(
          new RTCSessionDescription(sdp)
        );
      }
    },
    []
  );

  const handleIceCandidate = useCallback(
    async (from: string, candidate: RTCIceCandidateInit) => {
      const peer = peersRef.current.get(from);
      if (peer) {
        await peer.connection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    },
    []
  );

  const initiateConnection = useCallback(
    async (remoteNickname: string) => {
      if (!activeRef.current) return;
      // Close existing if any
      closePeer(remoteNickname);
      const pc = createPeerConnection(remoteNickname);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      channelRef.current?.send({
        type: "broadcast",
        event: "offer",
        payload: {
          from: nicknameRef.current,
          to: remoteNickname,
          sdp: offer,
        },
      });
    },
    [createPeerConnection, closePeer]
  );

  const toggleVoice = useCallback(
    async (nickname: string | null) => {
      if (!nickname) return;

      if (activeRef.current) {
        // Turn OFF
        activeRef.current = false;
        setIsActive(false);
        setError(null);

        // Stop local media
        localStreamRef.current?.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;

        // Close all peer connections
        closeAllPeers();

        // Untrack from global presence
        notifyChannelRef.current?.untrack();

        // Leave channel
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
        return;
      }

      // Turn ON
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        localStreamRef.current = stream;
        nicknameRef.current = nickname;
      } catch {
        setError("Microphone access denied");
        return;
      }

      activeRef.current = true;
      setIsActive(true);
      setError(null);

      // Broadcast notification to everyone & track presence on global channel
      notifyChannelRef.current?.send({
        type: "broadcast",
        event: "sac-active",
        payload: { nickname },
      });
      notifyChannelRef.current?.track({ nickname });

      const channel = supabase.channel("voice-chat", {
        config: { broadcast: { self: false }, presence: { key: nickname } },
      });

      channel
        .on("presence", { event: "sync" }, () => {
          if (!activeRef.current) return;
          const state = channel.presenceState();
          const presentNicknames = Object.keys(state).filter(
            (n) => n !== nicknameRef.current
          );

          // Close connections for peers who left
          peersRef.current.forEach((_, peerNick) => {
            if (!presentNicknames.includes(peerNick)) {
              closePeer(peerNick);
            }
          });

          // Initiate connections to new peers (deterministic: lower alpha initiates)
          presentNicknames.forEach((peerNick) => {
            if (!peersRef.current.has(peerNick)) {
              if (nicknameRef.current < peerNick) {
                initiateConnection(peerNick);
              }
              // else: the other side will initiate
            }
          });
        })
        .on("broadcast", { event: "offer" }, ({ payload }) => {
          if (payload.to === nicknameRef.current) {
            handleOffer(payload.from, payload.sdp);
          }
        })
        .on("broadcast", { event: "answer" }, ({ payload }) => {
          if (payload.to === nicknameRef.current) {
            handleAnswer(payload.from, payload.sdp);
          }
        })
        .on("broadcast", { event: "ice-candidate" }, ({ payload }) => {
          if (payload.to === nicknameRef.current) {
            handleIceCandidate(payload.from, payload.candidate);
          }
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await channel.track({ nickname });
          }
        });

      channelRef.current = channel;
    },
    [closeAllPeers, closePeer, initiateConnection, handleOffer, handleAnswer, handleIceCandidate]
  );

  // Global notification channel — everyone subscribes so they see when someone joins
  // Also uses presence so all clients know how many users are currently on SAC
  useEffect(() => {
    const notify = supabase.channel("sac-notify", {
      config: { broadcast: { self: false }, presence: { key: "_" } },
    });

    notify
      .on("broadcast", { event: "sac-active" }, ({ payload }) => {
        if (!activeRef.current && payload?.nickname) {
          setNotification(payload.nickname);
        }
      })
      .on("presence", { event: "sync" }, () => {
        const state = notify.presenceState();
        const count = Object.values(state).reduce((sum, arr) => sum + arr.length, 0);
        setActiveUsers(count);
      })
      .subscribe();

    notifyChannelRef.current = notify;

    return () => {
      supabase.removeChannel(notify);
      notifyChannelRef.current = null;
    };
  }, []);

  // Auto-dismiss notification after 8 seconds
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 8000);
    return () => clearTimeout(t);
  }, [notification]);

  const dismissNotification = useCallback(() => setNotification(null), []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      activeRef.current = false;
      notifyChannelRef.current?.untrack();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      peersRef.current.forEach((peer) => {
        peer.connection.close();
        peer.audioEl.srcObject = null;
        peer.audioEl.remove();
      });
      peersRef.current.clear();
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  return { isActive, peerCount, error, toggleVoice, notification, dismissNotification, activeUsers };
}
