import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Line = { kind: "in" | "out" | "err"; text: string };

const COMMANDS: Record<string, () => string> = {
  help: () => [
    "available commands:",
    "  whoami      — bio",
    "  skills      — tech stack",
    "  projects    — shipped quests",
    "  contact     — comms channel",
    "  resume      — download CV",
    "  github      — github profile",
    "  socials     — all links",
    "  hack        — ???",
    "  clear       — wipe terminal",
  ].join("\n"),
  whoami: () => "ayush.agnihotri @ thehunter2714\nfull-stack dev · ai enthusiast · kanpur, in\nb.tech cse @ rec pratapgarh (2023-2027) · dob 27.11.05",
  skills: () => "python · javascript · node.js · c · java · ruby\nhtml/css · ai/nlp · cyber sec · networking · ms-office",
  projects: () => [
    "[Q-001] StudyCare AI chatbot       https://studycarechatbot.netlify.app/",
    "[Q-002] ChatCord realtime          https://chatcord-9slp.onrender.com",
    "[Q-003] Space Invaders Arcade      https://thehunter2714.github.io/space_invaders_arcade/",
    "[Q-004] Resume Skill Extractor     https://rajeshth.netlify.app/",
    "[Q-005] Student DB System          https://thehunter2714.github.io/STDM/",
    "[Q-006] Resume Builder             https://thehunter2714.github.io/resume/",
  ].join("\n"),
  contact: () => "email   ayushagnihotri165@gmail.com\nphone   +91 8429090075\nbase    256 b block panki, kanpur 208020",
  resume: () => { if (typeof window !== "undefined") window.open("/Ayush_Agnihotri_Resume.pdf", "_blank"); return "▾ downloading resume.pdf ..."; },
  github: () => { if (typeof window !== "undefined") window.open("https://github.com/thehunter2714", "_blank"); return "→ launching github.com/thehunter2714"; },
  socials: () => "github   github.com/thehunter2714\nlinkedin linkedin.com/in/ayush-agnihotri\nportfolio thehunter2714.github.io",
  hack: () => "ACCESS GRANTED — root@falcon:~# ⚡ you found the easter egg. tell ayush in /contact.",
  clear: () => "__CLEAR__",
};

export function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: "FALCON-SHELL v1.0 — type 'help' to list commands." },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }); }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    setHistory((h) => [...h, cmd]); setHi(-1);
    setLines((l) => [...l, { kind: "in", text: cmd }]);
    const fn = COMMANDS[cmd];
    if (!fn) {
      setLines((l) => [...l, { kind: "err", text: `command not found: ${cmd}  (try 'help')` }]);
      return;
    }
    const out = fn();
    if (out === "__CLEAR__") setLines([{ kind: "out", text: "// cleared" }]);
    else setLines((l) => [...l, { kind: "out", text: out }]);
  };

  return (
    <section className="min-h-screen px-6 md:px-16 pt-32 pb-32">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <div className="font-mono text-xs text-primary mb-2">▸ /dev/falcon-shell</div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-glow">TERMINAL <span className="text-accent text-glow-accent">ACCESS</span></h2>
        </motion.div>

        <div
          onClick={() => inputRef.current?.focus()}
          className="corner-frame box-glow bg-[oklch(0.08_0.02_260_/_0.85)] backdrop-blur-md cursor-text"
        >
          <span className="c-bl" /><span className="c-br" />
          {/* title bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-primary/30">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--hp)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--xp)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">root@falcon:~ —  zsh</span>
            <span />
          </div>

          <div ref={scrollRef} className="p-4 h-[380px] overflow-y-auto font-mono text-[13px] leading-relaxed">
            {lines.map((l, i) => (
              <div key={i} className={l.kind === "err" ? "text-[var(--hp)]" : l.kind === "in" ? "text-accent" : "text-foreground/85"}>
                {l.kind === "in" ? <><span className="text-primary">guest@thehunter2714:~$</span> {l.text}</> : <span className="whitespace-pre-wrap">{l.text}</span>}
              </div>
            ))}
            <form
              onSubmit={(e) => { e.preventDefault(); run(input); setInput(""); }}
              className="flex items-center gap-2 mt-1"
            >
              <span className="text-primary">guest@thehunter2714:~$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" && history.length) {
                    e.preventDefault();
                    const ni = hi < 0 ? history.length - 1 : Math.max(0, hi - 1);
                    setHi(ni); setInput(history[ni]);
                  } else if (e.key === "ArrowDown" && hi >= 0) {
                    e.preventDefault();
                    const ni = hi + 1;
                    if (ni >= history.length) { setHi(-1); setInput(""); }
                    else { setHi(ni); setInput(history[ni]); }
                  }
                }}
                className="flex-1 bg-transparent outline-none text-foreground caret-primary"
                autoFocus spellCheck={false}
              />
              <span className="w-2 h-4 bg-primary animate-pulse" />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
