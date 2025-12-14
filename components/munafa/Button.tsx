/**
 * Button Component - Munafa OS
 * Variants: primary (gradient), secondary, ghost, danger
 */

'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button style variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Icon element (left side) */
  icon?: ReactNode;
  /** Icon element (right side) */
  iconRight?: ReactNode;
  /** Show loading spinner */
  loading?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Button label */
  children: ReactNode;
}

const variantStyles = {
  primary: [
    'bg-brand-primary text-text-on-brand',
    'shadow-[0_4px_14px_var(--color-brand-glow)]',
    'hover:scale-[1.02] hover:shadow-[0_6px_20px_var(--color-brand-glow)]',
    'active:scale-[0.98] active:brightness-95',
  ].join(' '),
  secondary: [
    'bg-transparent text-brand-primary border border-border-subtle',
    'hover:border-brand-primary/50 hover:bg-brand-primary/5',
    'active:scale-[0.98]',
  ].join(' '),
  ghost: [
    'bg-transparent text-brand-primary border border-transparent',
    'hover:bg-brand-primary/10',
    'active:bg-brand-primary/20',
  ].join(' '),
  danger: [
    'bg-danger-bar text-white',
    'shadow-[0_4px_14px_rgba(239,68,68,0.3)]',
    'hover:scale-[1.02] hover:brightness-110',
    'active:scale-[0.98] active:brightness-90',
  ].join(' '),
};

const sizeStyles = {
  sm: 'h-10 px-4 text-[14px] gap-2 rounded-xl',
  md: 'h-12 px-5 text-[16px] gap-2 rounded-2xl',
  lg: 'h-14 px-6 text-[18px] font-bold gap-3 rounded-2xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconRight,
      loading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium',
          'transition-all duration-[var(--duration-fast)] ease-[var(--ease-spring)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
          // Size
          sizeStyles[size],
          // Variant (only if not disabled)
          !isDisabled && variantStyles[variant],
          // Disabled state
          isDisabled && 'bg-text-disabled text-text-secondary opacity-50 cursor-not-allowed shadow-none',
          // Full width
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {/* Loading spinner or left icon */}
        {loading ? (
          <LoadingSpinner />
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}

        {/* Label */}
        <span className={loading ? 'opacity-0' : undefined}>{children}</span>

        {/* Right icon */}
        {iconRight && !loading && (
          <span className="shrink-0">{iconRight}</span>
        )}

        {/* Loading text overlay */}
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner />
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default Button;
