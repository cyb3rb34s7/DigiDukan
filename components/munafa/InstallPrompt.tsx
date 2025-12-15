/**
 * InstallPrompt Component - PWA Install Banner
 * Shows install prompt on mobile devices
 * Handles both Android (beforeinstallprompt) and iOS (manual instructions)
 */

'use client';

import { useState, useEffect } from 'react';
import { Button, Icon } from '@/components/munafa';
import { cn } from '@/lib/utils/cn';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'munafa-install-dismissed';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Also check for iOS standalone
    if ((navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed recently
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt && Date.now() - parseInt(dismissedAt) < DISMISS_DURATION) {
      return;
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // For iOS, show the prompt after a short delay
    if (isIOSDevice) {
      setTimeout(() => setShowPrompt(true), 2000);
      return;
    }

    // For Android/Chrome - Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
    } catch (error) {
      console.error('Install failed:', error);
    }

    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showPrompt || isInstalled) return null;

  // iOS-specific prompt with Share instructions
  if (isIOS) {
    return (
      <div
        className={cn(
          'fixed bottom-20 left-4 right-4 z-50',
          'p-4 rounded-[var(--radius-lg)]',
          'bg-white dark:bg-gray-900',
          'border border-brand-primary/30',
          'shadow-xl',
          'animate-in slide-in-from-bottom-4 fade-in duration-300'
        )}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="w-12 h-12 rounded-[var(--radius-md)] bg-brand-primary flex items-center justify-center shrink-0">
            <Icon name="install-mobile" size="lg" className="text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-text-primary">Install Munafa OS</h3>
          </div>
        </div>

        {/* Step-by-step instructions */}
        <div className="mt-3 space-y-2 text-sm text-text-secondary">
          <p className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center shrink-0">1</span>
            Tap <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 24 24"><path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V10c0-1.1.9-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .9 2 2z"/></svg> Share below
          </p>
          <p className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center shrink-0">2</span>
            Scroll down in the menu
          </p>
          <p className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center shrink-0">3</span>
            Tap <strong>&quot;Add to Home Screen&quot;</strong>
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-4">
          <Button
            variant="primary"
            size="sm"
            onClick={handleDismiss}
          >
            Got it
          </Button>
        </div>
      </div>
    );
  }

  // Android/Chrome prompt
  return (
    <div
      className={cn(
        'fixed bottom-20 left-4 right-4 z-50',
        'p-4 rounded-[var(--radius-lg)]',
        'bg-white dark:bg-gray-900',
        'border border-brand-primary/30',
        'shadow-xl',
        'animate-in slide-in-from-bottom-4 fade-in duration-300'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-12 h-12 rounded-[var(--radius-md)] bg-brand-primary flex items-center justify-center shrink-0">
          <Icon name="install-mobile" size="lg" className="text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-text-primary">Install Munafa OS</h3>
          <p className="text-sm text-text-secondary mt-0.5">
            Add to home screen for quick access
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleDismiss}
          className="flex-1"
        >
          Not Now
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleInstall}
          icon={<Icon name="install-mobile" size="sm" />}
          className="flex-1"
        >
          Install
        </Button>
      </div>
    </div>
  );
}

export default InstallPrompt;
