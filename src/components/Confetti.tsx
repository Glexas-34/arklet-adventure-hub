import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  speed: number;
  spin: number;
  opacity: number;
}

const COLORS = [
  "#ff1744", "#ff9800", "#ffeb3b", "#4caf50",
  "#2196f3", "#9c27b0", "#e91e63", "#00e5ff",
  "#76ff03", "#ff6d00", "#f50057", "#651fff",
];

type ConfettiIntensity = "normal" | "mystical";

interface ConfettiProps {
  trigger: boolean;
  intensity?: ConfettiIntensity;
  onComplete?: () => void;
}

export function Confetti({ trigger, intensity = "normal", onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const isMystical = intensity === "mystical";
  const particleCount = isMystical ? 100 : 40;
  const duration = isMystical ? 2200 : 1800;
  const animDuration = isMystical ? "2.2s" : "1.6s";

  useEffect(() => {
    if (!trigger) return;

    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * (isMystical ? 30 : 20),
      y: 40 + (Math.random() - 0.5) * (isMystical ? 15 : 10),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: isMystical ? 8 + Math.random() * 12 : 6 + Math.random() * 8,
      angle: Math.random() * 360,
      speed: 2 + Math.random() * (isMystical ? 6 : 4),
      spin: (Math.random() - 0.5) * 10,
      opacity: 1,
    }));

    setParticles(newParticles);

    const timeout = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timeout);
  }, [trigger, onComplete, particleCount, duration, isMystical]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute confetti-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: "2px",
            "--angle": `${p.angle}deg`,
            "--speed": `${p.speed}`,
            "--spin": `${p.spin}`,
            animationDuration: animDuration,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
