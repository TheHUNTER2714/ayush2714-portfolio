import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Mini Space-Invaders tribute (Ayush built one himself).
 * Each invader carries a FACT about Ayush, sourced from his README — shoot
 * them to decrypt lore fragments into the LORE LOG.
 */

type Invader = { id: number; x: number; y: number; alive: boolean; fact: string; label: string; source: string };
type Bullet = { id: number; x: number; y: number };

const FACTS: { label: string; fact: string; source: string }[] = [
  { label: "WHO",     fact: "Ayush Agnihotri — Full-Stack Developer & AI Enthusiast.",     source: "README › About" },
  { label: "BASE",    fact: "Operating from Kanpur, India.",                                source: "README › Contact" },
  { label: "CLASS",   fact: "B.Tech CSE @ REC Pratapgarh (2023 – 2027).",                   source: "README › Education" },
  { label: "PARTY",   fact: "Google Arcade Facilitator since April 2023.",                  source: "README › Experience" },
  { label: "QUEST",   fact: "Virtual interns @ JP Morgan & Tata Group.",                    source: "README › Experience" },
  { label: "PYTHON",  fact: "Python proficiency 90% — IBM AI certified.",                   source: "README › Skills" },
  { label: "WEB",     fact: "HTML/CSS 92% · JavaScript 85% · Node.js 78%.",                 source: "README › Skills" },
  { label: "BUILDS",  fact: "Resume Builder · StudyCare AI · ChatCord · Space Invaders.",   source: "README › Projects" },
  { label: "TROPHY",  fact: "🥇 1st @ AKTU AI Tech Guvi HCL Hackathon.",                     source: "README › Achievements" },
  { label: "GITHUB",  fact: "Pair Extraordinaire · Pull Shark · YOLO · Quickdraw.",         source: "README › Achievements" },
  { label: "HOBBY",   fact: "Free Fire · Call of Duty · shipping side-projects.",           source: "README › About" },
  { label: "SIGNAL",  fact: "ayushagnihotri165@gmail.com · +91 8429090075",                 source: "README › Contact" },
];

const W = 560;
const H = 360;

