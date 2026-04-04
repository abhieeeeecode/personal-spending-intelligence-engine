'use client';

import { ExternalLink, Clock, Star, Tag, TrendingDown } from 'lucide-react';
import { PlatformOption as PlatformOptionType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PlatformOptionProps {
  option: PlatformOptionType;
  rank: number;
  isBestDeal?: boolean;
}

export function PlatformOption({ option, rank, isBestDeal }: PlatformOptionProps) {
  const { platform, originalPrice, discountedPrice, couponCode, savings, deliveryTime, rating, deepLink } = option;
  
  const savingsPercentage = Math.round((savings / originalPrice) * 100);
  
  return (
    <div
      className={cn(
        'relative bg-card border border-border rounded-2xl p-4 transition-all duration-300',
        'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
        isBestDeal && 'border-savings/50 bg-savings/5'
      )}
    >
      {/* Best Deal Badge */}
      {isBestDeal && (
        <div className="absolute -top-3 left-4 px-3 py-1 bg-savings text-savings-foreground text-xs font-semibold rounded-full flex items-center gap-1">
          <TrendingDown className="w-3 h-3" />
          Best Deal
        </div>
      )}
      
      {/* Rank Badge */}
      <div className="absolute -top-3 right-4 w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-xs font-bold text-foreground">
        {rank}
      </div>
      
      <div className="flex items-start gap-4">
        {/* Platform Logo */}
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shrink-0"
          style={{ backgroundColor: `${platform.color}20`, color: platform.color }}
        >
          {platform.name.charAt(0)}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Platform Name & Rating */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">{platform.name}</h3>
            {rating && (
              <div className="flex items-center gap-1 text-xs text-warning">
                <Star className="w-3 h-3 fill-warning" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-foreground">
              ₹{discountedPrice}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              ₹{originalPrice}
            </span>
            <span className="text-sm font-medium text-savings">
              {savingsPercentage}% off
            </span>
          </div>
          
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {couponCode && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-savings/10 text-savings rounded-md text-xs font-medium">
                <Tag className="w-3 h-3" />
                {couponCode}
              </div>
            )}
            {deliveryTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {deliveryTime}
              </div>
            )}
            <div className="text-savings font-medium">
              Save ₹{savings}
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Button */}
      <a
        href={deepLink}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all duration-200 min-h-[44px]',
          isBestDeal 
            ? 'bg-savings text-savings-foreground hover:bg-savings/90' 
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        )}
      >
        <span>Order on {platform.name}</span>
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
}
