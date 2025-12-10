# 🚀 Munafa OS v2.1 — Implementation Plan (Migration-First, Docs-Driven)

**Target repo branch:** `migration`  
**Strategy:** Strangler-fig migration pattern — incremental replacement inside existing codebase  
**Docs-first:** All context stored in `/docs/` as Markdown  

---

# 0. PREAMBLE — Rules of Engagement

1. **Single active migration branch:**  
   - Create `migration` from your current working branch.  
   - All work branches must be made from `migration`.  
   - All PRs must merge back into `migration` only.

2. **Docs-first principle:**  
   All decisions, mappings, and specs must be saved in the `/docs/` folder as Markdown.

3. **AI-friendly structure:**  
   Docs use frontmatter metadata so AI agents can search and reference them deterministically.

4. **No unit tests or accessibility work** in this iteration.  
   Focus is UI redesign, theming, tokens, and page migration.

---

# 1. PHASE 0 — Audit, Docs & Migration Setup

**Goal:** Build a complete knowledge base in `/docs/` + prepare the migration branch.

## 1.1 Create Migration Branch
```bash
git checkout feature/complete-tdd-implementation
git checkout -b migration
git push -u origin migration
```

## 1.2 Create `/docs/` folder and required files
Each doc gets YAML frontmatter for AI usage.

- docs/00_migration_readme.md
- docs/01_codebase_audit.md
- docs/02_strings_index.md
- docs/03_token_spec.md
- docs/04_iconography.md
- docs/05_component_contracts.md
- docs/06_migration_checklist.md
- docs/07_release_strategy.md

## 1.3 Fill initial context docs
- Audit components → 01_codebase_audit.md
- Extract all visible strings → 02_strings_index.md
- Add design tokens copy → 03_token_spec.md
- Add Material Symbols icon spec → 04_iconography.md
- Add component contract templates → 05_component_contracts.md

## 1.4 Migration checklist
- Populate tasks in 06_migration_checklist.md

**Deliverables:**  
Fully populated `/docs/` folder committed to `migration`.

---

# 2. PHASE 1 — Foundation & Theming Setup

**Goal:** Add tokens, fonts, icon system, theme toggle, i18n — without breaking the existing UI.

## 2.1 Install dependencies
```
npm i -D tailwindcss postcss autoprefixer
npm i @iconify/react
npm i framer-motion
npm i next-intl
```

## 2.2 Add tokens & Tailwind mapping
- /tokens/tokens.css — all CSS vars  
- /tokens/tokens.js — JS exports  
- Update tailwind.config.js to map tokens  
- Reference tokens via CSS vars in Tailwind

## 2.3 Fonts
- Add Manrope using next/font/google  
- Add fallback for Devanagari  
- Apply numeric alignment globally

## 2.4 Icon System
- Add Material Symbols Rounded  
- Create components/munafa/Icon.tsx

## 2.5 Theme + Language Contexts
- ThemeContext.tsx with light/dark toggle  
- LanguageContext.tsx  
- Register providers in app/layout.tsx

## 2.6 i18n Setup
- locales/en.json, hi.json, hinglish.json  
- Populate initial keys from 02_strings_index.md  

**Deliverables:**  
Working theme + language toggle on /design-test page.

---

# 3. PHASE 2 — Component Library Implementation

**Goal:** Implement new Munafa OS components in `/components/munafa/`.

## 3.1 Components to implement
- Button (primary, secondary, ghost, fab)  
- Input (text, price, search, chips)  
- Card (ProductBubble, DashboardWidget)  
- Indicator (HealthBar)  
- NavDock (glass dock)  
- MeshHeader  
- ToastProvider  
- Icon wrapper (phase 1)

## 3.2 Update Component Contracts Doc
Each created component must append its spec to:  
docs/05_component_contracts.md

## 3.3 Create Design Test Page
- /design-test shows all components in both themes  
- Use it for visual checks

**Deliverables:**  
All new components implemented + documented contracts.

---

# 4. PHASE 3 — Page-by-Page Migration

**Goal:** Replace old UI with new components, preserving logic.

## 4.1 Migration Workflow
- Branch: migration/<ticket>-<screen>  
- Replace UI ONLY, keep logic  
- Update relevant doc: docs/screens/<screen>.md

## 4.2 Suggested migration order
1. Dashboard (Galla)  
2. Inventory List (Maal)  
3. Add Item  
4. Product Detail  
5. Search  
6. Reports  
7. Settings  

## 4.3 For each migrated screen
Add to its doc:
- Before/after summary  
- Components used  
- i18n keys added  
- UX notes  

**Deliverables:**  
Each migrated screen merged into migration.

---

# 5. PHASE 4 — Cleanup & Release Prep

## 5.1 Cleanup
- Remove legacy components  
- Remove lucide-react  
- Clean unused styles  

## 5.2 Optimize
- Subset icons  
- Subset Manrope fonts  

## 5.3 Release docs
- Finalize:
  - 00_migration_readme.md  
  - release_notes_v2.1.md

## 5.4 Merge migration → main
After QA, merge and tag v2.1.

---

# How AI Agents Should Use Docs

1. Read docs/06_migration_checklist.md to know active tasks  
2. Load relevant context doc depending on task:  
   - Component task → docs/05_component_contracts.md  
   - Token task → docs/03_token_spec.md  
   - Screen migration → docs/screens/<screen>.md  
3. Update docs after implementing  
4. Always branch from migration  
5. Always merge back into migration after QA  

---

# PR Checklist for Migration Branch

- [ ] Linked doc explaining context  
- [ ] Screenshots (light/dark)  
- [ ] Tokens used (no raw colors)  
- [ ] i18n keys added  
- [ ] /design-test updated if applicable  
- [ ] Relevant doc updated  
