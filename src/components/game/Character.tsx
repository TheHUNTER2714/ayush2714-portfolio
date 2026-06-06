import { motion, AnimatePresence, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { IntroVideo } from "./IntroVideo";


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

export function Character({ booted = true }: { booted?: boolean } = {}) {
  const lines = useTyping(BIO_LINES);
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <section className="min-h-screen px-6 md:px-16 pt-32 pb-32 relative">
      <div className="max-w-7xl mx-auto">
        {/* TOP: Enlarged cinematic intro video — auto-plays once after door split */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <IntroVideo autoStart={booted} />
        </motion.div>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
        {/* LEFT */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.7 }} whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }} transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="mb-4"
            data-falcon-origin
          >
            <Logo size={130} label={false} intense />
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
            className="font-display font-black text-5xl md:text-7xl lg:text-8xl leading-[0.9] relative"
          >
            <NameGlyph text="AYUSH" stroke="oklch(0.82 0.18 195)" />
            <NameGlyph text="AGNIHOTRI" stroke="oklch(0.72 0.28 340)" delay={0.15} />
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
          <StatMatrix />
        </motion.div>

      </div>
      </div>
    </section>
  );
}

function NameGlyph({ text, stroke, delay = 0 }: { text: string; stroke: string; delay?: number }) {
  // Persist final state: render a solid-fill copy underneath the stroked motion
  // copy so the name stays unambiguously visible after the reveal finishes.
  return (
    <span className="block relative">
      {/* solid-fill anchor — always visible, fades in as slide settles */}
      <motion.span
        className="block"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: delay + 0.55, ease: "easeOut" }}
        style={{
          color: stroke,
          textShadow: `0 0 24px ${stroke}55, 0 0 2px ${stroke}`,
        }}
      >
        {text}
      </motion.span>

      {/* stroked overlay slides up from below */}
      <span className="absolute inset-0 block overflow-hidden">
        <motion.span
          className="block"
          initial={{ y: "110%" }}
          whileInView={{ y: "0%" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
          style={{
            color: "transparent",
            WebkitTextStroke: `2px ${stroke}`,
            textShadow: `0 0 28px ${stroke}66`,
          }}
        >
          {text}
        </motion.span>
      </span>

      {/* glitch shimmer (one-shot) */}
      <motion.span
        aria-hidden
        className="absolute inset-0 block pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 0.7, 0], x: [0, 4, -3, 0] }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: delay + 0.4 }}
        style={{ color: stroke, mixBlendMode: "screen" }}
      >
        {text}
      </motion.span>

      {/* underline sweep */}
      <motion.span
        aria-hidden
        className="absolute left-0 -bottom-0.5 h-[3px] pointer-events-none"
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1, delay: delay + 0.5, ease: "easeOut" }}
        style={{
          background: `linear-gradient(90deg, transparent, ${stroke}, transparent)`,
          boxShadow: `0 0 12px ${stroke}`,
        }}
      />
    </span>
  );
}


const STATS = [
  { label: "PYTHON", value: 90, color: "var(--hud)" },
  { label: "HTML / CSS", value: 92, color: "var(--accent)" },
  { label: "JAVASCRIPT", value: 85, color: "var(--xp)" },
  { label: "C", value: 80, color: "var(--mp)" },
  { label: "NODE.JS", value: 78, color: "var(--hp)" },
];

function CountUp({ to, duration = 1.4, delay = 0 }: { to: number; duration?: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, {
      duration, delay, ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => { node.textContent = Math.round(v).toString(); },
    });
    return () => controls.stop();
  }, [inView, to, duration, delay]);
  return <span ref={ref}>0</span>;
}

