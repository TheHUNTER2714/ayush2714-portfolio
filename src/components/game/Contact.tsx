import { motion } from "framer-motion";

const LINKS = [
  { label: "EMAIL", value: "alex@kairos.dev", href: "mailto:alex@kairos.dev", k: "[E]" },
  { label: "GITHUB", value: "github.com/alexkairos", href: "https://github.com", k: "[G]" },
  { label: "TWITTER", value: "@alexkairos", href: "https://twitter.com", k: "[T]" },
  { label: "LINKEDIN", value: "in/alexkairos", href: "https://linkedin.com", k: "[L]" },
];

export function Contact() {
  return (
    <section className="min-h-screen px-6 md:px-16 pt-32 pb-32 flex items-center">
      <div className="max-w-3xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <div className="font-mono text-xs text-primary mb-2 animate-flicker">▸ SAVE POINT REACHED</div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-glow">TRANSMIT <span className="text-accent text-glow-accent">SIGNAL</span></h2>
          <p className="mt-4 text-foreground/75 max-w-md mx-auto">
            Open to legendary side-quests, collabs, and full-time raids. Drop a transmission.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="corner-frame box-glow bg-card backdrop-blur-md p-6 md:p-8 relative overflow-hidden"
        >
          <span className="c-bl" /><span className="c-br" />
          <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-primary/15 to-transparent animate-scan pointer-events-none" />

          <div className="font-mono text-xs text-primary mb-4">
            &gt; CHANNEL: <span className="text-accent">SECURE</span> // LATENCY: 12ms
          </div>

          <div className="space-y-3">
            {LINKS.map((l, i) => (
              <motion.a
                key={l.label} href={l.href} target="_blank" rel="noreferrer"
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.08 }}
                whileHover={{ x: 6 }}
                className="group flex items-center gap-4 p-3 border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <span className="font-mono text-xs text-accent w-8">{l.k}</span>
                <span className="font-display text-sm tracking-widest text-primary w-24">{l.label}</span>
                <span className="font-mono text-sm text-foreground/80 flex-1 truncate">{l.value}</span>
                <span className="font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors">▸ EXEC</span>
              </motion.a>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border flex items-center justify-between font-mono text-[10px] text-muted-foreground">
            <span>END OF TRANSMISSION</span>
            <span>© {new Date().getFullYear()} A.KAIROS · PRESS START TO CONTINUE</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
