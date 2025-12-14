/**
 * Badge Component - Munafa OS
 * Status badge with semantic colors
 */

'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps {
  /** Badge style variant */
  variant?: 'default' | 'success' | 'warning' | 'danger';
  /** Badge size */
  size?: 'sm' | 'md';
  /** Badge content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

const variantStyles = {
  default: 'bg-input-bg text-text-primary',
  success: 'bg-success-bg text-success-text',
  warning: 'bg-warning-bg text-warning-text',
  danger: 'bg-danger-bg text-danger-text',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-[12px]',
};

export function Badge({
  variant = 'default',
  size = 'md',
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        // Base styles
        'inline-flex items-center justify-center',
        'font-bold rounded-full',
        'whitespace-nowrap',
        // Variant
        variantStyles[variant],
        // Size
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
