export interface UserProfile {
  uid: string;
  email: string;
  balance: number;
  coinBalance: number;
  referralCode: string;
  referredBy?: string;
  role: 'user' | 'admin';
  viewCount: number;
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
  timestamp: string;
  expiresAt: string;
  lastCollectedAt: string;
  dailyIncome: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  method: 'Easypaisa' | 'OKX';
  details: string;
  timestamp: string;
}
