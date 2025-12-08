# Frontend Technical Design Document (TDD)
## Kirana Digital Dukaan - Web Application

**Version**: 1.0  
**Date**: December 8, 2025  
**Author**: Factory AI - Droid  
**Status**: Implementation Phase

---

## 1. Overview

### 1.1 Purpose
Build a mobile-first, PWA-ready frontend for Kirana Digital Dukaan that feels like a native app, not a website. The UI must be optimized for shopkeepers who need speed, clarity, and zero friction in daily operations.

### 1.2 Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks + Server Actions (no Redux needed)
- **Search**: Fuse.js (client-side fuzzy search)
- **Fonts**: Inter (English) + Noto Sans Devanagari (Hindi)
- **Icons**: Lucide React (tree-shakeable, lightweight)
- **Forms**: React Hook Form + Zod validation

---

## 2. Design System

### 2.1 Color Palette (Tailwind Classes)

```typescript
colors: {
  // Brand & Primary Actions
  primary: 'bg-blue-700',           // Professional, Trust
  action: 'bg-indigo-600',          // Interactive elements
  
  // Semantic Colors (Traffic Light System)
  success: 'bg-emerald-600',        // Stock OK, Profit
  successText: 'text-emerald-700',
  warning: 'bg-amber-400',          // Stock LOW
  warningText: 'text-amber-800',
  danger: 'bg-rose-600',            // Stock EMPTY, Loss
  dangerText: 'text-rose-700',
  
  // Neutrals
  background: 'bg-slate-50',        // Base (not pure white)
  surface: 'bg-white',              // Cards
  text: 'text-slate-900',           // Primary text
  textMuted: 'text-slate-600',      // Secondary text
  textDisabled: 'text-slate-400',   // Disabled state
  
  // Borders & Dividers
  border: 'border-slate-200',
  divider: 'border-slate-100',
}
```

### 2.2 Typography

```typescript
fontSize: {
  'xs': '0.75rem',     // 12px - Captions
  'sm': '0.875rem',    // 14px - Secondary text
  'base': '1rem',      // 16px - Body (default)
  'lg': '1.125rem',    // 18px - Base for this app
  'xl': '1.25rem',     // 20px - Headings
  '2xl': '1.5rem',     // 24px - Prices
  '3xl': '1.875rem',   // 30px - Selling Price (hero)
  '4xl': '2.25rem',    // 36px - Large prices
}

fontWeight: {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
}
```

### 2.3 Spacing (Touch Targets)

```typescript
// Minimum touch target: 44x44px (WCAG AAA)
spacing: {
  'touch-min': '2.75rem',  // 44px
  'touch-lg': '3.5rem',    // 56px
  'nav-height': '4rem',    // 64px (bottom nav)
  'header-height': '3.5rem', // 56px (top bar)
}
```

### 2.4 Border Radius (Smooth Corners)

```typescript
borderRadius: {
  'none': '0',
  'sm': '0.25rem',     // 4px
  'DEFAULT': '0.5rem', // 8px - Most UI elements
  'md': '0.75rem',     // 12px - Cards
  'lg': '1rem',        // 16px - Modals
  'xl': '1.5rem',      // 24px - Large cards
  'full': '9999px',    // Pills, search bar
}
```

### 2.5 Shadows (Elevation)

```typescript
boxShadow: {
  'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  'DEFAULT': '0 2px 8px 0 rgb(0 0 0 / 0.08)',
  'md': '0 4px 12px 0 rgb(0 0 0 / 0.1)',
  'lg': '0 8px 24px 0 rgb(0 0 0 / 0.12)',
  'float': '0 12px 32px 0 rgb(0 0 0 / 0.15)', // FABs
}
```

---

## 3. Architecture

### 3.1 Folder Structure

