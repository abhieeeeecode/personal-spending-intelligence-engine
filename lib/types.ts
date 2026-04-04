export type Category = 'food' | 'grocery' | 'fashion' | 'travel';

export interface Platform {
  id: string;
  name: string;
  category: Category;
  logo: string;
  color: string;
  baseUrl: string;
  searchUrl: string;
}

export interface PlatformOption {
  platform: Platform;
  originalPrice: number;
  discountedPrice: number;
  couponCode?: string;
  savings: number;
  deliveryTime?: string;
  rating?: number;
  deepLink: string;
}

export interface WaitOption {
  expectedPrice: number;
  waitTime: string;
  probability: number;
}

export interface SearchResult {
  query: string;
  category: Category;
  options: PlatformOption[];
  waitOption?: WaitOption;
  regretProbability?: number;
}

export interface SpendingStats {
  totalSpent: number;
  optimalSpend: number;
  missedSavings: number;
  weeklyChange: number;
}

export interface SpendingDNA {
  impulsive: number;
  saver: number;
  convenience: number;
  planner: number;
}

export interface Deal {
  id: string;
  platform: Platform;
  title: string;
  discount: string;
  expiresAt: Date;
  category: Category;
  deepLink: string;
}

export interface Transaction {
  id: string;
  platform: Platform;
  item: string;
  amount: number;
  optimalAmount: number;
  date: Date;
  category: Category;
}
