'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/header';
import { SearchBar } from '@/components/search-bar';
import { QuickActions } from '@/components/quick-actions';
import { Dashboard } from '@/components/dashboard';
import { SearchResults } from '@/components/search-results';
import { BottomNav } from '@/components/bottom-nav';
import { AnalyticsView } from '@/components/analytics-view';
import { SettingsView } from '@/components/settings-view';
import { SearchResult, SpendingStats, SpendingDNA, Deal, Category, Transaction } from '@/lib/types';
import { searchPlatforms, generateLiveDeals, getSpendingStats, getSpendingDNA, getRecentTransactions } from '@/lib/decision-engine';
import { Loader2 } from 'lucide-react';

type Tab = 'home' | 'search' | 'analytics' | 'settings';

export default function PSIEApp() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [stats, setStats] = useState<SpendingStats | null>(null);
  const [dna, setDNA] = useState<SpendingDNA | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load initial data
  useEffect(() => {
    setStats(getSpendingStats());
    setDNA(getSpendingDNA());
    setDeals(generateLiveDeals());
    setTransactions(getRecentTransactions());
    
    // Refresh deals periodically
    const interval = setInterval(() => {
      setDeals(generateLiveDeals());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setIsSearching(true);
    setActiveTab('search');
    
    // Simulate API delay
    setTimeout(() => {
      const result = searchPlatforms(query);
      setSearchResult(result);
      setIsSearching(false);
    }, 800);
  }, []);

  const handleCategoryClick = useCallback((category: Category) => {
    const queries: Record<Category, string> = {
      food: 'food delivery',
      grocery: 'groceries',
      fashion: 'trending fashion',
      travel: 'book cab',
    };
    handleSearch(queries[category]);
  }, [handleSearch]);

  const handleBackToHome = useCallback(() => {
    setSearchResult(null);
    setActiveTab('home');
  }, []);

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      setSearchResult(null);
    }
  }, []);

  // Render content based on active tab
  const renderContent = () => {
    // Analytics Tab
    if (activeTab === 'analytics') {
      return <AnalyticsView transactions={transactions} />;
    }
    
    // Settings Tab
    if (activeTab === 'settings') {
      return <SettingsView />;
    }
    
    // Search Tab or Home Tab with search results
    if (activeTab === 'search' || searchResult) {
      if (isSearching) {
        return (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground text-sm">Finding the best deals for you...</p>
          </div>
        );
      }
      
      if (searchResult) {
        return <SearchResults result={searchResult} onBack={handleBackToHome} />;
      }
      
      // Search tab without results - show search prompt
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Search for anything</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Type what you want to buy and we&apos;ll find the best deals across all platforms
          </p>
        </div>
      );
    }
    
    // Home Tab - default view
    return (
      <div className="space-y-8">
        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Quick Search</h2>
          <QuickActions onCategoryClick={handleCategoryClick} />
        </div>
        
        {/* Dashboard */}
        {stats && dna && <Dashboard stats={stats} dna={dna} deals={deals} />}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-background pb-28">
      <div className="max-w-lg mx-auto px-4">
        <Header />
        
        {/* Search Bar - show on home and search tabs */}
        {(activeTab === 'home' || activeTab === 'search') && (
          <div className="py-4">
            <SearchBar onSearch={handleSearch} isSearching={isSearching} />
          </div>
        )}
        
        {/* Main Content */}
        {renderContent()}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </main>
  );
}
