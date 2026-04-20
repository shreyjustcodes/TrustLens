import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingGeometry() {
  const meshRef = useRef();
  const wireRef = useRef();
  const particlesRef = useRef();

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return positions;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t * 0.15) * 0.3;
      meshRef.current.rotation.y = t * 0.08;
      meshRef.current.position.y = Math.sin(t * 0.4) * 0.3;
    }

    if (wireRef.current) {
      wireRef.current.rotation.x = -t * 0.05;
      wireRef.current.rotation.z = Math.cos(t * 0.1) * 0.2;
      wireRef.current.position.y = Math.sin(t * 0.3 + 1) * 0.2;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.02;
      particlesRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    }
  });

  return (
    <>
      {/* Central icosahedron */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshBasicMaterial
          color="#0ea5e9"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Outer torus */}
      <mesh ref={wireRef}>
        <torusGeometry args={[3.5, 0.02, 16, 100]} />
        <meshBasicMaterial
          color="#ff7a18"
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Particle field */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={200}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#84cc16"
          transparent
          opacity={0.4}
          sizeAttenuation
        />
      </points>
    </>
  );
}

export default function TrustScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.5} />
      <FloatingGeometry />
    </Canvas>
  );
}
