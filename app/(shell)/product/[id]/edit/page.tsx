/**
 * Edit Product Page - Munafa OS
 * Update product details
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/contexts/LanguageContext';
import { Card, Button, Input, Icon, Chip } from '@/components/munafa';
import { useToast } from '@/components/munafa/Toast';
import { getProductById, updateProduct } from '@/app/actions/products';
import { UNITS } from '@/lib/utils/constants';
import { calculateMargin } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/cn';

export default function EditProductPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    sizeValue: '',
    sizeUnit: 'kg',
    buyingPrice: '',
    sellingPrice: '',
    aliases: [] as string[],
  });

  const productId = params.id as string;

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- loadProduct uses productId which is in deps
  }, [productId]);

  async function loadProduct() {
    try {
      const result = await getProductById({ id: productId });
      if (result.success && result.data) {
        const p = result.data;
        setFormData({
          name: p.name,
          barcode: p.barcode || '',
          sizeValue: String(p.sizeValue),
          sizeUnit: p.sizeUnit,
          buyingPrice: String(p.buyingPrice),
          sellingPrice: String(p.sellingPrice),
          aliases: p.aliases || [],
        });
      }
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await updateProduct({
        id: productId,
        name: formData.name,
        barcode: formData.barcode || null,
        sizeValue: Number(formData.sizeValue),
        sizeUnit: formData.sizeUnit,
        buyingPrice: Number(formData.buyingPrice),
        sellingPrice: Number(formData.sellingPrice),
        aliases: formData.aliases,
      });

      if (result.success) {
        toast.success(t('edit.success'));
        router.push(`/product/${productId}`);
      } else {
        toast.error(result.error || t('edit.error'));
      }
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error(t('edit.error'));
    } finally {
      setSaving(false);
    }
  }

  // Calculate margin for display
  const margin =
    formData.buyingPrice && formData.sellingPrice
      ? calculateMargin(Number(formData.buyingPrice), Number(formData.sellingPrice))
      : 0;

  // Unit options for Chip selector
  const unitOptions = UNITS.map((unit) => ({
    value: unit.value,
    label: unit.label,
  }));

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-10 w-20 bg-input-bg rounded-[var(--radius-md)] animate-pulse" />
          <div className="h-6 w-32 bg-input-bg rounded-[var(--radius-md)] animate-pulse" />
          <div className="w-20" />
        </div>
        {/* Form skeleton */}
        <div className="h-64 bg-input-bg rounded-[var(--radius-lg)] animate-pulse" />
        <div className="h-48 bg-input-bg rounded-[var(--radius-lg)] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.back()}
          icon={<Icon name="close" size="sm" filled />}
          className="shadow-[var(--shadow-sm)]"
        >
          {t('edit.button.cancel')}
        </Button>
        <h1 className="text-lg font-semibold text-text-primary">{t('edit.title')}</h1>
        <div className="w-20" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info Card */}
        <Card>
          <div className="p-4 space-y-4">
            <Input
              label={t('add.form.name')}
              placeholder={t('add.form.name.placeholder')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label={t('add.form.barcode')}
              placeholder={t('add.form.barcode.placeholder')}
              value={formData.barcode}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label={t('add.form.quantity')}
                type="number"
                inputMode="decimal"
                step="0.01"
                value={formData.sizeValue}
                onChange={(e) => setFormData({ ...formData, sizeValue: e.target.value })}
                required
              />

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">
                  {t('add.form.unit')}
                </label>
                <Chip
                  options={unitOptions}
                  value={formData.sizeUnit}
                  onChange={(value) => setFormData({ ...formData, sizeUnit: value })}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Pricing Card */}
        <Card>
          <div className="p-4 space-y-4">
            <h3 className="font-semibold text-text-primary">{t('add.form.buyPrice')}</h3>

            <Input
              label={t('add.form.buyPrice')}
              type="number"
              inputMode="decimal"
              step="0.01"
              value={formData.buyingPrice}
              onChange={(e) => setFormData({ ...formData, buyingPrice: e.target.value })}
              icon={<span className="text-text-secondary">₹</span>}
              required
            />

            <Input
              label={t('add.form.sellPrice')}
              type="number"
              inputMode="decimal"
              step="0.01"
              value={formData.sellingPrice}
              onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
              icon={<span className="text-text-secondary">₹</span>}
              required
            />

            {/* Margin Display */}
            {formData.buyingPrice && formData.sellingPrice && (
              <div
                className={cn(
                  'p-3 rounded-[var(--radius-md)]',
                  margin >= 20
                    ? 'bg-success-bg text-success-text'
                    : margin >= 10
                    ? 'bg-warning-bg text-warning-text'
                    : 'bg-danger-bg text-danger-text'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t('add.form.margin')}</span>
                  <span className="text-lg font-bold tabular-nums">{margin.toFixed(0)}%</span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Save Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={saving}
          className="gap-2"
        >
          <Icon name="check" size="sm" />
          {saving ? t('edit.button.saving') : t('edit.button.save')}
        </Button>
      </form>
    </div>
  );
}
