import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, OrbitControls, Stars, Html } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import portraitUrl from "@/assets/ayush-portrait.png";
import { LaunchGate } from "./LaunchGate";

function HoloBust({ accent, textureUrl }: { accent: string; textureUrl: string }) {
  const tex = useLoader(THREE.TextureLoader, textureUrl);
  tex.colorSpace = THREE.SRGBColorSpace;

  const group = useRef<THREE.Group>(null);
  const visor = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.4) * 0.4 + pointer.x * 0.6;
      group.current.rotation.x = Math.sin(t * 0.6) * 0.06 + pointer.y * 0.2;
      group.current.position.y = Math.sin(t * 1.2) * 0.05;
    }
    if (visor.current) {
      const m = visor.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 1.2 + Math.sin(t * 5) * 0.5;
      visor.current.position.y = 0.05 + Math.sin(t * 1.5) * 0.4;
    }
    if (ring.current) ring.current.rotation.z = t * 0.3;
  });

  return (
    <group ref={group} position={[0, -0.2, 0]}>
      <mesh position={[0, 0.1, 0]}>
        <planeGeometry args={[2.1, 2.6, 16, 20]} />
        <meshStandardMaterial
          map={tex} transparent opacity={0.95}
          emissive={accent} emissiveIntensity={0.35} emissiveMap={tex}
          metalness={0.4} roughness={0.55} side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0.1, -0.05]}>
        <planeGeometry args={[2.35, 2.85]} />
        <meshBasicMaterial color={accent} transparent opacity={0.08} />
      </mesh>
      {([[-1.05, 1.3], [1.05, 1.3], [-1.05, -1.1], [1.05, -1.1]] as [number, number][]).map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.02]}>
          <boxGeometry args={[0.25, 0.04, 0.02]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.5} />
        </mesh>
      ))}
      <mesh ref={visor} position={[0, 0.05, 0.02]}>
        <planeGeometry args={[2.15, 0.06]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.5} transparent opacity={0.55} />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]} position={[0, -1.35, 0]}>
        <torusGeometry args={[1.4, 0.018, 6, 48]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} />
      </mesh>
      {[...Array(6)].map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        const r = 1.65;
        return (
          <Float key={i} speed={2} floatIntensity={0.5}>
            <mesh position={[Math.cos(a) * r, Math.sin(a * 1.2) * 0.3 - 0.1, Math.sin(a) * r - 0.6]}>
              <octahedronGeometry args={[0.1, 0]} />
              <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.1} wireframe />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

function Glyphs({ accent }: { accent: string }) {
  const grp = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (grp.current) grp.current.rotation.y = clock.elapsedTime * 0.4; });
  const labels = ["PY", "JS", "AI", "C", "NODE", "SEC"];
  return (
    <group ref={grp}>
      {labels.map((l, i) => {
        const a = (i / labels.length) * Math.PI * 2;
        const r = 2.6;
        return (
          <Float key={l} speed={2} floatIntensity={0.6}>
            <Html position={[Math.cos(a) * r, Math.sin(a * 1.3) * 0.6, Math.sin(a) * r]} center>
              <div className="font-mono text-[10px] px-1.5 py-0.5 border"
                   style={{ color: accent, borderColor: accent, background: "rgba(8,10,22,0.6)" }}>{l}</div>
            </Html>
          </Float>
        );
      })}
    </group>
  );
}

const PALETTE = ["#22d3ee", "#a78bfa", "#f472b6", "#34d399", "#fbbf24", "#fb7185"];

export function PortraitAvatar3D() {
  const [idx, setIdx] = useState(0);
  const accent = PALETTE[idx];
  const [textureUrl, setTextureUrl] = useState<string>(portraitUrl);
  const [scanning, setScanning] = useState(false);
  const objectUrlRef = useRef<string | null>(null);

  // cleanup blob urls
  useEffect(() => () => { if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current); }, []);

  const onUpload = (file: File) => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setScanning(true);
    // small delay for cinematic "rebuilding mesh" feel
    setTimeout(() => {
      setTextureUrl(url);
      setTimeout(() => setScanning(false), 900);
    }, 600);
  };

  return (
    <div className="space-y-3">
      <LaunchGate label="BOOT HOLO.MESH" hint="▸ tap to render 3D bust · uses GPU" height={460} accent={accent}>
        <Canvas
          camera={{ position: [0, 0.2, 4.4], fov: 50 }}
          dpr={[1, 1.6]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <pointLight position={[3, 3, 4]} intensity={1.8} color={accent} />
            <pointLight position={[-3, -2, 3]} intensity={1.1} color="#e94560" />
            <Stars radius={40} depth={20} count={700} factor={2.5} fade speed={1} />
            <HoloBust accent={accent} textureUrl={textureUrl} />
            <Glyphs accent={accent} />
            <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.6} minDistance={3.2} maxDistance={6} />
          </Suspense>
        </Canvas>

        <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-30"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0 2px, rgba(255,255,255,0.06) 2px 3px)" }} />

        <AnimatePresence>
          {scanning && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 grid place-items-center pointer-events-none"
              style={{ background: "rgba(5,8,18,0.55)" }}
            >
              <div className="text-center">
                <motion.div
                  animate={{ y: [-40, 40, -40] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-x-0 h-1"
                  style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, boxShadow: `0 0 24px ${accent}` }}
                />
                <div className="font-display tracking-[0.35em] text-sm" style={{ color: accent, textShadow: `0 0 16px ${accent}` }}>
                  REBUILDING MESH…
                </div>
                <div className="font-mono text-[10px] text-muted-foreground mt-1">▸ mapping portrait → holo projection</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute top-3 left-3 font-mono text-[10px] text-primary/80">
          ⌬ HOLO.PROJECTION — AYUSH.MESH v3.1
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
          <div className="font-mono text-[10px] text-muted-foreground">▸ drag · scroll · pick channel</div>
          <div className="flex gap-1.5">
            {PALETTE.map((c, i) => (
              <motion.button
                key={c} whileHover={{ scale: 1.25 }} whileTap={{ scale: 0.85 }}
                onClick={() => setIdx(i)}
                className="w-4 h-4 rounded-full"
                style={{ background: c, boxShadow: i === idx ? `0 0 12px ${c}, 0 0 0 2px white inset` : `0 0 6px ${c}66` }}
                aria-label={`accent ${c}`}
              />
            ))}
          </div>
        </div>
      </LaunchGate>

      {/* Upload workflow */}
      <label className="block corner-frame bg-card/70 backdrop-blur-md p-3 cursor-pointer hover:bg-card transition-colors">
        <span className="c-bl" /><span className="c-br" />
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-display text-[11px] tracking-[0.25em] text-primary text-glow">▸ UPLOAD YOUR FACE</div>
            <div className="font-mono text-[10px] text-muted-foreground mt-0.5">drop a portrait — falcon will rebuild the mesh</div>
          </div>
          <span className="font-mono text-[10px] px-2 py-1 border border-primary/40 text-primary">SCAN.png</span>
        </div>
        <input
          type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }}
        />
      </label>
    </div>
  );
}
