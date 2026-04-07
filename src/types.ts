export interface UserProfile {
  uid: string;
  email: string;
  fullName?: string;
  phone?: string;
  balance: number;
  coinBalance: number;
  referralCode: string;
  referredBy?: string;
  role: 'user' | 'admin';
  viewCount: number;
  totalReferralEarnings: number;
  createdAt: string;
}

export interface Machine {
  id: string;
  name: string;
  price: number;
  dailyIncome: number;
  duration: number;
  image: string;
  description: string;
  metadata?: {
    tier: string;
    cooling: string;
    power: string;
  };
}

export interface UserMachine {
  id: string;
  userId: string;
  machineId: string;
  machineName: string;
  timestamp: string;
  expiresAt: string;
  lastCollectedAt: string;
  dailyIncome: number;
  order?: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdraw' | 'withdraw_admin' | 'referral' | 'purchase' | 'collect' | 'exchange';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  method: 'Easypaisa' | 'JazzCash' | 'OKX' | 'Bank Transfer';
  details: string;
  txId?: string;
  screenshot?: string;
  userEmail?: string;
  timestamp: string;
}
