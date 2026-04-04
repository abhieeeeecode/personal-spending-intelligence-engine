'use client';

import { UtensilsCrossed, ShoppingBasket, Shirt, Car } from 'lucide-react';
import { Category } from '@/lib/types';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  onCategoryClick: (category: Category) => void;
}

const categories = [
  { id: 'food' as Category, label: 'Food', icon: UtensilsCrossed, color: '#FC8019', query: 'food delivery' },
  { id: 'grocery' as Category, label: 'Grocery', icon: ShoppingBasket, color: '#84C225', query: 'groceries' },
  { id: 'fashion' as Category, label: 'Fashion', icon: Shirt, color: '#FF3F6C', query: 'trending fashion' },
  { id: 'travel' as Category, label: 'Travel', icon: Car, color: '#2874F0', query: 'book cab' },
];

export function QuickActions({ onCategoryClick }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {categories.map((category) => {
        const Icon = category.icon;
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border',
              'transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
              'active:scale-95 min-h-[80px]'
            )}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <Icon className="w-5 h-5" style={{ color: category.color }} />
            </div>
            <span className="text-xs font-medium text-foreground">{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}
