/**
 * HeroSection Component - Munafa OS
 * Gradient hero with glass stat cards and CTA
 */

'use client';

import { cn } from '@/lib/utils/cn';
import { Icon } from './Icon';
import { Button } from './Button';

export interface HeroStats {
  total: number;
  lowStock: number;
  empty: number;
}

export interface HeroSectionProps {
  /** Stats to display */
  stats: HeroStats;
  /** Add product click handler */
  onAddProduct?: () => void;
  /** Additional CSS classes */
  className?: string;
}

interface GlassStatProps {
  icon: string;
  value: number;
  label: string;
  variant?: 'default' | 'warning' | 'danger';
}

function GlassStat({ icon, value, label, variant = 'default' }: GlassStatProps) {
  const iconColors = {
    default: 'text-brand-primary',
    warning: 'text-warning-text',
    danger: 'text-danger-text',
  };

  return (
    <div
      className={cn(
        'glass-card',
        'flex flex-col items-center justify-center',
        'px-4 py-3 rounded-[var(--radius-md)]',
        'min-w-[100px] flex-1'
      )}
    >
      <Icon name={icon} size="md" className={iconColors[variant]} />
      <span className="text-2xl font-bold text-text-primary mt-1 tabular-nums">
        {value}
      </span>
      <span className="text-xs text-text-secondary font-medium">{label}</span>
    </div>
  );
}

export function HeroSection({
  stats,
  onAddProduct,
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        'hero-gradient',
        'px-4 pt-4 pb-6',
        'rounded-b-[24px]',
        className
      )}
    >
      {/* Glass Stats Row */}
      <div className="flex gap-3 mb-5">
        <GlassStat
          icon="inventory-2"
          value={stats.total}
          label="Products"
          variant="default"
        />
        <GlassStat
          icon="warning"
          value={stats.lowStock}
          label="Low Stock"
          variant="warning"
        />
        <GlassStat
          icon="error"
          value={stats.empty}
          label="Empty"
          variant="danger"
        />
      </div>

      {/* CTA Button */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={onAddProduct}
        icon={<Icon name="add-circle" size="sm" />}
        className="shadow-[0_4px_20px_var(--color-brand-glow)]"
      >
        Add New Product
      </Button>
    </section>
  );
}

export default HeroSection;
