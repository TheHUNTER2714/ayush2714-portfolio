import { useEffect, useRef } from "react";

/**
 * Live animated background:
 *  - parallax starfield
 *  - drifting neon particles
 *  - perspective grid floor
 *  - sweeping radar arc
 */
export function GameBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 1 + 0.2,
      r: Math.random() * 1.4 + 0.2,
    }));

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.6 - 0.1,
      life: Math.random(),
      hue: Math.random() > 0.5 ? 195 : 320,
    }));

    let mx = w / 2, my = h / 2;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove);

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    let t = 0; let raf = 0;
    const render = () => {
      t += 0.008;
      ctx.fillStyle = "rgba(8, 10, 22, 0.35)";
      ctx.fillRect(0, 0, w, h);

      const ox = (mx - w / 2) * 0.02;
      const oy = (my - h / 2) * 0.02;

      // stars
      for (const s of stars) {
        const px = s.x + ox * s.z * 4;
        const py = s.y + oy * s.z * 4;
        ctx.beginPath();
        ctx.fillStyle = `rgba(180, 240, 255, ${0.3 + s.z * 0.6})`;
        ctx.arc(px, py, s.r * s.z, 0, Math.PI * 2);
        ctx.fill();
      }

      // particles
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.life += 0.004;
        if (p.y < -10 || p.life > 1) {
          p.x = Math.random() * w; p.y = h + 10; p.life = 0;
        }
        const alpha = Math.sin(p.life * Math.PI) * 0.7;
        ctx.beginPath();
        ctx.fillStyle = `oklch(0.8 0.22 ${p.hue} / ${alpha})`;
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = `oklch(0.8 0.22 ${p.hue} / ${alpha * 0.3})`;
        ctx.lineWidth = 1;
        ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 20, p.y - p.vy * 20);
        ctx.stroke();
      }

      // sweeping radar arc (top-right)
      const rcx = w - 140, rcy = 140, rr = 100;
      ctx.save();
      ctx.translate(rcx, rcy);
      ctx.rotate(t * 1.2);
      const grad = ctx.createConicGradient ? ctx.createConicGradient(0, 0, 0) : null;
      if (grad) {
        grad.addColorStop(0, "rgba(120, 240, 255, 0.55)");
        grad.addColorStop(0.15, "rgba(120, 240, 255, 0)");
        grad.addColorStop(1, "rgba(120, 240, 255, 0)");
        ctx.fillStyle = grad as unknown as string;
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.arc(0, 0, rr, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* perspective grid floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55vh] grid-floor opacity-30"
        style={{
          transform: "perspective(600px) rotateX(60deg)",
          transformOrigin: "bottom",
          maskImage: "linear-gradient(to top, black 20%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 20%, transparent 100%)",
          animation: "grid-pan 14s linear infinite",
        }}
      />
      {/* vignette + scanlines */}
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
