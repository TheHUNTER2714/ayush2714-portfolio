import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Mini Space-Invaders tribute (Ayush built one himself).
 * Each invader carries a FACT about Ayush — shoot them to "unlock" lore.
 */

type Invader = { id: number; x: number; y: number; alive: boolean; fact: string; label: string };
type Bullet = { id: number; x: number; y: number };

const FACTS: { label: string; fact: string }[] = [
  { label: "WHO",        fact: "Ayush Agnihotri — Full-Stack Developer, AI Enthusiast." },
  { label: "BASE",       fact: "Operating from Kanpur, India." },
  { label: "CLASS",      fact: "B.Tech CSE at REC Pratapgarh (2023 – 2027)." },
  { label: "PARTY",      fact: "Google Arcade Facilitator since April 2023." },
  { label: "QUEST",      fact: "Virtual interns @ JP Morgan & Tata Group." },
  { label: "PYTHON",     fact: "Python proficiency: 90% — IBM AI cert holder." },
  { label: "WEB",        fact: "HTML/CSS 92% · JavaScript 85% · Node.js 78%." },
  { label: "BUILDS",     fact: "Resume Builder · StudyCare AI · ChatCord · Space Invaders." },
  { label: "TROPHY",     fact: "🥇 1st @ AKTU AI Tech Guvi HCL Hackathon." },
  { label: "GITHUB",     fact: "Pair Extraordinaire · Pull Shark · YOLO · Quickdraw." },
  { label: "HOBBY",      fact: "Free Fire · Call of Duty · shipping side-projects." },
  { label: "SIGNAL",     fact: "ayushagnihotri165@gmail.com · +91 8429090075" },
];

const W = 560;
const H = 360;

