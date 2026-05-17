import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, type MouseEvent } from "react";

interface Trophy {
  id: string; tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  title: string; desc: string; date: string; rarity: string; icon: string;
}

const TROPHIES: Trophy[] = [
  { id: "t1", tier: "PLATINUM", title: "🥇 AKTU AI Tech Hackathon", desc: "1st Position — AKTU AI Tech Guvi HCL Hackathon.", date: "2024", rarity: "TOP 1%", icon: "★" },
  { id: "t2", tier: "GOLD", title: "Google Arcade Facilitator", desc: "Mentoring students in coding & development since April 2023.", date: "ONGOING", rarity: "ACTIVE", icon: "◈" },
  { id: "t3", tier: "GOLD", title: "JP Morgan — Virtual Intern", desc: "Fintech-focused tasks; insights into banking systems & solutions.", date: "11.24 – 12.24", rarity: "COMPLETED", icon: "▲" },
  { id: "t4", tier: "SILVER", title: "Tata Group — Virtual Intern", desc: "Data analysis on real-world datasets driving business decisions.", date: "10.24", rarity: "COMPLETED", icon: "❖" },
  { id: "t5", tier: "SILVER", title: "IBM AI Programming", desc: "Certified — AI Programming track via IBM.", date: "2024", rarity: "CERTIFIED", icon: "◆" },
  { id: "t6", tier: "SILVER", title: "IBM Cyber Security Fundamentals", desc: "Certified in core cybersecurity principles & defense.", date: "2024", rarity: "CERTIFIED", icon: "◆" },
  { id: "t7", tier: "BRONZE", title: "Cisco Python Essentials 3", desc: "Advanced Python via Cisco Networking Academy.", date: "2024", rarity: "CERTIFIED", icon: "⬢" },
  { id: "t8", tier: "BRONZE", title: "GitHub — Quad Badges", desc: "Pair Extraordinaire · Pull Shark · YOLO · Quickdraw.", date: "ONGOING", rarity: "STACKED", icon: "⬡" },
];

const TIER_COLOR: Record<string, string> = {
  PLATINUM: "var(--hud)",
  GOLD: "var(--legendary)",
  SILVER: "oklch(0.78 0.02 220)",
  BRONZE: "oklch(0.62 0.12 50)",
};

function TrophyCard({ t, idx }: { t: Trophy; idx: number }) {
  const color = TIER_COLOR[t.tier];
  const [unlocking, setUnlocking] = useState(false);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sRx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sRy = useSpring(ry, { stiffness: 200, damping: 18 });
  const glareX = useTransform(ry, [-12, 12], ["0%", "100%"]);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 18); rx.set(-py * 18);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -20 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: idx * 0.1 }}
      onAnimationComplete={() => setUnlocking(true)}
      style={{ perspective: 1000 }}
    >
      <motion.div
        onMouseMove={onMove} onMouseLeave={onLeave}
        style={{ rotateX: sRx, rotateY: sRy, transformStyle: "preserve-3d" }}
        className="relative corner-frame bg-card backdrop-blur-md p-5 overflow-hidden cursor-pointer"
      >
        <span className="c-bl" /><span className="c-br" />

        {unlocking && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }} animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute top-6 left-6 w-12 h-12 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
          />
        )}

        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: useTransform(glareX, (v) =>
              `linear-gradient(105deg, transparent 30%, oklch(1 0 0 / 0.12) ${v}, transparent 70%)`
            ),
          }}
        />

        <div className="flex items-start gap-4" style={{ transform: "translateZ(40px)" }}>
          <div
            className="relative w-16 h-16 grid place-items-center shrink-0"
            style={{
              clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
              background: `linear-gradient(135deg, ${color}, oklch(0.12 0.03 260))`,
              boxShadow: `0 0 20px ${color}88`,
            }}
          >
            <div className="absolute inset-[3px]"
              style={{
                clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
                background: "oklch(0.13 0.03 260)",
              }}
            />
            <span className="relative font-display text-3xl" style={{ color, textShadow: `0 0 12px ${color}` }}>
              {t.icon}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-widest px-1.5 py-0.5 border" style={{ color, borderColor: `${color}88` }}>{t.tier}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{t.date}</span>
            </div>
            <h3 className="font-display text-lg mt-2" style={{ color, textShadow: `0 0 12px ${color}66` }}>{t.title}</h3>
            <p className="text-sm text-foreground/75 mt-1.5 leading-relaxed">{t.desc}</p>

            <div className="mt-3 flex items-center justify-between pt-3 border-t border-border/60">
              <span className="font-mono text-[10px] text-muted-foreground">RARITY</span>
              <span className="font-mono text-[10px]" style={{ color }}>{t.rarity}</span>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
          viewport={{ once: true }} transition={{ duration: 1.4, delay: idx * 0.1 + 0.4 }}
          className="absolute bottom-0 left-0 right-0 h-[2px] origin-left"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        />
      </motion.div>
    </motion.div>
  );
}

export function Achievements() {
  return (
    <section className="min-h-screen px-6 md:px-16 pt-32 pb-32">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
          <div className="font-mono text-xs text-accent mb-2">▸ TROPHY_CASE.dlc</div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-glow">
            <span className="text-[var(--legendary)]" style={{ textShadow: "0 0 20px var(--legendary)" }}>★</span>
            {" "}ACHIEVEMENT{" "}
            <span className="text-accent text-glow-accent">VAULT</span>
            {" "}
            <span className="text-[var(--legendary)]" style={{ textShadow: "0 0 20px var(--legendary)" }}>★</span>
          </h2>
          <p className="font-mono text-xs text-muted-foreground mt-3">HACKATHONS · INTERNSHIPS · CERTIFICATIONS</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {TROPHIES.map((t, i) => <TrophyCard key={t.id} t={t} idx={i} />)}
        </div>
      </div>
    </section>
  );
}
