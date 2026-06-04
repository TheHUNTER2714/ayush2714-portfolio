import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";

/**
 * Cinematic split-door overlay between BootScreen and the live experience.
 * Includes a centered animated Logo crest that ignites on the seam, two
 * armored panels with hazard stripes, a laser seam, and a halo flash.
 */
export function SplitDoor({ open }: { open: boolean }) {
  return (
    <AnimatePresence>
      {!open ? (
        <motion.div
          key="seam"
          className="fixed inset-0 z-[111] pointer-events-none grid place-items-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
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
            transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
          />
          {/* Centered animated Logo crest riding the seam — pulses bright,
              then flashes & fades the instant the doors split. */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0, filter: "blur(14px)" }}
            animate={{
              scale: [0.4, 1.08, 1, 1.6],
              opacity: [0, 1, 1, 0],
              filter: ["blur(14px)", "blur(0px)", "blur(0px)", "blur(8px)"],
            }}
            transition={{
              duration: 1.5,
              times: [0, 0.45, 0.78, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative"
          >
            <Logo size={200} label={false} intense />
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              animate={{
                boxShadow: [
                  "0 0 0 0 oklch(0.82 0.18 195 / 0.85)",
                  "0 0 60px 28px oklch(0.82 0.18 195 / 0)",
                ],
              }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            {/* ignition flash right before doors part */}
            <motion.div
              aria-hidden
              className="absolute inset-[-40%] rounded-full pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0.85, 0] }}
              transition={{ duration: 1.5, times: [0, 0.7, 0.82, 1] }}
              style={{
                background:
                  "radial-gradient(50% 50% at 50% 50%, oklch(0.98 0.18 195 / 0.95), transparent 70%)",
              }}
            />
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
