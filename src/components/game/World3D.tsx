import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Stars, Text, Html, Trail, Sparkles } from "@react-three/drei";
import { useRef, useState, Suspense, useMemo } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { LaunchGate } from "./LaunchGate";

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

export function World3D() {
  const [themeIdx, setThemeIdx] = useState(0);
  const theme = THEMES[themeIdx];

  return (
    <section className="min-h-screen px-6 md:px-16 pt-32 pb-32">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <div className="font-mono text-xs text-primary mb-2">▸ /worlds/skill-nebula.glb</div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-glow">3D <span className="text-accent text-glow-accent">WORLD</span></h2>
          <p className="font-mono text-xs text-muted-foreground mt-2">Drag to orbit · scroll to zoom · hover a node · cycle themes</p>
        </motion.div>

        <LaunchGate label="ENTER SKILL NEBULA" hint="▸ tap to boot 3D world · uses GPU" height={560} accent={theme.core}>
          <Canvas
            camera={{ position: [0, 0.4, 6.2], fov: 55 }}
            dpr={[1, 1.6]}
            gl={{ antialias: true, powerPreference: "high-performance" }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.35} />
              <pointLight position={[5, 5, 5]} intensity={1.4} color={theme.a} />
              <pointLight position={[-5, -5, -5]} intensity={1.1} color={theme.b} />
              <Stars radius={60} depth={40} count={1200} factor={3} fade speed={1} />
              <CoreOrb color={theme.core} />
              <ConnectionLines color={theme.core} />
              <OrbitingProbe color={theme.a} radius={3.1} speed={0.55} />
              <OrbitingProbe color={theme.b} radius={2.4} speed={-0.7} />
              {NODES.map((n) => <SkillNode key={n.label} node={n} theme={theme} />)}
              <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.6} minDistance={4} maxDistance={10} />
            </Suspense>
          </Canvas>

          <div className="absolute top-3 left-3 font-mono text-[10px] text-primary/80">
            ⌬ NEBULA.LIVE — 6 NODES SYNCED · THEME {theme.name}
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
            ▸ 6 nodes · 2 probes · live recolor
          </div>
        </LaunchGate>
      </div>
    </section>
  );
}
