# Proposal: Visual Design — Cinematic Dark Theme

## Intent

Default shadcn/ui dark theme with indigo accents — functional but bland for a cinema app. Apply a cinematic palette (deep blacks, amber/gold), glassmorphism, gradient heroes, and micro-interactions.

## Scope

### In Scope
- Theme tokens: deep blacks, amber accent, glass utilities, refined radius
- Landing: black-to-purple gradient hero + glass feature cards
- Auth pages: cinematic bg + centered glass card
- Film detail: dramatic backdrop, glass overlays
- Search, catalog (MovieCard glow, CastCard glass ring)
- Navbar: glass effect, amber hover
- Loading shimmers + micro-interactions

### Out of Scope
- Functionality changes or new features
- Dark/light toggle (dark-only)
- Responsive breakpoints, shadcn/ui swaps

## Capabilities

### New Capabilities
None — pure visual redesign, no new behavioral specs.

### Modified Capabilities
None — no specs in `openspec/specs/` affected.

## Approach

1. Define CSS vars in `globals.css` `@theme` — deep black (`oklch(0 0 0)`), amber accent (`oklch(0.7 0.15 75)`), glass tokens
2. Apply via Tailwind utilities only — no runtime CSS-in-JS
3. Add `@keyframes` for shimmer, fade-in, glow-pulse
4. Style each page/component with new tokens, preserving structure and behavior

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `globals.css` | Modified | Tokens, animations, glass utilities |
| `page.tsx` | Modified | Gradient hero, glass cards |
| `layout.tsx` | Modified | Pure black body bg |
| `(auth)/*` | Modified | Dark bg + glass card |
| `auth/*.tsx` | Modified | Amber links, glass cards |
| `film/[id]/page.tsx` | Modified | Dramatic backdrop, overlays |
| `search/page.tsx` | Modified | Consistent theme |
| `catalog/*.tsx` | Modified | Glow hover, amber accents |
| `home/*.tsx` | Modified | Glass cards, amber tint |
| `navbar.tsx` | Modified | Glass effect, amber hover |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Large diff touches many files | High | Verify per page; one pass per file |
| Amber accent breaks a11y contrast | Med | Check WCAG contrast on all surfaces |
| Tailwind v4 `@theme` var resolution | Low | Fall back to inline OKLCH values |

## Rollback Plan

`git revert HEAD` — restores previous tokens and styles.

## Dependencies

- Tailwind v4 `@theme` directive (already configured)
- Existing shadcn/ui components (unchanged)

## Success Criteria

- [ ] `npm run build` passes with zero errors
- [ ] All pages share consistent cinematic palette (deep blacks, amber accents)
- [ ] Glass cards render correctly; hover glows work on MovieCard, Nav, CTAs
- [ ] Loading/error states match new theme
- [ ] No functionality regressions — auth, search, film detail all work
