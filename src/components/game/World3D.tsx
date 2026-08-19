import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Stars, Text, Html, Trail, Sparkles } from "@react-three/drei";
import { useRef, useState, Suspense, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";


type Node = {
  label: string;
  pos: [number, number, number];
  color: string;
  desc: string;
  stack: string[];
};

const NODES: Node[] = [
  { label: "PYTHON",     pos: [ 2.2,  0.8,  0.0], color: "#9b87f5", desc: "Backend + ML scripting", stack: ["FastAPI", "Pandas", "scikit-learn"] },
  { label: "JS",         pos: [-2.2,  0.6,  0.4], color: "#f7c948", desc: "Browser runtime fluency", stack: ["ES2024", "TypeScript", "Vite"] },
  { label: "NODE",       pos: [ 0.0,  2.2, -0.8], color: "#ef4444", desc: "Server JS + APIs", stack: ["Express", "tRPC", "Prisma"] },
  { label: "AI/NLP",     pos: [-1.4, -1.8,  0.6], color: "#22d3ee", desc: "LLM apps & embeddings", stack: ["OpenAI", "LangChain", "Pinecone"] },
  { label: "CYBER",      pos: [ 1.6, -1.6, -0.4], color: "#e94560", desc: "Recon, auth, hardening", stack: ["Burp", "Nmap", "OWASP"] },
  { label: "FULL-STACK", pos: [ 0.0,  0.0,  2.2], color: "#34d399", desc: "End-to-end shipping", stack: ["React", "Next", "Supabase"] },
];

const THEMES = [
  { name: "CYAN",   core: "#22d3ee", a: "#22d3ee", b: "#e94560" },
  { name: "NEON",   core: "#a78bfa", a: "#f472b6", b: "#22d3ee" },
  { name: "EMBER",  core: "#fb7185", a: "#fbbf24", b: "#f472b6" },
  { name: "MATRIX", core: "#34d399", a: "#22d3ee", b: "#a78bfa" },
];

function SkillNode({ node, theme }: { node: Node; theme: typeof THEMES[number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x = clock.elapsedTime * 0.6;
    ref.current.rotation.y = clock.elapsedTime * 0.4;
    const target = hover ? 0.62 : 0.42;
    ref.current.scale.lerp(new THREE.Vector3(target, target, target), 0.15);
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <group position={node.pos}>
        <mesh
          ref={ref}
          onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { setHover(false); document.body.style.cursor = "default"; }}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={hover ? 1.6 : 0.7}
            wireframe
          />
        </mesh>
        <mesh scale={0.45}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={node.color} transparent opacity={0.1} />
        </mesh>
        <Text position={[0, -0.78, 0]} fontSize={0.22} color={node.color} anchorX="center" anchorY="middle">
          {node.label}
        </Text>
        {hover && (
          <Html position={[0, 0.95, 0]} center distanceFactor={6}>
            <div className="pointer-events-none whitespace-nowrap rounded-sm border px-2 py-1 font-mono text-[10px]"
                 style={{ borderColor: node.color, color: node.color, background: "rgba(8,10,22,0.85)", boxShadow: `0 0 14px ${node.color}66` }}>
              {node.desc}
              <div className="opacity-70">{node.stack.join(" · ")}</div>
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}

function CoreOrb({ color, pulse }: { color: string; pulse: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const knotRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = t * 0.35;
      ref.current.rotation.x = Math.sin(t * 0.3) * 0.15;
      const s = 1 + Math.sin(t * 2 + pulse) * 0.05;
      ref.current.scale.setScalar(s);
    }
    if (torusRef.current) torusRef.current.rotation.x = t * 0.5;
    if (knotRef.current) {
      knotRef.current.rotation.y = -t * 0.4;
      knotRef.current.rotation.z = t * 0.2;
    }
  });
  return (
    <group>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} wireframe />
      </mesh>
      <mesh scale={0.7}>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} />
      </mesh>
      <mesh ref={torusRef}>
        <torusGeometry args={[1.1, 0.012, 8, 96]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} />
      </mesh>
      <mesh ref={knotRef} scale={0.45}>
        <torusKnotGeometry args={[1, 0.06, 96, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} wireframe />
      </mesh>
    </group>
  );
}

function OrbitingProbe({ color, radius = 2.9, speed = 0.6 }: { color: string; radius?: number; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    if (ref.current) ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.7) * 0.6, Math.sin(t) * radius);
  });
  return (
    <Trail width={0.5} length={6} color={color} attenuation={(w) => w * w}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </Trail>
  );
}

