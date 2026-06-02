import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import intro from "@/assets/intro.mp4.asset.json";

/**
 * Cinematic intro video — autoplays ONCE with sound, pauses when scrolled
 * out of view, never resumes. Wrapped in a holographic projector frame
 * with scanlines, corner brackets, telemetry overlay, and a mute/unmute
 * fallback for browsers that block audio autoplay.
 */
export function IntroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [played, setPlayed] = useState(false);
  const [muted, setMuted] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [ended, setEnded] = useState(false);

  // Try to autoplay with sound; fall back to muted if the browser blocks it
  useEffect(() => {
    const v = ref.current;
    if (!v || played) return;
    v.muted = false;
    v.volume = 0.9;
    const attempt = v.play();
    if (attempt && typeof attempt.then === "function") {
      attempt.then(() => setPlayed(true)).catch(() => {
        // Browser blocked unmuted autoplay — retry muted, surface a tap-to-unmute chip
        v.muted = true;
        setMuted(true);
        setNeedsTap(true);
        v.play().then(() => setPlayed(true)).catch(() => {});
      });
    }
  }, [played]);

  // Pause when the video scrolls out of view; never auto-resume
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        const v = ref.current;
        if (!v || ended) return;
        if (!e.isIntersecting && !v.paused) v.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ended]);

  const unmute = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
    setNeedsTap(false);
    v.play().catch(() => {});
  };

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, scale: 0.92, rotateY: -8 }}
      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative corner-frame box-glow bg-[oklch(0.06_0.02_260)] overflow-hidden"
      style={{ perspective: 1200 }}
    >
      <span className="c-bl" /><span className="c-br" />

      {/* Projector beam */}
      <motion.div
        aria-hidden
        className="absolute -inset-12 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 30%, oklch(0.82 0.18 195 / 0.18), transparent 70%)",
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3.4, repeat: Infinity }}
      />

      <div className="relative aspect-video">
        <video
          ref={ref}
          src={intro.url}
          playsInline
          preload="auto"
          onEnded={() => setEnded(true)}
          className="w-full h-full object-cover"
          style={{ filter: "saturate(1.15) contrast(1.05)" }}
        />

        {/* Scanlines */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-50"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0 2px, oklch(0 0 0 / 0.35) 2px 3px)",
          }}
        />

        {/* Chromatic ring sweep */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.0, 0.25, 0.0] }}
          transition={{ duration: 2.8, repeat: Infinity }}
          style={{
            background:
              "linear-gradient(120deg, transparent 30%, oklch(0.82 0.18 195 / 0.25) 50%, transparent 70%)",
          }}
        />

        {/* HUD telemetry */}
        <div className="absolute top-2 left-2 font-mono text-[10px] tracking-widest text-primary/90 drop-shadow">
          ▸ INTRO_FEED.LIVE
        </div>
        <div className="absolute top-2 right-2 font-mono text-[10px] tracking-widest text-accent/90 flex items-center gap-1.5">
          <motion.span
            className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--hp)]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          REC
        </div>
        <div className="absolute bottom-2 left-2 font-mono text-[10px] text-muted-foreground">
          CH.01 · AYUSH.AGNIHOTRI · NEON_GRID
        </div>
        <div className="absolute bottom-2 right-2 font-mono text-[10px] text-muted-foreground">
          24fps · 4:3 sync
        </div>

        {/* Corner reticles */}
        {[
          ["top-1 left-1", "border-t border-l"],
          ["top-1 right-1", "border-t border-r"],
          ["bottom-1 left-1", "border-b border-l"],
          ["bottom-1 right-1", "border-b border-r"],
        ].map(([pos, b], i) => (
          <span key={i} className={`absolute ${pos} w-4 h-4 ${b} border-primary/80`} />
        ))}

        {/* Tap-to-unmute chip when autoplay-with-sound was blocked */}
        <AnimatePresence>
          {needsTap && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onClick={unmute}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 corner-frame bg-primary/20 border border-primary text-primary font-display text-[11px] tracking-widest px-3 py-1.5"
            >
              <span className="c-bl" /><span className="c-br" />
              ▸ TAP TO UNMUTE
            </motion.button>
          )}
        </AnimatePresence>

        {/* Replay overlay once ended */}
        <AnimatePresence>
          {ended && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 grid place-items-center bg-background/40 backdrop-blur-[2px]"
            >
              <button
                onClick={() => {
                  const v = ref.current;
                  if (!v) return;
                  v.currentTime = 0;
                  v.muted = muted;
                  v.play();
                  setEnded(false);
                }}
                className="corner-frame bg-card px-4 py-2 font-display text-xs tracking-widest text-accent"
              >
                <span className="c-bl" /><span className="c-br" />
                ↻ REPLAY INTRO
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom telemetry strip */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-primary/30 font-mono text-[10px] text-muted-foreground">
        <span className="text-primary">▸ HOLO-PROJECTOR · SIGNAL LOCKED</span>
        <span>{muted ? "AUDIO MUTED" : "AUDIO LIVE"}</span>
      </div>
    </motion.div>
  );
}
