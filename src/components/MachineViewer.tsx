import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stage, 
  Float, 
  PerspectiveCamera, 
  Text,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  Environment,
  ContactShadows
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, RotateCw, ZoomIn } from 'lucide-react';

interface MachineModelProps {
  name: string;
  price: number;
}

const MachineModel: React.FC<MachineModelProps> = ({ name, price }) => {
  // Determine color based on price/tier
  const color = price >= 1000 ? '#eab308' : price >= 500 ? '#a855f7' : '#22c55e';

  return (
    <group>
      {/* Main Server Chassis */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 3, 1]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Glowing Panels */}
        <mesh position={[0, 0, 0.51]}>
          <planeGeometry args={[1.8, 2.8]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={2} 
            transparent 
            opacity={0.1} 
          />
        </mesh>

        {/* Internal Components (Visualized as glowing cubes) */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[0, i * 0.5 - 1, 0.4]}>
            <boxGeometry args={[1.5, 0.2, 0.1]} />
            <meshStandardMaterial 
              color={color} 
              emissive={color} 
              emissiveIntensity={5} 
            />
          </mesh>
        ))}

        {/* Floating Data Rings */}
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh position={[0, 0, 1.8]}>
            <torusGeometry args={[1.5, 0.02, 16, 100]} />
            <MeshDistortMaterial color={color} speed={2} distort={0.3} />
          </mesh>
          <mesh position={[0, 0, -1.8]}>
            <torusGeometry args={[1.2, 0.01, 16, 100]} />
            <MeshWobbleMaterial color={color} speed={3} factor={0.5} />
          </mesh>
        </group>

        {/* Label */}
        <Text
          position={[0, 1.8, 0]}
          fontSize={0.2}
          color="white"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff"
        >
          {name}
        </Text>
      </Float>

      <ContactShadows 
        position={[0, -2, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2} 
        far={4.5} 
      />
    </group>
  );
};

interface MachineViewerProps {
  isOpen: boolean;
  onClose: () => void;
  machine: {
    name: string;
    price: number;
    image: string;
  } | null;
}

export const MachineViewer: React.FC<MachineViewerProps> = ({ isOpen, onClose, machine }) => {
  if (!machine) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl aspect-video bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10 pointer-events-none">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">{machine.name}</h2>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">3D Hardware Inspection</p>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-all pointer-events-auto"
              >
                <X size={24} />
              </button>
            </div>

            {/* Controls Info */}
            <div className="absolute bottom-6 left-6 flex gap-4 z-10 pointer-events-none">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <RotateCw size={12} /> Rotate
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <ZoomIn size={12} /> Zoom
              </div>
            </div>

            {/* 3D Canvas */}
            <div className="w-full h-full cursor-grab active:cursor-grabbing">
              <Canvas shadows>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
                <Suspense fallback={null}>
                  <Stage environment="city" intensity={0.5}>
                    <MachineModel name={machine.name} price={machine.price} />
                  </Stage>
                  <OrbitControls 
                    enablePan={false} 
                    minDistance={4} 
                    maxDistance={12} 
                    autoRotate 
                    autoRotateSpeed={0.5}
                  />
                  <Environment preset="city" />
                </Suspense>
              </Canvas>
            </div>

            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05)_0%,transparent_70%)]"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
