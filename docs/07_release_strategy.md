---
title: Release Strategy
version: 2.1
status: draft
created: 2025-01-10
updated: 2025-01-10
---

# Release Strategy — Munafa OS v2.1

## Version Naming

**Current:** DigiDukan v1.0 (blue-slate design)
**Target:** Munafa OS v2.1 (Electric Indigo design)

## Branch Strategy

```
main (production)
  └── feature/complete-tdd-implementation (current)
        └── migration (UI redesign work)
              ├── migration/foundation (Phase 1)
              ├── migration/components (Phase 2)
              ├── migration/home-page (Phase 3.1)
              ├── migration/inventory-page (Phase 3.2)
              └── ... (per-page branches)
```

### Rules

1. All feature branches created from `migration`
2. All PRs merge into `migration` only
3. `migration` → `main` only after full QA
4. Never push directly to `main`

## PR Checklist

Every PR to `migration` must include:

- [ ] Linked doc explaining context
- [ ] Screenshots (before/after if applicable)
- [ ] Tokens used (no raw hex colors)
- [ ] i18n keys if new strings added
- [ ] `/design-test` updated if new component
- [ ] Relevant doc updated

## Testing Strategy

### Manual Testing (v2.1)

No automated tests in this iteration. Focus on manual verification:

1. **Visual QA**
   - All components match DESIGN_DECK.md specs
   - Colors use design tokens
   - Fonts render correctly (Manrope)
   - Icons display (Material Symbols)

2. **Functional QA**
   - All existing features work unchanged
   - Navigation works
   - Forms submit correctly
   - Data displays correctly

3. **Responsive QA**
   - Mobile viewport (375px)
   - Tablet viewport (768px)
   - Desktop constrained (480px max)

4. **Touch Target QA**
   - All interactive elements ≥ 44px
   - Buttons, inputs, nav items

5. **Content QA**
   - Hindi labels present
   - English labels present
   - No broken strings

## Release Milestones

### Milestone 1: Foundation Complete
**Criteria:**
- All Phase 0 docs complete
- Phase 1 foundation merged
- `/design-test` page working
- Tokens applied

### Milestone 2: Component Library Complete
**Criteria:**
- All Munafa components implemented
- All components documented
- `/design-test` shows all components

### Milestone 3: Migration Complete
**Criteria:**
- All pages migrated
- Old components removed
- No lucide-react imports
- Full manual QA pass

### Milestone 4: Release Ready
**Criteria:**
- All tests pass
- Documentation finalized
- Release notes written
- PR to main approved

## Release Checklist

Before merging `migration` → `main`:

### Code Quality
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Build succeeds (`npm run build`)
- [ ] No unused imports/variables

### Design Quality
- [ ] All colors from tokens
- [ ] Manrope font loads
- [ ] Material Symbols display
- [ ] Glass morphism effects work
- [ ] Gradients render correctly

### Functionality
- [ ] Home search works
- [ ] Add product works
- [ ] Edit product works
- [ ] Delete product works
- [ ] Stock status update works
- [ ] Inventory filtering works
- [ ] Mandi list copy works
- [ ] Settings save works

### Performance
- [ ] Initial load < 3s
- [ ] Interactions feel responsive
- [ ] No layout shifts

### Accessibility (Basic)
- [ ] Touch targets ≥ 44px
- [ ] Text readable (18px base)
- [ ] Sufficient color contrast

## Rollback Plan

If critical issues found after merge:

1. Revert merge commit on `main`
2. Create hotfix branch from pre-merge `main`
3. Fix issue
4. Re-merge with fix

## Post-Release

### Monitoring
- Watch for user-reported issues
- Monitor error logs (if any)

### Documentation
- Update README with new design info
- Archive old design docs if needed

### Future Iterations
- v2.2: Dark mode support
- v2.3: i18n proper implementation
- v2.4: PWA enhancements

## Release Notes Template

```markdown
# Munafa OS v2.1 Release Notes

## What's New

### Visual Redesign
- New "Store Wellness" design philosophy
- Electric Indigo (#4F46E5) primary color
- Manrope typography
- Material Symbols Rounded icons
- Glass morphism navigation dock
- Squircle card design

### Improved UX
- Tactile button feedback
- Stock status health bars
- Gradient mesh header
- Enhanced toast notifications

## Technical Changes
- Replaced Lucide React with Material Symbols
- New design token system
- Component library rewrite

## Migration Notes
- No functionality changes
- All existing features preserved
- Database unchanged

## Known Issues
- (List any known issues)

## Contributors
- (List contributors)
```
