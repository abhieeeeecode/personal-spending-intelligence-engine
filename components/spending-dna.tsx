'use client';

import { Zap, PiggyBank, Sofa, Calendar } from 'lucide-react';
import { SpendingDNA as SpendingDNAType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SpendingDNAProps {
  dna: SpendingDNAType;
}

const traits = [
  { 
    key: 'impulsive' as const, 
    label: 'Impulsive', 
    icon: Zap, 
    color: 'text-danger',
    bgColor: 'bg-danger/10',
    barColor: 'bg-danger'
  },
  { 
    key: 'saver' as const, 
    label: 'Saver', 
    icon: PiggyBank, 
    color: 'text-savings',
    bgColor: 'bg-savings/10',
    barColor: 'bg-savings'
  },
  { 
    key: 'convenience' as const, 
    label: 'Convenience', 
    icon: Sofa, 
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    barColor: 'bg-warning'
  },
  { 
    key: 'planner' as const, 
    label: 'Planner', 
    icon: Calendar, 
    color: 'text-chart-2',
    bgColor: 'bg-chart-2/10',
    barColor: 'bg-chart-2'
  },
];

export function SpendingDNA({ dna }: SpendingDNAProps) {
  // Find the dominant trait
  const dominantTrait = traits.reduce((prev, curr) => 
    dna[curr.key] > dna[prev.key] ? curr : prev
  , traits[0]);
  
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Your Spending DNA</h3>
          <p className="text-sm text-muted-foreground">Behavioral analysis</p>
        </div>
        <div className={cn('px-3 py-1.5 rounded-full text-xs font-medium', dominantTrait.bgColor, dominantTrait.color)}>
          {dominantTrait.label} Spender
        </div>
      </div>
      
      <div className="space-y-4">
        {traits.map((trait) => {
          const Icon = trait.icon;
          const value = dna[trait.key];
          
          return (
            <div key={trait.key}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', trait.bgColor)}>
                    <Icon className={cn('w-4 h-4', trait.color)} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{trait.label}</span>
                </div>
                <span className={cn('text-sm font-bold', trait.color)}>{value}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', trait.barColor)}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
