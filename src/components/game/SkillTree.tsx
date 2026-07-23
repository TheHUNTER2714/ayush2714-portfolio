import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Node {
  id: string; label: string; x: number; y: number; level: number; max: number; unlocked: boolean; branch: "core" | "design" | "engine";
  connects: string[];
  stack: string[];
  years: number;
  xp: number;
  highlights: string[];
  projects: { name: string; blurb: string; tech: string[] }[];
}

// Skill matrix re-calibrated from Ayush Agnihotri's resume.
const NODES: Node[] = [
  { id: "n1", label: "PYTHON", x: 50, y: 10, level: 5, max: 5, unlocked: true, branch: "core", connects: ["n2", "n3", "n7"],
    stack: ["Flask", "Pdfminer.six", "NLP", "Pandas", "NumPy"], years: 3, xp: 8800,
    highlights: ["Built NLP pipelines for resume parsing", "Flask + Flask-CORS APIs", "AKTU AI Confluence — 1st place"],
    projects: [
      { name: "Resume Skill Extractor", blurb: "Python/Flask + NLP backend that parses resumes and surfaces skills.", tech: ["Flask", "Pdfminer.six", "NLP"] },
      { name: "DocAnalyzer", blurb: "AI document analysis — extract, summarize, classify content.", tech: ["NLP", "ML", "Python"] },
    ] },
  { id: "n2", label: "JAVASCRIPT", x: 22, y: 28, level: 4, max: 5, unlocked: true, branch: "core", connects: ["n4", "n5"],
    stack: ["ES2024", "Socket.IO", "Axios", "Framer Motion"], years: 3, xp: 7600,
    highlights: ["Real-time apps over WebSockets", "Smooth UI choreography", "Open-source JS contributions"],
    projects: [
      { name: "ChatCord", blurb: "Real-time rooms, presence, notifications over Socket.IO.", tech: ["Socket.IO", "Express", "JS"] },
      { name: "Voice Wizard Buddy (Nova AI)", blurb: "Voice assistant with speech recognition and intent handling.", tech: ["Web Speech API", "JS"] },
    ] },
  { id: "n3", label: "JAVA", x: 78, y: 28, level: 4, max: 5, unlocked: true, branch: "engine", connects: ["n6"],
    stack: ["OOP", "Collections", "JDBC", "Multithreading"], years: 3, xp: 6800,
    highlights: ["Strong OOP foundation", "DSA in Java", "Backend service prototypes"],
    projects: [
      { name: "Attendease", blurb: "Smart attendance system — accurate tracking, simple monitoring.", tech: ["Java", "JDBC", "MySQL"] },
      { name: "Flashmaster", blurb: "Interactive flashcard study platform for quick revision.", tech: ["Java", "OOP"] },
    ] },
  { id: "n4", label: "HTML / CSS", x: 10, y: 50, level: 5, max: 5, unlocked: true, branch: "design", connects: ["n7"],
    stack: ["Tailwind CSS", "Responsive UI", "Animations", "OKLCH"], years: 4, xp: 8200,
    highlights: ["UI/UX-first builds", "Responsive across devices", "Animation-led storytelling"],
    projects: [
      { name: "Vibemeet-Horizon", blurb: "Cinematic landing for a WebRTC video-collab platform.", tech: ["HTML", "CSS", "Tailwind"] },
      { name: "Resume Builder", blurb: "Live preview resume builder with PDF export.", tech: ["HTML", "CSS", "JS"] },
    ] },
  { id: "n5", label: "REACT", x: 38, y: 50, level: 4, max: 5, unlocked: true, branch: "design", connects: ["n7", "n9"],
    stack: ["React.js", "Tailwind", "Framer Motion", "Axios", "File-Saver"], years: 2, xp: 7400,
    highlights: ["Animated, accessible UI", "API-driven dashboards", "Component-first architecture"],
    projects: [
      { name: "Resume Skill Extractor (UI)", blurb: "React + Framer Motion frontend with file upload + typewriter UX.", tech: ["React", "Tailwind", "Framer Motion"] },
      { name: "Arcade Portfolio", blurb: "This experience — TanStack Start, Three.js, AI co-pilot.", tech: ["React 19", "TanStack Start", "Three.js"] },
    ] },
  { id: "n6", label: "OPERATING SYS", x: 90, y: 50, level: 4, max: 5, unlocked: true, branch: "engine", connects: ["n8"],
    stack: ["Linux", "Processes", "Scheduling", "Memory"], years: 2, xp: 5800,
    highlights: ["Comfortable on Linux toolchains", "Process / thread mental model", "Shell-first workflows"],
    projects: [
      { name: "Rainwater Harvesting", blurb: "Smart monitoring + sustainable resource utilization.", tech: ["IoT", "Linux"] },
      { name: "Shell Utilities", blurb: "Personal CLI helpers for day-to-day dev flow.", tech: ["Bash", "Linux"] },
    ] },
  { id: "n7", label: "AI / NLP", x: 25, y: 72, level: 4, max: 5, unlocked: true, branch: "design", connects: ["n9"],
    stack: ["NLP", "ML", "OCI AI", "Resume parsing"], years: 2, xp: 7200,
    highlights: ["Oracle AI Foundations Certified", "NLP for document understanding", "AKTU AI Hackathon · 1st place"],
    projects: [
      { name: "StudyCare Chatbot", blurb: "Emotional-support + study assistant powered by NLP.", tech: ["Python", "NLP", "AI"] },
      { name: "Nova AI", blurb: "Voice assistant — speech recognition + intelligent responses.", tech: ["NLP", "Speech API"] },
    ] },
  { id: "n8", label: "CLOUD / OCI", x: 75, y: 72, level: 4, max: 5, unlocked: true, branch: "engine", connects: ["n9"],
    stack: ["Oracle Cloud Infrastructure", "Data Science on OCI", "Deployment"], years: 1, xp: 5400,
    highlights: ["OCI Data Science Professional", "OCI AI Foundations Associate", "Cloud-native deploys"],
    projects: [
      { name: "OCI Data Science Lab", blurb: "Notebooks + model deployment on Oracle Cloud.", tech: ["OCI", "Python", "ML"] },
      { name: "Cloud Hosted Portfolios", blurb: "Render / Netlify deploys for live project demos.", tech: ["Render", "Netlify"] },
    ] },
  { id: "n9", label: "FULL-STACK", x: 50, y: 92, level: 5, max: 5, unlocked: true, branch: "core", connects: [],
    stack: ["React", "Node.js", "Express", "Socket.IO", "Flask", "Tailwind"], years: 3, xp: 9400,
    highlights: ["Ships end-to-end solo", "GSSoC Extended contributor", "Hacktoberfest 2025 Super Contributor"],
    projects: [
      { name: "ChatCord (Full-stack)", blurb: "Rooms, presence, real-time notifications — Socket.IO + Express.", tech: ["Node.js", "Socket.IO", "Express"] },
      { name: "Vibemeet-Horizon", blurb: "WebRTC meeting rooms with live chat and secure rooms.", tech: ["WebRTC", "Node.js", "React"] },
    ] },
];

