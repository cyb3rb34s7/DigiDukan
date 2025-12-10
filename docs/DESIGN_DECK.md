# 📘 Munafa OS: Design System & Visual Specification

**Version:** 2.1 (Implementation Ready)
**Core Philosophy:** Store Wellness & "Peace of Mind"
**Target Audience:** High-speed retail owners (Kirana)

-----

## 🧭 1. Design Philosophy & Principles

### **The Core Vibe: "Store Wellness"**

We shift the mental model from "Data Entry" (Work) to **"Store Health Monitoring"** (Control). The UI must reassure the owner that their business is safe, tracked, and healthy.

### **Emotional Tone**

  * **Trustworthy:** Deep, royal colors signal financial accuracy.
  * **Calm:** Replaces "Alert Red" with "Soft Rose" to reduce anxiety.
  * **Spacious:** High whitespace reduces cognitive load during rush hours.
  * **Tactile:** Buttons and cards feel "squishy" and physical, inviting interaction.

### **UX Principles**

1.  **Don't Read, Scan:** Users understand stock status by **Color** and **Shape**, not text.
2.  **Thumb-First:** All primary actions (Save, Search, Nav) must be reachable with one thumb.
3.  **Conversational Entry:** Data entry feels like answering a question ("What arrived today?").
4.  **Zero Dead Ends:** Every screen has a clear "Next Step" or "Back" action.

-----

## 🎨 2. Design Tokens (The DNA)

*Machine-readable definitions for the entire system.*

### **2.1 Color Tokens**

```css
:root {
  /* Brand Palette */
  --color-brand-primary: #4F46E5;       /* Electric Indigo */
  --color-brand-dark:    #3730A3;       /* Deep Violet */
  --color-brand-light:   #E0E7FF;       /* Soft Lavender */
  --color-brand-gradient: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);

  /* Background Layers */
  --color-canvas:        #F8F9FD;       /* Cloud White (App BG) */
  --color-surface:       #FFFFFF;       /* Pure White (Cards) */
  --color-surface-glass: rgba(255, 255, 255, 0.95); /* Navigation Dock */

  /* Typography / Content */
  --color-text-primary:   #1E293B;      /* Ink Black */
  --color-text-secondary: #64748B;      /* Slate Grey */
  --color-text-disabled:  #CBD5E1;      /* Light Grey */
  --color-text-on-brand:  #FFFFFF;      /* White text on Primary buttons */

  /* Semantic System (Traffic Lights) */
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

  /* Borders & Dividers */
  --color-border-subtle:  #E2E8F0;
  --color-border-focus:   #6366F1;
}
```

### **2.2 Typography Tokens**

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

### **2.3 Spacing & Layout Tokens**

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

### **2.4 Shape & Depth Tokens**

```css
:root {
  /* Radius (Squirdles) */
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

### **2.5 Motion Tokens**

```css
:root {
  --motion-ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Bouncy */
  --motion-ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);            /* Standard */
  
  --duration-fast:   150ms; /* Micro-interactions (clicks) */
  --duration-normal: 300ms; /* Hover, Fade */
  --duration-slow:   500ms; /* Page Transitions */
}
```

-----

## 🔠 3. Component Naming & Architecture

*Standardized naming for consistency across design and code.*

**Format:** `Category.Component.Variant`

1.  **Actions:**

      * `Button.Primary` (Gradient bg)
      * `Button.Secondary` (White bg, shadow)
      * `Button.Ghost` (Transparent)
      * `Button.FAB` (Floating Action Button)
      * `Action.Icon` (Clickable icons)

2.  **Containers:**

      * `Card.ProductBubble` (Inventory item)
      * `Card.DashboardWidget` (Stats)
      * `Container.Page` (Screen wrapper)
      * `Container.GlassDock` (Bottom Nav)

3.  **Inputs:**

      * `Input.Text` (Standard)
      * `Input.Price` (Large text, numeric)
      * `Input.Chip` (Unit toggles)
      * `Input.SearchPill` (Floating search)

4.  **Feedback:**

      * `Indicator.HealthBar` (Stock level line)
      * `Badge.Status` (Text status pill)
      * `Toast.Notification`

-----

## 🪟 4. Component Specifications & States

### **A. Button.Primary (The "Pakka Karo" Button)**

  * **Visual:** `h-14`, `rounded-2xl`, Brand Gradient BG, White Text (Heavy).
  * **States:**
      * **Default:** Gradient opacity 100%, Shadow Level 4.
      * **Hover:** Scale 1.02, Shadow expands.
      * **Active (Pressed):** Scale 0.95, Brightness 90%. (Tactile feedback).
      * **Disabled:** Grey `#CBD5E1` BG, No Shadow, Cursor not-allowed.
      * **Loading:** Text hidden, Spinner centered white.

