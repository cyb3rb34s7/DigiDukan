/**
 * Product Detail Page - View and update product with stock status
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getProductById, updateProduct } from '@/app/actions/products';
import { updateStockStatus } from '@/app/actions/stock';
import { formatCurrency, formatSize, calculateMargin } from '@/lib/utils/formatters';
import { STOCK_STATUS } from '@/lib/utils/constants';
import type { StockStatus } from '@prisma/client';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const productId = params.id as string;

  useEffect(() => {
    loadProduct();
  }, [productId]);

  async function loadProduct() {
    try {
      const result = await getProductById({ id: productId });
      if (result.success && result.data) {
        setProduct(result.data);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStockStatusChange(status: StockStatus) {
    setUpdating(true);
    try {
      const result = await updateStockStatus({
        productId: productId,
        status: status,
      });
      
      if (result.success) {
        // Reload product to get updated data
        await loadProduct();
        // Show success feedback (you can add toast here)
      }
    } catch (error) {
      console.error('Failed to update stock:', error);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-3/4"></div>
          <div className="h-32 bg-slate-200 rounded"></div>
          <div className="h-24 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-4">
        <Card className="text-center py-12">
          <p className="text-slate-600 mb-4">Product not found</p>
          <Button onClick={() => router.push('/')} variant="secondary">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const margin = calculateMargin(
    Number(product.buyingPrice),
    Number(product.sellingPrice)
  );
  const marginAmount = Number(product.sellingPrice) - Number(product.buyingPrice);
  const currentStatus = product.stock?.status || 'OK';

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-5 h-5" />}>
            Back
          </Button>
        </Link>
        <Link href={`/product/${productId}/edit`}>
          <Button variant="secondary" size="sm" icon={<Edit2 className="w-4 h-4" />}>
            Edit
          </Button>
        </Link>
      </div>

      {/* Product Info */}
      <Card>
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
            <p className="text-slate-600">
              {formatSize(Number(product.sizeValue), product.sizeUnit)}
            </p>
            {product.barcode && (
              <p className="text-sm text-slate-500 mt-1">Barcode: {product.barcode}</p>
            )}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-200">
            <div>
              <p className="text-sm text-slate-600 mb-1">खरीद (Buy)</p>
              <p className="text-xl font-semibold text-slate-900 price-number">
                {formatCurrency(product.buyingPrice)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">बेच (Sell)</p>
              <p className="text-3xl font-bold text-emerald-700 price-number">
                {formatCurrency(product.sellingPrice)}
              </p>
            </div>
          </div>

          {/* Margin */}
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-sm text-slate-600">मुनाफा (Margin)</p>
            <p className="text-lg font-semibold text-slate-900">
              {formatCurrency(marginAmount)} ({margin.toFixed(1)}%)
            </p>
          </div>
        </div>
      </Card>

      {/* Stock Status */}
      <Card>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">
            स्टॉक स्थिति (Stock Status)
          </h2>
          <p className="text-sm text-slate-600">Tap to update status</p>
          
          <div className="grid grid-cols-3 gap-3">
            {STOCK_STATUS.map((config) => {
              const isActive = currentStatus === config.value;
              
              return (
                <Button
                  key={config.value}
                  variant={isActive ? 'primary' : 'secondary'}
                  size="lg"
                  fullWidth
                  onClick={() => handleStockStatusChange(config.value as StockStatus)}
                  disabled={updating}
                  className={`h-20 flex-col gap-2 ${
                    !isActive && config.value === 'OK' && 'hover:bg-emerald-50 hover:border-emerald-200'
                  } ${
                    !isActive && config.value === 'LOW' && 'hover:bg-amber-50 hover:border-amber-200'
                  } ${
                    !isActive && config.value === 'EMPTY' && 'hover:bg-rose-50 hover:border-rose-200'
                  }`}
                >
                  <span className="text-2xl">{config.icon}</span>
                  <span className="text-sm font-medium">{config.hindiLabel}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Aliases */}
      {product.aliases && product.aliases.length > 0 && (
        <Card>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">
              खोज शब्द (Search Terms)
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.aliases.map((alias: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                >
                  {alias}
                </span>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
