/**
 * Edit Product Page - Update product details
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { getProductById, updateProduct } from '@/app/actions/products';
import { UNITS } from '@/lib/utils/constants';
import { calculateSellingPrice } from '@/lib/utils/formatters';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
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
        router.push(`/product/${productId}`);
      }
    } catch (error) {
      console.error('Failed to update product:', error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-slate-200 rounded"></div>
          <div className="h-10 bg-slate-200 rounded"></div>
          <div className="h-10 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="w-5 h-5" />}
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <h1 className="text-xl font-semibold">Edit Product</h1>
        <div className="w-20"></div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <div className="space-y-4">
            <Input
              label="नाम (Name)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="Barcode (Optional)"
              value={formData.barcode}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="मात्रा (Quantity)"
                type="number"
                step="0.01"
                value={formData.sizeValue}
                onChange={(e) => setFormData({ ...formData, sizeValue: e.target.value })}
                required
              />
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Unit</label>
                <div className="flex gap-2">
                  {UNITS.map((unit) => (
                    <button
                      key={unit.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, sizeUnit: unit.value })}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
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

        <Card>
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">मूल्य (Pricing)</h3>
            
            <Input
              label="खरीद मूल्य (Buying Price)"
              type="number"
              step="0.01"
              inputMode="decimal"
              value={formData.buyingPrice}
              onChange={(e) => setFormData({ ...formData, buyingPrice: e.target.value })}
              required
            />

            <Input
              label="बिक्री मूल्य (Selling Price)"
              type="number"
              step="0.01"
              inputMode="decimal"
              value={formData.sellingPrice}
              onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
              required
            />
          </div>
        </Card>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={saving}
          icon={<Save className="w-5 h-5" />}
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
}
