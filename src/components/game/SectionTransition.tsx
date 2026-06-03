import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

/**
 * Cinematic per-section reveal: dual scanline wipe + blur-in + halo
 * sweep + corner bracket pop. Wrap each route section to get a uniform
 * game-cutscene transition when entering view.
 */
export function SectionTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, filter: "blur(14px)", scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* top scanline wipe */}
      <motion.div
        aria-hidden
        initial={{ scaleY: 1 }}
        whileInView={{ scaleY: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1, ease: [0.7, 0, 0.2, 1] }}
        style={{ transformOrigin: "top" }}
        className="pointer-events-none absolute inset-0 z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/25 via-accent/10 to-transparent" />
        <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-accent shadow-[0_0_22px_oklch(0.72_0.28_340)]" />
      </motion.div>

      {/* bottom counter wipe */}
      <motion.div
        aria-hidden
        initial={{ scaleY: 1 }}
        whileInView={{ scaleY: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1, ease: [0.7, 0, 0.2, 1], delay: 0.08 }}
        style={{ transformOrigin: "bottom" }}
        className="pointer-events-none absolute inset-0 z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-accent/15 via-primary/8 to-transparent" />
      </motion.div>

      {/* diagonal sheen sweep */}
      <motion.div
        aria-hidden
        initial={{ x: "-120%", opacity: 0 }}
        whileInView={{ x: "120%", opacity: [0, 0.5, 0] }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.3, delay: 0.4, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: "linear-gradient(110deg, transparent 40%, oklch(0.82 0.18 195 / 0.18) 50%, transparent 60%)" }}
      />

      {/* corner brackets */}
      {[
        "top-2 left-2 border-t border-l",
        "top-2 right-2 border-t border-r",
        "bottom-2 left-2 border-b border-l",
        "bottom-2 right-2 border-b border-r",
      ].map((p, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 0.6, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.6 + i * 0.05 }}
          className={`absolute z-10 w-6 h-6 ${p} border-primary/60 pointer-events-none`}
        />
      ))}
      {children}
    </motion.div>
  );
}
