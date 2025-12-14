/**
 * NavDock Component - Munafa OS
 * Glass morphism bottom navigation
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Icon } from './Icon';
import { useTranslation } from '@/lib/contexts/LanguageContext';

export interface NavItem {
  href: string;
  icon: string;
  labelKey: string; // i18n key
}

export interface NavDockProps {
  items?: NavItem[];
  className?: string;
}

const defaultItems: NavItem[] = [
  { href: '/', icon: 'home', labelKey: 'nav.home' },
  { href: '/inventory', icon: 'inventory-2', labelKey: 'nav.inventory' },
  { href: '/add', icon: 'add-circle', labelKey: 'nav.add' },
  { href: '/settings', icon: 'settings', labelKey: 'nav.settings' },
];

export function NavDock({ items = defaultItems, className }: NavDockProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={cn(
        // Fixed bottom position
        'fixed bottom-0 left-0 right-0 z-[100]',
        // Solid background with blur (more visible)
        'bg-surface backdrop-blur-xl',
        // Top border for separation
        'border-t border-border-subtle',
        // Shadow for elevation - stronger
        'shadow-[0_-4px_20px_rgba(0,0,0,0.1)]',
        // Height with safe area
        'h-[calc(var(--nav-height)+env(safe-area-inset-bottom,0px))]',
        'pb-[env(safe-area-inset-bottom,0px)]',
        className
      )}
    >
      <div className="flex items-center justify-around h-full max-w-md mx-auto px-2">
        {items.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center',
                'min-w-[64px] h-full py-2 px-3',
                'transition-all duration-[var(--duration-fast)]',
                // Active state
                active
                  ? 'text-brand-primary'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {/* Icon */}
              <div className="relative">
                <Icon
                  name={item.icon}
                  filled={active}
                  size="md"
                  className={cn(
                    'transition-transform duration-[var(--duration-fast)]',
                    active && 'scale-110'
                  )}
                />
                {/* Active glow effect */}
                {active && (
                  <div className="absolute inset-0 bg-brand-primary/20 blur-lg rounded-full" />
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  'text-[11px] mt-1',
                  'transition-all duration-[var(--duration-fast)]',
                  active ? 'font-bold' : 'font-medium'
                )}
              >
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default NavDock;
