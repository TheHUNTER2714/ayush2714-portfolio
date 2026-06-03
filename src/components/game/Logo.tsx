import { motion } from "framer-motion";

/**
 * Animated A·A wordmark crest for Ayush Agnihotri.
 * Hex shield, dual orbiting rings, ember spark trail, scan beam,
 * interlocking A-glyphs with gold rim, and a power-up halo pulse.
 */
export function Logo({ size = 120, label = true, intense = false }: { size?: number; label?: boolean; intense?: boolean }) {
  return (
    <div className="inline-flex flex-col items-center gap-2 select-none">
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        initial={{ opacity: 0, scale: 0.4, rotate: -25, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
        transition={{ type: "spring", stiffness: 130, damping: 13 }}
        className="drop-shadow-[0_0_22px_oklch(0.82_0.18_195_/_0.7)]"
      >
        <defs>
          <linearGradient id="lg-stroke" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.18 195)" />
            <stop offset="55%" stopColor="oklch(0.88 0.16 290)" />
            <stop offset="100%" stopColor="oklch(0.72 0.22 340)" />
          </linearGradient>
          <linearGradient id="lg-gold" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fff7d6" />
            <stop offset="55%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#7c2d12" />
          </linearGradient>
          <radialGradient id="lg-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.98 0.06 195)" stopOpacity="0.95" />
            <stop offset="55%" stopColor="oklch(0.82 0.18 195)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="lg-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.8" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* halo pulse */}
        <motion.circle
          cx="60" cy="60" r="56" fill="url(#lg-core)"
          animate={{ scale: [0.85, 1.08, 0.85], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "60px 60px" }}
        />

        {/* outer orbit + spark */}
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 14, ease: "linear", repeat: Infinity }} style={{ transformOrigin: "60px 60px" }}>
          <circle cx="60" cy="60" r="54" fill="none" stroke="url(#lg-stroke)" strokeWidth="0.9" strokeDasharray="2 6" opacity="0.85" />
          <circle cx="60" cy="6" r="2.4" fill="oklch(0.95 0.18 195)" filter="url(#lg-glow)" />
        </motion.g>

        {/* counter-orbit + ember spark */}
        <motion.g animate={{ rotate: -360 }} transition={{ duration: 9, ease: "linear", repeat: Infinity }} style={{ transformOrigin: "60px 60px" }}>
          <circle cx="60" cy="60" r="46" fill="none" stroke="oklch(0.72 0.22 330 / 0.6)" strokeWidth="0.55" strokeDasharray="1 4" />
          <circle cx="60" cy="14" r="1.8" fill="#fbbf24" filter="url(#lg-glow)" />
        </motion.g>

        {/* hex shield with rim sweep */}
        <polygon points="60,14 100,36 100,84 60,106 20,84 20,36" fill="oklch(0.08 0.03 260 / 0.45)" stroke="url(#lg-stroke)" strokeWidth="1.4" />
        <motion.polygon
          points="60,14 100,36 100,84 60,106 20,84 20,36"
          fill="none" stroke="url(#lg-gold)" strokeWidth="0.6" strokeDasharray="4 220" strokeLinecap="round"
          animate={{ strokeDashoffset: [0, -224] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
        />

        {/* interlocking A · A monogram with gold rim */}
        <g strokeLinecap="round" strokeLinejoin="round" fill="none">
          <g stroke="url(#lg-stroke)" strokeWidth="3.2" filter="url(#lg-glow)">
            <path d="M38 82 L52 38 L66 82" />
            <path d="M44 66 L60 66" />
            <path d="M54 82 L68 38 L82 82" opacity="0.92" />
            <path d="M60 66 L76 66" opacity="0.92" />
          </g>
          <g stroke="url(#lg-gold)" strokeWidth="0.7" opacity="0.85">
            <path d="M38 82 L52 38 L66 82" />
            <path d="M54 82 L68 38 L82 82" />
          </g>
        </g>

        {/* scanline */}
        <motion.rect
          x="20" y="50" width="80" height="1.6"
          fill="oklch(0.95 0.1 195 / 0.7)"
          animate={{ y: [38, 80, 38], opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* corner ticks pulse */}
        {[[20,36],[100,36],[20,84],[100,84]].map(([x,y],i)=>(
          <motion.circle key={i} cx={x} cy={y} r="1.8" fill="oklch(0.72 0.22 330)"
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.15 }}
            style={{ transformOrigin: `${x}px ${y}px` }}
          />
        ))}

        {/* ember spark trail */}
        {intense && Array.from({length:6}).map((_,i)=>(
          <motion.circle key={i} cx="60" cy="60" r="1.2" fill="#fde68a"
            animate={{
              cx: [60, 60 + Math.cos(i)*42, 60],
              cy: [60, 60 + Math.sin(i)*42, 60],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 2.2, delay: i*0.25, repeat: Infinity }}
          />
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
