'use client';

import { TrendingUp, TrendingDown, Wallet, Target, PiggyBank, ArrowUp, ArrowDown } from 'lucide-react';
import { SpendingStats as SpendingStatsType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SpendingStatsProps {
  stats: SpendingStatsType;
}

export function SpendingStats({ stats }: SpendingStatsProps) {
  const { totalSpent, optimalSpend, missedSavings, weeklyChange } = stats;
  const isPositiveChange = weeklyChange >= 0;
  
  return (
    <div className="space-y-4">
      {/* Main Stats Card */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">This Week</h3>
          <div
            className={cn(
              'flex items-center gap-1 text-sm font-medium',
              isPositiveChange ? 'text-danger' : 'text-savings'
            )}
          >
            {isPositiveChange ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            {Math.abs(weeklyChange)}%
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">₹{totalSpent.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Spent</p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-savings/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-savings" />
              </div>
            </div>
            <p className="text-2xl font-bold text-savings">₹{optimalSpend.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Optimal</p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-danger/10 flex items-center justify-center">
                <PiggyBank className="w-4 h-4 text-danger" />
              </div>
            </div>
            <p className="text-2xl font-bold text-danger">₹{missedSavings.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Missed</p>
          </div>
        </div>
      </div>
      
      {/* Savings Alert */}
      <div className="bg-savings/10 border border-savings/20 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-savings/20 flex items-center justify-center shrink-0">
          <TrendingDown className="w-5 h-5 text-savings" />
        </div>
        <div>
          <p className="text-sm font-medium text-savings">
            You could have saved ₹{missedSavings.toLocaleString()} this week
          </p>
          <p className="text-xs text-savings/70">
            By using PSIE recommendations consistently
          </p>
        </div>
      </div>
    </div>
  );
}
