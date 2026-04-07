import React from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

export const LoginCircle: React.FC = () => {
  return (
    <div className="relative w-64 h-64 mx-auto mb-12 flex items-center justify-center" style={{ perspective: '1500px' }}>
      {/* Outer Atmosphere Glow */}
      <div className="absolute inset-0 rounded-full bg-accent-purple/10 blur-[80px] animate-pulse" />
      
      {/* Holographic Grid Base */}
      <motion.div 
        initial={{ opacity: 0, rotateX: 75 }}
        animate={{ opacity: 0.2, rotateX: 75, rotateZ: 360 }}
        transition={{ 
          opacity: { duration: 2 },
          rotateZ: { duration: 20, repeat: Infinity, ease: "linear" }
        }}
        className="absolute bottom-[-20px] w-80 h-80 border-[1px] border-accent-purple/30 rounded-full"
        style={{ 
          background: 'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(168,85,247,0.1) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(168,85,247,0.1) 20px)',
          maskImage: 'radial-gradient(circle, black, transparent 70%)'
        }}
      />

      {/* 3D Rotating Sphere Container */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        animate={{ 
          rotateY: 360,
          rotateX: [10, -10, 10]
        }}
        transition={{ 
          rotateY: { duration: 25, repeat: Infinity, ease: "linear" },
          rotateX: { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Horizontal Ring with Energy Pulse */}
        <div className="absolute w-full h-full rounded-full border-2 border-accent-purple/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
          <motion.div 
            animate={{ rotateZ: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent-purple rounded-full shadow-[0_0_15px_rgba(168,85,247,1)]"
          />
        </div>
        
        {/* Vertical Ring with Energy Pulse */}
        <div 
          className="absolute w-full h-full rounded-full border-2 border-accent-yellow/20 shadow-[0_0_20px_rgba(250,204,21,0.1)]" 
          style={{ transform: 'rotateX(90deg)' }}
        >
          <motion.div 
            animate={{ rotateZ: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent-yellow rounded-full shadow-[0_0_15px_rgba(250,204,21,1)]"
          />
        </div>

        {/* Diagonal Ring 1 */}
        <div 
          className="absolute w-full h-full rounded-full border border-white/10" 
          style={{ transform: 'rotateY(45deg)' }}
        />

        {/* Diagonal Ring 2 */}
        <div 
          className="absolute w-full h-full rounded-full border border-white/10" 
          style={{ transform: 'rotateY(-45deg)' }}
        />

        {/* Inner Core Sphere */}
        <motion.div
          animate={{ 
            scale: [1, 1.15, 1],
            rotateY: [0, 360],
            boxShadow: [
              "0 0 30px rgba(168,85,247,0.4)",
              "0 0 60px rgba(168,85,247,0.7)",
              "0 0 30px rgba(168,85,247,0.4)"
            ]
          }}
          transition={{ 
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            rotateY: { duration: 15, repeat: Infinity, ease: "linear" },
            boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-28 h-28 rounded-full bg-gradient-to-br from-accent-purple via-accent-purple/90 to-accent-yellow flex items-center justify-center z-10 border-2 border-white/30"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.5),transparent)]" />
          <motion.div
            animate={{ rotateY: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <Cpu size={48} className="text-white relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Orbiting Tech Particles with Trails */}
      <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              rotateY: 360,
              rotateX: [0, 360, 0],
              z: [60, -60, 60]
            }}
            transition={{
              rotateY: { duration: 4 + i, repeat: Infinity, ease: "linear" },
              rotateX: { duration: 6 + i, repeat: Infinity, ease: "linear" },
              z: { duration: 7 + i, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-accent-yellow rounded-full shadow-[0_0_12px_rgba(250,204,21,1)]"
            style={{
              marginLeft: '-4px',
              marginTop: '-4px',
              transformOrigin: `${40 + (i * 12)}px 50%`,
            }}
          >
            <div className="absolute inset-0 rounded-full bg-accent-yellow blur-[4px] opacity-50" />
          </motion.div>
        ))}
      </div>

      {/* Data Stream Lines */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: -100, opacity: [0, 0.5, 0] }}
            transition={{ 
              duration: 2 + i, 
              repeat: Infinity, 
              delay: i * 0.5,
              ease: "linear" 
            }}
            className="absolute w-[1px] h-20 bg-gradient-to-b from-transparent via-accent-purple to-transparent"
            style={{ left: `${20 + i * 20}%` }}
          />
        ))}
      </div>

      {/* Holographic Scanline */}
      <motion.div
        animate={{ y: [0, 256, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-accent-purple/5 to-transparent h-1 w-full z-20 opacity-30"
      />
    </div>
  );
};
