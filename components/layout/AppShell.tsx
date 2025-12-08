/**
 * App Shell - Main layout wrapper
 */

'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/lib/hooks/useToast';

interface AppShellProps {
  children: ReactNode;
  title: string;
}

export function AppShell({ children, title }: AppShellProps) {
  const { toasts, removeToast } = useToast();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header title={title} />
      
      <main className="flex-1 overflow-y-auto pb-nav-height">
        {children}
      </main>
      
      <BottomNav />
      
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
