import { useCallback, useRef } from "react";

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (!audioCtx) {
    try {
      audioCtx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.3,
  delay = 0
) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration + 0.05);
}

function playSweep(
  startFreq: number,
  endFreq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.3
) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration + 0.05);
}

function playNoise(duration: number, volume = 0.1) {
  const ctx = getCtx();
  if (!ctx) return;
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 3000;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(ctx.currentTime);
  source.stop(ctx.currentTime + duration + 0.05);
}

export function useSound() {
  const lastHover = useRef(0);

  const playClick = useCallback(() => {
    playTone(800, 0.05, "sine", 0.2);
  }, []);

  const playHover = useCallback(() => {
    const now = Date.now();
    if (now - lastHover.current < 60) return;
    lastHover.current = now;
    playTone(600, 0.03, "sine", 0.08);
  }, []);

  const playPackOpen = useCallback(() => {
    playSweep(200, 800, 0.3, "sine", 0.25);
  }, []);

  const playReveal = useCallback(() => {
    playTone(523, 0.12, "sine", 0.2);
    playTone(659, 0.15, "sine", 0.2, 0.1);
  }, []);

  const playRareReveal = useCallback(() => {
    playTone(523, 0.12, "sine", 0.25);
    playTone(659, 0.12, "sine", 0.25, 0.1);
    playTone(784, 0.12, "sine", 0.25, 0.2);
    playTone(1047, 0.2, "sine", 0.3, 0.3);
    playNoise(0.4, 0.05);
  }, []);

  const playEpicReveal = useCallback(() => {
    playTone(523, 0.15, "sine", 0.3);
    playTone(659, 0.15, "sine", 0.3, 0.12);
    playTone(784, 0.15, "sine", 0.3, 0.24);
    playTone(1047, 0.3, "sine", 0.35, 0.36);
    playSweep(2000, 6000, 0.6, "sine", 0.08);
    playNoise(0.6, 0.08);
  }, []);

  const playGameStart = useCallback(() => {
    playTone(523, 0.1, "square", 0.15);
    playTone(659, 0.1, "square", 0.15, 0.1);
    playTone(784, 0.15, "square", 0.2, 0.2);
  }, []);

  const playGameWin = useCallback(() => {
    playTone(523, 0.1, "sine", 0.25);
    playTone(659, 0.1, "sine", 0.25, 0.08);
    playTone(784, 0.1, "sine", 0.25, 0.16);
    playTone(1047, 0.25, "sine", 0.3, 0.24);
    playNoise(0.3, 0.04);
  }, []);

  const playGameLose = useCallback(() => {
    playTone(400, 0.15, "sine", 0.2);
    playTone(300, 0.25, "sine", 0.2, 0.12);
  }, []);

  const playTick = useCallback(() => {
    playTone(1000, 0.02, "square", 0.1);
  }, []);

  const playCorrect = useCallback(() => {
    playTone(600, 0.08, "sine", 0.2);
    playTone(800, 0.1, "sine", 0.2, 0.06);
  }, []);

  const playWrong = useCallback(() => {
    playTone(150, 0.1, "sawtooth", 0.15);
  }, []);

  const playConfetti = useCallback(() => {
    playSweep(1000, 4000, 0.3, "sine", 0.1);
    playNoise(0.3, 0.06);
  }, []);

  return {
    playClick,
    playHover,
    playPackOpen,
    playReveal,
    playRareReveal,
    playEpicReveal,
    playGameStart,
    playGameWin,
    playGameLose,
    playTick,
    playCorrect,
    playWrong,
    playConfetti,
  };
}

export type SoundFunctions = ReturnType<typeof useSound>;
