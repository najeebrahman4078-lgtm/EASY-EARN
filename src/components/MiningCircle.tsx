import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap } from 'lucide-react';

interface MiningCircleProps {
  isActive: boolean;
  dailyIncome: number;
}

export const MiningCircle: React.FC<MiningCircleProps> = ({ isActive, dailyIncome }) => {
  return (
    <div className="relative w-80 h-80 mx-auto flex items-center justify-center" style={{ perspective: '1500px' }}>
      {/* Dynamic Background Glow */}
      <motion.div 
        animate={{ 
          scale: isActive ? [1, 1.3, 1] : [1, 1.05, 1],
          opacity: isActive ? [0.3, 0.5, 0.3] : [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute inset-0 rounded-full blur-[100px] transition-colors duration-1000 ${isActive ? 'bg-accent-purple' : 'bg-gray-800'}`} 
      />

      {/* Holographic Grid Base */}
      <motion.div 
        initial={{ opacity: 0, rotateX: 75 }}
        animate={{ opacity: isActive ? 0.3 : 0.1, rotateX: 75, rotateZ: 360 }}
        transition={{ 
          opacity: { duration: 2 },
          rotateZ: { duration: 25, repeat: Infinity, ease: "linear" }
        }}
        className="absolute bottom-[-30px] w-96 h-96 border-[1px] border-accent-purple/20 rounded-full"
        style={{ 
          background: 'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(168,85,247,0.1) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(168,85,247,0.1) 20px)',
          maskImage: 'radial-gradient(circle, black, transparent 70%)'
        }}
      />

      {/* 3D Rotating Rings Container */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        animate={{ 
          rotateX: [65, 75, 65], 
          rotateY: [-10, 10, -10],
          rotateZ: isActive ? 360 : 0
        }}
        transition={{ 
          rotateX: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          rotateY: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          rotateZ: { duration: 30, repeat: Infinity, ease: "linear" }
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Outer Tech Ring with Energy Pulse */}
        <div className={`absolute w-full h-full rounded-full border-[3px] border-dashed border-opacity-20 ${isActive ? 'border-accent-purple shadow-[0_0_40px_rgba(168,85,247,0.5)]' : 'border-gray-700'}`}>
          {isActive && (
            <motion.div 
              animate={{ rotateZ: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-accent-purple rounded-full shadow-[0_0_20px_rgba(168,85,247,1)]"
            />
          )}
        </div>
        
        {/* Middle Energy Ring with Energy Pulse */}
        <motion.div
          animate={{ rotateZ: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className={`absolute w-[85%] h-[85%] rounded-full border-[2px] border-opacity-40 ${isActive ? 'border-accent-yellow shadow-[0_0_30px_rgba(234,179,8,0.4)]' : 'border-gray-800'}`}
          style={{ transformStyle: 'preserve-3d', translateZ: '40px' }}
        >
          {isActive && (
            <motion.div 
              animate={{ rotateZ: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent-yellow rounded-full shadow-[0_0_15px_rgba(234,179,8,1)]"
            />
          )}
        </motion.div>

        {/* Inner Data Ring */}
        <motion.div
          animate={{ rotateZ: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className={`absolute w-[70%] h-[70%] rounded-full border border-opacity-60 ${isActive ? 'border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'border-gray-800'}`}
          style={{ transformStyle: 'preserve-3d', translateZ: '-40px' }}
        />
      </motion.div>

      {/* Floating Core */}
      <motion.div
        animate={{
          y: isActive ? [-15, 15, -15] : [-5, 5, -5],
          rotateY: isActive ? [0, 360] : [0, 0],
          scale: isActive ? [1, 1.1, 1] : [1, 1, 1],
          boxShadow: isActive ? [
            "0 0 40px rgba(168,85,247,0.3)",
            "0 0 80px rgba(168,85,247,0.6)",
            "0 0 40px rgba(168,85,247,0.3)"
          ] : "0 0 20px rgba(0,0,0,0.5)"
        }}
        transition={{ 
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          rotateY: { duration: 15, repeat: Infinity, ease: "linear" },
          scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
        }}
        className={`relative w-44 h-44 rounded-full bg-[#0a0a0a] border-2 flex flex-col items-center justify-center z-10 shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden ${isActive ? 'border-accent-purple' : 'border-gray-800'}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Core Glow Overlay */}
        <div className={`absolute inset-0 opacity-20 ${isActive ? 'bg-accent-purple' : 'bg-transparent'}`} />
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent)]" />

        {isActive ? (
          <>
            <motion.div
              animate={{ 
                scale: [1, 1.25, 1],
                filter: ["brightness(1)", "brightness(1.8)", "brightness(1)"]
              }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="mb-2 relative z-10"
            >
              <Zap size={36} className="text-accent-yellow fill-accent-yellow/30 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
            </motion.div>
            <div className="relative z-10 text-center">
              <p className="text-[11px] font-black text-accent-purple uppercase tracking-[0.4em] mb-1 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">Mining Active</p>
              <p className="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">${dailyIncome.toFixed(2)}</p>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Daily Yield</p>
            </div>
          </>
        ) : (
          <div className="relative z-10 text-center">
            <Cpu size={36} className="text-gray-700 mb-4 mx-auto opacity-50" />
            <p className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em] opacity-50">System Idle</p>
          </div>
        )}

        {/* Orbiting Energy Spheres with Trails */}
        {isActive && (
          <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  rotateZ: 360,
                  rotateX: [0, 360, 0],
                  z: [40, -40, 40]
                }}
                transition={{
                  rotateZ: { duration: 5 + i, repeat: Infinity, ease: "linear" },
                  rotateX: { duration: 7 + i, repeat: Infinity, ease: "linear" },
                  z: { duration: 8 + i, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-accent-yellow rounded-full shadow-[0_0_15px_rgba(234,179,8,1)]"
                style={{
                  marginLeft: '-5px',
                  marginTop: '-5px',
                  transformOrigin: `${60 + (20 + i * 12)}px 50%`,
                }}
              >
                <div className="absolute inset-0 rounded-full bg-accent-yellow blur-[3px] opacity-60" />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Data Stream Lines */}
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-full">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 150, opacity: 0 }}
              animate={{ y: -150, opacity: [0, 0.6, 0] }}
              transition={{ 
                duration: 1.5 + i * 0.2, 
                repeat: Infinity, 
                delay: i * 0.3,
                ease: "linear" 
              }}
              className="absolute w-[1px] h-24 bg-gradient-to-b from-transparent via-accent-yellow/40 to-transparent"
              style={{ left: `${15 + i * 14}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
