# Design: Visual Design — Cinematic Dark Theme

## Technical Approach

Override `.dark` CSS vars in `globals.css` with cinematic OKLCH values, add cinema-specific tokens via `@theme inline`, then restyle each page/component using Tailwind utilities only. Zero structural/behavioral changes.

## Architecture Decisions

| Option | Tradeoffs | Decision |
|--------|-----------|----------|
| CSS vars override vs. full `:root` swap | Swap keeps light theme intact; override is cleaner | Override `.dark` block — light theme untouched |
| Glass via `bg-white/5 backdrop-blur-xl` vs. new CSS class | Inline is faster; utility is DRYer | `@utility glass` for reuse across 6+ surfaces |
| Amber as `--primary` vs. separate token | Primary swap auto-colors buttons/links; separate gives control | `--color-cinema-gold` as accent; keep `--primary` off-white for body — amber on black is 4.6:1 (passes large text, border on small) |

## Data Flow

```
globals.css @theme & .dark vars
  ├── layout.tsx (body bg via var)
  ├── page.tsx (gradient hero + glass cards)
  ├── (auth)/* (glass card + amber links)
  ├── Navbar (glass bg + amber hover)
  ├── MovieCard (glow shadow + amber star)
  ├── CastCard (glass ring)
  ├── Film detail (dramatic backdrop overlay)
  └── Search page (theme consistency)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `globals.css` | Modify | New `.dark` vars, `@theme inline` tokens, 3 `@keyframes`, `@utility glass`, `@utility glow-amber` |
| `src/app/layout.tsx` | Modify | `bg-background` replacing `bg-gray-950` |
| `src/app/page.tsx` | Modify | Gradient hero, amber CTA buttons, glass feature cards, amber footer |
| `src/app/(auth)/layout.tsx` | Modify | `bg-background` + glass card container |
| `src/app/(auth)/login/page.tsx` | Modify | Amber spinner |
| `src/app/(auth)/register/page.tsx` | Modify | Amber spinner |
| `src/app/(auth)/auth/reset-password/page.tsx` | No change | Already uses Card + shadcn — inherits theme |
| `src/app/film/[id]/page.tsx` | Modify | Darker gradient overlay, amber rating, glass genre pills |
| `src/app/search/page.tsx` | Modify | Theme-consistent text colors, amber focus |
| `src/app/not-found.tsx` | Modify | Amber 404 heading + CTA |
| `src/components/layout/navbar.tsx` | Modify | `glass` bg, amber logo hover, amber CTA |
| `src/components/auth/login-form.tsx` | Modify | Amber links |
| `src/components/auth/register-form.tsx` | Modify | Amber links |
| `src/components/catalog/movie-card.tsx` | Modify | `glow-amber` hover, `text-cinema-gold` star |
| `src/components/catalog/cast-card.tsx` | Modify | `ring-cinema-gold/30` on hover |
| `src/components/catalog/similar-carousel.tsx` | Modify | Amber heading |
| `src/components/catalog/search-input.tsx` | Modify | Amber focus ring |
| `src/components/home/trending-section.tsx` | Modify | Amber heading, glass loading/error states |

## Theme Token Architecture

### New `.dark` vars in `globals.css`

```css
.dark {
  --background: oklch(0 0 0);          /* pure black */
  --foreground: oklch(0.97 0 0);       /* off-white */
  --card: oklch(0.12 0 0);             /* near-black */
  --card-foreground: oklch(0.97 0 0);
  --primary: oklch(0.97 0 0);          /* off-white buttons */
  --primary-foreground: oklch(0 0 0);
  --secondary: oklch(0.18 0 0);
  --secondary-foreground: oklch(0.85 0 0);
  --muted: oklch(0.15 0 0);
  --muted-foreground: oklch(0.65 0 0);
  --accent: oklch(0.72 0.15 75);       /* amber */
  --accent-foreground: oklch(0 0 0);
  --border: oklch(1 0 0 / 8%);
  --input: oklch(1 0 0 / 10%);
  --ring: oklch(0.72 0.15 75 / 50%);   /* amber ring */
  --radius: 0.75rem;                    /* rounded-lg */
}
```

### New `@theme inline` tokens

```css
@theme inline {
  /* Cinema accent */
  --color-cinema-gold: oklch(0.72 0.15 75);
  --color-cinema-amber: oklch(0.65 0.17 72);

  /* Glass tokens */
  --color-glass-bg: oklch(1 0 0 / 5%);
  --color-glass-border: oklch(1 0 0 / 10%);
  --color-glass-hover: oklch(1 0 0 / 10%);

  /* Animation tokens */
  --animate-shimmer: shimmer 2s ease-in-out infinite;
  --animate-fade-in: fade-in 0.5s ease-out;
  --animate-glow-pulse: glow-pulse 3s ease-in-out infinite;
}
```

### `@keyframes`

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 8px oklch(0.72 0.15 75 / 20%); }
  50% { box-shadow: 0 0 20px oklch(0.72 0.15 75 / 40%); }
}
```

