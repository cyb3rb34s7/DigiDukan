/**
 * Inventory Page - Stock management & Mandi list
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, AlertTriangle, XCircle, Copy, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getAllProducts } from '@/app/actions/products';
import { formatCurrency } from '@/lib/utils/formatters';
import { STOCK_STATUS } from '@/lib/utils/constants';
import type { ProductWithStock } from '@/lib/types';

type StockFilter = 'ALL' | 'LOW' | 'EMPTY';

export default function InventoryPage() {
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StockFilter>('ALL');
  const [copied, setCopied] = useState(false);

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

  // Filter products based on stock status
  const filteredProducts = products.filter((p) => {
    if (filter === 'ALL') return true;
    return p.stock?.status === filter;
  });

  // Count products by status
  const counts = {
    ALL: products.length,
    LOW: products.filter((p) => p.stock?.status === 'LOW').length,
    EMPTY: products.filter((p) => p.stock?.status === 'EMPTY').length,
  };

  // Generate Mandi list text
  const generateMandiList = () => {
    const lowAndEmpty = products.filter((p) => p.stock?.status === 'LOW' || p.stock?.status === 'EMPTY');
    if (lowAndEmpty.length === 0) return 'सभी उत्पाद स्टॉक में हैं (All products in stock)';

    const lines = lowAndEmpty.map((p) => {
      const status = p.stock?.status === 'EMPTY' ? '❌' : '⚠️';
      return `${status} ${p.name} - ${p.sizeValue.toString()}${p.sizeUnit}`;
    });

    return `🛒 मंडी सूची (Mandi List)\n\n${lines.join('\n')}\n\nकुल: ${lowAndEmpty.length} items`;
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

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-700" />
          <h1 className="text-xl font-semibold">इन्वेंटरी (Inventory)</h1>
        </div>
        
        {(counts.LOW > 0 || counts.EMPTY > 0) && (
          <Button
            variant="secondary"
            size="sm"
            onClick={copyMandiList}
            icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          >
            {copied ? 'Copied!' : 'Mandi List'}
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            filter === 'ALL'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          सभी ({counts.ALL})
        </button>

        <button
          onClick={() => setFilter('LOW')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            filter === 'LOW'
              ? 'bg-amber-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          कम ({counts.LOW})
        </button>

        <button
          onClick={() => setFilter('EMPTY')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            filter === 'EMPTY'
              ? 'bg-red-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <XCircle className="w-4 h-4" />
          खाली ({counts.EMPTY})
        </button>
      </div>

      {/* Product List */}
      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm mt-1">
            {filter === 'ALL' ? 'Add your first product to get started' : `No ${filter.toLowerCase()} stock items`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((product) => {
            const statusConfig = STOCK_STATUS.find((s) => s.value === product.stock?.status);

            return (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card className="flex items-center justify-between transition-all hover:shadow-md">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 truncate">{product.name}</h3>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${statusConfig?.className}`}
                      >
                        {statusConfig?.icon}
                        {statusConfig?.hindiLabel}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <span>
                        {Number(product.sizeValue)}
                        {product.sizeUnit}
                      </span>
                      <span>•</span>
                      <span>{formatCurrency(Number(product.sellingPrice))}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-medium text-slate-700">
                      {formatCurrency(Number(product.buyingPrice))}
                    </div>
                    <div className="text-xs text-slate-500">खरीद</div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Mandi List Preview (for low/empty items) */}
      {(counts.LOW > 0 || counts.EMPTY > 0) && filter === 'ALL' && (
        <Card className="bg-amber-50 border-amber-200">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                मंडी सूची (Mandi List)
              </h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={copyMandiList}
                icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <p className="text-sm text-amber-800">
              {counts.LOW + counts.EMPTY} items need restocking
            </p>
            <pre className="text-xs text-amber-900 bg-white rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
              {generateMandiList()}
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
}
