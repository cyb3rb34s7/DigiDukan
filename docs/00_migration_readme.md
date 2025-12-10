---
title: Munafa OS v2.1 Migration
version: 2.1
status: in-progress
created: 2025-01-10
updated: 2025-01-10
---

# Munafa OS v2.1 Migration

## Overview

This migration transforms DigiDukan from its current blue-slate design to the **Munafa OS** design system — a "Store Wellness" themed interface optimized for Indian Kirana store owners.

## Design Philosophy

**Core Vibe:** "Store Wellness" — shifting the mental model from "Data Entry" to "Store Health Monitoring"

### Emotional Tone
- **Trustworthy:** Deep, royal colors signal financial accuracy
- **Calm:** Soft Rose replaces Alert Red to reduce anxiety
- **Spacious:** High whitespace reduces cognitive load during rush hours
- **Tactile:** Buttons feel "squishy" and physical, inviting interaction

### UX Principles
1. **Don't Read, Scan:** Users understand stock status by Color and Shape, not text
2. **Thumb-First:** All primary actions reachable with one thumb
3. **Conversational Entry:** Data entry feels like answering a question
4. **Zero Dead Ends:** Every screen has a clear "Next Step" or "Back" action

## Migration Strategy

**Pattern:** Strangler-fig migration — incremental replacement inside existing codebase

**Branch:** `migration` (all work branches from here, all PRs merge back here)

**Principle:** Docs-first — all decisions stored in `/docs/` as Markdown

## Key Changes

| Aspect | Before | After |
|--------|--------|-------|
| Primary Color | Blue-700 (#1d4ed8) | Electric Indigo (#4F46E5) |
| Font | System fonts | Manrope |
| Icons | Lucide React | Material Symbols Rounded |
| Border Radius | 12-16px | 16-24px (Squircles) |
| Navigation | Solid white bar | Glass morphism dock |
| Cards | Flat white | Soft shadows, rounded-3xl |
| Buttons | Flat primary | Gradient primary with shadow |

## Phases

1. **Phase 0:** Audit, Docs & Migration Setup (current)
2. **Phase 1:** Foundation & Theming Setup
3. **Phase 2:** Component Library Implementation
4. **Phase 3:** Page-by-Page Migration
5. **Phase 4:** Cleanup & Release Prep

## Documentation Index

| Doc | Purpose |
|-----|---------|
| `01_codebase_audit.md` | Current component inventory |
| `02_strings_index.md` | All UI strings (Hindi/English) |
| `03_token_spec.md` | Design tokens specification |
| `04_iconography.md` | Icon mapping (Lucide → Material) |
| `05_component_contracts.md` | New component API specs |
| `06_migration_checklist.md` | Task tracking |
| `07_release_strategy.md` | Release plan |

## Reference Documents

- `docs/DESIGN_DECK.md` — Full Munafa OS design specification
- `docs/plan/IMPLEMENTATION_PLAN.md` — Detailed implementation plan

## Rules of Engagement

1. All work branches must be made from `migration`
2. All PRs must merge back into `migration` only
3. Update relevant docs after each implementation
4. No unit tests or accessibility work in this iteration
5. Focus is UI redesign, theming, tokens, and page migration
