/**
 * MeshHeader Component - Munafa OS
 * Gradient header with glass effect
 */

'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon, IconNames } from './Icon';
import { useTranslation } from '@/lib/contexts/LanguageContext';

export interface MeshHeaderProps {
  /** Page title */
  title?: string;
  /** Show online/offline status */
  showStatus?: boolean;
  /** Is device online */
  isOnline?: boolean;
  /** Additional content (e.g., back button) */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function MeshHeader({
  title,
  showStatus = true,
  isOnline = true,
  children,
  className,
}: MeshHeaderProps) {
  const { t } = useTranslation();

  return (
    <header
      className={cn(
        // Positioning
        'sticky top-0 z-40',
        // Size
        'h-[var(--header-height)]',
        // Dark gradient background
        'bg-gradient-to-r from-[#1C1C1C] to-[#262626]',
        // Text
        'text-white',
        className
      )}
    >
      <div className="flex items-center justify-between h-full px-4 max-w-md mx-auto">
        {/* Left: Children (back button) or Title */}
        <div className="flex items-center gap-3">
          {children}
          {title && (
            <h1 className="text-[20px] font-bold truncate">
              {title}
            </h1>
          )}
        </div>

        {/* Right: Online status */}
        {showStatus && (
          <div className="flex items-center gap-1.5">
            <Icon
              name={isOnline ? IconNames.wifi : IconNames.wifiOff}
              size="sm"
              className={cn(
                'transition-colors duration-[var(--duration-fast)]',
                isOnline ? 'text-white' : 'text-white/60'
              )}
            />
            <span className="text-[12px] font-medium">
              {isOnline ? t('header.online') : t('header.offline')}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}

export default MeshHeader;
