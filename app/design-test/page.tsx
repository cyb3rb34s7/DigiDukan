/**
 * Design Test Page - Visual QA for Munafa OS Components
 * URL: /design-test
 */

'use client';

import { useState } from 'react';
import { Icon, IconNames } from '@/components/munafa/Icon';
import { Button } from '@/components/munafa/Button';
import { Input } from '@/components/munafa/Input';
import { Card } from '@/components/munafa/Card';
import { Badge } from '@/components/munafa/Badge';
import { Chip } from '@/components/munafa/Chip';
import { HealthBar } from '@/components/munafa/HealthBar';
import { MeshHeader } from '@/components/munafa/MeshHeader';
import { NavDock } from '@/components/munafa/NavDock';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useToast } from '@/components/munafa/Toast';

export default function DesignTestPage() {
  const { setTheme, isDark } = useTheme();
  const { language, setLanguage, t, languages, languageNames } = useLanguage();
  const { toast } = useToast();
  const [unit, setUnit] = useState('kg');
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-canvas pb-20">
      {/* MeshHeader Demo */}
      <MeshHeader title={t('header.title')} />

      <div className="p-4 space-y-8 max-w-md mx-auto">
        {/* Theme & Language Controls */}
        <section className="space-y-4">
          <h2 className="text-[20px] font-bold text-text-primary">
            Theme & Language
          </h2>

          <Card>
            {/* Theme Toggle */}
            <div className="space-y-2 mb-4">
              <p className="text-sm font-bold text-text-secondary">
                {t('settings.theme.title')}
              </p>
              <div className="flex gap-2">
                <Button
                  variant={!isDark ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setTheme('light')}
                  icon={<Icon name={IconNames.lightMode} size="sm" />}
                  className="flex-1"
                >
                  {t('settings.theme.light')}
                </Button>
                <Button
                  variant={isDark ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setTheme('dark')}
                  icon={<Icon name={IconNames.darkMode} size="sm" />}
                  className="flex-1"
                >
                  {t('settings.theme.dark')}
                </Button>
              </div>
            </div>

            {/* Language Selector */}
            <div className="space-y-2">
              <p className="text-sm font-bold text-text-secondary">
                {t('settings.language.title')}
              </p>
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang}
                    variant={language === lang ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setLanguage(lang)}
                    className="flex-1"
                  >
                    {languageNames[lang]}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* Button Component */}
        <section className="space-y-4">
          <h2 className="text-[20px] font-bold text-text-primary">Buttons</h2>

          <Card>
            <div className="space-y-3">
              <Button variant="primary" size="lg" fullWidth>
                {t('add.button.submit')}
              </Button>

              <Button
                variant="secondary"
                fullWidth
                icon={<Icon name={IconNames.save} size="sm" />}
              >
                {t('edit.button.save')}
              </Button>

              <Button variant="ghost" fullWidth>
                {t('common.cancel')}
              </Button>

              <Button variant="danger" fullWidth>
                {t('common.delete')}
              </Button>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="primary"
                  loading={loading}
                  onClick={handleLoadingDemo}
                  className="flex-1"
                >
                  Loading Demo
                </Button>
                <Button variant="secondary" disabled className="flex-1">
                  Disabled
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Input Component */}
        <section className="space-y-4">
          <h2 className="text-[20px] font-bold text-text-primary">Inputs</h2>

          <Card>
            <div className="space-y-4">
              <Input
                label={t('add.form.name')}
                placeholder={t('add.form.name.placeholder')}
              />

              <Input
                variant="search"
                placeholder={t('home.search.placeholder')}
                icon={<Icon name={IconNames.search} size="sm" />}
              />

              <Input
                variant="price"
                label={t('add.form.buyPrice')}
                placeholder="0"
                icon={<span className="text-text-primary">₹</span>}
                inputMode="decimal"
              />

              <Input
                label="With Error"
                placeholder="Enter something..."
                error="This field is required"
              />
            </div>
          </Card>
        </section>

        {/* Chip Component */}
        <section className="space-y-4">
          <h2 className="text-[20px] font-bold text-text-primary">Chips</h2>

          <Card>
            <p className="text-sm font-bold text-text-secondary mb-2">
              {t('add.form.unit')}
            </p>
            <Chip
              options={[
                { value: 'kg', label: t('unit.kg') },
                { value: 'g', label: t('unit.g') },
                { value: 'L', label: t('unit.L') },
                { value: 'pcs', label: t('unit.pcs') },
              ]}
              value={unit}
              onChange={setUnit}
            />
          </Card>
        </section>

        {/* Badge Component */}
        <section className="space-y-4">
          <h2 className="text-[20px] font-bold text-text-primary">Badges</h2>

          <Card>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="success">{t('stock.ok.label')}</Badge>
              <Badge variant="warning">{t('stock.low.label')}</Badge>
              <Badge variant="danger">{t('stock.empty.label')}</Badge>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="success" size="sm">Small</Badge>
              <Badge variant="warning" size="md">Medium</Badge>
            </div>
          </Card>
        </section>

        {/* HealthBar Component */}
        <section className="space-y-4">
          <h2 className="text-[20px] font-bold text-text-primary">Health Bars</h2>

          <Card>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">OK (100%)</span>
                  <Badge variant="success" size="sm">{t('stock.ok.label')}</Badge>
                </div>
                <HealthBar status="OK" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">LOW (40%)</span>
                  <Badge variant="warning" size="sm">{t('stock.low.label')}</Badge>
                </div>
                <HealthBar status="LOW" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">EMPTY (0%)</span>
                  <Badge variant="danger" size="sm">{t('stock.empty.label')}</Badge>
                </div>
                <HealthBar status="EMPTY" />
              </div>
            </div>
          </Card>
        </section>

        {/* Toast Demo */}
        <section className="space-y-4">
          <h2 className="text-[20px] font-bold text-text-primary">Toasts</h2>

          <Card>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => toast.success(t('add.success'))}
              >
                Success
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => toast.error(t('add.error'))}
              >
                Error
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => toast.warning(t('toast.warning.default'))}
              >
                Warning
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => toast.info(t('toast.info.default'))}
              >
                Info
              </Button>
            </div>
          </Card>
        </section>

        {/* Card Variants */}
        <section className="space-y-4">
          <h2 className="text-[20px] font-bold text-text-primary">Cards</h2>

          <Card hoverable>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success-bg rounded-xl flex items-center justify-center">
                <Icon name={IconNames.shoppingBag} className="text-success-text" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-text-primary">Tata Salt 1kg</p>
                <p className="text-sm text-text-secondary">₹25 → ₹30</p>
              </div>
              <Badge variant="success">{t('stock.ok.label')}</Badge>
            </div>
            <HealthBar status="OK" className="mt-3" />
          </Card>

          <Card hoverable>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-warning-bg rounded-xl flex items-center justify-center">
                <Icon name={IconNames.shoppingBag} className="text-warning-text" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-text-primary">Fortune Oil 1L</p>
                <p className="text-sm text-text-secondary">₹150 → ₹165</p>
              </div>
              <Badge variant="warning">{t('stock.low.label')}</Badge>
            </div>
            <HealthBar status="LOW" className="mt-3" />
          </Card>

          <Card hoverable>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-danger-bg rounded-xl flex items-center justify-center">
                <Icon name={IconNames.shoppingBag} className="text-danger-text" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-text-primary">Aashirvaad Atta 5kg</p>
                <p className="text-sm text-text-secondary">₹280 → ₹320</p>
              </div>
              <Badge variant="danger">{t('stock.empty.label')}</Badge>
            </div>
            <HealthBar status="EMPTY" className="mt-3" />
          </Card>
        </section>

        {/* Icons */}
        <section className="space-y-4">
          <h2 className="text-[20px] font-bold text-text-primary">Icons</h2>

          <Card>
            <p className="text-sm font-bold text-text-secondary mb-3">
              Navigation (Filled = Active)
            </p>
            <div className="flex items-center justify-around">
              <div className="flex flex-col items-center gap-1">
                <Icon name={IconNames.home} filled className="text-brand-primary" />
                <span className="text-xs text-brand-primary font-bold">Home</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Icon name={IconNames.inventory} className="text-text-secondary" />
                <span className="text-xs text-text-secondary">Stock</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Icon name={IconNames.add} className="text-text-secondary" />
                <span className="text-xs text-text-secondary">Add</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Icon name={IconNames.settings} className="text-text-secondary" />
                <span className="text-xs text-text-secondary">Settings</span>
              </div>
            </div>
          </Card>

          <Card>
            <p className="text-sm font-bold text-text-secondary mb-3">
              Sizes: sm(20) / md(24) / lg(28) / xl(32)
            </p>
            <div className="flex items-end justify-around">
              <Icon name={IconNames.home} size="sm" />
              <Icon name={IconNames.home} size="md" />
              <Icon name={IconNames.home} size="lg" />
              <Icon name={IconNames.home} size="xl" />
            </div>
          </Card>
        </section>

        {/* Footer */}
        <footer className="pt-8 pb-4 text-center text-text-secondary text-sm">
          <p>Munafa OS v2.1 - Design System</p>
          <p className="text-xs mt-1">Phase 2: Component Library Complete</p>
        </footer>
      </div>

      {/* NavDock Demo */}
      <NavDock
        items={[
          { href: '/design-test', icon: 'home', labelKey: 'nav.home' },
          { href: '/inventory', icon: 'inventory-2', labelKey: 'nav.inventory' },
          { href: '/add', icon: 'add-circle', labelKey: 'nav.add' },
          { href: '/settings', icon: 'settings', labelKey: 'nav.settings' },
        ]}
      />
    </div>
  );
}
