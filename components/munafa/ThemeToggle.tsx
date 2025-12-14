/**
 * ThemeToggle Component - Munafa OS
 * Animated dark/light mode toggle button
 */

'use client';

import { cn } from '@/lib/utils/cn';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { Icon } from './Icon';

export interface ThemeToggleProps {
  /** Size of the toggle button */
  size?: 'sm' | 'md';
  /** Additional CSS classes */
  className?: string;
}

export function ThemeToggle({ size = 'md', className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        // Size
        sizeStyles[size],
        // Shape
        'rounded-full',
        // Background
        'bg-input-bg hover:bg-input-bg-hover',
        // Layout
        'flex items-center justify-center',
        // Transition
        'transition-all duration-300 ease-out',
        // Focus
        'focus:outline-none focus:ring-2 focus:ring-brand-primary/50',
        // Active
        'active:scale-95',
        className
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div
        className={cn(
          'transition-transform duration-300',
          isDark ? 'rotate-0' : 'rotate-180'
        )}
      >
        <Icon
          name={isDark ? 'dark-mode' : 'light-mode'}
          size="sm"
          className={cn(
            'transition-colors duration-300',
            isDark ? 'text-brand-primary' : 'text-warning-text'
          )}
        />
      </div>
    </button>
  );
}

export default ThemeToggle;
