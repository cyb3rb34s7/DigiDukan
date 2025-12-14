/**
 * InventoryItem Component - Munafa OS
 * List item with HealthBar, margin display, inline status buttons, and mandi toggle
 */

'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { Icon } from './Icon';
import { HealthBar, type StockStatus } from './HealthBar';
import { useTranslation } from '@/lib/contexts/LanguageContext';
import { formatCurrency, calculateMargin } from '@/lib/utils/formatters';
import type { ProductWithStock } from '@/lib/types';

export interface InventoryItemProps {
  /** Product data with stock info */
  product: ProductWithStock;
  /** Status change handler */
  onStatusChange: (status: StockStatus) => void;
  /** Whether an update is in progress */
  isUpdating?: boolean;
  /** Whether item is in mandi list */
  inMandiList?: boolean;
  /** Toggle mandi list handler */
  onToggleMandi?: () => void;
  /** Is this the last item in the list */
  isLast?: boolean;
}

interface StatusButtonProps {
  status: StockStatus;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function StatusButton({ status, isActive, onClick, disabled }: StatusButtonProps) {
  const colors = {
    OK: {
      bg: isActive ? 'bg-success-bar' : 'bg-success-bg',
      border: 'border-success-bar/30',
      ring: 'ring-success-bar',
    },
    LOW: {
      bg: isActive ? 'bg-warning-bar' : 'bg-warning-bg',
      border: 'border-warning-bar/30',
      ring: 'ring-warning-bar',
    },
    EMPTY: {
      bg: isActive ? 'bg-danger-bar' : 'bg-danger-bg',
      border: 'border-danger-bar/30',
      ring: 'ring-danger-bar',
    },
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      className={cn(
        'w-6 h-6 rounded-full',
        'border',
        'transition-all duration-[var(--duration-fast)]',
        'active:scale-90',
        colors[status].bg,
        colors[status].border,
        disabled && 'opacity-50 cursor-not-allowed',
        isActive && ['ring-2 ring-offset-1 ring-offset-surface', colors[status].ring]
      )}
    />
  );
}

export function InventoryItem({
  product,
  onStatusChange,
  isUpdating = false,
  inMandiList = false,
  onToggleMandi,
  isLast = false,
}: InventoryItemProps) {
  const { t } = useTranslation();
  const currentStatus = (product.stock?.status || 'OK') as StockStatus;

  // Calculate margin
  const buyPrice = Number(product.buyingPrice);
  const sellPrice = Number(product.sellingPrice);
  const marginPercent = calculateMargin(buyPrice, sellPrice);

  // Margin color based on value
  const marginColor = marginPercent >= 20
    ? 'text-success-text'
    : marginPercent >= 10
    ? 'text-text-primary'
    : 'text-warning-text';

  return (
    <div className="relative">
      <Link
        href={`/product/${product.id}`}
        className={cn(
          'block px-4 py-3',
          'transition-colors duration-[var(--duration-fast)]',
          'active:bg-input-bg'
        )}
      >
        {/* Top row: Name + Selling Price */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-[15px] font-semibold text-text-primary truncate flex-1">
            {product.name}
          </h3>
          <span className="text-[15px] font-bold text-text-primary tabular-nums shrink-0">
            {formatCurrency(sellPrice)}
          </span>
        </div>

        {/* Middle row: Size + Margin */}
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
          <span>
            {Number(product.sizeValue)}{product.sizeUnit}
          </span>
          <span>•</span>
          <span className={cn('font-medium', marginColor)}>
            {marginPercent.toFixed(0)}% {t('inventory.margin')}
          </span>
        </div>

        {/* Bottom row: HealthBar + Actions */}
        <div className="flex items-center gap-3">
          {/* HealthBar */}
          <div className="flex-1">
            <HealthBar status={currentStatus} />
          </div>

          {/* Status Buttons */}
          <div className="flex items-center gap-1">
            <StatusButton
              status="OK"
              isActive={currentStatus === 'OK'}
              onClick={() => onStatusChange('OK')}
              disabled={isUpdating}
            />
            <StatusButton
              status="LOW"
              isActive={currentStatus === 'LOW'}
              onClick={() => onStatusChange('LOW')}
              disabled={isUpdating}
            />
            <StatusButton
              status="EMPTY"
              isActive={currentStatus === 'EMPTY'}
              onClick={() => onStatusChange('EMPTY')}
              disabled={isUpdating}
            />
          </div>

          {/* Add to Mandi Button */}
          {onToggleMandi && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleMandi();
              }}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-full',
                'text-xs font-semibold',
                'border',
                'transition-all duration-[var(--duration-fast)]',
                'active:scale-95',
                inMandiList
                  ? 'bg-warning-bg text-warning-text border-warning-bar/30'
                  : 'bg-input-bg text-text-secondary border-border-subtle hover:bg-input-bg-hover'
              )}
            >
              <Icon name={inMandiList ? 'check' : 'add'} size="sm" />
              <span>
                {inMandiList ? t('inventory.mandi.addedToList') : t('inventory.mandi.addToList')}
              </span>
            </button>
          )}
        </div>
      </Link>

      {/* Separator */}
      {!isLast && (
        <div className="absolute bottom-0 left-4 right-0 h-px bg-border-subtle" />
      )}
    </div>
  );
}

export default InventoryItem;
