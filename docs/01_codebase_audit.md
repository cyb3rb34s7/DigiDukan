---
title: Codebase Audit
version: 1.0
status: complete
created: 2025-01-10
updated: 2025-01-10
---

# Codebase Audit — Current UI Implementation

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.7 | App Router framework |
| React | 19.2.0 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling (PostCSS plugin) |
| Lucide React | 0.556.0 | Icons |
| Fuse.js | 7.1.0 | Fuzzy search |
| React Hook Form | 7.68.0 | Form handling |
| Zod | 3.25.76 | Validation |

## Component Inventory

### Layout Components (`/components/layout/`)

#### Header.tsx
- **Purpose:** Top bar with title and online/offline indicator
- **Props:** None (uses hooks internally)
- **Features:**
  - Fixed sticky positioning
  - Online/offline WiFi icon status
  - Hindi title "मेरी दुकान"
- **Migration:** Replace with MeshHeader (gradient)

#### BottomNav.tsx
- **Purpose:** Bottom navigation dock
- **Props:** None (uses pathname)
- **Features:**
  - 4 nav items: Home, Inventory, Add, Settings
  - Active state highlighting (blue-700)
  - Lucide icons: Home, Package, Plus, Settings
- **Migration:** Replace with NavDock (glass morphism)

#### AppShell.tsx
- **Purpose:** Layout wrapper combining Header + BottomNav
- **Props:** `children`
- **Migration:** Update to use new layout components

### UI Components (`/components/ui/`)

#### Button.tsx
- **Variants:** primary, secondary, success, danger, ghost
- **Sizes:** sm (2.5rem), md (2.75rem), lg (3.5rem)
- **Features:**
  - Icon support (left side)
  - Loading spinner state
  - Full width option
  - Focus ring per variant
  - Active scale animation
- **Migration:** Replace with gradient primary, update variants

#### Card.tsx
- **Props:** padding (none/sm/md/lg), shadow (none/sm/md/lg), className
- **Features:**
  - White background
  - Configurable padding/shadow
  - rounded-lg (12px)
- **Migration:** Increase radius to rounded-3xl (24px)

#### Input.tsx
- **Props:** label, error, icon, rightIcon, className, ...inputProps
- **Features:**
  - Label support
  - Error state (rose-500)
  - Left/right icon slots
  - Focus ring (blue-500)
- **Migration:** Update to rounded-2xl, new focus colors

#### Badge.tsx
- **Variants:** default, success, warning, danger
- **Features:**
  - Pill shape
  - Color-coded backgrounds
- **Migration:** Update colors to match new tokens

#### Toast.tsx
- **Types:** success, error, info, warning
- **Features:**
  - Fixed positioning
  - Auto-dismiss
  - Icon per type
  - Close button
- **Migration:** Update to glassmorphism style

#### Skeleton.tsx
- **Exports:** Skeleton, ProductCardSkeleton, ProductDetailSkeleton, InventoryListSkeleton
- **Features:**
  - Pulse animation
  - Pre-built loading patterns
- **Migration:** Update colors to new canvas/surface

## Page Structure

### Route Group: `(shell)/`

All pages wrapped in shell layout with Header + BottomNav.

| Route | File | Purpose |
|-------|------|---------|
| `/` | `page.tsx` | Home/Search (Fuse.js) |
| `/add` | `add/page.tsx` | Add new product |
| `/inventory` | `inventory/page.tsx` | Stock list + Mandi list |
| `/settings` | `settings/page.tsx` | App settings |
| `/product/[id]` | `product/[id]/page.tsx` | Product detail |
| `/product/[id]/edit` | `product/[id]/edit/page.tsx` | Edit product |

## Current Styling

### Color Palette (Tailwind classes used)

| Usage | Current Class | Hex |
|-------|---------------|-----|
| Primary | blue-700 | #1d4ed8 |
| Primary Hover | blue-800 | #1e40af |
| Success | emerald-600/700 | #059669/#047857 |
| Danger | rose-600 | #e11d48 |
| Warning | amber-500/600 | #f59e0b/#d97706 |
| Background | slate-50 | #f8fafc |
| Surface | white | #ffffff |
| Text Primary | slate-900 | #0f172a |
| Text Secondary | slate-600 | #475569 |
| Border | slate-200 | #e2e8f0 |

### Custom CSS Variables (globals.css)

```css
--font-size-base: 1.125rem (18px)
--spacing-touch-min: 2.75rem (44px)
--spacing-touch-lg: 3.5rem (56px)
--spacing-nav-height: 4rem (64px)
--spacing-header-height: 3.5rem (56px)
--shadow-float: 0 12px 32px 0 rgb(0 0 0 / 0.15)
--radius-md: 0.75rem (12px)
--radius-lg: 1rem (16px)
--radius-xl: 1.5rem (24px)
```

### Fonts

Currently using system fonts via CSS:
```css
font-family: var(--font-inter), var(--font-devanagari), system-ui, sans-serif
```

**Note:** Custom fonts not actually loaded — needs Manrope via next/font.

## Lucide Icons Used

| Icon | Location | Material Symbols Equivalent |
|------|----------|----------------------------|
| Home | BottomNav | `home` |
| Package | BottomNav, Inventory | `inventory_2` |
| Plus | BottomNav, Add | `add_circle` |
| Settings | BottomNav | `settings` |
| Wifi/WifiOff | Header | `wifi` / `wifi_off` |
| Search | Home | `search` |
| Clock | Home (recent) | `schedule` |
| Save | Forms | `save` |
| CheckCircle | Toast success | `check_circle` |
| XCircle | Toast error | `cancel` |
| AlertTriangle | Toast warning | `warning` |
| Info | Toast info | `info` |
| X | Toast close | `close` |
| Copy/Check | Inventory | `content_copy` / `check` |
| ArrowLeft | Product detail | `arrow_back` |
| Edit2 | Product detail | `edit` |
| Trash2 | Product detail | `delete` |
| Percent | Settings | `percent` |
| Globe | Settings | `language` |

## Server Actions

Located in `app/actions/`:
- `products.ts` — CRUD operations
- `stock.ts` — Stock status updates
- `settings.ts` — App settings

**Note:** These are NOT being modified in UI migration.

## Hooks

Located in `lib/hooks/`:
- `useToast.ts` — Toast notifications
- `useLocalStorage.ts` — Persistent client state
- `useOnline.ts` — Network status detection

## Utils

Located in `lib/utils/`:
- `cn.ts` — Class name merging (clsx + tailwind-merge)
- `formatters.ts` — Currency, size formatting
- `constants.ts` — Stock status config
- `errors.ts` — Error handling utilities
