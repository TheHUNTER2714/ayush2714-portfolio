import { motion } from "framer-motion";
import { useMemo } from "react";

/**
 * GitHub-style contribution heatmap + an animated snake that
 * weaves through every cell, "eating" them as it passes.
 *
 * Pure SVG — no external deps, no API hits.
 */
export function ContribSnake({ weeks = 26 }: { weeks?: number }) {
  const ROWS = 7;
  const cell = 14;     // cell size in svg units
  const gap = 4;
  const step = cell + gap;
  const W = weeks * step;
  const H = ROWS * step;

  // Deterministic pseudo-random contribution intensities (0..4)
  const cells = useMemo(() => {
    const out: { x: number; y: number; level: number; key: string; order: number }[] = [];
    let order = 0;
    for (let w = 0; w < weeks; w++) {
      for (let r = 0; r < ROWS; r++) {
        // serpentine ordering so snake path is continuous
        const row = w % 2 === 0 ? r : ROWS - 1 - r;
        const seed = (w * 7 + row * 13 + 11) % 97;
        const level = seed < 32 ? 0 : seed < 56 ? 1 : seed < 76 ? 2 : seed < 90 ? 3 : 4;
        out.push({
          x: w * step,
          y: row * step,
          level,
          key: `${w}-${row}`,
          order: order++,
        });
      }
    }
    return out;
  }, [weeks]);

  const total = cells.length;
  const cycle = total * 0.07; // seconds per full traversal

  const levelColor = (l: number) =>
    l === 0
      ? "oklch(0.22 0.02 260)"
      : l === 1
        ? "oklch(0.45 0.12 195 / 0.7)"
        : l === 2
          ? "oklch(0.62 0.16 195 / 0.85)"
          : l === 3
            ? "oklch(0.78 0.2 195)"
            : "oklch(0.88 0.22 165)";

  // snake = 6-segment body that follows the serpentine path
  const SNAKE_LEN = 6;

  return (
    <div className="relative w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="snakeBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.85 0.22 40)" />
            <stop offset="100%" stopColor="oklch(0.78 0.28 330)" />
          </linearGradient>
          <filter id="snakeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {cells.map((c) => {
          // each cell pulses dark when the snake arrives, then refills
          const t = c.order / total;
          return (
            <motion.rect
              key={c.key}
              x={c.x}
              y={c.y}
              width={cell}
              height={cell}
              rx={2}
              fill={levelColor(c.level)}
              initial={{ opacity: c.level === 0 ? 0.35 : 0.9 }}
              animate={{
                opacity: c.level === 0
                  ? [0.35, 0.15, 0.35]
                  : [0.9, 0.15, 0.9],
                scale: [1, 0.7, 1],
              }}
              transition={{
                duration: cycle,
                times: [Math.max(0, t - 0.01), t, Math.min(1, t + 0.05)],
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: `${c.x + cell / 2}px ${c.y + cell / 2}px` }}
            />
          );
        })}

        {/* Snake body */}
        {Array.from({ length: SNAKE_LEN }).map((_, i) => {
          const offset = i / total; // how far behind the head this segment trails
          return (
            <motion.g key={`seg-${i}`} filter={i < 2 ? "url(#snakeGlow)" : undefined}>
              <motion.rect
                width={cell}
                height={cell}
                rx={3}
                fill="url(#snakeBody)"
                animate={{
                  x: cells.map((c) => c.x),
                  y: cells.map((c) => c.y),
                  opacity: 0.55 + (SNAKE_LEN - i) * 0.07,
                }}
                transition={{
                  duration: cycle,
                  times: cells.map((_, idx) => Math.min(1, (idx / total + offset * 0.02) % 1)),
                  repeat: Infinity,
                  ease: "linear",
                  delay: -offset * cycle * 0.04,
                }}
              />
            </motion.g>
          );
        })}
      </svg>

      {/* legend */}
      <div className="flex items-center justify-between mt-2 font-mono text-[9px] text-muted-foreground">
        <span>▸ snake.exe // {weeks}w window</span>
        <div className="flex items-center gap-1">
          <span>LESS</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: levelColor(l) }} />
          ))}
          <span>MORE</span>
        </div>
      </div>
    </div>
  );
}
