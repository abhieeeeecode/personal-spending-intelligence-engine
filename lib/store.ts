'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category, Transaction, Deal } from './types';

// Personality Mode types
export type PersonalityMode = 'convenience' | 'smart-planner' | 'budget-guardian';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  joinedDate: Date;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  type: 'deal' | 'price-drop' | 'reminder' | 'system' | 'savings';
  actionUrl?: string;
  category?: Category;
}

export interface AppSettings {
  darkMode: boolean;
  pushNotifications: boolean;
  priceAlerts: boolean;
  emailDigest: boolean;
  soundEffects: boolean;
  personalityMode: PersonalityMode;
}

interface AppState {
  // User
  user: UserProfile;
  setUser: (user: Partial<UserProfile>) => void;
  
  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  toggleDarkMode: () => void;
  setPersonalityMode: (mode: PersonalityMode) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  unreadCount: () => number;
  
  // Transactions (for analytics)
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  
  // Active deals
  deals: Deal[];
  setDeals: (deals: Deal[]) => void;
  
  // UI State
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

// Sample notifications for demo
const sampleNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Price Drop Alert!',
    description: 'Nike Air Max 270 dropped from ₹12,999 to ₹8,499 on Amazon',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    type: 'price-drop',
    actionUrl: '/search?q=nike+air+max',
    category: 'fashion',
  },
  {
    id: 'notif-2',
    title: 'Flash Sale Live!',
    description: 'Swiggy Super Sale: 60% off on all orders above ₹199',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    type: 'deal',
    category: 'food',
  },
  {
    id: 'notif-3',
    title: 'You Saved ₹450 This Week',
    description: 'Great job! Your smart choices saved you money on groceries',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    type: 'savings',
  },
  {
    id: 'notif-4',
    title: 'Reminder: Restock Groceries',
    description: 'Based on your pattern, it\'s time to order milk and eggs',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: true,
    type: 'reminder',
    category: 'grocery',
  },
  {
    id: 'notif-5',
    title: 'New Platform Added',
    description: 'We\'ve added JioMart for better grocery comparisons',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    type: 'system',
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      user: {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        avatar: 'A',
        phone: '+91 98765 43210',
        joinedDate: new Date('2024-01-15'),
      },
      setUser: (updates) => 
        set((state) => ({ user: { ...state.user, ...updates } })),
      
      // Settings
      settings: {
        darkMode: true,
        pushNotifications: true,
        priceAlerts: true,
        emailDigest: false,
        soundEffects: true,
        personalityMode: 'smart-planner',
      },
      updateSettings: (updates) =>
        set((state) => ({ settings: { ...state.settings, ...updates } })),
      toggleDarkMode: () =>
        set((state) => ({ 
          settings: { ...state.settings, darkMode: !state.settings.darkMode } 
        })),
      setPersonalityMode: (mode) =>
        set((state) => ({ 
          settings: { ...state.settings, personalityMode: mode } 
        })),
      
      // Notifications
      notifications: sampleNotifications,
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: `notif-${Date.now()}`,
              timestamp: new Date(),
              read: false,
            },
            ...state.notifications,
          ],
        })),
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      clearNotifications: () => set({ notifications: [] }),
      unreadCount: () => get().notifications.filter((n) => !n.read).length,
      
      // Transactions
      transactions: [],
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            { ...transaction, id: `txn-${Date.now()}` },
            ...state.transactions,
          ],
        })),
      
      // Deals
      deals: [],
      setDeals: (deals) => set({ deals }),
      
      // UI State
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'psie-storage',
      partialize: (state) => ({
        user: state.user,
        settings: state.settings,
        notifications: state.notifications,
        transactions: state.transactions,
      }),
    }
  )
);

// Personality mode descriptions
export const personalityModes: Record<PersonalityMode, { 
  name: string; 
  description: string; 
  icon: string;
  savingsMultiplier: number;
  waitRecommendation: 'low' | 'medium' | 'high';
}> = {
  'convenience': {
    name: 'Convenience Optimizer',
    description: 'Quick suggestions with minor savings. Prioritizes speed and ease.',
    icon: 'Zap',
    savingsMultiplier: 0.8,
    waitRecommendation: 'low',
  },
  'smart-planner': {
    name: 'Smart Planner',
    description: 'Balanced approach with weekly strategies and platform switching.',
    icon: 'Brain',
    savingsMultiplier: 1.0,
    waitRecommendation: 'medium',
  },
  'budget-guardian': {
    name: 'Budget Guardian',
    description: 'Maximum savings mode. High discipline, best deals only.',
    icon: 'Shield',
    savingsMultiplier: 1.3,
    waitRecommendation: 'high',
  },
};
