/**
 * Shell Layout - With Header and Bottom Nav
 */

'use client';

import { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/lib/hooks/useToast';

export default function ShellLayout({ children }: { children: ReactNode }) {
  const { toasts, removeToast } = useToast();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header title="मेरी दुकान" />
      
      <main className="flex-1 overflow-y-auto pb-nav-height">
        {children}
      </main>
      
      <BottomNav />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