export function MiniGame() {
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [shipX, setShipX] = useState(W / 2);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [invaders, setInvaders] = useState<Invader[]>([]);
  const [unlocked, setUnlocked] = useState<{ label: string; fact: string; source: string }[]>([]);
  const [popup, setPopup] = useState<{ label: string; fact: string; source: string } | null>(null);
  const [gameOver, setGameOver] = useState<null | "WIN" | "LOSE">(null);
  const keys = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const bulletId = useRef(0);

  const fire = useCallback(() => {
    setBullets((b) => [...b, { id: ++bulletId.current, x: shipX, y: H - 40 }]);
  }, [shipX]);

  const resetWave = useCallback(() => {
    setInvaders(
      FACTS.map((f, i) => {
        const col = i % 6;
        const row = Math.floor(i / 6);
        return { id: i, x: 60 + col * 80, y: 40 + row * 56, alive: true, label: f.label, fact: f.fact, source: f.source };
      })
    );
    setBullets([]);
    setShipX(W / 2);
  }, []);

  const start = () => {
    setScore(0);
    setLives(3);
    setUnlocked([]);
    setPopup(null);
    setGameOver(null);
    resetWave();
    setRunning(true);
  };

  // keyboard
  useEffect(() => {
    if (!running) return;
    const down = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") keys.current.left = true;
      if (e.code === "ArrowRight" || e.code === "KeyD") keys.current.right = true;
      if (e.code === "Space") { e.preventDefault(); fire(); }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") keys.current.left = false;
      if (e.code === "ArrowRight" || e.code === "KeyD") keys.current.right = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [running, fire]);

  // game loop
  useEffect(() => {
    if (!running || gameOver) return;
    let raf = 0;
    let dir = 1;
    const invSpeed = 0.4;

    const loop = () => {
      setShipX((x) => {
        const dx = (keys.current.right ? 4 : 0) - (keys.current.left ? 4 : 0);
        return Math.max(24, Math.min(W - 24, x + dx));
      });

      setInvaders((inv) => {
        let edge = false;
        const moved = inv.map((i) => {
          if (!i.alive) return i;
          const nx = i.x + dir * invSpeed;
          if (nx < 30 || nx > W - 30) edge = true;
          return { ...i, x: nx };
        });
        if (edge) { dir = -dir; return moved.map((i) => (i.alive ? { ...i, y: i.y + 14 } : i)); }
        return moved;
      });

      setBullets((bs) => bs.map((b) => ({ ...b, y: b.y - 7 })).filter((b) => b.y > -10));

      setInvaders((inv) => {
        let changed = false;
        setBullets((bs) => {
          const remaining: Bullet[] = [];
          for (const b of bs) {
            let hit = false;
            for (const i of inv) {
              if (!i.alive) continue;
              if (Math.abs(b.x - i.x) < 22 && Math.abs(b.y - i.y) < 16) {
                i.alive = false; hit = true; changed = true;
                setScore((s) => s + 100);
                setPopup({ label: i.label, fact: i.fact, source: i.source });
                setUnlocked((u) => (u.find((x) => x.label === i.label) ? u : [...u, { label: i.label, fact: i.fact, source: i.source }]));
                break;
              }
            }
            if (!hit) remaining.push(b);
          }
          return remaining;
        });
        return changed ? [...inv] : inv;
      });

      setInvaders((inv) => {
        if (inv.some((i) => i.alive && i.y > H - 50)) {
          setLives((l) => {
            const nl = l - 1;
            if (nl <= 0) { setGameOver("LOSE"); setRunning(false); }
            return nl;
          });
          return inv.map((i) => (i.alive ? { ...i, y: 40 + Math.floor(i.id / 6) * 56 } : i));
        }
        return inv;
      });

      setInvaders((inv) => {
        if (inv.length && inv.every((i) => !i.alive)) { setGameOver("WIN"); setRunning(false); }
        return inv;
      });

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, gameOver]);

  useEffect(() => {
    if (!popup) return;
    const t = setTimeout(() => setPopup(null), 2800);
    return () => clearTimeout(t);
  }, [popup]);

  // touch handlers
  const touchHold = (side: "left" | "right", on: boolean) => () => { keys.current[side] = on; };

  return (
    <section className="min-h-screen px-6 md:px-16 pt-32 pb-32">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-8 flex items-end justify-between flex-wrap gap-4"
        >
          <div>
            <div className="font-mono text-xs text-accent mb-2 animate-flicker">▸ ARCADE.exe — PLAYABLE LORE</div>
            <h2 className="font-display font-black text-4xl md:text-6xl text-glow">
              KNOW <span className="text-accent text-glow-accent">AYUSH</span> // ARCADE
            </h2>
            <p className="mt-3 text-foreground/75 max-w-xl text-sm leading-relaxed">
              Tribute to my own <span className="text-primary">Space Invaders</span> build. Shoot the
              invaders — each drops a fact pulled straight from my README. Clear the wave to decrypt the full bio.
            </p>
          </div>
          <div className="font-mono text-xs text-muted-foreground space-y-1">
            <div>KEYS: <span className="text-primary">← →</span> or <span className="text-primary">A · D</span></div>
            <div>FIRE: <span className="text-accent">SPACE</span></div>
            <div className="text-[10px] text-muted-foreground/70">On touch? Use the pad below ↓</div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-5">
          {/* Cabinet */}
          <div className="corner-frame box-glow bg-card backdrop-blur-md p-4 relative">
            <span className="c-bl" /><span className="c-br" />
            <div className="flex items-center justify-between mb-3 font-mono text-[11px]">
              <span className="text-primary">SCORE <span className="text-foreground">{String(score).padStart(5, "0")}</span></span>
              <span className="text-accent">UNLOCKED {unlocked.length}/{FACTS.length}</span>
              <span className="text-[var(--hp)]">LIVES {"♥".repeat(Math.max(lives, 0))}</span>
            </div>

            <div
              className="relative mx-auto overflow-hidden border border-primary/40"
              style={{
                width: "100%", maxWidth: W, aspectRatio: `${W} / ${H}`,
                background:
                  "radial-gradient(ellipse at center, oklch(0.16 0.04 260) 0%, oklch(0.09 0.03 260) 80%), repeating-linear-gradient(0deg, transparent 0 3px, oklch(1 0 0 / 0.03) 3px 4px)",
              }}
            >
              <Stage shipX={shipX} bullets={bullets} invaders={invaders} />

              <AnimatePresence>
                {!running && !gameOver && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur-sm"
                  >
                    <button
                      onClick={start}
                      className="corner-frame px-6 py-3 bg-primary/10 border border-primary text-primary font-display tracking-widest text-glow hover:bg-primary/20 transition-colors"
                    >
                      <span className="c-bl" /><span className="c-br" />
                      ▸ INSERT COIN — START
                    </button>
                  </motion.div>
                )}
                {gameOver && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute inset-0 grid place-items-center bg-background/80 backdrop-blur-sm text-center px-4"
                  >
                    <div>
                      <div className={`font-display text-3xl md:text-4xl ${gameOver === "WIN" ? "text-[var(--legendary)]" : "text-[var(--hp)]"}`} style={{ textShadow: "0 0 18px currentColor" }}>
                        {gameOver === "WIN" ? "★ FULL LORE UNLOCKED ★" : "GAME OVER"}
                      </div>
                      <div className="font-mono text-xs text-muted-foreground mt-3">SCORE {score} · UNLOCKED {unlocked.length}/{FACTS.length}</div>
                      <button
                        onClick={start}
                        className="mt-5 corner-frame px-5 py-2 bg-accent/10 border border-accent text-accent font-display tracking-widest hover:bg-accent/20 transition-colors"
                      >
                        <span className="c-bl" /><span className="c-br" />
                        ▸ PLAY AGAIN
                      </button>
                    </div>
                  </motion.div>
                )}

                {popup && (
                  <motion.div
                    key={popup.label}
                    initial={{ y: -20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-background/90 border border-accent text-[11px] font-mono text-accent max-w-[92%] text-center"
                  >
                    <AnimatedText label={popup.label} text={popup.fact} />
                    <div className="text-[9px] text-primary/80 mt-1 tracking-widest">▸ {popup.source}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Touch controls */}
            <div className="mt-4 flex items-center justify-center gap-3 select-none">
              <TouchBtn
                onStart={touchHold("left", true)} onEnd={touchHold("left", false)}
                disabled={!running} label="◀"
              />
              <TouchBtn
                onStart={touchHold("right", true)} onEnd={touchHold("right", false)}
                disabled={!running} label="▶"
              />
              <button
                onClick={() => running && fire()}
                disabled={!running}
                className="corner-frame px-6 py-2 bg-accent/15 border border-accent text-accent font-display tracking-widest disabled:opacity-40 active:scale-95 transition-transform"
              >
                <span className="c-bl" /><span className="c-br" />
                ▸ FIRE
              </button>
            </div>

            <div className="mt-2 text-center font-mono text-[10px] text-muted-foreground">
              ▸ TIP: clear all 12 invaders to fully decrypt the bio →
            </div>
          </div>

          {/* Lore log */}
          <div className="corner-frame bg-card backdrop-blur-md p-4 max-h-[560px] overflow-y-auto">
            <span className="c-bl" /><span className="c-br" />
            <div className="flex items-center justify-between mb-3">
              <div className="font-display text-xs tracking-widest text-primary text-glow">▸ LORE LOG</div>
              <div className="font-mono text-[10px] text-accent">{unlocked.length}/{FACTS.length}</div>
            </div>
            {unlocked.length === 0 && (
              <p className="font-mono text-[11px] text-muted-foreground">No entries yet. Fire on an invader to decrypt a bio fragment from the README.</p>
            )}
            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {unlocked.map((u, idx) => (
                  <motion.li
                    key={u.label}
                    layout
                    initial={{ opacity: 0, x: 14, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.35, delay: idx === unlocked.length - 1 ? 0 : 0 }}
                    className="text-[11px] font-mono leading-relaxed border-l border-accent/40 pl-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-accent">[{u.label}]</span>
                      <span className="text-primary/70 text-[9px] tracking-widest">▸ {u.source}</span>
                    </div>
                    <span className="text-foreground/85">{u.fact}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnimatedText({ label, text }: { label: string; text: string }) {
  // letter-stagger reveal for the popup fact
  const chars = text.split("");
  return (
    <span>
      <span className="text-primary">[{label}]</span>{" "}
      {chars.map((c, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.012, duration: 0.18 }}
        >
          {c}
        </motion.span>
      ))}
    </span>
  );
}

function TouchBtn({
  onStart, onEnd, label, disabled,
}: { onStart: () => void; onEnd: () => void; label: string; disabled?: boolean }) {
  return (
    <button
      disabled={disabled}
      onPointerDown={(e) => { e.preventDefault(); onStart(); }}
      onPointerUp={onEnd}
      onPointerLeave={onEnd}
      onPointerCancel={onEnd}
      className="corner-frame w-14 h-12 grid place-items-center bg-primary/10 border border-primary text-primary font-display text-xl disabled:opacity-40 active:scale-95 transition-transform touch-none"
    >
      <span className="c-bl" /><span className="c-br" />
      {label}
    </button>
  );
}

function Stage({ shipX, bullets, invaders }: { shipX: number; bullets: Bullet[]; invaders: Invader[] }) {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute"
        style={{ left: `${(shipX / W) * 100}%`, bottom: 14, transform: "translateX(-50%)" }}
      >
        <div
          className="w-8 h-4"
          style={{
            background: "linear-gradient(180deg, oklch(0.82 0.18 195), oklch(0.5 0.18 195))",
            clipPath: "polygon(50% 0, 100% 60%, 100% 100%, 0 100%, 0 60%)",
            boxShadow: "0 0 12px oklch(0.82 0.18 195)",
          }}
        />
      </div>

      {bullets.map((b) => (
        <div
          key={b.id}
          className="absolute w-[2px] h-3 bg-accent"
          style={{
            left: `${(b.x / W) * 100}%`, top: `${(b.y / H) * 100}%`,
            transform: "translate(-50%, -50%)", boxShadow: "0 0 6px oklch(0.72 0.22 330)",
          }}
        />
      ))}

      {invaders.filter((i) => i.alive).map((i) => (
        <div
          key={i.id}
          className="absolute"
          style={{ left: `${(i.x / W) * 100}%`, top: `${(i.y / H) * 100}%`, transform: "translate(-50%, -50%)" }}
        >
          <div
            className="relative w-9 h-6 grid place-items-center"
            style={{
              background: "oklch(0.72 0.22 330 / 0.15)",
              border: "1px solid oklch(0.72 0.22 330)",
              boxShadow: "0 0 8px oklch(0.72 0.22 330 / 0.6)",
              clipPath: "polygon(15% 0, 85% 0, 100% 50%, 85% 100%, 15% 100%, 0 50%)",
            }}
          >
            <span className="font-mono text-[8px] text-accent">{i.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
