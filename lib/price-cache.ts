// In-memory cache for price data
// In production, use Redis or similar for distributed caching

import { PriceData } from './types';

interface CacheEntry {
  data: PriceData;
  timestamp: number;
  query: string;
  platformId: string;
  accessCount: number;
}

// Cache configuration
const CACHE_CONFIG = {
  DEFAULT_TTL_MS: 15 * 60 * 1000, // 15 minutes default
  FAST_TTL_MS: 5 * 60 * 1000, // 5 minutes for frequently accessed
  MAX_ENTRIES: 1000,
  HIGH_ACCESS_THRESHOLD: 5, // Items accessed more than this get faster refresh
};

class PriceCache {
  private cache: Map<string, CacheEntry> = new Map();
  
  private generateKey(platformId: string, query: string): string {
    return `${platformId}:${query.toLowerCase().trim()}`;
  }
  
  private getTTL(entry: CacheEntry): number {
    // Frequently accessed items get shorter TTL for fresher data
    return entry.accessCount > CACHE_CONFIG.HIGH_ACCESS_THRESHOLD
      ? CACHE_CONFIG.FAST_TTL_MS
      : CACHE_CONFIG.DEFAULT_TTL_MS;
  }
  
  private isExpired(entry: CacheEntry): boolean {
    const ttl = this.getTTL(entry);
    return Date.now() - entry.timestamp > ttl;
  }
  
  private cleanup(): void {
    // Remove expired entries and trim if over max
    const entries = Array.from(this.cache.entries());
    
    // Remove expired
    for (const [key, entry] of entries) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
      }
    }
    
    // Trim oldest if still over max
    if (this.cache.size > CACHE_CONFIG.MAX_ENTRIES) {
      const sorted = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = sorted.slice(0, this.cache.size - CACHE_CONFIG.MAX_ENTRIES);
      for (const [key] of toRemove) {
        this.cache.delete(key);
      }
    }
  }
  
  get(platformId: string, query: string): PriceData | null {
    const key = this.generateKey(platformId, query);
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }
    
    // Increment access count for popularity tracking
    entry.accessCount++;
    
    // Return with updated source to indicate cached
    return {
      ...entry.data,
      source: 'cached',
      lastUpdated: new Date(entry.timestamp),
    };
  }
  
  set(platformId: string, query: string, data: PriceData): void {
    const key = this.generateKey(platformId, query);
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      query: query.toLowerCase().trim(),
      platformId,
      accessCount: 0,
    });
    
    // Periodic cleanup
    if (Math.random() < 0.1) {
      this.cleanup();
    }
  }
  
  getAge(platformId: string, query: string): number | null {
    const key = this.generateKey(platformId, query);
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    return Math.round((Date.now() - entry.timestamp) / 1000); // Age in seconds
  }
  
  invalidate(platformId: string, query?: string): void {
    if (query) {
      const key = this.generateKey(platformId, query);
      this.cache.delete(key);
    } else {
      // Remove all entries for this platform
      for (const [key] of this.cache) {
        if (key.startsWith(`${platformId}:`)) {
          this.cache.delete(key);
        }
      }
    }
  }
  
  getStats(): { size: number; platforms: Record<string, number> } {
    const platforms: Record<string, number> = {};
    
    for (const [, entry] of this.cache) {
      platforms[entry.platformId] = (platforms[entry.platformId] || 0) + 1;
    }
    
    return {
      size: this.cache.size,
      platforms,
    };
  }
}

// Singleton instance
export const priceCache = new PriceCache();
