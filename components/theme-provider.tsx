'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useAppStore((state) => state.settings.darkMode);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [darkMode, mounted]);
  
  return <>{children}</>;
}
