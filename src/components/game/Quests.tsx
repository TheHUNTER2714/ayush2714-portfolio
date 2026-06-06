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
    desc: "Real-time messaging app with rooms, presence, and notifications, built on Socket.IO + Express.",
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
    desc: "Classic arcade shooter on HTML5 Canvas — direct inspiration for the mini-game in this portfolio.",
    stack: ["JavaScript", "Canvas", "Game Dev"],
    reward: "+860 XP",
    status: "LIVE",
    href: "https://thehunter2714.github.io/space_invaders_arcade/",
  },
  {
    code: "Q-004",
    title: "Resume Skill Extractor",
    type: "BOUNTY",
    rarity: "EPIC",
    desc: "ML tool that parses resumes and surfaces skills — Flask backend, Python NLP, React UI.",
    stack: ["Flask", "NLP", "React"],
    reward: "+820 XP",
    status: "LIVE",
    href: "https://rajeshth.netlify.app/",
  },
  {
    code: "Q-005",
    title: "Attendease — Smart Attendance",
    type: "MAIN QUEST",
    rarity: "RARE",
    desc: "Automated attendance tracking with accurate records and simple monitoring for classrooms.",
    stack: ["Java", "MySQL", "JDBC"],
    reward: "+560 XP",
    status: "LIVE",
    href: "https://github.com/TheHUNTER2714",
  },
  {
    code: "Q-006",
    title: "DocAnalyzer — NLP Doc Engine",
    type: "BOUNTY",
    rarity: "EPIC",
    desc: "AI document analysis — extract, summarize and classify long-form content with NLP + ML.",
    stack: ["Python", "NLP", "ML"],
    reward: "+780 XP",
    status: "LIVE",
    href: "https://github.com/TheHUNTER2714",
  },
  {
    code: "Q-007",
    title: "Vibemeet-Horizon",
    type: "MAIN QUEST",
    rarity: "LEGENDARY",
    desc: "Real-time video conferencing with secure rooms, live chat, and WebRTC-based communication.",
    stack: ["WebRTC", "Node.js", "React"],
    reward: "+1100 XP",
    status: "LIVE",
    href: "https://github.com/TheHUNTER2714",
  },
  {
    code: "Q-008",
    title: "Nova AI — Voice Wizard Buddy",
    type: "SIDE QUEST",
    rarity: "EPIC",
    desc: "Voice assistant with speech recognition and intelligent natural-language responses.",
    stack: ["Speech API", "AI", "JS"],
    reward: "+720 XP",
    status: "LIVE",
    href: "https://github.com/TheHUNTER2714",
  },
  {
    code: "Q-009",
    title: "Rainwater Harvesting",
    type: "BOUNTY",
    rarity: "RARE",
    desc: "Smart rainwater management — efficient conservation, monitoring, sustainable usage.",
    stack: ["IoT", "Python", "Cloud"],
    reward: "+520 XP",
    status: "LIVE",
    href: "https://github.com/TheHUNTER2714",
  },
  {
    code: "Q-010",
    title: "Flashmaster — Study Cards",
    type: "SIDE QUEST",
    rarity: "RARE",
    desc: "Interactive flashcard study platform for quick revision and retention.",
    stack: ["JavaScript", "UI/UX", "Web"],
    reward: "+480 XP",
    status: "LIVE",
    href: "https://github.com/TheHUNTER2714",
  },
  {
    code: "Q-011",
    title: "Student DB Management",
    type: "SIDE QUEST",
    rarity: "RARE",
    desc: "Full CRUD student records system with clean UI/UX.",
    stack: ["JS", "DB", "UI/UX"],
    reward: "+520 XP",
    status: "LIVE",
    href: "https://thehunter2714.github.io/STDM/",
  },
  {
    code: "Q-012",
    title: "Resume Builder",
    type: "BOUNTY",
    rarity: "RARE",
    desc: "Interactive resume builder with real-time preview and PDF export.",
    stack: ["HTML", "CSS", "JS"],
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
    <section className="min-h-screen px-6 md:px-16 pt-32 pb-32 relative overflow-hidden">
      {/* layered backdrop */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: "linear-gradient(oklch(0.82 0.18 195) 1px, transparent 1px), linear-gradient(90deg, oklch(0.82 0.18 195) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }} />
        <motion.div
          className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, oklch(0.78 0.18 195 / 0.6), transparent 70%)" }}
          animate={{ x: [0, 60, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-[420px] h-[420px] rounded-full blur-3xl opacity-25"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.28 330 / 0.6), transparent 70%)" }}
          animate={{ x: [0, -60, 0], y: [0, -30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="mb-12 flex items-end justify-between flex-wrap gap-4"
        >
          <div>
            <div className="font-mono text-xs text-primary mb-2">▸ QUEST_LOG.dat // LAYER 03 — PROJECT VAULT</div>
            <h2 className="font-display font-black text-4xl md:text-6xl text-glow">
              SHIPPED <span className="text-accent text-glow-accent">QUESTS</span>
            </h2>
            <motion.div
              className="mt-2 h-[2px] origin-left"
              initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ background: "linear-gradient(90deg, var(--primary), var(--accent), transparent)" }}
            />
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            LIVE: <span className="text-primary">{QUESTS.length}</span> // STACK: <span className="text-accent">FULL</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {QUESTS.map((q, i) => {
            const color = RARITY[q.rarity];
            return (
              <motion.a
                key={q.code}
                href={q.href} target="_blank" rel="noreferrer"
                initial={{ opacity: 0, y: 50, rotateX: -12, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -10, scale: 1.02, rotateX: 2 }}
                className="corner-frame group relative bg-card/85 backdrop-blur-md p-5 cursor-pointer transition-shadow block overflow-hidden"
                style={{
                  boxShadow: `0 0 0 1px ${color}33, 0 12px 30px -12px ${color}66, inset 0 0 36px -16px ${color}`,
                  transformStyle: "preserve-3d",
                }}
              >
                <span className="c-bl" /><span className="c-br" />

                {/* layered glow plate */}
                <div aria-hidden className="absolute inset-0 pointer-events-none opacity-60"
                  style={{ background: `radial-gradient(80% 60% at 20% 0%, ${color}1a, transparent 60%)` }} />

                {/* animated top rim */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-px"
                  initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: i * 0.06 + 0.2 }}
                  style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)`, transformOrigin: "left" }}
                />

                {/* hover sheen sweep */}
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(110deg, transparent 35%, ${color}33 50%, transparent 65%)` }}
                />

                {/* corner spark */}
                <motion.span
                  aria-hidden
                  className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                  style={{ background: color, boxShadow: `0 0 12px ${color}` }}
                  animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.1 }}
                />

                <header className="flex items-start justify-between gap-3 mb-3 relative">
                  <div>
                    <div className="font-mono text-[10px] tracking-widest" style={{ color }}>{q.type} · {q.code}</div>
                    <h3 className="font-display text-xl mt-1 group-hover:text-primary transition-colors leading-tight">{q.title}</h3>
                  </div>
                  <span
                    className="font-mono text-[10px] px-2 py-1 border whitespace-nowrap"
                    style={{ color, borderColor: `${color}88`, background: `${color}11` }}
                  >
                    {q.rarity}
                  </span>
                </header>

                <p className="text-sm text-foreground/75 leading-relaxed mb-4 relative">{q.desc}</p>

                <div className="flex flex-wrap gap-1.5 mb-4 relative">
                  {q.stack.map((s, si) => (
                    <motion.span
                      key={s}
                      initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      transition={{ delay: i * 0.06 + 0.3 + si * 0.05 }}
                      className="font-mono text-[10px] px-2 py-0.5 bg-secondary/60 text-foreground/70"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>

                <div className="mb-3 relative">
                  <div className="h-1 bg-secondary/60 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }}
                      transition={{ duration: 1.3, delay: i * 0.06 + 0.4, ease: "easeOut" }}
                      className="h-full"
                      style={{ background: `linear-gradient(90deg, ${color}, var(--xp))` }}
                    />
                  </div>
                </div>

                <footer className="flex items-center justify-between pt-3 border-t border-border/60 relative">
                  <span className="font-mono text-[10px]">
                    STATUS: <span className="text-primary">{q.status}</span>
                  </span>
                  <motion.span
                    className="font-mono text-[10px] group-hover:text-primary transition-colors"
                    style={{ color: "var(--xp)" }}
                    whileHover={{ x: 4 }}
                  >
                    ▸ LAUNCH {q.reward}
                  </motion.span>
                </footer>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
