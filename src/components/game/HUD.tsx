import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface HUDProps {
  level: number;
  zone: string;
  onNav: (section: string) => void;
  active: string;
}

const ZONES = [
  { id: "character", label: "CHARACTER", key: "01" },
  { id: "quests", label: "QUESTS", key: "02" },
  { id: "skills", label: "SKILL TREE", key: "03" },
  { id: "achievements", label: "ACHIEVEMENTS", key: "04" },
  { id: "contact", label: "TRANSMIT", key: "05" },
];

export function HUD({ level, zone, onNav, active }: HUDProps) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* TOP BAR */}
      <div className="fixed top-0 inset-x-0 z-40 pointer-events-none">
        <div className="flex items-start justify-between p-4 md:p-6">
          {/* Player card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="pointer-events-auto corner-frame box-glow bg-card backdrop-blur-md px-4 py-3 min-w-[260px]"
          >
            <span className="c-bl" /><span className="c-br" />
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-primary to-accent grid place-items-center font-display font-black text-primary-foreground text-sm animate-pulse-glow">
                  AK
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-xs text-primary text-glow">PLAYER_01</span>
                  <span className="font-mono text-[10px] text-muted-foreground">LV.{level}</span>
                </div>
                <div className="mt-1 h-1.5 w-full bg-secondary/60 overflow-hidden rounded-full">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[var(--xp)] to-accent"
                    initial={{ width: 0 }} animate={{ width: "78%" }}
                    transition={{ duration: 1.6, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between mt-0.5 text-[9px] font-mono text-muted-foreground">
                  <span>XP 7,820 / 10,000</span>
                  <span>NEXT: LEGEND</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Zone + clock */}
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="pointer-events-auto text-right hidden md:block"
          >
            <div className="font-display text-xs text-muted-foreground">CURRENT ZONE</div>
            <div className="font-display text-lg text-primary text-glow tracking-widest animate-flicker">{zone}</div>
            <div className="font-mono text-[10px] text-muted-foreground mt-1">
              SYS // {time} // <span className="text-primary">ONLINE</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 inset-x-0 z-40 pointer-events-none">
        <div className="px-4 md:px-6 pb-4 md:pb-6 flex justify-center">
          <motion.nav
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pointer-events-auto corner-frame box-glow bg-card backdrop-blur-md flex items-stretch divide-x divide-border overflow-hidden"
          >
            <span className="c-bl" /><span className="c-br" />
            {ZONES.map((z) => {
              const isActive = active === z.id;
              return (
                <button
                  key={z.id}
                  onClick={() => onNav(z.id)}
                  className={`relative px-3 md:px-5 py-3 group transition-colors ${isActive ? "bg-primary/15" : "hover:bg-primary/5"}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[10px] ${isActive ? "text-accent" : "text-muted-foreground"}`}>[{z.key}]</span>
                    <span className={`font-display text-[11px] md:text-xs tracking-widest ${isActive ? "text-primary text-glow" : "text-foreground/80"}`}>
                      {z.label}
                    </span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 inset-x-2 h-[2px] bg-gradient-to-r from-primary via-accent to-primary"
                    />
                  )}
                </button>
              );
            })}
          </motion.nav>
        </div>
      </div>

      {/* CORNER TICKS */}
      <div className="fixed top-1/2 left-2 -translate-y-1/2 z-30 pointer-events-none hidden lg:block">
        <div className="flex flex-col gap-1">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className={`h-px ${i % 4 === 0 ? "w-4 bg-primary" : "w-2 bg-primary/40"}`} />
          ))}
        </div>
      </div>
      <div className="fixed top-1/2 right-2 -translate-y-1/2 z-30 pointer-events-none hidden lg:block">
        <div className="flex flex-col gap-1 items-end">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className={`h-px ${i % 4 === 0 ? "w-4 bg-accent" : "w-2 bg-accent/40"}`} />
          ))}
        </div>
      </div>
    </>
  );
}
