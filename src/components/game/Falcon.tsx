import { motion } from "framer-motion";

/**
 * Realistic techno-falcon: layered SVG with circuit feathers, glowing eye,
 * holographic plumage, scanning HUD reticle and afterburner trails.
 */
export function Falcon({ size = 160, intense = false }: { size?: number; intense?: boolean }) {
  const w = size;
  const h = size * 0.72;
  return (
    <motion.svg
      width={w} height={h} viewBox="0 0 240 170"
      initial={{ x: -120, opacity: 0, rotate: -10 }}
      animate={{ x: 0, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.1 }}
      className="drop-shadow-[0_0_28px_oklch(0.82_0.18_195_/_0.75)] select-none"
    >
      <defs>
        <linearGradient id="fbody" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.22 0.05 250)" />
          <stop offset="55%" stopColor="oklch(0.32 0.10 230)" />
          <stop offset="100%" stopColor="oklch(0.18 0.04 260)" />
        </linearGradient>
        <linearGradient id="fwing" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.82 0.18 195)" />
          <stop offset="60%" stopColor="oklch(0.55 0.18 250)" />
          <stop offset="100%" stopColor="oklch(0.72 0.22 330)" />
        </linearGradient>
        <linearGradient id="fedge" x1="0" x2="1">
          <stop offset="0%" stopColor="oklch(0.95 0.15 195 / 0)" />
          <stop offset="50%" stopColor="oklch(0.95 0.15 195 / 0.95)" />
          <stop offset="100%" stopColor="oklch(0.95 0.15 195 / 0)" />
        </linearGradient>
        <radialGradient id="feye" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="oklch(0.98 0.2 30)" />
          <stop offset="40%" stopColor="oklch(0.78 0.28 30)" />
          <stop offset="100%" stopColor="oklch(0.35 0.18 25 / 0)" />
        </radialGradient>
        <linearGradient id="fstreak" x1="0" x2="1" y1="0.5" y2="0.5">
          <stop offset="0%" stopColor="oklch(0.82 0.18 195 / 0)" />
          <stop offset="100%" stopColor="oklch(0.82 0.18 195 / 0.9)" />
        </linearGradient>
        <filter id="fglow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <pattern id="fcircuit" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 7 H6 M8 7 H14 M7 0 V6 M7 8 V14" stroke="oklch(0.85 0.18 195 / 0.35)" strokeWidth="0.4" fill="none" />
          <circle cx="7" cy="7" r="0.8" fill="oklch(0.95 0.18 195 / 0.5)" />
        </pattern>
      </defs>

      {/* afterburner streaks */}
      {[0, 1, 2, 3].map((i) => (
        <motion.line
          key={i}
          x1="0" x2="80" y1={70 + (i - 1.5) * 10} y2={70 + (i - 1.5) * 10}
          stroke="url(#fstreak)" strokeWidth={i % 2 ? 1 : 1.6}
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: [-60, 40, -60], opacity: [0, 0.95, 0] }}
          transition={{ duration: 1.3 + i * 0.1, repeat: Infinity, delay: i * 0.12, ease: "easeOut" }}
        />
      ))}

      {/* body assembly: banks slightly */}
      <motion.g
        animate={{ y: [0, -2.5, 0], rotate: [-1, 1, -1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "120px 85px" }}
      >
        {/* tail fan with feather slots */}
        <g>
          <path d="M50 85 L18 70 L20 100 Z" fill="url(#fbody)" />
          <path d="M50 85 L18 70 L20 100 Z" fill="url(#fcircuit)" opacity="0.6" />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1="48" y1={78 + i * 3} x2="22" y2={74 + i * 5} stroke="oklch(0.85 0.18 195 / 0.6)" strokeWidth="0.4" />
          ))}
        </g>

        {/* torso: armored plates */}
        <path
          d="M50 85 Q105 65 170 72 Q198 76 212 86 Q198 96 170 100 Q105 105 50 85 Z"
          fill="url(#fbody)" stroke="oklch(0.82 0.18 195 / 0.8)" strokeWidth="0.6"
        />
        <path
          d="M50 85 Q105 65 170 72 Q198 76 212 86 Q198 96 170 100 Q105 105 50 85 Z"
          fill="url(#fcircuit)" opacity="0.55"
        />
        {/* chest plate seams */}
        <path d="M70 82 Q120 70 180 80" stroke="oklch(0.85 0.2 195 / 0.55)" strokeWidth="0.5" fill="none" />
        <path d="M70 90 Q120 100 180 92" stroke="oklch(0.85 0.2 195 / 0.4)" strokeWidth="0.5" fill="none" />

        {/* head + helmet */}
        <g>
          <path d="M205 86 Q215 70 226 78 Q230 86 224 92 Q214 98 205 92 Z" fill="url(#fbody)" stroke="oklch(0.85 0.2 195 / 0.7)" strokeWidth="0.5" />
          {/* crest */}
          <path d="M214 75 L218 64 L222 76 Z" fill="oklch(0.82 0.18 195)" opacity="0.9" />
          {/* beak */}
          <path d="M226 86 L240 84 L234 92 Z" fill="oklch(0.92 0.14 80)" stroke="oklch(0.4 0.1 60)" strokeWidth="0.4" />
          {/* glowing eye */}
          <motion.circle
            cx="220" cy="84" r="2.6" fill="url(#feye)" filter="url(#fglow)"
            animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.4, repeat: Infinity }}
          />
          <circle cx="220" cy="84" r="0.9" fill="oklch(0.99 0 0)" />
          {/* HUD bar under eye */}
          <rect x="214" y="89" width="10" height="0.8" fill="oklch(0.85 0.18 195 / 0.7)" />
        </g>

        {/* UPPER WING — multiple primaries */}
        <motion.g
          style={{ transformOrigin: "115px 82px" }}
          animate={{ rotate: [-10, 10, -10], scaleY: [1, 0.9, 1] }}
          transition={{ duration: 0.95, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M75 82 Q100 18 170 56 Q140 64 105 76 Z"
            fill="url(#fwing)" stroke="oklch(0.95 0.16 195 / 0.9)" strokeWidth="0.5"
          />
          <path d="M75 82 Q100 18 170 56 Q140 64 105 76 Z" fill="url(#fcircuit)" opacity="0.35" />
          {/* primary feather separators */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path
              key={i}
              d={`M${95 + i * 12} ${72 - i * 2} Q${120 + i * 8} ${50 - i * 4} ${140 + i * 6} ${36 - i * 3}`}
              stroke="oklch(0.95 0.16 195 / 0.7)" strokeWidth="0.5" fill="none"
            />
          ))}
          {/* wing edge highlight */}
          <path d="M75 82 Q100 18 170 56" stroke="url(#fedge)" strokeWidth="1.2" fill="none" />
        </motion.g>

        {/* LOWER WING */}
        <motion.g
          style={{ transformOrigin: "115px 92px" }}
          animate={{ rotate: [10, -10, 10], scaleY: [1, 0.9, 1] }}
          transition={{ duration: 0.95, repeat: Infinity, ease: "easeInOut" }}
          opacity="0.92"
        >
          <path
            d="M75 92 Q100 148 170 116 Q140 108 105 96 Z"
            fill="url(#fwing)" stroke="oklch(0.95 0.16 195 / 0.7)" strokeWidth="0.5"
          />
          <path d="M75 92 Q100 148 170 116 Q140 108 105 96 Z" fill="url(#fcircuit)" opacity="0.3" />
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M${100 + i * 12} ${96 + i * 2} Q${125 + i * 8} ${122 + i * 4} ${145 + i * 6} ${134 + i * 3}`}
              stroke="oklch(0.95 0.16 195 / 0.55)" strokeWidth="0.5" fill="none"
            />
          ))}
        </motion.g>

        {/* talons */}
        <g stroke="oklch(0.85 0.18 195)" strokeWidth="0.6" fill="none">
          <path d="M150 102 L148 112 M156 102 L156 114 M162 102 L164 112" />
        </g>
      </motion.g>

      {/* targeting reticle */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "120px 85px" }}
      >
        <circle cx="120" cy="85" r="78" fill="none" stroke="oklch(0.72 0.22 330 / 0.28)" strokeWidth="0.5" strokeDasharray="2 5" />
        <circle cx="120" cy="85" r="64" fill="none" stroke="oklch(0.82 0.18 195 / 0.18)" strokeWidth="0.4" strokeDasharray="1 3" />
        <path d="M40 85 L52 85 M188 85 L200 85 M120 12 L120 24 M120 146 L120 158"
          stroke="oklch(0.85 0.2 195 / 0.7)" strokeWidth="0.6" />
      </motion.g>

      {/* corner tick HUD */}
      {intense && (
        <g fontFamily="monospace" fontSize="6" fill="oklch(0.85 0.2 195 / 0.9)">
          <text x="6" y="12">LOCK 99.7%</text>
          <text x="6" y="164">VEL 2718 KT</text>
          <text x="186" y="12">ALT 14.2k</text>
          <text x="186" y="164">PWR ▮▮▮▮▮</text>
        </g>
      )}
    </motion.svg>
  );
}