export function MiniGame() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [shipX, setShipX] = useState(W / 2);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [invaders, setInvaders] = useState<Invader[]>([]);
  const [unlocked, setUnlocked] = useState<{ label: string; fact: string }[]>([]);
  const [popup, setPopup] = useState<{ label: string; fact: string } | null>(null);
  const [gameOver, setGameOver] = useState<null | "WIN" | "LOSE">(null);
  const keys = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const bulletId = useRef(0);

  const resetWave = useCallback(() => {
    const next: Invader[] = FACTS.map((f, i) => {
      const col = i % 6;
      const row = Math.floor(i / 6);
      return {
        id: i,
        x: 60 + col * 80,
        y: 40 + row * 56,
        alive: true,
        label: f.label,
        fact: f.fact,
      };
    });
    setInvaders(next);
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
      if (e.code === "Space") {
        e.preventDefault();
        setBullets((b) => [...b, { id: ++bulletId.current, x: shipX, y: H - 40 }]);
      }
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
  }, [running, shipX]);

  // game loop
  useEffect(() => {
    if (!running || gameOver) return;
    let raf = 0;
    let tick = 0;
    let dir = 1;
    let invSpeed = 0.4;

    const loop = () => {
      tick++;
      // ship move
      setShipX((x) => {
        const dx = (keys.current.right ? 4 : 0) - (keys.current.left ? 4 : 0);
        return Math.max(24, Math.min(W - 24, x + dx));
      });

      // invaders march
      setInvaders((inv) => {
        let edge = false;
        const moved = inv.map((i) => {
          if (!i.alive) return i;
          const nx = i.x + dir * invSpeed;
          if (nx < 30 || nx > W - 30) edge = true;
          return { ...i, x: nx };
        });
        if (edge) {
          dir = -dir;
          return moved.map((i) => (i.alive ? { ...i, y: i.y + 14 } : i));
        }
        return moved;
      });

      // bullets
      setBullets((bs) => bs.map((b) => ({ ...b, y: b.y - 7 })).filter((b) => b.y > -10));

      // collisions
      setInvaders((inv) => {
        let changed = false;
        setBullets((bs) => {
          const remaining: Bullet[] = [];
          for (const b of bs) {
            let hit = false;
            for (const i of inv) {
              if (!i.alive) continue;
              if (Math.abs(b.x - i.x) < 22 && Math.abs(b.y - i.y) < 16) {
                i.alive = false;
                hit = true;
                changed = true;
                setScore((s) => s + 100);
                setPopup({ label: i.label, fact: i.fact });
                setUnlocked((u) => (u.find((x) => x.label === i.label) ? u : [...u, { label: i.label, fact: i.fact }]));
                break;
              }
            }
            if (!hit) remaining.push(b);
          }
          return remaining;
        });
        return changed ? [...inv] : inv;
      });

      // lose if invaders reach bottom
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

      // win
      setInvaders((inv) => {
        if (inv.length && inv.every((i) => !i.alive)) {
          setGameOver("WIN");
          setRunning(false);
        }
        return inv;
      });

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, gameOver]);

  // auto-dismiss popup
  useEffect(() => {
    if (!popup) return;
    const t = setTimeout(() => setPopup(null), 2600);
    return () => clearTimeout(t);
  }, [popup]);

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
              invaders — each one drops a fact about me. Clear the wave to unlock the full bio.
            </p>
          </div>
          <div className="font-mono text-xs text-muted-foreground space-y-1">
            <div>CONTROLS: <span className="text-primary">← →</span> or <span className="text-primary">A · D</span></div>
            <div>FIRE: <span className="text-accent">SPACE</span></div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-5">
          {/* Cabinet */}
          <div className="corner-frame box-glow bg-card backdrop-blur-md p-4 relative">
            <span className="c-bl" /><span className="c-br" />
            {/* HUD */}
            <div className="flex items-center justify-between mb-3 font-mono text-[11px]">
              <span className="text-primary">SCORE <span className="text-foreground">{String(score).padStart(5, "0")}</span></span>
              <span className="text-accent">UNLOCKED {unlocked.length}/{FACTS.length}</span>
              <span className="text-[var(--hp)]">LIVES {"♥".repeat(Math.max(lives, 0))}</span>
            </div>

            <div
              ref={canvasRef}
              className="relative mx-auto overflow-hidden border border-primary/40"
              style={{
                width: "100%",
                maxWidth: W,
                aspectRatio: `${W} / ${H}`,
                background:
                  "radial-gradient(ellipse at center, oklch(0.16 0.04 260) 0%, oklch(0.09 0.03 260) 80%), repeating-linear-gradient(0deg, transparent 0 3px, oklch(1 0 0 / 0.03) 3px 4px)",
              }}
            >
              {/* viewport scaled to W/H coords via percentages */}
              <Stage
                shipX={shipX}
                bullets={bullets}
                invaders={invaders}
              />

              {/* Overlays */}
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
                    key={popup.label + popup.fact}
                    initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
                    className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-background/90 border border-accent text-[11px] font-mono text-accent max-w-[90%] text-center"
                  >
                    <span className="text-primary">[{popup.label}]</span> {popup.fact}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-3 text-center font-mono text-[10px] text-muted-foreground">
              ▸ TIP: clear all 12 invaders to read the full bio panel →
            </div>
          </div>

          {/* Lore log */}
          <div className="corner-frame bg-card backdrop-blur-md p-4 max-h-[520px] overflow-y-auto">
            <span className="c-bl" /><span className="c-br" />
            <div className="font-display text-xs tracking-widest text-primary text-glow mb-3">▸ LORE LOG</div>
            {unlocked.length === 0 && (
              <p className="font-mono text-[11px] text-muted-foreground">No entries yet. Start firing to decrypt bio fragments.</p>
            )}
            <ul className="space-y-2">
              {unlocked.map((u) => (
                <motion.li
                  key={u.label}
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  className="text-[11px] font-mono leading-relaxed"
                >
                  <span className="text-accent">[{u.label}]</span>{" "}
                  <span className="text-foreground/80">{u.fact}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stage({ shipX, bullets, invaders }: { shipX: number; bullets: Bullet[]; invaders: Invader[] }) {
  return (
    <div className="absolute inset-0">
      {/* ship */}
      <div
        className="absolute"
        style={{
          left: `${(shipX / W) * 100}%`,
          bottom: 14,
          transform: "translateX(-50%)",
        }}
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

      {/* bullets */}
      {bullets.map((b) => (
        <div
          key={b.id}
          className="absolute w-[2px] h-3 bg-accent"
          style={{
            left: `${(b.x / W) * 100}%`,
            top: `${(b.y / H) * 100}%`,
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 6px oklch(0.72 0.22 330)",
          }}
        />
      ))}

      {/* invaders */}
      {invaders.filter((i) => i.alive).map((i) => (
        <div
          key={i.id}
          className="absolute"
          style={{
            left: `${(i.x / W) * 100}%`,
            top: `${(i.y / H) * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
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