const BRANCH_COLOR: Record<string, string> = {
  core: "var(--hud)",
  design: "var(--accent)",
  engine: "var(--xp)",
};

export function SkillTree() {
  const [hover, setHover] = useState<string | null>(null);
  const [picked, setPicked] = useState<string>("n1");
  const node = NODES.find((n) => n.id === picked)!;
  const color = BRANCH_COLOR[node.branch];

  return (
    <section className="min-h-screen px-6 md:px-16 pt-32 pb-32">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="font-mono text-xs text-primary mb-2">▸ SKILL_TREE.bin // ALLOC {NODES.length}/{NODES.length} · TAP A NODE · SYNCED W/ RESUME</div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-glow">ABILITY <span className="text-accent text-glow-accent">MATRIX</span></h2>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="relative corner-frame box-glow bg-card backdrop-blur-md aspect-[4/5] md:aspect-[5/4] overflow-hidden">
            <span className="c-bl" /><span className="c-br" />
            <div className="absolute inset-0 opacity-30"
              style={{ backgroundImage: "radial-gradient(circle at center, oklch(0.82 0.18 195 / 0.15), transparent 60%)" }} />

            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              {NODES.map((n) =>
                n.connects.map((cid) => {
                  const c = NODES.find((x) => x.id === cid)!;
                  const active = hover === n.id || hover === cid || picked === n.id || picked === cid;
                  return (
                    <line
                      key={`${n.id}-${cid}`} x1={n.x} y1={n.y} x2={c.x} y2={c.y}
                      stroke={active ? "var(--hud)" : "oklch(0.82 0.18 195 / 0.35)"}
                      strokeWidth={active ? "0.5" : "0.2"}
                      strokeDasharray="1.5 1"
                    >
                      <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="3s" repeatCount="indefinite" />
                    </line>
                  );
                })
              )}
            </svg>

            {NODES.map((n, i) => {
              const ncolor = BRANCH_COLOR[n.branch];
              const isHover = hover === n.id;
              const isPicked = picked === n.id;
              return (
                <motion.button
                  key={n.id}
                  onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}
                  onClick={() => setPicked(n.id)}
                  initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.06, type: "spring" }}
                  whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.92 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                >
                  <motion.div
                    animate={isPicked ? { boxShadow: [`0 0 12px ${ncolor}`, `0 0 32px ${ncolor}`, `0 0 12px ${ncolor}`] } : {}}
                    transition={{ duration: 1.6, repeat: Infinity }}
                    className="relative w-12 h-12 md:w-14 md:h-14 grid place-items-center"
                    style={{
                      clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
                      background: `linear-gradient(135deg, ${ncolor}, oklch(0.15 0.04 260))`,
                      boxShadow: isHover ? `0 0 24px ${ncolor}` : `0 0 12px ${ncolor}55`,
                    }}
                  >
                    <div className="absolute inset-[3px]"
                      style={{
                        clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
                        background: "oklch(0.13 0.03 260)",
                      }}
                    />
                    <span className="relative font-display font-bold text-xs leading-none" style={{ color: ncolor }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </motion.div>
                  <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap font-mono text-[10px] transition-opacity ${isHover || isPicked ? "opacity-100" : "opacity-60"}`} style={{ color: ncolor }}>
                    {n.label} · LV{n.level}/{n.max}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Side panel: inspector */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                transition={{ duration: 0.35 }}
                className="corner-frame bg-card backdrop-blur-md p-4 relative overflow-hidden"
                style={{ boxShadow: `0 0 24px -8px ${color}` }}
              >
                <span className="c-bl" /><span className="c-br" />
                <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2" style={{ background: color }} />
                    <h4 className="font-display text-xs tracking-widest" style={{ color }}>{node.label}</h4>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color }}>LV {node.level}/{node.max}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center border py-1.5" style={{ borderColor: `${color}33` }}>
                    <div className="font-display text-base" style={{ color }}>{node.years}y</div>
                    <div className="font-mono text-[8px] text-muted-foreground tracking-widest">EXP</div>
                  </div>
                  <div className="text-center border py-1.5" style={{ borderColor: `${color}33` }}>
                    <div className="font-display text-base" style={{ color }}>{node.xp.toLocaleString()}</div>
                    <div className="font-mono text-[8px] text-muted-foreground tracking-widest">XP</div>
                  </div>
                  <div className="text-center border py-1.5" style={{ borderColor: `${color}33` }}>
                    <div className="font-display text-base" style={{ color }}>{node.projects.length}</div>
                    <div className="font-mono text-[8px] text-muted-foreground tracking-widest">SHIPPED</div>
                  </div>
                </div>
                <div className="font-mono text-[10px] text-muted-foreground mb-1 tracking-widest">▸ HIGHLIGHTS</div>
                <ul className="mb-3 space-y-0.5">
                  {node.highlights.map((h) => (
                    <li key={h} className="font-mono text-[10px] text-foreground/75">▹ {h}</li>
                  ))}
                </ul>
                <div className="font-mono text-[10px] text-muted-foreground mb-1 tracking-widest">▸ STACK</div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {node.stack.map((s) => (
                    <span key={s} className="font-mono text-[10px] px-1.5 py-0.5 border" style={{ borderColor: `${color}55`, color }}>
                      {s}
                    </span>
                  ))}
                </div>
                <div className="font-mono text-[10px] text-muted-foreground mb-1 tracking-widest">▸ PROJECTS</div>
                <div className="space-y-2">
                  {node.projects.map((p) => (
                    <motion.div
                      key={p.name}
                      initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                      className="font-mono text-[11px] leading-snug border-l-2 pl-2"
                      style={{ borderColor: `${color}55` }}
                    >
                      <div className="font-display tracking-wide" style={{ color }}>› {p.name}</div>
                      <div className="text-foreground/70">{p.blurb}</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {p.tech.map((t) => (
                          <span key={t} className="text-[9px] px-1 py-px border" style={{ borderColor: `${color}33`, color: `${color}cc` }}>{t}</span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {(["core", "design", "engine"] as const).map((b, i) => (
              <motion.div
                key={b}
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="corner-frame bg-card backdrop-blur-md p-3"
              >
                <span className="c-bl" /><span className="c-br" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2" style={{ background: BRANCH_COLOR[b] }} />
                  <h4 className="font-display text-[11px] tracking-widest" style={{ color: BRANCH_COLOR[b] }}>{b.toUpperCase()} BRANCH</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
