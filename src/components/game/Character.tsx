import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Falcon } from "./Falcon";
import { ItachiHolo } from "./ItachiHolo";

const BIO_LINES = [
  "> booting AYUSH.AGNIHOTRI ...",
  "> role: FULL-STACK DEV // AI ENTHUSIAST",
  "> base: KANPUR, IN  ·  REC PRATAPGARH (B.Tech CSE)",
  "> creds: GOOGLE ARCADE FACILITATOR · AKTU HACKATHON WINNER",
  "> mission: ship arcade-grade web experiences.",
];

function useTyping(lines: string[], speed = 22, lineDelay = 380) {
  const [out, setOut] = useState<string[]>([""]);
  useEffect(() => {
    let li = 0, ci = 0;
    const arr: string[] = [""];
    const id = setInterval(() => {
      if (li >= lines.length) { clearInterval(id); return; }
      const line = lines[li];
      if (ci < line.length) {
        arr[li] = line.slice(0, ci + 1);
        setOut([...arr]);
        ci++;
      } else {
        li++; ci = 0;
        arr.push("");
        setTimeout(() => setOut([...arr]), lineDelay);
      }
    }, speed);
    return () => clearInterval(id);
  }, []);
  return out;
}

type Lang = { name: string; color: string; sym: string };
const LANGS: Lang[] = [
  { name: "Python",     color: "var(--mp)",     sym: "Py" },
  { name: "JavaScript", color: "var(--xp)",     sym: "JS" },
  { name: "Node.js",    color: "var(--hp)",     sym: "⬢" },
  { name: "C",          color: "var(--hud)",    sym: "C" },
  { name: "Java",       color: "var(--legendary)", sym: "Jv" },
  { name: "HTML/CSS",   color: "var(--accent)", sym: "</>" },
];

export function Character() {
  const lines = useTyping(BIO_LINES);
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <section className="min-h-screen flex items-center px-6 md:px-16 pt-32 pb-32 relative">
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 w-full max-w-6xl mx-auto items-center">
        {/* LEFT */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="mb-4"
            data-falcon-origin
          >
            <Falcon size={120} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="font-mono text-xs text-primary mb-3"
          >
            ▸ THEHUNTER2714 // PROFILE.exe
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="font-display font-black text-5xl md:text-7xl lg:text-8xl leading-[0.9]"
          >
            <span
              className="block"
              style={{
                color: "transparent",
                WebkitTextStroke: "2px oklch(0.82 0.18 195)",
                textShadow: "0 0 24px oklch(0.82 0.18 195 / 0.4)",
              }}
            >
              AYUSH
            </span>
            <span
              className="block"
              style={{
                color: "transparent",
                WebkitTextStroke: "2px oklch(0.72 0.28 340)",
                textShadow: "0 0 24px oklch(0.72 0.28 340 / 0.45)",
              }}
            >
              AGNIHOTRI
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="mt-4 inline-flex items-center gap-2 corner-frame bg-card backdrop-blur px-4 py-2"
          >
            <span className="c-bl" /><span className="c-br" />
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-xs">FULL-STACK · AI · KANPUR, IN · DOB 27.11.05</span>
          </motion.div>

          {/* Typing terminal */}
          <div className="mt-6 corner-frame bg-card/70 backdrop-blur p-4 max-w-xl font-mono text-[13px] leading-relaxed text-foreground/85 min-h-[160px]">
            <span className="c-bl" /><span className="c-br" />
            {lines.map((l, idx) => (
              <div key={idx}>
                {l}
                {idx === lines.length - 1 && <span className="inline-block w-2 h-4 ml-0.5 align-middle bg-primary animate-pulse" />}
              </div>
            ))}
          </div>

          {/* Resume + language picker */}
          <div className="mt-6 flex flex-wrap gap-3 items-center">
            <motion.a
              href="/Ayush_Agnihotri_Resume.pdf"
              download
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="corner-frame bg-primary/15 hover:bg-primary/25 transition-colors px-5 py-2.5 font-display text-xs tracking-widest text-primary text-glow"
            >
              <span className="c-bl" /><span className="c-br" />
              ▾ DOWNLOAD RESUME.pdf
            </motion.a>
            <a
              href="https://github.com/thehunter2714"
              target="_blank" rel="noreferrer"
              className="corner-frame bg-card hover:bg-accent/10 transition-colors px-5 py-2.5 font-display text-xs tracking-widest text-accent"
            >
              <span className="c-bl" /><span className="c-br" />
              ⌬ GITHUB
            </a>
          </div>

          <div className="mt-8">
            <div className="font-mono text-[10px] text-muted-foreground mb-2 tracking-widest">▸ EQUIPPED LANGUAGES — TAP TO INSPECT</div>
            <div className="flex flex-wrap gap-3">
              {LANGS.map((l) => {
                const active = picked === l.name;
                return (
                  <motion.button
                    key={l.name}
                    onClick={() => setPicked(active ? null : l.name)}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.9, rotate: -8 }}
                    className="relative"
                  >
                    <motion.div
                      animate={active ? {
                        rotate: [0, 360],
                        scale: [1, 1.15, 1],
                        boxShadow: [`0 0 0 ${l.color}`, `0 0 28px ${l.color}`, `0 0 14px ${l.color}`],
                      } : {}}
                      transition={{ duration: 0.9 }}
                      className="w-14 h-14 grid place-items-center font-display font-bold text-sm"
                      style={{
                        clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)",
                        background: `linear-gradient(135deg, ${l.color}, oklch(0.15 0.04 260))`,
                        color: "white",
                      }}
                    >
                      <div className="absolute inset-[3px]"
                        style={{
                          clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)",
                          background: "oklch(0.13 0.03 260)",
                        }}
                      />
                      <span className="relative" style={{ color: l.color }}>{l.sym}</span>
                    </motion.div>
                    {active && (
                      <motion.span
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2.6, opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 rounded-full border-2 pointer-events-none"
                        style={{ borderColor: l.color }}
                      />
                    )}
                    <div className="text-center font-mono text-[10px] mt-1" style={{ color: active ? l.color : "var(--muted-foreground)" }}>
                      {l.name}
                    </div>
                  </motion.button>
                );
              })}
            </div>
            <AnimatePresence>
              {picked && (
                <motion.div
                  key={picked}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mt-3 font-mono text-[11px] text-primary"
                >
                  ▸ {picked} module loaded. Mastery confirmed.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: Stat panel (kept) */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="space-y-5"
        >
          <ItachiHolo />
          <div className="corner-frame box-glow bg-card backdrop-blur-md p-6 relative overflow-hidden">
            <span className="c-bl" /><span className="c-br" />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-x-0 h-12 bg-gradient-to-b from-primary/10 to-transparent animate-scan" />
            </div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-sm tracking-widest text-primary text-glow">STAT MATRIX</h3>
            <span className="font-mono text-[10px] text-muted-foreground">FALCON · ONLINE</span>
          </div>
          <div className="space-y-4">
            {[
              { label: "PYTHON", value: 90, color: "var(--hud)" },
              { label: "HTML / CSS", value: 92, color: "var(--accent)" },
              { label: "JAVASCRIPT", value: 85, color: "var(--xp)" },
              { label: "C", value: 80, color: "var(--mp)" },
              { label: "NODE.JS", value: 78, color: "var(--hp)" },
            ].map((s, i) => (
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
                    className="h-full"
                    style={{ background: `linear-gradient(90deg, ${s.color}, ${s.color}66)` }}
                  />
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