function StatBar({ s, i }: { s: typeof STATS[number]; i: number }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      className="relative group cursor-default"
    >
      <div className="flex justify-between font-mono text-xs mb-1.5">
        <span className="text-foreground/80 tracking-wider group-hover:text-primary transition-colors">
          {s.label}
        </span>
        <span style={{ color: s.color, textShadow: `0 0 8px ${s.color}` }}>
          <CountUp to={s.value} delay={0.25 + i * 0.08} />
          <span className="opacity-60">%</span>
        </span>
      </div>
      <div className="h-2.5 bg-secondary/60 relative overflow-hidden rounded-sm">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent 0 9px, oklch(1 0 0 / 0.1) 9px 10px)" }} />
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${s.value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.25 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="h-full relative"
          style={{ background: `linear-gradient(90deg, ${s.color}, ${s.color}66)` }}
        >
          <motion.span
            className="absolute inset-y-0 w-12"
            style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`, mixBlendMode: "screen" }}
            animate={{ x: ["-50%", "320%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear", delay: 1 + i * 0.15 }}
          />
          <motion.span
            className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
            style={{ background: s.color, boxShadow: `0 0 10px ${s.color}` }}
            animate={{ scale: hover ? [1, 1.6, 1] : [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        </motion.div>
        <AnimatePresence>
          {hover && (
            <motion.span
              className="absolute inset-0 pointer-events-none rounded-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.6, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{ boxShadow: `inset 0 0 14px ${s.color}` }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function StatMatrix() {
  return (
    <div className="corner-frame box-glow bg-card backdrop-blur-md p-6 relative overflow-hidden">
      <span className="c-bl" /><span className="c-br" />

      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.82 0.18 195 / 0.07) 1px, transparent 1px), linear-gradient(90deg, oklch(0.82 0.18 195 / 0.07) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <motion.div
        className="absolute -inset-32 pointer-events-none"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, oklch(0.82 0.18 195 / 0.18) 30deg, transparent 60deg)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 14, ease: "linear", repeat: Infinity }}
      />
      <div className="absolute inset-x-0 h-12 bg-gradient-to-b from-primary/10 to-transparent animate-scan pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <motion.span
              className="inline-block w-2 h-2 rounded-full bg-[var(--xp)]"
              animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.35, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ boxShadow: "0 0 10px var(--xp)" }}
            />
            <h3 className="font-display text-sm tracking-widest text-primary text-glow">STAT MATRIX</h3>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1.5">
            <span className="opacity-60">SYNC</span>
            <CountUp to={98} duration={1.6} delay={0.4} />
            <span className="opacity-60">%</span>
          </span>
        </div>

        <div className="mb-5 flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
              <defs>
                <linearGradient id="sm-grad" x1="0" x2="1">
                  <stop offset="0" stopColor="oklch(0.82 0.18 195)" />
                  <stop offset="1" stopColor="oklch(0.78 0.22 340)" />
                </linearGradient>
              </defs>
              <circle cx="32" cy="32" r="26" fill="none" stroke="oklch(1 0 0 / 0.08)" strokeWidth="4" />
              <motion.circle
                cx="32" cy="32" r="26" fill="none" stroke="url(#sm-grad)" strokeWidth="4"
                strokeLinecap="round" pathLength={1}
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 0.87 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center font-display text-sm text-primary text-glow">
              <CountUp to={87} duration={1.6} delay={0.2} />
            </div>
          </div>
          <div className="flex-1">
            <div className="font-mono text-[10px] text-muted-foreground tracking-widest mb-1">OVERALL POWER</div>
            <div className="font-display text-lg text-foreground">PHOENIX · TIER&nbsp;
              <span className="text-primary text-glow">S</span>
            </div>
          </div>
        </div>

        <div className="space-y-3.5">
          {STATS.map((s, i) => <StatBar key={s.label} s={s} i={i} />)}
        </div>

        <div className="mt-6 pt-5 border-t border-border/60 grid grid-cols-3 gap-3 text-center">
          {[{l:"HP",v:100,c:"var(--hp)"},{l:"MP",v:92,c:"var(--mp)"},{l:"STA",v:96,c:"var(--xp)"}].map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              whileHover={{ y: -3 }}
              className="relative group"
            >
              <div className="font-display text-2xl font-bold" style={{ color: s.c, textShadow: `0 0 14px ${s.c}` }}>
                <CountUp to={s.v} delay={0.6 + i * 0.1} />
              </div>
              <div className="font-mono text-[10px] text-muted-foreground mt-1 tracking-widest">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
