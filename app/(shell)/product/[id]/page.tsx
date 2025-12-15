/**
 * Product Detail Page - Munafa OS
 * View and update product with stock status
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/lib/contexts/LanguageContext';
import { Card, Button, Icon, HealthBar, Badge } from '@/components/munafa';
import { useToast } from '@/components/munafa/Toast';
import { getProductById } from '@/app/actions/products';
import { updateStockStatus } from '@/app/actions/stock';
import { formatCurrency, formatSize, calculateMargin } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/cn';
import type { StockStatus } from '@/components/munafa/HealthBar';
import type { ProductWithStock } from '@/lib/types';

interface StatusButtonProps {
  status: StockStatus;
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function StatusButton({ status, label, isActive, onClick, disabled }: StatusButtonProps) {
  const colors = {
    OK: {
      bg: isActive ? 'bg-success-bar' : 'bg-success-bg',
      text: isActive ? 'text-white' : 'text-success-text',
      border: 'border-success-bar/30',
      ring: 'ring-success-bar',
    },
    LOW: {
      bg: isActive ? 'bg-warning-bar' : 'bg-warning-bg',
      text: isActive ? 'text-white' : 'text-warning-text',
      border: 'border-warning-bar/30',
      ring: 'ring-warning-bar',
    },
    EMPTY: {
      bg: isActive ? 'bg-danger-bar' : 'bg-danger-bg',
      text: isActive ? 'text-white' : 'text-danger-text',
      border: 'border-danger-bar/30',
      ring: 'ring-danger-bar',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex-1 py-3 px-4 rounded-[var(--radius-md)]',
        'font-semibold text-sm',
        'border',
        'transition-all duration-[var(--duration-fast)]',
        'active:scale-95',
        colors[status].bg,
        colors[status].text,
        colors[status].border,
        disabled && 'opacity-50 cursor-not-allowed',
        isActive && ['ring-2 ring-offset-2 ring-offset-surface', colors[status].ring]
      )}
    >
      {label}
    </button>
  );
}

export default function ProductDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState<ProductWithStock | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const productId = params.id as string;

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- loadProduct uses productId which is in deps
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
        // Optimistic update
        setProduct((prev) => prev ? ({
          ...prev,
          stock: prev.stock ? { ...prev.stock, status } : { id: '', productId, status, lastChecked: new Date() },
        }) : null);
        toast.success(t('detail.success.stock'));
      } else {
        toast.error(result.error || t('detail.error.stock'));
      }
    } catch (err) {
      console.error('Failed to update stock:', err);
      toast.error(t('detail.error.stock'));
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-10 w-20 bg-input-bg rounded-[var(--radius-md)] animate-pulse" />
          <div className="h-10 w-16 bg-input-bg rounded-[var(--radius-md)] animate-pulse" />
        </div>
        {/* Card skeletons */}
        <div className="h-48 bg-input-bg rounded-[var(--radius-lg)] animate-pulse" />
        <div className="h-32 bg-input-bg rounded-[var(--radius-lg)] animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-4">
        <Card className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-input-bg flex items-center justify-center">
            <Icon name="inventory-2" size="lg" className="text-text-disabled" />
          </div>
          <p className="text-text-secondary mb-4">{t('detail.notFound')}</p>
          <Button variant="secondary" onClick={() => router.back()}>
            {t('detail.button.back')}
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
  const currentStatus = (product.stock?.status || 'OK') as StockStatus;

  // Margin color based on value
  const marginColor =
    margin >= 20
      ? 'text-success-text bg-success-bg'
      : margin >= 10
      ? 'text-warning-text bg-warning-bg'
      : 'text-danger-text bg-danger-bg';

  return (
    <div className="p-4 space-y-4 pb-24 hero-gradient min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.back()}
          icon={<Icon name="arrow-back" size="sm" filled />}
          className="shadow-[var(--shadow-sm)]"
        >
          {t('detail.button.back')}
        </Button>
        <Link href={`/product/${productId}/edit`}>
          <Button
            variant="secondary"
            size="sm"
            icon={<Icon name="edit" size="sm" filled />}
            className="shadow-[var(--shadow-sm)]"
          >
            {t('detail.button.edit')}
          </Button>
        </Link>
      </div>

      {/* Product Info Card */}
      <Card className="overflow-hidden glass-card">
        <div className="p-4 space-y-4">
          {/* Name & Size */}
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{product.name}</h1>
            <p className="text-text-secondary">
              {formatSize(Number(product.sizeValue), product.sizeUnit)}
            </p>
            {product.barcode && (
              <p className="text-sm text-text-disabled mt-1">
                {t('detail.label.barcode')} {product.barcode}
              </p>
            )}
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Buy Price */}
            <div className="p-3 bg-input-bg rounded-[var(--radius-md)]">
              <p className="text-xs text-text-secondary mb-1">{t('detail.label.buyPrice')}</p>
              <p className="text-xl font-semibold text-text-primary tabular-nums">
                {formatCurrency(product.buyingPrice)}
              </p>
            </div>
            {/* Sell Price */}
            <div className="p-3 glass rounded-[var(--radius-md)] border border-brand-primary/30 bg-brand-primary/15">
              <p className="text-xs text-text-secondary mb-1">{t('detail.label.sellPrice')}</p>
              <p className="text-2xl font-bold text-brand-dark tabular-nums">
                {formatCurrency(product.sellingPrice)}
              </p>
            </div>
          </div>

          {/* Margin */}
          <div className={cn('p-3 rounded-[var(--radius-md)]', marginColor)}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('detail.label.margin')}</span>
              <span className="text-lg font-bold tabular-nums">
                {formatCurrency(marginAmount)} ({margin.toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stock Status Card */}
      <Card className="glass-card">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">
            {t('detail.stock.title')}
          </h2>

          {/* HealthBar */}
          <HealthBar status={currentStatus} className="h-3" />

          {/* Status Buttons */}
          <div className="flex gap-2">
            <StatusButton
              status="OK"
              label={t('detail.stock.ok')}
              isActive={currentStatus === 'OK'}
              onClick={() => handleStockStatusChange('OK')}
              disabled={updating}
            />
            <StatusButton
              status="LOW"
              label={t('detail.stock.low')}
              isActive={currentStatus === 'LOW'}
              onClick={() => handleStockStatusChange('LOW')}
              disabled={updating}
            />
            <StatusButton
              status="EMPTY"
              label={t('detail.stock.empty')}
              isActive={currentStatus === 'EMPTY'}
              onClick={() => handleStockStatusChange('EMPTY')}
              disabled={updating}
            />
          </div>
        </div>
      </Card>

      {/* Aliases/Search Keywords */}
      {product.aliases && product.aliases.length > 0 && (
        <Card className="glass-card">
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">
              {t('detail.label.aliases')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.aliases.map((alias: string, index: number) => (
                <Badge key={index} variant="default">
                  {alias}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Delete Button */}
      <Button
        variant="ghost"
        fullWidth
        className="text-danger-text hover:bg-danger-bg"
        onClick={() => {
          // TODO: Implement delete with confirmation
          console.log('Delete product:', productId);
        }}
      >
        <Icon name="delete" size="sm" className="mr-2" />
        {t('detail.button.delete')}
      </Button>
    </div>
  );
}
