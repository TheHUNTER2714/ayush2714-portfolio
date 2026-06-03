import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Line = { kind: "in" | "out" | "err" | "sys"; text: string };

const ASCII_PHOENIX = String.raw`
        _
       / \\.-"-/\\
      /  ,    , \\
     | (o)    (o)|     PHOENIX_v3
      \\  \\__/  /      reignited
       '.____.'
        / || \\
       /  ||  \\
`;

const HELP_TEXT = [
  "╔══════════════════════════════════════════════════╗",
  "║  PHOENIX-SHELL · COMMAND CODEX · v1.2            ║",
  "╚══════════════════════════════════════════════════╝",
  "",
  "[ IDENTITY ]",
  "  whoami        — agent dossier",
  "  skills        — equipped tech stack",
  "  socials       — github · linkedin · portfolio",
  "  contact       — direct comms channel",
  "  resume        — download CV.pdf",
  "  github        — open profile in new tab",
  "",
  "[ MISSIONS ]",
  "  projects      — shipped quests roster",
  "",
  "[ FX / VFX ]",
  "  ascii         — print phoenix art",
  "  banner        — animated wordmark",
  "  matrix        — toggle matrix rain",
  "  glitch        — chromatic distortion burst",
  "  theme [name]  — amber|cyan|magenta|green",
  "",
  "[ SYSTEM ]",
  "  date          — system clock",
  "  uptime        — session uptime",
  "  echo [text]   — repeat input",
  "  joke          — dev humor injection",
  "  fortune       — random insight",
  "  hack          — ???",
  "  sudo [cmd]    — elevate privileges",
  "  clear         — wipe terminal",
  "",
  "  ↹ TAB completes · ↑/↓ scroll history",
].join("\n");

const RAW_COMMANDS: Record<string, (args: string[], ctx: Ctx) => string> = {
  help: () => HELP_TEXT,

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
  hack: () => "ACCESS GRANTED — root@phoenix:~# ⚡ you found the easter egg. tell ayush in /contact.",
  clear: () => "__CLEAR__",
  ascii: () => ASCII_PHOENIX,
  date: () => new Date().toString(),
  echo: (a) => a.join(" "),
  uptime: (_a, c) => `session uptime — ${Math.floor((Date.now() - c.start) / 1000)}s`,
  joke: () => {
    const J = [
      "why do devs prefer dark mode? because light attracts bugs.",
      "there are 10 types of people: those who understand binary and those who don't.",
      "i told my computer i needed a break. it said: 'no problem — i'll go to sleep.'",
      "real programmers count from 0.",
      "rm -rf / is not a debugging strategy.",
    ];
    return "▸ " + J[Math.floor(Math.random() * J.length)];
  },
  fortune: () => {
    const F = [
      "ship messy. iterate ruthless.",
      "if it compiles, ship it. (then refactor.)",
      "the best code is the code you never had to write.",
      "every bug is a future feature in disguise.",
      "production is just staging with witnesses.",
    ];
    return "🜂 " + F[Math.floor(Math.random() * F.length)];
  },
  theme: (a, c) => {
    const name = (a[0] || "").toLowerCase();
    const map: Record<string, string> = { amber: "#fbbf24", cyan: "#22d3ee", magenta: "#f472b6", green: "#34d399" };
    if (!map[name]) return "theme: amber|cyan|magenta|green";
    c.setAccent(map[name]);
    return `▸ accent switched → ${name}`;
  },
  matrix: (_a, c) => { c.toggleMatrix(); return "▸ matrix rain — toggled"; },
  glitch: (_a, c) => { c.fireGlitch(); return "▸ chromatic distortion fired — hold steady"; },
  sudo: (a) => a.length ? `sudo: ${a.join(" ")}: permission denied — nice try, agent.` : "usage: sudo <cmd>",
  banner: () => "█▀█ █▄█ █▀█ █▀▀ █▄░█ █ ▀▄▀\n█▀▀ ░█░ █▄█ ██▄ █░▀█ █ █░█\n     PHOENIX SHELL · v1.2",
};

type Ctx = { start: number; setAccent: (c: string) => void; toggleMatrix: () => void; fireGlitch: () => void };