### `@utility` directives

```css
@utility glass {
  background-color: var(--color-glass-bg);
  border: 1px solid var(--color-glass-border);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
@utility glow-amber {
  transition: box-shadow 0.3s ease;
}
@utility glow-amber:hover {
  box-shadow: 0 0 20px oklch(0.72 0.15 75 / 30%);
}
```

## Per-Component Style Changes

### Navbar
```
Before: bg-gray-950/80 backdrop-blur-md border-gray-800
After:  glass border-cinema-gold/20

Logo hover: hover:text-cinema-gold (was hover:text-indigo-400)
CTA btn:   bg-cinema-gold text-black hover:bg-cinema-amber (was bg-indigo-600)
Auth link: hover:text-cinema-gold (was hover:text-white)
```

### Hero (page.tsx)
```
Hero section: bg-gradient-to-b from-cinema-gold/10 via-background to-background
CTA primary:  bg-cinema-gold text-black hover:bg-cinema-amber
CTA outline:  border-cinema-gold/40 text-cinema-gold hover:bg-cinema-gold/10
```

### FeatureCard
```
Before: rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm
After:  glass rounded-2xl p-6 animate-fade-in
```

### MovieCard
```
Before: border-gray-800 bg-gray-900/80 hover:shadow-indigo-500/20 hover:border-indigo-500/30
After:  glass glow-amber hover:border-cinema-gold/40

Star: fill-cinema-gold text-cinema-gold (was fill-yellow-500 text-yellow-500)
```

### CastCard
```
Before: border-gray-700
After:  transition-all duration-300 hover:ring-2 hover:ring-cinema-gold/30 hover:scale-105
```

### SearchInput
```
Before: focus:border-indigo-500 focus:ring-indigo-500/40
After:  focus:border-cinema-gold focus:ring-cinema-gold/40
```

### Auth forms
```
Links: text-cinema-gold hover:text-cinema-amber (was text-indigo-400)
Spinner: border-cinema-gold (was border-indigo-400)
```

### Film detail backdrop
```
Overlay: bg-gradient-to-t from-background via-background/80 to-transparent
       (was from-gray-950 via-gray-950/60 — more dramatic with pure black)
Genre pills: glass (was bg-gray-800/60 border-gray-700)
Rating star: fill-cinema-gold text-cinema-gold
```

### TrendingSection / SearchPage
```
Heading: text-cinema-gold (was text-white)
Loading skeleton: glass shimmer bg
Error/empty: glass p-6 text-muted-foreground
```

## Animation Implementation

| Animation | Applied To | Trigger |
|-----------|-----------|---------|
| `fade-in` | FeatureCards, auth glass cards | Mount |
| `glow-pulse` | MovieCard hover, CTA buttons | Hover |
| `shimmer` | Loading skeletons (trending, search, film detail) | State |
| Transition all 300ms | Navbar, MovieCard, CastCard, buttons | Hover |

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Amber on black WCAG fail (< 4.5:1) | Amber used ONLY for large/heading text (≥24px) and decorative elements. Body text uses `--foreground` (oklch(0.97)). Check with browser devtools contrast tool. |
| `backdrop-filter` in Safari | Include `-webkit-backdrop-filter` in `@utility glass`. Falls back to opaque bg on unsupported browsers. |
| shadcn/ui Card inherits wrong bg | Set `--card` to oklch(0.12 0 0) in `.dark`; Card component already reads `bg-card` via shadcn. |
| Build failure on new `@keyframes` | `@keyframes` go BELOW `@theme` block, inside `@layer base` or global scope. Tailwind v4 parses custom `@keyframes` without issues. |

## Testing / Verification

1. `npm run build` — must pass
2. Visual scan every page: nav, hero, auth, film detail, search, 404
3. WCAG contrast check: amber heading on black (devtools)
4. Verify glass effect: check `backdrop-filter` property in computed styles
5. Hover glow on MovieCard, Nav CTA, CastCard — only on devices that support hover

## Open Questions

- None. All decisions resolved above.
