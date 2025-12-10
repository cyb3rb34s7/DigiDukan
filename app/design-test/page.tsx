/**
 * Design Test Page - Visual QA for Munafa OS Components
 * URL: /design-test
 */

'use client';

import { Icon, IconNames } from '@/components/munafa/Icon';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function DesignTestPage() {
  const { theme, setTheme, isDark } = useTheme();
  const { language, setLanguage, t, languages, languageNames } = useLanguage();

  return (
    <div className="min-h-screen bg-canvas p-6 space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-[28px] font-bold text-text-primary">
          Munafa OS v2.1
        </h1>
        <p className="text-text-secondary">Design System Test Page</p>
      </header>

      {/* Theme & Language Controls */}
      <section className="space-y-4">
        <h2 className="text-[20px] font-bold text-text-primary">
          Theme & Language
        </h2>

        <div className="bg-surface p-4 rounded-lg space-y-4">
          {/* Theme Toggle */}
          <div className="space-y-2">
            <p className="text-sm font-bold text-text-secondary">
              {t('settings.theme.title')}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 h-12 rounded-xl font-medium transition-all ${
                  !isDark
                    ? 'bg-brand-gradient text-white'
                    : 'bg-canvas text-text-secondary border border-border-subtle'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Icon name={IconNames.lightMode} size="sm" />
                  {t('settings.theme.light')}
                </span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 h-12 rounded-xl font-medium transition-all ${
                  isDark
                    ? 'bg-brand-gradient text-white'
                    : 'bg-canvas text-text-secondary border border-border-subtle'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Icon name={IconNames.darkMode} size="sm" />
                  {t('settings.theme.dark')}
                </span>
              </button>
            </div>
          </div>

          {/* Language Selector */}
          <div className="space-y-2">
            <p className="text-sm font-bold text-text-secondary">
              {t('settings.language.title')}
            </p>
            <div className="flex gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`flex-1 h-12 rounded-xl font-medium transition-all ${
                    language === lang
                      ? 'bg-brand-gradient text-white'
                      : 'bg-canvas text-text-secondary border border-border-subtle'
                  }`}
                >
                  {languageNames[lang]}
                </button>
              ))}
            </div>
          </div>

          {/* Translation Preview */}
          <div className="space-y-2 pt-2 border-t border-border-subtle">
            <p className="text-sm font-bold text-text-secondary">
              Translation Preview
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-canvas p-2 rounded-lg">
                <span className="text-text-secondary">nav.home:</span>
                <span className="ml-2 text-text-primary font-medium">
                  {t('nav.home')}
                </span>
              </div>
              <div className="bg-canvas p-2 rounded-lg">
                <span className="text-text-secondary">nav.inventory:</span>
                <span className="ml-2 text-text-primary font-medium">
                  {t('nav.inventory')}
                </span>
              </div>
              <div className="bg-canvas p-2 rounded-lg">
                <span className="text-text-secondary">add.title:</span>
                <span className="ml-2 text-text-primary font-medium">
                  {t('add.title')}
                </span>
              </div>
              <div className="bg-canvas p-2 rounded-lg">
                <span className="text-text-secondary">settings.title:</span>
                <span className="ml-2 text-text-primary font-medium">
                  {t('settings.title')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Color Tokens */}
      <section className="space-y-4">
        <h2 className="text-[20px] font-bold text-text-primary">
          Color Tokens
        </h2>

        <div className="grid grid-cols-3 gap-3">
          {/* Brand Colors */}
          <div className="space-y-2">
            <div
              className="h-16 rounded-lg"
              style={{ background: 'var(--color-brand-primary)' }}
            />
            <p className="text-xs text-text-secondary">Brand Primary</p>
          </div>
          <div className="space-y-2">
            <div
              className="h-16 rounded-lg"
              style={{ background: 'var(--color-brand-dark)' }}
            />
            <p className="text-xs text-text-secondary">Brand Dark</p>
          </div>
          <div className="space-y-2">
            <div
              className="h-16 rounded-lg border"
              style={{ background: 'var(--color-brand-light)' }}
            />
            <p className="text-xs text-text-secondary">Brand Light</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Semantic Colors */}
          <div className="space-y-2">
            <div
              className="h-16 rounded-lg"
              style={{ background: 'var(--color-success-bar)' }}
            />
            <p className="text-xs text-text-secondary">Success</p>
          </div>
          <div className="space-y-2">
            <div
              className="h-16 rounded-lg"
              style={{ background: 'var(--color-warning-bar)' }}
            />
            <p className="text-xs text-text-secondary">Warning</p>
          </div>
          <div className="space-y-2">
            <div
              className="h-16 rounded-lg"
              style={{ background: 'var(--color-danger-bar)' }}
            />
            <p className="text-xs text-text-secondary">Danger</p>
          </div>
        </div>

        {/* Gradient */}
        <div className="space-y-2">
          <div className="h-16 rounded-lg bg-brand-gradient" />
          <p className="text-xs text-text-secondary">Brand Gradient</p>
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-4">
        <h2 className="text-[20px] font-bold text-text-primary">Typography</h2>

        <div className="space-y-3 bg-surface p-4 rounded-lg">
          <p style={{ fontSize: 'var(--text-size-hero)', fontWeight: 800 }}>
            ₹50,000 <span className="text-text-secondary text-sm">(Hero)</span>
          </p>
          <p style={{ fontSize: 'var(--text-size-h1)', fontWeight: 700 }}>
            Page Title (H1)
          </p>
          <p style={{ fontSize: 'var(--text-size-h2)', fontWeight: 700 }}>
            Card Title (H2)
          </p>
          <p style={{ fontSize: 'var(--text-size-body-lg)', fontWeight: 500 }}>
            Body Large - Input Text
          </p>
          <p style={{ fontSize: 'var(--text-size-body)', fontWeight: 500 }}>
            Body - Standard Text
          </p>
          <p
            style={{ fontSize: 'var(--text-size-caption)', fontWeight: 500 }}
            className="text-text-secondary"
          >
            Caption - Labels & Meta
          </p>
        </div>

        <div className="bg-surface p-4 rounded-lg">
          <p className="text-text-primary">
            Font Family: <span className="font-bold">Manrope</span>
          </p>
          <p className="price-number text-[24px] font-bold mt-2">
            ₹1,234.56 (Tabular Nums)
          </p>
        </div>
      </section>

      {/* Icons */}
      <section className="space-y-4">
        <h2 className="text-[20px] font-bold text-text-primary">
          Material Symbols Icons
        </h2>

        {/* Navigation Icons */}
        <div className="bg-surface p-4 rounded-lg space-y-3">
          <p className="text-sm font-bold text-text-secondary">
            Navigation (Filled = Active)
          </p>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <Icon name={IconNames.home} filled className="text-[#4F46E5]" />
              <span className="text-xs">Home</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Icon name={IconNames.inventory} className="text-slate-400" />
              <span className="text-xs text-slate-400">Inventory</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Icon name={IconNames.add} className="text-slate-400" />
              <span className="text-xs text-slate-400">Add</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Icon name={IconNames.settings} className="text-slate-400" />
              <span className="text-xs text-slate-400">Settings</span>
            </div>
          </div>
        </div>

        {/* Action Icons */}
        <div className="bg-surface p-4 rounded-lg space-y-3">
          <p className="text-sm font-bold text-text-secondary">Action Icons</p>
          <div className="flex items-center gap-4 flex-wrap">
            <Icon name={IconNames.search} size="lg" />
            <Icon name={IconNames.save} size="lg" />
            <Icon name={IconNames.edit} size="lg" />
            <Icon name={IconNames.delete} size="lg" />
            <Icon name={IconNames.copy} size="lg" />
            <Icon name={IconNames.arrowBack} size="lg" />
          </div>
        </div>

        {/* Feedback Icons */}
        <div className="bg-surface p-4 rounded-lg space-y-3">
          <p className="text-sm font-bold text-text-secondary">Feedback Icons</p>
          <div className="flex items-center gap-4">
            <Icon
              name={IconNames.checkCircle}
              filled
              size="lg"
              className="text-[#10B981]"
            />
            <Icon
              name={IconNames.warning}
              filled
              size="lg"
              className="text-[#F59E0B]"
            />
            <Icon
              name={IconNames.cancel}
              filled
              size="lg"
              className="text-[#F43F5E]"
            />
            <Icon name={IconNames.info} size="lg" className="text-[#4F46E5]" />
          </div>
        </div>

        {/* Icon Sizes */}
        <div className="bg-surface p-4 rounded-lg space-y-3">
          <p className="text-sm font-bold text-text-secondary">Icon Sizes</p>
          <div className="flex items-end gap-4">
            <div className="flex flex-col items-center gap-1">
              <Icon name={IconNames.home} size="sm" />
              <span className="text-xs">sm (20px)</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Icon name={IconNames.home} size="md" />
              <span className="text-xs">md (24px)</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Icon name={IconNames.home} size="lg" />
              <span className="text-xs">lg (28px)</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Icon name={IconNames.home} size="xl" />
              <span className="text-xs">xl (32px)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing & Shapes */}
      <section className="space-y-4">
        <h2 className="text-[20px] font-bold text-text-primary">
          Shapes & Shadows
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div
            className="h-24 bg-surface flex items-center justify-center"
            style={{
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <span className="text-xs text-text-secondary">sm / xs shadow</span>
          </div>
          <div
            className="h-24 bg-surface flex items-center justify-center"
            style={{
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <span className="text-xs text-text-secondary">md / md shadow</span>
          </div>
          <div
            className="h-24 bg-surface flex items-center justify-center"
            style={{
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <span className="text-xs text-text-secondary">lg / xl shadow</span>
          </div>
          <div
            className="h-24 glass flex items-center justify-center border border-slate-200/50"
            style={{
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-glass)',
            }}
          >
            <span className="text-xs text-text-secondary">Glass effect</span>
          </div>
        </div>
      </section>

      {/* Sample Button (Preview) */}
      <section className="space-y-4">
        <h2 className="text-[20px] font-bold text-text-primary">
          Button Preview
        </h2>

        <div className="space-y-3">
          <button
            className="w-full h-14 bg-brand-gradient text-white font-bold rounded-2xl"
            style={{ boxShadow: 'var(--shadow-xl)' }}
          >
            PAKKA KARO
          </button>

          <button
            className="w-full h-12 bg-surface text-text-primary font-bold rounded-2xl border"
            style={{
              boxShadow: 'var(--shadow-md)',
              color: 'var(--color-brand-primary)',
            }}
          >
            Secondary Button
          </button>

          <button className="w-full h-12 bg-transparent font-medium rounded-2xl text-[#4F46E5]">
            Ghost Button
          </button>
        </div>
      </section>

      {/* Touch Targets */}
      <section className="space-y-4">
        <h2 className="text-[20px] font-bold text-text-primary">
          Touch Targets (44px min)
        </h2>

        <div className="flex items-center gap-4">
          <button className="touch-target bg-surface rounded-lg flex items-center justify-center border">
            <Icon name={IconNames.add} />
          </button>
          <button className="touch-target bg-surface rounded-lg flex items-center justify-center border">
            <Icon name={IconNames.edit} />
          </button>
          <button className="touch-target bg-surface rounded-lg flex items-center justify-center border">
            <Icon name={IconNames.delete} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 pb-4 text-center text-text-secondary text-sm">
        <p>Munafa OS v2.1 - Design System Test</p>
        <p className="text-xs mt-1">Phase 1: Foundation Complete</p>
      </footer>
    </div>
  );
}
