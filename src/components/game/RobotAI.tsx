import { motion, AnimatePresence } from "framer-motion";

/**
 * Advanced humanoid robot avatar for the AI Co-Pilot section.
 * Pure SVG (no GPU cost), with cursor-independent micro-animations,
 * reactive "transmission" pulse when `fire` increments, and a power-bar
 * + telemetry HUD that breathes while idle.
 */
export function RobotAI({ size = 200, busy = false, fire = 0 }: { size?: number; busy?: boolean; fire?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size * 1.15 }}>
      {/* Aura ring */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, oklch(0.82 0.18 195 / 0.35), transparent 65%)",
        }}
        animate={{ opacity: busy ? [0.6, 1, 0.6] : [0.35, 0.7, 0.35] }}
        transition={{ duration: busy ? 0.9 : 2.4, repeat: Infinity }}
      />

      {/* Transmission shockwave */}
      <AnimatePresence>
        {fire > 0 && (
          <motion.span
            key={fire}
            initial={{ scale: 0.3, opacity: 0.9 }}
            animate={{ scale: 2.6, opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow:
                "0 0 0 3px oklch(0.82 0.2 195 / 0.7), 0 0 40px oklch(0.72 0.28 330 / 0.8)",
            }}
          />
        )}
      </AnimatePresence>

      <motion.svg
        viewBox="0 0 220 260"
        className="relative w-full h-full"
        animate={busy ? { y: [0, -3, 0] } : { y: [0, -1.5, 0] }}
        transition={{ duration: busy ? 0.8 : 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <linearGradient id="r-body" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#475569" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="r-plate" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <radialGradient id="r-visor" cx="0.5" cy="0.4">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="60%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#022c3a" />
          </radialGradient>
          <linearGradient id="r-glow" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <filter id="r-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
        </defs>

        {/* shoulder pauldrons */}
        <motion.g animate={{ y: busy ? [0, -2, 0] : 0 }} transition={{ duration: 0.7, repeat: busy ? Infinity : 0 }}>
          <path d="M28 132 Q40 102 70 108 L70 152 Q40 158 28 144 Z" fill="url(#r-body)" stroke="#67e8f9" strokeOpacity="0.4" />
          <path d="M192 132 Q180 102 150 108 L150 152 Q180 158 192 144 Z" fill="url(#r-body)" stroke="#67e8f9" strokeOpacity="0.4" />
          <circle cx="40" cy="128" r="3" fill="url(#r-glow)" />
          <circle cx="180" cy="128" r="3" fill="url(#r-glow)" />
        </motion.g>

        {/* torso */}
        <g>
          <path d="M68 110 L152 110 L162 220 Q110 232 58 220 Z" fill="url(#r-body)" stroke="#67e8f9" strokeOpacity="0.45" />
          {/* chest plating */}
          <path d="M82 122 L138 122 L144 168 L76 168 Z" fill="url(#r-plate)" opacity="0.92" />
          {/* sternum reactor */}
          <motion.g
            animate={{ scale: busy ? [1, 1.18, 1] : [1, 1.06, 1] }}
            transition={{ duration: busy ? 0.6 : 1.8, repeat: Infinity }}
            style={{ transformOrigin: "110px 150px" }}
          >
            <circle cx="110" cy="150" r="14" fill="#0c1424" stroke="#22d3ee" />
            <circle cx="110" cy="150" r="9" fill="url(#r-glow)" filter="url(#r-soft)" />
            <circle cx="110" cy="150" r="3.5" fill="#f0f9ff" />
          </motion.g>
          {/* abdominal ribs */}
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M76 ${182 + i * 10} L144 ${182 + i * 10}`} stroke="#67e8f9" strokeOpacity="0.35" strokeWidth="0.8" />
          ))}
          {/* HUD readout strip */}
          <g fontFamily="monospace" fontSize="6" fill="#67e8f9">
            <text x="80" y="216">SYS//OK</text>
            <text x="120" y="216">v27.11</text>
          </g>
        </g>

        {/* neck */}
        <path d="M96 96 L124 96 L128 110 L92 110 Z" fill="#1e293b" stroke="#22d3ee" strokeOpacity="0.4" />

        {/* head */}
        <motion.g
          animate={busy ? { rotate: [-2, 2, -2] } : { rotate: [-0.6, 0.6, -0.6] }}
          transition={{ duration: busy ? 0.9 : 3.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "110px 70px" }}
        >
          {/* skull */}
          <path d="M70 60 Q70 28 110 24 Q150 28 150 60 L150 88 Q132 100 110 100 Q88 100 70 88 Z" fill="url(#r-body)" stroke="#67e8f9" strokeOpacity="0.5" />
          {/* cranial plate divisions */}
          <path d="M110 24 L110 60" stroke="#67e8f9" strokeOpacity="0.4" />
          <path d="M82 38 Q110 32 138 38" stroke="#67e8f9" strokeOpacity="0.3" />
          {/* visor */}
          <rect x="78" y="58" width="64" height="22" rx="3" fill="url(#r-visor)" />
          <rect x="78" y="58" width="64" height="22" rx="3" fill="none" stroke="#67e8f9" />
          {/* twin scanning eyes */}
          <motion.circle
            cx="94" cy="69" r="3" fill="#f0fdff"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: busy ? 0.5 : 1.4, repeat: Infinity }}
          />
          <motion.circle
            cx="126" cy="69" r="3" fill="#f0fdff"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: busy ? 0.5 : 1.4, repeat: Infinity, delay: 0.25 }}
          />
          {/* eye scan-line */}
          <motion.rect
            x="78" y="58" width="64" height="2" fill="#a5f3fc" opacity="0.85"
            animate={{ y: [58, 78, 58] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* mouth grille */}
          <g stroke="#22d3ee" strokeOpacity="0.7">
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={90 + i * 10} y1={90} x2={90 + i * 10} y2={96} />
            ))}
          </g>
          {/* antenna */}
          <line x1="110" y1="24" x2="110" y2="10" stroke="#22d3ee" />
          <motion.circle
            cx="110" cy="8" r="2.5" fill="#22d3ee"
            animate={{ opacity: [0.4, 1, 0.4], r: [2, 3, 2] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          />
          {/* side jaw vents */}
          <path d="M72 76 L80 84 L72 88 Z" fill="#22d3ee" opacity="0.5" />
          <path d="M148 76 L140 84 L148 88 Z" fill="#22d3ee" opacity="0.5" />
        </motion.g>

        {/* arms (subtle drift) */}
        <motion.g
          animate={busy ? { rotate: [-3, 3, -3] } : { rotate: [-1, 1, -1] }}
          transition={{ duration: busy ? 0.9 : 3.2, repeat: Infinity }}
          style={{ transformOrigin: "40px 140px" }}
        >
          <path d="M30 144 L46 152 L40 200 L22 196 Z" fill="url(#r-body)" stroke="#67e8f9" strokeOpacity="0.35" />
          <circle cx="30" cy="200" r="6" fill="#0c1424" stroke="#22d3ee" />
        </motion.g>
        <motion.g
          animate={busy ? { rotate: [3, -3, 3] } : { rotate: [1, -1, 1] }}
          transition={{ duration: busy ? 0.9 : 3.2, repeat: Infinity }}
          style={{ transformOrigin: "180px 140px" }}
        >
          <path d="M190 144 L174 152 L180 200 L198 196 Z" fill="url(#r-body)" stroke="#67e8f9" strokeOpacity="0.35" />
          <circle cx="190" cy="200" r="6" fill="#0c1424" stroke="#22d3ee" />
        </motion.g>

        {/* base hex pedestal */}
        <g opacity="0.65">
          <path d="M62 234 L158 234 L172 248 L48 248 Z" fill="#0f172a" stroke="#22d3ee" strokeOpacity="0.6" />
          <path d="M62 234 L158 234" stroke="#67e8f9" strokeOpacity="0.7" />
        </g>

        {/* orbiting holo glyphs */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "110px 130px" }}
        >
          <circle cx="110" cy="34" r="2" fill="#a78bfa" />
          <circle cx="186" cy="130" r="2" fill="#22d3ee" />
          <circle cx="110" cy="226" r="2" fill="#f472b6" />
          <circle cx="34" cy="130" r="2" fill="#22d3ee" />
        </motion.g>
      </motion.svg>

      {/* power chip */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-widest text-primary/90 bg-card/80 corner-frame px-2 py-0.5">
        <span className="c-bl" /><span className="c-br" />
        {busy ? "PROC ▮▮▮▮▯" : "IDLE ▮▮▯▯▯"}
      </div>
    </div>
  );
}
