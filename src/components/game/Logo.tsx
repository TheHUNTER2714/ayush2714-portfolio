import { motion } from "framer-motion";

/**
 * Innovative animated mark for "Ayush Agnihotri" (A · A).
 * Two interlocking A-glyphs forming a stylized arcade-cabinet crest
 * with orbiting rings, scanline core, and a power-up pulse.
 */
export function Logo({ size = 96, label = true }: { size?: number; label?: boolean }) {
  return (
    <div className="inline-flex flex-col items-center gap-2 select-none">
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 14 }}
        className="drop-shadow-[0_0_18px_oklch(0.82_0.18_195_/_0.6)]"
      >
        <defs>
          <linearGradient id="lg-stroke" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.18 195)" />
            <stop offset="100%" stopColor="oklch(0.72 0.22 330)" />
          </linearGradient>
          <radialGradient id="lg-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.95 0.1 195)" stopOpacity="0.9" />
            <stop offset="60%" stopColor="oklch(0.82 0.18 195)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* outer orbiting ring */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 14, ease: "linear", repeat: Infinity }}
          style={{ transformOrigin: "60px 60px" }}
        >
          <circle cx="60" cy="60" r="54" fill="none" stroke="url(#lg-stroke)" strokeWidth="0.8" strokeDasharray="2 5" opacity="0.7" />
          <circle cx="60" cy="6" r="2" fill="oklch(0.82 0.18 195)" />
          <circle cx="60" cy="114" r="1.4" fill="oklch(0.72 0.22 330)" />
        </motion.g>

        {/* inner counter-orbit */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 9, ease: "linear", repeat: Infinity }}
          style={{ transformOrigin: "60px 60px" }}
        >
          <circle cx="60" cy="60" r="46" fill="none" stroke="oklch(0.72 0.22 330 / 0.5)" strokeWidth="0.5" strokeDasharray="1 3" />
        </motion.g>

        {/* core glow pulse */}
        <motion.circle
          cx="60" cy="60" r="30" fill="url(#lg-core)"
          animate={{ opacity: [0.55, 1, 0.55], scale: [0.92, 1.05, 0.92] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "60px 60px" }}
        />

        {/* hex frame */}
        <polygon
          points="60,14 100,36 100,84 60,106 20,84 20,36"
          fill="none"
          stroke="url(#lg-stroke)"
          strokeWidth="1.2"
        />

        {/* interlocking A · A monogram */}
        <g stroke="url(#lg-stroke)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* left A */}
          <path d="M38 82 L52 38 L66 82" />
          <path d="M44 66 L60 66" />
          {/* right A (mirrored, offset, lower-opacity for depth) */}
          <path d="M54 82 L68 38 L82 82" opacity="0.85" />
          <path d="M60 66 L76 66" opacity="0.85" />
        </g>

        {/* scanline */}
        <motion.rect
          x="20" y="50" width="80" height="2"
          fill="oklch(0.95 0.1 195 / 0.6)"
          animate={{ y: [40, 78, 40] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* corner ticks */}
        {[
          [20, 36], [100, 36], [20, 84], [100, 84],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.6" fill="oklch(0.72 0.22 330)" />
        ))}
      </motion.svg>
      {label && (
        <div className="text-center leading-tight">
          <div className="font-display text-[10px] tracking-[0.45em] text-primary text-glow">AYUSH · AGNIHOTRI</div>
          <div className="font-mono text-[9px] text-muted-foreground">PRESS START</div>
        </div>
      )}
    </div>
  );
}
