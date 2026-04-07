import React, { useState, useEffect, useRef, Component, useMemo } from 'react';
import { TransactionHistory } from './components/TransactionHistory';
import { MiningCircle } from './components/MiningCircle';
import { ReferralCircle } from './components/ReferralCircle';
import { WelcomeModal } from './components/WelcomeModal';
import { LoginCircle } from './components/LoginCircle';
import { MachineViewer } from './components/MachineViewer';
import { Loading3D } from './components/Loading3D';
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
  Globe,
  Gift,
  MessageSquare,
  Pickaxe,
  Bell,
  Share2,
  Maximize2,
  Activity,
  Clock,
  Wrench
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
const SELL_TAX = 0.08; // 8% tax on selling coins and collecting earnings
const ADMIN_EMAIL = "najeebrahman4078@gmail.com";
const VIEW_EARNING_RATE = 3; // Admin earns $3 per view

// --- Components ---

const WhiteCard: React.FC<{ children: React.ReactNode; className?: string; interactive?: boolean; onClick?: () => void }> = ({ children, className, interactive = true, onClick }) => (
  <motion.div 
    whileHover={interactive ? { y: -4, scale: 1.01, transition: { duration: 0.2 } } : {}}
    whileTap={interactive ? { scale: 0.98 } : {}}
    onClick={onClick}
    className={`card-white p-6 ${className}`}
  >
    {children}
  </motion.div>
);

const BottomNav: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void; isAdmin: boolean }> = ({ activeTab, setActiveTab, isAdmin }) => (
  <div className="fixed bottom-0 left-0 right-0 bottom-nav-glass h-20 px-2 flex items-center justify-between z-50">
    <motion.button 
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setActiveTab('home')} 
      className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'home' ? 'text-accent-purple' : 'text-gray-400'}`}
    >
      <Home size={22} />
      <span className="text-[9px] font-bold">Home</span>
    </motion.button>
    <motion.button 
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setActiveTab('mining')} 
      className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'mining' ? 'text-accent-purple' : 'text-gray-400'}`}
    >
      <Pickaxe size={22} />
      <span className="text-[9px] font-bold">Miners</span>
    </motion.button>
    <motion.button 
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setActiveTab('team')} 
      className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'team' ? 'text-accent-purple' : 'text-gray-400'}`}
    >
      <Users size={22} />
      <span className="text-[9px] font-bold">Team</span>
    </motion.button>
    <motion.button 
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setActiveTab('wallet')} 
      className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'wallet' ? 'text-accent-purple' : 'text-gray-400'}`}
    >
      <Wallet size={22} />
      <span className="text-[9px] font-bold">Wallet</span>
    </motion.button>
    <motion.button 
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setActiveTab('bonus')} 
      className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'bonus' ? 'text-accent-purple' : 'text-gray-400'}`}
    >
      <Gift size={22} />
      <span className="text-[9px] font-bold">Bonus</span>
    </motion.button>
    <motion.button 
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setActiveTab('support')} 
      className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'support' ? 'text-accent-purple' : 'text-gray-400'}`}
    >
      <div className="relative">
        <MessageSquare size={22} />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[7px] flex items-center justify-center rounded-full font-bold">1</span>
      </div>
      <span className="text-[9px] font-bold">Support</span>
    </motion.button>
    <motion.button 
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setActiveTab('profile')} 
      className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'profile' ? 'text-accent-purple' : 'text-gray-400'}`}
    >
      <User size={22} />
      <span className="text-[9px] font-bold">Profile</span>
    </motion.button>
    {isAdmin && (
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setActiveTab('admin')} 
        className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'admin' ? 'text-accent-purple' : 'text-gray-400'}`}
      >
        <ShieldCheck size={22} />
        <span className="text-[9px] font-bold">Admin</span>
      </motion.button>
    )}
  </div>
);

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
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

