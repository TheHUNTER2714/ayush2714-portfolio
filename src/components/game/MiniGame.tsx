import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sfx } from "./sfx";
import { gameBus } from "./gameState";

/**
 * Mini Space-Invaders tribute (Ayush built one himself).
 * Each invader carries a FACT about Ayush, sourced from his README — shoot
 * them to decrypt lore fragments into the LORE LOG.
 *
 * Features:
 *  - localStorage save/resume (score, lives, unlocked facts, high score, runs)
 *  - WebAudio synth SFX (fire, hit, unlock, start, win, lose, typewriter)
 *  - Typewriter reveal of facts + popup
 *  - Quest summary panel with progress + share/export
 *  - Live background sync via gameBus (hue/energy/pulse on hit)
 */

type Invader = { id: number; x: number; y: number; alive: boolean; fact: string; label: string; source: string };
type Bullet = { id: number; x: number; y: number };
type Unlock = { label: string; fact: string; source: string; at: number };

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
const SAVE_KEY = "ayush.arcade.v1";

type SaveState = {
  unlocked: Unlock[];
  highScore: number;
  runs: number;
  lastScore: number;
  muted: boolean;
};

const defaultSave: SaveState = { unlocked: [], highScore: 0, runs: 0, lastScore: 0, muted: false };

function loadSave(): SaveState {
  if (typeof window === "undefined") return defaultSave;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultSave;
    return { ...defaultSave, ...JSON.parse(raw) };
  } catch { return defaultSave; }
}
function writeSave(s: SaveState) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch {}
}

