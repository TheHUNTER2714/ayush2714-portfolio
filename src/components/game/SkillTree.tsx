import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Node {
  id: string; label: string; x: number; y: number; level: number; max: number; unlocked: boolean; branch: "core" | "design" | "engine";
  connects: string[];
  stack: string[];
  projects: { name: string; blurb: string }[];
}

const NODES: Node[] = [
  { id: "n1", label: "PYTHON", x: 50, y: 12, level: 5, max: 5, unlocked: true, branch: "core", connects: ["n2", "n3"],
    stack: ["FastAPI", "Flask", "Pandas", "NumPy", "scikit-learn"],
    projects: [
      { name: "Sentiment Engine", blurb: "Transformer-based review classifier · 92% F1." },
      { name: "Recon Toolkit", blurb: "Async port scanner with rate-limited probing." },
    ] },
  { id: "n2", label: "JAVASCRIPT", x: 25, y: 30, level: 4, max: 5, unlocked: true, branch: "core", connects: ["n4", "n5"],
    stack: ["ES2024", "TypeScript", "Vite", "Bun"],
    projects: [
      { name: "Portfolio v3", blurb: "This site — TanStack Start + Three.js + GSAP timing." },
      { name: "Real-time Whiteboard", blurb: "CRDT canvas synced over WebSockets." },
    ] },
  { id: "n3", label: "C LANG", x: 75, y: 30, level: 4, max: 5, unlocked: true, branch: "engine", connects: ["n6"],
    stack: ["GCC", "Make", "POSIX", "valgrind"],
    projects: [
      { name: "Mini Shell", blurb: "Pipes, jobs, signals · ~1.4k LOC." },
      { name: "VM Interpreter", blurb: "Stack-based bytecode for a toy language." },
    ] },
  { id: "n4", label: "HTML / CSS", x: 12, y: 52, level: 5, max: 5, unlocked: true, branch: "design", connects: ["n7"],
    stack: ["Tailwind v4", "OKLCH", "Container queries", "ViewTransitions"],
    projects: [
      { name: "Cinematic Hero", blurb: "Scroll-driven low-poly Three.js cover." },
      { name: "Awwwards-style cards", blurb: "Magnetic hovers, conic gradient borders." },
    ] },
  { id: "n5", label: "NODE.JS", x: 38, y: 52, level: 4, max: 5, unlocked: true, branch: "core", connects: ["n7"],
    stack: ["Express", "tRPC", "Prisma", "Socket.IO"],
    projects: [
      { name: "API Gateway", blurb: "Edge-cached REST → GraphQL bridge." },
      { name: "Chat Server", blurb: "Rooms, presence, typing indicators." },
    ] },
  { id: "n6", label: "NETWORKING", x: 78, y: 52, level: 4, max: 5, unlocked: true, branch: "engine", connects: ["n8"],
    stack: ["TCP/IP", "DNS", "TLS", "Wireshark"],
    projects: [
      { name: "Latency Heatmap", blurb: "Traceroute → interactive globe vis." },
      { name: "Packet Sniffer", blurb: "Educational raw-socket capture tool." },
    ] },
  { id: "n7", label: "AI / NLP", x: 25, y: 74, level: 4, max: 5, unlocked: true, branch: "design", connects: ["n9"],
    stack: ["LangChain", "OpenAI", "Gemini", "Pinecone", "HF Transformers"],
    projects: [
      { name: "Resume Coach", blurb: "LLM critique with RAG over job listings." },
      { name: "Doc-QA Bot", blurb: "PDF embed → semantic search → answer." },
    ] },
  { id: "n8", label: "CYBER SEC", x: 78, y: 74, level: 3, max: 5, unlocked: true, branch: "engine", connects: ["n9"],
    stack: ["Burp Suite", "Nmap", "OWASP Top 10", "Hashcat"],
    projects: [
      { name: "CTF Writeups", blurb: "Web + crypto challenges, 20+ solves." },
      { name: "Auth Audit", blurb: "Token replay + CSRF lab for an internal app." },
    ] },
  { id: "n9", label: "FULL-STACK", x: 50, y: 92, level: 5, max: 5, unlocked: true, branch: "core", connects: [],
    stack: ["React 19", "TanStack Start", "Supabase", "Stripe", "Cloudflare"],
    projects: [
      { name: "Arcade Portfolio", blurb: "This experience — terminal, AI co-pilot, 3D world." },
      { name: "SaaS Starter", blurb: "Auth, billing, RLS, edge functions in one repo." },
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
          <div className="font-mono text-xs text-primary mb-2">▸ SKILL_TREE.bin // ALLOC 9/12 · TAP A NODE</div>
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
                    <span className="relative font-display font-bold text-xs" style={{ color: ncolor }}>{n.level}</span>
                  </motion.div>
                  <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap font-mono text-[10px] transition-opacity ${isHover || isPicked ? "opacity-100" : "opacity-60"}`} style={{ color: ncolor }}>
                    {n.label}
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
                      className="font-mono text-[11px] leading-snug"
                    >
                      <div className="font-display tracking-wide" style={{ color }}>› {p.name}</div>
                      <div className="text-foreground/70">{p.blurb}</div>
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