const WithdrawAnimation = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl pointer-events-none"
        >
          <div className="relative w-64 h-64 flex items-center justify-center" style={{ perspective: '1000px' }}>
            {/* 3D Coin */}
            <motion.div
              initial={{ rotateY: 0, scale: 0.5, z: -500 }}
              animate={{ 
                rotateY: [0, 360, 720, 1080],
                scale: [0.5, 1.2, 1, 0],
                z: [-500, 0, 100, 500],
                opacity: [0, 1, 1, 0]
              }}
              transition={{ duration: 3, ease: "easeInOut" }}
              className="w-32 h-32 bg-gradient-to-br from-neon-purple to-neon-pink rounded-full shadow-[0_0_50px_rgba(168,85,247,0.5)] flex items-center justify-center border-4 border-white/20"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <DollarSign size={64} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              
              {/* 3D Depth effect */}
              <div className="absolute inset-0 rounded-full border-4 border-white/10 translate-z-[-10px]"></div>
              <div className="absolute inset-0 rounded-full border-4 border-white/10 translate-z-[-20px]"></div>
            </motion.div>
            
            {/* Particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                  z: (Math.random() - 0.5) * 400
                }}
                transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                className="absolute w-2 h-2 bg-neon-purple rounded-full"
              />
            ))}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-[-40px] text-center"
            >
              <p className="text-neon-purple font-black tracking-widest text-xl uppercase animate-pulse">Processing Withdrawal</p>
              <p className="text-gray-500 text-[10px] font-bold uppercase mt-2">Securing Transaction on Blockchain</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<any, any> {
  public state: any;
  public props: any;
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
  const [loadingMachines, setLoadingMachines] = useState(true);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'income-asc' | 'income-desc' | 'name-asc' | 'name-desc'>('price-asc');

  const sortedMachines = useMemo(() => {
    return [...machines].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'income-asc': return a.dailyIncome - b.dailyIncome;
        case 'income-desc': return b.dailyIncome - a.dailyIncome;
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        default: return 0;
      }
    });
  }, [machines, sortBy]);

  const [userMachines, setUserMachines] = useState<UserMachine[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [globalStats, setGlobalStats] = useState({ totalViews: 0, adminEarnings: 0, totalEarnings: 0, todayViews: 0, todayEarnings: 0, lastViewDate: '' });

  const [txModalType, setTxModalType] = useState<'deposit' | 'withdraw' | 'withdraw_admin' | null>(null);
  const [txAmount, setTxAmount] = useState('');
  const [txMethod, setTxMethod] = useState<'Easypaisa' | 'JazzCash' | 'OKX' | 'Bank Transfer'>('Easypaisa');
  const [txDetails, setTxDetails] = useState('');
  const [txRefId, setTxRefId] = useState('');
  const [txScreenshot, setTxScreenshot] = useState<string | null>(null);
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  const [isSubmittingTx, setIsSubmittingTx] = useState(false);
  const [showWithdrawAnim, setShowWithdrawAnim] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<any>(null);
  const [exchangeModalType, setExchangeModalType] = useState<'buy' | 'sell' | null>(null);
  const [exchangeAmount, setExchangeAmount] = useState('');
  const [exchangeType, setExchangeType] = useState<'buy' | 'sell'>('sell');
  const [isExchanging, setIsExchanging] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [referrals, setReferrals] = useState<UserProfile[]>([]);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const formatCurrency = (val: any) => {
    if (val === undefined || val === null || isNaN(val)) return '0.00';
    return Number(val).toFixed(2);
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (!firebaseUser) {
        setUserProfile(null);
        setLoadingMachines(false);
        setTransactions([]);
        setReferrals([]);
      }
    });

    // Mock machines for demo
    setMachines([
      { 
        id: 'm0', 
        name: 'STARTER RIG (FREE)', 
        price: 0, 
        dailyIncome: 0.5, 
        duration: 30, 
        image: 'https://images.unsplash.com/photo-1620825937374-87fc7d62828e?auto=format&fit=crop&q=80&w=1000',
        description: 'Complimentary starter mining rig to begin your operations.'
      },
      { 
        id: 'm1', 
        name: 'NEON MINER V1', 
        price: 50, 
        dailyIncome: 1.0, 
        duration: 60, 
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1000',
        description: 'Entry-level mining rig optimized for low-power consumption.'
      },
      { 
        id: 'm2', 
        name: 'QUANTUM CORE', 
        price: 100, 
        dailyIncome: 2.1, 
        duration: 60, 
        image: 'https://images.unsplash.com/photo-1640343130737-7941a4778d0d?auto=format&fit=crop&q=80&w=1000',
        description: 'High-efficiency processing unit for consistent daily returns.'
      },
      { 
        id: 'm3', 
        name: 'CYBER RIG X', 
        price: 200, 
        dailyIncome: 4.5, 
        duration: 60, 
        image: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&q=80&w=1000',
        description: 'Advanced multi-threaded processing unit with liquid cooling.'
      },
      { 
        id: 'm4', 
        name: 'TITAN STATION', 
        price: 500, 
        dailyIncome: 12.0, 
        duration: 45, 
        image: 'https://images.unsplash.com/photo-1644088379091-d574269d422f?auto=format&fit=crop&q=80&w=1000',
        description: 'Orbital mining station with massive processing power and zero latency.'
      },
      { 
        id: 'm5', 
        name: 'APEX OVERLORD', 
        price: 1000, 
        dailyIncome: 25.0, 
        duration: 45, 
        image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=1000',
        description: 'The ultimate mining machine, dominating the network hash rate.'
      }
    ]);

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubs: (() => void)[] = [];

    // Increment global views on login
    const statsRef = doc(db, 'system', 'stats');
    const updateStats = async () => {
      try {
        await runTransaction(db, async (transaction) => {
          const statsSnap = await transaction.get(statsRef);
          const today = new Date().toISOString().split('T')[0];
          
          if (!statsSnap.exists()) {
            transaction.set(statsRef, {
              totalViews: 1,
              adminEarnings: VIEW_EARNING_RATE,
              totalEarnings: VIEW_EARNING_RATE,
              todayViews: 1,
              todayEarnings: VIEW_EARNING_RATE,
              lastViewDate: today
            });
          } else {
            const data = statsSnap.data();
            const isToday = data.lastViewDate === today;
            transaction.update(statsRef, {
              totalViews: increment(1),
              adminEarnings: increment(VIEW_EARNING_RATE),
              totalEarnings: increment(VIEW_EARNING_RATE),
              todayViews: isToday ? increment(1) : 1,
              todayEarnings: isToday ? increment(VIEW_EARNING_RATE) : VIEW_EARNING_RATE,
              lastViewDate: today
            });
          }
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'system/stats');
      }
    };
    updateStats();

    // Listen to user profile
    const userRef = doc(db, 'users', user.uid);
    unsubs.push(onSnapshot(userRef, (doc) => {
      if (doc.exists()) setUserProfile(doc.data() as UserProfile);
    }, (error) => handleFirestoreError(error, OperationType.GET, `users/${user.uid}`)));

    // Listen to user machines
    const qMachines = query(collection(db, 'userMachines'), where('userId', '==', user.uid));
    unsubs.push(onSnapshot(qMachines, (snapshot) => {
      const machines = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserMachine));
      machines.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
      setUserMachines(machines);
      setLoadingMachines(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'userMachines');
      setLoadingMachines(false);
    }));

    // Listen to transactions
    const qTx = query(collection(db, 'transactions'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'), limit(10));
    unsubs.push(onSnapshot(qTx, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'transactions')));

    // Listen to global stats
    unsubs.push(onSnapshot(doc(db, 'system', 'stats'), (doc) => {
      if (doc.exists()) setGlobalStats(doc.data() as any);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'system/stats')));

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [user]);

  useEffect(() => {
    if (!user || !userProfile?.referralCode) return;

    const qRefs = query(collection(db, 'users'), where('referredBy', '==', userProfile.referralCode));
    const unsub = onSnapshot(qRefs, (snapshot) => {
      setReferrals(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'referrals'));

    return () => unsub();
  }, [user, userProfile?.referralCode]);

  const [referralInput, setReferralInput] = useState('');

  // Auto-fill referral code from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      setReferralInput(refCode.toUpperCase());
    }
  }, []);

  const handleGoogleLogin = async () => {
    setIsAuthLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          fullName: firebaseUser.displayName || '',
          phone: '',
          balance: 0,
          coinBalance: 0,
          referralCode: Math.random().toString(36).substring(7).toUpperCase(),
          referredBy: referralInput.trim() || undefined,
          role: firebaseUser.email === ADMIN_EMAIL ? 'admin' : 'user',
          viewCount: 0,
          totalReferralEarnings: 0,
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
        setShowWelcomeModal(true);
        toast.success("Account created successfully.");
      } else {
        toast.success("Welcome back, Operative.");
      }
    } catch (error) {
      toast.error("Authentication failed.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleAuth = async () => {
    if (!authEmail || !authPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!isLoginMode && (!authFullName || !authPhone)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsAuthLoading(true);
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
        toast.success("Welcome back, Operative.");
      } else {
        const result = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        const firebaseUser = result.user;

        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: authEmail,
          fullName: authFullName,
          phone: authPhone,
          balance: 0,
          coinBalance: 0,
          referralCode: Math.random().toString(36).substring(7).toUpperCase(),
          referredBy: referralInput.trim() || undefined,
          role: authEmail === ADMIN_EMAIL ? 'admin' : 'user',
          viewCount: 0,
          totalReferralEarnings: 0,
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
        setUserProfile(newProfile);
        setShowWelcomeModal(true);
        toast.success("Account created successfully.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Authentication failed.");
    } finally {
      setIsAuthLoading(false);
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

    let referrerUid: string | null = null;
    if (userProfile.referredBy) {
      try {
        const qReferrer = query(collection(db, 'users'), where('referralCode', '==', userProfile.referredBy));
        const referrerSnap = await getDocs(qReferrer);
        if (!referrerSnap.empty) {
          referrerUid = referrerSnap.docs[0].id;
        }
      } catch (e) {
        console.error("Error finding referrer:", e);
      }
    }

    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', userProfile.uid);
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) throw new Error("User not found");
        
        const userData = userSnap.data() as UserProfile;
        if (userData.balance < machine.price) throw new Error("Insufficient balance");

        // Deduct balance
        transaction.update(userRef, { balance: increment(-machine.price) });

        // Record purchase transaction
        const purchaseTxRef = doc(collection(db, 'transactions'));
        transaction.set(purchaseTxRef, {
          userId: userProfile.uid,
          type: 'purchase',
          amount: machine.price,
          status: 'approved',
          method: 'Internal',
          details: `Purchased ${machine.name}`,
          userEmail: userProfile.email,
          timestamp: new Date().toISOString()
        });

        // Referral Payout (10%)
        if (referrerUid) {
          const referrerRef = doc(db, 'users', referrerUid);
          transaction.update(referrerRef, { 
            balance: increment(machine.price * 0.1),
            totalReferralEarnings: increment(machine.price * 0.1)
          });

          // Record referral transaction
          const referralTxRef = doc(collection(db, 'transactions'));
          transaction.set(referralTxRef, {
            userId: referrerUid,
            type: 'referral',
            amount: machine.price * 0.1,
            status: 'approved',
            method: 'Internal',
            details: `Commission from ${userProfile.email} renting ${machine.name}`,
            userEmail: userProfile.email,
            timestamp: new Date().toISOString()
          });
        }

        // Add user machine
        const userMachineRef = doc(collection(db, 'userMachines'));
        const now = new Date();
        const expiresAt = new Date(now.getTime() + (machine.duration * 24 * 60 * 60 * 1000));
        
        transaction.set(userMachineRef, {
          userId: userProfile.uid,
          machineId: machine.id,
          machineName: machine.name,
          dailyIncome: machine.dailyIncome,
          timestamp: now.toISOString(),
          expiresAt: expiresAt.toISOString(),
          lastCollectedAt: now.toISOString()
        });
      });
      toast.success(`Successfully deployed ${machine.name}`);
    } catch (error) {
      toast.error("Deployment failed.");
      handleFirestoreError(error, OperationType.WRITE, 'userMachines/rent');
    }
  };

  // --- Admin Functions ---
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    if (userProfile?.role === 'admin') {
      const qAllTx = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'), limit(50));
      const unsubTx = onSnapshot(qAllTx, (snapshot) => {
        setAllTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)));
      });

      const qUsers = query(collection(db, 'users'), limit(100));
      const unsubUsers = onSnapshot(qUsers, (snapshot) => {
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as UserProfile)));
      });

      return () => {
        unsubTx();
        unsubUsers();
      };
    }
  }, [userProfile]);

  const [processingTx, setProcessingTx] = useState<string | null>(null);

  const handleToggleRole = async (targetUserId: string, currentRole: string) => {
    if (!user || userProfile?.role !== 'admin') return;
    
    // Prevent removing your own admin role to avoid locking yourself out
    if (targetUserId === user.uid) {
      toast.error("You cannot change your own role.");
      return;
    }

    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      const userRef = doc(db, 'users', targetUserId);
      await updateDoc(userRef, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error("Failed to update user role");
      handleFirestoreError(error, OperationType.UPDATE, `users/${targetUserId}`);
    }
  };

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
      toast.error("Approval failed.");
      handleFirestoreError(error, OperationType.WRITE, `transactions/${tx.id}/approve`);
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
        } else if (tx.type === 'withdraw_admin') {
          const statsRef = doc(db, 'system', 'stats');
          transaction.update(statsRef, { adminEarnings: increment(tx.amount) });
        }
      });
      toast.success("Transaction rejected.");
    } catch (error) {
      toast.error("Rejection failed.");
      handleFirestoreError(error, OperationType.WRITE, `transactions/${tx.id}/reject`);
    } finally {
      setProcessingTx(null);
    }
  };

  const handleReorder = async (newOrder: UserMachine[]) => {
    // Update local state immediately for smooth UI
    setUserMachines(newOrder);
    
    // Persist to Firestore
    try {
      const batch = writeBatch(db);
      newOrder.forEach((um, index) => {
        const docRef = doc(db, 'userMachines', um.id);
        batch.update(docRef, { order: index });
      });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'userMachines/reorder');
      toast.error('Failed to save fleet order');
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
        
        const netIncome = um.dailyIncome * (1 - SELL_TAX);
        transaction.update(userRef, { balance: increment(netIncome) });
        transaction.update(umRef, { lastCollectedAt: now.toISOString() });

        // Record collection transaction
        const collectTxRef = doc(collection(db, 'transactions'));
        transaction.set(collectTxRef, {
          userId: um.userId,
          type: 'collect',
          amount: netIncome,
          status: 'approved',
          method: 'Internal',
          details: `Collected earnings from ${um.machineName}`,
          userEmail: userProfile.email,
          timestamp: now.toISOString()
        });
      });
      const netIncome = um.dailyIncome * (1 - SELL_TAX);
      toast.success(`Collected $${netIncome.toFixed(2)} from mining operations (8% tax applied).`);
    } catch (error) {
      toast.error("Collection failed.");
      handleFirestoreError(error, OperationType.WRITE, `userMachines/${um.id}/collect`);
    }
  };

  const handleExchange = async () => {
    if (!userProfile || !exchangeAmount) return;
    const inputAmount = parseFloat(exchangeAmount);
    if (inputAmount <= 0) return;

    setIsExchanging(true);
    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', userProfile.uid);
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) throw new Error("User not found");
        const userData = userSnap.data() as UserProfile;
        const currentBalance = Number(userData.balance || 0);
        const currentCoinBalance = Number(userData.coinBalance || 0);

        if (exchangeType === 'buy') {
          // inputAmount is USD
          if (currentBalance < inputAmount) throw new Error("Insufficient balance");
          const coinsToGet = inputAmount / COIN_PRICE;
          transaction.update(userRef, { 
            balance: increment(-inputAmount),
            coinBalance: increment(coinsToGet)
          });

          // Record exchange transaction
          const exchangeTxRef = doc(collection(db, 'transactions'));
          transaction.set(exchangeTxRef, {
            userId: userProfile.uid,
            type: 'exchange',
            amount: inputAmount,
            status: 'approved',
            method: 'Internal',
            details: `Exchanged $${inputAmount.toFixed(2)} for ${coinsToGet.toFixed(2)} MRC`,
            userEmail: userProfile.email,
            timestamp: new Date().toISOString()
          });
        } else {
          // inputAmount is MRC
          if (currentCoinBalance < inputAmount) throw new Error("Insufficient coin balance");
          const grossCredit = inputAmount * COIN_PRICE;
          const tax = grossCredit * SELL_TAX;
          const netCredit = grossCredit - tax;
          transaction.update(userRef, { 
            balance: increment(netCredit),
            coinBalance: increment(-inputAmount)
          });

          // Record exchange transaction
          const exchangeTxRef = doc(collection(db, 'transactions'));
          transaction.set(exchangeTxRef, {
            userId: userProfile.uid,
            type: 'exchange',
            amount: netCredit,
            status: 'approved',
            method: 'Internal',
            details: `Exchanged ${inputAmount.toFixed(2)} MRC for $${netCredit.toFixed(2)}`,
            userEmail: userProfile.email,
            timestamp: new Date().toISOString()
          });
        }
      });
      setExchangeAmount('');
      toast.success("Exchange completed successfully.");
    } catch (error: any) {
      toast.error(error.message || "Exchange failed.");
      handleFirestoreError(error, OperationType.WRITE, `users/${userProfile.uid}/exchange`);
    } finally {
      setIsExchanging(false);
    }
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { // 1MB limit
      toast.error("Screenshot must be less than 1MB");
      return;
    }

    setIsUploadingScreenshot(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setTxScreenshot(reader.result as string);
      setIsUploadingScreenshot(false);
    };
    reader.readAsDataURL(file);
  };

  const submitTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile || !txModalType) return;
    
    const amount = parseFloat(txAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    if (!txDetails.trim()) {
      toast.error("Please provide account details.");
      return;
    }
    if (txModalType === 'deposit' && !txRefId.trim()) {
      toast.error("Please provide a Transaction ID.");
      return;
    }
    if (txModalType === 'deposit' && !txScreenshot) {
      toast.error("Please upload a payment screenshot.");
      return;
    }
    if (txModalType === 'withdraw' && userProfile.balance < amount) {
      toast.error("Insufficient balance for withdrawal.");
      return;
    }
    if (txModalType === 'withdraw_admin' && globalStats.adminEarnings < amount) {
      toast.error("Insufficient admin earnings for withdrawal.");
      return;
    }

    setIsSubmittingTx(true);
    if (txModalType === 'withdraw' || txModalType === 'withdraw_admin') {
      setShowWithdrawAnim(true);
    }
    try {
      const txRef = collection(db, 'transactions');
      await addDoc(txRef, {
        userId: userProfile.uid,
        userEmail: userProfile.email,
        type: txModalType,
        amount,
        status: 'pending',
        method: txMethod,
        details: txDetails,
        ...(txModalType === 'deposit' ? { txId: txRefId, screenshot: txScreenshot } : {}),
        timestamp: new Date().toISOString()
      });

      if (txModalType === 'withdraw') {
        await updateDoc(doc(db, 'users', userProfile.uid), {
          balance: increment(-amount)
        }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `users/${userProfile.uid}`));
      } else if (txModalType === 'withdraw_admin') {
        await updateDoc(doc(db, 'system', 'stats'), {
          adminEarnings: increment(-amount)
        }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `system/stats`));
      }

      if (txModalType === 'withdraw' || txModalType === 'withdraw_admin') {
        // Keep animation for a bit
        await new Promise(r => setTimeout(r, 3000));
        setShowWithdrawAnim(false);
      }

      toast.success(`${txModalType === 'deposit' ? 'Deposit' : 'Withdrawal'} request submitted.`);
      setTxModalType(null);
      setTxAmount('');
      setTxDetails('');
      setTxRefId('');
      setTxScreenshot(null);
    } catch (error) {
      setShowWithdrawAnim(false);
      toast.error("Transaction failed.");
      handleFirestoreError(error, OperationType.CREATE, 'transactions');
    } finally {
      setIsSubmittingTx(false);
    }
  };

  if (loading) {
    return <Loading3D />;
  }

  if (!user) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-primary-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-accent-purple/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent-yellow/5 blur-[120px] rounded-full"></div>
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md z-10 text-center"
          >
            <LoginCircle />
            
            <h1 className="text-4xl font-black tracking-tight mb-2 text-white">
              Pro Mining
            </h1>
            <p className="text-gray-400 mb-10 font-medium">
              Invest Smart. Earn Daily.
            </p>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 space-y-6">
              <div className="flex p-1 bg-black/20 rounded-2xl mb-4">
                <button 
                  onClick={() => setIsLoginMode(true)}
                  className={`flex-1 py-3 text-sm font-bold transition-all ${isLoginMode ? 'bg-accent-yellow text-black rounded-xl shadow-lg shadow-accent-yellow/20' : 'text-gray-500'}`}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setIsLoginMode(false)}
                  className={`flex-1 py-3 text-sm font-bold transition-all ${!isLoginMode ? 'bg-accent-yellow text-black rounded-xl shadow-lg shadow-accent-yellow/20' : 'text-gray-500'}`}
                >
                  Sign Up
                </button>
              </div>

              <div className="space-y-4 text-left">
                {!isLoginMode && (
                  <>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Full Name"
                        value={authFullName}
                        onChange={(e) => setAuthFullName(e.target.value)}
                        className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent-yellow transition-colors text-white"
                      />
                    </div>
                    <div className="flex gap-3">
                      <div className="w-24 bg-white/10 border border-white/10 rounded-2xl py-4 px-4 text-sm font-medium flex items-center justify-between text-white">
                        <span className="flex items-center gap-2">
                          <Globe size={16} className="text-accent-green" />
                          +92
                        </span>
                      </div>
                      <input 
                        type="tel" 
                        placeholder="Phone Number"
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        className="flex-1 bg-white/10 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent-yellow transition-colors text-white"
                      />
                    </div>
                  </>
                )}
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent-yellow transition-colors text-white"
                  />
                </div>
                <div className="relative">
                  <input 
                    type="password" 
                    placeholder="Password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent-yellow transition-colors text-white"
                  />
                </div>
                
                {!isLoginMode && (
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                      type="text" 
                      placeholder="Referral Code (Optional)"
                      value={referralInput}
                      onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                      className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-accent-yellow transition-colors text-white"
                    />
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleAuth}
                disabled={isAuthLoading}
                className="w-full bg-accent-yellow text-black font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-3 hover:bg-yellow-400 transition-all active:scale-95 shadow-xl shadow-accent-yellow/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAuthLoading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  isLoginMode ? 'Sign In →' : 'Create Account →'
                )}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-primary-bg px-2 text-gray-500 font-bold">Or continue with</span></div>
              </div>

              <button 
                onClick={handleGoogleLogin}
                disabled={isAuthLoading}
                className="w-full bg-white/5 border border-white/10 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                Google Account
              </button>

              <p className="text-xs text-gray-500 font-bold">
                {isLoginMode ? "Don't have an account?" : "Already have an account?"} 
                <span 
                  onClick={() => setIsLoginMode(!isLoginMode)}
                  className="text-accent-yellow cursor-pointer ml-1"
                >
                  {isLoginMode ? "Sign Up" : "Sign In"}
                </span>
              </p>
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
        <WelcomeModal 
          isOpen={showWelcomeModal} 
          onClose={() => setShowWelcomeModal(false)} 
          userName={userProfile?.email?.split('@')[0]} 
        />
      
      {/* Header */}
      <header className="px-6 pt-8 pb-10 flex items-center justify-between sticky top-0 bg-primary-bg z-40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent-green flex items-center justify-center text-primary-bg font-black text-lg shadow-lg shadow-accent-green/20">
            {userProfile?.email?.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-black text-white leading-none mb-1">
              {userProfile?.email?.split('@')[0]}
            </h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Member since {userProfile?.createdAt ? format(new Date(userProfile.createdAt), 'yyyy-MM-dd') : '2026-04-03'}
            </p>
          </div>
        </div>
        <div className="relative">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer"
          >
            <Bell size={20} className="text-accent-yellow" />
          </motion.div>
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-primary-bg rounded-full"></span>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <PageTransition key="home">
            <div className="space-y-8 -mt-6">
              {/* Total Balance Section */}
              <section className="text-center mb-10">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-6 mb-2">Total Balance</p>
                <h1 className="text-6xl font-black text-white mb-2 tracking-tight">
                  ${formatCurrency(userProfile?.balance)}
                </h1>
                <p className="text-xs font-bold text-gray-500">
                  +${formatCurrency(userMachines.reduce((acc, m) => acc + (m.dailyIncome || 0), 0))} earning/day
                </p>
              </section>

              {/* Quick Actions Grid */}
              <WhiteCard className="grid grid-cols-4 gap-2 p-4 mb-8">
                <div onClick={() => setTxModalType('deposit')} className="flex flex-col items-center gap-2 cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-accent-yellow/10 flex items-center justify-center text-accent-yellow">
                    <DollarSign size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500">Deposit</span>
                </div>
                <div onClick={() => setTxModalType('withdraw')} className="flex flex-col items-center gap-2 cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-accent-green/10 flex items-center justify-center text-accent-green">
                    <ArrowUpRight size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500">Withdraw</span>
                </div>
                <div onClick={() => setActiveTab('bonus')} className="flex flex-col items-center gap-2 cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                    <Gift size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500">Bonus</span>
                </div>
                <div onClick={() => setActiveTab('profile')} className="flex flex-col items-center gap-2 cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-accent-purple/10 flex items-center justify-center text-accent-purple">
                    <User size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500">Profile</span>
                </div>
              </WhiteCard>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <WhiteCard className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent-purple/10 flex items-center justify-center text-accent-purple">
                    <Pickaxe size={24} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black">{userMachines.length}</h4>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Active Miners</p>
                  </div>
                </WhiteCard>
                <WhiteCard className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent-green/10 flex items-center justify-center text-accent-green">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-accent-green">${formatCurrency(userProfile?.balance)}</h4>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Total Earned</p>
                  </div>
                </WhiteCard>
              </div>

              {/* Mining Machines Section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black tracking-tight text-white">Mining Machines</h3>
                  <div className="flex items-center gap-3">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-white/5 border border-white/10 text-white text-xs font-bold rounded-lg px-2 py-1 outline-none focus:border-accent-purple"
                    >
                      <option value="price-asc" className="bg-gray-900">Price: Low to High</option>
                      <option value="price-desc" className="bg-gray-900">Price: High to Low</option>
                      <option value="income-desc" className="bg-gray-900">Income: High to Low</option>
                      <option value="income-asc" className="bg-gray-900">Income: Low to High</option>
                      <option value="name-asc" className="bg-gray-900">Name: A to Z</option>
                      <option value="name-desc" className="bg-gray-900">Name: Z to A</option>
                    </select>
                    <button onClick={() => setActiveTab('mining')} className="text-xs font-bold text-accent-purple hover:underline flex items-center gap-1">
                      See All <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {sortedMachines.map(machine => (
                    <WhiteCard key={machine.id} className="relative overflow-hidden">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                            <img src={machine.image} alt={machine.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-gray-900">{machine.name}</h4>
                            <p className="text-xs text-gray-400 font-bold">{machine.duration} days</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-accent-purple">${machine.price.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="card-light-gray">
                          <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Daily Profit</p>
                          <p className="text-sm font-black text-accent-green">+${machine.dailyIncome.toFixed(2)}</p>
                        </div>
                        <div className="card-light-gray">
                          <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Total ROI</p>
                          <p className="text-sm font-black text-accent-purple">
                            {machine.price > 0 
                              ? ((machine.dailyIncome * machine.duration / machine.price) * 100).toFixed(0) + '%' 
                              : '∞%'}
                          </p>
                        </div>
                        <div className="card-light-gray">
                          <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Duration</p>
                          <p className="text-sm font-black text-gray-900">{machine.duration} days</p>
                        </div>
                        <div className="card-light-gray relative group/viewer overflow-hidden">
                          <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Hardware</p>
                          <button 
                            onClick={() => {
                              setSelectedMachine(machine);
                              setIsViewerOpen(true);
                            }}
                            className="text-xs font-black text-accent-purple flex items-center gap-1 hover:text-accent-purple/80 transition-colors"
                          >
                            View 3D <Maximize2 size={12} />
                          </button>
                        </div>
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRent(machine)}
                        className="w-full py-4 bg-accent-purple text-white font-black text-sm rounded-2xl shadow-lg shadow-accent-purple/20 flex items-center justify-center gap-2"
                      >
                        {machine.price === 0 ? 'Activate Free Rig →' : `Buy Now — $${machine.price.toFixed(2)} →`}
                      </motion.button>
                    </WhiteCard>
                  ))}
                </div>
              </section>
            </div>
          </PageTransition>
        )}

        {activeTab === 'mining' && (
          <PageTransition key="mining">
            <div className="space-y-8">
              <div className="flex flex-col items-center mb-8">
                <MiningCircle isActive={userMachines.length > 0} dailyIncome={userMachines.reduce((acc, m) => acc + (m.dailyIncome || 0), 0)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <WhiteCard className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent-purple/10 flex items-center justify-center text-accent-purple">
                    <Pickaxe size={24} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black">{userMachines.length}</h4>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Active Miners</p>
                  </div>
                </WhiteCard>
                <WhiteCard className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent-green/10 flex items-center justify-center text-accent-green">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-accent-green">${formatCurrency(userMachines.reduce((acc, curr) => acc + (curr.dailyIncome || 0), 0))}</h4>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Daily Yield</p>
                  </div>
                </WhiteCard>
              </div>

              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black tracking-tight text-white">Active Fleet</h3>
                </div>

                <div className="space-y-6">
                  {userMachines.length === 0 ? (
                    <WhiteCard className="text-center py-20">
                      <Cpu size={48} className="mx-auto text-gray-200 mb-4" />
                      <p className="text-gray-500 font-bold">No active hardware detected.</p>
                      <button onClick={() => setActiveTab('home')} className="mt-4 text-accent-purple font-black text-sm underline">Browse Market</button>
                    </WhiteCard>
                  ) : (
                    userMachines.map((um) => {
                      const machine = machines.find(m => m.id === um.machineId);
                      const expiresAt = new Date(um.expiresAt);
                      const isExpired = expiresAt <= new Date();
                      const start = new Date(um.timestamp).getTime();
                      const end = expiresAt.getTime();
                      const now = new Date().getTime();
                      const progress = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
                      const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
                      
                      return (
                        <WhiteCard key={um.id} className={`relative overflow-hidden ${isExpired ? 'opacity-50 grayscale' : ''}`}>
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex gap-4">
                              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                                <img src={machine?.image} alt={um.machineName} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <h4 className="text-lg font-black text-gray-900">{um.machineName}</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                  {isExpired ? 'Decommissioned' : `Expires: ${format(expiresAt, 'MMM dd, HH:mm')}`}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Yield</p>
                              <p className="text-lg font-black text-accent-green">+${um.dailyIncome}/day</p>
                            </div>
                          </div>
                          
                          {!isExpired && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-3 gap-3">
                                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col items-center justify-center text-center">
                                  <Activity size={16} className="text-accent-green mb-1" />
                                  <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Status</p>
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                                    <p className="text-xs font-black text-gray-900">Online</p>
                                  </div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col items-center justify-center text-center">
                                  <Clock size={16} className="text-accent-purple mb-1" />
                                  <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Uptime</p>
                                  <p className="text-xs font-black text-gray-900">99.9%</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col items-center justify-center text-center">
                                  <Wrench size={16} className="text-accent-yellow mb-1" />
                                  <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Maintenance</p>
                                  <p className="text-xs font-black text-gray-900">in {daysLeft > 5 ? 5 : Math.max(1, daysLeft - 1)}d</p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase">Mining Progress</span>
                                  <span className="text-[10px] font-black text-accent-purple">{progress.toFixed(1)}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-accent-purple"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </WhiteCard>
                      );
                    })
                  )}
                </div>
              </section>
            </div>
          </PageTransition>
        )}

        {activeTab === 'team' && (
          <PageTransition key="team">
            <div className="space-y-8">
              <div className="flex flex-col items-center mb-8">
                <ReferralCircle referralCount={referrals.length} />
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black tracking-tight text-white">My Team</h2>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Grow your network & earn rewards</p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <WhiteCard className="bg-gradient-to-br from-accent-purple/10 to-accent-yellow/10 border-accent-purple/20 relative overflow-hidden group">
                  {/* Background 3D Elements */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-purple/20 rounded-full blur-3xl group-hover:bg-accent-purple/30 transition-all duration-500"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent-yellow/20 rounded-full blur-3xl group-hover:bg-accent-yellow/30 transition-all duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your Referral Code</p>
                        <h3 className="text-3xl font-black text-white tracking-[0.2em] drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                          {userProfile?.referralCode}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            navigator.clipboard.writeText(userProfile?.referralCode || '');
                            toast.success("Referral code copied!");
                          }}
                          className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-accent-purple hover:bg-white/10 transition-all shadow-lg shadow-accent-purple/10"
                          title="Copy Code"
                        >
                          <Copy size={24} />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            const link = `${window.location.origin}?ref=${userProfile?.referralCode}`;
                            navigator.clipboard.writeText(link);
                            toast.success("Referral link copied!");
                          }}
                          className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-accent-yellow hover:bg-white/10 transition-all shadow-lg shadow-accent-yellow/10"
                          title="Copy Link"
                        >
                          <Globe size={24} />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1, y: -5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            const link = `${window.location.origin}?ref=${userProfile?.referralCode}`;
                            const message = `Join my mining team! Use my referral code: ${userProfile?.referralCode} or join directly via this link: ${link}`;
                            navigator.clipboard.writeText(message);
                            toast.success("Referral message copied!");
                          }}
                          className="w-14 h-14 bg-accent-purple text-white rounded-2xl flex items-center justify-center hover:bg-accent-purple/90 transition-all shadow-lg shadow-accent-purple/30"
                          title="Share All"
                        >
                          <Share2 size={24} />
                        </motion.button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-3 transform transition-transform hover:scale-[1.02]">
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Referrals</p>
                        <div className="flex items-end gap-1">
                          <p className="text-xl font-black text-white">{referrals.length}</p>
                          <Users size={12} className="text-accent-purple mb-1" />
                        </div>
                      </div>
                      <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-3 transform transition-transform hover:scale-[1.02]">
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Commission</p>
                        <div className="flex items-end gap-1">
                          <p className="text-xl font-black text-accent-green">10%</p>
                          <TrendingUp size={12} className="text-accent-green mb-1" />
                        </div>
                      </div>
                      <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-3 transform transition-transform hover:scale-[1.02]">
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Earnings</p>
                        <div className="flex items-end gap-1">
                          <p className="text-xl font-black text-accent-yellow">${(userProfile?.totalReferralEarnings || 0).toFixed(2)}</p>
                          <DollarSign size={12} className="text-accent-yellow mb-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </WhiteCard>
              </motion.div>

              <section>
                <h3 className="text-lg font-black tracking-tight mb-4 flex items-center gap-2 text-white">
                  <Users size={20} className="text-accent-purple" />
                  Team Members
                </h3>
                <div className="space-y-3">
                  {referrals.length === 0 ? (
                    <WhiteCard className="p-10 text-center">
                      <p className="text-gray-400 font-bold italic">No team members yet. Start inviting!</p>
                    </WhiteCard>
                  ) : (
                    referrals.map(ref => (
                      <motion.div
                        key={ref.uid}
                        whileHover={{ 
                          scale: 1.02, 
                          translateZ: 20,
                          boxShadow: "0 20px 40px rgba(0,0,0,0.4)" 
                        }}
                        className="perspective-1000"
                      >
                        <WhiteCard className="p-4 flex items-center justify-between border-white/5 hover:border-accent-purple/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center text-accent-purple">
                              <User size={20} />
                            </div>
                            <div>
                              <p className="font-black text-sm">{ref.fullName || ref.email.split('@')[0]}</p>
                              <p className="text-[10px] font-bold text-gray-400">{ref.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined</p>
                            <p className="text-xs font-black">{new Date(ref.createdAt).toLocaleDateString()}</p>
                          </div>
                        </WhiteCard>
                      </motion.div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </PageTransition>
        )}

        {activeTab === 'bonus' && (
          <PageTransition key="bonus">
            <div className="space-y-8">
              <h3 className="text-2xl font-black tracking-tight text-white">Daily Bonus</h3>
              <WhiteCard className="text-center p-10">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                  <Gift size={40} />
                </div>
                <h4 className="text-xl font-black mb-2">Claim Your Bonus</h4>
                <p className="text-sm text-gray-500 mb-8 font-medium">Check back every 24 hours to claim your free mining credits.</p>
                <button className="w-full py-4 bg-red-500 text-white font-black rounded-2xl shadow-lg shadow-red-500/20">Claim $0.50 Now</button>
              </WhiteCard>
            </div>
          </PageTransition>
        )}

        {activeTab === 'support' && (
          <PageTransition key="support">
            <div className="space-y-8">
              <h3 className="text-2xl font-black tracking-tight text-white">Support Center</h3>
              <WhiteCard className="p-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-accent-purple flex items-center justify-center text-white">
                    <User size={24} />
                  </div>
                  <div>
                    <h4 className="font-black">Live Agent</h4>
                    <p className="text-xs text-accent-green font-bold">Online</p>
                  </div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                    <p className="text-sm text-gray-700 font-medium">Hello! How can we help you today with your mining operations?</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="Type your message..." className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent-purple" />
                  <button className="w-12 h-12 bg-accent-purple text-white rounded-xl flex items-center justify-center">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </WhiteCard>
            </div>
          </PageTransition>
        )}

        {activeTab === 'wallet' && (
          <PageTransition key="wallet">
            <div className="space-y-8">
              <section className="text-center mb-10">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Wallet Balance</p>
                <h1 className="text-6xl font-black text-white mb-2 tracking-tight">
                  ${formatCurrency(userProfile?.balance)}
                </h1>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-green"></div>
                  <p className="text-xs font-bold text-accent-green">Secure & Encrypted</p>
                </div>
              </section>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <WhiteCard className="p-6 bg-accent-purple text-white border-none shadow-xl shadow-accent-purple/20">
                  <p className="text-[10px] font-bold uppercase opacity-60 mb-1">Your Coins</p>
                  <h4 className="text-2xl font-black">{formatCurrency(userProfile?.coinBalance)}</h4>
                  <p className="text-[10px] font-bold uppercase opacity-60 mt-1">MRC</p>
                </WhiteCard>
                <WhiteCard className="p-6">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Coin Value</p>
                  <h4 className="text-2xl font-black text-gray-900">${COIN_PRICE}</h4>
                  <p className="text-[10px] font-bold text-accent-green uppercase mt-1">+2.4%</p>
                </WhiteCard>
              </div>

              <WhiteCard className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black">Exchange MRC</h3>
                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button 
                      onClick={() => setExchangeType('buy')}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${exchangeType === 'buy' ? 'bg-white text-accent-purple shadow-sm' : 'text-gray-400'}`}
                    >
                      Buy
                    </button>
                    <button 
                      onClick={() => setExchangeType('sell')}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${exchangeType === 'sell' ? 'bg-white text-accent-purple shadow-sm' : 'text-gray-400'}`}
                    >
                      Sell
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="card-light-gray">
                    <div className="flex justify-between mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{exchangeType === 'buy' ? 'You Pay' : 'You Sell'}</span>
                      <span className="text-[10px] font-bold text-accent-purple uppercase">
                        Balance: {exchangeType === 'buy' ? `$${formatCurrency(userProfile?.balance)}` : `${formatCurrency(userProfile?.coinBalance)} MRC`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${exchangeType === 'buy' ? 'bg-accent-green' : 'bg-accent-purple'}`}>
                        {exchangeType === 'buy' ? <DollarSign size={16} /> : <Coins size={16} />}
                      </div>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        value={exchangeAmount}
                        onChange={(e) => setExchangeAmount(e.target.value)}
                        className="flex-1 bg-transparent border-none p-0 text-2xl font-black focus:ring-0 text-gray-900"
                      />
                      <span className="text-lg font-black text-gray-900">{exchangeType === 'buy' ? 'USD' : 'MRC'}</span>
                    </div>
                  </div>

                  <div className="flex justify-center -my-3 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-md flex items-center justify-center text-accent-purple cursor-pointer" onClick={() => setExchangeType(exchangeType === 'buy' ? 'sell' : 'buy')}>
                      <RefreshCcw size={20} />
                    </div>
                  </div>

                  <div className="card-light-gray">
                    <div className="flex justify-between mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">You Get</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${exchangeType === 'buy' ? 'bg-accent-purple' : 'bg-accent-green'}`}>
                        {exchangeType === 'buy' ? <Coins size={16} /> : <DollarSign size={16} />}
                      </div>
                      <p className="flex-1 text-2xl font-black text-gray-900">
                        {exchangeType === 'buy' 
                          ? (Number(exchangeAmount) / COIN_PRICE).toFixed(2)
                          : `$${(Number(exchangeAmount) * COIN_PRICE * (1 - SELL_TAX)).toFixed(2)}`
                        }
                      </p>
                      <span className="text-lg font-black text-gray-900">{exchangeType === 'buy' ? 'MRC' : 'USD'}</span>
                    </div>
                  </div>

                  {exchangeType === 'sell' && (
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase px-2">
                      <span>Exchange Fee (8%)</span>
                      <span className="text-red-500">-${(Number(exchangeAmount) * COIN_PRICE * SELL_TAX).toFixed(2)}</span>
                    </div>
                  )}

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleExchange}
                    disabled={isExchanging || !exchangeAmount || parseFloat(exchangeAmount) <= 0}
                    className="w-full py-4 bg-accent-purple text-white font-black rounded-2xl shadow-lg shadow-accent-purple/20 flex items-center justify-center gap-2"
                  >
                    {isExchanging ? <RefreshCcw size={20} className="animate-spin" /> : <RefreshCcw size={20} />}
                    {isExchanging ? 'Processing...' : `Confirm ${exchangeType === 'buy' ? 'Purchase' : 'Sale'} →`}
                  </motion.button>
                </div>
              </WhiteCard>

              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black tracking-tight text-white">Recent Transactions</h3>
                  <button className="text-xs font-bold text-accent-purple hover:underline">View All</button>
                </div>
                <TransactionHistory transactions={transactions} />
              </section>
            </div>
          </PageTransition>
        )}

        {activeTab === 'profile' && (
          <PageTransition key="profile">
            <div className="space-y-8">
              <WhiteCard className="text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${userMachines.length > 0 ? 'bg-accent-green/10 text-accent-green' : 'bg-gray-100 text-gray-400'}`}>
                    {userMachines.length > 0 ? 'Mining Active' : 'Idle'}
                  </div>
                </div>
                <div className="w-24 h-24 rounded-full bg-accent-purple/10 flex items-center justify-center mx-auto mb-4 text-accent-purple border-4 border-white shadow-xl">
                  <User size={48} />
                </div>
                <h3 className="text-2xl font-black mb-1">{userProfile?.fullName || userProfile?.email?.split('@')[0]}</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{userProfile?.email}</p>
                
                <div className="flex items-center justify-center gap-8 py-6 border-t border-gray-100 mt-8">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                    <p className={`font-black ${userMachines.length > 0 ? 'text-accent-green' : 'text-gray-400'}`}>
                      {userMachines.length > 0 ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-gray-100"></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Member</p>
                    <p className="font-black text-accent-purple">
                      {(() => {
                        const totalInvestment = userMachines.reduce((acc, um) => acc + (machines.find(m => m.id === um.machineId)?.price || 0), 0);
                        if (totalInvestment >= 2000) return 'Elite';
                        if (totalInvestment >= 500) return 'Gold';
                        if (totalInvestment >= 100) return 'Silver';
                        return 'Bronze';
                      })()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setTxModalType('deposit')}
                    className="py-4 bg-accent-green text-white font-black rounded-2xl text-xs shadow-lg shadow-accent-green/20"
                  >
                    Deposit
                  </button>
                  <button 
                    onClick={() => setTxModalType('withdraw')}
                    className="py-4 bg-accent-purple text-white font-black rounded-2xl text-xs shadow-lg shadow-accent-purple/20"
                  >
                    Withdraw
                  </button>
                </div>
              </WhiteCard>

              <section>
                <h3 className="text-lg font-black tracking-tight mb-4 flex items-center gap-2 text-white">
                  <Cpu size={20} className="text-accent-purple" />
                  Active Mining Fleet
                </h3>
                <div className="space-y-3">
                  {loadingMachines ? (
                    <div className="space-y-3">
                      {[1, 2].map(i => (
                        <WhiteCard key={i} className="p-4 animate-pulse">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100"></div>
                              <div className="space-y-2">
                                <div className="h-3 w-20 bg-gray-100 rounded"></div>
                                <div className="h-2 w-12 bg-gray-100 rounded"></div>
                              </div>
                            </div>
                            <div className="h-4 w-12 bg-gray-100 rounded"></div>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full"></div>
                        </WhiteCard>
                      ))}
                    </div>
                  ) : userMachines.length === 0 ? (
                    <WhiteCard className="p-10 text-center">
                      <p className="text-gray-400 font-bold italic">No active mining units deployed.</p>
                    </WhiteCard>
                  ) : (
                    userMachines.map(um => {
                      const now = new Date();
                      const lastCollected = new Date(um.lastCollectedAt);
                      const hoursSinceLast = (now.getTime() - lastCollected.getTime()) / (1000 * 60 * 60);
                      const progress = Math.min((hoursSinceLast / 24) * 100, 100);
                      const isReady = progress >= 100;

                      return (
                        <WhiteCard key={um.id} className="p-4 flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center text-accent-purple">
                                <Cpu size={20} />
                              </div>
                              <div>
                                <p className="font-black text-sm">{um.machineName}</p>
                                <p className="text-[10px] font-bold text-gray-400">Income: ${um.dailyIncome}/day</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleCollect(um)}
                              disabled={!isReady}
                              className={`px-4 py-2 rounded-xl font-black text-[10px] transition-all ${
                                isReady 
                                  ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/20' 
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {isReady ? 'Collect' : `${(24 - hoursSinceLast).toFixed(1)}h Left`}
                            </button>
                          </div>
                          
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${isReady ? 'bg-accent-purple' : 'bg-gray-300'}`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </WhiteCard>
                      );
                    })
                  )}
                </div>
              </section>

              <WhiteCard className="p-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
                <h4 className="text-lg font-black mb-6 flex items-center gap-2 relative z-10">
                  <Users size={20} className="text-accent-purple" />
                  Referral Network
                </h4>
                
                <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Commission</p>
                    <p className="text-xl font-black text-accent-purple">10%</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Referrals</p>
                    <p className="text-xl font-black text-gray-900">
                      {users.filter(u => u.referredBy === userProfile?.referralCode).length}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-6 font-medium leading-relaxed relative z-10">
                  Invite your friends and earn 10% commission on every mining machine they purchase. Your earnings are automatically credited to your balance.
                </p>
                
                <div className="space-y-3 relative z-10">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Your Unique Code</span>
                      <code className="text-accent-purple font-black tracking-widest text-lg">{userProfile?.referralCode}</code>
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(userProfile?.referralCode || '');
                        toast.success("Referral code copied!");
                      }}
                      className="p-3 bg-white shadow-sm border border-gray-100 rounded-xl text-gray-400 hover:text-accent-purple transition-colors"
                      title="Copy Code"
                    >
                      <Copy size={20} />
                    </button>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Your Referral Link</span>
                      <code className="text-accent-yellow font-black tracking-widest text-[10px] truncate max-w-[180px]">
                        {`${window.location.origin}?ref=${userProfile?.referralCode}`}
                      </code>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const link = `${window.location.origin}?ref=${userProfile?.referralCode}`;
                          navigator.clipboard.writeText(link);
                          toast.success("Referral link copied!");
                        }}
                        className="p-3 bg-white shadow-sm border border-gray-100 rounded-xl text-gray-400 hover:text-accent-yellow transition-colors"
                        title="Copy Link"
                      >
                        <Globe size={20} />
                      </button>
                      <button 
                        onClick={() => {
                          const link = `${window.location.origin}?ref=${userProfile?.referralCode}`;
                          const message = `Join my mining team! Use my referral code: ${userProfile?.referralCode} or join directly via this link: ${link}`;
                          navigator.clipboard.writeText(message);
                          toast.success("Referral message copied!");
                        }}
                        className="p-3 bg-accent-purple text-white shadow-sm rounded-xl hover:bg-accent-purple/90 transition-all"
                        title="Share All"
                      >
                        <Share2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </WhiteCard>

              <button 
                onClick={() => signOut(auth)}
                className="w-full py-5 bg-white border border-gray-100 rounded-2xl text-xs font-black text-red-500 uppercase tracking-widest shadow-sm flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </PageTransition>
        )}

        {activeTab === 'admin' && userProfile?.role === 'admin' && (
          <PageTransition key="admin">
            <div className="space-y-8">
              <h3 className="text-2xl font-black tracking-tight text-white">Admin Dashboard</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <WhiteCard className="p-4">
                  <p className="text-[9px] font-bold text-gray-500 uppercase mb-1">Total Users</p>
                  <h4 className="text-xl font-black">{users.length}</h4>
                </WhiteCard>
                <WhiteCard className="p-4">
                  <p className="text-[9px] font-bold text-gray-500 uppercase mb-1">Total Deposits</p>
                  <h4 className="text-xl font-black text-accent-green">
                    ${formatCurrency(allTransactions.filter(t => t.type === 'deposit' && t.status === 'approved').reduce((acc, t) => acc + t.amount, 0))}
                  </h4>
                </WhiteCard>
                <WhiteCard className="p-4">
                  <p className="text-[9px] font-bold text-gray-500 uppercase mb-1">Total Revenue</p>
                  <h4 className="text-xl font-black text-accent-purple">
                    ${formatCurrency(allTransactions.filter(t => t.type === 'purchase').reduce((acc, t) => acc + t.amount, 0))}
                  </h4>
                </WhiteCard>
                <WhiteCard className="p-4">
                  <p className="text-[9px] font-bold text-gray-500 uppercase mb-1">Total Commissions</p>
                  <h4 className="text-xl font-black text-accent-yellow">
                    ${formatCurrency(allTransactions.filter(t => t.type === 'referral').reduce((acc, t) => acc + t.amount, 0))}
                  </h4>
                </WhiteCard>
                <WhiteCard className="p-4">
                  <p className="text-[9px] font-bold text-gray-500 uppercase mb-1">Total Collected</p>
                  <h4 className="text-xl font-black text-accent-green">
                    ${formatCurrency(allTransactions.filter(t => t.type === 'collect').reduce((acc, t) => acc + t.amount, 0))}
                  </h4>
                </WhiteCard>
                <WhiteCard className="p-4">
                  <p className="text-[9px] font-bold text-gray-500 uppercase mb-1">Total Withdrawals</p>
                  <h4 className="text-xl font-black text-red-500">
                    ${formatCurrency(allTransactions.filter(t => t.type === 'withdraw' && t.status === 'approved').reduce((acc, t) => acc + t.amount, 0))}
                  </h4>
                </WhiteCard>
              </div>

              <WhiteCard className="p-6">
                <h4 className="text-lg font-black mb-6">Pending Authorizations</h4>
                <div className="space-y-4">
                  {allTransactions.filter(tx => tx.status === 'pending').length === 0 ? (
                    <p className="text-center py-10 text-gray-400 font-bold">No pending authorizations.</p>
                  ) : (
                    allTransactions.filter(tx => tx.status === 'pending').map(tx => (
                      <div key={tx.id} className="p-5 bg-gray-50 rounded-[24px] border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'deposit' ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-purple/10 text-accent-purple'}`}>
                              {tx.type === 'deposit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                            </div>
                            <div>
                              <p className="font-black text-sm capitalize">{tx.type.replace('_', ' ')} Request</p>
                              <p className="text-[10px] font-bold text-gray-400">{tx.userEmail}</p>
                            </div>
                          </div>
                          <p className="font-black text-lg text-gray-900">${tx.amount}</p>
                        </div>

                        <div className="space-y-2 mb-4 p-3 bg-white rounded-xl border border-gray-100">
                          <div className="flex justify-between text-[10px] font-bold uppercase">
                            <span className="text-gray-400">Method</span>
                            <span className="text-gray-900">{tx.method}</span>
                          </div>
                          <div className="flex justify-between text-[10px] font-bold uppercase">
                            <span className="text-gray-400">Details</span>
                            <span className="text-gray-900">{tx.details}</span>
                          </div>
                          {tx.txId && (
                            <div className="flex justify-between text-[10px] font-bold uppercase">
                              <span className="text-gray-400">TID</span>
                              <span className="text-accent-purple">{tx.txId}</span>
                            </div>
                          )}
                        </div>

                        {tx.screenshot && (
                          <div className="mb-4 rounded-xl overflow-hidden border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 ml-1">Payment Receipt</p>
                            <img 
                              src={tx.screenshot} 
                              alt="Receipt" 
                              className="w-full h-auto max-h-48 object-cover cursor-pointer hover:scale-105 transition-transform" 
                              onClick={() => window.open(tx.screenshot, '_blank')}
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => handleApproveTx(tx)}
                            disabled={processingTx === tx.id}
                            className="py-3 bg-accent-green text-white font-black text-xs rounded-xl shadow-lg shadow-accent-green/20"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleRejectTx(tx)}
                            disabled={processingTx === tx.id}
                            className="py-3 bg-red-500 text-white font-black text-xs rounded-xl shadow-lg shadow-red-500/20"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </WhiteCard>

              <WhiteCard className="p-6">
                <h4 className="text-lg font-black mb-6">Manage Users</h4>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {users.map(u => (
                    <div key={u.uid} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="font-black text-sm">{u.fullName || 'Unknown'}</p>
                        <p className="text-[10px] font-bold text-gray-400">{u.email}</p>
                        <p className="text-[10px] font-bold text-accent-purple mt-1">Bal: ${u.balance.toFixed(2)} | Coins: {u.coinBalance.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-accent-purple/10 text-accent-purple' : 'bg-gray-200 text-gray-600'}`}>
                          {u.role}
                        </span>
                        <button 
                          onClick={() => handleToggleRole(u.uid, u.role)}
                          className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          title={u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                        >
                          <ShieldCheck size={14} className={u.role === 'admin' ? 'text-red-500' : 'text-accent-green'} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </WhiteCard>

              <WhiteCard className="p-6">
                <h4 className="text-lg font-black mb-6">All Transactions</h4>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {allTransactions.map(tx => (
                    <div key={tx.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'deposit' ? 'bg-accent-green/10 text-accent-green' : tx.type === 'withdraw' ? 'bg-red-500/10 text-red-500' : 'bg-accent-purple/10 text-accent-purple'}`}>
                          {tx.type === 'deposit' ? <ArrowDownLeft size={14} /> : tx.type === 'withdraw' ? <ArrowUpRight size={14} /> : <RefreshCcw size={14} />}
                        </div>
                        <div>
                          <p className="font-black text-xs capitalize">{tx.type.replace('_', ' ')}</p>
                          <p className="text-[9px] font-bold text-gray-400">{tx.userEmail || 'Unknown User'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-sm text-gray-900">${tx.amount.toFixed(2)}</p>
                        <span className={`text-[9px] font-bold uppercase ${tx.status === 'approved' ? 'text-accent-green' : tx.status === 'rejected' ? 'text-red-500' : 'text-accent-yellow'}`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </WhiteCard>

              <WhiteCard className="p-6">
                <h4 className="text-lg font-black mb-6">System Controls</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <p className="text-sm font-black">Maintenance Mode</p>
                      <p className="text-[10px] font-bold text-gray-400">Disable all transactions</p>
                    </div>
                    <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </WhiteCard>
            </div>
          </PageTransition>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {txModalType && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl p-8"
            >
              <button 
                onClick={() => setTxModalType(null)} 
                className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-2xl font-black mb-8 capitalize flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${txModalType === 'deposit' ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-purple/10 text-accent-purple'}`}>
                  {txModalType === 'deposit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                {txModalType === 'withdraw_admin' ? 'Admin Withdrawal' : `${txModalType} Funds`}
              </h3>

              <form onSubmit={submitTransaction} className="space-y-6">
                {txModalType === 'deposit' && (
                  <div className="bg-accent-purple/5 border border-accent-purple/10 rounded-2xl p-4 mb-2">
                    <p className="text-[10px] font-bold text-accent-purple uppercase tracking-widest mb-2 flex items-center gap-1">
                      <AlertCircle size={12} />
                      Payment Instructions
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                      Please send your deposit to one of the following accounts, then enter your details below to verify:
                    </p>
                    <div className="mt-3 space-y-2">
                      <div className="flex flex-col text-[10px] font-bold">
                        <span className="text-gray-400">Easypaisa / JazzCash Title</span>
                        <span className="text-gray-900">Najeeb ur Rahman</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-gray-400">Account Number</span>
                        <span className="text-gray-900">03439030108</span>
                      </div>
                      <div className="flex flex-col text-[10px] font-bold pt-1 border-t border-gray-100">
                        <span className="text-gray-400">OKX Wallet (TON)</span>
                        <span className="text-gray-900 break-all">UQAV1fX1HGvKDOyKoiXQMYbHmQYU8IGarP6NCnwA_eavrgVm</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block mb-2">Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black">$</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={txAmount} 
                      onChange={e => setTxAmount(e.target.value)} 
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-8 py-4 text-lg font-black focus:border-accent-purple focus:outline-none transition-all" 
                      placeholder="0.00" 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block mb-2">Method</label>
                  <select 
                    value={txMethod} 
                    onChange={e => setTxMethod(e.target.value as any)} 
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 text-sm font-black focus:border-accent-purple focus:outline-none appearance-none"
                  >
                    <option value="Easypaisa">Easypaisa</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="OKX">OKX Wallet</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block mb-2">
                    {txMethod === 'Easypaisa' || txMethod === 'JazzCash' ? `${txMethod} Number` : txMethod === 'OKX' ? 'OKX Wallet Address' : 'Bank Account Details'}
                  </label>
                  <input 
                    type="text" 
                    value={txDetails} 
                    onChange={e => setTxDetails(e.target.value)} 
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 text-sm font-black focus:border-accent-purple focus:outline-none" 
                    placeholder={txMethod === 'Easypaisa' || txMethod === 'JazzCash' ? '03XX-XXXXXXX' : txMethod === 'OKX' ? 'T...' : 'IBAN / Account #'} 
                    required 
                  />
                </div>

                {txModalType === 'deposit' && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block mb-2">Transaction ID (TID)</label>
                      <input 
                        type="text" 
                        value={txRefId} 
                        onChange={e => setTxRefId(e.target.value)} 
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 text-sm font-black focus:border-accent-purple focus:outline-none" 
                        placeholder="Enter TID from receipt" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block mb-2">Payment Screenshot</label>
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleScreenshotUpload}
                          className="hidden"
                          id="screenshot-upload"
                        />
                        <label 
                          htmlFor="screenshot-upload"
                          className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl px-4 py-6 flex flex-col items-center justify-center cursor-pointer hover:border-accent-purple transition-all overflow-hidden"
                        >
                          {txScreenshot ? (
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                              <img src={txScreenshot} alt="Screenshot" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <p className="text-white text-[10px] font-bold uppercase">Change Screenshot</p>
                              </div>
                            </div>
                          ) : (
                            <>
                              {isUploadingScreenshot ? (
                                <RefreshCcw size={24} className="text-accent-purple animate-spin mb-2" />
                              ) : (
                                <Plus size={24} className="text-gray-400 mb-2" />
                              )}
                              <p className="text-[10px] font-bold text-gray-400 uppercase">
                                {isUploadingScreenshot ? 'Processing...' : 'Upload Receipt Screenshot'}
                              </p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isSubmittingTx || !txAmount || parseFloat(txAmount) <= 0} 
                  className={`w-full py-5 font-black rounded-2xl transition-all flex items-center justify-center gap-2 mt-4 shadow-xl ${
                    isSubmittingTx 
                      ? 'bg-gray-100 text-gray-400' 
                      : txModalType === 'deposit' 
                        ? 'bg-accent-green text-white shadow-accent-green/20' 
                        : 'bg-accent-purple text-white shadow-accent-purple/20'
                  }`}
                >
                  {isSubmittingTx ? <RefreshCcw size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                  {txModalType === 'deposit' ? 'Submit Deposit' : txModalType === 'withdraw_admin' ? 'Admin Withdrawal' : 'Request Withdrawal'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={userProfile?.role === 'admin'} />
      <WithdrawAnimation isVisible={showWithdrawAnim} />
      <MachineViewer 
        isOpen={isViewerOpen} 
        onClose={() => setIsViewerOpen(false)} 
        machine={selectedMachine} 
      />
    </div>
    </ErrorBoundary>
  );
}
