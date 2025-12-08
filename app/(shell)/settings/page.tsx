/**
 * Settings Page - App Configuration
 */

'use client';

import { useState } from 'react';
import { Settings as SettingsIcon, Percent, Globe, Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

export default function SettingsPage() {
  const [defaultMargin, setDefaultMargin] = useLocalStorage('defaultMargin', 10);
  const [language, setLanguage] = useLocalStorage('language', 'hi');
  const [tempMargin, setTempMargin] = useState(defaultMargin.toString());
  const [saved, setSaved] = useState(false);

  const handleSaveMargin = () => {
    const margin = parseFloat(tempMargin);
    if (!isNaN(margin) && margin >= 0 && margin <= 100) {
      setDefaultMargin(margin);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <SettingsIcon className="w-6 h-6 text-blue-700" />
        <h1 className="text-xl font-semibold">सेटिंग्स (Settings)</h1>
      </div>

      {/* Default Margin Setting */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900">Default Profit Margin</h3>
          </div>

          <p className="text-sm text-slate-600">
            डिफ़ॉल्ट मार्जिन सेट करें जो नए उत्पाद जोड़ते समय स्वचालित रूप से लागू होगा।
          </p>
          <p className="text-sm text-slate-500">
            Set the default margin that will be automatically applied when adding new products.
          </p>

          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                label="मार्जिन % (Margin %)"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={tempMargin}
                onChange={(e) => setTempMargin(e.target.value)}
                placeholder="10"
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="primary"
                onClick={handleSaveMargin}
                disabled={tempMargin === defaultMargin.toString()}
              >
                {saved ? 'Saved!' : 'Save'}
              </Button>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <p className="text-sm text-slate-700">
              <strong>Current Default:</strong> {defaultMargin}%
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Example: For ₹100 buying price → ₹{(100 * (1 + defaultMargin / 100)).toFixed(2)}{' '}
              selling price
            </p>
          </div>
        </div>
      </Card>

      {/* Language Setting */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900">Language / भाषा</h3>
          </div>

          <p className="text-sm text-slate-600">
            Choose your preferred language for the app interface.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleLanguageChange('hi')}
              className={`p-4 rounded-lg border-2 transition-all ${
                language === 'hi'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="text-lg font-semibold">हिन्दी</div>
              <div className="text-sm text-slate-600">Hindi</div>
            </button>

            <button
              onClick={() => handleLanguageChange('en')}
              className={`p-4 rounded-lg border-2 transition-all ${
                language === 'en'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="text-lg font-semibold">English</div>
              <div className="text-sm text-slate-600">अंग्रेज़ी</div>
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> The app currently shows both Hindi and English labels for ease
              of use. Future updates may support language-only mode.
            </p>
          </div>
        </div>
      </Card>

      {/* App Information */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-slate-900">About / के बारे में</h3>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span>App Name</span>
              <span className="font-medium text-slate-900">Kirana Digital Dukaan</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span>Version</span>
              <span className="font-medium text-slate-900">1.0.0</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Built for</span>
              <span className="font-medium text-slate-900">Indian Grocery Store Owners</span>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-sm text-emerald-700">
              💚 Designed to help small businesses manage inventory efficiently and grow profits.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
