import { motion } from "framer-motion";

/**
 * Phoenix — fire-themed mythic raptor. Same API as the old Falcon
 * component so all existing import sites keep working. Warm ember
 * palette, plume of flame trails, glowing core, scanning HUD ring.
 *
 * Props:
 *  - size: pixel width
 *  - intense: show HUD readouts
 */
export function Falcon({ size = 160, intense = false }: { size?: number; intense?: boolean }) {
  return <Phoenix size={size} intense={intense} />;
}

export function Phoenix({ size = 160, intense = false }: { size?: number; intense?: boolean }) {
  const w = size;
  const h = size * 0.72;
  return (
    <motion.svg
      width={w} height={h} viewBox="0 0 240 170"
      initial={{ x: -120, opacity: 0, rotate: -10 }}
      animate={{ x: 0, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.1 }}
      className="drop-shadow-[0_0_28px_oklch(0.78_0.22_45_/_0.8)] select-none"
    >
      <defs>
        <linearGradient id="pbody" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.32 0.18 25)" />
          <stop offset="55%" stopColor="oklch(0.55 0.22 35)" />
          <stop offset="100%" stopColor="oklch(0.22 0.14 20)" />
        </linearGradient>
        <linearGradient id="pwing" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.95 0.22 80)" />
          <stop offset="45%" stopColor="oklch(0.78 0.25 45)" />
          <stop offset="100%" stopColor="oklch(0.55 0.28 18)" />
        </linearGradient>
        <linearGradient id="pedge" x1="0" x2="1">
          <stop offset="0%" stopColor="oklch(0.99 0.18 80 / 0)" />
          <stop offset="50%" stopColor="oklch(0.99 0.18 80 / 0.95)" />
          <stop offset="100%" stopColor="oklch(0.99 0.18 80 / 0)" />
        </linearGradient>
        <radialGradient id="pcore" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="oklch(0.98 0.22 90)" />
          <stop offset="45%" stopColor="oklch(0.78 0.28 35)" />
          <stop offset="100%" stopColor="oklch(0.35 0.2 20 / 0)" />
        </radialGradient>
        <linearGradient id="pstreak" x1="0" x2="1" y1="0.5" y2="0.5">
          <stop offset="0%" stopColor="oklch(0.95 0.22 60 / 0)" />
          <stop offset="60%" stopColor="oklch(0.85 0.25 35 / 0.9)" />
          <stop offset="100%" stopColor="oklch(0.6 0.28 15 / 0.95)" />
        </linearGradient>
        <filter id="pglow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* flame trail */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.path
          key={i}
          d={`M${10 + i * 4} ${72 + (i - 2) * 6} Q${50 + i * 4} ${70 + (i - 2) * 4} ${88} ${72 + (i - 2) * 2}`}
          stroke="url(#pstreak)" strokeWidth={i % 2 ? 1.4 : 2.2}
          fill="none" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.95, 0] }}
          transition={{ duration: 1.3 + i * 0.12, repeat: Infinity, delay: i * 0.14, ease: "easeOut" }}
        />
      ))}

      <motion.g
        animate={{ y: [0, -3, 0], rotate: [-1.5, 1.5, -1.5] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "120px 85px" }}
      >
        {/* fan tail flames */}
        <g>
          <path d="M50 85 Q22 64 14 76 Q18 86 14 96 Q22 108 50 88 Z" fill="url(#pwing)" opacity="0.9" />
          <path d="M50 85 Q26 70 22 80 Q26 86 22 92 Q26 102 50 88 Z" fill="url(#pcore)" opacity="0.7" />
        </g>

        {/* torso */}
        <path
          d="M50 85 Q105 64 170 72 Q200 76 214 86 Q200 96 170 100 Q105 106 50 85 Z"
          fill="url(#pbody)" stroke="oklch(0.95 0.2 60 / 0.8)" strokeWidth="0.7"
        />
        {/* chest ember plates */}
        <path d="M72 82 Q120 72 178 80" stroke="oklch(0.98 0.22 70 / 0.7)" strokeWidth="0.6" fill="none" />
        <path d="M72 91 Q120 100 178 92" stroke="oklch(0.85 0.22 35 / 0.5)" strokeWidth="0.5" fill="none" />
        <circle cx="100" cy="86" r="1.6" fill="oklch(0.98 0.22 80)" opacity="0.85" />
        <circle cx="138" cy="86" r="1.6" fill="oklch(0.98 0.22 80)" opacity="0.85" />

        {/* head + crest of flame */}
        <g>
          <path d="M205 86 Q215 70 226 78 Q230 86 224 92 Q214 98 205 92 Z" fill="url(#pbody)" stroke="oklch(0.95 0.22 60 / 0.8)" strokeWidth="0.5" />
          {/* flaming crest */}
          <motion.path
            d="M212 74 L216 56 L220 70 L224 52 L226 72 L220 80 Z"
            fill="url(#pwing)" filter="url(#pglow)"
            animate={{ opacity: [0.8, 1, 0.85], scaleY: [1, 1.1, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "220px 78px" }}
          />
          {/* beak */}
          <path d="M226 86 L240 84 L234 92 Z" fill="oklch(0.95 0.18 70)" stroke="oklch(0.35 0.12 30)" strokeWidth="0.4" />
          {/* glowing core eye */}
          <motion.circle
            cx="220" cy="84" r="2.8" fill="url(#pcore)" filter="url(#pglow)"
            animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
          />
          <circle cx="220" cy="84" r="0.9" fill="oklch(0.99 0 0)" />
        </g>

        {/* UPPER WING — flame primaries */}
        <motion.g
          style={{ transformOrigin: "115px 82px" }}
          animate={{ rotate: [-12, 12, -12], scaleY: [1, 0.88, 1] }}
          transition={{ duration: 0.95, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M75 82 Q98 14 172 52 Q140 64 105 76 Z"
            fill="url(#pwing)" stroke="oklch(0.99 0.18 70 / 0.95)" strokeWidth="0.6"
          />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path
              key={i}
              d={`M${95 + i * 12} ${72 - i * 2} Q${120 + i * 8} ${48 - i * 4} ${140 + i * 6} ${32 - i * 3}`}
              stroke="oklch(0.99 0.2 75 / 0.85)" strokeWidth="0.6" fill="none"
            />
          ))}
          {/* ember tips */}
          {[0, 1, 2, 3].map((i) => (
            <motion.circle
              key={`u${i}`}
              cx={140 + i * 6} cy={32 - i * 3} r="1.6" fill="oklch(0.98 0.22 80)"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
          <path d="M75 82 Q98 14 172 52" stroke="url(#pedge)" strokeWidth="1.4" fill="none" />
        </motion.g>

        {/* LOWER WING */}
        <motion.g
          style={{ transformOrigin: "115px 92px" }}
          animate={{ rotate: [12, -12, 12], scaleY: [1, 0.88, 1] }}
          transition={{ duration: 0.95, repeat: Infinity, ease: "easeInOut" }}
          opacity="0.95"
        >
          <path
            d="M75 92 Q98 152 172 120 Q140 108 105 96 Z"
            fill="url(#pwing)" stroke="oklch(0.95 0.2 60 / 0.85)" strokeWidth="0.5"
          />
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M${100 + i * 12} ${96 + i * 2} Q${125 + i * 8} ${124 + i * 4} ${145 + i * 6} ${138 + i * 3}`}
              stroke="oklch(0.95 0.22 50 / 0.7)" strokeWidth="0.55" fill="none"
            />
          ))}
        </motion.g>

        {/* talons */}
        <g stroke="oklch(0.95 0.18 70)" strokeWidth="0.7" fill="none">
          <path d="M150 102 L148 113 M156 102 L156 115 M162 102 L164 113" />
        </g>
      </motion.g>

      {/* targeting reticle */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "120px 85px" }}
      >
        <circle cx="120" cy="85" r="78" fill="none" stroke="oklch(0.85 0.22 35 / 0.3)" strokeWidth="0.5" strokeDasharray="2 5" />
        <circle cx="120" cy="85" r="64" fill="none" stroke="oklch(0.98 0.2 70 / 0.22)" strokeWidth="0.4" strokeDasharray="1 3" />
        <path d="M40 85 L52 85 M188 85 L200 85 M120 12 L120 24 M120 146 L120 158"
          stroke="oklch(0.95 0.22 60 / 0.75)" strokeWidth="0.6" />
      </motion.g>

      {intense && (
        <g fontFamily="monospace" fontSize="6" fill="oklch(0.95 0.22 60 / 0.95)">
          <text x="6" y="12">REKINDLE 99.7%</text>
          <text x="6" y="164">VEL 2718 KT</text>
          <text x="186" y="12">ALT 14.2k</text>
          <text x="186" y="164">PWR ▮▮▮▮▮</text>
        </g>
      )}
    </motion.svg>
  );
}
