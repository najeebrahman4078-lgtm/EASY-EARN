import React, { useState } from 'react';
import { Transaction } from '../types';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdraw' | 'referral' | 'purchase' | 'collect' | 'exchange'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(tx => {
    const matchesType = filterType === 'all' || tx.type.includes(filterType);
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
    const matchesSearch = tx.details.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tx.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (tx.txId && tx.txId.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${filterType === 'all' ? 'bg-neon-cyan text-black border-neon-cyan' : 'bg-white/5 text-gray-500 border-white/10'}`}
          >
            All
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterType('deposit')}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${filterType === 'deposit' ? 'bg-neon-cyan text-black border-neon-cyan' : 'bg-white/5 text-gray-500 border-white/10'}`}
          >
            Deposits
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterType('withdraw')}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${filterType === 'withdraw' ? 'bg-neon-cyan text-black border-neon-cyan' : 'bg-white/5 text-gray-500 border-white/10'}`}
          >
            Withdrawals
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterType('referral')}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${filterType === 'referral' ? 'bg-neon-cyan text-black border-neon-cyan' : 'bg-white/5 text-gray-500 border-white/10'}`}
          >
            Referrals
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterType('purchase')}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${filterType === 'purchase' ? 'bg-neon-cyan text-black border-neon-cyan' : 'bg-white/5 text-gray-500 border-white/10'}`}
          >
            Purchases
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterType('collect')}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${filterType === 'collect' ? 'bg-neon-cyan text-black border-neon-cyan' : 'bg-white/5 text-gray-500 border-white/10'}`}
          >
            Earnings
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterType('exchange')}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${filterType === 'exchange' ? 'bg-neon-cyan text-black border-neon-cyan' : 'bg-white/5 text-gray-500 border-white/10'}`}
          >
            Exchanges
          </motion.button>
        </div>

        <div className="flex flex-wrap gap-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${filterStatus === 'all' ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-500'}`}
          >
            Any Status
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${filterStatus === 'pending' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-white/5 text-gray-500'}`}
          >
            Pending
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${filterStatus === 'approved' ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-white/5 text-gray-500'}`}
          >
            Approved
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterStatus('rejected')}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${filterStatus === 'rejected' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-white/5 text-gray-500'}`}
          >
            Rejected
          </motion.button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Search by ID, method or account..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-medium focus:outline-none focus:border-neon-cyan transition-colors"
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTransactions.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-12 bg-white/5 rounded-3xl border border-dashed border-white/10"
            >
              <History size={40} className="mx-auto text-gray-700 mb-3" />
              <p className="text-gray-500 text-sm font-medium">No transactions found matching filters.</p>
            </motion.div>
          ) : (
            filteredTransactions.map((tx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={tx.id} 
                className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      tx.type === 'deposit' || tx.type === 'referral' || tx.type === 'collect'
                        ? 'bg-neon-cyan/10 text-neon-cyan group-hover:bg-neon-cyan/20' 
                        : 'bg-neon-purple/10 text-neon-purple group-hover:bg-neon-purple/20'
                    }`}>
                      {tx.type === 'deposit' || tx.type === 'referral' || tx.type === 'collect' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-black text-sm capitalize">{tx.type.replace('_', ' ')}</p>
                        <span className="text-[10px] px-1.5 py-0.5 bg-white/5 rounded text-gray-400 font-bold uppercase tracking-tighter">
                          {tx.method}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-medium">
                        {new Date(tx.timestamp).toLocaleString(undefined, { 
                          month: 'short', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-black ${tx.type === 'deposit' || tx.type === 'referral' || tx.type === 'collect' ? 'text-white' : 'text-gray-300'}`}>
                      {tx.type === 'deposit' || tx.type === 'referral' || tx.type === 'collect' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                      {tx.status === 'pending' && <Clock size={10} className="text-amber-500" />}
                      {tx.status === 'approved' && <CheckCircle2 size={10} className="text-green-500" />}
                      {tx.status === 'rejected' && <XCircle size={10} className="text-red-500" />}
                      <p className={`text-[9px] font-black uppercase tracking-[0.1em] ${
                        tx.status === 'approved' ? 'text-green-500' : 
                        tx.status === 'rejected' ? 'text-red-500' : 
                        'text-amber-500'
                      }`}>
                        {tx.status}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Expanded Details */}
                <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-1">Account / Wallet</p>
                    <p className="text-[10px] font-mono text-gray-300 truncate">{tx.details}</p>
                  </div>
                  {tx.txId && (
                    <div>
                      <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-1">Ref ID</p>
                      <p className="text-[10px] font-mono text-gray-300 truncate">{tx.txId}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const History = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);
