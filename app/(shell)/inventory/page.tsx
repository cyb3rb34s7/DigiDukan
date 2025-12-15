/**
 * Inventory Page - Munafa OS
 * Filter pills + flat list + mandi modal
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@/lib/contexts/LanguageContext';
import { Icon, Input } from '@/components/munafa';
import { InventorySummary, type StockFilter } from '@/components/munafa/InventorySummary';
import { InventoryItem } from '@/components/munafa/InventoryItem';
import { MandiModal } from '@/components/munafa/MandiModal';
import { matchesProduct } from '@/lib/utils/search';
import { getAllProducts } from '@/app/actions/products';
import { updateStockStatus } from '@/app/actions/stock';
import type { ProductWithStock } from '@/lib/types';
import type { StockStatus } from '@/components/munafa/HealthBar';

export default function InventoryPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<StockFilter>('ALL');
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  // Mandi list state
  const [mandiList, setMandiList] = useState<Set<string>>(new Set());
  const [mandiModalOpen, setMandiModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load products
  useEffect(() => {
    async function loadProducts() {
      const result = await getAllProducts();
      if (result.success && result.data) {
        setProducts(result.data.data || []);
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  // Auto-add LOW/EMPTY items to mandi list on load
  useEffect(() => {
    if (products.length > 0 && mandiList.size === 0) {
      const autoAdd = products
        .filter((p) => p.stock?.status === 'LOW' || p.stock?.status === 'EMPTY')
        .map((p) => p.id);
      if (autoAdd.length > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional one-time initialization
        setMandiList(new Set(autoAdd));
      }
    }
  }, [products, mandiList.size]);

  // Filter by search query (with Hindi-English semantic matching)
  const searchFiltered = useMemo(() => {
    if (!searchQuery.trim()) return products;
    return products.filter((p) =>
      matchesProduct(searchQuery, {
        name: p.name,
        aliases: p.aliases || [],
      })
    );
  }, [products, searchQuery]);

  // Filter by status
  const filteredProducts = useMemo(() => {
    if (activeFilter === 'ALL') return searchFiltered;
    return searchFiltered.filter((p) => {
      const status = p.stock?.status || 'OK';
      return status === activeFilter;
    });
  }, [searchFiltered, activeFilter]);

  // Calculate counts (from all products, not filtered)
  const counts = useMemo(() => {
    const all = products.length;
    const ok = products.filter((p) => p.stock?.status === 'OK' || !p.stock?.status).length;
    const low = products.filter((p) => p.stock?.status === 'LOW').length;
    const empty = products.filter((p) => p.stock?.status === 'EMPTY').length;
    return { all, ok, low, empty };
  }, [products]);

  // Mandi list items and cost
  const mandiItems = useMemo(() => {
    return products.filter((p) => mandiList.has(p.id));
  }, [products, mandiList]);

  const mandiCost = useMemo(() => {
    return mandiItems.reduce((sum, p) => sum + Number(p.buyingPrice), 0);
  }, [mandiItems]);

  // Toggle item in mandi list
  const toggleMandiItem = (productId: string) => {
    setMandiList((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  // Remove item from mandi list
  const removeMandiItem = (productId: string) => {
    setMandiList((prev) => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
  };

  // Generate Mandi list text
  const generateMandiList = () => {
    if (mandiItems.length === 0) return t('inventory.mandi.allInStock');

    const lines = mandiItems.map((p) => {
      const status = p.stock?.status === 'EMPTY' ? '❌' : '⚠️';
      return `${status} ${p.name} - ${p.sizeValue.toString()}${p.sizeUnit}`;
    });

    return `${t('inventory.mandi.header')}\n\n${lines.join('\n')}\n\n${t('inventory.mandi.total')} ${mandiItems.length} ${t('inventory.mandi.items')}`;
  };

  // Copy mandi list to clipboard
  const copyMandiList = async () => {
    try {
      await navigator.clipboard.writeText(generateMandiList());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Handle inline status change
  const handleStatusChange = async (productId: string, status: StockStatus) => {
    // Add to updating set
    setUpdatingIds((prev) => new Set(prev).add(productId));

    // Optimistic update
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              stock: {
                ...p.stock,
                status,
                id: p.stock?.id || '',
                productId,
                lastChecked: new Date(),
              },
            }
          : p
      )
    );

    // Auto-update mandi list based on new status
    if (status === 'LOW' || status === 'EMPTY') {
      setMandiList((prev) => new Set(prev).add(productId));
    } else {
      setMandiList((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }

    // Server update
    const result = await updateStockStatus({ productId, status });

    // Remove from updating set
    setUpdatingIds((prev) => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });

    // Rollback on error
    if (!result.success) {
      const refreshResult = await getAllProducts();
      if (refreshResult.success && refreshResult.data) {
        setProducts(refreshResult.data.data || []);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Summary Bar with Filter Pills */}
      <InventorySummary
        counts={counts}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        mandiCount={mandiList.size}
        mandiCost={mandiCost}
        onOpenMandi={() => setMandiModalOpen(true)}
      />

      {/* Search Bar */}
      <div className="px-4 py-3 bg-canvas">
        <Input
          variant="search"
          placeholder={t('inventory.search.placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Icon name="search" size="sm" className="text-text-secondary" />}
          iconRight={
            searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="text-text-secondary hover:text-text-primary"
                aria-label={t('common.close')}
              >
                <Icon name="close" size="sm" />
              </button>
            ) : undefined
          }
        />
      </div>

      {/* Product List */}
      <div className="flex-1 pb-4">
        {loading ? (
          // Skeleton loading
          <div className="px-4 space-y-3 pt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-20 bg-input-bg rounded-[var(--radius-md)] animate-pulse"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-input-bg flex items-center justify-center mb-4">
              <Icon name="inventory-2" size="lg" className="text-text-disabled" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">
              {searchQuery ? t('home.empty') : t('inventory.empty.title')}
            </h3>
            <p className="text-sm text-text-secondary max-w-[240px]">
              {searchQuery
                ? t('inventory.empty.filtered').replace('{status}', searchQuery)
                : activeFilter !== 'ALL'
                ? t('inventory.empty.filtered').replace('{status}', activeFilter.toLowerCase())
                : t('inventory.empty.all')}
            </p>
          </div>
        ) : (
          // Flat product list
          <div className="bg-surface mx-4 mt-2 rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] overflow-hidden border border-brand-primary/10">
            {filteredProducts.map((product, index) => (
              <InventoryItem
                key={product.id}
                product={product}
                onStatusChange={(status) => handleStatusChange(product.id, status)}
                isUpdating={updatingIds.has(product.id)}
                inMandiList={mandiList.has(product.id)}
                onToggleMandi={() => toggleMandiItem(product.id)}
                isLast={index === filteredProducts.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mandi Modal */}
      <MandiModal
        isOpen={mandiModalOpen}
        onClose={() => setMandiModalOpen(false)}
        items={mandiItems}
        onRemoveItem={removeMandiItem}
        onCopy={copyMandiList}
        copied={copied}
        totalCost={mandiCost}
      />
    </div>
  );
}
