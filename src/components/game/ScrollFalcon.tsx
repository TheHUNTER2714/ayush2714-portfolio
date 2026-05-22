import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Phoenix } from "./Falcon";
import { gameBus } from "./gameState";

/**
 * Single Phoenix companion — replaces the previous duplicate
 * (ScrollFalcon + FlightFalcon). Tracks scroll, follows cursor with
 * spring easing, and emits a "transmission" shockwave whenever the
 * active hero section changes or an external pulse fires.
 */
export function ScrollFalcon() {
  const [progress, setProgress] = useState(0);
  const [section, setSection] = useState("");
  const [transmit, setTransmit] = useState(0);
  const [msg, setMsg] = useState("STANDBY");
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Scroll + active section detection
  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setProgress(window.scrollY / max);
      const els = Array.from(document.querySelectorAll<HTMLElement>("main > div > [id]"));
      const center = window.innerHeight * 0.45;
      let best = ""; let bestDist = Infinity;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top - center);
        if (d < bestDist) { bestDist = d; best = el.id; }
      }
      setSection(best);
    };
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, [mx, my]);

  // Trigger transmission on section change + sync with gameBus pulses
  useEffect(() => {
    if (!section) return;
    setTransmit((n) => n + 1);
    setMsg(`SYNCING · ${section.toUpperCase()}`);
    const t = setTimeout(() => setMsg(section.toUpperCase()), 1100);
    return () => clearTimeout(t);
  }, [section]);

  useEffect(() => {
    let last = gameBus.get().pulse;
    return gameBus.subscribe((s) => {
      if (s.pulse !== last) {
        last = s.pulse;
        setTransmit((n) => n + 1);
      }
    });
  }, []);

  const xSpring = useSpring(useTransform(mx, [0, 1], [-30, 30]), { stiffness: 50, damping: 16 });
  const ySpring = useSpring(useTransform(my, [0, 1], [-16, 16]), { stiffness: 50, damping: 16 });
  const tilt = useTransform(my, [0, 1], [6, -6]);

  const visible = progress > 0.04 && progress < 0.96;
  const top = 14 + progress * 64;

  return (
    <motion.div
      aria-hidden
      className="fixed right-4 md:right-6 z-30 pointer-events-none hidden md:block"
      style={{ top: `${top}vh`, x: xSpring, y: ySpring, rotate: tilt }}
      animate={{ opacity: visible ? 0.95 : 0, scale: visible ? 1 : 0.7 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* flame trail */}
      <div className="absolute right-[78%] top-1/2 -translate-y-1/2 w-32 h-1.5 rounded-full"
        style={{
          background: "linear-gradient(90deg, transparent, oklch(0.95 0.22 60 / 0.6), oklch(0.6 0.28 18 / 0.95))",
          filter: "blur(2.5px)",
        }}
      />
      <div className="relative">
        <Phoenix size={104} intense />

        {/* transmission shockwaves */}
        <AnimatePresence>
          {transmit > 0 && (
            <motion.span
              key={`s${transmit}`}
              initial={{ scale: 0.4, opacity: 0.9 }}
              animate={{ scale: 2.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              onAnimationComplete={() => setTransmit(0)}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ boxShadow: "0 0 0 2px oklch(0.95 0.22 60 / 0.7), 0 0 48px oklch(0.78 0.28 35 / 0.85)" }}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {transmit > 0 && (
            <motion.div
              key={`b${transmit}`}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, oklch(0.98 0.22 75 / 0.65), transparent 70%)" }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* HUD readout with live progress message */}
      <div className="absolute -bottom-5 right-0 text-right font-mono leading-tight">
        <div className="text-[9px] tracking-[0.3em] text-primary/90">PHOENIX.SYNC</div>
        <div className="text-[8px] tracking-widest text-muted-foreground">
          {String(Math.round(progress * 100)).padStart(3, "0")}% · {msg.slice(0, 18)}
        </div>
        {/* mini progress bar */}
        <div className="mt-1 ml-auto w-24 h-[3px] bg-foreground/10 overflow-hidden">
          <motion.div
            className="h-full"
            style={{
              width: `${progress * 100}%`,
              background: "linear-gradient(90deg, oklch(0.95 0.22 60), oklch(0.6 0.28 18))",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
