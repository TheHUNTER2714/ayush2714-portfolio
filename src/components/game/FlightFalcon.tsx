import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Falcon } from "./Falcon";

/**
 * Cinematic falcon flight: launches from the THEHUNTER2714 logo above the
 * name on the character section, glides along the scroll, and lands on the
 * FALCON AI co-pilot section. Uses anchor element rects so it always lines
 * up with the real DOM positions.
 */
export function FlightFalcon() {
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const [target, setTarget] = useState<{ x: number; y: number } | null>(null);
  const [aiTop, setAiTop] = useState(0);
  const [charTop, setCharTop] = useState(0);

  const measure = () => {
    const charLogo = document.querySelector('#character [data-falcon-origin]');
    const aiLogo = document.querySelector('#ai [data-falcon-target]');
    if (charLogo) {
      const r = charLogo.getBoundingClientRect();
      setOrigin({ x: r.left + r.width / 2 + window.scrollX, y: r.top + r.height / 2 + window.scrollY });
      setCharTop(r.top + window.scrollY);
    }
    if (aiLogo) {
      const r = aiLogo.getBoundingClientRect();
      setTarget({ x: r.left + r.width / 2 + window.scrollX, y: r.top + r.height / 2 + window.scrollY });
      setAiTop(r.top + window.scrollY);
    }
  };

  useEffect(() => {
    measure();
    const t = setTimeout(measure, 600);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, []);

  const progress = useMotionValue(0);
  useEffect(() => {
    const onScroll = () => {
      if (!charTop || !aiTop) return;
      const start = charTop - window.innerHeight * 0.4;
      const end = aiTop - window.innerHeight * 0.4;
      const p = Math.min(1, Math.max(0, (window.scrollY - start) / Math.max(1, end - start)));
      progress.set(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [charTop, aiTop, progress]);

  // Compute curved bezier between origin/target
  const x = useTransform(progress, (p) => {
    if (!origin || !target) return -9999;
    const cx = (origin.x + target.x) / 2 + Math.sin(p * Math.PI) * 80;
    // quadratic bezier
    const mt = 1 - p;
    return mt * mt * origin.x + 2 * mt * p * cx + p * p * target.x;
  });
  const y = useTransform(progress, (p) => {
    if (!origin || !target) return -9999;
    const cy = (origin.y + target.y) / 2 - 160; // arc upward
    const mt = 1 - p;
    return mt * mt * origin.y + 2 * mt * p * cy + p * p * target.y;
  });
  const rotate = useTransform(progress, [0, 0.5, 1], [-12, 0, 12]);
  const scale = useTransform(progress, [0, 0.5, 1], [0.6, 1.05, 0.55]);
  const opacity = useTransform(progress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  const xs = useSpring(x, { stiffness: 70, damping: 18, mass: 0.6 });
  const ys = useSpring(y, { stiffness: 70, damping: 18, mass: 0.6 });

  if (!origin || !target) return null;

  return (
    <motion.div
      aria-hidden
      className="absolute z-30 pointer-events-none hidden md:block"
      style={{
        top: 0, left: 0,
        x: xs, y: ys, rotate, scale, opacity,
        translateX: "-50%", translateY: "-50%",
      }}
    >
      <div className="relative">
        <div className="absolute right-[70%] top-1/2 -translate-y-1/2 w-44 h-1.5 rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, oklch(0.82 0.2 195 / 0.7), oklch(0.72 0.28 330 / 0.95))",
            filter: "blur(3px)",
          }}
        />
        <Falcon size={130} intense />
      </div>
    </motion.div>
  );
}
