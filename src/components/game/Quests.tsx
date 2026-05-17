import { motion } from "framer-motion";

const QUESTS = [
  {
    code: "Q-001",
    title: "StudyCare — Emotional Chatbot AI",
    type: "MAIN QUEST",
    rarity: "LEGENDARY",
    desc: "AI-powered chatbot offering emotional support and study assistance through natural-language conversations.",
    stack: ["Python", "AI", "NLP"],
    reward: "+1200 XP",
    status: "LIVE",
    href: "https://studycarechatbot.netlify.app/",
  },
  {
    code: "Q-002",
    title: "ChatCord — Real-time Chat",
    type: "MAIN QUEST",
    rarity: "EPIC",
    desc: "Real-time messaging app with rooms and presence, built on Socket.IO and Express.",
    stack: ["Node.js", "Socket.IO", "Express"],
    reward: "+940 XP",
    status: "LIVE",
    href: "https://chatcord-9slp.onrender.com",
  },
  {
    code: "Q-003",
    title: "Space Invader Arcade",
    type: "SIDE QUEST",
    rarity: "EPIC",
    desc: "Classic arcade shooter on HTML5 Canvas — the direct inspiration for the mini-game in this portfolio.",
    stack: ["JavaScript", "Canvas", "Game Dev"],
    reward: "+860 XP",
    status: "LIVE",
    href: "https://thehunter2714.github.io/space_invaders_arcade/",
  },
  {
    code: "Q-004",
    title: "Resume Skill Extractor",
    type: "BOUNTY",
    rarity: "RARE",
    desc: "ML tool that parses resumes and surfaces skills — Flask backend, Python ML pipeline.",
    stack: ["ML", "Flask", "Python"],
    reward: "+620 XP",
    status: "LIVE",
    href: "https://rajeshth.netlify.app/",
  },
  {
    code: "Q-005",
    title: "Student DB Management System",
    type: "SIDE QUEST",
    rarity: "RARE",
    desc: "Full CRUD student records system with clean UI/UX.",
    stack: ["JavaScript", "Database", "UI/UX"],
    reward: "+520 XP",
    status: "LIVE",
    href: "https://thehunter2714.github.io/STDM/",
  },
  {
    code: "Q-006",
    title: "Resume Builder",
    type: "BOUNTY",
    rarity: "RARE",
    desc: "Interactive resume builder with real-time preview and PDF export.",
    stack: ["HTML", "CSS", "JavaScript"],
    reward: "+460 XP",
    status: "LIVE",
    href: "https://thehunter2714.github.io/resume/",
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
            LIVE: <span className="text-primary">6</span> // STACK: <span className="text-accent">FULL</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {QUESTS.map((q, i) => {
            const color = RARITY[q.rarity];
            return (
              <motion.a
                key={q.code}
                href={q.href} target="_blank" rel="noreferrer"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="corner-frame group relative bg-card backdrop-blur-md p-5 cursor-pointer transition-shadow block"
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
                    STATUS: <span className="text-primary">{q.status}</span>
                  </span>
                  <span className="font-mono text-[10px] group-hover:text-primary transition-colors" style={{ color: "var(--xp)" }}>▸ LAUNCH {q.reward}</span>
                </footer>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
