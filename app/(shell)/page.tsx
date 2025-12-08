/**
 * Home Page - Search and Price Check
 */

'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { searchProducts } from '../actions/products';
import type { ProductWithStock } from '@/lib/types';
import { formatCurrency, formatSize } from '@/lib/utils/formatters';
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

  // Simple search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products.slice(0, 10));
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(query) ||
      (p.aliases && p.aliases.some(alias => alias.toLowerCase().includes(query)))
    );
    setFilteredProducts(filtered.slice(0, 10));
  }, [searchQuery, products]);

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

      {/* Results */}
      {loading ? (
        <div className="text-center py-8 text-slate-500">Loading...</div>
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
              <Link key={product.id} href={`/product/${product.id}`}>
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
