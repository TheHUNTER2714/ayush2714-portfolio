import { motion } from "framer-motion";
import { useState } from "react";

const LINKS = [
  { label: "EMAIL",    value: "ayushagnihotri165@gmail.com",                                href: "mailto:ayushagnihotri165@gmail.com",                  k: "[E]" },
  { label: "PHONE",    value: "+91 8429090075",                                             href: "tel:+918429090075",                                   k: "[P]" },
  { label: "GITHUB",   value: "github.com/TheHUNTER2714",                                   href: "https://github.com/TheHUNTER2714",                    k: "[G]" },
  { label: "LINKEDIN", value: "in/ayush-agnihotri-448254298",                               href: "https://www.linkedin.com/in/ayush-agnihotri-448254298/", k: "[L]" },
];

export function Contact() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true); setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("https://formspree.io/f/xzddypyl", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });
      if (!res.ok) throw new Error("Transmission failed");
      setSent(true);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="min-h-screen px-6 md:px-16 pt-32 pb-32 flex items-center">
      <div className="max-w-3xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <div className="font-mono text-xs text-primary mb-2 animate-flicker">▸ SAVE POINT REACHED</div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-glow">TRANSMIT <span className="text-accent text-glow-accent">SIGNAL</span></h2>
          <p className="mt-4 text-foreground/75 max-w-md mx-auto">
            Open to internships, collabs, freelance raids. Drop a transmission — direct line below.
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
            &gt; CHANNEL: <span className="text-accent">SECURE</span> // BASE: KANPUR, IN
          </div>

          <div className="space-y-3 mb-6">
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

          {/* Formspree-backed transmission form */}
          <form onSubmit={onSubmit} className="space-y-3 pt-6 border-t border-border">
            <div className="font-mono text-xs text-accent">▸ COMPOSE TRANSMISSION</div>
            <div className="grid sm:grid-cols-2 gap-3">
              <input required name="name" placeholder="CALLSIGN / NAME"
                className="bg-background/60 border border-border focus:border-primary outline-none px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground" />
              <input required type="email" name="email" placeholder="RETURN FREQUENCY (EMAIL)"
                className="bg-background/60 border border-border focus:border-primary outline-none px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground" />
            </div>
            <textarea required name="message" rows={4} placeholder="MESSAGE PAYLOAD..."
              className="w-full bg-background/60 border border-border focus:border-primary outline-none px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground resize-none" />
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="font-mono text-[10px] text-muted-foreground">
                {sent ? <span className="text-primary">✓ TRANSMISSION RECEIVED</span> : error ? <span className="text-[var(--hp)]">! {error}</span> : "SIGNAL ENCRYPTED · FORMSPREE"}
              </span>
              <button
                type="submit" disabled={sending || sent}
                className="corner-frame px-5 py-2 bg-accent/10 border border-accent text-accent font-display tracking-widest text-xs hover:bg-accent/20 transition-colors disabled:opacity-50"
              >
                <span className="c-bl" /><span className="c-br" />
                {sending ? "▸ SENDING..." : sent ? "▸ SENT" : "▸ FIRE TRANSMISSION"}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-border flex items-center justify-between font-mono text-[10px] text-muted-foreground">
            <span>END OF TRANSMISSION</span>
            <span>© {new Date().getFullYear()} A.AGNIHOTRI · PRESS START TO CONTINUE</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
