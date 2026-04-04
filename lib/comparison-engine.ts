import { Category, PlatformOption, PriceData, SearchResult, WaitOption } from './types';
import { platforms, detectCategory, generateDeepLink } from './platforms';
import { priceCache } from './price-cache';
import { platformAdapters, getAdaptersForCategory } from './adapters';

interface ComparisonConfig {
  timeout: number;
  useCache: boolean;
  minConfidence: number;
}

const DEFAULT_CONFIG: ComparisonConfig = {
  timeout: 3000, // 3 seconds
  useCache: true,
  minConfidence: 30,
};

// Fetch price from a single platform with timeout
async function fetchWithTimeout(
  platformId: string,
  query: string,
  timeout: number
): Promise<{ platformId: string; data: PriceData | null; error?: string }> {
  const adapter = platformAdapters[platformId];
  
  if (!adapter) {
    return { platformId, data: null, error: 'Adapter not found' };
  }
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), timeout);
  });
  
  try {
    const result = await Promise.race([
      adapter.fetchPrice(query),
      timeoutPromise,
    ]);
    
    if (result.success && result.data) {
      return { platformId, data: result.data };
    }
    
    return { platformId, data: result.data || null, error: result.error };
  } catch (error) {
    return { 
      platformId, 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Main comparison function - fetches from all platforms concurrently
export async function comparePrices(
  query: string,
  config: Partial<ComparisonConfig> = {}
): Promise<SearchResult> {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const category = detectCategory(query);
  const categoryPlatforms = platforms.filter(p => 
    ['amazon', 'flipkart', 'myntra', 'ajio', 'meesho'].includes(p.id) &&
    (category === 'fashion' || ['amazon', 'flipkart'].includes(p.id))
  );
  
  const options: PlatformOption[] = [];
  
  // Try cache first for each platform
  const platformsToFetch: string[] = [];
  
  if (cfg.useCache) {
    for (const platform of categoryPlatforms) {
      const cached = priceCache.get(platform.id, query);
      if (cached && cached.confidence >= cfg.minConfidence) {
        const savings = cached.originalPrice - cached.price;
        options.push({
          platform,
          originalPrice: cached.originalPrice,
          discountedPrice: cached.price,
          couponCode: cached.couponCode,
          savings,
          deliveryTime: getDeliveryTime(platform.id, category),
          rating: 4 + Math.random(),
          deepLink: cached.productUrl || generateDeepLink(platform, query),
          priceSource: 'cached',
          lastUpdated: cached.lastUpdated,
          confidence: cached.confidence,
          saleTags: cached.saleTags,
          productName: cached.productName,
        });
      } else {
        platformsToFetch.push(platform.id);
      }
    }
  } else {
    platformsToFetch.push(...categoryPlatforms.map(p => p.id));
  }
  
  // Fetch from remaining platforms concurrently
  if (platformsToFetch.length > 0) {
    const fetchPromises = platformsToFetch.map(platformId =>
      fetchWithTimeout(platformId, query, cfg.timeout)
    );
    
    const results = await Promise.allSettled(fetchPromises);
    
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.data) {
        const { platformId, data } = result.value;
        const platform = categoryPlatforms.find(p => p.id === platformId);
        
        if (platform && data.confidence >= cfg.minConfidence) {
          // Cache the result
          priceCache.set(platformId, query, data);
          
          const savings = data.originalPrice - data.price;
          options.push({
            platform,
            originalPrice: data.originalPrice,
            discountedPrice: data.price,
            couponCode: data.couponCode,
            savings,
            deliveryTime: getDeliveryTime(platformId, category),
            rating: 4 + Math.random(),
            deepLink: data.productUrl || generateDeepLink(platform, query),
            priceSource: data.source,
            lastUpdated: data.lastUpdated,
            confidence: data.confidence,
            saleTags: data.saleTags,
            productName: data.productName,
          });
        }
      }
    }
  }
  
  // Sort by price (lowest first)
  options.sort((a, b) => a.discountedPrice - b.discountedPrice);
  
  // Generate wait option based on best current price
  const waitOption = generateWaitOption(options, category);
  
  // Calculate regret probability
  const regretProbability = calculateRegretProbability(options, category);
  
  return {
    query,
    category,
    options,
    waitOption,
    regretProbability,
    fetchedAt: new Date(),
  };
}

