import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Wrap heavy 3D / canvas content so it does NOT mount until the user opts in.
 * Keeps the scroll experience smooth and prevents auto-running WebGL contexts.
 */
export function LaunchGate({
  label = "INITIALIZE MODULE",
  hint = "▸ tap to boot · uses GPU",
  height = 460,
  accent = "var(--hud)",
  children,
}: {
  label?: string;
  hint?: string;
  height?: number;
  accent?: string;
  children: ReactNode;
}) {
  const [live, setLive] = useState(false);
  const [booting, setBooting] = useState(false);

  const start = () => {
    setBooting(true);
    setTimeout(() => { setLive(true); setBooting(false); }, 650);
  };

  return (
    <div className="relative corner-frame box-glow bg-card/60 backdrop-blur-md overflow-hidden"
         style={{ height }}>
      <span className="c-bl" /><span className="c-br" />
      <AnimatePresence mode="wait">
        {!live ? (
          <motion.button
            key="gate"
            onClick={start}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 grid place-items-center group"
          >
            {/* grid backdrop */}
            <div className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `linear-gradient(${accent}11 1px, transparent 1px), linear-gradient(90deg, ${accent}11 1px, transparent 1px)`,
                backgroundSize: "32px 32px",
              }}
            />
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="absolute inset-x-0 top-1/2 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
            />
            <div className="relative z-10 text-center">
              <motion.div
                animate={booting ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.65, ease: "easeInOut" }}
                className="w-16 h-16 mx-auto mb-4 grid place-items-center"
                style={{
                  clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)",
                  background: `linear-gradient(135deg, ${accent}, transparent)`,
                  boxShadow: `0 0 32px ${accent}66`,
                }}
              >
                <div className="w-[58px] h-[58px] grid place-items-center"
                  style={{
                    clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)",
                    background: "oklch(0.10 0.03 260)",
                  }}
                >
                  <span className="font-display font-black text-xl" style={{ color: accent }}>▶</span>
                </div>
              </motion.div>
              <div className="font-display tracking-[0.35em] text-sm" style={{ color: accent, textShadow: `0 0 14px ${accent}` }}>
                {booting ? "BOOTING…" : label}
              </div>
              <div className="font-mono text-[10px] mt-2 text-muted-foreground group-hover:text-foreground/70 transition-colors">
                {hint}
              </div>
            </div>
          </motion.button>
        ) : (
          <motion.div
            key="live"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
