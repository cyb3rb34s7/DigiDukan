/**
 * Toast Component - Munafa OS
 * Notification system with glassmorphism
 */

'use client';

import {
  createContext,
  useContext,
  useCallback,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon, IconNames } from './Icon';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  dismissible?: boolean;
}

interface Toast extends ToastOptions {
  id: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: {
    success: (message: string, options?: Partial<ToastOptions>) => void;
    error: (message: string, options?: Partial<ToastOptions>) => void;
    warning: (message: string, options?: Partial<ToastOptions>) => void;
    info: (message: string, options?: Partial<ToastOptions>) => void;
  };
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// Toast config
const toastConfig: Record<
  ToastType,
  { icon: string; iconColor: string; bgColor: string }
> = {
  success: {
    icon: IconNames.checkCircle,
    iconColor: 'text-success-text',
    bgColor: 'bg-success-bg',
  },
  error: {
    icon: IconNames.cancel,
    iconColor: 'text-danger-text',
    bgColor: 'bg-danger-bg',
  },
  warning: {
    icon: IconNames.warning,
    iconColor: 'text-warning-text',
    bgColor: 'bg-warning-bg',
  },
  info: {
    icon: IconNames.info,
    iconColor: 'text-brand-primary',
    bgColor: 'bg-brand-light',
  },
};

// Toast Item Component
function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const config = toastConfig[toast.type];
  const dismissible = toast.dismissible !== false;

  return (
    <div
      className={cn(
        // Base styles
        'flex items-center gap-3 px-4 py-3',
        'rounded-2xl',
        'shadow-[var(--shadow-md)]',
        'backdrop-blur-md',
        // Animation
        'animate-slide-down',
        // Background
        config.bgColor
      )}
      role="alert"
    >
      {/* Icon */}
      <Icon
        name={config.icon}
        filled
        size="md"
        className={config.iconColor}
      />

      {/* Message */}
      <p className="flex-1 text-[14px] font-medium text-text-primary">
        {toast.message}
      </p>

      {/* Dismiss button */}
      {dismissible && (
        <button
          onClick={() => onDismiss(toast.id)}
          className={cn(
            'p-1 rounded-full',
            'hover:bg-black/5',
            'transition-colors duration-[var(--duration-fast)]'
          )}
          aria-label="Dismiss"
        >
          <Icon name={IconNames.close} size="sm" className="text-text-secondary" />
        </button>
      )}
    </div>
  );
}

// Toast Provider
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (options: ToastOptions & { type: ToastType }) => {
      const id = Math.random().toString(36).substring(2, 9);
      const duration = options.duration ?? 3000;

      const newToast: Toast = {
        id,
        message: options.message,
        type: options.type,
        duration,
        dismissible: options.dismissible,
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss
      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [dismissToast]
  );

  const toast: ToastContextValue['toast'] = {
    success: (message, options) =>
      addToast({ message, type: 'success', ...options }),
    error: (message, options) =>
      addToast({ message, type: 'error', ...options }),
    warning: (message, options) =>
      addToast({ message, type: 'warning', ...options }),
    info: (message, options) =>
      addToast({ message, type: 'info', ...options }),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container */}
      <div
        className={cn(
          'fixed top-[calc(var(--header-height)+8px)] left-0 right-0 z-[100]',
          'flex flex-col items-center gap-2',
          'px-4 pointer-events-none'
        )}
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto w-full max-w-md">
            <ToastItem toast={t} onDismiss={dismissToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Hook to use toast
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}

export { ToastContext };
