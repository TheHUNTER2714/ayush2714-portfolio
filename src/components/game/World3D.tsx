import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Stars, Text } from "@react-three/drei";
import { useRef, useState, Suspense } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

const NODES: { label: string; pos: [number, number, number]; color: string }[] = [
  { label: "PYTHON",     pos: [ 2.2,  0.8,  0.0], color: "#9b87f5" },
  { label: "JS",         pos: [-2.2,  0.6,  0.4], color: "#f7c948" },
  { label: "NODE",       pos: [ 0.0,  2.2, -0.8], color: "#ef4444" },
  { label: "AI/NLP",     pos: [-1.4, -1.8,  0.6], color: "#22d3ee" },
  { label: "CYBER",      pos: [ 1.6, -1.6, -0.4], color: "#e94560" },
  { label: "FULL-STACK", pos: [ 0.0,  0.0,  2.2], color: "#34d399" },
];

function SkillNode({ label, pos, color }: { label: string; pos: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x = clock.elapsedTime * 0.6;
    ref.current.rotation.y = clock.elapsedTime * 0.4;
  });
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <group position={pos}>
        <mesh
          ref={ref}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
          scale={hover ? 0.55 : 0.4}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hover ? 1.4 : 0.6}
            wireframe
          />
        </mesh>
        <mesh scale={0.42}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={color} transparent opacity={0.08} />
        </mesh>
        <Text
          position={[0, -0.7, 0]}
          fontSize={0.22}
          color={color}
          anchorX="center" anchorY="middle"
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}

function CoreOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.3;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.6, 1]} />
      <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.2} wireframe />
    </mesh>
  );
}

function ConnectionLines() {
  const points: THREE.Vector3[] = [];
  NODES.forEach((n) => {
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(new THREE.Vector3(...n.pos));
  });
  const geom = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <lineSegments geometry={geom}>
      <lineBasicMaterial color="#22d3ee" transparent opacity={0.25} />
    </lineSegments>
  );
}

export function World3D() {
  return (
    <section className="min-h-screen px-6 md:px-16 pt-32 pb-32">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <div className="font-mono text-xs text-primary mb-2">▸ /worlds/skill-nebula.glb</div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-glow">3D <span className="text-accent text-glow-accent">WORLD</span></h2>
          <p className="font-mono text-xs text-muted-foreground mt-2">Drag to orbit. Scroll to zoom. Hover a node.</p>
        </motion.div>

        <div className="corner-frame box-glow bg-card/60 backdrop-blur-md h-[520px] relative overflow-hidden">
          <span className="c-bl" /><span className="c-br" />
          <Canvas camera={{ position: [0, 0, 6], fov: 55 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.3} />
              <pointLight position={[5, 5, 5]} intensity={1.2} color="#22d3ee" />
              <pointLight position={[-5, -5, -5]} intensity={1} color="#e94560" />
              <Stars radius={50} depth={30} count={2000} factor={3} fade speed={1} />
              <CoreOrb />
              <ConnectionLines />
              {NODES.map((n) => <SkillNode key={n.label} {...n} />)}
              <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.6} />
            </Suspense>
          </Canvas>
          <div className="absolute top-3 left-3 font-mono text-[10px] text-primary/80">
            ⌬ NEBULA.LIVE — 6 NODES SYNCED
          </div>
        </div>
      </div>
    </section>
  );
}
