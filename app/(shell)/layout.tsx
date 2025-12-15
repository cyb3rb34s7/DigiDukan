/**
 * Shell Layout - With AppBar and NavDock
 * Munafa OS v2.1 - Premium Design
 */

'use client';

import { ReactNode } from 'react';
import { AppBar } from '@/components/munafa/AppBar';
import { NavDock } from '@/components/munafa/NavDock';
import { useTranslation } from '@/lib/contexts/LanguageContext';

export default function ShellLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      <AppBar title={t('header.title')} />

      <main className="flex-1 pt-14 pb-[calc(var(--nav-height)+env(safe-area-inset-bottom,0px))]">
        {children}
      </main>

      <NavDock />
    </div>
  );
}
