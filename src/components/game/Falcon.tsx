import { motion } from "framer-motion";

/**
 * Phoenix — realistic mythic raptor with layered plumage, ember
 * particles, twin tail streamers, glowing core, and a rotating
 * targeting HUD. Same export surface as the legacy Falcon component.
 */
export function Falcon({ size = 160, intense = false }: { size?: number; intense?: boolean }) {
  return <Phoenix size={size} intense={intense} />;
}

export function Phoenix({ size = 160, intense = false }: { size?: number; intense?: boolean }) {
  const w = size;
  const h = size * 0.78;
  return (
    <motion.svg
      width={w} height={h} viewBox="0 0 260 200"
      initial={{ x: -120, opacity: 0, rotate: -10 }}
      animate={{ x: 0, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.1 }}
      className="drop-shadow-[0_0_32px_oklch(0.78_0.22_45_/_0.85)] select-none"
    >
      <defs>
        {/* deep body — molten obsidian */}
        <linearGradient id="ph-body" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#1a0a05" />
          <stop offset="40%" stopColor="#4a1a08" />
          <stop offset="75%" stopColor="#c2410c" />
          <stop offset="100%" stopColor="#7c1d0c" />
        </linearGradient>
        {/* primary wing feathers */}
        <linearGradient id="ph-wing" x1="0" x2="0.6" y1="0" y2="1">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="25%" stopColor="#fbbf24" />
          <stop offset="55%" stopColor="#ea580c" />
          <stop offset="85%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#450a0a" />
        </linearGradient>
        {/* secondary feathers — paler */}
        <linearGradient id="ph-sec" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#9a3412" />
        </linearGradient>
        <linearGradient id="ph-edge" x1="0" x2="1">
          <stop offset="0%" stopColor="#fff7ed00" />
          <stop offset="50%" stopColor="#fff7edee" />
          <stop offset="100%" stopColor="#fff7ed00" />
        </linearGradient>
        <radialGradient id="ph-core" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#fde68a" />
          <stop offset="70%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#7c2d1200" />
        </radialGradient>
        <linearGradient id="ph-streak" x1="0" x2="1" y1="0.5" y2="0.5">
          <stop offset="0%" stopColor="#fde68a00" />
          <stop offset="50%" stopColor="#f59e0bcc" />
          <stop offset="100%" stopColor="#7c2d12ee" />
        </linearGradient>
        <filter id="ph-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="ph-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>

      {/* drifting fire trail */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.path
          key={`tr${i}`}
          d={`M${4 + i * 3} ${88 + (i - 3) * 6} Q${50 + i * 4} ${86 + (i - 3) * 4} ${96} ${90 + (i - 3) * 2}`}
          stroke="url(#ph-streak)" strokeWidth={1 + (i % 3) * 0.6}
          fill="none" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.95, 0] }}
          transition={{ duration: 1.3 + i * 0.1, repeat: Infinity, delay: i * 0.12, ease: "easeOut" }}
        />
      ))}

      {/* drifting embers */}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.circle
          key={`em${i}`}
          cx={20 + (i * 17) % 220} cy={80 + ((i * 9) % 80)}
          r={Math.random() * 1.4 + 0.6}
          fill="#fbbf24"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], y: [-2, -28, -48], x: [0, -8 - i, -16 - i * 2] }}
          transition={{ duration: 2.2 + (i % 5) * 0.3, repeat: Infinity, delay: (i % 7) * 0.25 }}
        />
      ))}

      <motion.g
        animate={{ y: [0, -3.5, 0], rotate: [-1.4, 1.4, -1.4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "130px 100px" }}
      >
        {/* twin tail streamers */}
        <motion.g animate={{ scaleY: [1, 1.08, 1] }} transition={{ duration: 1.3, repeat: Infinity }} style={{ transformOrigin: "60px 100px" }}>
          <path d="M58 100 Q22 78 8 86 Q14 96 8 110 Q20 122 58 104 Z" fill="url(#ph-wing)" />
          <path d="M60 100 Q26 86 18 96 Q22 102 18 110 Q24 120 60 104 Z" fill="url(#ph-sec)" opacity="0.85" />
          <path d="M62 100 Q34 92 30 100 Q34 106 30 112 Q36 118 62 106 Z" fill="url(#ph-core)" opacity="0.7" />
          {/* tail vein lines */}
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M58 ${96 + i * 4} Q34 ${100 + i * 3} 14 ${100 + i * 4}`} stroke="#fff7ed99" strokeWidth="0.35" fill="none" />
          ))}
        </motion.g>

        {/* torso with feather scallops */}
        <path
          d="M58 100 Q120 78 188 86 Q220 90 232 102 Q220 114 188 118 Q120 124 58 100 Z"
          fill="url(#ph-body)" stroke="#fde68a" strokeOpacity="0.55" strokeWidth="0.7"
        />
        {/* chest plumage scallops */}
        <g fill="none" stroke="#fde68a" strokeOpacity="0.5" strokeWidth="0.45">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M${78 + i * 18} 102 q6 6 12 0`} />
          ))}
        </g>
        {/* belly highlight */}
        <path d="M84 110 Q140 122 196 110" stroke="#fbbf24" strokeOpacity="0.55" strokeWidth="0.6" fill="none" />

        {/* head */}
        <g>
          <path d="M222 102 Q236 84 250 92 Q254 102 248 110 Q236 118 222 110 Z" fill="url(#ph-body)" stroke="#fde68a" strokeOpacity="0.6" strokeWidth="0.5" />
          {/* flaming crest of feathers */}
          {[0, 1, 2, 3].map((i) => (
            <motion.path
              key={`cr${i}`}
              d={`M${228 + i * 3} ${92 - i} L${232 + i * 3} ${68 - i * 4} L${236 + i * 3} ${90 - i}`}
              fill="url(#ph-wing)" filter="url(#ph-glow)"
              animate={{ opacity: [0.75, 1, 0.8], scaleY: [1, 1.15, 1] }}
              transition={{ duration: 1.4 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: `${232 + i * 3}px 90px` }}
            />
          ))}
          {/* beak */}
          <path d="M250 102 L264 100 L256 110 Z" fill="#fde68a" stroke="#7c2d12" strokeWidth="0.5" />
          <path d="M250 104 L264 102" stroke="#7c2d12" strokeWidth="0.3" />
          {/* eye socket + glowing core */}
          <ellipse cx="240" cy="100" rx="5" ry="4" fill="#1a0a05" />
          <motion.circle cx="240" cy="100" r="3" fill="url(#ph-core)" filter="url(#ph-glow)"
            animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.2, 1] }} transition={{ duration: 1.1, repeat: Infinity }} />
          <circle cx="240" cy="100" r="0.9" fill="#ffffff" />
        </g>

        {/* UPPER WING — layered primaries */}
        <motion.g
          style={{ transformOrigin: "128px 96px" }}
          animate={{ rotate: [-14, 14, -14], scaleY: [1, 0.85, 1] }}
          transition={{ duration: 0.95, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* base membrane */}
          <path d="M80 96 Q110 18 190 60 Q150 76 110 92 Z" fill="url(#ph-wing)" stroke="#fff7edee" strokeWidth="0.6" />
          {/* secondary layer */}
          <path d="M88 96 Q118 36 178 70 Q146 80 116 92 Z" fill="url(#ph-sec)" opacity="0.85" filter="url(#ph-soft)" />
          {/* primary feather splits */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const x = 100 + i * 12;
            const ty = 28 - i * 3;
            return (
              <g key={`pf${i}`}>
                <path d={`M${x} ${86 - i} Q${x + 16} ${48 - i * 2} ${x + 24} ${ty}`} stroke="#fff7eddd" strokeWidth="0.55" fill="none" />
                <motion.circle
                  cx={x + 24} cy={ty} r="1.4" fill="#fde68a"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.08 }}
                />
              </g>
            );
          })}
          <path d="M80 96 Q110 18 190 60" stroke="url(#ph-edge)" strokeWidth="1.4" fill="none" />
        </motion.g>

        {/* LOWER WING */}
        <motion.g
          style={{ transformOrigin: "128px 108px" }}
          animate={{ rotate: [14, -14, 14], scaleY: [1, 0.85, 1] }}
          transition={{ duration: 0.95, repeat: Infinity, ease: "easeInOut" }}
          opacity="0.95"
        >
          <path d="M80 108 Q110 178 190 142 Q150 128 110 116 Z" fill="url(#ph-wing)" stroke="#fde68aaa" strokeWidth="0.55" />
          <path d="M88 110 Q116 158 174 134 Q146 124 116 116 Z" fill="url(#ph-sec)" opacity="0.8" filter="url(#ph-soft)" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={`lf${i}`} d={`M${100 + i * 12} ${114 + i} Q${122 + i * 8} ${146 + i * 3} ${140 + i * 6} ${162 + i * 2}`}
              stroke="#fde68aaa" strokeWidth="0.55" fill="none" />
          ))}
        </motion.g>

        {/* glowing chest core */}
        <motion.circle cx="156" cy="102" r="5" fill="url(#ph-core)" filter="url(#ph-glow)"
          animate={{ scale: [1, 1.25, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 1.2, repeat: Infinity }} />

        {/* talons */}
        <g stroke="#fde68a" strokeWidth="0.8" fill="none">
          <path d="M158 120 L156 132 M166 120 L166 134 M174 120 L176 132" />
          <path d="M154 132 L158 134 M164 134 L168 134 M174 132 L178 132" />
        </g>
      </motion.g>

      {/* targeting reticle */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "130px 100px" }}
      >
        <circle cx="130" cy="100" r="86" fill="none" stroke="#fbbf2455" strokeWidth="0.5" strokeDasharray="2 5" />
        <circle cx="130" cy="100" r="70" fill="none" stroke="#fde68a40" strokeWidth="0.4" strokeDasharray="1 3" />
        <path d="M44 100 L56 100 M204 100 L216 100 M130 16 L130 28 M130 172 L130 184"
          stroke="#fef3c7cc" strokeWidth="0.6" />
      </motion.g>
      {/* counter-rotating ring */}
      <motion.g animate={{ rotate: -360 }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "130px 100px" }}>
        <circle cx="130" cy="100" r="94" fill="none" stroke="#ea580c33" strokeWidth="0.4" strokeDasharray="6 3 2 3" />
      </motion.g>

      {intense && (
        <g fontFamily="monospace" fontSize="6" fill="#fde68aee">
          <text x="6" y="12">REKINDLE 99.7%</text>
          <text x="6" y="194">VEL 2718 KT</text>
          <text x="200" y="12">ALT 14.2k</text>
          <text x="200" y="194">PWR ▮▮▮▮▮</text>
        </g>
      )}
    </motion.svg>
  );
}
