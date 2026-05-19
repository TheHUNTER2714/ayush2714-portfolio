import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Falcon } from "./Falcon";

const STEPS = [
  "INIT KERNEL.................OK",
  "LOAD GFX_DRIVER.............OK",
  "MOUNT /thehunter2714........OK",
  "DECRYPT IDENTITY............OK",
  "DEPLOY FALCON_UNIT..........OK",
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
    const t = setTimeout(() => setExit(true), 700);
    const t2 = setTimeout(onDone, 1400);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [i, onDone]);

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          exit={{ opacity: 0, scale: 1.08, filter: "blur(12px)" }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] bg-background grid place-items-center overflow-hidden"
        >
          <div className="absolute inset-0 grid-floor opacity-25" />
          <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0 2px, oklch(1 0 0 / 0.04) 2px 3px)" }} />

          {/* Falcon flying across the screen */}
          <motion.div
            className="absolute"
            initial={{ x: "-30vw", y: "-10vh", opacity: 0 }}
            animate={{ x: "10vw", y: "0vh", opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ top: "18%", left: "50%" }}
          >
            <Falcon size={160} />
          </motion.div>

          <div className="relative w-[min(560px,92vw)] corner-frame bg-card/60 backdrop-blur p-6 mt-32">
            <span className="c-bl" /><span className="c-br" />

            {/* Outlined brand */}
            <motion.div
              initial={{ opacity: 0, letterSpacing: "0.6em" }}
              animate={{ opacity: 1, letterSpacing: "0.18em" }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="text-center mb-2"
            >
              <div
                className="font-display font-black text-3xl md:text-5xl"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1.5px oklch(0.82 0.18 195)",
                  textShadow: "0 0 24px oklch(0.82 0.18 195 / 0.5)",
                }}
              >
                THEHUNTER2714
              </div>
              <div className="font-mono text-[10px] text-accent tracking-[0.4em] mt-1 animate-flicker">
                FALCON · OS v.27.11.05
              </div>
            </motion.div>

            <div className="font-mono text-xs space-y-1 mt-5">
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
                className="h-full bg-gradient-to-r from-primary via-accent to-[var(--xp)]"
                animate={{ width: `${(i / STEPS.length) * 100}%` }}
              />
            </div>
            {i >= STEPS.length && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mt-4 font-display text-center text-accent text-glow-accent animate-pulse"
              >
                ▸ PRESS START · FALCON DEPLOYED
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
