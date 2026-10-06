"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import usePrefersReducedMotion from "@/src/hooks/usePrefersReducedMotion";

function AnimatedShape({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    // Freeze the render loop contribution when the user prefers reduced motion.
    if (reducedMotion || !meshRef.current) {
      return;
    }
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
  });

  return (
    <Float speed={reducedMotion ? 0 : 2} rotationIntensity={reducedMotion ? 0 : 1} floatIntensity={reducedMotion ? 0 : 2}>
      <mesh ref={meshRef} scale={1.5}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#0066CC"
          envMapIntensity={0.8}
          clearcoat={1}
          clearcoatRoughness={0}
          metalness={0.8}
          roughness={0.2}
          distort={0.4}
          speed={reducedMotion ? 0 : 3}
        />
      </mesh>
    </Float>
  );
}

function ThreeDHeroScene() {
  const prefersReducedMotion = usePrefersReducedMotion();
  return (
    <div className="absolute inset-0 z-[-1] pointer-events-none opacity-60">
      <Canvas frameloop={prefersReducedMotion ? "never" : "always"} dpr={prefersReducedMotion ? 1 : [1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <AnimatedShape reducedMotion={prefersReducedMotion} />
        {!prefersReducedMotion && <OrbitControls enableZoom={false} enablePan={false} />}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

// WebGL canvases must never render on the server: consume this component via
// a client-only dynamic boundary (ssr: false) so SSR/prerender stays static.
export default dynamic(() => Promise.resolve({ default: ThreeDHeroScene }), { ssr: false });
