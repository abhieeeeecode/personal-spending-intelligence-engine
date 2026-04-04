import { Category, PlatformOption, WaitOption, SearchResult, Deal, SpendingStats, SpendingDNA, Transaction } from './types';
import { platforms, getPlatformsByCategory, detectCategory, generateDeepLink } from './platforms';

// Mock pricing engine - in production this would use real APIs/scraping
const generateMockPrice = (basePrice: number, variance: number = 0.3): number => {
  const change = (Math.random() - 0.5) * 2 * variance;
  return Math.round(basePrice * (1 + change));
};

const generateMockDiscount = (): { percentage: number; code?: string } => {
  const hasCode = Math.random() > 0.4;
  const percentage = Math.floor(Math.random() * 30) + 5;
  const codes = ['SAVE20', 'FIRST50', 'BOGO', 'FLAT100', 'NEW15', 'SUPER25', 'DEAL10', 'GRAB30'];
  return {
    percentage,
    code: hasCode ? codes[Math.floor(Math.random() * codes.length)] : undefined,
  };
};

const basePrices: Record<Category, number> = {
  food: 350,
  grocery: 150,
  fashion: 1200,
  travel: 200,
};

export const searchPlatforms = (query: string): SearchResult => {
  const category = detectCategory(query);
  const categoryPlatforms = getPlatformsByCategory(category);
  const basePrice = basePrices[category];
  
  const options: PlatformOption[] = categoryPlatforms.slice(0, 4).map(platform => {
    const originalPrice = generateMockPrice(basePrice);
    const discount = generateMockDiscount();
    const discountedPrice = Math.round(originalPrice * (1 - discount.percentage / 100));
    const savings = originalPrice - discountedPrice;
    
    return {
      platform,
      originalPrice,
      discountedPrice,
      couponCode: discount.code,
      savings,
      deliveryTime: category === 'food' ? `${20 + Math.floor(Math.random() * 25)} mins` : 
                    category === 'grocery' ? `${10 + Math.floor(Math.random() * 15)} mins` :
                    category === 'travel' ? `${3 + Math.floor(Math.random() * 7)} mins` :
                    `${1 + Math.floor(Math.random() * 3)} days`,
      rating: 4 + Math.random(),
      deepLink: generateDeepLink(platform, query),
    };
  });
  
  // Sort by discounted price
  options.sort((a, b) => a.discountedPrice - b.discountedPrice);
  
  // Generate wait option
  const lowestPrice = options[0]?.discountedPrice || basePrice;
  const waitOption: WaitOption = {
    expectedPrice: Math.round(lowestPrice * 0.85),
    waitTime: category === 'food' ? '2-3 hours' : category === 'grocery' ? '1-2 days' : '3-5 days',
    probability: 65 + Math.floor(Math.random() * 25),
  };
  
  // Calculate regret probability based on timing and price
  const regretProbability = Math.min(95, Math.max(20, 
    50 + (options[0]?.savings || 0) / basePrice * 100 - Math.random() * 30
  ));
  
  return {
    query,
    category,
    options,
    waitOption,
    regretProbability: Math.round(regretProbability),
  };
};

// Mock deals
export const generateLiveDeals = (): Deal[] => {
  const deals: Deal[] = [];
  const usedPlatforms = new Set<string>();
  
  platforms.forEach(platform => {
    if (Math.random() > 0.5 && !usedPlatforms.has(platform.id)) {
      usedPlatforms.add(platform.id);
      const discounts = ['40% OFF', '50% OFF', 'BOGO', 'Flat ₹100 OFF', 'Lightning Deal', 'Price Drop', '30% OFF', 'Extra 20% OFF'];
      deals.push({
        id: `deal-${platform.id}-${Date.now()}`,
        platform,
        title: `${platform.name} Special`,
        discount: discounts[Math.floor(Math.random() * discounts.length)],
        expiresAt: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000),
        category: platform.category,
        deepLink: platform.baseUrl,
      });
    }
  });
  
  return deals.slice(0, 6);
};

// Mock spending stats
export const getSpendingStats = (): SpendingStats => {
  const totalSpent = 4500 + Math.floor(Math.random() * 2000);
  const optimalSpend = Math.round(totalSpent * 0.75);
  return {
    totalSpent,
    optimalSpend,
    missedSavings: totalSpent - optimalSpend,
    weeklyChange: Math.round((Math.random() - 0.5) * 20),
  };
};

// Mock spending DNA
export const getSpendingDNA = (): SpendingDNA => {
  const total = 100;
  const impulsive = 15 + Math.floor(Math.random() * 25);
  const saver = 20 + Math.floor(Math.random() * 30);
  const convenience = 15 + Math.floor(Math.random() * 20);
  const planner = total - impulsive - saver - convenience;
  
  return {
    impulsive,
    saver,
    convenience,
    planner: Math.max(5, planner),
  };
};

// Mock recent transactions
export const getRecentTransactions = (): Transaction[] => {
  const items = [
    { name: 'Dominos Pizza', category: 'food' as Category, platform: 'swiggy' },
    { name: 'Milk & Bread', category: 'grocery' as Category, platform: 'blinkit' },
    { name: 'Nike Sneakers', category: 'fashion' as Category, platform: 'amazon' },
    { name: 'Office Commute', category: 'travel' as Category, platform: 'uber' },
    { name: 'Biryani', category: 'food' as Category, platform: 'zomato' },
    { name: 'Groceries', category: 'grocery' as Category, platform: 'zepto' },
  ];
  
  return items.map((item, index) => {
    const platform = platforms.find(p => p.id === item.platform)!;
    const amount = basePrices[item.category] * (0.8 + Math.random() * 0.4);
    return {
      id: `txn-${index}`,
      platform,
      item: item.name,
      amount: Math.round(amount),
      optimalAmount: Math.round(amount * 0.8),
      date: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
      category: item.category,
    };
  });
};
