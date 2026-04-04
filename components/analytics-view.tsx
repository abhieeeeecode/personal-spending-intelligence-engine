'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowRight, Calendar, Filter, ChevronDown } from 'lucide-react';
import { Transaction, Category } from '@/lib/types';
import { categoryLabels } from '@/lib/platforms';
import { cn } from '@/lib/utils';

interface AnalyticsViewProps {
  transactions: Transaction[];
}

const categoryColors: Record<Category, string> = {
  food: '#FC8019',
  grocery: '#84C225',
  fashion: '#FF3F6C',
  travel: '#2874F0',
};

export function AnalyticsView({ transactions }: AnalyticsViewProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  // Calculate category breakdown
  const categorySpending = transactions.reduce((acc, txn) => {
    acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
    return acc;
  }, {} as Record<Category, number>);
  
  const totalSpent = Object.values(categorySpending).reduce((a, b) => a + b, 0);
  const totalOptimal = transactions.reduce((acc, txn) => acc + txn.optimalAmount, 0);
  const totalSaved = totalSpent - totalOptimal;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Track your spending patterns</p>
        </div>
        
        <button className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-xl text-sm text-foreground min-h-[44px]">
          <Calendar className="w-4 h-4" />
          <span className="capitalize">{timeRange}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-foreground">₹{totalSpent.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1 text-danger text-sm">
            <TrendingUp className="w-3 h-3" />
            <span>12% vs last week</span>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Could Have Saved</p>
          <p className="text-2xl font-bold text-danger">₹{totalSaved.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1 text-savings text-sm">
            <TrendingDown className="w-3 h-3" />
            <span>Better than avg</span>
          </div>
        </div>
      </div>
      
      {/* Category Breakdown */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Spending by Category</h3>
        
        <div className="space-y-4">
          {(Object.entries(categorySpending) as [Category, number][]).map(([category, amount]) => {
            const percentage = Math.round((amount / totalSpent) * 100);
            const color = categoryColors[category];
            
            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-medium text-foreground">
                      {categoryLabels[category]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      ₹{amount.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({percentage}%)
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-sm font-medium text-foreground">Recent Transactions</h3>
          <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 min-h-[44px]">
            View all
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="divide-y divide-border">
          {transactions.slice(0, 5).map((txn) => {
            const savings = txn.amount - txn.optimalAmount;
            const hasSavings = savings > 0;
            
            return (
              <div key={txn.id} className="flex items-center gap-4 p-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ 
                    backgroundColor: `${txn.platform.color}20`, 
                    color: txn.platform.color 
                  }}
                >
                  {txn.platform.name.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{txn.item}</p>
                  <p className="text-xs text-muted-foreground">
                    {txn.platform.name} • {txn.date.toLocaleDateString()}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">₹{txn.amount}</p>
                  {hasSavings && (
                    <p className="text-xs text-danger">-₹{savings} missed</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