export function MiniGame() {
  const [save, setSave] = useState<SaveState>(defaultSave);
  const [hydrated, setHydrated] = useState(false);

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [shipX, setShipX] = useState(W / 2);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [invaders, setInvaders] = useState<Invader[]>([]);
  const [popup, setPopup] = useState<Unlock | null>(null);
  const [gameOver, setGameOver] = useState<null | "WIN" | "LOSE">(null);
  const keys = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const bulletId = useRef(0);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const s = loadSave();
    setSave(s);
    sfx.setMuted(s.muted);
    setHydrated(true);
  }, []);

  const persist = useCallback((patch: Partial<SaveState>) => {
    setSave((prev) => {
      const next = { ...prev, ...patch };
      writeSave(next);
      return next;
    });
  }, []);

  const unlocked = save.unlocked;
  const progress = unlocked.length / FACTS.length;

  // Sync background energy/hue while playing
  useEffect(() => {
    if (running && !paused) {
      gameBus.set({ energy: 0.85, hue: 330 });
    } else {
      gameBus.set({ energy: 0.4 });
    }
  }, [running, paused]);

  const fire = useCallback(() => {
    setBullets((b) => [...b, { id: ++bulletId.current, x: shipX, y: H - 40 }]);
    sfx.fire();
  }, [shipX]);

  const resetWave = useCallback((preserveUnlocked: boolean) => {
    setInvaders(
      FACTS.map((f, i) => {
        const col = i % 6;
        const row = Math.floor(i / 6);
        // Skip already-unlocked facts (resume mode)
        const alive = preserveUnlocked ? !save.unlocked.find((u) => u.label === f.label) : true;
        return { id: i, x: 60 + col * 80, y: 40 + row * 56, alive, label: f.label, fact: f.fact, source: f.source };
      })
    );
    setBullets([]);
    setShipX(W / 2);
  }, [save.unlocked]);

  const start = (resume: boolean) => {
    sfx.resume(); sfx.start();
    setScore(resume ? save.lastScore : 0);
    setLives(3);
    setPopup(null);
    setGameOver(null);
    setPaused(false);
    resetWave(resume);
    setRunning(true);
    persist({ runs: save.runs + 1 });
  };

  const resetSave = () => {
    if (typeof window !== "undefined" && !confirm("Erase saved arcade progress?")) return;
    const fresh = { ...defaultSave, muted: save.muted };
    writeSave(fresh);
    setSave(fresh);
    sfx.ui();
  };

  const toggleMute = () => {
    const m = !save.muted;
    sfx.setMuted(m); persist({ muted: m }); if (!m) sfx.ui();
  };

  // keyboard
  useEffect(() => {
    if (!running) return;
    const down = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") keys.current.left = true;
      if (e.code === "ArrowRight" || e.code === "KeyD") keys.current.right = true;
      if (e.code === "Space") { e.preventDefault(); if (!paused) fire(); }
      if (e.code === "KeyP" || e.code === "Escape") { setPaused((p) => !p); sfx.ui(); }
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
  }, [running, paused, fire]);

  // game loop
  useEffect(() => {
    if (!running || gameOver || paused) return;
    let raf = 0;
    let dir = 1;
    const invSpeed = 0.5;

    const loop = () => {
      setShipX((x) => {
        const dx = (keys.current.right ? 4.5 : 0) - (keys.current.left ? 4.5 : 0);
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

      setBullets((bs) => bs.map((b) => ({ ...b, y: b.y - 7.5 })).filter((b) => b.y > -10));

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
                sfx.hit();
                gameBus.pulse();
                setScore((s) => s + 100);
                const entry: Unlock = { label: i.label, fact: i.fact, source: i.source, at: Date.now() };
                setPopup(entry);
                setSave((prev) => {
                  if (prev.unlocked.find((u) => u.label === entry.label)) return prev;
                  sfx.unlock();
                  const next = { ...prev, unlocked: [...prev.unlocked, entry] };
                  writeSave(next);
                  return next;
                });
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
            if (nl <= 0) {
              setGameOver("LOSE"); setRunning(false); sfx.lose();
              setScore((sc) => { persist({ lastScore: sc, highScore: Math.max(save.highScore, sc) }); return sc; });
            }
            return nl;
          });
          return inv.map((i) => (i.alive ? { ...i, y: 40 + Math.floor(i.id / 6) * 56 } : i));
        }
        return inv;
      });

      setInvaders((inv) => {
        if (inv.length && inv.every((i) => !i.alive)) {
          setGameOver("WIN"); setRunning(false); sfx.win();
          setScore((sc) => { persist({ lastScore: sc, highScore: Math.max(save.highScore, sc) }); return sc; });
        }
        return inv;
      });

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, gameOver, paused, persist, save.highScore]);

  useEffect(() => {
    if (!popup) return;
    const t = setTimeout(() => setPopup(null), 3000);
    return () => clearTimeout(t);
  }, [popup]);

  // touch handlers
  const touchHold = (side: "left" | "right", on: boolean) => () => { keys.current[side] = on; };

  const exportLog = () => {
    const text = unlocked.map((u) => `[${u.label}] ${u.fact}  (${u.source})`).join("\n");
    const blob = new Blob([`Ayush Agnihotri — Arcade Lore Log\nUnlocked ${unlocked.length}/${FACTS.length}\n\n${text}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "ayush-lore.txt"; a.click();
    URL.revokeObjectURL(url); sfx.ui();
  };

  const remaining = useMemo(() => FACTS.filter((f) => !unlocked.find((u) => u.label === f.label)), [unlocked]);
  const canResume = hydrated && unlocked.length > 0 && unlocked.length < FACTS.length;

  return (
    <section className="min-h-screen px-6 md:px-16 pt-32 pb-32">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-8 flex items-end justify-between flex-wrap gap-4"
        >
          <div>
            <div className="font-mono text-xs text-accent mb-2 animate-flicker">▸ ARCADE.exe — PLAYABLE LORE · AUTOSAVE ON</div>
            <h2 className="font-display font-black text-4xl md:text-6xl text-glow">
              KNOW <span className="text-accent text-glow-accent">AYUSH</span> // ARCADE
            </h2>
            <p className="mt-3 text-foreground/75 max-w-xl text-sm leading-relaxed">
              Tribute to my own <span className="text-primary">Space Invaders</span> build. Shoot the
              invaders — each drops a fact pulled from my README. Your progress saves automatically and the live background reacts to every hit.
            </p>
          </div>
          <div className="font-mono text-xs text-muted-foreground space-y-1 text-right">
            <div>KEYS: <span className="text-primary">← →</span> · <span className="text-primary">A · D</span></div>
            <div>FIRE: <span className="text-accent">SPACE</span> · PAUSE: <span className="text-accent">P</span></div>
            <button onClick={toggleMute} className="text-[10px] text-primary hover:text-accent transition-colors">
              {save.muted ? "🔇 SOUND OFF" : "🔊 SOUND ON"} — click to toggle
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-5">
          {/* Cabinet */}
          <div className="corner-frame box-glow bg-card backdrop-blur-md p-4 relative">
            <span className="c-bl" /><span className="c-br" />
            <div className="flex items-center justify-between mb-3 font-mono text-[11px] flex-wrap gap-2">
              <span className="text-primary">SCORE <span className="text-foreground">{String(score).padStart(5, "0")}</span></span>
              <span className="text-[var(--legendary)]">HI <span className="text-foreground">{String(save.highScore).padStart(5, "0")}</span></span>
              <span className="text-accent">UNLOCKED {unlocked.length}/{FACTS.length}</span>
              <span className="text-[var(--hp)]">LIVES {"♥".repeat(Math.max(lives, 0))}</span>
            </div>

            {/* Progress bar */}
            <div className="relative h-1.5 bg-primary/15 mb-3 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0"
                style={{ background: "linear-gradient(90deg, oklch(0.7 0.22 195), oklch(0.72 0.22 330))", boxShadow: "0 0 10px oklch(0.72 0.22 330)" }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 18 }}
              />
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
                {paused && running && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur-sm"
                  >
                    <div className="text-center">
                      <div className="font-display text-3xl text-accent text-glow-accent">▌▌ PAUSED</div>
                      <button onClick={() => { setPaused(false); sfx.ui(); }} className="mt-3 text-xs font-mono text-primary hover:text-accent">▸ RESUME (P)</button>
                    </div>
                  </motion.div>
                )}

                {!running && !gameOver && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur-sm"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <button
                        onClick={() => start(false)}
                        className="corner-frame px-6 py-3 bg-primary/10 border border-primary text-primary font-display tracking-widest text-glow hover:bg-primary/20 transition-colors"
                      >
                        <span className="c-bl" /><span className="c-br" />
                        ▸ INSERT COIN — NEW RUN
                      </button>
                      {canResume && (
                        <button
                          onClick={() => start(true)}
                          className="corner-frame px-5 py-2 bg-accent/10 border border-accent text-accent font-mono text-xs tracking-widest hover:bg-accent/20 transition-colors"
                        >
                          <span className="c-bl" /><span className="c-br" />
                          ▸ RESUME · {unlocked.length}/{FACTS.length} UNLOCKED
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {gameOver && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 grid place-items-center bg-background/85 backdrop-blur-sm text-center px-4"
                  >
                    <div>
                      <motion.div
                        initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        className={`font-display text-3xl md:text-4xl ${gameOver === "WIN" ? "text-[var(--legendary)]" : "text-[var(--hp)]"}`}
                        style={{ textShadow: "0 0 18px currentColor" }}
                      >
                        {gameOver === "WIN" ? "★ FULL LORE UNLOCKED ★" : "GAME OVER"}
                      </motion.div>
                      <div className="font-mono text-xs text-muted-foreground mt-3">
                        SCORE {score} · HI {save.highScore} · UNLOCKED {unlocked.length}/{FACTS.length} · RUNS {save.runs}
                      </div>
                      <div className="mt-5 flex gap-2 justify-center flex-wrap">
                        <button onClick={() => start(unlocked.length < FACTS.length)} className="corner-frame px-5 py-2 bg-accent/10 border border-accent text-accent font-display tracking-widest hover:bg-accent/20 transition-colors">
                          <span className="c-bl" /><span className="c-br" />
                          ▸ {unlocked.length < FACTS.length ? "CONTINUE" : "PLAY AGAIN"}
                        </button>
                        {unlocked.length > 0 && (
                          <button onClick={exportLog} className="corner-frame px-5 py-2 bg-primary/10 border border-primary text-primary font-display tracking-widest hover:bg-primary/20 transition-colors">
                            <span className="c-bl" /><span className="c-br" />
                            ▸ EXPORT LOG
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {popup && (
                  <motion.div
                    key={popup.label + popup.at}
                    initial={{ y: -20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-background/90 border border-accent text-[11px] font-mono text-accent max-w-[92%] text-center shadow-[0_0_20px_oklch(0.72_0.22_330/0.5)]"
                  >
                    <Typewriter label={popup.label} text={popup.fact} sound />
                    <div className="text-[9px] text-primary/80 mt-1 tracking-widest">▸ {popup.source}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Touch controls */}
            <div className="mt-4 flex items-center justify-center gap-3 select-none">
              <TouchBtn onStart={touchHold("left", true)} onEnd={touchHold("left", false)} disabled={!running || paused} label="◀" />
              <TouchBtn onStart={touchHold("right", true)} onEnd={touchHold("right", false)} disabled={!running || paused} label="▶" />
              <button
                onClick={() => running && !paused && fire()}
                disabled={!running || paused}
                className="corner-frame px-6 py-2 bg-accent/15 border border-accent text-accent font-display tracking-widest disabled:opacity-40 active:scale-95 transition-transform"
              >
                <span className="c-bl" /><span className="c-br" />
                ▸ FIRE
              </button>
              {running && (
                <button onClick={() => { setPaused((p) => !p); sfx.ui(); }} className="corner-frame px-4 py-2 bg-primary/10 border border-primary text-primary font-mono text-xs">
                  <span className="c-bl" /><span className="c-br" />
                  {paused ? "▶ PLAY" : "▌▌ PAUSE"}
                </button>
              )}
            </div>

            <div className="mt-2 text-center font-mono text-[10px] text-muted-foreground">
              ▸ Progress autosaves — close the tab and resume any time.
            </div>
          </div>

          {/* Quest summary + Lore log */}
          <div className="space-y-4">
            <div className="corner-frame bg-card backdrop-blur-md p-4">
              <span className="c-bl" /><span className="c-br" />
              <div className="font-display text-xs tracking-widest text-accent text-glow-accent mb-3">▸ QUEST SUMMARY</div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                <Stat label="HI-SCORE" value={String(save.highScore).padStart(5, "0")} hue="var(--legendary)" />
                <Stat label="LAST" value={String(save.lastScore).padStart(5, "0")} hue="var(--primary)" />
                <Stat label="RUNS" value={String(save.runs)} hue="var(--accent)" />
                <Stat label="COMPLETE" value={`${Math.round(progress * 100)}%`} hue="var(--xp)" />
              </div>
              {remaining.length > 0 && (
                <div className="mt-3 pt-3 border-t border-primary/20">
                  <div className="font-mono text-[10px] text-muted-foreground mb-1.5">REMAINING TARGETS</div>
                  <div className="flex flex-wrap gap-1">
                    {remaining.map((r) => (
                      <span key={r.label} className="font-mono text-[9px] px-1.5 py-0.5 border border-primary/30 text-primary/80">{r.label}</span>
                    ))}
                  </div>
                </div>
              )}
              {unlocked.length > 0 && (
                <div className="mt-3 pt-3 border-t border-primary/20 flex gap-2">
                  <button onClick={exportLog} className="text-[10px] font-mono text-accent hover:text-primary transition-colors">▸ EXPORT</button>
                  <button onClick={resetSave} className="text-[10px] font-mono text-[var(--hp)] hover:text-accent transition-colors ml-auto">▸ RESET SAVE</button>
                </div>
              )}
            </div>

            <div className="corner-frame bg-card backdrop-blur-md p-4 max-h-[420px] overflow-y-auto">
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
                  {unlocked.map((u) => (
                    <motion.li
                      key={u.label}
                      layout
                      initial={{ opacity: 0, x: 14, filter: "blur(4px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.35 }}
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
      </div>
    </section>
  );
}

function Stat({ label, value, hue }: { label: string; value: string; hue: string }) {
  return (
    <div className="border border-primary/20 px-2 py-1.5">
      <div className="text-[9px] text-muted-foreground tracking-widest">{label}</div>
      <div className="font-display text-base" style={{ color: hue, textShadow: `0 0 8px ${hue}` }}>{value}</div>
    </div>
  );
}

function Typewriter({ label, text, sound }: { label: string; text: string; sound?: boolean }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    setShown(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(i);
      if (sound && i % 2 === 0) sfx.type();
      if (i >= text.length) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, [text, sound]);
  return (
    <span>
      <span className="text-primary">[{label}]</span>{" "}
      <span className="text-accent">{text.slice(0, shown)}</span>
      <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.7, repeat: Infinity }} className="text-accent">▍</motion.span>
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
      <div className="absolute" style={{ left: `${(shipX / W) * 100}%`, bottom: 14, transform: "translateX(-50%)" }}>
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
            className="relative w-9 h-6 grid place-items-center animate-pulse"
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
