import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, PerspectiveCamera, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const AnimatedShape = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const coinRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.5;
      meshRef.current.rotation.y = t * 0.3;
    }
    if (coinRef.current) {
      coinRef.current.rotation.y = t * 2;
      coinRef.current.position.y = Math.sin(t * 2) * 0.2;
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        {/* Outer Energy Shell */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.5, 1]} />
          <MeshDistortMaterial
            color="#00ffff"
            speed={3}
            distort={0.4}
            radius={1}
            emissive="#00ffff"
            emissiveIntensity={0.2}
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
        
        {/* Central Coin */}
        <mesh ref={coinRef} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 0.1, 32]} />
          <meshStandardMaterial 
            color="#eab308" 
            metalness={1} 
            roughness={0.1} 
            emissive="#eab308"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Inner Glow */}
        <mesh scale={0.8}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.05} />
        </mesh>
      </Float>
    </group>
  );
};

const Particles = () => {
  const count = 100;
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#00ffff" transparent opacity={0.6} />
    </points>
  );
};

export const Loading3D: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <AnimatedShape />
          <Particles />
        </Canvas>
      </div>

      {/* Overlay UI */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-4xl font-black tracking-[0.3em] text-white uppercase mb-4 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
            PRO MINING
          </h2>
          
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ width: [0, 200, 200] }}
                transition={{ duration: 2, repeat: Infinity, times: [0, 0.8, 1] }}
                className="h-[2px] bg-cyan-400 shadow-[0_0_10px_#00ffff]"
              />
              <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">
                Syncing Core
              </span>
            </div>
            
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[10px] font-mono text-gray-500 tracking-[0.5em] uppercase"
            >
              Establishing Secure Connection...
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Scanning Line Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <motion.div
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-full h-[10vh] bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
        />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
    </div>
  );
};

