/**
 * Header Component - Top bar with title and online indicator
 */

'use client';

import { Wifi, WifiOff } from 'lucide-react';
import { useOnline } from '@/lib/hooks/useOnline';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const isOnline = useOnline();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-header-height">
      <div className="flex items-center justify-between h-full px-4">
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        
        <div className="flex items-center gap-2 text-sm">
          {isOnline ? (
            <div className="flex items-center gap-1.5 text-emerald-600">
              <Wifi className="w-4 h-4" />
              <span className="hidden sm:inline">Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-rose-600">
              <WifiOff className="w-4 h-4" />
              <span className="hidden sm:inline">Offline</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
