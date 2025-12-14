/**
 * HealthBar Component - Munafa OS
 * Visual stock status indicator
 */

'use client';

import { cn } from '@/lib/utils/cn';

export type StockStatus = 'OK' | 'LOW' | 'EMPTY';

export interface HealthBarProps {
  /** Stock status */
  status: StockStatus;
  /** Additional CSS classes */
  className?: string;
}

const statusConfig = {
  OK: {
    width: '100%',
    color: 'bg-success-bar',
  },
  LOW: {
    width: '40%',
    color: 'bg-warning-bar',
  },
  EMPTY: {
    width: '8px',
    color: 'bg-danger-bar',
  },
};

export function HealthBar({ status, className }: HealthBarProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        'h-2 w-full bg-border-subtle rounded-full overflow-hidden',
        className
      )}
    >
      <div
        className={cn(
          'h-full rounded-full',
          'transition-all duration-[var(--duration-normal)] ease-[var(--ease-spring)]',
          config.color
        )}
        style={{ width: config.width }}
      />
    </div>
  );
}

export default HealthBar;
