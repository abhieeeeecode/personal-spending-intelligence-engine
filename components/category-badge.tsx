'use client';

import { UtensilsCrossed, ShoppingBasket, Shirt, Car } from 'lucide-react';
import { Category } from '@/lib/types';
import { categoryLabels } from '@/lib/platforms';
import { cn } from '@/lib/utils';

const categoryConfig: Record<Category, { icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string }> = {
  food: { icon: UtensilsCrossed, color: 'text-orange-400', bgColor: 'bg-orange-400/10' },
  grocery: { icon: ShoppingBasket, color: 'text-green-400', bgColor: 'bg-green-400/10' },
  fashion: { icon: Shirt, color: 'text-pink-400', bgColor: 'bg-pink-400/10' },
  travel: { icon: Car, color: 'text-blue-400', bgColor: 'bg-blue-400/10' },
};

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  const config = categoryConfig[category];
  const Icon = config.icon;
  
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        config.bgColor,
        config.color,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      <span>{categoryLabels[category]}</span>
    </div>
  );
}
