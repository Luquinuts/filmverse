# Tasks: Visual Design — Cinematic Dark Theme

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 500–700 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (theme) → PR 2 (navbar + auth) → PR 3 (landing) → PR 4 (catalog) → PR 5 (pages + forms) |
| Delivery strategy | ask-on-risk |
| Chain strategy | feature-branch-chain |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Theme foundation — CSS vars, tokens, utilities, keyframes | PR 1 | Self-contained: globals.css + layout.tsx body class. Everything else depends on this. |
| 2 | Navbar + auth layout + auth spinners | PR 2 | Independent of catalog/landing pages. Base = main after PR 1. |
| 3 | Landing page — hero, features, footer | PR 3 | Base = main after PR 1. Independent of catalog/auth. |
| 4 | Catalog components — MovieCard, CastCard, SearchInput, SimilarCarousel, TrendingSection | PR 4 | Base = main after PR 1. |
| 5 | Pages + forms — film/[id], search, not-found, login-form, register-form | PR 5 | Depends on PR 4 (shares MovieCard, CastCard). Base = main. |

## Phase 1: Theme Foundation

- [x] 1.1 **File**: `src/app/globals.css` — Replace `.dark` block with cinematic OKLCH vars (pure black bg, amber accent, near-black card, subtler borders).
- [x] 1.2 **File**: `src/app/globals.css` — Add `@theme inline` tokens: `--color-cinema-gold`, `--color-cinema-amber`, `--color-glass-bg`, `--color-glass-border`, `--color-glass-hover`, `--animate-shimmer`, `--animate-fade-in`, `--animate-glow-pulse`.
- [x] 1.3 **File**: `src/app/globals.css` — Add `@keyframes shimmer`, `fade-in`, `glow-pulse` below `@theme` block in global scope.
- [x] 1.4 **File**: `src/app/globals.css` — Add `@utility glass` (glass-bg + blur + border) and `@utility glow-amber` (hover shadow with cinema-gold).
- [x] 1.5 **File**: `src/app/layout.tsx` — Change body class from `bg-gray-950 text-gray-100` to `bg-background text-foreground`.

## Phase 2: Navbar + Auth

- [x] 2.1 **File**: `src/components/layout/navbar.tsx` — Header: `glass border-cinema-gold/20` (was `bg-gray-950/80 border-gray-800`). Logo hover: `hover:text-cinema-gold` (was `hover:text-indigo-400`). Desktop CTA: `bg-cinema-gold text-black hover:bg-cinema-amber` (was `bg-indigo-600`). Auth links: `hover:text-cinema-gold` (was `hover:text-white`). Mobile menu same glass + amber treatment.
- [x] 2.2 **File**: `src/app/(auth)/layout.tsx` — Container bg: `bg-background` (was `bg-gray-950`). Subtitle: `text-muted-foreground` (was `text-gray-400`). *(Pending: purple radial gradient + `animate-fade-in` — moved to later batch.)*
- [x] 2.3 **File**: `src/app/(auth)/login/page.tsx` — Spinner: `border-cinema-gold border-t-transparent` (was `border-indigo-400`).

## Phase 3: Landing Page

- [ ] 3.1 **File**: `src/app/page.tsx` — Hero section: add gradient bg `from-cinema-gold/10 via-background to-background`. CTAs: primary `bg-cinema-gold text-black hover:bg-cinema-amber`, outline `border-cinema-gold/40 text-cinema-gold hover:bg-cinema-gold/10`.
- [ ] 3.2 **File**: `src/app/page.tsx` — FeatureCard: replace `rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm` with `glass rounded-2xl p-6 animate-fade-in`.
- [ ] 3.3 **File**: `src/app/page.tsx` — Footer: keep `text-gray-600`, verify it works against new pure black bg (consider `text-muted-foreground` if contrast is low).

## Phase 4: Catalog Components

- [ ] 4.1 **File**: `src/components/catalog/movie-card.tsx` — Container: `glass glow-amber hover:border-cinema-gold/40 hover:shadow-[0_0_25px_rgba(251,191,36,0.15)]` (was `bg-gray-900/80 border-gray-800 hover:shadow-indigo-500/20 hover:border-indigo-500/30`). Star: `fill-cinema-gold text-cinema-gold` (was `fill-yellow-500 text-yellow-500`).
- [ ] 4.2 **File**: `src/components/catalog/cast-card.tsx` — Photo container: `hover:ring-2 hover:ring-cinema-gold/30 hover:scale-105 transition-all duration-300` (was plain `border-gray-700`).
- [ ] 4.3 **File**: `src/components/catalog/search-input.tsx` — Focus classes: `focus:border-cinema-gold focus:ring-cinema-gold/40` (was `focus:border-indigo-500 focus:ring-indigo-500/40`).
- [ ] 4.4 **File**: `src/components/catalog/similar-carousel.tsx` — Scrollbar: `scrollbar-thumb-white/10 scrollbar-track-transparent` (was `scrollbar-thumb-gray-700 scrollbar-track-gray-900`).
- [ ] 4.5 **File**: `src/components/home/trending-section.tsx` — Heading: `text-cinema-gold` (was `text-white`). Loading skeletons: use `animate-shimmer` + glass bg (was `animate-pulse bg-gray-800`). Error/empty states: `glass p-6` (was `bg-gray-900/50 border-gray-800`).

## Phase 5: Pages

- [ ] 5.1 **File**: `src/app/film/[id]/page.tsx` — Backdrop overlay: `from-background via-background/80 to-transparent` (was `from-gray-950 via-gray-950/60`). Rating star: `fill-cinema-gold text-cinema-gold` (was `fill-yellow-500 text-yellow-500`). Genre pills: `glass` (was `bg-gray-800/60 border-gray-700 text-gray-300`). Meta icons: `text-cinema-gold/70` (was `text-gray-400`). Loading skeleton: replace `animate-pulse bg-gray-800` with `glass animate-shimmer`. Error/not-found: replace `bg-gray-900/50 border-gray-800` with `glass`.
- [ ] 5.2 **File**: `src/app/search/page.tsx` — Heading: `text-cinema-gold` (was `text-white`). Error/no-results states: `glass` (was `bg-gray-900/50 border-gray-800`). Loading skeletons: `animate-shimmer` + glass bg (was `animate-pulse bg-gray-800`). SearchInput already updated in 4.3.
- [ ] 5.3 **File**: `src/app/not-found.tsx` — 404 heading: `text-cinema-gold` (was `text-indigo-500`). CTA: `bg-cinema-gold text-black hover:bg-cinema-amber` (was `bg-indigo-600`).

## Phase 6: Auth Form Components

- [x] 6.1 **File**: `src/components/auth/login-form.tsx` — Auth links (forgot password, register link): `text-cinema-gold hover:text-cinema-amber` (was `text-indigo-400 hover:text-indigo-300`).
- [x] 6.2 **File**: `src/components/auth/register-form.tsx` — Auth link (login redirect): `text-cinema-gold hover:text-cinema-amber` (was `text-indigo-400 hover:text-indigo-300`).

### Implementation Order

Phase 1 first (globals.css + layout.tsx) — everything depends on the new CSS vars, `@theme` tokens, and utilities. Then phases can run in parallel since each modifies independent files. Recommended sequential order: 1 → 2 → 3 → 4 → 5 + 6 (5 and 6 can be swapped).

### Next Step

Decision needed before apply. The 400-line budget is likely exceeded (~500–700 lines across 17 files). Ask the user whether to split into chained PRs or approve a `size:exception` for a single PR.
