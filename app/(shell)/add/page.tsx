/**
 * Add Product Page - Create new product
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { addProduct } from '@/app/actions/products';
import { UNITS } from '@/lib/utils/constants';
import { calculateSellingPrice } from '@/lib/utils/formatters';

export default function AddProductPage() {
  const router = useRouter();
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

  // Auto-calculate selling price when buying price or margin changes
  const handleBuyingPriceChange = (value: string) => {
    const buyingPrice = parseFloat(value) || 0;
    const sellingPrice = calculateSellingPrice(buyingPrice, formData.defaultMargin);
    setFormData({
      ...formData,
      buyingPrice: value,
      sellingPrice: sellingPrice.toFixed(2),
    });
  };

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
        aliases: [],
      });

      if (result.success) {
        // Navigate to the new product
        router.push(`/product/${result.data?.id}`);
      }
    } catch (error) {
      console.error('Failed to add product:', error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Plus className="w-6 h-6 text-blue-700" />
        <h1 className="text-xl font-semibold">नया उत्पाद (New Product)</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <Card>
          <div className="space-y-4">
            <Input
              label="नाम (Name) *"
              placeholder="e.g., Tata Salt"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              autoFocus
            />

            <Input
              label="Barcode (Optional)"
              placeholder="Scan or enter barcode"
              value={formData.barcode}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            />
          </div>
        </Card>

        {/* Quantity & Unit */}
        <Card>
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">मात्रा और इकाई (Quantity & Unit)</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="मात्रा *"
                type="number"
                step="0.01"
                value={formData.sizeValue}
                onChange={(e) => setFormData({ ...formData, sizeValue: e.target.value })}
                required
              />
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Unit *</label>
                <div className="grid grid-cols-3 gap-1">
                  {UNITS.slice(0, 3).map((unit) => (
                    <button
                      key={unit.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, sizeUnit: unit.value })}
                      className={`px-2 py-2 text-xs font-medium rounded-lg transition-colors ${
                        formData.sizeUnit === unit.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {unit.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  {UNITS.slice(3).map((unit) => (
                    <button
                      key={unit.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, sizeUnit: unit.value })}
                      className={`px-2 py-2 text-xs font-medium rounded-lg transition-colors ${
                        formData.sizeUnit === unit.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {unit.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Pricing */}
        <Card>
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">मूल्य (Pricing)</h3>
            
            <Input
              label="खरीद मूल्य (Buying Price) *"
              type="number"
              step="0.01"
              inputMode="decimal"
              placeholder="₹ 0.00"
              value={formData.buyingPrice}
              onChange={(e) => handleBuyingPriceChange(e.target.value)}
              required
            />

            <Input
              label="बिक्री मूल्य (Selling Price) *"
              type="number"
              step="0.01"
              inputMode="decimal"
              placeholder="₹ 0.00"
              value={formData.sellingPrice}
              onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
              required
            />

            {formData.buyingPrice && formData.sellingPrice && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <p className="text-sm text-emerald-700">
                  मुनाफा (Margin): ₹
                  {(Number(formData.sellingPrice) - Number(formData.buyingPrice)).toFixed(2)} (
                  {(
                    ((Number(formData.sellingPrice) - Number(formData.buyingPrice)) /
                      Number(formData.buyingPrice)) *
                    100
                  ).toFixed(1)}
                  %)
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Submit Buttons */}
        <div className="space-y-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={saving}
            icon={<Save className="w-5 h-5" />}
          >
            उत्पाद जोड़ें (Add Product)
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => router.push('/')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
