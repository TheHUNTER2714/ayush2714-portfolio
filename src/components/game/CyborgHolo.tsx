import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { LaunchGate } from "./LaunchGate";

const PALETTE = ["#22d3ee", "#a78bfa", "#34d399", "#f59e0b", "#ef4444", "#f472b6"];

/**
 * Techy cyborg holo-bust. Cursor-synced parallax tilt + eye + head tracking.
 * Pure SVG so it renders crisp at any size and stays light on the GPU.
 */
export function CyborgHolo() {
  const [idx, setIdx] = useState(0);
  const accent = PALETTE[idx];
  const wrap = useRef<HTMLDivElement>(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const ex = useMotionValue(0);
  const ey = useMotionValue(0);
  const sRx = useSpring(rx, { stiffness: 120, damping: 18 });
  const sRy = useSpring(ry, { stiffness: 120, damping: 18 });
  const sEx = useSpring(ex, { stiffness: 220, damping: 22 });
  const sEy = useSpring(ey, { stiffness: 220, damping: 22 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!wrap.current) return;
      const r = wrap.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width / 1.2)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height / 1.2)));
      ry.set(nx * 22);
      rx.set(-ny * 16);
      ex.set(nx * 4);
      ey.set(ny * 3);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [rx, ry, ex, ey]);

  const glareX = useTransform(ry, [-22, 22], ["0%", "100%"]);

  return (
    <div className="space-y-3">
      <LaunchGate label="BOOT CYBORG.SYNC" hint="▸ engage neural link · cursor-tracked" height={460} accent={accent}>
        <div ref={wrap} className="absolute inset-0 overflow-hidden" style={{ perspective: 1200 }}>
          {/* grid */}
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
            backgroundImage: `linear-gradient(${accent}22 1px,transparent 1px),linear-gradient(90deg,${accent}22 1px,transparent 1px)`,
            backgroundSize: "40px 40px",
          }} />

          {/* halo */}
          <motion.div
            className="absolute left-1/2 top-1/2 w-[440px] h-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${accent}55, transparent 60%)` }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.9, 0.55] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* parallax stage */}
          <motion.div
            className="absolute inset-0 grid place-items-center"
            style={{ rotateX: sRx, rotateY: sRy, transformStyle: "preserve-3d" }}
          >
            <motion.svg
              viewBox="0 0 320 380"
              width={320}
              height={380}
              style={{ transform: "translateZ(40px)", filter: `drop-shadow(0 0 24px ${accent})` }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <defs>
                <linearGradient id="cb-plate" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#1b2030" />
                  <stop offset="50%" stopColor="#0d1118" />
                  <stop offset="100%" stopColor="#252b3a" />
                </linearGradient>
                <linearGradient id="cb-face" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2a3142" />
                  <stop offset="100%" stopColor="#0a0d14" />
                </linearGradient>
                <radialGradient id="cb-eye" cx="0.5" cy="0.5">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor={accent} />
                  <stop offset="100%" stopColor={`${accent}00`} />
                </radialGradient>
                <linearGradient id="cb-edge" x1="0" x2="1">
                  <stop offset="0%" stopColor={`${accent}00`} />
                  <stop offset="50%" stopColor={accent} />
                  <stop offset="100%" stopColor={`${accent}00`} />
                </linearGradient>
              </defs>

              {/* neck + collar plates */}
              <path d="M120 300 L120 340 Q160 360 200 340 L200 300 Z" fill="url(#cb-plate)" stroke={accent} strokeWidth="1" />
              <path d="M70 360 Q160 320 250 360 L250 380 L70 380 Z" fill="url(#cb-plate)" stroke={accent} strokeWidth="1" />
              <line x1="160" y1="320" x2="160" y2="360" stroke={accent} strokeWidth="0.6" opacity="0.7" />

              {/* head silhouette — angular helmet */}
              <path
                d="M90 140 Q90 70 160 60 Q230 70 230 140 L230 220 Q230 280 200 300 L120 300 Q90 280 90 220 Z"
                fill="url(#cb-plate)" stroke={accent} strokeWidth="1.2"
              />
              {/* top crest */}
              <path d="M120 64 L160 48 L200 64 L200 80 L120 80 Z" fill="url(#cb-plate)" stroke={accent} strokeWidth="1" />
              <motion.rect x="156" y="40" width="8" height="14" fill={accent}
                animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }} />

              {/* faceplate inset */}
              <motion.g style={{ x: sEx, y: sEy }}>
                <path d="M108 150 Q160 130 212 150 L212 230 Q160 250 108 230 Z" fill="url(#cb-face)" stroke={accent} strokeWidth="0.8" />
                {/* visor band */}
                <rect x="108" y="170" width="104" height="28" fill="#05080d" stroke={accent} strokeWidth="0.8" />
                {/* visor scan */}
                <motion.rect x="110" y="172" width="20" height="24" fill={accent} opacity="0.5"
                  animate={{ x: [110, 190, 110] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} />
                {/* eyes */}
                <circle cx="138" cy="184" r="6" fill="url(#cb-eye)" />
                <circle cx="182" cy="184" r="6" fill="url(#cb-eye)" />
                <motion.circle cx="138" cy="184" r="2.2" fill="#ffffff"
                  animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                <motion.circle cx="182" cy="184" r="2.2" fill="#ffffff"
                  animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.1 }} />
                {/* visor HUD ticks */}
                {Array.from({ length: 9 }).map((_, i) => (
                  <rect key={i} x={114 + i * 11} y="194" width="6" height="2" fill={accent} opacity="0.7" />
                ))}
                {/* nose / vent */}
                <path d="M150 210 L160 222 L170 210 Z" fill="#05080d" stroke={accent} strokeWidth="0.6" />
                {/* mouth grill */}
                <g stroke={accent} strokeWidth="0.6" opacity="0.85">
                  <line x1="130" y1="234" x2="190" y2="234" />
                  <line x1="134" y1="240" x2="186" y2="240" />
                  <line x1="138" y1="246" x2="182" y2="246" />
                </g>
              </motion.g>

              {/* cheek plates */}
              <path d="M90 200 L108 210 L108 270 L94 280 Z" fill="url(#cb-plate)" stroke={accent} strokeWidth="0.8" />
              <path d="M230 200 L212 210 L212 270 L226 280 Z" fill="url(#cb-plate)" stroke={accent} strokeWidth="0.8" />

              {/* side ports + rivets */}
              {[100, 220].map((cx, i) => (
                <g key={i}>
                  <circle cx={cx} cy={170} r="3" fill={accent} opacity="0.9" />
                  <circle cx={cx} cy={230} r="3" fill="#0d1118" stroke={accent} strokeWidth="0.6" />
                </g>
              ))}

              {/* cable tendrils */}
              {[0, 1, 2].map((i) => (
                <motion.path
                  key={i}
                  d={`M${i === 0 ? 90 : i === 1 ? 160 : 230} 300 Q${160} ${340 + i * 6} ${i === 0 ? 240 : i === 1 ? 80 : 160} ${380}`}
                  fill="none" stroke={accent} strokeWidth="1.2" opacity="0.7"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 2 + i * 0.3, repeat: Infinity, repeatType: "reverse" }}
                />
              ))}

              {/* top antenna */}
              <line x1="160" y1="48" x2="160" y2="20" stroke={accent} strokeWidth="1" />
              <motion.circle cx="160" cy="18" r="3" fill={accent}
                animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />

              {/* edge sheen */}
              <path d="M90 140 Q90 70 160 60 Q230 70 230 140" fill="none" stroke="url(#cb-edge)" strokeWidth="1.4" />
            </motion.svg>

            {/* moving glare overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: useTransform(glareX, (v) =>
                  `linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.15) ${v}, transparent 65%)`
                ),
              }}
            />

            {/* orbiting telemetry chips */}
            {["NEURAL_LINK", "OPTIC.v4", "SERVO 98%", "CORE 41°C"].map((g, i, arr) => {
              const a = (i / arr.length) * Math.PI * 2;
              const r = 240;
              return (
                <motion.div
                  key={g}
                  className="absolute font-mono text-[10px] px-1.5 py-0.5 border pointer-events-none"
                  style={{
                    color: accent, borderColor: accent, background: "rgba(8,10,22,0.7)",
                    left: "50%", top: "50%",
                    transform: `translate(-50%,-50%) translate(${Math.cos(a) * r}px, ${Math.sin(a) * r * 0.55}px) translateZ(60px)`,
                    boxShadow: `0 0 10px ${accent}66`,
                  }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.3 }}
                >
                  {g}
                </motion.div>
              );
            })}

            {/* ground ring */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
              style={{
                bottom: 30, width: 360, height: 30,
                border: `1px solid ${accent}`, boxShadow: `0 0 24px ${accent}aa`,
                transform: "translateZ(-20px) rotateX(70deg)",
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* HUD */}
          <div className="absolute top-3 left-3 font-mono text-[10px]" style={{ color: accent, textShadow: `0 0 8px ${accent}` }}>
            ⌬ CYBORG.LINK — NEURAL_SYNC v4.1
          </div>
          <div className="absolute top-3 right-3 font-mono text-[10px] text-muted-foreground">
            ▸ CURSOR_TRACK · ACTIVE
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
            <div className="font-mono text-[10px] text-muted-foreground">▸ move cursor · pick channel</div>
            <div className="flex gap-1.5">
              {PALETTE.map((c, i) => (
                <motion.button
                  key={c} whileHover={{ scale: 1.25 }} whileTap={{ scale: 0.85 }}
                  onClick={() => setIdx(i)} className="w-4 h-4 rounded-full"
                  style={{ background: c, boxShadow: i === idx ? `0 0 14px ${c}, 0 0 0 2px white inset` : `0 0 6px ${c}66` }}
                  aria-label={`accent ${c}`}
                />
              ))}
            </div>
          </div>
        </div>
      </LaunchGate>
    </div>
  );
}
