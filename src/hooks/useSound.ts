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

// ── Arcade Music Engine ──
// An original chiptune loop (~55s at 140 BPM) in A minor with 4 channels:
// melody (square), harmony/arp (square), bass (triangle), drums (noise)
// Style: adventure / dungeon-crawler — distinctly NOT Mario

let arcadeMusicInterval: ReturnType<typeof setInterval> | null = null;
let arcadePlaying = false;

// Note frequencies (C3-C6)
const N: Record<string, number> = {
  C3:131,D3:147,E3:165,F3:175,G3:196,A3:220,B3:247,
  C4:262,D4:294,E4:330,F4:349,G4:392,A4:440,B4:494,
  C5:523,D5:587,E5:659,F5:698,G5:784,A5:880,B5:988,
  C6:1047,
  _:0, // rest
};

// Original melody — 256 eighth-notes (4 sections × 8 bars × 8 notes)
const MELODY: number[] = [
  // Section A – Adventure theme (Am → Am → F → F → C → C → G → C)
  N.A4, N._, N.E5, N._, N.D5, N._, N.C5, N.A4,
  N.B4, N._, N.C5, N._, N.D5, N._, N.E5, N._,
  N.F5, N._, N.E5, N._, N.D5, N._, N.C5, N._,
  N.A4, N._, N._, N._, N._, N._, N._, N._,
  N.G4, N._, N.C5, N._, N.E5, N._, N.G5, N._,
  N.E5, N._, N.C5, N._, N.G4, N._, N._, N._,
  N.D5, N._, N.B4, N._, N.G4, N._, N.A4, N.B4,
  N.C5, N._, N._, N._, N._, N._, N._, N._,
  // Section B – Rising energy (C → G → Am → Em → F → C → Dm → G)
  N.C5, N.D5, N.E5, N._, N.G5, N._, N.E5, N._,
  N.D5, N._, N.B4, N._, N.G4, N._, N._, N._,
  N.A4, N.C5, N.E5, N._, N.A5, N._, N.E5, N._,
  N.E5, N.D5, N.C5, N.B4, N._, N._, N._, N._,
  N.F5, N._, N.E5, N._, N.D5, N._, N.C5, N._,
  N.B4, N._, N.C5, N._, N.D5, N._, N.E5, N._,
  N.A5, N.G5, N.E5, N.D5, N.C5, N._, N.B4, N._,
  N.A4, N._, N._, N._, N._, N._, N._, N._,
  // Section C – Darker bridge (Am → Dm → G → C → F → Dm → Em → Em)
  N.A4, N._, N.E5, N._, N.A4, N._, N.D5, N._,
  N.C5, N._, N.B4, N._, N.A4, N._, N._, N._,
  N.G4, N._, N.D5, N._, N.G4, N._, N.C5, N._,
  N.B4, N._, N.A4, N._, N.G4, N._, N._, N._,
  N.A4, N._, N.E5, N._, N.A4, N._, N.D5, N._,
  N.C5, N._, N.B4, N._, N.A4, N._, N.G4, N.A4,
  N.B4, N._, N.D5, N._, N.E5, N._, N.G5, N._,
  N.A5, N._, N._, N._, N._, N._, N._, N._,
  // Section D – Finale (Am → F → C → G → Am → F → Em → Am)
  N.A5, N._, N.G5, N.E5, N._, N.C5, N.E5, N._,
  N.G5, N._, N.A5, N._, N.G5, N._, N.E5, N._,
  N.D5, N._, N.E5, N._, N.A5, N._, N.G5, N.E5,
  N.C5, N._, N.D5, N._, N.E5, N._, N._, N._,
  N.A5, N._, N.G5, N.E5, N._, N.C5, N.E5, N._,
  N.G5, N.A5, N.B5, N._, N.A5, N._, N.G5, N._,
  N.E5, N._, N.C5, N._, N.A4, N._, N.E5, N._,
  N.A4, N._, N._, N._, N._, N._, N._, N._,
];

