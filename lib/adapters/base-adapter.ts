import { PriceData, Platform, PriceSource } from '../types';

export interface AdapterResult {
  success: boolean;
  data?: PriceData;
  error?: string;
}

export interface PlatformAdapter {
  platformId: string;
  platform: Platform;
  
  // Core method to fetch price data
  fetchPrice(query: string): Promise<AdapterResult>;
  
  // Generate product URL for the query
  generateProductUrl(query: string): string;
  
  // Check if adapter is healthy/available
  healthCheck(): Promise<boolean>;
}

// Base configuration for adapters
export const ADAPTER_CONFIG = {
  TIMEOUT_MS: 3000, // 3 second timeout per platform
  RETRY_COUNT: 1,
  USER_AGENT: 'Mozilla/5.0 (compatible; PSIE/1.0; +https://psie.app)',
};

// Helper to create fallback estimated price
export function createEstimatedPrice(
  basePrice: number,
  variance: number = 0.15
): PriceData {
  const priceVariation = 1 + (Math.random() - 0.5) * variance * 2;
  const price = Math.round(basePrice * priceVariation);
  const discountPercent = Math.floor(Math.random() * 25) + 5;
  const originalPrice = Math.round(price / (1 - discountPercent / 100));
  
  return {
    price,
    originalPrice,
    discount: discountPercent,
    source: 'estimated' as PriceSource,
    lastUpdated: new Date(),
    confidence: 35 + Math.floor(Math.random() * 20), // 35-55% confidence for estimates
  };
}

// Helper to normalize price strings
export function normalizePrice(priceStr: string): number {
  // Remove currency symbols, commas, spaces
  const cleaned = priceStr
    .replace(/[₹$€£¥]/g, '')
    .replace(/,/g, '')
    .replace(/\s/g, '')
    .trim();
  
  // Extract number
  const match = cleaned.match(/[\d.]+/);
  if (!match) return 0;
  
  return Math.round(parseFloat(match[0]));
}

// Helper to extract discount percentage
export function extractDiscount(text: string): number | null {
  const patterns = [
    /(\d+)%\s*off/i,
    /(\d+)%\s*discount/i,
    /save\s*(\d+)%/i,
    /flat\s*(\d+)%/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseInt(match[1], 10);
    }
  }
  
  return null;
}

// Helper to extract coupon codes
export function extractCoupon(text: string): string | null {
  const patterns = [
    /code[:\s]+([A-Z0-9]{4,15})/i,
    /coupon[:\s]+([A-Z0-9]{4,15})/i,
    /use\s+([A-Z0-9]{4,15})/i,
    /apply\s+([A-Z0-9]{4,15})/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].toUpperCase();
    }
  }
  
  return null;
}

// Helper to extract sale tags
export function extractSaleTags(text: string): string[] {
  const tags: string[] = [];
  const patterns = [
    /lightning\s*deal/i,
    /flash\s*sale/i,
    /limited\s*time/i,
    /today['\s]s\s*deal/i,
    /best\s*seller/i,
    /prime\s*day/i,
    /festive\s*sale/i,
    /clearance/i,
    /big\s*billion/i,
    /great\s*indian/i,
  ];
  
  for (const pattern of patterns) {
    if (pattern.test(text)) {
      const match = text.match(pattern);
      if (match) {
        tags.push(match[0].replace(/\s+/g, ' ').trim());
      }
    }
  }
  
  return tags;
}
