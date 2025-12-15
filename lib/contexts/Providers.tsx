/**
 * Combined Providers Component
 * Wraps app with ThemeProvider, LanguageProvider, ToastProvider, and PWA components
 */

'use client';

import { type ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';
import { LanguageProvider } from './LanguageContext';
import { ToastProvider } from '@/components/munafa/Toast';
import { ServiceWorkerRegistration, InstallPrompt } from '@/components/munafa';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <ServiceWorkerRegistration />
          {children}
          <InstallPrompt />
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