const BASS: number[] = [
  // Section A – Am Am F F C C G C
  N.A3, N._, N.A3, N._, N.E3, N._, N.A3, N._,
  N.A3, N._, N.E3, N._, N.A3, N._, N.E3, N._,
  N.F3, N._, N.F3, N._, N.C3, N._, N.F3, N._,
  N.F3, N._, N.C3, N._, N.F3, N._, N._, N._,
  N.C3, N._, N.C3, N._, N.G3, N._, N.C3, N._,
  N.C3, N._, N.G3, N._, N.C3, N._, N._, N._,
  N.G3, N._, N.G3, N._, N.D3, N._, N.G3, N._,
  N.C3, N._, N.G3, N._, N.C3, N._, N._, N._,
  // Section B – C G Am Em F C Dm G
  N.C3, N._, N.C3, N._, N.G3, N._, N.C3, N._,
  N.G3, N._, N.G3, N._, N.D3, N._, N._, N._,
  N.A3, N._, N.A3, N._, N.E3, N._, N.A3, N._,
  N.E3, N._, N.E3, N._, N.B3, N._, N._, N._,
  N.F3, N._, N.F3, N._, N.C3, N._, N.F3, N._,
  N.C3, N._, N.C3, N._, N.G3, N._, N.C3, N._,
  N.D3, N._, N.D3, N._, N.A3, N._, N.D3, N._,
  N.G3, N._, N.G3, N._, N.D3, N._, N._, N._,
  // Section C – Am Dm G C F Dm Em Em
  N.A3, N._, N.A3, N._, N.E3, N._, N.A3, N._,
  N.D3, N._, N.D3, N._, N.A3, N._, N._, N._,
  N.G3, N._, N.G3, N._, N.D3, N._, N.G3, N._,
  N.C3, N._, N.C3, N._, N.G3, N._, N._, N._,
  N.F3, N._, N.F3, N._, N.C3, N._, N.F3, N._,
  N.D3, N._, N.D3, N._, N.A3, N._, N.D3, N._,
  N.E3, N._, N.E3, N._, N.B3, N._, N.E3, N._,
  N.E3, N._, N.E3, N._, N.B3, N._, N._, N._,
  // Section D – Am F C G Am F Em Am
  N.A3, N._, N.A3, N._, N.E3, N._, N.A3, N._,
  N.F3, N._, N.F3, N._, N.C3, N._, N.F3, N._,
  N.C3, N._, N.C3, N._, N.G3, N._, N.C3, N._,
  N.G3, N._, N.G3, N._, N.D3, N._, N._, N._,
  N.A3, N._, N.A3, N._, N.E3, N._, N.A3, N._,
  N.F3, N._, N.F3, N._, N.C3, N._, N.F3, N._,
  N.E3, N._, N.E3, N._, N.B3, N._, N.E3, N._,
  N.A3, N._, N.A3, N._, N.E3, N._, N._, N._,
];

// Arpeggio chord tones (played as rapid 3-note arpeggio patterns)
// 128 entries: 32 per section (4 arp triggers per bar × 8 bars)
const ARP_CHORDS: number[][] = [
  // Section A – Am Am F F C C G C
  [N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],
  [N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],
  [N.F3,N.A3,N.C4],[N.F3,N.A3,N.C4],[N.F3,N.A3,N.C4],[N.F3,N.A3,N.C4],
  [N.F3,N.A3,N.C4],[N.F3,N.A3,N.C4],[N.F3,N.A3,N.C4],[N.F3,N.A3,N.C4],
  [N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4],
  [N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4],
  [N.G3,N.B3,N.D4],[N.G3,N.B3,N.D4],[N.G3,N.B3,N.D4],[N.G3,N.B3,N.D4],
  [N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4],
  // Section B – C G Am Em F C Dm G
  [N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4],
  [N.G3,N.B3,N.D4],[N.G3,N.B3,N.D4],[N.G3,N.B3,N.D4],[N.G3,N.B3,N.D4],
  [N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],
  [N.E4,N.G4,N.B4],[N.E4,N.G4,N.B4],[N.E4,N.G4,N.B4],[N.E4,N.G4,N.B4],
  [N.F3,N.A3,N.C4],[N.F3,N.A3,N.C4],[N.F3,N.A3,N.C4],[N.F3,N.A3,N.C4],
  [N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4],
  [N.D4,N.F4,N.A4],[N.D4,N.F4,N.A4],[N.D4,N.F4,N.A4],[N.D4,N.F4,N.A4],
  [N.G3,N.B3,N.D4],[N.G3,N.B3,N.D4],[N.G3,N.B3,N.D4],[N.G3,N.B3,N.D4],
  // Section C – Am Dm G C F Dm Em Em
  [N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],
  [N.D4,N.F4,N.A4],[N.D4,N.F4,N.A4],[N.D4,N.F4,N.A4],[N.D4,N.F4,N.A4],
  [N.G3,N.B3,N.D4],[N.G3,N.B3,N.D4],[N.G3,N.B3,N.D4],[N.G3,N.B3,N.D4],
  [N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4],
  [N.F3,N.A3,N.C4],[N.F3,N.A3,N.C4],[N.F3,N.A3,N.C4],[N.F3,N.A3,N.C4],
  [N.D4,N.F4,N.A4],[N.D4,N.F4,N.A4],[N.D4,N.F4,N.A4],[N.D4,N.F4,N.A4],
  [N.E4,N.G4,N.B4],[N.E4,N.G4,N.B4],[N.E4,N.G4,N.B4],[N.E4,N.G4,N.B4],
  [N.E4,N.G4,N.B4],[N.E4,N.G4,N.B4],[N.E4,N.G4,N.B4],[N.E4,N.G4,N.B4],
  // Section D – Am F C G Am F Em Am
  [N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],
  [N.F3,N.A3,N.C4],[N.F3,N.A3,N.C4],[N.F3,N.A3,N.C4],[N.F3,N.A3,N.C4],
  [N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4],
  [N.G3,N.B3,N.D4],[N.G3,N.B3,N.D4],[N.G3,N.B3,N.D4],[N.G3,N.B3,N.D4],
  [N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],
  [N.F3,N.A3,N.C4],[N.F3,N.A3,N.C4],[N.F3,N.A3,N.C4],[N.F3,N.A3,N.C4],
  [N.E4,N.G4,N.B4],[N.E4,N.G4,N.B4],[N.E4,N.G4,N.B4],[N.E4,N.G4,N.B4],
  [N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],
];