function ConnectionLines({ color }: { color: string }) {
  const geom = useMemo(() => {
    const points: THREE.Vector3[] = [];
    NODES.forEach((n) => {
      points.push(new THREE.Vector3(0, 0, 0));
      points.push(new THREE.Vector3(...n.pos));
    });
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);
  return (
    <lineSegments geometry={geom}>
      <lineBasicMaterial color={color} transparent opacity={0.28} />
    </lineSegments>
  );
}

const QUALITIES = {
  LOW:    { dpr: [1, 1] as [number, number],   stars: 700,  sparkles: 40,  probes: 1, antialias: false },
  MEDIUM: { dpr: [1, 1.4] as [number, number], stars: 1400, sparkles: 90,  probes: 2, antialias: true },
  HIGH:   { dpr: [1, 1.8] as [number, number], stars: 2200, sparkles: 160, probes: 3, antialias: true },
} as const;
type QualityKey = keyof typeof QUALITIES;

const QUALITY_STORAGE_KEY = "world3d:quality";
const THEME_STORAGE_KEY = "world3d:theme";

export function World3D() {
  const [themeIdx, setThemeIdx] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [quality, setQuality] = useState<QualityKey>("MEDIUM");
  const theme = THEMES[themeIdx];
  const q = QUALITIES[quality];

  // hydrate persisted settings (client-only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const sq = window.localStorage.getItem(QUALITY_STORAGE_KEY) as QualityKey | null;
      if (sq && sq in QUALITIES) setQuality(sq);
      const st = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (st !== null) {
        const idx = parseInt(st, 10);
        if (!Number.isNaN(idx) && idx >= 0 && idx < THEMES.length) setThemeIdx(idx);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(QUALITY_STORAGE_KEY, quality); } catch {}
  }, [quality]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(THEME_STORAGE_KEY, String(themeIdx)); } catch {}
  }, [themeIdx]);

  // Lazy-mount the Canvas only when the nebula is on-screen. Prevents
  // WebGL context exhaustion when other 3D canvases (portrait, background)
  // are already running, which was blanking the nebula with "Context Lost".
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [ctxLost, setCtxLost] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Keep the canvas alive once it has ignited — remounting on every scroll
  // in/out was what left the nebula blank. We only throttle the render loop.
  const [ignited, setIgnited] = useState(false);
  useEffect(() => { if (inView) setIgnited(true); }, [inView]);

  // Throttle offscreen work: drop to on-demand rendering when scrolled away.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let stopT: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      setScrolling(true);
      if (stopT) clearTimeout(stopT);
      stopT = setTimeout(() => setScrolling(false), 160);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (stopT) clearTimeout(stopT); };
  }, []);

  // Reset ready flag only when the canvas actually remounts (quality change)
  useEffect(() => { setReady(false); setCtxLost(false); }, [quality]);


  return (
    <section className="min-h-screen px-6 md:px-16 pt-32 pb-32">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <div className="font-mono text-xs text-primary mb-2">▸ /worlds/skill-nebula.glb</div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-glow">SKILL <span className="text-accent text-glow-accent">NEBULA</span></h2>
          <p className="font-mono text-xs text-muted-foreground mt-2">drag to orbit · scroll to zoom · hover a node · cycle themes · tune quality · pulse to ignite</p>
        </motion.div>

        <div ref={containerRef} className="relative corner-frame box-glow bg-card/60 backdrop-blur-md overflow-hidden" style={{ height: 600 }}>
          <span className="c-bl" /><span className="c-br" />
          {inView && !ctxLost && (
            <Canvas
              key={quality}
              camera={{ position: [0, 0.4, 6.2], fov: 55 }}
              dpr={q.dpr}
              frameloop={scrolling ? "demand" : "always"}
              gl={{ antialias: q.antialias, powerPreference: quality === "LOW" ? "low-power" : "high-performance", failIfMajorPerformanceCaveat: false, preserveDrawingBuffer: false }}
              onCreated={({ gl }) => {
                const canvas = gl.domElement;
                canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); setCtxLost(true); }, false);
                canvas.addEventListener("webglcontextrestored", () => { setCtxLost(false); }, false);
                requestAnimationFrame(() => setTimeout(() => setReady(true), 120));
              }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={0.4} />
                <pointLight position={[5, 5, 5]} intensity={1.6} color={theme.a} />
                <pointLight position={[-5, -5, -5]} intensity={1.2} color={theme.b} />
                <pointLight position={[0, -4, 4]} intensity={0.8} color={theme.core} />
                <Stars radius={70} depth={45} count={q.stars} factor={3.2} fade speed={1} />
                <Sparkles count={q.sparkles} scale={8} size={2} speed={0.4} color={theme.core} opacity={0.7} />
                <CoreOrb color={theme.core} pulse={pulse} />
                <ConnectionLines color={theme.core} />
                <OrbitingProbe color={theme.a} radius={3.1} speed={0.55} />
                {q.probes > 1 && <OrbitingProbe color={theme.b} radius={2.4} speed={-0.7} />}
                {q.probes > 2 && <OrbitingProbe color={theme.core} radius={3.8} speed={0.32} />}
                {NODES.map((n) => <SkillNode key={n.label} node={n} theme={theme} />)}
                <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.55} minDistance={4} maxDistance={11} />
              </Suspense>
            </Canvas>
          )}

          {/* Loading UI — shown until first frame paints */}
          {inView && !ready && !ctxLost && (
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-16 h-16">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-transparent"
                    style={{ borderTopColor: theme.core, borderRightColor: theme.a }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute inset-2 rounded-full border border-transparent"
                    style={{ borderBottomColor: theme.b }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute inset-5 rounded-full"
                    style={{ background: theme.core, boxShadow: `0 0 18px ${theme.core}` }}
                    animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <div className="font-mono text-[10px] tracking-[0.3em]" style={{ color: theme.core }}>
                  <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }}>
                    IGNITING NEBULA · {quality}
                  </motion.span>
                </div>
                <div className="w-40 h-0.5 bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full"
                    style={{ background: `linear-gradient(90deg, transparent, ${theme.core}, transparent)` }}
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </div>
            </div>
          )}

          {!inView && (
            <div className="absolute inset-0 grid place-items-center font-mono text-xs text-primary/70">
              ▸ nebula standing by · scroll into view to ignite
            </div>
          )}

          {ctxLost && (
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <div className="font-mono text-xs text-destructive mb-2">⚠ WEBGL CONTEXT LOST</div>
                <button
                  onClick={() => { setCtxLost(false); setReady(false); }}
                  className="corner-frame font-mono text-[10px] px-3 py-1.5"
                  style={{ color: theme.core, background: `${theme.core}22` }}
                >
                  <span className="c-bl" /><span className="c-br" />
                  ↻ REBOOT NEBULA
                </button>
              </div>
            </div>
          )}


          {pulse > 0 && (
            <motion.div
              key={pulse}
              initial={{ scale: 0.2, opacity: 0.8 }}
              animate={{ scale: 2.6, opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="absolute inset-0 m-auto w-40 h-40 rounded-full pointer-events-none"
              style={{ boxShadow: `0 0 0 3px ${theme.core}aa, 0 0 60px ${theme.core}` }}
            />
          )}

          <div className="absolute top-3 left-3 font-mono text-[10px] text-primary/80">
            ⌬ NEBULA.LIVE — 6 NODES · {q.probes} PROBES · {quality} · THEME {theme.name}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setPulse((p) => p + 1)}
            className="absolute top-3 right-3 corner-frame font-mono text-[10px] tracking-widest px-3 py-1.5 backdrop-blur-md"
            style={{ background: `${theme.core}22`, color: theme.core, boxShadow: `0 0 18px ${theme.core}55` }}
          >
            <span className="c-bl" /><span className="c-br" />
            ⚡ FIRE PULSE
          </motion.button>

          {/* QUALITY TOGGLE */}
          <div className="absolute top-12 right-3 flex gap-1.5">
            {(Object.keys(QUALITIES) as QualityKey[]).map((k) => (
              <motion.button
                key={k}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuality(k)}
                className="px-2 py-1 corner-frame font-mono text-[9px] tracking-widest backdrop-blur-md"
                style={{
                  background: k === quality ? `${theme.core}33` : "rgba(0,0,0,0.4)",
                  color: k === quality ? theme.core : "var(--muted-foreground)",
                  boxShadow: k === quality ? `0 0 12px ${theme.core}55` : "none",
                }}
              >
                <span className="c-bl" /><span className="c-br" />
                {k}
              </motion.button>
            ))}
          </div>

          <div className="absolute bottom-3 right-3 flex gap-2">
            {THEMES.map((t, i) => (
              <motion.button
                key={t.name}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setThemeIdx(i)}
                className="px-2.5 py-1 corner-frame font-mono text-[9px] tracking-widest backdrop-blur-md"
                style={{
                  background: i === themeIdx ? `${t.core}22` : "rgba(0,0,0,0.4)",
                  color: t.core,
                  boxShadow: i === themeIdx ? `0 0 16px ${t.core}55, inset 0 0 12px ${t.core}33` : "none",
                }}
              >
                <span className="c-bl" /><span className="c-br" />
                {t.name}
              </motion.button>
            ))}
          </div>

          <div className="absolute bottom-3 left-3 font-mono text-[10px] text-muted-foreground">
            ▸ {quality.toLowerCase()} preset · {q.stars} stars · {q.sparkles} sparkles · {q.probes} probes
          </div>
        </div>
      </div>
    </section>
  );
}

