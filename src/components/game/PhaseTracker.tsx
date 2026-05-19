import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type Item = { label: string; done: boolean };
type Phase = { id: string; title: string; items: Item[] };

const PHASES: Phase[] = [
  {
    id: "p1",
    title: "PHASE 1 · CORE",
    items: [
      { label: "Cinematic intro", done: true },
      { label: "Landing page", done: true },
      { label: "Skill tree", done: true },
      { label: "Project section", done: true },
      { label: "Resume download", done: true },
    ],
  },
  {
    id: "p2",
    title: "PHASE 2 · LIVE OPS",
    items: [
      { label: "Terminal", done: true },
      { label: "Achievements", done: true },
      { label: "Live GitHub stats", done: true },
    ],
  },
  {
    id: "p3",
    title: "PHASE 3 · ASCEND",
    items: [
      { label: "AI assistant", done: true },
      { label: "3D world", done: true },
      { label: "Mini games", done: true },
    ],
  },
];

export function PhaseTracker() {
  const [open, setOpen] = useState(true);
  const all = PHASES.flatMap((p) => p.items);
  const pct = Math.round((all.filter((i) => i.done).length / all.length) * 100);

  return (
    <div className="fixed left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 pointer-events-auto hidden md:block">
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        className="mb-2 corner-frame bg-card backdrop-blur px-2 py-1 font-mono text-[10px] text-primary text-glow tracking-widest"
      >
        <span className="c-bl" /><span className="c-br" />
        ▸ FLOW {pct}%
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 230 }}
            exit={{ opacity: 0, x: -20, width: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="corner-frame box-glow bg-card backdrop-blur-md p-3 overflow-hidden"
          >
            <span className="c-bl" /><span className="c-br" />

            <div className="font-display text-[10px] tracking-widest text-primary text-glow mb-2">
              ⌬ ROADMAP / LIVE TRACK
            </div>
            <div className="h-1 bg-secondary/60 mb-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-accent to-[var(--xp)]"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>

            <ul className="space-y-3">
              {PHASES.map((p, pi) => (
                <li key={p.id}>
                  <div className="font-mono text-[9px] tracking-widest text-accent mb-1">{p.title}</div>
                  <ul className="space-y-1">
                    {p.items.map((it, i) => (
                      <motion.li
                        key={it.label}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: pi * 0.1 + i * 0.04 }}
                        className="flex items-center gap-2 font-mono text-[10px]"
                      >
                        <span
                          className={`inline-block w-3 h-3 grid place-items-center text-[8px] ${
                            it.done
                              ? "bg-primary/20 text-primary border border-primary"
                              : "border border-muted-foreground/40 text-muted-foreground"
                          }`}
                          style={{ clipPath: "polygon(20% 0,100% 0,80% 100%,0 100%)" }}
                        >
                          {it.done ? "✓" : "·"}
                        </span>
                        <span className={it.done ? "text-foreground/90" : "text-muted-foreground line-through decoration-muted-foreground/30"}>
                          {it.label}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
