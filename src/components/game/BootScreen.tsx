import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const STEPS = [
  "INIT KERNEL.................OK",
  "LOAD GFX_DRIVER.............OK",
  "MOUNT /ayush_agnihotri......OK",
  "DECRYPT IDENTITY............OK",
  "SPAWN PLAYER_AA.............OK",
  "ENTERING ZONE: NEON_GRID....",
];

export function BootScreen({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    if (i < STEPS.length) {
      const t = setTimeout(() => setI((p) => p + 1), 220);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setExit(true), 500);
    const t2 = setTimeout(onDone, 1100);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [i, onDone]);

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-background grid place-items-center"
        >
          <div className="absolute inset-0 grid-floor opacity-20" />
          <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0 2px, oklch(1 0 0 / 0.04) 2px 3px)" }} />

          <div className="relative w-[min(520px,90vw)] corner-frame bg-card/60 backdrop-blur p-6">
            <span className="c-bl" /><span className="c-br" />
            <div className="flex items-center gap-4 mb-4">
              <Logo size={64} label={false} />
              <div>
                <div className="font-display text-primary text-glow text-xl tracking-widest animate-flicker">
                  AGNIHOTRI // OS v.27.11.05
                </div>
                <div className="font-mono text-[10px] text-muted-foreground mt-1">
                  AYUSH AGNIHOTRI · FULL-STACK · KANPUR
                </div>
              </div>
            </div>
            <div className="font-mono text-xs space-y-1">
              {STEPS.slice(0, i).map((s) => (
                <div key={s} className="text-foreground/80">
                  <span className="text-primary">&gt;</span> {s}
                </div>
              ))}
              {i < STEPS.length && (
                <div className="text-foreground/80">
                  <span className="text-primary">&gt;</span> {STEPS[i].slice(0, -3)}<span className="animate-pulse">...</span>
                </div>
              )}
            </div>
            <div className="mt-5 h-1 bg-secondary/60 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                animate={{ width: `${(i / STEPS.length) * 100}%` }}
              />
            </div>
            {i >= STEPS.length && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mt-4 font-display text-center text-accent text-glow-accent animate-pulse"
              >
                ▸ PRESS START
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
