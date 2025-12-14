/**
 * InventorySummary Component - Munafa OS
 * Filter pills + mandi list button
 */

'use client';

import { cn } from '@/lib/utils/cn';
import { Icon } from './Icon';
import { FilterPills, type FilterOption } from './FilterPills';
import { useTranslation } from '@/lib/contexts/LanguageContext';
import { formatCurrency } from '@/lib/utils/formatters';

export type StockFilter = 'ALL' | 'OK' | 'LOW' | 'EMPTY';

export interface InventorySummaryCounts {
  all: number;
  ok: number;
  low: number;
  empty: number;
}

export interface InventorySummaryProps {
  /** Stock counts */
  counts: InventorySummaryCounts;
  /** Active filter */
  activeFilter: StockFilter;
  /** Filter change handler */
  onFilterChange: (filter: StockFilter) => void;
  /** Mandi list item count */
  mandiCount: number;
  /** Total cost of mandi items */
  mandiCost: number;
  /** Open mandi modal handler */
  onOpenMandi: () => void;
  /** Additional CSS classes */
  className?: string;
}

export function InventorySummary({
  counts,
  activeFilter,
  onFilterChange,
  mandiCount,
  mandiCost,
  onOpenMandi,
  className,
}: InventorySummaryProps) {
  const { t } = useTranslation();

  const filterOptions: FilterOption[] = [
    { value: 'ALL', label: t('inventory.filter.all'), count: counts.all, variant: 'default' },
    { value: 'OK', label: t('stock.ok.label'), count: counts.ok, variant: 'success' },
    { value: 'LOW', label: t('stock.low.label'), count: counts.low, variant: 'warning' },
    { value: 'EMPTY', label: t('stock.empty.label'), count: counts.empty, variant: 'danger' },
  ];

  return (
    <div
      className={cn(
        'px-4 py-3 space-y-3',
        'bg-surface border-b border-border-subtle',
        className
      )}
    >
      {/* Filter Pills */}
      <FilterPills
        options={filterOptions}
        value={activeFilter}
        onChange={(v) => onFilterChange(v as StockFilter)}
      />

      {/* Mandi List Button */}
      {mandiCount > 0 && (
        <button
          onClick={onOpenMandi}
          className={cn(
            'flex items-center justify-between w-full',
            'px-4 py-2.5 rounded-[var(--radius-md)]',
            'bg-warning-bg/50 border border-warning-bar/30',
            'transition-all duration-[var(--duration-fast)]',
            'active:scale-[0.98]'
          )}
        >
          <div className="flex items-center gap-2">
            <Icon name="shopping-cart" size="sm" className="text-warning-text" />
            <span className="text-sm font-medium text-text-primary">
              {t('inventory.mandi.openList')}
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-warning-bar/20 text-xs font-bold text-warning-text tabular-nums">
              {mandiCount}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-text-primary tabular-nums">
              {formatCurrency(mandiCost)}
            </span>
            <Icon name="chevron-right" size="sm" className="text-text-secondary" />
          </div>
        </button>
      )}
    </div>
  );
}

export default InventorySummary;
