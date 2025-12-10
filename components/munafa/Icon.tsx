/**
 * Icon Component - Material Symbols Rounded
 * Uses @iconify/react for icon rendering
 *
 * @example
 * <Icon name="home" filled />
 * <Icon name="search" size="lg" />
 */

'use client';

import { Icon as IconifyIcon } from '@iconify/react';
import { cn } from '@/lib/utils/cn';

export interface IconProps {
  /** Material Symbol name (without prefix) */
  name: string;
  /** Icon size preset */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Use filled variant (default: outlined) */
  filled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const sizes = {
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
};

/**
 * Get the full Iconify icon name for Material Symbols
 */
function getIconName(name: string, filled: boolean): string {
  // Material Symbols naming convention:
  // Filled: material-symbols:home
  // Outlined: material-symbols:home-outline
  const baseName = `material-symbols:${name}`;

  if (filled) {
    return baseName;
  }

  // Add -outline suffix for outlined variant
  return `${baseName}-outline`;
}

export function Icon({
  name,
  size = 'md',
  filled = false,
  className,
}: IconProps) {
  const iconName = getIconName(name, filled);
  const pixelSize = sizes[size];

  return (
    <IconifyIcon
      icon={iconName}
      width={pixelSize}
      height={pixelSize}
      className={cn('shrink-0', className)}
    />
  );
}

// Export common icon names for type safety
export const IconNames = {
  // Navigation
  home: 'home',
  inventory: 'inventory-2',
  add: 'add-circle',
  settings: 'settings',

  // Status
  wifi: 'wifi',
  wifiOff: 'wifi-off',

  // Actions
  search: 'search',
  clock: 'schedule',
  save: 'save',
  edit: 'edit',
  delete: 'delete',
  copy: 'content-copy',
  check: 'check',
  close: 'close',
  arrowBack: 'arrow-back',

  // Feedback
  checkCircle: 'check-circle',
  cancel: 'cancel',
  warning: 'warning',
  info: 'info',
  error: 'error',

  // Settings
  percent: 'percent',
  language: 'language',

  // Theme
  lightMode: 'light-mode',
  darkMode: 'dark-mode',

  // Product
  shoppingBag: 'shopping-bag',
  category: 'category',
  receipt: 'receipt-long',
} as const;

export type IconName = (typeof IconNames)[keyof typeof IconNames];
