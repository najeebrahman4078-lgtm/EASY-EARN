import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, userName }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-neon-cyan/30 rounded-3xl p-8 overflow-hidden shadow-2xl shadow-neon-cyan/20"
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-purple/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center mb-6">
                <ShieldCheck size={32} className="text-neon-cyan" />
              </div>
              
              <h2 className="text-3xl font-black tracking-tight mb-2">
                Welcome, <span className="text-neon-cyan">Operative</span>
                {userName && <span className="block text-lg text-gray-400 font-medium">{userName}</span>}
              </h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Your neural link has been established. You are now authorized to acquire mining hardware, generate daily yield, and exchange MR COIN.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-1">
                    <Cpu size={14} className="text-neon-cyan" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Acquire Hardware</h4>
                    <p className="text-xs text-gray-500">Purchase mining rigs from the Marketplace to start your operation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-1">
                    <Zap size={14} className="text-neon-purple" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Generate Yield</h4>
                    <p className="text-xs text-gray-500">Collect your daily harvest from active units in the Fleet tab.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-neon-cyan text-black font-black rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors"
              >
                Acknowledge & Start <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
