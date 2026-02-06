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

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function Confetti({ trigger, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const newParticles: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 20,
      y: 40 + (Math.random() - 0.5) * 10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      angle: Math.random() * 360,
      speed: 2 + Math.random() * 4,
      spin: (Math.random() - 0.5) * 10,
      opacity: 1,
    }));

    setParticles(newParticles);

    const timeout = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, 1800);

    return () => clearTimeout(timeout);
  }, [trigger, onComplete]);

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
            animationDuration: "1.6s",
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
