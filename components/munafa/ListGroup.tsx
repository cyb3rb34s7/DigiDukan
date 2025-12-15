/**
 * ListGroup Component - Munafa OS
 * iOS-style grouped list with items
 */

'use client';

import { forwardRef, type HTMLAttributes, type ReactNode, Children, cloneElement, isValidElement } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { Icon } from './Icon';

// ============================================
// ListGroup Container
// ============================================

export interface ListGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Section title above the group */
  title?: string;
  /** List items */
  children: ReactNode;
}

export const ListGroup = forwardRef<HTMLDivElement, ListGroupProps>(
  ({ title, children, className, ...props }, ref) => {
    // Count children to know which is last
    const childArray = Children.toArray(children);
    const childCount = childArray.length;

    return (
      <div className={cn('space-y-2', className)} ref={ref} {...props}>
        {/* Section title */}
        {title && (
          <h3 className="text-[13px] font-semibold text-text-secondary uppercase tracking-wide px-4">
            {title}
          </h3>
        )}

        {/* Group container with subtle gradient */}
        <div className="section-gradient bg-surface rounded-md shadow-sm overflow-hidden border border-brand-primary/5">
          {Children.map(childArray, (child, index) => {
            // Only add isLast prop to ListItem components, not other elements
            if (isValidElement(child) && child.type === ListItem) {
              return cloneElement(child as React.ReactElement<ListItemProps>, {
                isLast: index === childCount - 1,
              });
            }
            return child;
          })}
        </div>
      </div>
    );
  }
);

ListGroup.displayName = 'ListGroup';

// ============================================
// ListItem
// ============================================

export interface ListItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Primary text */
  title: string;
  /** Secondary text below title */
  subtitle?: string;
  /** Content on the left (icon, image) */
  leading?: ReactNode;
  /** Content on the right (price, badge) */
  trailing?: ReactNode;
  /** Show chevron arrow */
  showChevron?: boolean;
  /** Navigation href */
  href?: string;
  /** Is last item (no separator) - set automatically by ListGroup */
  isLast?: boolean;
}

export const ListItem = forwardRef<HTMLDivElement, ListItemProps>(
  (
    {
      title,
      subtitle,
      leading,
      trailing,
      showChevron = true,
      href,
      isLast = false,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const content = (
      <div
        ref={ref}
        className={cn(
          // Layout
          'flex items-center gap-3 px-4',
          // Touch target
          'min-h-[var(--touch-min-height)]',
          // Interactive states
          'transition-colors duration-[var(--duration-fast)]',
          'active:bg-input-bg',
          // Cursor
          (href || onClick) && 'cursor-pointer',
          className
        )}
        onClick={onClick}
        {...props}
      >
        {/* Leading content */}
        {leading && (
          <div className="shrink-0 text-text-secondary">
            {leading}
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0 py-3">
          <div className="flex items-center justify-between gap-2">
            {/* Title + Subtitle */}
            <div className="min-w-0 flex-1">
              <p className="text-[16px] font-medium text-text-primary truncate">
                {title}
              </p>
              {subtitle && (
                <p className="text-[14px] text-text-secondary truncate">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Trailing content + Chevron */}
            <div className="flex items-center gap-2 shrink-0">
              {trailing}
              {showChevron && (
                <Icon
                  name="chevron-right"
                  size="sm"
                  className="text-text-disabled"
                />
              )}
            </div>
          </div>

          {/* Separator (except for last item) */}
          {!isLast && (
            <div className="absolute bottom-0 left-4 right-0 h-px bg-border-subtle" />
          )}
        </div>
      </div>
    );

    // Wrap in Link if href provided
    if (href) {
      return (
        <Link href={href} className="block relative">
          {content}
        </Link>
      );
    }

    return <div className="relative">{content}</div>;
  }
);

ListItem.displayName = 'ListItem';

// Attach ListItem to ListGroup for compound component pattern
export default Object.assign(ListGroup, { Item: ListItem });
