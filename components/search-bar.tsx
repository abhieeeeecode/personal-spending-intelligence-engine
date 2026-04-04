'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching?: boolean;
}

const suggestions = [
  'pizza',
  'milk',
  'nike shoes',
  'book cab',
  't-shirt under 1000',
  'biryani',
  'groceries',
];

export function SearchBar({ onSearch, isSearching }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={inputRef}>
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            'relative flex items-center rounded-2xl bg-card border border-border transition-all duration-300',
            isFocused && 'border-primary/50 ring-1 ring-primary/20'
          )}
        >
          <div className="flex items-center justify-center w-12 h-12 text-muted-foreground">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => setIsFocused(false)}
            placeholder="Search anything... food, groceries, fashion, travel"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base py-4 pr-4"
            disabled={isSearching}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-2 mr-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={!query.trim() || isSearching}
            className={cn(
              'mr-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm transition-all duration-200',
              'hover:bg-primary/90 active:scale-95',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
              'flex items-center gap-2 min-h-[44px]'
            )}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && !isSearching && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl overflow-hidden z-50 shadow-xl">
          <div className="p-3 border-b border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Try searching for</p>
          </div>
          <div className="p-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors flex items-center gap-3 min-h-[44px]"
              >
                <Search className="w-4 h-4 text-muted-foreground" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
