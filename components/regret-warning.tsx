'use client';

import { AlertTriangle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RegretWarningProps {
  probability: number;
  onContinueAnyway?: () => void;
}

export function RegretWarning({ probability, onContinueAnyway }: RegretWarningProps) {
  const isHighRisk = probability >= 70;
  const isMediumRisk = probability >= 50 && probability < 70;
  
  return (
    <div
      className={cn(
        'rounded-2xl p-4 border',
        isHighRisk && 'bg-danger/10 border-danger/30',
        isMediumRisk && 'bg-warning/10 border-warning/30',
        !isHighRisk && !isMediumRisk && 'bg-card border-border'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
            isHighRisk && 'bg-danger/20 text-danger',
            isMediumRisk && 'bg-warning/20 text-warning',
            !isHighRisk && !isMediumRisk && 'bg-muted text-muted-foreground'
          )}
        >
          <AlertTriangle className="w-5 h-5" />
        </div>
        
        <div className="flex-1">
          <p
            className={cn(
              'text-sm font-medium',
              isHighRisk && 'text-danger',
              isMediumRisk && 'text-warning',
              !isHighRisk && !isMediumRisk && 'text-muted-foreground'
            )}
          >
            You may regret ordering now ({probability}% chance)
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isHighRisk 
              ? 'Prices are likely to drop soon. Consider waiting for a better deal.'
              : isMediumRisk
              ? 'There might be better deals available later.'
              : 'This seems like a reasonable time to purchase.'}
          </p>
        </div>
      </div>
      
      {(isHighRisk || isMediumRisk) && onContinueAnyway && (
        <button
          onClick={onContinueAnyway}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px]"
        >
          <span>Not interested? Continue anyway</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
