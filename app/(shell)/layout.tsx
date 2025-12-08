/**
 * Shell Layout - With Header and Bottom Nav
 */

'use client';

import { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';

export default function ShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header title="मेरी दुकान" />
      
      <main className="flex-1 overflow-y-auto pb-nav-height">
        {children}
      </main>
      
      <BottomNav />
    </div>
  );
}