```
app/
├── (shell)/               # Layout with bottom nav
│   ├── layout.tsx         # Shell wrapper
│   ├── home/             # Screen 1: Search & Price Check
│   │   └── page.tsx
│   ├── inventory/        # Screen 2: Mandi List
│   │   └── page.tsx
│   ├── add/              # Screen 3: Add Product
│   │   └── page.tsx
│   └── settings/         # Screen 4: Settings
│       └── page.tsx
├── product/
│   └── [id]/             # Product Detail Modal/Page
│       ├── page.tsx
│       └── edit/page.tsx
└── actions/              # Already created (Server Actions)

components/
├── ui/                   # Reusable UI primitives
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Toast.tsx
│   ├── Skeleton.tsx
│   └── BottomNav.tsx
├── layout/
│   ├── AppShell.tsx
│   ├── Header.tsx
│   └── BottomNav.tsx
├── home/
│   ├── SearchBar.tsx
│   ├── RecentlyChecked.tsx
│   └── SearchResults.tsx
├── product/
│   ├── ProductCard.tsx
│   ├── StockButtons.tsx
│   └── PriceDisplay.tsx
├── forms/
│   ├── ProductForm.tsx
│   ├── UnitChips.tsx
│   └── PriceInputs.tsx
└── inventory/
    ├── FilterTabs.tsx
    ├── InventoryList.tsx
    └── MandiListButton.tsx

lib/
├── hooks/                # Custom React hooks
│   ├── useSearch.ts      # Fuse.js wrapper
│   ├── useToast.ts       # Toast notifications
│   ├── useLocalStorage.ts # Persist recent items
│   └── useOnline.ts      # Online/offline detection
└── utils/
    ├── formatters.ts     # Currency, dates
    ├── constants.ts      # Units, brands, etc.
    └── cn.ts            # classnames utility

public/
├── manifest.json         # PWA manifest
├── icons/               # App icons (various sizes)
└── service-worker.js    # Offline support
```

### 3.2 State Management Strategy

**No Redux/Zustand needed** - Keep it simple:

1. **Server State**: Server Actions (already created)
2. **Local State**: React `useState` for UI interactions
3. **Persistent State**: `localStorage` for:
   - Recently checked items
   - Search history
   - User preferences (language, margin)
4. **Search State**: Fuse.js client-side (data fetched once)

### 3.3 Data Flow

```
┌─────────────┐
│  Component  │
└──────┬──────┘
       │
       ├─ Server Action → PostgreSQL (via Prisma)
       │  (mutations)
       │
       ├─ Fuse.js Search → Client-side filtering
       │  (fast, no network)
       │
       └─ localStorage → Persist recent items
          (offline access)
```

---

## 4. Screen Specifications

### 4.1 Screen 1: Home (Search & Price Check)

**Route**: `/` or `/home`

**Components**:
- `SearchBar` (auto-focus, debounced)
- `RecentlyChecked` (from localStorage)
- `SearchResults` (Fuse.js powered)
- `QuickActions` (Low Stock count, etc.)

**API Integration**:
```typescript
// Fetch all products once for Fuse.js
const products = await searchProducts()

// When item selected, fetch full details
const product = await getProductById({ id })
```

**Features**:
- Auto-focus on search input on mount
- Debounce search at 300ms
- Show skeleton while loading
- Voice input button (placeholder)
- Barcode scanner button (placeholder)

### 4.2 Screen 2: Product Detail

**Route**: `/product/[id]`

**Components**:
- `ProductCard` (buy/sell prices, margin)
- `StockButtons` (OK/LOW/EMPTY)
- `EditButton`

**API Integration**:
```typescript
// Get product details
const product = await getProductById({ id })

// Update stock status
await updateStockStatus({ productId, status })
```

**Features**:
- Large selling price (text-4xl)
- Tap stock buttons → instant toast feedback
- Calculate and show margin %
- Smooth transitions on state changes

### 4.3 Screen 3: Add/Edit Product

**Route**: `/add` or `/product/[id]/edit`

**Components**:
- `ProductForm` (React Hook Form)
- `UnitChips` (kg, g, L, mL, pcs)
- `PriceInputs` (auto-calculate margin)
- `BrandSuggestions` (horizontal scroll)

**API Integration**:
```typescript
// Add new product
await addProduct({ ...data })

// Update existing
await updateProduct({ id, ...data })

// Get settings for default margin
const settings = await getSettings()
```

**Features**:
- Real-time margin calculation
- Unit chips with active state
- inputmode="decimal" for numeric keyboards
- "Save & Add New" button
- Form validation with error messages

### 4.4 Screen 4: Inventory (Mandi List)

**Route**: `/inventory`

**Components**:
- `FilterTabs` (ALL/LOW/EMPTY)
- `InventoryList` (color-coded borders)
- `MandiListButton` (Generate & Copy)

**API Integration**:
```typescript
// Get low stock items
const lowStock = await getLowStockItems()

// Generate shopping list
const mandi = await generateMandiList()
```

**Features**:
- Segmented control tabs
- Left border color coding (border-l-4)
- Floating action button (fixed bottom)
- Copy to clipboard with success toast

### 4.5 Screen 5: Settings

**Route**: `/settings`

**Components**:
- Margin slider/input
- Language toggle (Hindi/English)
- Export data button
- App version info

