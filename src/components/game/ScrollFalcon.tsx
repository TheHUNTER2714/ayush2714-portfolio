import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Falcon } from "./Falcon";

/**
 * Persistent companion. Hides until the user has scrolled past the hero,
 * fades out near the footer, and tracks cursor with spring easing.
 */
export function ScrollFalcon() {
  const [progress, setProgress] = useState(0);
  const [section, setSection] = useState("");
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setProgress(window.scrollY / max);
      // detect active section id by reading whichever element is closest to viewport center
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

  const xSpring = useSpring(useTransform(mx, [0, 1], [-30, 30]), { stiffness: 50, damping: 16 });
  const ySpring = useSpring(useTransform(my, [0, 1], [-16, 16]), { stiffness: 50, damping: 16 });
  const tilt = useTransform(my, [0, 1], [6, -6]);

  // Hide near hero (so falcon doesn't fight the character logo) and near footer
  const visible = progress > 0.05 && progress < 0.95;
  // Sit roughly mid-viewport, drift down as user scrolls
  const top = 14 + progress * 64;

  return (
    <motion.div
      aria-hidden
      className="fixed right-4 md:right-6 z-30 pointer-events-none hidden md:block"
      style={{ top: `${top}vh`, x: xSpring, y: ySpring, rotate: tilt }}
      animate={{ opacity: visible ? 0.92 : 0, scale: visible ? 1 : 0.7 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ion trail */}
      <div className="absolute right-[78%] top-1/2 -translate-y-1/2 w-32 h-1 rounded-full"
        style={{
          background: "linear-gradient(90deg, transparent, oklch(0.82 0.2 195 / 0.55), oklch(0.72 0.28 330 / 0.85))",
          filter: "blur(2.5px)",
        }}
      />
      <Falcon size={96} intense />
      {/* HUD readout */}
      <div className="absolute -bottom-3 right-0 text-right font-mono leading-tight">
        <div className="text-[9px] tracking-[0.3em] text-primary/85">FALCON.SYNC</div>
        <div className="text-[8px] tracking-widest text-muted-foreground">
          {String(Math.round(progress * 100)).padStart(3, "0")}% · {(section || "STANDBY").toUpperCase().slice(0, 14)}
        </div>
      </div>
    </motion.div>
  );
}
