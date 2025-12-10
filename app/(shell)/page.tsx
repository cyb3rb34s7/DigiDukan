/**
 * Home Page - Search and Price Check with Fuse.js
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Clock } from 'lucide-react';
import Fuse from 'fuse.js';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { searchProducts } from '../actions/products';
import { formatCurrency, formatSize } from '@/lib/utils/formatters';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  aliases: string[];
  sizeValue: number;
  sizeUnit: string;
  buyingPrice: number;
  sellingPrice: number;
  stock?: { status: string };
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentlyChecked, setRecentlyChecked] = useLocalStorage<string[]>('recentlyChecked', []);

  // Fetch all products on mount for client-side search
  useEffect(() => {
    async function loadProducts() {
      try {
        const result = await searchProducts();
        if (result.success && result.data) {
          const mapped = result.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            aliases: p.aliases || [],
            sizeValue: Number(p.sizeValue),
            sizeUnit: p.sizeUnit,
            buyingPrice: Number(p.buyingPrice),
            sellingPrice: Number(p.sellingPrice),
            stock: p.stock || undefined,
          }));
          setProducts(mapped);
          setFilteredProducts(mapped.slice(0, 10));
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Initialize Fuse.js
  const fuse = useMemo(() => {
    if (products.length === 0) return null;
    
    return new Fuse(products, {
      keys: [
        { name: 'name', weight: 2 },
        { name: 'aliases', weight: 1.5 },
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [products]);

  // Fuse.js search with debouncing effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products.slice(0, 10));
      return;
    }

    if (!fuse) return;

    const results = fuse.search(searchQuery);
    setFilteredProducts(results.map(r => r.item).slice(0, 10));
  }, [searchQuery, products, fuse]);

  // Add to recently checked
  const handleProductClick = (productId: string) => {
    const updated = [productId, ...recentlyChecked.filter(id => id !== productId)].slice(0, 10);
    setRecentlyChecked(updated);
  };

  // Get recently checked products
  const recentProducts = useMemo(() => {
    return recentlyChecked
      .map(id => products.find(p => p.id === id))
      .filter(Boolean) as Product[];
  }, [recentlyChecked, products]);

  return (
    <div className="p-4 space-y-4">
      {/* Search Bar */}
      <Input
        type="search"
        placeholder="खोजें... (Search product)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        icon={<Search className="w-5 h-5" />}
        autoFocus
      />

      {/* Recently Checked */}
      {!searchQuery && recentProducts.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-600">
              हाल ही में देखे गए (Recently Checked)
            </h2>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {recentProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                onClick={() => handleProductClick(product.id)}
              >
                <Card className="min-w-[140px] hover:shadow-md transition-shadow">
                  <div className="text-sm font-medium text-slate-900 truncate">
                    {product.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatSize(product.sizeValue, product.sizeUnit)}
                  </div>
                  <div className="text-base font-bold text-emerald-700 mt-1">
                    {formatCurrency(product.sellingPrice)}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-600 uppercase">
            {searchQuery ? 'खोज परिणाम (Search Results)' : 'सभी उत्पाद (All Products)'}
          </h2>
          
          {filteredProducts.length === 0 ? (
            <Card className="text-center py-8 text-slate-500">
              कोई उत्पाद नहीं मिला (No products found)
            </Card>
          ) : (
            filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                onClick={() => handleProductClick(product.id)}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-slate-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {formatSize(product.sizeValue, product.sizeUnit)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-600">
                        खरीद: {formatCurrency(product.buyingPrice)}
                      </div>
                      <div className="text-xl font-bold text-emerald-700 price-number">
                        {formatCurrency(product.sellingPrice)}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
