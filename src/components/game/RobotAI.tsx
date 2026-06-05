import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type Emotion = "idle" | "happy" | "think" | "alert" | "love";

/**
 * Advanced emotive humanoid robot avatar for the AI Co-Pilot section.
 * - Eyes + head + body track the cursor with spring physics
 * - Cycling emotion states (idle/happy/think/alert/love) drive visor color,
 *   mouth shape, antenna ping, blush, and ambient particle field
 * - Transmission shockwave triggers on `fire` increments
 * - Reactive "PROC" telemetry bar while busy
 */
export function RobotAI({
  size = 220,
  busy = false,
  fire = 0,
}: {
  size?: number;
  busy?: boolean;
  fire?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  // Cursor tracking with springs
  const mx = useMotionValue(0); // -1 .. 1
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 14, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 90, damping: 14, mass: 0.4 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / Math.max(window.innerWidth / 2, 1);
      const dy = (e.clientY - cy) / Math.max(window.innerHeight / 2, 1);
      mx.set(Math.max(-1, Math.min(1, dx)));
      my.set(Math.max(-1, Math.min(1, dy)));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  // Derived eye/head offsets
  const eyeX = useTransform(sx, [-1, 1], [-3.2, 3.2]);
  const eyeY = useTransform(sy, [-1, 1], [-2.2, 2.2]);
  const headRot = useTransform(sx, [-1, 1], [-6, 6]);
  const headTilt = useTransform(sy, [-1, 1], [-3, 3]);
  const bodyShift = useTransform(sx, [-1, 1], [-2.5, 2.5]);

  // Emotion cycling — also pops to "alert" when busy / fires when fire triggers
  const [emotion, setEmotion] = useState<Emotion>("idle");
  useEffect(() => {
    if (busy) {
      setEmotion("think");
      return;
    }
    const cycle: Emotion[] = ["idle", "happy", "love", "idle"];
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % cycle.length;
      setEmotion(cycle[i]);
    }, 3400);
    return () => clearInterval(id);
  }, [busy]);

  useEffect(() => {
    if (fire <= 0) return;
    setEmotion("alert");
    const t = setTimeout(() => setEmotion(busy ? "think" : "happy"), 900);
    return () => clearTimeout(t);
  }, [fire, busy]);

  // Blink
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    let live = true;
    const loop = () => {
      if (!live) return;
      setBlink(true);
      setTimeout(() => setBlink(false), 110);
      setTimeout(loop, 1800 + Math.random() * 2600);
    };
    const id = setTimeout(loop, 1400);
    return () => {
      live = false;
      clearTimeout(id);
    };
  }, []);

  const palette = EMOTION_PALETTE[emotion];

  // Ambient orbiting glyphs (memo to avoid re-init)
  const orbs = useMemo(
    () => [
      { a: 0, color: "#a78bfa", r: 92, dur: 9 },
      { a: 90, color: "#22d3ee", r: 96, dur: 11 },
      { a: 200, color: "#f472b6", r: 88, dur: 8 },
      { a: 300, color: "#facc15", r: 100, dur: 13 },
    ],
    []
  );

  return (
    <div
      ref={wrapRef}
      className="relative select-none"
      style={{ width: size, height: size * 1.18 }}
    >
      {/* Aura */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${palette.aura} , transparent 65%)`,
        }}
        animate={{ opacity: busy ? [0.65, 1, 0.65] : [0.4, 0.78, 0.4] }}
        transition={{ duration: busy ? 0.85 : 2.6, repeat: Infinity }}
      />

      {/* Floor reflection */}
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 bottom-0 h-3 w-[70%] rounded-[50%] blur-md"
        style={{ background: palette.glow, opacity: 0.55 }}
      />

      {/* Transmission shockwave */}
      <AnimatePresence>
        {fire > 0 && (
          <motion.span
            key={fire}
            initial={{ scale: 0.3, opacity: 0.9 }}
            animate={{ scale: 2.8, opacity: 0 }}
            transition={{ duration: 1.15, ease: "easeOut" }}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow: `0 0 0 3px ${palette.shock1}, 0 0 50px ${palette.shock2}`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Ambient hearts when in "love" emotion */}
      <AnimatePresence>
        {emotion === "love" &&
          [0, 1, 2].map((i) => (
            <motion.span
              key={`heart-${i}`}
              initial={{ y: 30, x: 30 + i * 50, opacity: 0, scale: 0.6 }}
              animate={{ y: -80, opacity: [0, 1, 0], scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, delay: i * 0.35, repeat: Infinity }}
              className="absolute left-2 bottom-10 text-pink-400 text-sm pointer-events-none"
            >
              ♥
            </motion.span>
          ))}
      </AnimatePresence>

      <motion.div
        style={{ x: bodyShift }}
        className="absolute inset-0"
      >
        <motion.svg
          viewBox="0 0 220 260"
          className="relative w-full h-full"
          animate={busy ? { y: [0, -3.5, 0] } : { y: [0, -1.8, 0] }}
          transition={{ duration: busy ? 0.85 : 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <defs>
            <linearGradient id="r-body" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#dbe5f1" />
              <stop offset="55%" stopColor="#475569" />
              <stop offset="100%" stopColor="#0b1220" />
            </linearGradient>
            <linearGradient id="r-plate" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <radialGradient id="r-visor" cx="0.5" cy="0.45">
              <stop offset="0%" stopColor={palette.visorBright} />
              <stop offset="60%" stopColor={palette.visorMid} />
              <stop offset="100%" stopColor={palette.visorDeep} />
            </radialGradient>
            <linearGradient id="r-glow" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={palette.coreA} />
              <stop offset="100%" stopColor={palette.coreB} />
            </linearGradient>
            <filter id="r-soft" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.8" />
            </filter>
            <filter id="r-glow-f" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.4" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Pauldrons */}
          <motion.g animate={{ y: busy ? [0, -2.4, 0] : 0 }} transition={{ duration: 0.75, repeat: busy ? Infinity : 0 }}>
            <path d="M28 132 Q40 102 70 108 L70 152 Q40 158 28 144 Z" fill="url(#r-body)" stroke={palette.line} strokeOpacity="0.5" />
            <path d="M192 132 Q180 102 150 108 L150 152 Q180 158 192 144 Z" fill="url(#r-body)" stroke={palette.line} strokeOpacity="0.5" />
            <circle cx="40" cy="128" r="3" fill="url(#r-glow)" />
            <circle cx="180" cy="128" r="3" fill="url(#r-glow)" />
          </motion.g>

          {/* Torso */}
          <g>
            <path d="M68 110 L152 110 L162 220 Q110 232 58 220 Z" fill="url(#r-body)" stroke={palette.line} strokeOpacity="0.55" />
            <path d="M82 122 L138 122 L144 168 L76 168 Z" fill="url(#r-plate)" opacity="0.92" />
            {/* Sternum reactor — pulses with emotion color */}
            <motion.g
              animate={{ scale: busy ? [1, 1.2, 1] : [1, 1.08, 1] }}
              transition={{ duration: busy ? 0.55 : 1.7, repeat: Infinity }}
              style={{ transformOrigin: "110px 150px" }}
            >
              <circle cx="110" cy="150" r="15" fill="#0c1424" stroke={palette.coreA} />
              <circle cx="110" cy="150" r="10" fill="url(#r-glow)" filter="url(#r-soft)" />
              <circle cx="110" cy="150" r="3.8" fill="#f0f9ff" />
              {/* heartbeat ring */}
              <motion.circle
                cx="110" cy="150" r="15"
                fill="none" stroke={palette.coreA} strokeOpacity="0.6"
                animate={{ r: [15, 26], opacity: [0.7, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
              />
            </motion.g>
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M76 ${182 + i * 10} L144 ${182 + i * 10}`} stroke={palette.line} strokeOpacity="0.35" strokeWidth="0.8" />
            ))}
            <g fontFamily="monospace" fontSize="6" fill={palette.line}>
              <text x="80" y="216">SYS//{emotion.toUpperCase()}</text>
              <text x="124" y="216">v27.12</text>
            </g>
          </g>

          {/* Neck */}
          <path d="M96 96 L124 96 L128 110 L92 110 Z" fill="#1e293b" stroke={palette.line} strokeOpacity="0.4" />

          {/* Head — tracks cursor */}
          <motion.g
            style={{ rotate: headRot, originX: "110px", originY: "70px" }}
          >
            <motion.g style={{ y: headTilt }}>
              <path d="M70 60 Q70 28 110 24 Q150 28 150 60 L150 88 Q132 100 110 100 Q88 100 70 88 Z" fill="url(#r-body)" stroke={palette.line} strokeOpacity="0.55" />
              <path d="M110 24 L110 60" stroke={palette.line} strokeOpacity="0.4" />
              <path d="M82 38 Q110 32 138 38" stroke={palette.line} strokeOpacity="0.3" />

              {/* Visor */}
              <rect x="78" y="58" width="64" height="22" rx="3" fill="url(#r-visor)" />
              <rect x="78" y="58" width="64" height="22" rx="3" fill="none" stroke={palette.line} />

              {/* Eyes — follow cursor + blink + emotion shape */}
              <EmotionEyes emotion={emotion} blink={blink} eyeX={eyeX} eyeY={eyeY} color={palette.eye} />

              {/* visor scan-line */}
              <motion.rect
                x="78" y="58" width="64" height="2" fill={palette.scan} opacity="0.85"
                animate={{ y: [58, 78, 58] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Mouth — morphs with emotion */}
              <EmotionMouth emotion={emotion} color={palette.line} />

              {/* Blush when love/happy */}
              {(emotion === "love" || emotion === "happy") && (
                <>
                  <circle cx="84" cy="88" r="3.5" fill="#f472b6" opacity="0.55" />
                  <circle cx="136" cy="88" r="3.5" fill="#f472b6" opacity="0.55" />
                </>
              )}

              {/* Antenna */}
              <line x1="110" y1="24" x2="110" y2="10" stroke={palette.coreA} />
              <motion.circle
                cx="110" cy="8" r="2.6" fill={palette.coreA}
                animate={{
                  opacity: [0.4, 1, 0.4],
                  r: emotion === "alert" ? [2, 4, 2] : [2, 3, 2],
                }}
                transition={{ duration: emotion === "alert" ? 0.5 : 1.1, repeat: Infinity }}
              />
              {emotion === "alert" && (
                <motion.circle
                  cx="110" cy="8" r="3"
                  fill="none" stroke="#f87171"
                  animate={{ r: [3, 10], opacity: [1, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                />
              )}

              {/* side jaw vents */}
              <path d="M72 76 L80 84 L72 88 Z" fill={palette.coreA} opacity="0.5" />
              <path d="M148 76 L140 84 L148 88 Z" fill={palette.coreA} opacity="0.5" />
            </motion.g>
          </motion.g>

          {/* Arms drift */}
          <motion.g
            animate={busy ? { rotate: [-4, 4, -4] } : { rotate: [-1.2, 1.2, -1.2] }}
            transition={{ duration: busy ? 0.9 : 3.4, repeat: Infinity }}
            style={{ transformOrigin: "40px 140px" }}
          >
            <path d="M30 144 L46 152 L40 200 L22 196 Z" fill="url(#r-body)" stroke={palette.line} strokeOpacity="0.4" />
            <circle cx="30" cy="200" r="6" fill="#0c1424" stroke={palette.coreA} />
          </motion.g>
          <motion.g
            animate={busy ? { rotate: [4, -4, 4] } : { rotate: [1.2, -1.2, 1.2] }}
            transition={{ duration: busy ? 0.9 : 3.4, repeat: Infinity }}
            style={{ transformOrigin: "180px 140px" }}
          >
            <path d="M190 144 L174 152 L180 200 L198 196 Z" fill="url(#r-body)" stroke={palette.line} strokeOpacity="0.4" />
            <circle cx="190" cy="200" r="6" fill="#0c1424" stroke={palette.coreA} />
          </motion.g>

          {/* Pedestal */}
          <g opacity="0.7">
            <path d="M62 234 L158 234 L172 248 L48 248 Z" fill="#0f172a" stroke={palette.coreA} strokeOpacity="0.6" />
            <path d="M62 234 L158 234" stroke={palette.line} strokeOpacity="0.7" />
            {/* energy strip */}
            <motion.rect
              x="62" y="233" width="96" height="2"
              fill={palette.coreA}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
          </g>

          {/* Orbiting glyphs */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "110px 130px" }}
          >
            {orbs.map((o, i) => {
              const rad = (o.a * Math.PI) / 180;
              return (
                <circle
                  key={i}
                  cx={110 + Math.cos(rad) * o.r}
                  cy={130 + Math.sin(rad) * o.r}
                  r={2}
                  fill={o.color}
                  filter="url(#r-glow-f)"
                />
              );
            })}
          </motion.g>
        </motion.svg>
      </motion.div>

      {/* Telemetry chip */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-widest text-primary/90 bg-card/80 corner-frame px-2 py-0.5">
        <span className="c-bl" />
        <span className="c-br" />
        {busy ? "PROC ▮▮▮▮▯" : emotion === "love" ? "HEART ▮▮▮▯▯" : emotion === "alert" ? "ALERT ▮▮▮▮▮" : "IDLE ▮▮▯▯▯"}
      </div>

      {/* Emotion badge */}
      <motion.div
        key={emotion}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute -top-2 right-0 font-mono text-[9px] px-2 py-0.5 bg-card/80 border border-primary/40 text-primary/90 tracking-widest"
      >
        {emotion.toUpperCase()}
      </motion.div>
    </div>
  );
}

/* -------------------- Emotion sub-components -------------------- */

function EmotionEyes({
  emotion,
  blink,
  eyeX,
  eyeY,
  color,
}: {
  emotion: Emotion;
  blink: boolean;
  eyeX: any;
  eyeY: any;
  color: string;
}) {
  // Happy / love → arcs. Think → half-closed. Alert → wide. Idle → dots.
  if (emotion === "happy" || emotion === "love") {
    return (
      <g stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round">
        <path d="M88 72 Q94 64 100 72" />
        <path d="M120 72 Q126 64 132 72" />
        {emotion === "love" && (
          <>
            <text x="86" y="74" fontSize="9" fill="#f472b6">♥</text>
            <text x="118" y="74" fontSize="9" fill="#f472b6">♥</text>
          </>
        )}
      </g>
    );
  }
  if (emotion === "think") {
    return (
      <g fill={color}>
        <rect x="86" y="68" width="16" height="2" rx="1" />
        <rect x="118" y="68" width="16" height="2" rx="1" />
      </g>
    );
  }
  const r = emotion === "alert" ? 4 : 3;
  return (
    <g>
      <motion.circle cx="94" cy="69" r={blink ? 0.4 : r} fill="#f0fdff" style={{ x: eyeX, y: eyeY }} />
      <motion.circle cx="126" cy="69" r={blink ? 0.4 : r} fill="#f0fdff" style={{ x: eyeX, y: eyeY }} />
      {emotion === "alert" && (
        <>
          <circle cx="94" cy="69" r="5.5" fill="none" stroke="#f87171" strokeWidth="0.8" />
          <circle cx="126" cy="69" r="5.5" fill="none" stroke="#f87171" strokeWidth="0.8" />
        </>
      )}
    </g>
  );
}

function EmotionMouth({ emotion, color }: { emotion: Emotion; color: string }) {
  if (emotion === "happy" || emotion === "love") {
    return (
      <path
        d="M92 92 Q110 102 128 92"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    );
  }
  if (emotion === "alert") {
    return <circle cx="110" cy="94" r="3.5" fill="#0c1424" stroke={color} />;
  }
  if (emotion === "think") {
    return <path d="M100 94 L120 94" stroke={color} strokeWidth="1.4" strokeLinecap="round" />;
  }
  // idle grille
  return (
    <g stroke={color} strokeOpacity="0.7">
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={90 + i * 10} y1={90} x2={90 + i * 10} y2={96} />
      ))}
    </g>
  );
}

