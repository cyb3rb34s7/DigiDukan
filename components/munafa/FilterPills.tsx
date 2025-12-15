/**
 * FilterPills Component - Munafa OS
 * Clickable pill badges for filtering with counts
 */

'use client';

import { cn } from '@/lib/utils/cn';

export interface FilterOption {
  value: string;
  label: string;
  count: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export interface FilterPillsProps {
  /** Available filter options */
  options: FilterOption[];
  /** Currently selected value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Additional CSS classes */
  className?: string;
}

export function FilterPills({ options, value, onChange, className }: FilterPillsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => {
        const isSelected = option.value === value;

        // Variant-based colors for the count badge
        const countColors = {
          default: 'bg-brand-primary/20 text-brand-primary',
          success: 'bg-success-bg text-success-text',
          warning: 'bg-warning-bg text-warning-text',
          danger: 'bg-danger-bg text-danger-text',
        };

        const variant = option.variant || 'default';

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              // Base styles
              'flex items-center gap-1.5',
              'px-3 py-1.5 rounded-full',
              'text-[13px] font-medium',
              'transition-all duration-[var(--duration-fast)] ease-[var(--ease-spring)]',
              'active:scale-95',
              // Selected state
              isSelected
                ? 'bg-brand-primary text-[#0D0D0D] font-semibold shadow-xs'
                : 'bg-input-bg text-text-secondary hover:bg-input-bg-hover'
            )}
          >
            <span>{option.label}</span>
            <span
              className={cn(
                'px-1.5 py-0.5 rounded-full text-[11px] font-bold tabular-nums',
                isSelected
                  ? 'bg-[#0D0D0D]/20 text-[#0D0D0D]'
                  : countColors[variant]
              )}
            >
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default FilterPills;
