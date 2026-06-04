import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import intro from "@/assets/intro.mp4.asset.json";

/**
 * Cinematic intro video with full audio controls + toggleable captions.
 *
 *  • DEFAULT MUTED — autoplays silently, user opts into audio.
 *  • Captions/Subtitles overlay (CC) driven by a timed VTT-like script,
 *    so it works regardless of the source file having an embedded track.
 *  • Smooth scrub bar, volume slider, mute, play/pause, fullscreen, replay.
 *  • Pauses when scrolled out of view; never auto-resumes.
 */

type Cue = { from: number; to: number; text: string };

const CAPTIONS: Cue[] = [
  { from: 0.0,  to: 3.2,  text: "▸ Booting AYUSH.AGNIHOTRI — Phoenix protocol online." },
  { from: 3.2,  to: 6.4,  text: "Full-stack developer · AI enthusiast · arcade architect." },
  { from: 6.4,  to: 9.6,  text: "Building cinematic, game-grade web experiences." },
  { from: 9.6,  to: 13.0, text: "Press play. Pick a quest. Let's ship something legendary." },
  { from: 13.0, to: 99.0, text: "▸ Signal stable. Welcome to the grid." },
];

export function IntroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [played, setPlayed] = useState(false);
  const [muted, setMuted] = useState(true);          // ← default MUTED
  const [ended, setEnded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [paused, setPaused] = useState(false);
  const [showCC, setShowCC] = useState(true);

  // Autoplay muted (allowed by all browsers).
  useEffect(() => {
    const v = ref.current;
    if (!v || played) return;
    v.muted = true;
    v.volume = volume;
    v.play().then(() => setPlayed(true)).catch(() => {});
  }, [played, volume]);

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

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const onTime = () => {
      if (!v.duration) return;
      setTime(v.currentTime);
      setProgress(v.currentTime / v.duration);
    };
    const onMeta = () => setDuration(v.duration || 0);
    const onPause = () => setPaused(true);
    const onPlay = () => setPaused(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("pause", onPause);
    v.addEventListener("play", onPlay);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("play", onPlay);
    };
  }, []);

  const activeCue = useMemo(
    () => CAPTIONS.find((c) => time >= c.from && time < c.to),
    [time]
  );

  const toggleMute = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };
  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play(); else v.pause();
  };
  const setVol = (n: number) => {
    const v = ref.current;
    if (!v) return;
    v.volume = n;
    setVolume(n);
    if (n > 0) { v.muted = false; setMuted(false); }
  };
  const scrub = (n: number) => {
    const v = ref.current;
    if (!v || !v.duration) return;
    v.currentTime = n * v.duration;
  };
  const fullscreen = () => {
    const v = ref.current;
    if (!v) return;
    if ((v as any).requestFullscreen) (v as any).requestFullscreen();
  };

  const fmt = (t: number) => {
    if (!isFinite(t)) return "00:00";
    const m = Math.floor(t / 60).toString().padStart(2, "0");
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, scale: 0.94, rotateY: -6 }}
      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative corner-frame box-glow bg-[oklch(0.06_0.02_260)] overflow-hidden w-full"
      style={{ perspective: 1200 }}
    >
      <span className="c-bl" /><span className="c-br" />

      <motion.div
        aria-hidden
        className="absolute -inset-16 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 30%, oklch(0.82 0.18 195 / 0.22), transparent 70%)",
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3.4, repeat: Infinity }}
      />

      <div className="relative aspect-[16/10]">
        <video
          ref={ref}
          src={intro.url}
          playsInline
          preload="auto"
          muted
          onClick={togglePlay}
          onEnded={() => setEnded(true)}
          className="w-full h-full object-cover cursor-pointer"
          style={{ filter: "saturate(1.15) contrast(1.05)" }}
        />

        {/* scanlines */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-50"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0 2px, oklch(0 0 0 / 0.35) 2px 3px)",
          }}
        />

        {/* sheen sweep */}
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

        {/* HUD chips */}
        <div className="absolute top-2 left-2 font-mono text-[10px] tracking-widest text-primary/90 drop-shadow">
          ▸ INTRO_FEED.LIVE
        </div>
        <div className="absolute top-2 right-2 font-mono text-[10px] tracking-widest text-accent/90 flex items-center gap-1.5">
          <motion.span
            className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--hp)]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          {paused ? "PAUSED" : "REC"}
        </div>

        {/* corner brackets */}
        {[
          ["top-1 left-1", "border-t border-l"],
          ["top-1 right-1", "border-t border-r"],
          ["bottom-1 left-1", "border-b border-l"],
          ["bottom-1 right-1", "border-b border-r"],
        ].map(([pos, b], i) => (
          <span key={i} className={`absolute ${pos} w-5 h-5 ${b} border-primary/80`} />
        ))}

        {/* CAPTIONS overlay */}
        <AnimatePresence mode="wait">
          {showCC && activeCue && (
            <motion.div
              key={activeCue.from}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute left-1/2 -translate-x-1/2 bottom-3 max-w-[88%] px-4 py-1.5 text-center pointer-events-none"
              style={{
                background: "oklch(0.05 0.02 260 / 0.78)",
                border: "1px solid oklch(0.82 0.18 195 / 0.45)",
                boxShadow: "0 0 18px oklch(0.82 0.18 195 / 0.3)",
                color: "oklch(0.96 0.02 195)",
                fontFamily: "var(--font-mono, monospace)",
                fontSize: 12,
                letterSpacing: "0.04em",
                textShadow: "0 1px 6px oklch(0 0 0 / 0.8)",
              }}
            >
              {activeCue.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* MUTED nudge — encourages unmute */}
        <AnimatePresence>
          {muted && !ended && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onClick={toggleMute}
              className="absolute top-10 right-2 corner-frame bg-primary/20 border border-primary/70 text-primary font-display text-[10px] tracking-widest px-3 py-1.5 backdrop-blur-sm"
            >
              <span className="c-bl" /><span className="c-br" />
              ▸ TAP FOR AUDIO
            </motion.button>
          )}
        </AnimatePresence>

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
                className="corner-frame bg-card px-5 py-2.5 font-display text-sm tracking-widest text-accent"
              >
                <span className="c-bl" /><span className="c-br" />
                ↻ REPLAY INTRO
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TRANSPORT */}
      <div className="relative px-3 py-2.5 border-t border-primary/30 bg-[oklch(0.05_0.02_260_/_0.9)] space-y-2">
        <div
          className="relative h-1.5 bg-secondary/60 cursor-pointer group"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            scrub((e.clientX - r.left) / r.width);
          }}
        >
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-accent to-[var(--xp)]"
            style={{ width: `${progress * 100}%` }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_oklch(0.82_0.18_195)] transition-transform group-hover:scale-125"
            style={{ left: `calc(${progress * 100}% - 5px)` }}
          />
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px]">
          <button onClick={togglePlay} className="text-primary hover:text-accent transition-colors">
            {paused ? "▶ PLAY" : "❚❚ PAUSE"}
          </button>
          <button onClick={toggleMute} className="text-accent hover:text-primary transition-colors">
            {muted ? "🔇 UNMUTE" : "🔊 MUTE"}
          </button>
          <button
            onClick={() => setShowCC((v) => !v)}
            className={`transition-colors px-1.5 border ${showCC ? "text-primary border-primary/70 bg-primary/10" : "text-muted-foreground border-muted-foreground/40"}`}
            aria-pressed={showCC}
            title="Toggle captions"
          >
            CC
          </button>
          <div className="flex items-center gap-1.5 flex-1 max-w-[160px]">
            <span className="text-muted-foreground">VOL</span>
            <input
              type="range"
              min={0} max={1} step={0.02}
              value={muted ? 0 : volume}
              onChange={(e) => setVol(parseFloat(e.target.value))}
              className="flex-1 accent-primary h-1"
            />
            <span className="text-primary w-8 text-right">{Math.round((muted ? 0 : volume) * 100)}%</span>
          </div>
          <span className="text-muted-foreground tabular-nums">{fmt(time)} / {fmt(duration)}</span>
          <button onClick={fullscreen} className="text-muted-foreground hover:text-primary transition-colors ml-1">
            ⛶ FS
          </button>
        </div>
        <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
          <span className="text-primary">▸ HOLO-PROJECTOR · SIGNAL LOCKED</span>
          <span>CH.01 · AYUSH.AGNIHOTRI · {showCC ? "CC ON" : "CC OFF"}</span>
        </div>
      </div>
    </motion.div>
  );
}
