/**
 * AppBar Component - Munafa OS
 * Modern app header with logo, profile, and theme toggle
 */

'use client';

import { cn } from '@/lib/utils/cn';
import { Icon } from './Icon';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';

export interface AppBarProps {
  /** App title */
  title?: string;
  /** Show theme toggle */
  showThemeToggle?: boolean;
  /** Show language toggle */
  showLanguageToggle?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function AppBar({
  title = 'मेरी दुकान',
  showThemeToggle = true,
  showLanguageToggle = true,
  className,
}: AppBarProps) {
  return (
    <header
      className={cn(
        // Position - fixed for guaranteed visibility
        'fixed top-0 left-0 right-0 z-40',
        // Layout
        'flex items-center justify-between',
        // Size
        'h-14 px-4',
        // Background
        'bg-surface/95 backdrop-blur-xl',
        // Border - subtle brand accent
        'border-b border-brand-primary/10',
        className
      )}
    >
      {/* Left - Logo & Title */}
      <div className="flex items-center gap-2">
        {/* App Icon */}
        <div
          className={cn(
            'w-8 h-8 rounded-lg',
            'bg-brand-primary',
            'flex items-center justify-center',
            'shadow-[0_2px_8px_var(--color-brand-glow)]'
          )}
        >
          <Icon name="storefront" size="sm" className="text-text-on-brand" />
        </div>
        {/* App Title */}
        <span className="text-[17px] font-semibold text-text-primary">
          {title}
        </span>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        {showThemeToggle && <ThemeToggle size="sm" />}

        {/* Language Toggle */}
        {showLanguageToggle && <LanguageToggle size="sm" />}
      </div>
    </header>
  );
}

export default AppBar;
