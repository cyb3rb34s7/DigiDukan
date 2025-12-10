---
title: Iconography Specification
version: 2.1
status: complete
created: 2025-01-10
updated: 2025-01-10
source: DESIGN_DECK.md Section 7
---

# Iconography — Material Symbols Rounded

**Library:** Material Symbols Rounded (via @iconify/react)
**Delivery:** `@iconify/react` package
**Purpose:** High readability, friendly curves, mobile-first clarity

## Icon Style & Visual Language

Material Symbols Rounded were chosen because they:
- Match the rounded, tactile UI design of Munafa OS
- Maintain readability on small screens for Kirana owners
- Support filled, outlined styles
- Scale well at both 24px and 32px
- Offer a huge icon library (retail, finance, navigation, POS)
- Provide unmatched clarity under bright lighting conditions

## Icon Rendering Rules

### Grid & Dimensions
- **Icon grid:** 24 × 24 px
- **Rendered sizes:**
  - Navigation icons: **24px**
  - Action icons: **28–32px**
  - FAB icons: **32–36px**
- **Touch target:** Minimum **44 × 44 px**

### Stroke / Fill Logic
- **Outlined** → Neutral, inactive
- **Filled** → Active, selected, semantic states

## Migration Mapping

### Navigation Icons

| Current (Lucide) | Material Symbol | Usage |
|------------------|-----------------|-------|
| `Home` | `material-symbols:home-rounded` | Home tab |
| `Package` | `material-symbols:inventory-2-rounded` | Inventory tab |
| `Plus` | `material-symbols:add-circle-rounded` | Add tab |
| `Settings` | `material-symbols:settings-rounded` | Settings tab |

**Active/Inactive States:**
- **Inactive:** Outlined variant, color `#94A3B8`
- **Active:** Filled variant, color `var(--color-brand-primary)`

### Status & Network Icons

| Current (Lucide) | Material Symbol | Usage |
|------------------|-----------------|-------|
| `Wifi` | `material-symbols:wifi-rounded` | Online status |
| `WifiOff` | `material-symbols:wifi-off-rounded` | Offline status |

### Action Icons

| Current (Lucide) | Material Symbol | Usage |
|------------------|-----------------|-------|
| `Search` | `material-symbols:search-rounded` | Search input |
| `Clock` | `material-symbols:schedule-rounded` | Recent items |
| `Save` | `material-symbols:save-rounded` | Save button |
| `ArrowLeft` | `material-symbols:arrow-back-rounded` | Back navigation |
| `Edit2` | `material-symbols:edit-rounded` | Edit button |
| `Trash2` | `material-symbols:delete-rounded` | Delete button |
| `Copy` | `material-symbols:content-copy-rounded` | Copy action |
| `Check` | `material-symbols:check-rounded` | Confirm/success |
| `X` | `material-symbols:close-rounded` | Close/dismiss |

### Feedback Icons

| Current (Lucide) | Material Symbol | Style | Color |
|------------------|-----------------|-------|-------|
| `CheckCircle` | `material-symbols:check-circle-rounded` | Filled | Green |
| `XCircle` | `material-symbols:cancel-rounded` | Filled | Red |
| `AlertTriangle` | `material-symbols:warning-rounded` | Filled | Amber |
| `Info` | `material-symbols:info-rounded` | Outlined | Blue |

### Settings Page Icons

| Current (Lucide) | Material Symbol | Usage |
|------------------|-----------------|-------|
| `Percent` | `material-symbols:percent-rounded` | Margin setting |
| `Globe` | `material-symbols:language-rounded` | Language setting |
| `Info` | `material-symbols:info-rounded` | App info |

### Stock Status Icons (New)

| Status | Icon | Style | Color |
|--------|------|-------|-------|
| OK | `material-symbols:check-circle-rounded` | Filled | `--color-success-bar` |
| LOW | `material-symbols:warning-rounded` | Filled | `--color-warning-bar` |
| EMPTY | `material-symbols:cancel-rounded` | Filled | `--color-danger-bar` |

### Quick Action Icons

| Action | Icon | Style |
|--------|------|-------|
| Add Item | `material-symbols:add-circle-rounded` | Filled |
| Restock | `material-symbols:inventory-rounded` | Filled |
| Sales | `material-symbols:receipt-long-rounded` | Filled |
| Categories | `material-symbols:category-rounded` | Filled |

## Icon Component Implementation

### File: `components/munafa/Icon.tsx`

```tsx
import { Icon as IconifyIcon } from '@iconify/react';

interface IconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  filled?: boolean;
  className?: string;
}

const sizes = {
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
};

export function Icon({
  name,
  size = 'md',
  filled = false,
  className
}: IconProps) {
  // Material Symbols naming: add -outline suffix for outlined
  const iconName = filled
    ? `material-symbols:${name}-rounded`
    : `material-symbols:${name}-outline-rounded`;

  return (
    <IconifyIcon
      icon={iconName}
      width={sizes[size]}
      height={sizes[size]}
      className={className}
    />
  );
}
```

### Usage Examples

```tsx
// Navigation (active)
<Icon name="home" filled className="text-brand" />

// Navigation (inactive)
<Icon name="home" className="text-slate-400" />

// Action button
<Icon name="add-circle" size="lg" filled />

// Feedback toast
<Icon name="check-circle" filled className="text-success" />
```

## Product Letter Avatars

Since product-specific icons don't exist, use Letter Avatars:

```tsx
function ProductAvatar({ name, status }: { name: string; status: 'OK' | 'LOW' | 'EMPTY' }) {
  const bgColors = {
    OK: 'bg-success-bg',
    LOW: 'bg-warning-bg',
    EMPTY: 'bg-danger-bg',
  };

  return (
    <div className={`
      w-10 h-10 rounded-full
      ${bgColors[status]}
      flex items-center justify-center
      text-lg font-bold
    `}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
```

## Dark Mode Icon Behavior

For future dark mode support:
- **Outlined Icons:** Switch to `#CBD5E1`
- **Filled Icons:** Use pure white or bright semantic colors
- Reduce shadows → use subtle outer glows

## Universal Icon Rules

1. **Never mix icon families** (Material-only rule)
2. **Filled = active or high emphasis**
3. **Outlined = inactive or neutral**
4. Icons must align to a **24px grid**
5. Icon + label spacing = **8px**
6. All interactive icons MUST follow **44px minimum touch target**
7. Icons should never overpower text; hierarchy = text-first, icon-second