### **B. Card.ProductBubble (Inventory List Item)**

  * **Visual:** `rounded-3xl`, Pure White BG, Shadow Level 2.
  * **Layout:** Icon (Left) | Name + Health Bar (Mid) | Price (Right).
  * **States:**
      * **Default:** White BG.
      * **Hover/Focus:** Border `1px solid #E0E7FF`.
      * **Active (Tap):** Scale 0.98.
      * **Edge Case - Long Name:** Text Truncate (`...`) after 1 line.
      * **Edge Case - Huge Price:** Font shrinks from `24px` to `20px` if \> 6 digits.

### **C. Input.Price (Data Entry)**

  * **Visual:** `rounded-2xl`, Light Grey BG (`#F1F5F9`), Huge Text.
  * **States:**
      * **Default:** Border `1px solid transparent`.
      * **Focus:** BG White, Border `2px solid #6366F1`, Shadow Level 2.
      * **Error:** Border `2px solid #E11D48`, BG `#FFF1F2`. Shake animation.
      * **Filled:** Text color `#1E293B` (Heavy).

### **D. Indicator.HealthBar**

  * **Visual:** `h-1.5`, rounded-full track (`#F1F5F9`).
  * **Logic:**
      * **Full:** Green Bar (100% width).
      * **Low:** Amber Bar (40% width).
      * **Empty:** Rose Dot (8px width).

-----

## 🧱 5. Layout & Spacing Rules

### **General Layout**

  * **Mobile (Default):** Single column, 100% width. `px-4` or `px-6`.
  * **Desktop/Tablet:** Constrained center column. Max-width `480px`. Background outside this column is dimmed/blurred.

### **Edge Cases**

  * **Empty Lists:** Show a "Clean State" illustration (e.g., A happy empty box) + "Add New Item" button.
  * **Network Error:** A persistent thin banner under the header (Rose BG) saying "Working Offline". Use offline cached data.
  * **List Overflow:** Infinite scroll. Load 20 items at a time. Skeleton loader for next batch.

-----

## 📢 6. Feedback System (Toasts & Alerts)

### **A. Toasts (Snackbars)**

  * **Position:** Fixed top, floating under header. `z-index: 50`.
  * **Shape:** `rounded-2xl`, Glassmorphism black or white.
  * **Animation:** Slide down from top (`300ms spring`). Auto-dismiss 3s.
  * **Types:**
      * **Success:** "Saved\!" (Green Icon + White text).
      * **Error:** "Failed." (Red Icon + White text).
      * **Info:** "Offline Mode." (Blue Icon).

### **B. Inline Validation**

  * **Location:** Immediately below the input field.
  * **Style:** Text size `12px`, Weight `600`, Color `#E11D48`.
  * **Icon:** Tiny warning triangle (12px).

### **C. Haptic Feedback (Mobile)**

  * **Success Action:** Light impact (e.g., Marking stock 'Green').
  * **Error/Delete:** Heavy impact.
  * **Nav Switch:** No haptic.

-----

# 🧩 7. Iconography (Material Symbols Rounded — Official Munafa OS Icon System)

**Library:** Material Symbols Rounded (Filled + Outlined)  
**Delivery:** Iconify / Google Fonts / Local SVGs  
**Purpose:** High readability, friendly curves, mobile-first clarity, consistent with Munafa OS’s soft, squirdle aesthetic.

---

## 7.1 Icon Style & Visual Language

Material Symbols Rounded were chosen because they:

- ✔ Match the rounded, tactile UI design of Munafa OS  
- ✔ Maintain readability on small screens for Kirana owners  
- ✔ Support filled, outlined, duotone, and sharp styles  
- ✔ Scale well at both 24px and 32px  
- ✔ Offer a huge icon library (retail, finance, navigation, POS)  
- ✔ Provide unmatched clarity under bright lighting conditions  

These icons enhance the “Store Wellness” philosophy.

---

## 7.2 Icon Rendering Rules

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
- **Duotone** (optional) → Extra emphasis  

### Variable Font Settings
If using Material Symbols as variable fonts:

```
opsz: 24
wght: 400 (default), 500–600 for emphasis
FILL: 0 (outline), 1 (filled)
GRAD: 0
```

---

## 7.3 Active / Inactive State Rules

### Bottom Navigation Dock
**Inactive State**
- Style: Outlined  
- Color: `#94A3B8`  
- Weight: ~400  

