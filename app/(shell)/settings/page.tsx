/**
 * Settings Page - Munafa OS
 * App configuration with working language toggle
 */

'use client';

import { useState } from 'react';
import { useLanguage, useTranslation } from '@/lib/contexts/LanguageContext';
import { Card, Button, Input, Icon } from '@/components/munafa';
import { useToast } from '@/components/munafa/Toast';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { cn } from '@/lib/utils/cn';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { language, setLanguage, languages, languageNames } = useLanguage();
  const { toast } = useToast();
  const [defaultMargin, setDefaultMargin] = useLocalStorage('defaultMargin', 10);
  const [tempMargin, setTempMargin] = useState(defaultMargin.toString());

  const handleSaveMargin = () => {
    const margin = parseFloat(tempMargin);
    if (!isNaN(margin) && margin >= 0 && margin <= 100) {
      setDefaultMargin(margin);
      toast.success(t('settings.success'));
    }
  };

  const handleLanguageChange = (lang: typeof language) => {
    setLanguage(lang);
    toast.success(t('settings.success'));
  };

  // Calculate example price
  const examplePrice = (100 * (1 + defaultMargin / 100)).toFixed(0);

  return (
    <div className="p-4 space-y-4 pb-24 hero-gradient min-h-screen">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
          <Icon name="settings" size="md" className="text-brand-primary" />
        </div>
        <h1 className="text-xl font-bold text-text-primary">{t('settings.title')}</h1>
      </div>

      {/* Language Setting */}
      <Card className="glass-card">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Icon name="language" size="md" className="text-brand-primary" />
            <h3 className="font-semibold text-text-primary">{t('settings.language.title')}</h3>
          </div>

          {/* Language Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={cn(
                  'p-3 rounded-md border-2 transition-all',
                  'font-semibold text-sm',
                  language === lang
                    ? 'border-brand-primary bg-brand-primary/15 text-brand-primary'
                    : 'border-border-subtle bg-surface text-text-secondary hover:border-brand-primary/50'
                )}
              >
                {languageNames[lang]}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Default Margin Setting */}
      <Card className="glass-card">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Icon name="percent" size="md" className="text-success-text" />
            <div>
              <h3 className="font-semibold text-text-primary">{t('settings.margin.title')}</h3>
              <p className="text-sm text-text-secondary">{t('settings.margin.description')}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="number"
                inputMode="decimal"
                step="0.1"
                min="0"
                max="100"
                value={tempMargin}
                onChange={(e) => setTempMargin(e.target.value)}
                icon={<span className="text-text-secondary">%</span>}
              />
            </div>
            <Button
              variant="primary"
              onClick={handleSaveMargin}
              disabled={tempMargin === defaultMargin.toString()}
              icon={<Icon name="save" size="sm" />}
            >
              {t('settings.button.save')}
            </Button>
          </div>

          {/* Current margin display */}
          <div className="p-3 rounded-md bg-success-bg">
            <div className="flex items-center justify-between text-success-text">
              <span className="text-sm font-medium">
                {t('settings.margin.example').replace('{price}', examplePrice)}
              </span>
              <span className="text-lg font-bold tabular-nums">{defaultMargin}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* App Information */}
      <Card className="glass-card">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Icon name="info" size="md" className="text-text-secondary" />
            <h3 className="font-semibold text-text-primary">{t('settings.info.title')}</h3>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-border-subtle">
              <span className="text-text-secondary">App</span>
              <span className="font-semibold text-text-primary">{t('settings.info.name')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border-subtle">
              <span className="text-text-secondary">Version</span>
              <span className="font-semibold text-text-primary">2.1</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-text-secondary">Built for</span>
              <span className="font-semibold text-text-primary">{t('settings.info.builtFor')}</span>
            </div>
          </div>

          {/* Tagline */}
          <div className="p-3 rounded-md bg-brand-primary/10 border border-brand-primary/20">
            <p className="text-sm text-brand-primary text-center font-medium">
              Designed to help small businesses grow profits
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
