import { motion } from "framer-motion";
import { Logo } from "./Logo";

export function Character() {
  const stats = [
    { label: "PYTHON", value: 90, color: "var(--hud)" },
    { label: "HTML / CSS", value: 92, color: "var(--accent)" },
    { label: "JAVASCRIPT", value: 85, color: "var(--xp)" },
    { label: "C", value: 80, color: "var(--mp)" },
    { label: "NODE.JS", value: 78, color: "var(--hp)" },
  ];

  return (
    <section className="min-h-screen flex items-center px-6 md:px-16 pt-32 pb-32 relative">
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 w-full max-w-6xl mx-auto items-center">
        {/* LEFT: Identity */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="mb-6"
          >
            <Logo size={84} label={false} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="font-mono text-xs text-primary mb-4"
          >
            ▸ CHARACTER_PROFILE.exe — LOADED
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="font-display font-black text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-glow"
          >
            AYUSH
            <br />
            <span className="text-accent text-glow-accent">AGNIHOTRI</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="mt-4 inline-flex items-center gap-2 corner-frame bg-card backdrop-blur px-4 py-2"
          >
            <span className="c-bl" /><span className="c-br" />
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-xs">FULL-STACK DEV · AI ENTHUSIAST · KANPUR, IN</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.5 }}
            className="mt-6 max-w-xl text-foreground/80 leading-relaxed"
          >
            B.Tech CSE @ REC Pratapgarh. Google Arcade Facilitator. Hackathon
            winner. I ship full-stack products, AI experiments, and arcade-style
            web experiences — including the Space Invaders below, which inspired
            this whole playable portfolio.
          </motion.p>

          <div className="mt-8 flex flex-wrap gap-3">
            {["Python", "JavaScript", "Node.js", "AI / NLP", "Three.js"].map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.6 + i * 0.06 }}
                className="font-mono text-[11px] px-3 py-1.5 border border-primary/40 text-primary bg-primary/5"
              >
                {t}
              </motion.span>
            ))}
          </div>
        </div>

        {/* RIGHT: Stat panel */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="corner-frame box-glow bg-card backdrop-blur-md p-6 relative overflow-hidden"
        >
          <span className="c-bl" /><span className="c-br" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-x-0 h-12 bg-gradient-to-b from-primary/10 to-transparent animate-scan" />
          </div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-sm tracking-widest text-primary text-glow">STAT MATRIX</h3>
            <span className="font-mono text-[10px] text-muted-foreground">DOB 27.11.05</span>
          </div>

          <div className="space-y-4">
            {stats.map((s, i) => (
              <div key={s.label}>
                <div className="flex justify-between font-mono text-xs mb-1.5">
                  <span className="text-foreground/80">{s.label}</span>
                  <span style={{ color: s.color }}>{s.value}</span>
                </div>
                <div className="h-2 bg-secondary/60 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} whileInView={{ width: `${s.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                    className="h-full relative"
                    style={{ background: `linear-gradient(90deg, ${s.color}, ${s.color}66)` }}
                  >
                    <div className="absolute inset-y-0 right-0 w-px bg-white/80" />
                  </motion.div>
                  <div className="absolute inset-0 grid grid-cols-10 pointer-events-none">
                    {Array.from({ length: 10 }).map((_, k) => (
                      <div key={k} className="border-r border-background/60 last:border-r-0" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border grid grid-cols-3 gap-3 text-center">
            {[{l:"HP",v:"100",c:"var(--hp)"},{l:"MP",v:"92",c:"var(--mp)"},{l:"STA",v:"96",c:"var(--xp)"}].map((s) => (
              <div key={s.l}>
                <div className="font-display text-2xl font-bold" style={{ color: s.c, textShadow: `0 0 12px ${s.c}` }}>{s.v}</div>
                <div className="font-mono text-[10px] text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
