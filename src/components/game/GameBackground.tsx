import { useEffect, useRef } from "react";
import { gameBus } from "./gameState";

/**
 * Live animated background that syncs with the mini-game:
 *  - parallax starfield warps on each pulse
 *  - drifting neon particles inherit hue from the active section / game
 *  - perspective grid floor + radar sweep
 *  - energy level scales particle count + speed
 */
export function GameBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const floorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 260 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 1 + 0.2,
      r: Math.random() * 1.4 + 0.2,
    }));

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.6 - 0.1,
      life: Math.random(),
      hueShift: Math.random() * 40 - 20,
    }));

    // Shockwave rings emitted on bus.pulse()
    const rings: { x: number; y: number; r: number; alpha: number; hue: number }[] = [];

    let mx = w / 2, my = h / 2;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove);

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    let baseHue = 195;
    let targetHue = 195;
    let energy = 0.4;
    let lastPulse = 0;

    const unsub = gameBus.subscribe((s) => {
      targetHue = s.hue;
      energy = s.energy;
      if (s.pulse !== lastPulse) {
        lastPulse = s.pulse;
        rings.push({ x: w / 2, y: h / 2, r: 20, alpha: 0.8, hue: s.hue });
        // particle burst
        for (let i = 0; i < 12; i++) {
          particles.push({
            x: w / 2 + (Math.random() - 0.5) * 60,
            y: h / 2 + (Math.random() - 0.5) * 60,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 0,
            hueShift: Math.random() * 40 - 20,
          });
        }
        if (particles.length > 140) particles.splice(0, particles.length - 140);
      }
    });

    let t = 0; let raf = 0;
    const render = () => {
      t += 0.008 + energy * 0.01;
      // hue easing
      baseHue += (targetHue - baseHue) * 0.04;

      ctx.fillStyle = "rgba(8, 10, 22, 0.32)";
      ctx.fillRect(0, 0, w, h);

      const ox = (mx - w / 2) * 0.02;
      const oy = (my - h / 2) * 0.02;

      // stars
      for (const s of stars) {
        const px = s.x + ox * s.z * 4;
        const py = s.y + oy * s.z * 4;
        ctx.beginPath();
        const sg = 0.3 + s.z * 0.6;
        ctx.fillStyle = `oklch(0.9 0.08 ${baseHue} / ${sg})`;
        ctx.arc(px, py, s.r * s.z, 0, Math.PI * 2);
        ctx.fill();
      }

      // particles
      const speed = 1 + energy * 1.6;
      for (const p of particles) {
        p.x += p.vx * speed; p.y += p.vy * speed; p.life += 0.004 + energy * 0.004;
        if (p.y < -10 || p.life > 1) {
          p.x = Math.random() * w; p.y = h + 10; p.life = 0;
          p.vx = (Math.random() - 0.5) * 0.3; p.vy = -Math.random() * 0.6 - 0.1;
        }
        const alpha = Math.sin(p.life * Math.PI) * 0.75;
        const hue = (baseHue + p.hueShift + 360) % 360;
        ctx.beginPath();
        ctx.fillStyle = `oklch(0.82 0.22 ${hue} / ${alpha})`;
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = `oklch(0.82 0.22 ${hue} / ${alpha * 0.3})`;
        ctx.lineWidth = 1;
        ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 20, p.y - p.vy * 20);
        ctx.stroke();
      }

      // shockwave rings
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.r += 12; r.alpha *= 0.94;
        ctx.beginPath();
        ctx.strokeStyle = `oklch(0.82 0.22 ${r.hue} / ${r.alpha})`;
        ctx.lineWidth = 2;
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();
        if (r.alpha < 0.02) rings.splice(i, 1);
      }

      // sweeping radar arc (top-right)
      const rcx = w - 140, rcy = 140, rr = 100;
      ctx.save();
      ctx.translate(rcx, rcy);
      ctx.rotate(t * 1.2);
      const grad = ctx.createConicGradient ? ctx.createConicGradient(0, 0, 0) : null;
      if (grad) {
        grad.addColorStop(0, `oklch(0.85 0.2 ${baseHue} / 0.55)`);
        grad.addColorStop(0.15, `oklch(0.85 0.2 ${baseHue} / 0)`);
        grad.addColorStop(1, `oklch(0.85 0.2 ${baseHue} / 0)`);
        ctx.fillStyle = grad as unknown as string;
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.arc(0, 0, rr, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();

      // sync grid color via CSS var on the floor element
      if (floorRef.current) {
        floorRef.current.style.setProperty("--floor-hue", `${baseHue.toFixed(1)}`);
      }

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); window.removeEventListener("resize", onResize); unsub(); };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div
        ref={floorRef}
        className="absolute inset-x-0 bottom-0 h-[55vh] opacity-40"
        style={{
          transform: "perspective(600px) rotateX(60deg)",
          transformOrigin: "bottom",
          maskImage: "linear-gradient(to top, black 20%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 20%, transparent 100%)",
          animation: "grid-pan 14s linear infinite",
          backgroundImage: `
            linear-gradient(oklch(0.7 0.22 var(--floor-hue, 195) / 0.35) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.7 0.22 var(--floor-hue, 195) / 0.35) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)" }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
           style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0 2px, white 2px 3px)" }} />
      <style>{`
        @keyframes grid-pan {
          0% { background-position: 0 0; }
          100% { background-position: 0 60px; }
        }
      `}</style>
    </div>
  );
}
