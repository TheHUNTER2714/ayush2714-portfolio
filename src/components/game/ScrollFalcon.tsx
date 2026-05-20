import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Falcon } from "./Falcon";

/**
 * Persistent falcon companion: tracks scroll progress on the Y axis and
 * cursor on the X axis with springy easing, leaving an ion trail.
 */
export function ScrollFalcon() {
  const [progress, setProgress] = useState(0);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setProgress(window.scrollY / max);
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

  // Falcon hovers near right edge, drifts down with scroll and toward cursor
  const xSpring = useSpring(useTransform(mx, [0, 1], [-40, 40]), { stiffness: 60, damping: 14 });
  const ySpring = useSpring(useTransform(my, [0, 1], [-20, 20]), { stiffness: 60, damping: 14 });

  // vertical position along viewport mapped from scroll progress
  const top = 8 + progress * 78; // % of viewport
  const tilt = useTransform(my, [0, 1], [8, -8]);

  return (
    <motion.div
      aria-hidden
      className="fixed right-4 md:right-8 z-30 pointer-events-none hidden md:block"
      style={{
        top: `${top}vh`,
        x: xSpring,
        y: ySpring,
        rotate: tilt,
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 0.9, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.4 }}
    >
      {/* ion trail */}
      <div className="absolute right-[80%] top-1/2 -translate-y-1/2 w-40 h-1.5 rounded-full"
        style={{
          background: "linear-gradient(90deg, transparent, oklch(0.82 0.2 195 / 0.6), oklch(0.72 0.28 330 / 0.8))",
          filter: "blur(3px)",
        }}
      />
      <Falcon size={120} intense />
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-widest text-primary/80 whitespace-nowrap">
        FALCON · TRACKING {Math.round(progress * 100)}%
      </div>
    </motion.div>
  );
}