/* -------------------- Palettes -------------------- */

const EMOTION_PALETTE: Record<Emotion, {
  aura: string; glow: string; line: string; eye: string;
  coreA: string; coreB: string;
  visorBright: string; visorMid: string; visorDeep: string;
  scan: string; shock1: string; shock2: string;
}> = {
  idle: {
    aura: "oklch(0.82 0.18 195 / 0.35)",
    glow: "oklch(0.72 0.18 195 / 0.55)",
    line: "#67e8f9",
    eye: "#f0fdff",
    coreA: "#22d3ee", coreB: "#a78bfa",
    visorBright: "#67e8f9", visorMid: "#0891b2", visorDeep: "#022c3a",
    scan: "#a5f3fc",
    shock1: "oklch(0.82 0.2 195 / 0.7)", shock2: "oklch(0.72 0.28 330 / 0.8)",
  },
  happy: {
    aura: "oklch(0.85 0.18 150 / 0.38)",
    glow: "oklch(0.78 0.2 150 / 0.55)",
    line: "#86efac",
    eye: "#ecfccb",
    coreA: "#4ade80", coreB: "#22d3ee",
    visorBright: "#86efac", visorMid: "#15803d", visorDeep: "#052e16",
    scan: "#bbf7d0",
    shock1: "oklch(0.85 0.2 150 / 0.7)", shock2: "oklch(0.78 0.2 200 / 0.7)",
  },
  think: {
    aura: "oklch(0.78 0.16 270 / 0.4)",
    glow: "oklch(0.7 0.2 270 / 0.55)",
    line: "#c4b5fd",
    eye: "#ede9fe",
    coreA: "#a78bfa", coreB: "#22d3ee",
    visorBright: "#c4b5fd", visorMid: "#5b21b6", visorDeep: "#1e1b4b",
    scan: "#ddd6fe",
    shock1: "oklch(0.78 0.2 270 / 0.7)", shock2: "oklch(0.72 0.22 195 / 0.7)",
  },
  alert: {
    aura: "oklch(0.78 0.22 25 / 0.42)",
    glow: "oklch(0.72 0.24 25 / 0.6)",
    line: "#fca5a5",
    eye: "#fff1f2",
    coreA: "#f87171", coreB: "#facc15",
    visorBright: "#fda4af", visorMid: "#9f1239", visorDeep: "#450a0a",
    scan: "#fecaca",
    shock1: "oklch(0.78 0.25 25 / 0.8)", shock2: "oklch(0.85 0.2 80 / 0.8)",
  },
  love: {
    aura: "oklch(0.82 0.2 340 / 0.4)",
    glow: "oklch(0.75 0.22 340 / 0.55)",
    line: "#f9a8d4",
    eye: "#fdf2f8",
    coreA: "#f472b6", coreB: "#a78bfa",
    visorBright: "#f9a8d4", visorMid: "#9d174d", visorDeep: "#4a044e",
    scan: "#fbcfe8",
    shock1: "oklch(0.82 0.22 340 / 0.75)", shock2: "oklch(0.78 0.22 270 / 0.75)",
  },
};