**Active State**
- Style: Filled  
- Color: `var(--color-brand-primary)`  
- Weight: 500–600  
- Optional: Soft glow shadow  

---

## 7.4 Icon Categories & Usage Rules

### 1. Navigation Icons
| Feature | Icon |
|--------|-------|
| Home | `home` |
| Inventory | `inventory_2` |
| Insights | `insights` |
| Scan | `barcode_scanner` |
| Account | `account_circle` |

- **Active:** Filled  
- **Inactive:** Outlined  

---

### 2. Inventory & Product Icons

Since product icons don’t exist in Material Symbols:

**Use Letter Avatars**
- BG: Semantic color  
- Shape: Circle  
- Text: First character  
- Typography: Bold  

---

### 3. Quick Action Icons
| Action | Icon | Style |
|--------|-------|--------|
| Add Item | `add_circle` | Filled |
| Restock | `inventory` | Filled |
| Sales | `receipt_long` | Filled |
| Categories | `category` | Filled |

Render at **28–32px** for strong clarity.

---

### 4. Feedback Icons

| Type | Icon | Style |
|------|--------|--------|
| Success | `check_circle` | Filled, green |
| Error | `error` | Filled, red |
| Warning | `warning` | Filled, amber |
| Offline | `cloud_off` | Outlined |
| Info | `info` | Outlined |

Toasts always use **filled** icons.

---

### 5. Form & Input Icons
- Search → `search`
- Dropdown → `expand_more`
- Units → context-based (e.g., `shopping_bag`, `scale`, `sell`)

Inside inputs:
- Size: **20–24px**
- Style: **Outlined**
- Color: Slate (`#64748B`)

---

## 7.5 Dark Mode Icon Behavior

- **Outlined Icons:** Switch to `#CBD5E1`  
- **Filled Icons:** Use pure white or bright semantic colors  
- Reduce shadows → use subtle outer glows (`rgba(255,255,255,0.15)`)

---

## 7.6 Universal Icon Rules

1. **Never mix icon families** (Material-only rule).  
2. **Filled = active or high emphasis**.  
3. **Outlined = inactive or neutral**.  
4. Icons must align to a **24px grid**.  
5. Icon + label spacing = **8px**.  
6. All interactive icons MUST follow **44px minimum touch target**.  
7. Icons should never overpower text; hierarchy = text-first, icon-second.


-----

## 🌙 8. Dark Mode Guidelines

*Even if not V1, design for it.*

**Philosophy:** "Dim the lights, don't invert everything."

1.  **Canvas:** `#F8F9FD` → `#0F172A` (Deep Blue-Black).
2.  **Surface:** `#FFFFFF` → `#1E293B` (Slate 800).
3.  **Text:**
      * Primary: `#FFFFFF` (White).
      * Secondary: `#94A3B8` (Slate 400).
4.  **Semantic Shifts:**
      * **Success:** BG `#064E3B` (Dark Green), Text `#34D399` (Bright Mint).
      * **Error:** BG `#881337` (Dark Red), Text `#FB7185` (Bright Rose).
5.  **Shadows:** Replace shadows with **Glows** or lighter borders (`1px solid rgba(255,255,255,0.1)`).

-----

## 📝 9. Example Screen Descriptions

### **Screen A: The Galla (Dashboard)**

  * **Header:** Mesh gradient (Indigo/Violet). Text: "Namaste, Papa". Widget: "Total Value ₹50k".
  * **Search:** Floating pill, shadow level 2.
  * **Actions:** Square "Squirdle" buttons (Add, Restock, Sales) in a horizontal scroll.
  * **Recent:** Stack of `Card.ProductBubble`.

### **Screen B: Inventory List**

  * **Filter:** Horizontal pills (All, Low, Empty). Active is Black/White; Inactive is Grey/White.
  * **List:** Infinite scroll of bubbles. "Khatam" items have a faint Rose background (`#FFF1F2`).
  * **Fab:** A generic "Add" FAB stays at bottom right (above Nav Dock).

### **Screen C: Add Item Flow**

  * **Header:** "Naya Item Jodo". Back arrow.
  * **Form:** Conversational spacing (large gaps).
      * Input: "Name" (Full width).
      * Inputs: "Buy Rate" & "Sell Rate" (Side-by-side).
      * Input: "Unit" (Chips: Kg, G, Pcs).
  * **Smart Calc:** A green badge appears: "✅ Bachat: ₹5 (10%)".
  * **Footer:** Giant gradient button "PAKKA KARO".

-----

This document represents **Munafa OS v2.1**. It bridges the gap between "Creative Vision" and "Developer Code," providing every token and rule needed for implementation.