// Drum pattern: 0=rest, 1=kick, 2=snare, 3=hihat, 4=kick+hihat
const DRUM_PATTERN = [
  4,3,3,3, 2,3,4,3, 1,3,3,3, 2,3,3,0,
  4,3,4,3, 2,3,3,3, 4,3,3,3, 2,0,0,0,
];

function startArcadeMusic() {
  if (arcadePlaying) return;
  const ctx = getCtx();
  if (!ctx) return;
  arcadePlaying = true;

  const BPM = 140;
  const eighthNote = (60 / BPM) / 2;
  let step = 0;
  const totalSteps = MELODY.length; // 256 steps

  function scheduleNote(
    freq: number, duration: number, type: OscillatorType,
    volume: number, startTime: number
  ) {
    if (freq <= 0 || !arcadePlaying) return;
    const c = getCtx();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.95);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  function scheduleDrum(type: number, startTime: number) {
    if (!arcadePlaying) return;
    const c = getCtx();
    if (!c) return;

    if (type === 1 || type === 4) {
      // Kick — low sine thump
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(150, startTime);
      osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.08);
      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.12);
    }
    if (type === 2) {
      // Snare — noise burst
      const bufSz = Math.floor(c.sampleRate * 0.08);
      const buf = c.createBuffer(1, bufSz, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufSz; i++) d[i] = Math.random() * 2 - 1;
      const src = c.createBufferSource();
      src.buffer = buf;
      const gain = c.createGain();
      const filt = c.createBiquadFilter();
      filt.type = "highpass";
      filt.frequency.value = 2000;
      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);
      src.connect(filt);
      filt.connect(gain);
      gain.connect(c.destination);
      src.start(startTime);
      src.stop(startTime + 0.1);
    }
    if (type === 3 || type === 4) {
      // Hi-hat — short bright noise
      const bufSz = Math.floor(c.sampleRate * 0.03);
      const buf = c.createBuffer(1, bufSz, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufSz; i++) d[i] = Math.random() * 2 - 1;
      const src = c.createBufferSource();
      src.buffer = buf;
      const gain = c.createGain();
      const filt = c.createBiquadFilter();
      filt.type = "highpass";
      filt.frequency.value = 6000;
      gain.gain.setValueAtTime(0.05, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.03);
      src.connect(filt);
      filt.connect(gain);
      gain.connect(c.destination);
      src.start(startTime);
      src.stop(startTime + 0.05);
    }
  }

  // Schedule a batch of notes ahead of time (look-ahead scheduling for smooth playback)
  const BATCH = 8;

  function scheduleBatch() {
    if (!arcadePlaying) return;
    const c = getCtx();
    if (!c) return;

    for (let i = 0; i < BATCH; i++) {
      const idx = step % totalSteps;
      const t = c.currentTime + i * eighthNote;

      // Melody (square wave)
      const melFreq = MELODY[idx];
      if (melFreq > 0) {
        scheduleNote(melFreq, eighthNote * 0.85, "square", 0.06, t);
      }

      // Bass (triangle wave)
      const bassFreq = BASS[idx % BASS.length];
      if (bassFreq > 0) {
        scheduleNote(bassFreq, eighthNote * 0.9, "triangle", 0.05, t);
      }

      // Arpeggio (every 2 steps, play a 3-note rapid arp)
      const arpIdx = Math.floor(idx / 2) % ARP_CHORDS.length;
      if (idx % 2 === 0) {
        const chord = ARP_CHORDS[arpIdx];
        if (chord) {
          for (let n = 0; n < chord.length; n++) {
            scheduleNote(chord[n], eighthNote * 0.3, "square", 0.025, t + n * eighthNote * 0.15);
          }
        }
      }

      // Drums
      const drumType = DRUM_PATTERN[idx % DRUM_PATTERN.length];
      if (drumType > 0) {
        scheduleDrum(drumType, t);
      }

      step++;
    }
  }

  scheduleBatch();
  arcadeMusicInterval = setInterval(scheduleBatch, BATCH * eighthNote * 1000 * 0.9);
}

