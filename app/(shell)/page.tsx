/**
 * Home Page - Premium Dashboard
 * Munafa OS v2.1 - Delightful Design
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/munafa/Icon';
import { Input } from '@/components/munafa/Input';
import { HeroSection } from '@/components/munafa/HeroSection';
import ListGroup, { ListItem } from '@/components/munafa/ListGroup';
import { searchProducts } from '../actions/products';
import { formatCurrency, formatSize } from '@/lib/utils/formatters';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { matchesProduct } from '@/lib/utils/search';

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
  const router = useRouter();
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
          const mapped = result.data.map((p: Record<string, unknown>) => ({
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
          setFilteredProducts(mapped.slice(0, 15));
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Search with Hindi-English semantic matching
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products.slice(0, 15));
      return;
    }

    // Use matchesProduct which handles semantic search correctly
    const results = products.filter((p) =>
      matchesProduct(searchQuery, {
        name: p.name,
        aliases: p.aliases,
      })
    );
    setFilteredProducts(results.slice(0, 15));
  }, [searchQuery, products]);

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

  // Calculate stats
  const stats = useMemo(() => {
    const total = products.length;
    const lowStock = products.filter(p => p.stock?.status === 'LOW').length;
    const empty = products.filter(p => p.stock?.status === 'EMPTY').length;
    return { total, lowStock, empty };
  }, [products]);

  // Handle add product
  const handleAddProduct = () => {
    router.push('/add');
  };

  return (
    <div className="space-y-5">
      {/* Hero Section with Stats */}
      {!searchQuery && !loading && (
        <HeroSection
          stats={stats}
          onAddProduct={handleAddProduct}
        />
      )}

      {/* Search Bar */}
      <div className="px-4">
        <Input
          variant="search"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Icon name="search" size="md" className="text-brand-primary" />}
          iconRight={searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-full hover:bg-input-bg-hover transition-colors"
              aria-label="Clear search"
            >
              <Icon name="close" size="sm" className="text-text-secondary" />
            </button>
          ) : undefined}
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="px-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-[60px] bg-surface animate-pulse rounded-md"
            />
          ))}
        </div>
      ) : (
        <div className="px-4 space-y-5 pb-4">
          {/* Recently Checked */}
          {!searchQuery && recentProducts.length > 0 && (
            <ListGroup title="Recently Checked">
              {recentProducts.slice(0, 5).map((product, index) => (
                <ListItem
                  key={product.id}
                  href={`/product/${product.id}`}
                  title={product.name}
                  subtitle={formatSize(product.sizeValue, product.sizeUnit)}
                  trailing={
                    <span className="text-[17px] font-bold text-brand-primary tabular-nums">
                      {formatCurrency(product.sellingPrice)}
                    </span>
                  }
                  onClick={() => handleProductClick(product.id)}
                  isLast={index === Math.min(recentProducts.length, 5) - 1}
                />
              ))}
            </ListGroup>
          )}

          {/* Product List */}
          <ListGroup title={searchQuery ? 'Search Results' : 'All Products'}>
            {filteredProducts.length === 0 ? (
              <div className="py-8 text-center text-text-secondary">
                <Icon name="search-off" size="lg" className="mx-auto mb-2 opacity-50" />
                <p>No products found</p>
              </div>
            ) : (
              filteredProducts.map((product, index) => (
                <ListItem
                  key={product.id}
                  href={`/product/${product.id}`}
                  title={product.name}
                  subtitle={`${formatSize(product.sizeValue, product.sizeUnit)} • Buy: ${formatCurrency(product.buyingPrice)}`}
                  trailing={
                    <span className="text-[17px] font-bold text-brand-primary tabular-nums">
                      {formatCurrency(product.sellingPrice)}
                    </span>
                  }
                  onClick={() => handleProductClick(product.id)}
                  isLast={index === filteredProducts.length - 1}
                />
              ))
            )}
          </ListGroup>
        </div>
      )}
    </div>
  );
}
