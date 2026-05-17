import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

/**
 * Cinematic per-section reveal: scanline wipe + blur-in. Wrap each route
 * section to get a uniform game-cutscene transition when entering view.
 */
export function SectionTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* scanline sweep */}
      <motion.div
        aria-hidden
        initial={{ scaleY: 1 }}
        whileInView={{ scaleY: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1, ease: [0.7, 0, 0.2, 1] }}
        style={{ transformOrigin: "top" }}
        className="pointer-events-none absolute inset-0 z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-accent/10 to-transparent" />
        <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-accent shadow-[0_0_18px_oklch(0.72_0.28_340)]" />
      </motion.div>
      {children}
    </motion.div>
  );
}
