import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";

/**
 * Cinematic split-door overlay between BootScreen and the live experience.
 * A multi-stage Phoenix sigil reveal precedes the door split:
 *  1. Sigil materializes from sparks with a shockwave ring
 *  2. Charges up with orbiting plasma + scanning beams
 *  3. Ignition flash → doors split, sigil dissolves into embers
 */
export function SplitDoor({ open }: { open: boolean }) {
  return (
    <AnimatePresence>
      {!open ? (
        <motion.div
          key="seam"
          className="fixed inset-0 z-[111] pointer-events-none grid place-items-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* radial vignette pulse */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0.4] }}
            transition={{ duration: 1.5, times: [0, 0.4, 1] }}
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, oklch(0.82 0.18 40 / 0.25), transparent 70%)",
            }}
          />

          {/* expanding shockwave rings */}
          {[0, 0.35, 0.7].map((delay, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border"
              style={{
                borderColor: "oklch(0.85 0.22 40 / 0.6)",
                width: 80,
                height: 80,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 8], opacity: [0.9, 0] }}
              transition={{ duration: 1.8, delay, ease: "easeOut", repeat: Infinity, repeatDelay: 0.4 }}
            />
          ))}

          {/* spark particles converging into sigil */}
          {Array.from({ length: 18 }).map((_, i) => {
            const angle = (i / 18) * Math.PI * 2;
            const r = 260;
            return (
              <motion.span
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[#fde68a]"
                style={{ boxShadow: "0 0 8px #fbbf24" }}
                initial={{
                  x: Math.cos(angle) * r,
                  y: Math.sin(angle) * r,
                  opacity: 0,
                  scale: 0.4,
                }}
                animate={{ x: 0, y: 0, opacity: [0, 1, 0], scale: [0.4, 1.6, 0.2] }}
                transition={{ duration: 1.4, delay: 0.05 + (i % 6) * 0.05, ease: "easeIn" }}
              />
            );
          })}

          {/* laser seam */}
          <motion.div
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px]"
            style={{
              background:
                "linear-gradient(180deg, transparent, oklch(0.95 0.18 195) 30%, oklch(0.78 0.28 330) 70%, transparent)",
              boxShadow: "0 0 24px oklch(0.82 0.18 195 / 0.9)",
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
          />

          {/* Centered animated Logo crest — multi-stage reveal */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0, filter: "blur(20px)", rotate: -30 }}
            animate={{
              scale: [0.2, 1.15, 1, 1.05, 1.7],
              opacity: [0, 1, 1, 1, 0],
              filter: ["blur(20px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(10px)"],
              rotate: [-30, 0, 0, 0, 8],
            }}
            transition={{
              duration: 2.4,
              times: [0, 0.3, 0.55, 0.85, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative"
          >
            <Logo size={220} label={false} intense />

            {/* charging halo */}
            <motion.div
              className="absolute inset-[-25%] rounded-full pointer-events-none"
              animate={{
                boxShadow: [
                  "0 0 0 0 oklch(0.82 0.18 195 / 0.85)",
                  "0 0 80px 30px oklch(0.82 0.18 195 / 0)",
                ],
              }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />

            {/* rotating energy arcs */}
            <motion.div
              className="absolute inset-[-15%] rounded-full pointer-events-none"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, oklch(0.85 0.22 40 / 0.6) 40deg, transparent 80deg, transparent 180deg, oklch(0.78 0.28 330 / 0.6) 220deg, transparent 260deg)",
                mask: "radial-gradient(circle, transparent 45%, black 47%, black 50%, transparent 52%)",
                WebkitMask: "radial-gradient(circle, transparent 45%, black 47%, black 50%, transparent 52%)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* ignition flash right before doors part */}
            <motion.div
              aria-hidden
              className="absolute inset-[-60%] rounded-full pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0, 0.95, 0] }}
              transition={{ duration: 2.4, times: [0, 0.7, 0.82, 0.9, 1] }}
              style={{
                background:
                  "radial-gradient(50% 50% at 50% 50%, oklch(0.98 0.18 195 / 0.95), transparent 70%)",
              }}
            />

            {/* sigil callsign appears beneath after reveal */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 top-full mt-6 text-center whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0, 0, 1, 1, 0], y: [10, 10, 0, 0, -6] }}
              transition={{ duration: 2.4, times: [0, 0.35, 0.5, 0.85, 1] }}
            >
              <div className="font-display text-[11px] tracking-[0.7em] text-primary text-glow">
                PHOENIX · IGNITION
              </div>
              <div className="font-mono text-[9px] text-accent mt-1 tracking-[0.4em] animate-flicker">
                ▸ SIGIL ONLINE — RELEASING DOORS
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}

      <motion.div
        key="left"
        className="fixed top-0 bottom-0 left-0 z-[112] w-1/2 origin-left"
        initial={{ x: 0 }}
        animate={{ x: open ? "-105%" : 0 }}
        transition={{ duration: 1.1, ease: [0.7, 0.0, 0.2, 1], delay: open ? 0.1 : 0 }}
        style={{
          background: "linear-gradient(110deg, #050709 0%, #0b1220 40%, #0a0f1a 100%)",
          boxShadow: "inset -24px 0 80px oklch(0.82 0.18 195 / 0.18)",
        }}
      >
        <DoorFace side="left" />
      </motion.div>
      <motion.div
        key="right"
        className="fixed top-0 bottom-0 right-0 z-[112] w-1/2 origin-right"
        initial={{ x: 0 }}
        animate={{ x: open ? "105%" : 0 }}
        transition={{ duration: 1.1, ease: [0.7, 0.0, 0.2, 1], delay: open ? 0.1 : 0 }}
        style={{
          background: "linear-gradient(250deg, #050709 0%, #0b1220 40%, #0a0f1a 100%)",
          boxShadow: "inset 24px 0 80px oklch(0.72 0.28 330 / 0.18)",
        }}
      >
        <DoorFace side="right" />
      </motion.div>

      {open && (
        <motion.div
          key="flash"
          className="fixed inset-0 z-[113] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, times: [0, 0.35, 1], ease: "easeOut" }}
          style={{
            background:
              "radial-gradient(50% 60% at 50% 50%, oklch(0.95 0.18 195 / 0.85), transparent 70%)",
          }}
        />
      )}

      {/* ember burst as doors part */}
      {open &&
        Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const dist = 280 + Math.random() * 180;
          return (
            <motion.span
              key={`ember-${i}`}
              className="fixed left-1/2 top-1/2 w-1.5 h-1.5 rounded-full z-[113] pointer-events-none"
              style={{ background: "#fbbf24", boxShadow: "0 0 10px #f59e0b" }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist,
                opacity: 0,
                scale: 0.2,
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          );
        })}
    </AnimatePresence>
  );
}

function DoorFace({ side }: { side: "left" | "right" }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className={`absolute top-0 bottom-0 ${side === "left" ? "right-0" : "left-0"} w-3`}
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, oklch(0.95 0.18 90) 0 8px, #0a0f1a 8px 16px)",
          opacity: 0.85,
        }}
      />
      <div className={`absolute top-0 bottom-0 ${side === "left" ? "right-4" : "left-4"} flex flex-col justify-between py-10`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="block w-3 h-3 rounded-full bg-[oklch(0.3_0.02_260)] ring-1 ring-[oklch(0.6_0.04_220_/_0.6)]" />
        ))}
      </div>
      <div className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 38px, oklch(1 0 0 / 0.06) 38px 39px)",
        }}
      />
      <div className={`absolute top-1/2 ${side === "left" ? "left-1/3" : "right-1/3"} -translate-y-1/2 font-display tracking-[0.5em] text-[10px] text-primary/40`}>
        {side === "left" ? "PHOENIX" : "PROTOCOL"}
      </div>
    </div>
  );
}
