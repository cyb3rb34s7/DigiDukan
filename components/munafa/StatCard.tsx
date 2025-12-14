/**
 * StatCard Component - Munafa OS
 * Compact stat card for dashboard quick stats
 */

'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon } from './Icon';

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Icon name from Material Symbols */
  icon: string;
  /** Stat value (number or formatted string) */
  value: number | string;
  /** Label below the value */
  label: string;
  /** Color variant */
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const variantStyles = {
  default: {
    bg: 'bg-surface',
    icon: 'text-brand-primary',
    iconBg: 'bg-brand-light',
  },
  success: {
    bg: 'bg-surface',
    icon: 'text-success-text',
    iconBg: 'bg-success-bg',
  },
  warning: {
    bg: 'bg-surface',
    icon: 'text-warning-text',
    iconBg: 'bg-warning-bg',
  },
  danger: {
    bg: 'bg-surface',
    icon: 'text-danger-text',
    iconBg: 'bg-danger-bg',
  },
};

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      icon,
      value,
      label,
      variant = 'default',
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const styles = variantStyles[variant];

    return (
      <div
        ref={ref}
        className={cn(
          // Base
          styles.bg,
          'rounded-[var(--radius-md)]',
          'shadow-[var(--shadow-sm)]',
          'p-4',
          // Layout
          'flex flex-col items-center justify-center',
          'min-w-[100px]',
          // Interactive
          onClick && 'cursor-pointer active:scale-[0.98] transition-transform',
          className
        )}
        onClick={onClick}
        {...props}
      >
        {/* Icon */}
        <div
          className={cn(
            'w-10 h-10 rounded-full',
            'flex items-center justify-center',
            'mb-2',
            styles.iconBg
          )}
        >
          <Icon name={icon} size="sm" className={styles.icon} />
        </div>

        {/* Value */}
        <span className="text-[24px] font-bold text-text-primary leading-tight">
          {value}
        </span>

        {/* Label */}
        <span className="text-[12px] text-text-secondary mt-0.5">
          {label}
        </span>
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';

export default StatCard;
