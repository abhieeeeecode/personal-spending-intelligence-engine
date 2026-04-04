'use client';

import { SpendingStats } from './spending-stats';
import { SpendingDNA } from './spending-dna';
import { LiveDeals } from './live-deals';
import { SpendingStats as SpendingStatsType, SpendingDNA as SpendingDNAType, Deal } from '@/lib/types';

interface DashboardProps {
  stats: SpendingStatsType;
  dna: SpendingDNAType;
  deals: Deal[];
}

export function Dashboard({ stats, dna, deals }: DashboardProps) {
  return (
    <div className="space-y-8">
      {/* Live Deals */}
      <LiveDeals deals={deals} />
      
      {/* Stats */}
      <SpendingStats stats={stats} />
      
      {/* Spending DNA */}
      <SpendingDNA dna={dna} />
    </div>
  );
}
