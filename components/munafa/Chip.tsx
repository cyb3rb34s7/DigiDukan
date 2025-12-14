/**
 * Chip Component - Munafa OS
 * Selectable chip group (e.g., unit selector)
 */

'use client';

import { cn } from '@/lib/utils/cn';

export interface ChipOption {
  value: string;
  label: string;
}

export interface ChipProps {
  /** Available options */
  options: ChipOption[];
  /** Selected value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Additional CSS classes */
  className?: string;
}

export function Chip({ options, value, onChange, className }: ChipProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              // Base styles
              'px-4 py-2 rounded-full',
              'text-[14px] font-medium',
              'transition-all duration-[var(--duration-fast)] ease-[var(--ease-spring)]',
              // Selected state - dark text on chartreuse
              isSelected
                ? 'bg-brand-primary text-[#0D0D0D] font-semibold shadow-[var(--shadow-xs)]'
                : 'bg-input-bg text-text-secondary hover:bg-input-bg-hover'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default Chip;
