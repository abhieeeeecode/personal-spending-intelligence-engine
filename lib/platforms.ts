import { Platform, Category } from './types';

export const platforms: Platform[] = [
  // Food
  {
    id: 'swiggy',
    name: 'Swiggy',
    category: 'food',
    logo: '/platforms/swiggy.svg',
    color: '#FC8019',
    baseUrl: 'https://www.swiggy.com',
    searchUrl: 'https://www.swiggy.com/search?query=',
  },
  {
    id: 'zomato',
    name: 'Zomato',
    category: 'food',
    logo: '/platforms/zomato.svg',
    color: '#E23744',
    baseUrl: 'https://www.zomato.com',
    searchUrl: 'https://www.zomato.com/search?q=',
  },
  // Grocery
  {
    id: 'blinkit',
    name: 'Blinkit',
    category: 'grocery',
    logo: '/platforms/blinkit.svg',
    color: '#F8CB46',
    baseUrl: 'https://blinkit.com',
    searchUrl: 'https://blinkit.com/s/?q=',
  },
  {
    id: 'zepto',
    name: 'Zepto',
    category: 'grocery',
    logo: '/platforms/zepto.svg',
    color: '#8B5CF6',
    baseUrl: 'https://www.zeptonow.com',
    searchUrl: 'https://www.zeptonow.com/search?query=',
  },
  {
    id: 'bigbasket',
    name: 'BigBasket',
    category: 'grocery',
    logo: '/platforms/bigbasket.svg',
    color: '#84C225',
    baseUrl: 'https://www.bigbasket.com',
    searchUrl: 'https://www.bigbasket.com/ps/?q=',
  },
  // Fashion
  {
    id: 'amazon',
    name: 'Amazon',
    category: 'fashion',
    logo: '/platforms/amazon.svg',
    color: '#FF9900',
    baseUrl: 'https://www.amazon.in',
    searchUrl: 'https://www.amazon.in/s?k=',
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    category: 'fashion',
    logo: '/platforms/flipkart.svg',
    color: '#2874F0',
    baseUrl: 'https://www.flipkart.com',
    searchUrl: 'https://www.flipkart.com/search?q=',
  },
  {
    id: 'myntra',
    name: 'Myntra',
    category: 'fashion',
    logo: '/platforms/myntra.svg',
    color: '#FF3F6C',
    baseUrl: 'https://www.myntra.com',
    searchUrl: 'https://www.myntra.com/',
  },
  {
    id: 'ajio',
    name: 'AJIO',
    category: 'fashion',
    logo: '/platforms/ajio.svg',
    color: '#4A4A4A',
    baseUrl: 'https://www.ajio.com',
    searchUrl: 'https://www.ajio.com/search/?text=',
  },
  {
    id: 'meesho',
    name: 'Meesho',
    category: 'fashion',
    logo: '/platforms/meesho.svg',
    color: '#F43397',
    baseUrl: 'https://www.meesho.com',
    searchUrl: 'https://www.meesho.com/search?q=',
  },
  // Travel
  {
    id: 'uber',
    name: 'Uber',
    category: 'travel',
    logo: '/platforms/uber.svg',
    color: '#000000',
    baseUrl: 'https://www.uber.com',
    searchUrl: 'https://m.uber.com/looking',
  },
  {
    id: 'rapido',
    name: 'Rapido',
    category: 'travel',
    logo: '/platforms/rapido.svg',
    color: '#FFDC00',
    baseUrl: 'https://www.rapido.bike',
    searchUrl: 'https://www.rapido.bike',
  },
  {
    id: 'ola',
    name: 'Ola',
    category: 'travel',
    logo: '/platforms/ola.svg',
    color: '#1C8A27',
    baseUrl: 'https://www.olacabs.com',
    searchUrl: 'https://www.olacabs.com',
  },
  {
    id: 'porter',
    name: 'Porter',
    category: 'travel',
    logo: '/platforms/porter.svg',
    color: '#2C3E50',
    baseUrl: 'https://porter.in',
    searchUrl: 'https://porter.in',
  },
];

export const getPlatformsByCategory = (category: Category): Platform[] => {
  return platforms.filter(p => p.category === category);
};

export const getPlatformById = (id: string): Platform | undefined => {
  return platforms.find(p => p.id === id);
};

export const generateDeepLink = (platform: Platform, query: string): string => {
  return `${platform.searchUrl}${encodeURIComponent(query)}`;
};

export const categoryKeywords: Record<Category, string[]> = {
  food: ['pizza', 'burger', 'biryani', 'chicken', 'food', 'restaurant', 'dinner', 'lunch', 'breakfast', 'snack', 'dessert', 'cake', 'ice cream', 'coffee', 'tea', 'momos', 'noodles', 'pasta', 'sandwich', 'wrap', 'rolls', 'dosa', 'idli', 'paratha', 'thali', 'meal'],
  grocery: ['milk', 'bread', 'eggs', 'vegetables', 'fruits', 'grocery', 'rice', 'dal', 'oil', 'sugar', 'flour', 'atta', 'paneer', 'butter', 'cheese', 'curd', 'yogurt', 'juice', 'water', 'snacks', 'chips', 'biscuits', 'cereal', 'detergent', 'soap', 'shampoo'],
  fashion: ['shirt', 'shoes', 'jeans', 't-shirt', 'dress', 'jacket', 'watch', 'bag', 'fashion', 'clothes', 'wear', 'nike', 'adidas', 'puma', 'levis', 'trouser', 'kurta', 'saree', 'ethnic', 'formal', 'casual', 'sneakers', 'sandals', 'heels'],
  travel: ['cab', 'taxi', 'ride', 'uber', 'ola', 'rapido', 'bike', 'auto', 'travel', 'book cab', 'book ride', 'porter', 'moving', 'transport', 'commute'],
};

export const detectCategory = (query: string): Category => {
  const lowerQuery = query.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
      return category as Category;
    }
  }
  
  // Default to fashion for general product searches
  return 'fashion';
};

export const categoryLabels: Record<Category, string> = {
  food: 'Food & Dining',
  grocery: 'Grocery & Essentials',
  fashion: 'Fashion & Shopping',
  travel: 'Travel & Rides',
};

export const categoryIcons: Record<Category, string> = {
  food: 'UtensilsCrossed',
  grocery: 'ShoppingBasket',
  fashion: 'Shirt',
  travel: 'Car',
};
