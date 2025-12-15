/**
 * Card Component - Munafa OS
 * Variants: default, product, widget
 */

'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card style variant */
  variant?: 'default' | 'product' | 'widget';
  /** Inner padding */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Show hover effect */
  hoverable?: boolean;
  /** Card content */
  children: ReactNode;
}

const paddingStyles = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      // variant prop reserved for future use
      variant: _variant,
      padding = 'md',
      hoverable = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    void _variant; // Suppress unused variable warning - reserved for future variant styling
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'bg-surface rounded-lg',
          'shadow-sm',
          // Padding
          paddingStyles[padding],
          // Hoverable state
          hoverable && [
            'transition-all duration-[var(--duration-fast)] ease-[var(--ease-smooth)]',
            'active:bg-input-bg',
            'cursor-pointer',
          ],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