function getDeliveryTime(platformId: string, category: Category): string {
  const deliveryTimes: Record<string, Record<Category, string>> = {
    amazon: {
      food: '30-45 mins',
      grocery: '2-3 hours',
      fashion: '1-2 days',
      travel: 'N/A',
    },
    flipkart: {
      food: 'N/A',
      grocery: '2-4 hours',
      fashion: '1-3 days',
      travel: 'N/A',
    },
    myntra: {
      food: 'N/A',
      grocery: 'N/A',
      fashion: '2-4 days',
      travel: 'N/A',
    },
    ajio: {
      food: 'N/A',
      grocery: 'N/A',
      fashion: '3-5 days',
      travel: 'N/A',
    },
    meesho: {
      food: 'N/A',
      grocery: 'N/A',
      fashion: '4-7 days',
      travel: 'N/A',
    },
  };
  
  return deliveryTimes[platformId]?.[category] || '2-3 days';
}

function generateWaitOption(options: PlatformOption[], category: Category): WaitOption | undefined {
  if (options.length === 0) return undefined;
  
  const lowestPrice = options[0].discountedPrice;
  
  // Predict future price based on category
  const priceDropProbabilities: Record<Category, { drop: number; time: string; prob: number }> = {
    fashion: { drop: 0.15, time: '3-5 days', prob: 70 },
    food: { drop: 0.05, time: '2-3 hours', prob: 40 },
    grocery: { drop: 0.08, time: '1-2 days', prob: 55 },
    travel: { drop: 0.10, time: '1-2 hours', prob: 50 },
  };
  
  const prediction = priceDropProbabilities[category];
  
  return {
    expectedPrice: Math.round(lowestPrice * (1 - prediction.drop)),
    waitTime: prediction.time,
    probability: prediction.prob + Math.floor(Math.random() * 15),
  };
}

function calculateRegretProbability(options: PlatformOption[], category: Category): number {
  if (options.length === 0) return 0;
  
  // Base regret based on price volatility and category
  const baseRegret: Record<Category, number> = {
    fashion: 45, // Fashion prices drop frequently
    food: 20, // Food prices stable
    grocery: 25, // Grocery fairly stable
    travel: 35, // Travel can vary
  };
  
  // Adjust based on current discounts
  const avgDiscount = options.reduce((sum, o) => {
    const discountPct = Math.round((o.savings / o.originalPrice) * 100);
    return sum + discountPct;
  }, 0) / options.length;
  
  // Higher discounts = lower regret (good deal now)
  // Lower discounts = higher regret (might get better deal later)
  const discountAdjustment = avgDiscount > 30 ? -15 : avgDiscount < 15 ? 15 : 0;
  
  // Confidence adjustment
  const avgConfidence = options.reduce((sum, o) => sum + o.confidence, 0) / options.length;
  const confidenceAdjustment = avgConfidence > 80 ? -10 : avgConfidence < 60 ? 10 : 0;
  
  const finalRegret = Math.min(95, Math.max(15, 
    baseRegret[category] + discountAdjustment + confidenceAdjustment + Math.random() * 10
  ));
  
  return Math.round(finalRegret);
}

// Quick search that returns faster with available results
export async function quickSearch(query: string): Promise<SearchResult> {
  return comparePrices(query, { timeout: 1500 });
}

// Full search with longer timeout for comprehensive results
export async function fullSearch(query: string): Promise<SearchResult> {
  return comparePrices(query, { timeout: 5000, useCache: false });
}
