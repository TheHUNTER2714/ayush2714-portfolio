import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Floating game-style popup notification inviting visitors to play the
 * Space Invaders mini-game (where they can learn more about Ayush).
 * Auto-shows after a short delay, dismissible. Re-appears once if scrolled
 * past without entering arcade.
 */
export function PlayInvite({ onJump, active }: { onJump: () => void; active: string }) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    if (active === "arcade") { setShow(false); return; }
    const t = setTimeout(() => setShow(true), 4200);
    return () => clearTimeout(t);
  }, [dismissed, active]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 360, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 360, opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          className="fixed bottom-6 right-6 z-50 max-w-[320px]"
        >
          <div className="corner-frame box-glow bg-card/95 backdrop-blur-md p-4 relative">
            <span className="c-bl" /><span className="c-br" />
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ rotate: [0, -8, 8, -6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2 }}
                className="text-2xl"
              >👾</motion.div>
              <div className="flex-1">
                <div className="font-mono text-[10px] text-accent tracking-widest animate-flicker">▸ NEW QUEST AVAILABLE</div>
                <div className="font-display text-sm text-glow mt-1">PLAY TO KNOW ME</div>
                <p className="font-mono text-[11px] text-foreground/75 leading-relaxed mt-1">
                  Shoot invaders to decrypt my bio — each kill drops a fact pulled from my README.
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => { onJump(); setShow(false); setDismissed(true); }}
                    className="corner-frame px-3 py-1.5 bg-primary/15 border border-primary text-primary font-display text-[11px] tracking-widest hover:bg-primary/25 transition-colors"
                  >
                    <span className="c-bl" /><span className="c-br" />
                    ▸ ENTER ARCADE
                  </button>
                  <button
                    onClick={() => { setShow(false); setDismissed(true); }}
                    className="px-3 py-1.5 font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
