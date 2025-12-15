/**
 * MandiModal Component - Munafa OS
 * Bottom sheet modal for mandi (shopping) list
 */

'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon } from './Icon';
import { Button } from './Button';
import { useTranslation } from '@/lib/contexts/LanguageContext';
import { formatCurrency } from '@/lib/utils/formatters';
import type { ProductWithStock } from '@/lib/types';

export interface MandiModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Items in the mandi list */
  items: ProductWithStock[];
  /** Remove item handler */
  onRemoveItem: (productId: string) => void;
  /** Copy handler */
  onCopy: () => void;
  /** Whether copy was successful */
  copied: boolean;
  /** Total cost of items */
  totalCost: number;
}

export function MandiModal({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onCopy,
  copied,
  totalCost,
}: MandiModalProps) {
  const { t } = useTranslation();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[200]',
          'bg-black/50 backdrop-blur-sm',
          'animate-fade-in'
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-[201]',
          'bg-surface rounded-t-[24px]',
          'shadow-[0_-4px_32px_rgba(0,0,0,0.15)]',
          'max-h-[80vh] flex flex-col',
          'animate-slide-up',
          'pb-[env(safe-area-inset-bottom,0px)]'
        )}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-border-subtle" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <Icon name="shopping-cart" size="md" className="text-brand-primary" />
            <h2 className="text-lg font-bold text-text-primary">
              {t('inventory.mandi.title')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={cn(
              'w-8 h-8 rounded-full',
              'bg-input-bg hover:bg-input-bg-hover',
              'flex items-center justify-center',
              'transition-colors duration-[var(--duration-fast)]'
            )}
            aria-label={t('common.close')}
          >
            <Icon name="close" size="sm" className="text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Icon name="shopping-cart" size="lg" className="text-text-disabled mb-2" />
              <p className="text-sm text-text-secondary">
                {t('inventory.mandi.emptyList')}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => {
                const isEmpty = item.stock?.status === 'EMPTY';
                return (
                  <div
                    key={item.id}
                    className={cn(
                      'flex items-center justify-between',
                      'px-3 py-2.5 rounded-md',
                      'bg-input-bg'
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-base shrink-0">
                        {isEmpty ? '❌' : '⚠️'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {Number(item.sizeValue)}{item.sizeUnit} • {formatCurrency(Number(item.buyingPrice))}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className={cn(
                        'w-7 h-7 rounded-full shrink-0 ml-2',
                        'bg-danger-bg hover:bg-danger-bar/20',
                        'flex items-center justify-center',
                        'transition-colors duration-[var(--duration-fast)]'
                      )}
                      aria-label={t('inventory.mandi.removeFromList')}
                    >
                      <Icon name="close" size="sm" className="text-danger-text" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border-subtle space-y-3">
          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              {t('inventory.mandi.total')} ({items.length} {t('inventory.mandi.items')})
            </span>
            <span className="text-lg font-bold text-text-primary tabular-nums">
              {formatCurrency(totalCost)}
            </span>
          </div>

          {/* Copy Button */}
          <Button
            variant="primary"
            fullWidth
            onClick={onCopy}
            icon={<Icon name={copied ? 'check' : 'content-copy'} size="sm" />}
            disabled={items.length === 0}
          >
            {copied ? t('inventory.mandi.copied') : t('inventory.mandi.copy')}
          </Button>
        </div>
      </div>
    </>
  );
}

export default MandiModal;
