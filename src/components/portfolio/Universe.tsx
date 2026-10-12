import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Sparkles, Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const scrollState = { p: 0, mx: 0, my: 0 };
if (typeof window !== "undefined") {
  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollState.p = max > 0 ? window.scrollY / max : 0;
  }, { passive: true });
  window.addEventListener("pointermove", (e) => {
    scrollState.mx = (e.clientX / window.innerWidth) * 2 - 1;
    scrollState.my = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });
}

function Core() {
  const ref = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  useFrame((s, d) => {
    if (!ref.current || !ring.current) return;
    ref.current.rotation.y += d * 0.25;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, scrollState.my * 0.4, 0.05);
    ref.current.position.y = -scrollState.p * 14;
    const pulse = 1 + Math.sin(s.clock.elapsedTime * 2) * 0.04;
    ref.current.scale.setScalar(pulse * (1 - scrollState.p * 0.4));
    ring.current.rotation.z += d * 0.4;
  });
  return (
    <group ref={ref} position={[2.2, 0, 0]}>
      <mesh>
        <icosahedronGeometry args={[1.2, 12]} />
        <MeshDistortMaterial color="#7cc8ff" emissive="#2b6cff" emissiveIntensity={0.9} distort={0.35} speed={2} roughness={0.1} metalness={0.6} />
      </mesh>
      <mesh scale={1.6}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#bfe4ff" wireframe transparent opacity={0.18} />
      </mesh>
      <mesh ref={ring} rotation={[1.2, 0, 0]}>
        <torusGeometry args={[2.3, 0.012, 16, 160]} />
        <meshBasicMaterial color="#cfeaff" transparent opacity={0.6} />
      </mesh>
      <Sparkles count={60} scale={4} size={3} speed={0.6} color="#bfe4ff" />
    </group>
  );
}

function Planet({ pos, color, size }: { pos: [number, number, number]; color: string; size: number }) {
  return (
    <Float speed={1} floatIntensity={2} rotationIntensity={0.5}>
      <mesh position={pos}>
        <sphereGeometry args={[size, 48, 48]} />
        <meshStandardMaterial color={color} roughness={0.7} emissive={color} emissiveIntensity={0.15} />
      </mesh>
    </Float>
  );
}

function Rig() {
  const stars = useRef<THREE.Group>(null);
  useFrame((s, d) => {
    s.camera.position.x = THREE.MathUtils.lerp(s.camera.position.x, scrollState.mx * 0.6, 0.03);
    s.camera.position.y = THREE.MathUtils.lerp(s.camera.position.y, -scrollState.my * 0.4, 0.03);
    s.camera.position.z = THREE.MathUtils.lerp(s.camera.position.z, 8 - scrollState.p * 4, 0.05);
    s.camera.lookAt(0, 0, 0);
    if (stars.current) {
      stars.current.rotation.y += d * 0.01;
      stars.current.rotation.x = scrollState.p * 0.8;
    }
  });
  return (
    <group ref={stars}>
      <Stars radius={60} depth={50} count={4000} factor={4} fade speed={0.6} />
      <Sparkles count={200} scale={[30, 20, 20]} size={1.5} speed={0.2} opacity={0.5} color="#9ccfff" />
      <Planet pos={[-7, -9, -10]} color="#4a6cff" size={1.6} />
      <Planet pos={[8, -18, -14]} color="#c08cff" size={2.2} />
      <Planet pos={[-5, -26, -8]} color="#ff9a6b" size={1} />
    </group>
  );
}

export default function Universe() {
  return (
    <Canvas dpr={[1, 1.6]} camera={{ position: [0, 0, 8], fov: 55 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={60} color="#9fd4ff" />
      <pointLight position={[-6, -4, 2]} intensity={30} color="#7a5cff" />
      <Rig />
      <Core />
    </Canvas>
  );
}
