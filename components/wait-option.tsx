'use client';

import { useState } from 'react';
import { Clock, Bell, BellRing, TrendingDown, Check } from 'lucide-react';
import { WaitOption as WaitOptionType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface WaitOptionProps {
  option: WaitOptionType;
  currentBestPrice: number;
}

export function WaitOption({ option, currentBestPrice }: WaitOptionProps) {
  const [reminderSet, setReminderSet] = useState(false);
  const { expectedPrice, waitTime, probability } = option;
  
  const potentialSavings = currentBestPrice - expectedPrice;
  
  const handleSetReminder = () => {
    setReminderSet(true);
    // In production, this would set up a real notification
    setTimeout(() => {
      setReminderSet(false);
    }, 3000);
  };
  
  return (
    <div className="bg-card border border-dashed border-warning/50 rounded-2xl p-4">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
          <Clock className="w-6 h-6 text-warning" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">Wait for Better Price</h3>
            <div className="px-2 py-0.5 bg-warning/10 text-warning text-xs font-medium rounded-full">
              {probability}% likely
            </div>
          </div>
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-foreground">
              ₹{expectedPrice}
            </span>
            <span className="text-sm text-muted-foreground">
              expected in {waitTime}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <TrendingDown className="w-4 h-4 text-savings" />
            <span className="text-savings font-medium">
              Potential savings: ₹{potentialSavings}
            </span>
          </div>
        </div>
      </div>
      
      <button
        onClick={handleSetReminder}
        disabled={reminderSet}
        className={cn(
          'mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all duration-200 min-h-[44px]',
          reminderSet
            ? 'bg-savings/10 text-savings'
            : 'bg-warning/10 text-warning hover:bg-warning/20'
        )}
      >
        {reminderSet ? (
          <>
            <Check className="w-4 h-4" />
            <span>Reminder Set!</span>
          </>
        ) : (
          <>
            <Bell className="w-4 h-4" />
            <span>Remind Me</span>
          </>
        )}
      </button>
    </div>
  );
}
