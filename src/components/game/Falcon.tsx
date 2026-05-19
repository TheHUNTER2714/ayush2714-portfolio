import { motion } from "framer-motion";

/**
 * Animated falcon mark — diving / banking silhouette built from SVG paths.
 * Wings flap, body banks, and a trailing motion blur streaks behind.
 */
export function Falcon({ size = 140 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 200 140"
      initial={{ x: -120, opacity: 0, rotate: -8 }}
      animate={{ x: 0, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.1 }}
      className="drop-shadow-[0_0_20px_oklch(0.82_0.18_195_/_0.7)]"
    >
      <defs>
        <linearGradient id="falcon-grad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.82 0.18 195)" />
          <stop offset="100%" stopColor="oklch(0.72 0.22 330)" />
        </linearGradient>
        <linearGradient id="falcon-streak" x1="0" x2="1" y1="0.5" y2="0.5">
          <stop offset="0%" stopColor="oklch(0.82 0.18 195 / 0)" />
          <stop offset="100%" stopColor="oklch(0.82 0.18 195 / 0.8)" />
        </linearGradient>
      </defs>

      {/* speed streaks */}
      {[0, 1, 2].map((i) => (
        <motion.line
          key={i}
          x1="0" x2="60" y1={50 + i * 12} y2={50 + i * 12}
          stroke="url(#falcon-streak)" strokeWidth="1.5"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: [-40, 20, -40], opacity: [0, 0.9, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.18, ease: "easeOut" }}
        />
      ))}

      {/* body */}
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* tail */}
        <path d="M40 70 L20 60 L20 80 Z" fill="url(#falcon-grad)" opacity="0.85" />
        {/* torso */}
        <path
          d="M40 70 Q90 55 140 60 Q160 62 170 70 Q160 78 140 80 Q90 85 40 70 Z"
          fill="url(#falcon-grad)"
        />
        {/* head + beak */}
        <path d="M170 70 L186 66 L182 74 Z" fill="oklch(0.95 0.1 90)" />
        <circle cx="166" cy="68" r="1.6" fill="oklch(0.13 0.03 260)" />

        {/* upper wing — flapping */}
        <motion.path
          d="M70 68 Q90 18 140 50 Q110 56 90 64 Z"
          fill="url(#falcon-grad)"
          style={{ transformOrigin: "100px 65px" }}
          animate={{ rotate: [-8, 8, -8], scaleY: [1, 0.92, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* lower wing */}
        <motion.path
          d="M70 72 Q90 118 140 90 Q110 84 90 76 Z"
          fill="url(#falcon-grad)"
          opacity="0.85"
          style={{ transformOrigin: "100px 75px" }}
          animate={{ rotate: [8, -8, 8], scaleY: [1, 0.92, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* feather highlights */}
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={95 + i * 10} y1={56 - i * 3}
            x2={125 + i * 6} y2={48 - i * 4}
            stroke="oklch(0.95 0.1 195 / 0.5)" strokeWidth="0.6"
          />
        ))}
      </motion.g>

      {/* targeting reticle */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "100px 70px" }}
      >
        <circle cx="100" cy="70" r="62" fill="none" stroke="oklch(0.72 0.22 330 / 0.3)" strokeWidth="0.5" strokeDasharray="2 4" />
      </motion.g>
    </motion.svg>
  );
}
