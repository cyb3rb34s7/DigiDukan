/**
 * Bottom Navigation - Main app navigation
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { href: '/', icon: Home, label: 'होम', labelEn: 'Home' },
  { href: '/inventory', icon: Package, label: 'माल', labelEn: 'Maal' },
  { href: '/add', icon: Plus, label: 'जोड़ें', labelEn: 'Add' },
  { href: '/settings', icon: Settings, label: 'सेटिंग्स', labelEn: 'Settings' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 safe-bottom">
      <div className="grid grid-cols-4 h-nav-height">
        {navItems.map(({ href, icon: Icon, label, labelEn }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 transition-colors no-select',
                'hover:bg-slate-50 active:bg-slate-100',
                isActive ? 'text-blue-700' : 'text-slate-400'
              )}
            >
              <Icon className={cn('w-6 h-6', isActive && 'stroke-[2.5]')} />
              <span className={cn(
                'text-xs',
                isActive && 'font-semibold'
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
