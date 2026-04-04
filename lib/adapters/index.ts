export * from './base-adapter';
export * from './amazon-adapter';
export * from './flipkart-adapter';
export * from './myntra-adapter';
export * from './ajio-adapter';
export * from './meesho-adapter';

import { amazonAdapter } from './amazon-adapter';
import { flipkartAdapter } from './flipkart-adapter';
import { myntraAdapter } from './myntra-adapter';
import { ajioAdapter } from './ajio-adapter';
import { meeshoAdapter } from './meesho-adapter';
import { PlatformAdapter } from './base-adapter';

// Registry of all platform adapters
export const platformAdapters: Record<string, PlatformAdapter> = {
  amazon: amazonAdapter,
  flipkart: flipkartAdapter,
  myntra: myntraAdapter,
  ajio: ajioAdapter,
  meesho: meeshoAdapter,
};

// Get adapter by platform ID
export function getAdapter(platformId: string): PlatformAdapter | undefined {
  return platformAdapters[platformId];
}

// Get all available adapters
export function getAllAdapters(): PlatformAdapter[] {
  return Object.values(platformAdapters);
}

// Get adapters for a specific category
export function getAdaptersForCategory(category: string): PlatformAdapter[] {
  const fashionAdapters = ['amazon', 'flipkart', 'myntra', 'ajio', 'meesho'];
  const generalAdapters = ['amazon', 'flipkart'];
  
  switch (category) {
    case 'fashion':
      return fashionAdapters.map(id => platformAdapters[id]).filter(Boolean);
    case 'food':
    case 'grocery':
    case 'travel':
      return generalAdapters.map(id => platformAdapters[id]).filter(Boolean);
    default:
      return getAllAdapters();
  }
}