function stopArcadeMusic() {
  arcadePlaying = false;
  if (arcadeMusicInterval) {
    clearInterval(arcadeMusicInterval);
    arcadeMusicInterval = null;
  }
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

  const playMysticalReveal = useCallback(() => {
    // Extended ascending arpeggio: C5 -> E5 -> G5 -> C6 -> E6
    playTone(523, 0.15, "sine", 0.3);
    playTone(659, 0.15, "sine", 0.3, 0.1);
    playTone(784, 0.15, "sine", 0.3, 0.2);
    playTone(1047, 0.2, "sine", 0.35, 0.3);
    playTone(1319, 0.3, "sine", 0.35, 0.42);
    // Wide sweep for grandeur
    playSweep(2000, 8000, 0.8, "sine", 0.1);
    // Sparkle noise
    playNoise(0.8, 0.1);
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

  // Block Buster: ball hits wall/paddle
  const playBounce = useCallback(() => {
    playTone(400, 0.03, "square", 0.15);
  }, []);

  // Block Buster: brick destroyed
  const playBreak = useCallback(() => {
    playSweep(300, 600, 0.1, "square", 0.2);
  }, []);

  // Block Buster: item caught / Steal & Get: item from box
  const playCollect = useCallback(() => {
    playTone(500, 0.08, "sine", 0.2);
    playTone(900, 0.1, "sine", 0.2, 0.06);
  }, []);

  // Fishing: casting line
  const playCast = useCallback(() => {
    playSweep(800, 200, 0.3, "sine", 0.2);
  }, []);

  // Fishing: fish bites — 3 rapid high ticks
  const playBite = useCallback(() => {
    playTone(1200, 0.04, "square", 0.2);
    playTone(1200, 0.04, "square", 0.2, 0.07);
    playTone(1200, 0.04, "square", 0.2, 0.14);
  }, []);

  // Fishing: fish reeled in — C5->E5->G5 ascending arpeggio
  const playCaught = useCallback(() => {
    playTone(523, 0.1, "sine", 0.25);
    playTone(659, 0.1, "sine", 0.25, 0.08);
    playTone(784, 0.15, "sine", 0.3, 0.16);
  }, []);

  // Fishing: fish got away
  const playMissed = useCallback(() => {
    playSweep(400, 200, 0.2, "sine", 0.2);
  }, []);

  // Steal & Get: stealing from opponent
  const playSteal = useCallback(() => {
    playSweep(200, 500, 0.25, "sawtooth", 0.15);
  }, []);

  // Steal & Get: stolen FROM you — buzzy double beep
  const playStolenAlert = useCallback(() => {
    playTone(800, 0.15, "sawtooth", 0.2);
    playTone(800, 0.15, "sawtooth", 0.2, 0.2);
  }, []);

  // Block Buster: ball lost
  const playDeath = useCallback(() => {
    playTone(150, 0.15, "sawtooth", 0.2);
  }, []);

  // All games: last 10 seconds warning tick
  const playTimerWarning = useCallback(() => {
    playTone(1000, 0.05, "square", 0.15);
  }, []);

  // All games: time's up
  const playGameEnd = useCallback(() => {
    playTone(600, 0.12, "square", 0.2);
    playTone(400, 0.2, "square", 0.2, 0.1);
    playNoise(0.15, 0.08);
  }, []);

  return {
    playClick,
    playHover,
    playPackOpen,
    playReveal,
    playRareReveal,
    playEpicReveal,
    playMysticalReveal,
    playGameStart,
    playGameWin,
    playGameLose,
    playTick,
    playCorrect,
    playWrong,
    playConfetti,
    playBounce,
    playBreak,
    playCollect,
    playCast,
    playBite,
    playCaught,
    playMissed,
    playSteal,
    playStolenAlert,
    playDeath,
    playTimerWarning,
    playGameEnd,
    startArcadeMusic,
    stopArcadeMusic,
  };
}

export type SoundFunctions = ReturnType<typeof useSound>;
