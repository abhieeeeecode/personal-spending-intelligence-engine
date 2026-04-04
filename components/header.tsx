'use client';

import { Sparkles, User, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  showNotifications?: boolean;
}

export function Header({ showNotifications = true }: HeaderProps) {
  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground tracking-tight">PSIE</h1>
          <p className="text-xs text-muted-foreground">Spending Intelligence</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {showNotifications && (
          <button className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors relative min-h-[44px] min-w-[44px]">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full text-[10px] font-bold text-danger-foreground flex items-center justify-center">
              3
            </span>
          </button>
        )}
        <button className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors min-h-[44px] min-w-[44px]">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
