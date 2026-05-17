import { motion } from "framer-motion";

const QUESTS = [
  {
    code: "Q-001",
    title: "Neon Atlas",
    type: "MAIN QUEST",
    rarity: "LEGENDARY",
    desc: "Real-time 3D map editor with collaborative cursors and physics-based terrain sculpting.",
    stack: ["Three.js", "WebRTC", "Rust/WASM"],
    reward: "+1200 XP",
    status: "COMPLETE",
  },
  {
    code: "Q-002",
    title: "Pulse Studio",
    type: "SIDE QUEST",
    rarity: "EPIC",
    desc: "Audio-reactive shader playground used by 30k+ creators to design generative visuals.",
    stack: ["GLSL", "Web Audio", "React"],
    reward: "+860 XP",
    status: "COMPLETE",
  },
  {
    code: "Q-003",
    title: "Drift OS",
    type: "MAIN QUEST",
    rarity: "EPIC",
    desc: "Browser-based design OS — windowed workspaces, plugin runtime, multiplayer canvases.",
    stack: ["TanStack", "Yjs", "Edge"],
    reward: "+940 XP",
    status: "IN PROGRESS",
  },
  {
    code: "Q-004",
    title: "Voxel Diary",
    type: "BOUNTY",
    rarity: "RARE",
    desc: "A daily journaling app that builds a voxel city from your habits and streaks.",
    stack: ["R3F", "Supabase", "Motion"],
    reward: "+520 XP",
    status: "COMPLETE",
  },
];

const RARITY: Record<string, string> = {
  LEGENDARY: "var(--legendary)",
  EPIC: "var(--accent)",
  RARE: "var(--mp)",
};

export function Quests() {
  return (
    <section className="min-h-screen px-6 md:px-16 pt-32 pb-32">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="mb-12 flex items-end justify-between flex-wrap gap-4"
        >
          <div>
            <div className="font-mono text-xs text-primary mb-2">▸ QUEST_LOG.dat</div>
            <h2 className="font-display font-black text-4xl md:text-6xl text-glow">SHIPPED <span className="text-accent text-glow-accent">QUESTS</span></h2>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            COMPLETED: <span className="text-primary">37</span> // ACTIVE: <span className="text-accent">3</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {QUESTS.map((q, i) => {
            const color = RARITY[q.rarity];
            return (
              <motion.article
                key={q.code}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="corner-frame group relative bg-card backdrop-blur-md p-5 cursor-pointer transition-shadow"
                style={{ boxShadow: `0 0 0 1px ${color}33, 0 0 24px -8px ${color}66, inset 0 0 32px -16px ${color}` }}
              >
                <span className="c-bl" /><span className="c-br" />
                <div className="absolute top-0 left-0 right-0 h-px opacity-60" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

                <header className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="font-mono text-[10px] tracking-widest" style={{ color }}>{q.type} · {q.code}</div>
                    <h3 className="font-display text-2xl mt-1 group-hover:text-primary transition-colors">{q.title}</h3>
                  </div>
                  <span
                    className="font-mono text-[10px] px-2 py-1 border whitespace-nowrap"
                    style={{ color, borderColor: `${color}88`, background: `${color}11` }}
                  >
                    {q.rarity}
                  </span>
                </header>

                <p className="text-sm text-foreground/75 leading-relaxed mb-4">{q.desc}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {q.stack.map((s) => (
                    <span key={s} className="font-mono text-[10px] px-2 py-0.5 bg-secondary/60 text-foreground/70">{s}</span>
                  ))}
                </div>

                <footer className="flex items-center justify-between pt-3 border-t border-border/60">
                  <span className="font-mono text-[10px]">
                    STATUS: <span className={q.status === "COMPLETE" ? "text-primary" : "text-[var(--xp)] animate-pulse"}>{q.status}</span>
                  </span>
                  <span className="font-mono text-[10px]" style={{ color: "var(--xp)" }}>{q.reward}</span>
                </footer>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
