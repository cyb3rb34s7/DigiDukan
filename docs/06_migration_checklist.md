---
title: Migration Checklist
version: 2.1
status: in-progress
created: 2025-01-10
updated: 2025-01-10
---

# Migration Checklist — Munafa OS v2.1

Track progress through each phase of the migration.

---

## Phase 0: Audit, Docs & Migration Setup

### Branch Setup
- [x] Create `migration` branch from `feature/complete-tdd-implementation`
- [ ] Push migration branch to origin

### Documentation
- [x] `docs/00_migration_readme.md` — Overview
- [x] `docs/01_codebase_audit.md` — Component inventory
- [x] `docs/02_strings_index.md` — UI strings
- [x] `docs/03_token_spec.md` — Design tokens
- [x] `docs/04_iconography.md` — Icon mapping
- [x] `docs/05_component_contracts.md` — Component APIs
- [x] `docs/06_migration_checklist.md` — This file
- [ ] `docs/07_release_strategy.md` — Release plan

**Phase 0 Status:** In Progress

---

## Phase 1: Foundation & Theming Setup

### Dependencies
- [ ] Install `@iconify/react`
- [ ] Verify Tailwind CSS v4 setup

### Design Tokens
- [ ] Create `/tokens/tokens.css`
- [ ] Import tokens in `app/globals.css`
- [ ] Update Tailwind `@theme inline` block with new tokens

### Fonts
- [ ] Configure Manrope via `next/font/google`
- [ ] Add Devanagari fallback font
- [ ] Apply font-family to body
- [ ] Verify numeric alignment (tabular-nums)

### Icon System
- [ ] Create `components/munafa/Icon.tsx`
- [ ] Test Material Symbols rendering
- [ ] Verify filled/outlined variants work

### Theme Context (Optional - Light mode only for now)
- [ ] Skip ThemeContext for v2.1
- [ ] Skip LanguageContext (existing bilingual works)

**Phase 1 Status:** Not Started

---

## Phase 2: Component Library Implementation

### Core Components
- [ ] `components/munafa/Button.tsx`
  - [ ] Primary (gradient)
  - [ ] Secondary
  - [ ] Ghost
  - [ ] Danger
  - [ ] Loading state
  - [ ] Disabled state

- [ ] `components/munafa/Input.tsx`
  - [ ] Default variant
  - [ ] Price variant
  - [ ] Search variant
  - [ ] Error state
  - [ ] Focus state

- [ ] `components/munafa/Card.tsx`
  - [ ] Default variant
  - [ ] Product variant
  - [ ] Hover state

- [ ] `components/munafa/HealthBar.tsx`
  - [ ] OK state (green, full)
  - [ ] LOW state (amber, 40%)
  - [ ] EMPTY state (rose, dot)

- [ ] `components/munafa/Badge.tsx`
  - [ ] Default variant
  - [ ] Success/Warning/Danger variants

- [ ] `components/munafa/Chip.tsx`
  - [ ] Selected/unselected states
  - [ ] Multi-option support

### Layout Components
- [ ] `components/munafa/NavDock.tsx`
  - [ ] Glass morphism effect
  - [ ] Active/inactive icon states
  - [ ] Safe area padding

- [ ] `components/munafa/MeshHeader.tsx`
  - [ ] Gradient background
  - [ ] Online/offline indicator
  - [ ] Title prop

### Feedback Components
- [ ] `components/munafa/Toast.tsx`
  - [ ] ToastProvider
  - [ ] useToast hook
  - [ ] Success/Error/Warning/Info types
  - [ ] Auto-dismiss
  - [ ] Slide animation

### Design Test Page
- [ ] Create `app/design-test/page.tsx`
- [ ] Display all components
- [ ] Test all states/variants

### Documentation
- [ ] Update `05_component_contracts.md` after each component

**Phase 2 Status:** Not Started

---

## Phase 3: Page-by-Page Migration

### Migration Workflow
For each page:
1. Create branch: `migration/<page-name>`
2. Replace component imports
3. Update styling to use tokens
4. Test functionality preserved
5. Create PR to `migration`
6. Document in `docs/screens/<page>.md`

### Pages

#### 3.1 Home/Search Page (`app/(shell)/page.tsx`)
- [ ] Replace Input with Munafa Input (search variant)
- [ ] Replace Card with Munafa Card
- [ ] Update search results styling
- [ ] Update recent items section
- [ ] Verify Fuse.js search works

#### 3.2 Inventory Page (`app/(shell)/inventory/page.tsx`)
- [ ] Replace filter tabs with Chip component
- [ ] Replace product cards with ProductBubble
- [ ] Add HealthBar to each product
- [ ] Update Mandi list card styling
- [ ] Verify stock filtering works
- [ ] Verify copy-to-clipboard works

#### 3.3 Add Product Page (`app/(shell)/add/page.tsx`)
- [ ] Replace form Inputs
- [ ] Replace unit selector with Chip
- [ ] Replace submit Button (gradient)
- [ ] Update margin display styling
- [ ] Verify form submission works

#### 3.4 Product Detail Page (`app/(shell)/product/[id]/page.tsx`)
- [ ] Update price display styling
- [ ] Replace stock status buttons
- [ ] Replace edit/back buttons
- [ ] Update aliases display
- [ ] Verify stock update works

#### 3.5 Edit Product Page (`app/(shell)/product/[id]/edit/page.tsx`)
- [ ] Same as Add Product
- [ ] Verify form pre-fill works
- [ ] Verify update submission works

#### 3.6 Settings Page (`app/(shell)/settings/page.tsx`)
- [ ] Replace Input components
- [ ] Replace language selector with Chip
- [ ] Update info cards styling
- [ ] Verify settings save works

### Shell Layout (`app/(shell)/layout.tsx`)
- [ ] Replace Header with MeshHeader
- [ ] Replace BottomNav with NavDock
- [ ] Update ToastContainer with new Toast
- [ ] Verify layout renders correctly

**Phase 3 Status:** Not Started

---

## Phase 4: Cleanup & Release Prep

### Remove Legacy Code
- [ ] Delete `components/ui/` folder
- [ ] Remove `lucide-react` from package.json
- [ ] Run `npm prune`

### Clean Styles
- [ ] Remove unused CSS variables from globals.css
- [ ] Remove any legacy Tailwind classes
- [ ] Verify no hardcoded colors (should use tokens)

### Optimization
- [ ] Subset Manrope font (if needed)
- [ ] Verify bundle size

### Testing
- [ ] Test all pages manually
- [ ] Verify touch targets (44px minimum)
- [ ] Verify Hindi/English labels
- [ ] Test on mobile viewport

### Documentation
- [ ] Finalize `00_migration_readme.md`
- [ ] Create release notes

### Release
- [ ] Final commit on `migration`
- [ ] Create PR: `migration` → `main`
- [ ] Code review
- [ ] Merge and tag v2.1

**Phase 4 Status:** Not Started

---

## Quick Reference

### Current Status

| Phase | Status | Progress |
|-------|--------|----------|
| Phase 0 | In Progress | 7/8 docs |
| Phase 1 | Not Started | 0% |
| Phase 2 | Not Started | 0% |
| Phase 3 | Not Started | 0% |
| Phase 4 | Not Started | 0% |

### Next Actions

1. Complete `docs/07_release_strategy.md`
2. Commit Phase 0 docs
3. Start Phase 1: Install dependencies, create tokens
