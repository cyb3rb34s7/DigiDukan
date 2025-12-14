/**
 * Input Component - Munafa OS
 * Variants: default, price, search
 */

'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input style variant */
  variant?: 'default' | 'price' | 'search';
  /** Field label */
  label?: string;
  /** Error message */
  error?: string;
  /** Left icon */
  icon?: ReactNode;
  /** Right icon */
  iconRight?: ReactNode;
}

const variantStyles = {
  default: [
    'h-12 px-4 text-[16px]',
    'rounded-2xl',
  ].join(' '),
  price: [
    'h-14 px-4 text-[24px] font-bold text-right',
    'rounded-2xl',
    'tabular-nums',
  ].join(' '),
  search: [
    'h-14 px-5 text-[17px]',
    'rounded-[var(--radius-lg)]',
    'shadow-[0_2px_8px_rgba(144,211,31,0.08)]',
  ].join(' '),
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      label,
      error,
      icon,
      iconRight,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    return (
      <div className="w-full space-y-1.5">
        {/* Label */}
        {label && (
          <label className="block text-[14px] font-medium text-text-secondary pl-1">
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {icon && (
            <span
              className={cn(
                'absolute left-4 top-1/2 -translate-y-1/2',
                'text-text-secondary',
                variant === 'price' && 'text-[20px] font-bold text-text-primary'
              )}
            >
              {icon}
            </span>
          )}

          {/* Input */}
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              // Base styles
              'w-full bg-input-bg text-text-primary placeholder:text-text-disabled',
              'border border-border-subtle',
              'transition-all duration-[var(--duration-fast)] ease-[var(--ease-smooth)]',
              'focus:outline-none focus:bg-surface-elevated focus:border-brand-primary',
              // Focus shadow - stronger glow for search
              variant === 'search'
                ? 'focus:shadow-[0_4px_16px_rgba(144,211,31,0.2)]'
                : 'focus:shadow-[var(--shadow-md)]',
              // Variant styles
              variantStyles[variant],
              // Icon padding
              icon && (variant === 'price' ? 'pl-10' : 'pl-12'),
              iconRight && 'pr-12',
              // Error state
              hasError && [
                'border-danger-bar bg-danger-bg',
                'focus:border-danger-bar',
                'animate-shake',
              ],
              // Disabled state
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            {...props}
          />

          {/* Right icon */}
          {iconRight && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">
              {iconRight}
            </span>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-[12px] text-danger-text pl-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
