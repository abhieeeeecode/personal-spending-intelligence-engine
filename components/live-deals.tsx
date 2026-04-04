'use client';

import { Flame, Clock, ExternalLink, ChevronRight } from 'lucide-react';
import { Deal } from '@/lib/types';
import { cn } from '@/lib/utils';

interface LiveDealsProps {
  deals: Deal[];
}

function formatTimeRemaining(expiresAt: Date): string {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function LiveDeals({ deals }: LiveDealsProps) {
  if (deals.length === 0) return null;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-danger" />
          <h3 className="text-lg font-semibold text-foreground">Live Deals Right Now</h3>
        </div>
        <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors min-h-[44px] px-2">
          View all
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
        {deals.map((deal) => (
          <a
            key={deal.id}
            href={deal.deepLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'shrink-0 w-[200px] snap-start',
              'bg-card border border-border rounded-2xl p-4 transition-all duration-300',
              'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
              'group'
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                style={{ backgroundColor: `${deal.platform.color}20`, color: deal.platform.color }}
              >
                {deal.platform.name.charAt(0)}
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <h4 className="font-semibold text-foreground text-sm mb-1 line-clamp-1">
              {deal.platform.name}
            </h4>
            
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold text-savings">
                {deal.discount}
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{formatTimeRemaining(deal.expiresAt)} left</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
