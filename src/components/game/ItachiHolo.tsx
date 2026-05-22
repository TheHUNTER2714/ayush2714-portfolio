import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { LaunchGate } from "./LaunchGate";

const PALETTE = ["#ef4444", "#22d3ee", "#a78bfa", "#f59e0b", "#34d399", "#f472b6"];

/**
 * Cursor-synced 3D Itachi holo-projection.
 * Uses an mp4 loop as the projection feed; the entire stage parallaxes with the cursor.
 */
export function ItachiHolo() {
  const [idx, setIdx] = useState(0);
  const accent = PALETTE[idx];
  const wrap = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sRx = useSpring(rx, { stiffness: 120, damping: 18, mass: 0.6 });
  const sRy = useSpring(ry, { stiffness: 120, damping: 18, mass: 0.6 });
  const sPx = useSpring(px, { stiffness: 90, damping: 20 });
  const sPy = useSpring(py, { stiffness: 90, damping: 20 });
  const glareX = useTransform(ry, [-20, 20], ["0%", "100%"]);

  // Track cursor globally so it still "follows" when cursor leaves the frame
  useEffect(() => {
    const onMove = (e: globalThis.MouseEvent) => {
      if (!wrap.current) return;
      const r = wrap.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width / 1.2)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height / 1.2)));
      ry.set(nx * 18);
      rx.set(-ny * 14);
      px.set(nx * 24);
      py.set(ny * 20);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [rx, ry, px, py]);

  // Try to play the looped video once mounted
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, [ready]);

  const onLocalMove = (_e: MouseEvent<HTMLDivElement>) => {/* global handler covers it */};

  return (
    <div className="space-y-3">
      <LaunchGate
        label="BOOT ITACHI.SYNC"
        hint="▸ tap to engage sharingan link · cursor-tracked"
        height={460}
        accent={accent}
      >
        <div
          ref={(el) => { wrap.current = el; if (el && !ready) setReady(true); }}
          onMouseMove={onLocalMove}
          className="absolute inset-0 overflow-hidden"
          style={{ perspective: 1200 }}
        >
          {/* grid backdrop */}
          <div className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(${accent}22 1px, transparent 1px), linear-gradient(90deg, ${accent}22 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* glow halo */}
          <motion.div
            className="absolute left-1/2 top-1/2 w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${accent}55, transparent 60%)` }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.85, 0.55] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* parallax stage */}
          <motion.div
            className="absolute inset-0 grid place-items-center"
            style={{
              rotateX: sRx, rotateY: sRy, x: sPx, y: sPy,
              transformStyle: "preserve-3d",
            }}
          >
            <motion.div
              className="relative"
              style={{
                width: 320, height: 380,
                clipPath: "polygon(8% 0,92% 0,100% 12%,100% 88%,92% 100%,8% 100%,0 88%,0 12%)",
                transform: "translateZ(40px)",
                boxShadow: `0 0 60px ${accent}aa, inset 0 0 60px ${accent}55`,
                background: "oklch(0.08 0.03 260)",
              }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <video
                ref={videoRef}
                src="/itachi.mp4"
                autoPlay loop muted playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: `hue-rotate(${idx * 35}deg) saturate(1.2) contrast(1.05)`, mixBlendMode: "screen" }}
              />
              {/* tint */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: `linear-gradient(180deg, ${accent}22, transparent 30%, transparent 70%, ${accent}33)` }}
              />
              {/* scan-lines */}
              <div className="absolute inset-0 mix-blend-overlay pointer-events-none opacity-40"
                style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0 2px, rgba(255,255,255,0.12) 2px 3px)" }}
              />
              {/* moving glare */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: useTransform(glareX, (v) =>
                    `linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) ${v}, transparent 65%)`
                  ),
                }}
              />
              {/* corner ticks */}
              {[
                "top-1 left-1", "top-1 right-1", "bottom-1 left-1", "bottom-1 right-1",
              ].map((p, i) => (
                <span key={i} className={`absolute ${p} w-3 h-3 border-l border-t`}
                  style={{ borderColor: accent, boxShadow: `0 0 8px ${accent}` }} />
              ))}
            </motion.div>

            {/* orbiting glyphs */}
            {["SHARINGAN", "AMATERASU", "TSUKUYOMI", "SUSANOO"].map((g, i, arr) => {
              const a = (i / arr.length) * Math.PI * 2;
              const r = 230;
              return (
                <motion.div
                  key={g}
                  className="absolute font-mono text-[10px] px-1.5 py-0.5 border pointer-events-none"
                  style={{
                    color: accent, borderColor: accent, background: "rgba(8,10,22,0.7)",
                    left: "50%", top: "50%",
                    transform: `translate(-50%,-50%) translate(${Math.cos(a) * r}px, ${Math.sin(a) * r * 0.55}px) translateZ(80px)`,
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
                border: `1px solid ${accent}`,
                boxShadow: `0 0 24px ${accent}aa`,
                transform: "translateZ(-20px) rotateX(70deg)",
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* HUD */}
          <div className="absolute top-3 left-3 font-mono text-[10px]" style={{ color: accent, textShadow: `0 0 8px ${accent}` }}>
            ⌬ ITACHI.LINK — SHARINGAN_SYNC v2.7
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
                  onClick={() => setIdx(i)}
                  className="w-4 h-4 rounded-full"
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
