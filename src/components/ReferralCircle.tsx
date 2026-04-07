import React from 'react';
import { motion } from 'framer-motion';
import { Users, Share2, Network } from 'lucide-react';

interface ReferralCircleProps {
  referralCount: number;
}

export const ReferralCircle: React.FC<ReferralCircleProps> = ({ referralCount }) => {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center perspective-1000">
      {/* Holographic Grid Base */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15)_0%,transparent_70%)] rounded-full blur-2xl"></div>
      
      <motion.div
        animate={{ 
          rotateX: [0, 10, 0, -10, 0],
          rotateY: [0, -10, 0, 10, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full h-full flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Outer Orbiting Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-full rounded-full border border-accent-purple/20 border-dashed"
        />

        {/* Middle Rotating Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute w-[85%] h-[85%] rounded-full border-2 border-accent-yellow/30 border-t-accent-yellow border-b-accent-yellow"
        />

        {/* Inner Tech Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute w-[70%] h-[70%] rounded-full border border-accent-purple/40 flex items-center justify-center"
        >
          <div className="absolute inset-0 border-t-4 border-accent-purple rounded-full opacity-40"></div>
        </motion.div>

        {/* Central Core */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 20px rgba(168,85,247,0.3)",
              "0 0 40px rgba(168,85,247,0.6)",
              "0 0 20px rgba(168,85,247,0.3)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-32 h-32 bg-gradient-to-br from-accent-purple to-accent-yellow rounded-full flex flex-col items-center justify-center border-4 border-white/20 z-10"
        >
          <Users size={40} className="text-white drop-shadow-lg mb-1" />
          <div className="text-center">
            <span className="text-2xl font-black text-white leading-none">{referralCount}</span>
            <p className="text-[8px] font-bold text-white/80 uppercase tracking-tighter">Network</p>
          </div>
          
          {/* Core Glow */}
          <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse"></div>
        </motion.div>

        {/* Orbiting Nodes (Referral Particles) */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 10 + i * 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, delay: i * 0.3 }
            }}
            className="absolute w-full h-full"
          >
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-accent-yellow rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)] border border-white/20"
              style={{ transform: `translateY(${15 + i * 5}px)` }}
            >
              <div className="absolute inset-0 bg-white/40 rounded-full animate-ping"></div>
            </div>
          </motion.div>
        ))}

        {/* Data Streams */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`stream-${i}`}
            animate={{ 
              rotate: 360,
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 12 + i * 4, repeat: Infinity, ease: "linear" }}
            className="absolute w-[95%] h-[95%] rounded-full border border-accent-purple/10"
            style={{ rotateX: `${45 + i * 30}deg`, rotateY: `${30 + i * 20}deg` }}
          />
        ))}
      </motion.div>

      {/* Floating Icons */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 -right-4 w-10 h-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center text-accent-yellow shadow-xl"
      >
        <Share2 size={20} />
      </motion.div>
      
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-4 -left-4 w-10 h-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center text-accent-purple shadow-xl"
      >
        <Network size={20} />
      </motion.div>

      {/* Holographic Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
        <motion.div 
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-full h-1/2 bg-gradient-to-b from-transparent via-accent-purple/5 to-transparent skew-y-12"
        />
      </div>
    </div>
  );
};
