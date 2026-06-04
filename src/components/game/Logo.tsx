import { motion } from "framer-motion";

/**
 * Unique Phoenix-Crest sigil for AYUSH AGNIHOTRI.
 * Layered: orbiting plasma ring, scorched hex frame, spread phoenix wings,
 * interlocking A·A monogram with molten gold inlay, ember trail, and a
 * core ignition pulse — designed to play perfectly inside the split-door
 * sequence (use `intense` for the boot intro).
 */
export function Logo({
  size = 120,
  label = true,
  intense = false,
}: {
  size?: number;
  label?: boolean;
  intense?: boolean;
}) {
  return (
    <div className="inline-flex flex-col items-center gap-2 select-none">
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 140 140"
        initial={{ opacity: 0, scale: 0.35, rotate: -18, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="drop-shadow-[0_0_28px_oklch(0.82_0.18_40_/_0.75)]"
      >
        <defs>
          <linearGradient id="lg-flame" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fff7d6" />
            <stop offset="35%" stopColor="#fbbf24" />
            <stop offset="70%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#7c2d12" />
          </linearGradient>
          <linearGradient id="lg-plasma" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.92 0.18 195)" />
            <stop offset="55%" stopColor="oklch(0.85 0.22 40)" />
            <stop offset="100%" stopColor="oklch(0.72 0.22 340)" />
          </linearGradient>
          <linearGradient id="lg-gold" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fff7d6" />
            <stop offset="55%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#7c2d12" />
          </linearGradient>
          <radialGradient id="lg-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff7d6" stopOpacity="0.95" />
            <stop offset="45%" stopColor="oklch(0.85 0.22 40)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="lg-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* halo core */}
        <motion.circle
          cx="70" cy="70" r="60" fill="url(#lg-core)"
          animate={{ scale: [0.85, 1.1, 0.85], opacity: [0.55, 0.95, 0.55] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "70px 70px" }}
        />

        {/* phoenix wing — left */}
        <motion.path
          d="M70 70 Q40 56 14 64 Q34 50 70 58 Q44 36 18 38 Q42 30 70 50"
          fill="none" stroke="url(#lg-flame)" strokeWidth="2.2" strokeLinecap="round" filter="url(#lg-glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
        />
        {/* phoenix wing — right */}
        <motion.path
          d="M70 70 Q100 56 126 64 Q106 50 70 58 Q96 36 122 38 Q98 30 70 50"
          fill="none" stroke="url(#lg-flame)" strokeWidth="2.2" strokeLinecap="round" filter="url(#lg-glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
        />
        {/* phoenix tail */}
        <motion.path
          d="M70 82 Q66 102 58 118 M70 82 Q70 104 70 122 M70 82 Q74 102 82 118"
          fill="none" stroke="url(#lg-flame)" strokeWidth="1.6" strokeLinecap="round" filter="url(#lg-glow)"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        />

        {/* outer plasma orbit */}
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 16, ease: "linear", repeat: Infinity }} style={{ transformOrigin: "70px 70px" }}>
          <circle cx="70" cy="70" r="62" fill="none" stroke="url(#lg-plasma)" strokeWidth="0.8" strokeDasharray="2 7" opacity="0.7" />
          <circle cx="70" cy="8" r="2.4" fill="#fff7d6" filter="url(#lg-glow)" />
        </motion.g>
        {/* inner counter-orbit */}
        <motion.g animate={{ rotate: -360 }} transition={{ duration: 11, ease: "linear", repeat: Infinity }} style={{ transformOrigin: "70px 70px" }}>
          <circle cx="70" cy="70" r="52" fill="none" stroke="oklch(0.85 0.22 40 / 0.55)" strokeWidth="0.5" strokeDasharray="1 5" />
          <circle cx="70" cy="18" r="1.8" fill="#fbbf24" filter="url(#lg-glow)" />
        </motion.g>

        {/* scorched hex frame */}
        <polygon points="70,18 116,42 116,98 70,122 24,98 24,42" fill="oklch(0.08 0.04 30 / 0.5)" stroke="url(#lg-plasma)" strokeWidth="1.5" />
        <motion.polygon
          points="70,18 116,42 116,98 70,122 24,98 24,42"
          fill="none" stroke="url(#lg-gold)" strokeWidth="0.7" strokeDasharray="6 240" strokeLinecap="round"
          animate={{ strokeDashoffset: [0, -246] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
        />

        {/* phoenix head/beak nub */}
        <motion.path
          d="M70 50 L66 44 L70 40 L74 44 Z"
          fill="url(#lg-gold)" stroke="#7c2d12" strokeWidth="0.6"
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* interlocking A · A monogram, molten gold inlay */}
        <g strokeLinecap="round" strokeLinejoin="round" fill="none">
          <g stroke="url(#lg-plasma)" strokeWidth="3.2" filter="url(#lg-glow)">
            <path d="M46 96 L60 52 L74 96" />
            <path d="M52 80 L68 80" />
            <path d="M62 96 L76 52 L90 96" opacity="0.92" />
            <path d="M68 80 L84 80" />
          </g>
          <g stroke="url(#lg-gold)" strokeWidth="0.8" opacity="0.95">
            <path d="M46 96 L60 52 L74 96" />
            <path d="M62 96 L76 52 L90 96" />
          </g>
        </g>

        {/* scanline */}
        <motion.rect
          x="24" y="60" width="92" height="1.4"
          fill="oklch(0.95 0.12 40 / 0.8)"
          animate={{ y: [44, 100, 44], opacity: [0.25, 0.95, 0.25] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* corner tick pulses */}
        {[[24, 42], [116, 42], [24, 98], [116, 98]].map(([x, y], i) => (
          <motion.circle
            key={i} cx={x} cy={y} r="2" fill="oklch(0.85 0.22 40)"
            animate={{ scale: [1, 1.7, 1], opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 1.7, repeat: Infinity, delay: i * 0.18 }}
            style={{ transformOrigin: `${x}px ${y}px` }}
          />
        ))}

        {/* ember trail (only in intense/boot mode) */}
        {intense &&
          Array.from({ length: 10 }).map((_, i) => (
            <motion.circle
              key={i} cx="70" cy="70" r="1.2" fill="#fde68a"
              animate={{
                cx: [70, 70 + Math.cos((i / 10) * Math.PI * 2) * 48, 70],
                cy: [70, 70 + Math.sin((i / 10) * Math.PI * 2) * 48, 70],
                opacity: [0, 1, 0],
                scale: [0.6, 1.3, 0.6],
              }}
              transition={{ duration: 2.4, delay: i * 0.18, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
      </motion.svg>
      {label && (
        <div className="text-center leading-tight">
          <div className="font-display text-[10px] tracking-[0.5em] text-primary text-glow">AYUSH · AGNIHOTRI</div>
          <div className="font-mono text-[9px] text-muted-foreground">PHOENIX PROTOCOL</div>
        </div>
      )}
    </div>
  );
}
