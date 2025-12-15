/**
 * Add Product Page - Munafa OS
 * Create new product with modern design
 */

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/contexts/LanguageContext';
import { Card, Button, Input, Icon, Chip } from '@/components/munafa';
import { useToast } from '@/components/munafa/Toast';
import { addProduct } from '@/app/actions/products';
import { UNITS } from '@/lib/utils/constants';
import { calculateSellingPrice, calculateMargin } from '@/lib/utils/formatters';
import { getSuggestedAliases } from '@/lib/utils/search';
import { cn } from '@/lib/utils/cn';

export default function AddProductPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    sizeValue: '1',
    sizeUnit: 'kg',
    buyingPrice: '',
    sellingPrice: '',
    defaultMargin: 10,
  });

  // Track what user has manually unselected
  const [unselectedAliases, setUnselectedAliases] = useState<Set<string>>(new Set());

  // Get suggested aliases based on product name
  const suggestedAliases = useMemo(() => {
    return getSuggestedAliases(formData.name);
  }, [formData.name]);

  // Active aliases = suggestions minus what user unselected
  const activeAliases = useMemo(() => {
    return suggestedAliases.filter((a) => !unselectedAliases.has(a));
  }, [suggestedAliases, unselectedAliases]);

  // Toggle adds/removes from unselected set
  const toggleAlias = (alias: string) => {
    setUnselectedAliases((prev) => {
      const next = new Set(prev);
      if (next.has(alias)) {
        next.delete(alias);
      } else {
        next.add(alias);
      }
      return next;
    });
  };

  // Auto-calculate selling price when buying price changes
  const handleBuyingPriceChange = (value: string) => {
    const buyingPrice = parseFloat(value) || 0;
    const sellingPrice = calculateSellingPrice(buyingPrice, formData.defaultMargin);
    setFormData({
      ...formData,
      buyingPrice: value,
      sellingPrice: sellingPrice.toFixed(2),
    });
  };

  // Calculate margin for display
  const margin =
    formData.buyingPrice && formData.sellingPrice
      ? calculateMargin(Number(formData.buyingPrice), Number(formData.sellingPrice))
      : 0;

  const marginAmount =
    formData.buyingPrice && formData.sellingPrice
      ? Number(formData.sellingPrice) - Number(formData.buyingPrice)
      : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await addProduct({
        name: formData.name,
        barcode: formData.barcode || null,
        sizeValue: Number(formData.sizeValue),
        sizeUnit: formData.sizeUnit,
        buyingPrice: Number(formData.buyingPrice),
        sellingPrice: Number(formData.sellingPrice),
        stockStatus: 'OK',
        aliases: activeAliases,
      });

      if (result.success) {
        toast.success(t('add.success'));
        router.push(`/product/${result.data?.id}`);
      } else {
        toast.error(result.error || t('add.error'));
      }
    } catch (err) {
      console.error('Failed to add product:', err);
      toast.error(t('add.error'));
    } finally {
      setSaving(false);
    }
  }

  // Unit options for Chip selector
  const unitOptions = UNITS.map((unit) => ({
    value: unit.value,
    label: unit.label,
  }));

  return (
    <div className="p-4 space-y-4 pb-24 hero-gradient min-h-screen">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
          <Icon name="add-circle" size="md" className="text-brand-primary" />
        </div>
        <h1 className="text-xl font-bold text-text-primary">{t('add.title')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Info Card */}
        <Card className="glass-card">
          <div className="p-4 space-y-4">
            <Input
              label={t('add.form.name')}
              placeholder={t('add.form.name.placeholder')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              autoFocus
            />

            {/* Alias Suggestions - Pre-selected, tap to remove */}
            {suggestedAliases.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">
                  Search Keywords (tap to remove)
                </label>
                <div className="flex flex-wrap gap-2">
                  {suggestedAliases.map((alias) => (
                    <button
                      key={alias}
                      type="button"
                      onClick={() => toggleAlias(alias)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                        'border',
                        activeAliases.includes(alias)
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-input-bg text-text-secondary border-border-subtle hover:border-brand-primary/50'
                      )}
                    >
                      {alias}
                      {activeAliases.includes(alias) && (
                        <Icon name="check" size="sm" className="ml-1 inline" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Input
              label={t('add.form.barcode')}
              placeholder={t('add.form.barcode.placeholder')}
              value={formData.barcode}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            />
          </div>
        </Card>

        {/* Size & Unit Card */}
        <Card className="glass-card">
          <div className="p-4 space-y-4">
            <h3 className="font-semibold text-text-primary">{t('add.form.quantity')}</h3>

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
        <Card className="glass-card">
          <div className="p-4 space-y-4">
            <h3 className="font-semibold text-text-primary">{t('add.form.buyPrice')}</h3>

            <div className="grid grid-cols-2 gap-3">
              {/* Buy Price */}
              <Input
                label={t('add.form.buyPrice')}
                type="number"
                inputMode="decimal"
                step="0.01"
                value={formData.buyingPrice}
                onChange={(e) => handleBuyingPriceChange(e.target.value)}
                icon={<span className="text-text-secondary">₹</span>}
                required
              />

              {/* Sell Price with glass highlight */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">
                  {t('add.form.sellPrice')}
                </label>
                <div className="glass rounded-[var(--radius-md)] border border-brand-primary/30 bg-brand-primary/15 p-px">
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    icon={<span className="text-brand-primary font-semibold">₹</span>}
                    required
                    className="border-0 bg-transparent"
                  />
                </div>
              </div>
            </div>

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
                  <span className="text-lg font-bold tabular-nums">
                    ₹{marginAmount.toFixed(0)} ({margin.toFixed(0)}%)
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={saving}
          icon={<Icon name="add-circle" size="sm" />}
          className="gap-2"
        >
          {saving ? t('add.button.submitting') : t('add.button.submit')}
        </Button>
      </form>
    </div>
  );
}
