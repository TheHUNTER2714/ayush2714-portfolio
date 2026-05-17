import { motion } from "framer-motion";
import { useState } from "react";

interface Node {
  id: string; label: string; x: number; y: number; level: number; max: number; unlocked: boolean; branch: "core" | "design" | "engine";
  connects: string[];
}

const NODES: Node[] = [
  { id: "n1", label: "PYTHON",       x: 50, y: 12, level: 5, max: 5, unlocked: true, branch: "core",   connects: ["n2", "n3"] },
  { id: "n2", label: "JAVASCRIPT",   x: 25, y: 30, level: 4, max: 5, unlocked: true, branch: "core",   connects: ["n4", "n5"] },
  { id: "n3", label: "C LANG",       x: 75, y: 30, level: 4, max: 5, unlocked: true, branch: "engine", connects: ["n6"] },
  { id: "n4", label: "HTML / CSS",   x: 12, y: 52, level: 5, max: 5, unlocked: true, branch: "design", connects: ["n7"] },
  { id: "n5", label: "NODE.JS",      x: 38, y: 52, level: 4, max: 5, unlocked: true, branch: "core",   connects: ["n7"] },
  { id: "n6", label: "NETWORKING",   x: 78, y: 52, level: 4, max: 5, unlocked: true, branch: "engine", connects: ["n8"] },
  { id: "n7", label: "AI / NLP",     x: 25, y: 74, level: 4, max: 5, unlocked: true, branch: "design", connects: ["n9"] },
  { id: "n8", label: "CYBER SEC",    x: 78, y: 74, level: 3, max: 5, unlocked: true, branch: "engine", connects: ["n9"] },
  { id: "n9", label: "FULL-STACK",   x: 50, y: 92, level: 5, max: 5, unlocked: true, branch: "core",   connects: [] },
];

const BRANCH_COLOR: Record<string, string> = {
  core: "var(--hud)",
  design: "var(--accent)",
  engine: "var(--xp)",
};

export function SkillTree() {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <section className="min-h-screen px-6 md:px-16 pt-32 pb-32">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="font-mono text-xs text-primary mb-2">▸ SKILL_TREE.bin // ALLOC 9/12</div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-glow">ABILITY <span className="text-accent text-glow-accent">MATRIX</span></h2>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
          <div className="relative corner-frame box-glow bg-card backdrop-blur-md aspect-[4/5] md:aspect-[5/4] overflow-hidden">
            <span className="c-bl" /><span className="c-br" />
            <div className="absolute inset-0 opacity-30"
              style={{ backgroundImage: "radial-gradient(circle at center, oklch(0.82 0.18 195 / 0.15), transparent 60%)" }} />

            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              {NODES.map((n) =>
                n.connects.map((cid) => {
                  const c = NODES.find((x) => x.id === cid)!;
                  const active = hover === n.id || hover === cid;
                  return (
                    <line
                      key={`${n.id}-${cid}`} x1={n.x} y1={n.y} x2={c.x} y2={c.y}
                      stroke={active ? "var(--hud)" : "oklch(0.82 0.18 195 / 0.35)"}
                      strokeWidth={active ? "0.4" : "0.2"}
                      strokeDasharray="1.5 1"
                    >
                      <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="3s" repeatCount="indefinite" />
                    </line>
                  );
                })
              )}
            </svg>

            {NODES.map((n, i) => {
              const color = BRANCH_COLOR[n.branch];
              const isHover = hover === n.id;
              return (
                <motion.button
                  key={n.id}
                  onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}
                  initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.06, type: "spring" }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                >
                  <div
                    className="relative w-12 h-12 md:w-14 md:h-14 grid place-items-center transition-transform group-hover:scale-110"
                    style={{
                      clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
                      background: `linear-gradient(135deg, ${color}, oklch(0.15 0.04 260))`,
                      boxShadow: isHover ? `0 0 24px ${color}` : `0 0 12px ${color}55`,
                    }}
                  >
                    <div className="absolute inset-[3px]"
                      style={{
                        clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
                        background: "oklch(0.13 0.03 260)",
                      }}
                    />
                    <span className="relative font-display font-bold text-xs" style={{ color }}>{n.level}</span>
                  </div>
                  <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap font-mono text-[10px] transition-opacity ${isHover ? "opacity-100" : "opacity-60"}`} style={{ color }}>
                    {n.label}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            {(["core", "design", "engine"] as const).map((b, i) => (
              <motion.div
                key={b}
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="corner-frame bg-card backdrop-blur-md p-4"
              >
                <span className="c-bl" /><span className="c-br" />
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2" style={{ background: BRANCH_COLOR[b] }} />
                  <h4 className="font-display text-xs tracking-widest" style={{ color: BRANCH_COLOR[b] }}>{b.toUpperCase()} BRANCH</h4>
                </div>
                <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
                  {b === "core" && "Foundation runtime — type-safe, composable, shippable."}
                  {b === "design" && "Visual systems — motion, color, 3D, interaction."}
                  {b === "engine" && "Performance edge — data, compute, distribution."}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
