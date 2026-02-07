import { motion } from "framer-motion";

interface IconProps {
  size?: number;
  className?: string;
}

export function ClassicIcon({ size = 80, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      {/* Outer glow ring */}
      <circle cx="40" cy="40" r="34" stroke="url(#classicGrad)" strokeWidth="3" opacity="0.3" />
      {/* Target rings */}
      <circle cx="40" cy="40" r="28" fill="#ef444420" stroke="#ef4444" strokeWidth="2" />
      <circle cx="40" cy="40" r="20" fill="#f9731620" stroke="#f97316" strokeWidth="2" />
      <circle cx="40" cy="40" r="12" fill="#eab30820" stroke="#eab308" strokeWidth="2" />
      <circle cx="40" cy="40" r="5" fill="#ef4444" />
      {/* Cards fanned out behind */}
      <rect x="8" y="14" width="18" height="24" rx="3" fill="#6366f1" opacity="0.6" transform="rotate(-20 17 26)" />
      <rect x="54" y="14" width="18" height="24" rx="3" fill="#8b5cf6" opacity="0.6" transform="rotate(20 63 26)" />
      {/* Sparkle accents */}
      <circle cx="16" cy="16" r="1.5" fill="#fbbf24">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="64" cy="18" r="1.5" fill="#fbbf24">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="40" cy="8" r="1" fill="#fbbf24">
        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <defs>
        <linearGradient id="classicGrad" x1="6" y1="6" x2="74" y2="74">
          <stop stopColor="#ef4444" />
          <stop offset="1" stopColor="#f97316" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function StealAndGetIcon({ size = 80, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      {/* Gift box body */}
      <rect x="16" y="38" width="48" height="30" rx="4" fill="url(#stealBoxGrad)" />
      {/* Gift box lid */}
      <rect x="12" y="30" width="56" height="12" rx="4" fill="url(#stealLidGrad)" />
      {/* Ribbon vertical */}
      <rect x="36" y="30" width="8" height="38" fill="#fbbf24" opacity="0.8" />
      {/* Ribbon horizontal */}
      <rect x="12" y="33" width="56" height="6" fill="#fbbf24" opacity="0.8" />
      {/* Ribbon bow */}
      <ellipse cx="40" cy="28" rx="10" ry="7" fill="#fbbf24" />
      <ellipse cx="40" cy="28" rx="6" ry="4" fill="url(#stealLidGrad)" />
      {/* Sparkles flying out */}
      <path d="M28 20L30 14L32 20L30 18Z" fill="#f472b6">
        <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate" values="0,0;-2,-4;0,0" dur="1.2s" repeatCount="indefinite" />
      </path>
      <path d="M50 18L52 12L54 18L52 16Z" fill="#a78bfa">
        <animate attributeName="opacity" values="0.2;1;0.2" dur="1.4s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate" values="0,0;2,-3;0,0" dur="1.4s" repeatCount="indefinite" />
      </path>
      <path d="M40 14L41 8L42 14L41 12Z" fill="#38bdf8">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-4;0,0" dur="1s" repeatCount="indefinite" />
      </path>
      {/* Question mark on box */}
      <text x="40" y="58" textAnchor="middle" fill="#ffffff80" fontSize="14" fontWeight="bold" fontFamily="sans-serif">?</text>
      {/* Eye / spy peek */}
      <circle cx="60" cy="48" r="6" fill="#1e1b4b" stroke="#a78bfa" strokeWidth="1.5" />
      <circle cx="61" cy="47" r="2.5" fill="#a78bfa" />
      <circle cx="62" cy="46" r="1" fill="#fff" />
      <defs>
        <linearGradient id="stealBoxGrad" x1="16" y1="38" x2="64" y2="68">
          <stop stopColor="#7c3aed" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="stealLidGrad" x1="12" y1="30" x2="68" y2="42">
          <stop stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function BlockBusterIcon({ size = 80, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      {/* Brick rows */}
      <rect x="8" y="10" width="20" height="10" rx="2" fill="#ef4444" />
      <rect x="30" y="10" width="20" height="10" rx="2" fill="#ef4444" />
      <rect x="52" y="10" width="20" height="10" rx="2" fill="#ef4444" />
      <rect x="8" y="22" width="20" height="10" rx="2" fill="#f97316" />
      <rect x="30" y="22" width="20" height="10" rx="2" fill="#f97316" />
      <rect x="52" y="22" width="20" height="10" rx="2" fill="#f97316" />
      <rect x="8" y="34" width="20" height="10" rx="2" fill="#eab308" />
      <rect x="30" y="34" width="20" height="10" rx="2" fill="#eab308" />
      {/* Broken brick with crack */}
      <rect x="52" y="34" width="20" height="10" rx="2" fill="#eab308" opacity="0.4" />
      <line x1="56" y1="34" x2="68" y2="44" stroke="#fff" strokeWidth="1" opacity="0.5" />
      <line x1="62" y1="34" x2="58" y2="44" stroke="#fff" strokeWidth="1" opacity="0.5" />
      {/* Ball */}
      <circle cx="55" cy="52" r="5" fill="#ffffff">
        <animate attributeName="cy" values="52;48;52" dur="0.8s" repeatCount="indefinite" />
      </circle>
      {/* Motion trail */}
      <circle cx="55" cy="56" r="3" fill="#ffffff" opacity="0.3">
        <animate attributeName="cy" values="56;52;56" dur="0.8s" repeatCount="indefinite" />
      </circle>
      {/* Paddle */}
      <rect x="22" y="66" width="36" height="6" rx="3" fill="#06b6d4" />
      {/* Glow under paddle */}
      <rect x="26" y="68" width="28" height="2" rx="1" fill="#06b6d4" opacity="0.3" />
      {/* Diamond drop */}
      <path d="M40 50L44 55L40 60L36 55Z" fill="#22c55e" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate" values="0,0;0,3;0,0" dur="1.5s" repeatCount="indefinite" />
      </path>
      {/* Explosion particles from broken brick */}
      <circle cx="62" cy="46" r="1.5" fill="#eab308" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0;0.6" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="58" cy="48" r="1" fill="#eab308" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0;0.4" dur="1.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export function FishingIcon({ size = 80, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      {/* Water */}
      <path d="M0 50 Q10 47 20 50 Q30 53 40 50 Q50 47 60 50 Q70 53 80 50 L80 80 L0 80Z" fill="#0d47a1" opacity="0.6">
        <animate attributeName="d" values="M0 50 Q10 47 20 50 Q30 53 40 50 Q50 47 60 50 Q70 53 80 50 L80 80 L0 80Z;M0 50 Q10 53 20 50 Q30 47 40 50 Q50 53 60 50 Q70 47 80 50 L80 80 L0 80Z;M0 50 Q10 47 20 50 Q30 53 40 50 Q50 47 60 50 Q70 53 80 50 L80 80 L0 80Z" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M0 55 Q10 52 20 55 Q30 58 40 55 Q50 52 60 55 Q70 58 80 55 L80 80 L0 80Z" fill="#01579b" opacity="0.4">
        <animate attributeName="d" values="M0 55 Q10 52 20 55 Q30 58 40 55 Q50 52 60 55 Q70 58 80 55 L80 80 L0 80Z;M0 55 Q10 58 20 55 Q30 52 40 55 Q50 58 60 55 Q70 52 80 55 L80 80 L0 80Z;M0 55 Q10 52 20 55 Q30 58 40 55 Q50 52 60 55 Q70 58 80 55 L80 80 L0 80Z" dur="4s" repeatCount="indefinite" />
      </path>
      {/* Fishing rod */}
      <line x1="12" y1="45" x2="52" y2="12" stroke="#8d6e63" strokeWidth="3" strokeLinecap="round" />
      {/* Rod handle */}
      <line x1="8" y1="48" x2="16" y2="43" stroke="#5d4037" strokeWidth="4" strokeLinecap="round" />
      {/* Fishing line */}
      <path d="M52 12 Q54 35 50 52" stroke="#ffffff60" strokeWidth="1" fill="none" />
      {/* Bobber */}
      <circle cx="50" cy="52" r="4" fill="#f44336">
        <animate attributeName="cy" values="52;49;52" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="50" r="2" fill="#ffffff">
        <animate attributeName="cy" values="50;47;50" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Splash rings */}
      <ellipse cx="50" cy="54" rx="8" ry="2" stroke="#ffffff30" strokeWidth="1" fill="none">
        <animate attributeName="rx" values="8;12;8" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
      </ellipse>
      {/* Fish silhouette under water */}
      <path d="M30 62 Q35 58 42 62 Q35 66 30 62Z" fill="#4fc3f7" opacity="0.4">
        <animateTransform attributeName="transform" type="translate" values="0,0;8,0;0,0" dur="3s" repeatCount="indefinite" />
      </path>
      <circle cx="38" cy="61.5" r="1" fill="#fff" opacity="0.3">
        <animateTransform attributeName="transform" type="translate" values="0,0;8,0;0,0" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Bubbles */}
      <circle cx="45" cy="65" r="1.5" fill="#ffffff20">
        <animate attributeName="cy" values="65;58;65" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0;0.2" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="55" cy="68" r="1" fill="#ffffff20">
        <animate attributeName="cy" values="68;60;68" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0;0.15" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export function PlatformRunIcon({ size = 80, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      {/* Platforms */}
      <rect x="4" y="58" width="30" height="6" rx="3" fill="#4ade80" />
      <rect x="42" y="46" width="34" height="6" rx="3" fill="#4ade80" />
      <rect x="16" y="32" width="28" height="6" rx="3" fill="#4ade80" />
      {/* Grass detail */}
      <rect x="6" y="58" width="26" height="2" rx="1" fill="#22c55e" />
      <rect x="44" y="46" width="30" height="2" rx="1" fill="#22c55e" />
      <rect x="18" y="32" width="24" height="2" rx="1" fill="#22c55e" />
      {/* Player character */}
      <rect x="20" y="18" width="12" height="14" rx="3" fill="#3b82f6">
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="0.6s" repeatCount="indefinite" />
      </rect>
      {/* Player eye */}
      <circle cx="29" cy="23" r="2" fill="#fff">
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="0.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="29.5" cy="23" r="1" fill="#000">
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="0.6s" repeatCount="indefinite" />
      </circle>
      {/* Diamond items on platforms */}
      <path d="M56 38L59 42L56 46L53 42Z" fill="#eab308" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.5s" repeatCount="indefinite" />
      </path>
      <path d="M14 50L17 54L14 58L11 54Z" fill="#a78bfa" opacity="0.8">
        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1.8s" repeatCount="indefinite" />
      </path>
      {/* Motion lines behind player */}
      <line x1="12" y1="22" x2="18" y2="22" stroke="#3b82f6" strokeWidth="1.5" opacity="0.4">
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="0.6s" repeatCount="indefinite" />
      </line>
      <line x1="10" y1="26" x2="17" y2="26" stroke="#3b82f6" strokeWidth="1" opacity="0.3">
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="0.6s" repeatCount="indefinite" />
      </line>
      {/* Sparkle */}
      <circle cx="66" cy="18" r="1.5" fill="#fbbf24">
        <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export function FlappyBirdIcon({ size = 80, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      {/* Sky background circle */}
      <circle cx="40" cy="40" r="34" fill="#0ea5e910" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.3" />
      {/* Bird body */}
      <ellipse cx="34" cy="32" rx="12" ry="10" fill="#facc15">
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="0.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Wing */}
      <ellipse cx="30" cy="30" rx="8" ry="5" fill="#f59e0b" transform="rotate(-10 30 30)">
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="0.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Eye */}
      <circle cx="39" cy="28" r="4" fill="#fff">
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="0.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="40" cy="28" r="2" fill="#000">
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="0.5s" repeatCount="indefinite" />
      </circle>
      {/* Beak */}
      <path d="M44 31L52 34L44 37Z" fill="#ef4444">
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="0.5s" repeatCount="indefinite" />
      </path>
      {/* Pipes */}
      <rect x="12" y="50" width="14" height="30" rx="2" fill="#22c55e" />
      <rect x="9" y="48" width="20" height="8" rx="2" fill="#16a34a" />
      <rect x="56" y="0" width="14" height="30" rx="2" fill="#22c55e" />
      <rect x="53" y="26" width="20" height="8" rx="2" fill="#16a34a" />
      {/* Diamond drop between pipes */}
      <path d="M40 56L44 61L40 66L36 61Z" fill="#a78bfa" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.5s" repeatCount="indefinite" />
      </path>
      {/* Sparkles */}
      <circle cx="62" cy="44" r="1.5" fill="#fbbf24">
        <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="20" cy="44" r="1" fill="#fbbf24">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

// Animated wrapper for game mode cards
export function GameModeCard({
  icon,
  label,
  description,
  selected,
  gradient,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  selected: boolean;
  gradient: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative p-3 rounded-xl border-2 text-left transition-all overflow-hidden ${
        selected
          ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
          : "border-white/10 bg-black/30 hover:border-white/20 hover:bg-black/20"
      }`}
    >
      {/* Background gradient glow when selected */}
      {selected && (
        <motion.div
          layoutId="gameModeGlow"
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 rounded-xl`}
        />
      )}
      <div className="relative flex flex-col items-center text-center gap-1">
        <div className="flex-shrink-0">{icon}</div>
        <div className="text-sm font-bold leading-tight">{label}</div>
        <div className="text-[10px] text-muted-foreground leading-tight">{description}</div>
      </div>
    </motion.button>
  );
}
