/**
 * Munafa OS Component Library
 * Barrel export for all components
 */

// Core Components
export { Icon, IconNames, type IconProps, type IconName } from './Icon';
export { Button, type ButtonProps } from './Button';
export { Input, type InputProps } from './Input';
export { Card, type CardProps } from './Card';
export { Badge, type BadgeProps } from './Badge';
export { Chip, type ChipProps, type ChipOption } from './Chip';

// List Components
export { default as ListGroup, ListItem, type ListGroupProps, type ListItemProps } from './ListGroup';
export { StatCard, type StatCardProps } from './StatCard';

// Layout Components
export { NavDock, type NavDockProps, type NavItem } from './NavDock';
export { MeshHeader, type MeshHeaderProps } from './MeshHeader';

// Feedback Components
export { HealthBar, type HealthBarProps, type StockStatus } from './HealthBar';
export {
  ToastProvider,
  useToast,
  ToastContext,
  type ToastType,
  type ToastOptions,
} from './Toast';

// Theme Components
export { ThemeToggle, type ThemeToggleProps } from './ThemeToggle';
export { LanguageToggle, type LanguageToggleProps } from './LanguageToggle';

// App Shell Components
export { AppBar, type AppBarProps } from './AppBar';
export { HeroSection, type HeroSectionProps, type HeroStats } from './HeroSection';

// Inventory Components
export {
  InventorySummary,
  type InventorySummaryProps,
  type InventorySummaryCounts,
  type StockFilter,
} from './InventorySummary';
export { InventoryItem, type InventoryItemProps } from './InventoryItem';
export { FilterPills, type FilterPillsProps, type FilterOption } from './FilterPills';
export { MandiModal, type MandiModalProps } from './MandiModal';

// PWA Components
export { InstallPrompt } from './InstallPrompt';
export { ServiceWorkerRegistration } from './ServiceWorkerRegistration';
