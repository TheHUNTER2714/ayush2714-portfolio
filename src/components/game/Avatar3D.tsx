import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Stars, Html } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

/**
 * Stylized 3D avatar — low-poly cyber-hooded bust generated procedurally.
 * (Lovable can't ingest a live photo in-app; this is a faceted neon
 * representation that animates, color-cycles, and reacts to hover.)
 */
function Bust({ accent }: { accent: string }) {
  const head = useRef<THREE.Mesh>(null);
  const hood = useRef<THREE.Mesh>(null);
  const visor = useRef<THREE.Mesh>(null);

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime;
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.5) * 0.35 + pointer.x * 0.6;
      head.current.rotation.x = Math.sin(t * 0.7) * 0.08 + pointer.y * 0.2;
    }
    if (hood.current) hood.current.rotation.y = head.current?.rotation.y ?? 0;
    if (visor.current) {
      const m = visor.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 1.5 + Math.sin(t * 4) * 0.4;
    }
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* shoulders */}
      <mesh position={[0, -1.4, 0]}>
        <cylinderGeometry args={[1.3, 1.6, 0.7, 8]} />
        <meshStandardMaterial color="#1a2342" emissive={accent} emissiveIntensity={0.2} flatShading wireframe={false} />
      </mesh>
      {/* neck */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.32, 0.42, 0.6, 8]} />
        <meshStandardMaterial color="#16213e" flatShading />
      </mesh>
      {/* head */}
      <mesh ref={head}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshStandardMaterial color="#c9a37a" emissive={accent} emissiveIntensity={0.12} flatShading />
      </mesh>
      {/* hood */}
      <mesh ref={hood} position={[0, 0.05, -0.15]}>
        <sphereGeometry args={[1.18, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
        <meshStandardMaterial color="#0c1326" emissive={accent} emissiveIntensity={0.45} flatShading wireframe />
      </mesh>
      {/* visor */}
      <mesh ref={visor} position={[0, 0.05, 0.78]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[1.4, 0.22, 0.1]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.5} />
      </mesh>
      {/* headphones */}
      <mesh position={[-0.95, 0.1, 0]}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color="#0a0a1a" emissive={accent} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0.95, 0.1, 0]}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color="#0a0a1a" emissive={accent} emissiveIntensity={0.6} />
      </mesh>
      {/* HUD ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <torusGeometry args={[1.45, 0.012, 8, 64]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

function OrbitalGlyphs({ accent }: { accent: string }) {
  const grp = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (grp.current) grp.current.rotation.y = clock.elapsedTime * 0.35;
  });
  const labels = ["PY", "JS", "AI", "C", "NODE", "SEC"];
  return (
    <group ref={grp}>
      {labels.map((l, i) => {
        const a = (i / labels.length) * Math.PI * 2;
        const r = 2.4;
        return (
          <Float key={l} speed={2} floatIntensity={0.6}>
            <mesh position={[Math.cos(a) * r, Math.sin(a * 1.3) * 0.5, Math.sin(a) * r]}>
              <octahedronGeometry args={[0.18, 0]} />
              <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1} wireframe />
            </mesh>
            <Html position={[Math.cos(a) * r, Math.sin(a * 1.3) * 0.5 + 0.35, Math.sin(a) * r]} center>
              <div className="font-mono text-[9px]" style={{ color: accent }}>{l}</div>
            </Html>
          </Float>
        );
      })}
    </group>
  );
}

const PALETTE = ["#22d3ee", "#a78bfa", "#f472b6", "#34d399", "#fbbf24", "#fb7185"];

export function Avatar3D() {
  const [idx, setIdx] = useState(0);
  const accent = PALETTE[idx];

  return (
    <div className="relative corner-frame box-glow bg-card/60 backdrop-blur-md h-[420px] overflow-hidden">
      <span className="c-bl" /><span className="c-br" />
      <Canvas camera={{ position: [0, 0.2, 4.4], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.45} />
          <pointLight position={[3, 3, 4]} intensity={1.6} color={accent} />
          <pointLight position={[-3, -2, 3]} intensity={1.1} color="#e94560" />
          <Stars radius={40} depth={20} count={1200} factor={2.5} fade speed={1} />
          <Bust accent={accent} />
          <OrbitalGlyphs accent={accent} />
          <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.5} minDistance={3.2} maxDistance={6} />
        </Suspense>
      </Canvas>
      <div className="absolute top-3 left-3 font-mono text-[10px] text-primary/80">
        ⌬ AVATAR.MESH — LOW-POLY · v2.7
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div className="font-mono text-[10px] text-muted-foreground">▸ drag to rotate · scroll to zoom</div>
        <div className="flex gap-1.5">
          {PALETTE.map((c, i) => (
            <motion.button
              key={c}
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => setIdx(i)}
              className="w-4 h-4 rounded-full"
              style={{
                background: c,
                boxShadow: i === idx ? `0 0 12px ${c}, 0 0 0 2px white inset` : `0 0 6px ${c}66`,
              }}
              aria-label={`accent ${c}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