**API Integration**:
```typescript
// Get current settings
const settings = await getSettings()

// Update settings
await updateSettings({ defaultMargin, language })
```

---

## 5. Component Library

### 5.1 Button Component

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
}

// Features:
// - Active state: active:scale-95
// - Loading spinner
// - Icon support
// - Accessibility: focus-visible:ring-2
```

### 5.2 Input Component

```typescript
interface InputProps {
  type: 'text' | 'number' | 'tel' | 'search'
  label?: string
  placeholder?: string
  error?: string
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
  inputMode?: 'text' | 'decimal' | 'numeric'
  autoFocus?: boolean
}

// Features:
// - Floating label
// - Error state styling
// - Icon support (left/right)
// - Auto-focus capability
```

### 5.3 Toast Component

```typescript
interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  position?: 'top' | 'bottom'
}

// Features:
// - Auto-dismiss after duration
// - Slide-in animation
// - Queue multiple toasts
// - Accessible (role="alert")
```

---

## 6. Performance Optimizations

### 6.1 Loading Strategies

- **Search**: Fetch all products once, cache in memory
- **Images**: Use Next.js `<Image>` with lazy loading (future feature)
- **Code Splitting**: Dynamic imports for heavy components
- **Debouncing**: 300ms for search input

### 6.2 Caching

```typescript
// Client-side cache
- Recent items: localStorage (max 10)
- Search results: React state
- Product list: Memory cache (refresh on mount)

// Server-side
- Already handled by Server Actions
```

### 6.3 Bundle Size

- Tree-shake Lucide icons (import individually)
- Use Tailwind purge in production
- Minimize third-party dependencies

---

## 7. Accessibility (A11y)

### 7.1 WCAG AAA Compliance

- Minimum touch target: 44x44px
- Color contrast ratio: 7:1 (text on background)
- Focus indicators: ring-2 ring-blue-500
- Semantic HTML: proper heading hierarchy
- ARIA labels: for icons and buttons

### 7.2 Keyboard Navigation

- Tab order follows visual flow
- Escape key closes modals
- Enter key submits forms
- Arrow keys navigate lists

### 7.3 Screen Reader Support

```tsx
<button aria-label="Update stock to low">
  <AlertCircle className="w-6 h-6" />
</button>
```

---

## 8. Progressive Web App (PWA)

### 8.1 Manifest Configuration

```json
{
  "name": "Kirana Digital Dukaan",
  "short_name": "Dukaan",
  "description": "Inventory & Price Tracker",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f8fafc",
  "theme_color": "#1d4ed8",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 8.2 Service Worker Strategy

- **Cache First**: Static assets (fonts, icons)
- **Network First**: API calls (Server Actions)
- **Offline Fallback**: Show cached products

---

## 9. Testing Strategy

### 9.1 Manual Testing Checklist

- [ ] All screens render on mobile (375px width)
- [ ] Search works with Hindi aliases
- [ ] Form validation shows errors
- [ ] Toast notifications appear/dismiss
- [ ] Stock status updates instantly
- [ ] Mandi list copies to clipboard
- [ ] Settings persist after page refresh
- [ ] Offline indicator shows when disconnected

### 9.2 Browser Testing

- Chrome Mobile (Primary)
- Safari iOS
- Firefox Android
- Samsung Internet

---

## 10. Future Enhancements

### 10.1 Phase 2 Features

- Barcode scanner (use `html5-qrcode`)
- Voice input (Web Speech API)
- Push notifications (low stock alerts)
- Analytics dashboard
- Multi-user support with authentication

### 10.2 Performance Metrics Goals

- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Lighthouse Score: > 90

---

## 11. Implementation Timeline

### Week 1: Core Screens
- Day 1-2: Setup + UI Components
- Day 3-4: Home + Search
- Day 5: Product Detail

### Week 2: Forms & Inventory
- Day 1-2: Add/Edit Form
- Day 3: Inventory List
- Day 4: Settings
- Day 5: Polish + Testing

### Week 3: PWA & Polish
- Day 1-2: PWA Configuration
- Day 3: Accessibility audit
- Day 4-5: Bug fixes + Performance

---

## 12. Success Criteria

✅ **Functionality**: All CRUD operations work
✅ **Performance**: < 2s load time on 3G
✅ **Accessibility**: WCAG AA compliance
✅ **UX**: Feels like native app (smooth, responsive)
✅ **Mobile**: Perfect on 375px viewport
✅ **Offline**: Basic functionality without internet

---

**Document Status**: Ready for Implementation
**Next Action**: Begin with UI component library and Tailwind configuration
