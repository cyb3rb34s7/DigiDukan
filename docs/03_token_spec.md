---
title: Design Tokens Specification
version: 2.1
status: complete
created: 2025-01-10
updated: 2025-01-10
source: DESIGN_DECK.md
---

# Design Tokens Specification

Machine-readable design tokens for Munafa OS v2.1.

## Color Tokens

### Brand Palette

```css
:root {
  /* Brand Palette */
  --color-brand-primary: #4F46E5;       /* Electric Indigo */
  --color-brand-dark:    #3730A3;       /* Deep Violet */
  --color-brand-light:   #E0E7FF;       /* Soft Lavender */
  --color-brand-gradient: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
}
```

### Background Layers

```css
:root {
  /* Background Layers */
  --color-canvas:        #F8F9FD;       /* Cloud White (App BG) */
  --color-surface:       #FFFFFF;       /* Pure White (Cards) */
  --color-surface-glass: rgba(255, 255, 255, 0.95); /* Navigation Dock */
}
```

### Typography Colors

```css
:root {
  /* Typography / Content */
  --color-text-primary:   #1E293B;      /* Ink Black */
  --color-text-secondary: #64748B;      /* Slate Grey */
  --color-text-disabled:  #CBD5E1;      /* Light Grey */
  --color-text-on-brand:  #FFFFFF;      /* White text on Primary buttons */
}
```

### Semantic Colors (Traffic Lights)

```css
:root {
  /* Success (Safe/Full) */
  --color-success-bg:     #ECFDF5;      /* Mint Jelly */
  --color-success-text:   #059669;      /* Emerald */
  --color-success-bar:    #10B981;      /* Graphic Elements */

  /* Warning (Low Stock) */
  --color-warning-bg:     #FFFBEB;      /* Lemon Drop */
  --color-warning-text:   #B45309;      /* Amber */
  --color-warning-bar:    #F59E0B;

  /* Danger (Empty/Loss) */
  --color-danger-bg:      #FFF1F2;      /* Rose Petal */
  --color-danger-text:    #E11D48;      /* Crimson */
  --color-danger-bar:     #F43F5E;
}
```

### Borders & Dividers

```css
:root {
  /* Borders & Dividers */
  --color-border-subtle:  #E2E8F0;
  --color-border-focus:   #6366F1;
}
```

## Typography Tokens

```css
:root {
  --font-family-base:    'Manrope', system-ui, sans-serif;

  /* Scale */
  --text-size-hero:      36px; /* Total Value */
  --text-size-h1:        28px; /* Page Titles */
  --text-size-h2:        20px; /* Card Titles */
  --text-size-body-lg:   18px; /* Primary inputs/list items */
  --text-size-body:      16px; /* Standard text */
  --text-size-caption:   12px; /* Labels/Meta */

  /* Weights */
  --font-weight-regular: 500;
  --font-weight-bold:    700;
  --font-weight-heavy:   800; /* Prices only */

  /* Line Heights */
  --line-height-tight:   1.2;
  --line-height-base:    1.5;
}
```

## Spacing Tokens

```css
:root {
  /* Spacing Scale (4px grid) */
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  32px;
  --space-2xl: 48px;

  /* Touch Targets */
  --touch-min-height: 44px;
  --touch-target-lg:  56px;
}
```

## Shape Tokens

```css
:root {
  /* Radius (Squircles) */
  --radius-sm:   12px; /* Chips */
  --radius-md:   16px; /* Buttons, Inputs */
  --radius-lg:   24px; /* Cards, Modals */
  --radius-full: 9999px; /* Pills */

  /* Shadows */
  --shadow-xs:   0 4px 6px -1px rgba(0,0,0,0.05);
  --shadow-md:   0 10px 15px -3px rgba(0,0,0,0.08); /* Standard Card */
  --shadow-xl:   0 25px 50px -12px rgba(99, 102, 241, 0.25); /* Primary Actions */
  --shadow-glass: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
}
```

## Motion Tokens

```css
:root {
  --motion-ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Bouncy */
  --motion-ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);            /* Standard */

  --duration-fast:   150ms; /* Micro-interactions (clicks) */
  --duration-normal: 300ms; /* Hover, Fade */
  --duration-slow:   500ms; /* Page Transitions */
}
```

## Tailwind Mapping

Map tokens to Tailwind via `@theme inline` in globals.css:

```css
@theme inline {
  /* Colors */
  --color-brand: #4F46E5;
  --color-brand-dark: #3730A3;
  --color-brand-light: #E0E7FF;
  --color-canvas: #F8F9FD;
  --color-surface: #FFFFFF;

  /* Semantic */
  --color-success: #059669;
  --color-warning: #B45309;
  --color-danger: #E11D48;

  /* Radius */
  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 24px;

  /* Shadows */
  --shadow-card: 0 10px 15px -3px rgba(0,0,0,0.08);
  --shadow-button: 0 25px 50px -12px rgba(99, 102, 241, 0.25);
  --shadow-glass: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
}
```

## Usage Examples

### Button Primary
```jsx
<button className="
  bg-gradient-to-br from-brand to-violet-500
  text-white font-bold
  h-14 px-6 rounded-2xl
  shadow-xl
  active:scale-95
  transition-transform duration-fast
">
  PAKKA KARO
</button>
```

### Card ProductBubble
```jsx
<div className="
  bg-surface rounded-3xl shadow-card
  p-4
  hover:border hover:border-brand-light
  transition-all duration-normal
">
  {/* content */}
</div>
```

### Input Focus State
```jsx
<input className="
  bg-slate-100 rounded-2xl
  focus:bg-white focus:border-2 focus:border-indigo-500 focus:shadow-md
  transition-all duration-fast
" />
```

### Glass Navigation
```jsx
<nav className="
  bg-white/95 backdrop-blur-md
  shadow-glass
  border-t border-slate-200/50
">
  {/* nav items */}
</nav>
```

## Token File Location

Create at: `/tokens/tokens.css`

Import in: `app/globals.css` via `@import '../tokens/tokens.css';`
