import { motion } from "framer-motion";

/**
 * Phoenix v3 — bespoke mythic raptor with:
 *   • multi-band molten-feather plumage (4 layered gradients)
 *   • flaming crest of articulated feathers
 *   • dual wing strokes (primaries + coverts) with iridescent edge highlights
 *   • twin ember tail streamers + drifting heat embers
 *   • glowing chest core, gold-leaf talons, glass-eye with iris
 *   • dual counter-rotating targeting reticles + optional telemetry HUD
 *
 * Exports both `Phoenix` and a legacy `Falcon` alias.
 */
export function Falcon(props: { size?: number; intense?: boolean }) {
  return <Phoenix {...props} />;
}

export function Phoenix({ size = 160, intense = false }: { size?: number; intense?: boolean }) {
  const w = size;
  const h = size * 0.82;
  return (
    <motion.svg
      width={w} height={h} viewBox="0 0 280 220"
      initial={{ x: -120, opacity: 0, rotate: -8 }}
      animate={{ x: 0, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.1 }}
      className="drop-shadow-[0_0_38px_oklch(0.78_0.22_45_/_0.9)] select-none overflow-visible"
    >
      <defs>
        {/* molten body — onyx → magma */}
        <linearGradient id="px-body" x1="0" x2="1" y1="0.2" y2="0.9">
          <stop offset="0%" stopColor="#0b0405" />
          <stop offset="35%" stopColor="#3a1207" />
          <stop offset="68%" stopColor="#c2410c" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
        {/* primary feathers — gold core, ember tip */}
        <linearGradient id="px-prim" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="20%" stopColor="#fde68a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="78%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#450a0a" />
        </linearGradient>
        {/* coverts — paler underlayer */}
        <linearGradient id="px-cov" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#7c2d12" />
        </linearGradient>
        {/* iridescent rim light */}
        <linearGradient id="px-rim" x1="0" x2="1">
          <stop offset="0%" stopColor="#fffbeb00" />
          <stop offset="50%" stopColor="#fffbebee" />
          <stop offset="100%" stopColor="#fffbeb00" />
        </linearGradient>
        {/* tail streamer */}
        <linearGradient id="px-stream" x1="0" x2="1" y1="0.5" y2="0.5">
          <stop offset="0%" stopColor="#fde68a00" />
          <stop offset="55%" stopColor="#f59e0bcc" />
          <stop offset="100%" stopColor="#7c2d12ee" />
        </linearGradient>
        {/* core orb */}
        <radialGradient id="px-core" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#fde68a" />
          <stop offset="65%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#7c2d1200" />
        </radialGradient>
        {/* iris */}
        <radialGradient id="px-iris" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#fefce8" />
          <stop offset="40%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#7c2d12" />
        </radialGradient>
        <filter id="px-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* HEAT TRAIL — soft drifting bands behind body */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.path
          key={`tr${i}`}
          d={`M${4 + i * 4} ${100 + (i - 2) * 8} Q${60 + i * 4} ${94 + (i - 2) * 5} ${110} ${100 + (i - 2) * 3}`}
          stroke="url(#px-stream)" strokeWidth={1.4 + (i % 3) * 0.5}
          fill="none" strokeLinecap="round" opacity="0.85"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.95, 0] }}
          transition={{ duration: 1.4 + i * 0.1, repeat: Infinity, delay: i * 0.12, ease: "easeOut" }}
        />
      ))}

      {/* drifting embers (heat particles) */}
      {Array.from({ length: 18 }).map((_, i) => {
        const cx = 18 + (i * 17) % 240;
        const cy = 90 + ((i * 11) % 90);
        return (
          <motion.circle
            key={`em${i}`}
            cx={cx} cy={cy} r={0.6 + ((i * 7) % 9) * 0.18}
            fill={i % 3 === 0 ? "#fef3c7" : "#fbbf24"}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0], y: [-2, -34, -56], x: [0, -10 - (i % 5), -22 - (i % 5) * 2] }}
            transition={{ duration: 2.3 + (i % 5) * 0.3, repeat: Infinity, delay: (i % 9) * 0.22 }}
          />
        );
      })}

      <motion.g
        animate={{ y: [0, -3.8, 0], rotate: [-1.2, 1.2, -1.2] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "140px 110px" }}
      >
        {/* TWIN TAIL STREAMERS */}
        <motion.g
          animate={{ scaleY: [1, 1.1, 1], scaleX: [1, 1.04, 1] }}
          transition={{ duration: 1.3, repeat: Infinity }}
          style={{ transformOrigin: "60px 110px" }}
        >
          {/* outer tail */}
          <path d="M62 110 Q26 84 6 92 Q14 104 4 124 Q18 138 62 116 Z" fill="url(#px-prim)" />
          <path d="M62 110 Q26 84 6 92 Q14 104 4 124 Q18 138 62 116 Z" fill="none" stroke="url(#px-rim)" strokeWidth="0.8" />
          {/* secondary tail */}
          <path d="M64 110 Q30 96 20 106 Q24 114 18 124 Q26 134 64 116 Z" fill="url(#px-cov)" opacity="0.85" />
          {/* ember vein */}
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M58 ${102 + i * 4} Q32 ${108 + i * 3} 10 ${108 + i * 4}`} stroke="#fff7ed99" strokeWidth="0.35" fill="none" />
          ))}
        </motion.g>

        {/* TORSO — realistic anatomical curve with feather rows */}
        <path
          d="M58 110 Q90 88 132 92 Q176 90 210 96 Q236 100 248 112 Q236 124 210 130 Q176 134 132 130 Q90 130 58 114 Z"
          fill="url(#px-body)" stroke="#fde68a" strokeOpacity="0.55" strokeWidth="0.7"
        />
        {/* shoulder mass shadow */}
        <path d="M126 96 Q150 86 188 92 Q170 110 132 108 Z" fill="#1a0a05" opacity="0.45" />
        {/* chest scallops — denser feather rows */}
        <g fill="none" stroke="#fde68a" strokeOpacity="0.55" strokeWidth="0.5">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <path key={`s${i}`} d={`M${74 + i * 18} 112 q6 6 12 0`} />
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <path key={`s2${i}`} d={`M${82 + i * 18} 120 q5 5 10 0`} opacity="0.7" />
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={`s3${i}`} d={`M${90 + i * 18} 126 q4 4 8 0`} opacity="0.45" />
          ))}
        </g>
        {/* belly rim highlight */}
        <path d="M82 124 Q140 134 200 122" stroke="#fbbf24" strokeOpacity="0.75" strokeWidth="0.7" fill="none" />
        <path d="M82 128 Q140 138 200 126" stroke="#7c2d12" strokeOpacity="0.6" strokeWidth="0.5" fill="none" />


        {/* HEAD */}
        <g>
          <path d="M232 110 Q248 86 262 96 Q268 110 260 118 Q244 128 232 118 Z" fill="url(#px-body)" stroke="#fde68a" strokeOpacity="0.6" strokeWidth="0.5" />
          {/* flaming articulated crest */}
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.path
              key={`cr${i}`}
              d={`M${236 + i * 3.4} ${98 - i} L${240 + i * 3.4} ${64 - i * 5} L${244 + i * 3.4} ${96 - i}`}
              fill="url(#px-prim)" filter="url(#px-glow)"
              animate={{ opacity: [0.7, 1, 0.8], scaleY: [1, 1.18, 1], rotate: [-2, 2, -2] }}
              transition={{ duration: 1.3 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: `${240 + i * 3.4}px 98px` }}
            />
          ))}
          {/* beak */}
          <path d="M260 110 L276 108 L266 120 Z" fill="#fde68a" stroke="#7c2d12" strokeWidth="0.5" />
          <path d="M260 112 L276 110" stroke="#7c2d12" strokeWidth="0.3" />
          <path d="M260 115 L270 117" stroke="#7c2d12" strokeWidth="0.25" />
          {/* eye — glass dome + iris + reflection */}
          <ellipse cx="250" cy="108" rx="6" ry="5" fill="#1a0a05" />
          <motion.circle cx="250" cy="108" r="3.5" fill="url(#px-iris)" filter="url(#px-glow)"
            animate={{ opacity: [0.75, 1, 0.75], scale: [1, 1.18, 1] }} transition={{ duration: 1.1, repeat: Infinity }} />
          <circle cx="251" cy="107" r="1" fill="#ffffff" />
          {/* brow ridge */}
          <path d="M240 100 Q250 96 260 100" stroke="#fbbf24" strokeWidth="0.6" fill="none" opacity="0.7" />
        </g>

        {/* UPPER WING — split into primaries / secondaries / coverts */}
        <motion.g
          style={{ transformOrigin: "138px 106px" }}
          animate={{ rotate: [-16, 14, -16], scaleY: [1, 0.82, 1] }}
          transition={{ duration: 0.95, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* covert base */}
          <path d="M82 106 Q116 22 198 64 Q156 84 116 102 Z" fill="url(#px-prim)" stroke="url(#px-rim)" strokeWidth="0.9" />
          {/* secondary band */}
          <path d="M92 106 Q124 40 184 74 Q150 86 120 102 Z" fill="url(#px-cov)" opacity="0.92" />
          {/* feather quills */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const x = 102 + i * 12;
            const ty = 30 - i * 3.2;
            return (
              <g key={`pf${i}`}>
                <path d={`M${x} ${94 - i} Q${x + 18} ${52 - i * 2} ${x + 26} ${ty}`} stroke="#fffbeb" strokeWidth="0.6" fill="none" />
                {/* feather tip ember */}
                <motion.circle
                  cx={x + 26} cy={ty} r="1.5" fill="#fde68a"
                  animate={{ opacity: [0.3, 1, 0.3], r: [1.1, 1.7, 1.1] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.08 }}
                />
              </g>
            );
          })}
          {/* leading-edge rim */}
          <path d="M82 106 Q116 22 198 64" stroke="url(#px-rim)" strokeWidth="1.6" fill="none" />
        </motion.g>

        {/* LOWER WING — counter beat */}
        <motion.g
          style={{ transformOrigin: "138px 118px" }}
          animate={{ rotate: [14, -16, 14], scaleY: [1, 0.85, 1] }}
          transition={{ duration: 0.95, repeat: Infinity, ease: "easeInOut" }}
          opacity="0.96"
        >
          <path d="M82 118 Q116 192 198 154 Q156 138 116 124 Z" fill="url(#px-prim)" stroke="#fde68a" strokeOpacity="0.5" strokeWidth="0.5" />
          <path d="M92 120 Q120 172 180 146 Q150 134 120 124 Z" fill="url(#px-cov)" opacity="0.85" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <path key={`lf${i}`} d={`M${102 + i * 12} ${124 + i} Q${126 + i * 8} ${160 + i * 3} ${146 + i * 6} ${178 + i * 2}`}
              stroke="#fde68aaa" strokeWidth="0.55" fill="none" />
          ))}
        </motion.g>

        {/* CHEST CORE — molten heart */}
        <motion.g
          animate={{ scale: [1, 1.22, 1] }}
          transition={{ duration: 1.3, repeat: Infinity }}
          style={{ transformOrigin: "160px 112px" }}
        >
          <circle cx="160" cy="112" r="9" fill="url(#px-core)" filter="url(#px-glow)" />
          <circle cx="160" cy="112" r="3" fill="#ffffff" />
        </motion.g>

        {/* gold-leaf talons */}
        <g stroke="#fde68a" strokeWidth="1" fill="none">
          <path d="M162 132 L160 148 M170 132 L170 152 M178 132 L180 148" />
          <path d="M158 148 L162 152 M168 152 L172 152 M178 148 L182 148" />
        </g>
      </motion.g>

      {/* DUAL TARGETING RETICLE */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "140px 110px" }}
      >
        <circle cx="140" cy="110" r="94" fill="none" stroke="#fbbf2455" strokeWidth="0.6" strokeDasharray="2 5" />
        <circle cx="140" cy="110" r="76" fill="none" stroke="#fde68a40" strokeWidth="0.4" strokeDasharray="1 3" />
        <path d="M40 110 L54 110 M226 110 L240 110 M140 12 L140 26 M140 194 L140 208"
          stroke="#fef3c7cc" strokeWidth="0.7" />
      </motion.g>
      <motion.g animate={{ rotate: -360 }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "140px 110px" }}>
        <circle cx="140" cy="110" r="102" fill="none" stroke="#ea580c33" strokeWidth="0.5" strokeDasharray="6 3 2 3" />
        {/* orbiting telemetry dots */}
        {[0, 90, 180, 270].map((deg) => {
          const r = 102;
          const x = 140 + Math.cos((deg * Math.PI) / 180) * r;
          const y = 110 + Math.sin((deg * Math.PI) / 180) * r;
          return <circle key={deg} cx={x} cy={y} r="1.6" fill="#fbbf24" />;
        })}
      </motion.g>

      {intense && (
        <g fontFamily="monospace" fontSize="6.5" fill="#fde68aee">
          <text x="6" y="12">REKINDLE 99.7%</text>
          <text x="6" y="214">VEL 2718 KT</text>
          <text x="208" y="12">ALT 14.2k</text>
          <text x="208" y="214">PWR ▮▮▮▮▮</text>
        </g>
      )}
    </motion.svg>
  );
}