export function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { kind: "sys", text: "PHOENIX-SHELL v1.1 — boot complete. type 'help'." },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const [accent, setAccent] = useState("#22d3ee");
  const [matrix, setMatrix] = useState(false);
  const [glitch, setGlitch] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const start = useRef(Date.now()).current;

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }); }, [lines]);

  // Tab-complete
  const allCmds = Object.keys(RAW_COMMANDS);
  const complete = () => {
    const [head, ...rest] = input.split(" ");
    if (rest.length) return;
    const match = allCmds.find((c) => c.startsWith(head.toLowerCase()));
    if (match) setInput(match + " ");
  };

  const ctx: Ctx = {
    start,
    setAccent,
    toggleMatrix: () => setMatrix((m) => !m),
    fireGlitch: () => setGlitch((g) => g + 1),
  };


  const run = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const [name, ...args] = trimmed.split(/\s+/);
    setHistory((h) => [...h, trimmed]); setHi(-1);
    setLines((l) => [...l, { kind: "in", text: trimmed }]);
    const fn = RAW_COMMANDS[name.toLowerCase()];
    if (!fn) {
      setLines((l) => [...l, { kind: "err", text: `command not found: ${name}  (try 'help')` }]);
      return;
    }
    const out = fn(args, ctx);
    if (out === "__CLEAR__") setLines([{ kind: "sys", text: "// cleared" }]);
    else setLines((l) => [...l, { kind: "out", text: out }]);
  };

  return (
    <section className="min-h-screen px-6 md:px-16 pt-32 pb-32">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <div className="font-mono text-xs text-primary mb-2">▸ /dev/phoenix-shell</div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-glow">TERMINAL <span className="text-accent text-glow-accent">ACCESS</span></h2>
          <p className="font-mono text-[11px] text-muted-foreground mt-2">TAB autocompletes · ↑/↓ history · try `matrix`, `theme cyan`, `ascii`, `joke`</p>
        </motion.div>

        <div
          onClick={() => inputRef.current?.focus()}
          className="corner-frame box-glow bg-[oklch(0.08_0.02_260_/_0.9)] backdrop-blur-md cursor-text relative overflow-hidden"
          style={{ boxShadow: `0 0 40px ${accent}33, inset 0 0 60px ${accent}11` }}
        >
          <span className="c-bl" /><span className="c-br" />

          {/* matrix rain overlay */}
          {matrix && <MatrixRain accent={accent} />}

          <div className="flex items-center justify-between px-3 py-2 border-b border-primary/30 relative z-10">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--hp)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--xp)]" />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: accent }} />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">root@phoenix:~ — zsh · {history.length} cmds</span>
            <span className="font-mono text-[10px]" style={{ color: accent }}>● LIVE</span>
          </div>

          <div ref={scrollRef} className="p-4 h-[420px] overflow-y-auto font-mono text-[13px] leading-relaxed relative z-10">
            {lines.map((l, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={
                  l.kind === "err" ? "text-[var(--hp)]" :
                  l.kind === "in" ? "" :
                  l.kind === "sys" ? "text-accent" :
                  "text-foreground/85"
                }
                style={l.kind === "in" ? { color: accent } : undefined}
              >
                {l.kind === "in"
                  ? <><span style={{ color: accent, opacity: 0.7 }}>guest@thehunter2714:~$</span> {l.text}</>
                  : <span className="whitespace-pre-wrap">{l.text}</span>}
              </motion.div>
            ))}
            <form
              onSubmit={(e) => { e.preventDefault(); run(input); setInput(""); }}
              className="flex items-center gap-2 mt-1"
            >
              <span style={{ color: accent }}>guest@thehunter2714:~$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Tab") { e.preventDefault(); complete(); }
                  else if (e.key === "ArrowUp" && history.length) {
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
              <span className="w-2 h-4 animate-pulse" style={{ background: accent }} />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function MatrixRain({ accent }: { accent: string }) {
  const cols = 28;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25" aria-hidden>
      {Array.from({ length: cols }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 font-mono text-[10px] leading-[1.1] whitespace-pre"
          style={{ left: `${(i / cols) * 100}%`, color: accent }}
          initial={{ y: "-100%" }}
          animate={{ y: "120%" }}
          transition={{
            duration: 5 + (i % 5) * 1.3,
            repeat: Infinity,
            delay: (i % 7) * 0.5,
            ease: "linear",
          }}
        >
          {Array.from({ length: 30 }).map((_, j) => (
            <div key={j}>{String.fromCharCode(0x30a0 + ((i * j) % 96))}</div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}
