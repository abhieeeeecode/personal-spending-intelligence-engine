'use client';

import { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { SearchResult } from '@/lib/types';
import { PlatformOption } from './platform-option';
import { WaitOption } from './wait-option';
import { RegretWarning } from './regret-warning';
import { CategoryBadge } from './category-badge';

interface SearchResultsProps {
  result: SearchResult;
  onBack: () => void;
}

export function SearchResults({ result, onBack }: SearchResultsProps) {
  const [showAll, setShowAll] = useState(false);
  
  const { query, category, options, waitOption, regretProbability } = result;
  const displayedOptions = showAll ? options : options.slice(0, 3);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground hover:bg-secondary/80 transition-colors shrink-0 min-h-[44px] min-w-[44px]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI-powered results for</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground text-balance">{`"${query}"`}</h1>
          <div className="mt-2">
            <CategoryBadge category={category} />
          </div>
        </div>
      </div>
      
      {/* Regret Warning */}
      {regretProbability !== undefined && regretProbability >= 50 && (
        <RegretWarning 
          probability={regretProbability}
          onContinueAnyway={() => {}}
        />
      )}
      
      {/* Decision Engine Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Best Options for You</h2>
        <span className="text-sm text-muted-foreground">{options.length} platforms</span>
      </div>
      
      {/* Platform Options */}
      <div className="space-y-4">
        {displayedOptions.map((option, index) => (
          <PlatformOption
            key={option.platform.id}
            option={option}
            rank={index + 1}
            isBestDeal={index === 0}
          />
        ))}
      </div>
      
      {/* Show More Button */}
      {options.length > 3 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors border border-dashed border-border rounded-xl min-h-[44px]"
        >
          Show {options.length - 3} more options
        </button>
      )}
      
      {/* Wait Option */}
      {waitOption && options.length > 0 && (
        <div className="pt-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Or wait for a better deal</h3>
          <WaitOption 
            option={waitOption} 
            currentBestPrice={options[0].discountedPrice} 
          />
        </div>
      )}
      
      {/* User Control Notice */}
      <div className="text-center py-4">
        <p className="text-xs text-muted-foreground">
          You&apos;re always in control. We suggest, you decide.
        </p>
      </div>
    </div>
  );
}
