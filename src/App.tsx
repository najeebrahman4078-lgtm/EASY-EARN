import React, { useState, useEffect, useRef, Component } from 'react';
import { 
  Home, 
  Cpu, 
  Wallet, 
  User, 
  ShieldCheck, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCcw, 
  Copy, 
  Users, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Zap,
  Layers,
  Coins,
  History,
  LogOut,
  Menu,
  X,
  Eye,
  DollarSign,
  Smartphone,
  CreditCard,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  increment,
  runTransaction,
  writeBatch,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile, Machine, UserMachine, Transaction } from './types';
import { format } from 'date-fns';

// --- Constants ---
const COIN_PRICE = 1.2; // 1 MR COIN = 1.2 USD
const ADMIN_EMAIL = "najeebrahman4078@gmail.com";
const VIEW_EARNING_RATE = 0.01; // Admin earns $0.01 per view

// --- Components ---

const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`glass-card p-6 ${className}`}>
    {children}
  </div>
);

const BottomNav: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void; isAdmin: boolean }> = ({ activeTab, setActiveTab, isAdmin }) => (
  <div className="fixed bottom-0 left-0 right-0 bottom-nav-glass h-20 px-6 flex items-center justify-between z-50">
    <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-neon-cyan' : 'text-gray-500'}`}>
      <Home size={24} />
      <span className="text-[10px] font-bold uppercase tracking-widest">Market</span>
    </button>
    <button onClick={() => setActiveTab('mining')} className={`flex flex-col items-center gap-1 ${activeTab === 'mining' ? 'text-neon-cyan' : 'text-gray-500'}`}>
      <Cpu size={24} />
      <span className="text-[10px] font-bold uppercase tracking-widest">Fleet</span>
    </button>
    <div className="relative -top-6">
      <button 
        onClick={() => setActiveTab('wallet')} 
        className={`w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan to-blue-600 flex items-center justify-center shadow-lg shadow-neon-cyan/20 border-4 border-[#050505] ${activeTab === 'wallet' ? 'scale-110' : ''} transition-transform`}
      >
        <Coins size={32} className="text-white" />
      </button>
    </div>
    <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-neon-cyan' : 'text-gray-500'}`}>
      <User size={24} />
      <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
    </button>
    {isAdmin && (
      <button onClick={() => setActiveTab('admin')} className={`flex flex-col items-center gap-1 ${activeTab === 'admin' ? 'text-neon-cyan' : 'text-gray-500'}`}>
        <ShieldCheck size={24} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Admin</span>
      </button>
    )}
  </div>
);

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="pb-24 pt-6 px-4"
  >
    {children}
  </motion.div>
);

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong.";
      try {
        const parsed = JSON.parse(this.state.error?.message || "");
        if (parsed.error && parsed.error.includes("insufficient permissions")) {
          errorMessage = "Security access denied. Please contact support.";
        }
      } catch (e) {
        // Not JSON
      }
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-red-500">System Error</h2>
            <p className="text-gray-400 max-w-xs mx-auto">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest"
            >
              Reboot System
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [userMachines, setUserMachines] = useState<UserMachine[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [globalStats, setGlobalStats] = useState({ totalViews: 0, adminEarnings: 0 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Increment global views on login
        const statsRef = doc(db, 'system', 'stats');
        try {
          await updateDoc(statsRef, {
            totalViews: increment(1),
            adminEarnings: increment(VIEW_EARNING_RATE)
          });
        } catch (error) {
          try {
            // If doc doesn't exist, create it
            await setDoc(statsRef, { totalViews: 1, adminEarnings: VIEW_EARNING_RATE });
          } catch (createError) {
            handleFirestoreError(createError, OperationType.WRITE, 'system/stats');
          }
        }

        // Listen to user profile
        const userRef = doc(db, 'users', firebaseUser.uid);
        onSnapshot(userRef, (doc) => {
          if (doc.exists()) setUserProfile(doc.data() as UserProfile);
        }, (error) => handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`));

        // Listen to user machines
        const qMachines = query(collection(db, 'userMachines'), where('userId', '==', firebaseUser.uid));
        onSnapshot(qMachines, (snapshot) => {
          setUserMachines(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserMachine)));
        }, (error) => handleFirestoreError(error, OperationType.GET, 'userMachines'));

        // Listen to transactions
        const qTx = query(collection(db, 'transactions'), where('userId', '==', firebaseUser.uid), orderBy('timestamp', 'desc'), limit(10));
        onSnapshot(qTx, (snapshot) => {
          setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)));
        }, (error) => handleFirestoreError(error, OperationType.GET, 'transactions'));

        // Listen to global stats
        onSnapshot(doc(db, 'system', 'stats'), (doc) => {
          if (doc.exists()) setGlobalStats(doc.data() as any);
        }, (error) => handleFirestoreError(error, OperationType.GET, 'system/stats'));

      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    // Mock machines for demo
    setMachines([
      { 
        id: 'm1', 
        name: 'NEON MINER V1', 
        price: 50, 
        dailyIncome: 2.5, 
        duration: 30, 
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1000',
        description: 'Entry-level mining rig optimized for low-power consumption.'
      },
      { 
        id: 'm2', 
        name: 'QUANTUM CORE', 
        price: 150, 
        dailyIncome: 8.0, 
        duration: 30, 
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000',
        description: 'Utilizes quantum entanglement to bypass traditional hash limits.'
      },
      { 
        id: 'm3', 
        name: 'CYBER RIG X', 
        price: 500, 
        dailyIncome: 30.0, 
        duration: 30, 
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
        description: 'Advanced multi-threaded processing unit with liquid cooling.'
      },
      { 
        id: 'm4', 
        name: 'TITAN STATION', 
        price: 1500, 
        dailyIncome: 100.0, 
        duration: 30, 
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000',
        description: 'Orbital mining station with massive processing power and zero latency.'
      }
    ]);

    return () => unsubscribe();
  }, []);

  const [referralInput, setReferralInput] = useState('');

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Check if user profile exists
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          balance: 0,
          coinBalance: 0,
          referralCode: Math.random().toString(36).substring(7).toUpperCase(),
          referredBy: referralInput.trim() || undefined,
          role: firebaseUser.email === ADMIN_EMAIL ? 'admin' : 'user',
          viewCount: 0,
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
      }
      toast.success("Welcome back, Operative.");
    } catch (error) {
      toast.error("Authentication failed.");
    }
  };

  const handleRent = async (machine: Machine) => {
    if (!userProfile) return;
    
    // Check if user already has this machine (One-time purchase rule)
    const alreadyHas = userMachines.some(um => um.machineId === machine.id);
    if (alreadyHas) {
      toast.error("You already own this model. Only one unit per operative allowed.");
      return;
    }

    if (userProfile.balance < machine.price) {
      toast.error("Insufficient credits. Deposit more funds.");
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', userProfile.uid);
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) throw new Error("User not found");
        
        const userData = userSnap.data() as UserProfile;
        if (userData.balance < machine.price) throw new Error("Insufficient balance");

        // Deduct balance
        transaction.update(userRef, { balance: userData.balance - machine.price });

        // Referral Payout (10%)
        if (userData.referredBy) {
          const qReferrer = query(collection(db, 'users'), where('referralCode', '==', userData.referredBy));
          const referrerSnap = await getDocs(qReferrer).catch(e => {
            handleFirestoreError(e, OperationType.GET, 'users');
            throw e;
          });
          if (!referrerSnap.empty) {
            const referrerRef = doc(db, 'users', referrerSnap.docs[0].id);
            transaction.update(referrerRef, { balance: increment(machine.price * 0.1) });
          }
        }

        // Add user machine
        const userMachineRef = doc(collection(db, 'userMachines'));
        const now = new Date();
        const expiresAt = new Date(now.getTime() + (machine.duration * 24 * 60 * 60 * 1000));
        
        transaction.set(userMachineRef, {
          userId: userProfile.uid,
          machineId: machine.id,
          dailyIncome: machine.dailyIncome,
          timestamp: now.toISOString(),
          expiresAt: expiresAt.toISOString(),
          lastCollectedAt: now.toISOString()
        });
      });
      toast.success(`Successfully deployed ${machine.name}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'userMachines/rent');
      toast.error("Deployment failed.");
    }
  };

  // --- Admin Functions ---
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    if (userProfile?.role === 'admin') {
      const qAllTx = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'), limit(50));
      const unsub = onSnapshot(qAllTx, (snapshot) => {
        setAllTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)));
      });
      return () => unsub();
    }
  }, [userProfile]);

  const [processingTx, setProcessingTx] = useState<string | null>(null);

  const handleApproveTx = async (tx: Transaction) => {
    setProcessingTx(tx.id);
    try {
      await runTransaction(db, async (transaction) => {
        const txRef = doc(db, 'transactions', tx.id);
        const userRef = doc(db, 'users', tx.userId);
        
        transaction.update(txRef, { status: 'approved' });
        if (tx.type === 'deposit') {
          transaction.update(userRef, { balance: increment(tx.amount) });
        }
      });
      toast.success("Transaction approved.");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `transactions/${tx.id}/approve`);
      toast.error("Approval failed.");
    } finally {
      setProcessingTx(null);
    }
  };

  const handleRejectTx = async (tx: Transaction) => {
    setProcessingTx(tx.id);
    try {
      await runTransaction(db, async (transaction) => {
        const txRef = doc(db, 'transactions', tx.id);
        const userRef = doc(db, 'users', tx.userId);
        
        transaction.update(txRef, { status: 'rejected' });
        if (tx.type === 'withdraw') {
          transaction.update(userRef, { balance: increment(tx.amount) });
        }
      });
      toast.success("Transaction rejected.");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `transactions/${tx.id}/reject`);
      toast.error("Rejection failed.");
    } finally {
      setProcessingTx(null);
    }
  };

  const handleCollect = async (um: UserMachine) => {
    const now = new Date();
    const lastCollected = new Date(um.lastCollectedAt);
    const hoursSinceLast = (now.getTime() - lastCollected.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLast < 24) {
      const hoursLeft = Math.ceil(24 - hoursSinceLast);
      toast.error(`Mining cycle incomplete. ${hoursLeft}h remaining.`);
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', um.userId);
        const umRef = doc(db, 'userMachines', um.id);
        
        transaction.update(userRef, { balance: increment(um.dailyIncome) });
        transaction.update(umRef, { lastCollectedAt: now.toISOString() });
      });
      toast.success(`Collected $${um.dailyIncome} from mining operations.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `userMachines/${um.id}/collect`);
      toast.error("Collection failed.");
    }
  };

  const handleExchange = async (type: 'buy' | 'sell', amount: number) => {
    if (!userProfile) return;
    if (amount <= 0) return;

    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', userProfile.uid);
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) throw new Error("User not found");
        const userData = userSnap.data() as UserProfile;

        if (type === 'buy') {
          const cost = amount * COIN_PRICE;
          if (userData.balance < cost) throw new Error("Insufficient balance");
          transaction.update(userRef, { 
            balance: userData.balance - cost,
            coinBalance: userData.coinBalance + amount
          });
        } else {
          if (userData.coinBalance < amount) throw new Error("Insufficient coin balance");
          const credit = amount * COIN_PRICE;
          transaction.update(userRef, { 
            balance: userData.balance + credit,
            coinBalance: userData.coinBalance - amount
          });
        }
      });
      toast.success("Exchange completed successfully.");
    } catch (error: any) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userProfile.uid}/exchange`);
      toast.error(error.message || "Exchange failed.");
    }
  };

  const handleTransaction = async (type: 'deposit' | 'withdraw', amount: number, method: 'Easypaisa' | 'OKX', details: string) => {
    if (!userProfile) return;
    if (amount <= 0) return;

    if (type === 'withdraw' && userProfile.balance < amount) {
      toast.error("Insufficient balance for withdrawal.");
      return;
    }

    try {
      const txRef = collection(db, 'transactions');
      await addDoc(txRef, {
        userId: userProfile.uid,
        type,
        amount,
        status: 'pending',
        method,
        details,
        timestamp: new Date().toISOString()
      });

      if (type === 'withdraw') {
        await updateDoc(doc(db, 'users', userProfile.uid), {
          balance: increment(-amount)
        }).catch(e => handleFirestoreError(e, OperationType.UPDATE, `users/${userProfile.uid}`));
      }

      toast.success(`${type === 'deposit' ? 'Deposit' : 'Withdrawal'} request submitted.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'transactions');
      toast.error("Transaction failed.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-purple/10 blur-[120px] rounded-full"></div>
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center z-10"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-neon-cyan to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-neon-cyan/20 rotate-12">
              <Cpu size={48} className="text-white" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              NEURAL MINER
            </h1>
            <p className="text-gray-500 mb-12 max-w-xs mx-auto font-medium leading-relaxed">
              The next generation of decentralized resource extraction.
            </p>
            
            <div className="w-full max-w-xs mx-auto space-y-4">
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Referral Code (Optional)"
                  value={referralInput}
                  onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-neon-cyan transition-colors"
                />
              </div>
              
              <button 
                onClick={handleLogin}
                className="w-full bg-white text-black font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-all active:scale-95 shadow-xl"
              >
                <Globe size={20} />
                Initialize System
              </button>
            </div>
          </motion.div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#050505] text-white">
        <Toaster position="top-center" richColors />
      
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-[#050505]/80 backdrop-blur-md z-40">
        <div>
          <h2 className="text-[10px] font-black text-neon-cyan uppercase tracking-[0.3em] mb-1">System Status</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>
            <span className="text-sm font-bold tracking-tight">Operative Active</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Balance</p>
            <p className="text-lg font-black text-white">${userProfile?.balance.toFixed(2)}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <User size={20} className="text-gray-400" />
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <PageTransition key="home">
            <div className="space-y-8">
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black tracking-tight">Marketplace</h3>
                  <div className="px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/20 rounded-full">
                    <span className="text-[10px] font-bold text-neon-cyan uppercase tracking-widest">New Hardware</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {machines.map(machine => (
                    <GlassCard key={machine.id} className="relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 blur-3xl -z-10 group-hover:bg-neon-cyan/10 transition-colors"></div>
                      <div className="flex gap-6">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                          <img src={machine.image} alt={machine.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold mb-1">{machine.name}</h4>
                          <p className="text-xs text-gray-500 mb-4 line-clamp-2">{machine.description}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Yield</p>
                              <p className="text-sm font-black text-neon-cyan">${machine.dailyIncome}/day</p>
                            </div>
                            <button 
                              onClick={() => handleRent(machine)}
                              className="px-6 py-2 bg-white text-black font-bold text-xs rounded-xl hover:bg-neon-cyan hover:text-white transition-all"
                            >
                              Deploy ${machine.price}
                            </button>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </section>
            </div>
          </PageTransition>
        )}

        {activeTab === 'mining' && (
          <PageTransition key="mining">
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <GlassCard className="p-4 border-l-4 border-l-neon-cyan">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Active Units</p>
                  <p className="text-2xl font-black">{userMachines.length}</p>
                </GlassCard>
                <GlassCard className="p-4 border-l-4 border-l-neon-purple">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Daily Yield</p>
                  <p className="text-2xl font-black text-neon-purple">
                    ${userMachines.reduce((acc, curr) => acc + curr.dailyIncome, 0).toFixed(1)}
                  </p>
                </GlassCard>
              </div>

              <section>
                <h3 className="text-2xl font-black tracking-tight mb-6">Active Fleet</h3>
                {userMachines.length === 0 ? (
                  <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <Cpu size={48} className="mx-auto text-gray-700 mb-4" />
                    <p className="text-gray-500 font-medium">No active hardware detected.</p>
                    <button onClick={() => setActiveTab('home')} className="mt-4 text-neon-cyan font-bold text-sm underline">Browse Market</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userMachines.map(um => {
                      const machine = machines.find(m => m.id === um.machineId);
                      return (
                        <GlassCard key={um.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 flex items-center justify-center">
                                <Zap size={24} className="text-neon-cyan" />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm">{machine?.name || 'Unknown Unit'}</h4>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Mining Active</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleCollect(um)}
                              className="px-4 py-2 bg-neon-cyan/10 border border-neon-cyan/20 rounded-xl text-neon-cyan font-bold text-xs hover:bg-neon-cyan hover:text-white transition-all"
                            >
                              Collect
                            </button>
                          </div>
                        </GlassCard>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </PageTransition>
        )}

        {activeTab === 'wallet' && (
          <PageTransition key="wallet">
            <div className="space-y-8">
              {/* Coin Exchange Section */}
              <GlassCard className="bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 border-neon-purple/30 relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-neon-purple/20 blur-[60px] rounded-full"></div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight mb-1">MR COIN</h3>
                    <p className="text-xs font-bold text-neon-purple uppercase tracking-widest">Market Value: $1.20</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl">
                    <Coins size={32} className="text-neon-purple" />
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Your Balance</p>
                    <p className="text-3xl font-black">{userProfile?.coinBalance.toFixed(2)} <span className="text-sm font-bold text-gray-500">MRC</span></p>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">USD Value</p>
                    <p className="text-3xl font-black text-white">${((userProfile?.coinBalance || 0) * COIN_PRICE).toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      const amt = prompt("Enter amount of MR COIN to buy:");
                      if (amt) handleExchange('buy', parseFloat(amt));
                    }}
                    className="py-3 bg-white text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Buy
                  </button>
                  <button 
                    onClick={() => {
                      const amt = prompt("Enter amount of MR COIN to sell:");
                      if (amt) handleExchange('sell', parseFloat(amt));
                    }}
                    className="py-3 bg-white/10 border border-white/10 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2"
                  >
                    <RefreshCcw size={16} /> Sell
                  </button>
                </div>
              </GlassCard>

              {/* Deposit/Withdraw Section */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    const amt = prompt("Enter deposit amount ($):");
                    const details = prompt("Enter Easypaisa Number:");
                    if (amt && details) handleTransaction('deposit', parseFloat(amt), 'Easypaisa', details);
                  }}
                  className="p-6 glass-card border-neon-cyan/20 flex flex-col items-center gap-3 hover:bg-neon-cyan/5 transition-colors"
                >
                  <ArrowDownLeft size={32} className="text-neon-cyan" />
                  <span className="font-bold text-sm">Deposit</span>
                </button>
                <button 
                  onClick={() => {
                    const amt = prompt("Enter withdrawal amount ($):");
                    const method = prompt("Enter method (Easypaisa or OKX):") as any;
                    const details = prompt("Enter Account/Wallet Details:");
                    if (amt && method && details) handleTransaction('withdraw', parseFloat(amt), method, details);
                  }}
                  className="p-6 glass-card border-neon-purple/20 flex flex-col items-center gap-3 hover:bg-neon-purple/5 transition-colors"
                >
                  <ArrowUpRight size={32} className="text-neon-purple" />
                  <span className="font-bold text-sm">Withdraw</span>
                </button>
              </div>

              {/* Recent Transactions */}
              <section>
                <h3 className="text-lg font-black tracking-tight mb-4 flex items-center gap-2">
                  <History size={20} className="text-gray-500" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {transactions.map(tx => (
                    <div key={tx.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'deposit' ? 'bg-neon-cyan/10 text-neon-cyan' : 'bg-neon-purple/10 text-neon-purple'}`}>
                          {tx.type === 'deposit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                        </div>
                        <div>
                          <p className="font-bold text-sm capitalize">{tx.type} via {tx.method}</p>
                          <p className="text-[10px] text-gray-500">{tx.timestamp.split('T')[0]}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black">${tx.amount}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${tx.status === 'approved' ? 'text-green-500' : tx.status === 'rejected' ? 'text-red-500' : 'text-amber-500'}`}>
                          {tx.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </PageTransition>
        )}

        {activeTab === 'profile' && (
          <PageTransition key="profile">
            <div className="space-y-8">
              <GlassCard className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple p-[2px] mx-auto mb-4">
                  <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center overflow-hidden">
                    <User size={40} className="text-white/20" />
                  </div>
                </div>
                <h3 className="text-xl font-black mb-1">{userProfile?.email.split('@')[0]}</h3>
                <p className="text-xs text-gray-500 font-medium mb-6">{userProfile?.email}</p>
                
                <div className="flex items-center justify-center gap-8 py-4 border-t border-white/5">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Level</p>
                    <p className="font-black text-neon-cyan">Operative</p>
                  </div>
                  <div className="w-px h-8 bg-white/5"></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Joined</p>
                    <p className="font-black">2024</p>
                  </div>
                </div>
              </GlassCard>

              <section>
                <h3 className="text-lg font-black tracking-tight mb-4 flex items-center gap-2">
                  <Users size={20} className="text-gray-500" />
                  Referral Program
                </h3>
                <GlassCard className="bg-neon-cyan/5 border-neon-cyan/10">
                  <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                    Invite new operatives to the network and earn 10% of their mining deployment credits.
                  </p>
                  <div className="p-4 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                    <code className="text-neon-cyan font-black tracking-widest">{userProfile?.referralCode}</code>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(userProfile?.referralCode || '');
                        toast.success("Code copied to neural link.");
                      }}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Copy size={18} className="text-gray-400" />
                    </button>
                  </div>
                </GlassCard>
              </section>

              <button 
                onClick={() => signOut(auth)}
                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={14} />
                Terminate Session
              </button>
            </div>
          </PageTransition>
        )}

        {activeTab === 'admin' && userProfile?.role === 'admin' && (
          <PageTransition key="admin">
            <div className="space-y-8">
              <h3 className="text-3xl font-black tracking-tight">Command Center</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <GlassCard className="bg-gradient-to-br from-neon-cyan/20 to-transparent border-neon-cyan/30">
                  <div className="flex items-center justify-between mb-4">
                    <Eye size={24} className="text-neon-cyan" />
                    <span className="text-[10px] font-bold text-neon-cyan uppercase tracking-widest">Network Traffic</span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Viewers</p>
                  <p className="text-4xl font-black mb-4">{globalStats.totalViews}</p>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Viewer Earnings</p>
                      <p className="text-xl font-black text-white">${globalStats.adminEarnings.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={async () => {
                        const statsRef = doc(db, 'system', 'stats');
                        await updateDoc(statsRef, { adminEarnings: 0 });
                        await updateDoc(doc(db, 'users', userProfile.uid), { balance: increment(globalStats.adminEarnings) });
                        toast.success("Earnings transferred to main balance.");
                      }}
                      className="px-4 py-2 bg-neon-cyan text-black font-bold text-xs rounded-xl"
                    >
                      Withdraw
                    </button>
                  </div>
                </GlassCard>
              </div>

              <section>
                <h3 className="text-lg font-black tracking-tight mb-4">Pending Authorizations</h3>
                <div className="space-y-3">
                  {allTransactions.filter(tx => tx.status === 'pending').length === 0 ? (
                    <p className="text-center py-10 text-gray-600 text-sm font-medium italic">No pending authorizations required.</p>
                  ) : (
                    allTransactions.filter(tx => tx.status === 'pending').map(tx => (
                      <div key={tx.id} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'deposit' ? 'bg-neon-cyan/10 text-neon-cyan' : 'bg-neon-purple/10 text-neon-purple'}`}>
                              {tx.type === 'deposit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                            </div>
                            <div>
                              <p className="font-bold text-sm capitalize">{tx.type} Request</p>
                              <p className="text-[10px] text-gray-500">{tx.method} - {tx.details}</p>
                            </div>
                          </div>
                          <p className="font-black text-lg">${tx.amount}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => handleApproveTx(tx)}
                            disabled={processingTx === tx.id}
                            className={`py-2 border font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 ${
                              processingTx === tx.id 
                                ? 'bg-white/5 border-white/10 text-gray-500 cursor-not-allowed' 
                                : 'bg-green-500/20 border-green-500/30 text-green-500 hover:bg-green-500 hover:text-white'
                            }`}
                          >
                            {processingTx === tx.id ? <RefreshCcw size={12} className="animate-spin" /> : 'Approve'}
                          </button>
                          <button 
                            onClick={() => handleRejectTx(tx)}
                            disabled={processingTx === tx.id}
                            className={`py-2 border font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 ${
                              processingTx === tx.id 
                                ? 'bg-white/5 border-white/10 text-gray-500 cursor-not-allowed' 
                                : 'bg-red-500/20 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white'
                            }`}
                          >
                            {processingTx === tx.id ? <RefreshCcw size={12} className="animate-spin" /> : 'Reject'}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </PageTransition>
        )}
      </AnimatePresence>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={userProfile?.role === 'admin'} />
    </div>
    </ErrorBoundary>
  );
}
