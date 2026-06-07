# Design: Filme Catalog (FilmVerse)

## Technical Approach

Public movie browsing via TMDB proxy pattern. A thin API layer (`src/app/api/`) wraps `TmdbClient` calls to keep credentials server-side. Pages are client components that `fetch` the proxy and render catalog components. Landing page stays server-rendered for the hero; the trending section loads client-side.

## Architecture Decisions

| Decision | Options | Chosen | Rationale |
|----------|---------|--------|-----------|
| Data fetching | Direct TmdbClient in client vs API proxy | API proxy (Route Handlers) | TmdbClient reads `process.env.*` — not available client-side |
| Search behavior | Debounced input auto-search vs submit-based | Submit-based via URL params | Shareable URLs, back button works, simpler state |
| Similar movies | `getTrending()` vs `/movie/{id}/similar` | New `getSimilar()` method | Semantically correct; doesn't pollute trending with unrelated data |
| Image loading | `<img>` vs `next/image` | `next/image` | Built-in optimization, lazy loading, TMDB domain already configured |
| State management | Local state + `useEffect` | Same (no library added) | Existing patterns use it; no SWR/React Query in deps |

## Data Flow

```
Navbar: User types → Enter → router.push('/search?q=...')
                                                  │
Search Page: reads useSearchParams('q')           │
  → useEffect → fetch('/api/search?q=...')        │
  → RouteHandler → TmdbClient.searchMovies()      │
  → [MovieSearchResult] → MovieGrid → MovieCard[] ┘

Detail Page: params.id
  → fetch('/api/movies/[id]')      ──→ MovieDetail + credits
  → fetch('/api/movies/[id]/similar') → similar movies

Landing: trending-section (client)
  → fetch('/api/trending') → MovieCard grid
```

## API Routes (New Proxy Layer)

| Route | Method | Returns |
|-------|--------|---------|
| `GET /api/trending` | calls `TmdbClient.getTrending()` | `MovieSearchResult[]` |
| `GET /api/search?q=` | calls `TmdbClient.searchMovies(q)` | `MovieSearchResult[]` |
| `GET /api/movies/[id]` | calls `TmdbClient.getMovieDetail(id)` | `MovieDetail` (incl. credits via append_to_response) |
| `GET /api/movies/[id]/similar` | calls `TmdbClient.getSimilarMovies(id)` | `MovieSearchResult[]` |

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/layout/navbar.tsx` | Create | Sticky navbar: logo (link to /), search input (Enter → /search?q=), auth links |
| `src/components/catalog/movie-card.tsx` | Create | Poster card with title, year, rating, TMDB image, hover scale |
| `src/components/catalog/movie-grid.tsx` | Create | Responsive grid 2→3→4 cols, renders `children` |
| `src/components/catalog/search-input.tsx` | Create | Text input with Search icon, controlled value, submit on Enter |
| `src/components/catalog/cast-card.tsx` | Create | Actor photo/placeholder, name, character name |
| `src/components/catalog/similar-carousel.tsx` | Create | Horizontal scroll container with MovieCards, snap scrolling |
| `src/components/home/trending-section.tsx` | Create | Client component: fetches /api/trending, renders MovieGrid |
| `src/app/search/page.tsx` | Create | Search page: URL param → results grid, empty/loading/no-results states |
| `src/app/film/[id]/page.tsx` | Create | Detail page: backdrop hero, info, cast grid, similar carousel |
| `src/app/api/trending/route.ts` | Create | Proxy: calls TmdbClient.getTrending() |
| `src/app/api/search/route.ts` | Create | Proxy: calls TmdbClient.searchMovies(q) |
| `src/app/api/movies/[id]/route.ts` | Create | Proxy: calls TmdbClient.getMovieDetail(id) |
| `src/app/api/movies/[id]/similar/route.ts` | Create | Proxy: calls TmdbClient.getSimilarMovies(id) |
| `src/app/layout.tsx` | Modify | Import and render Navbar above `{children}` |
| `src/app/page.tsx` | Modify | Add `<TrendingSection />` below hero |
| `src/lib/tmdb.ts` | Modify | Add `getSimilarMovies(tmdbId)` method |

## Interfaces / Contracts

```typescript
// API responses mirror TMDB types from @/lib/types
// /api/trending          → MovieSearchResult[]
// /api/search?q=Inception → MovieSearchResult[]
// /api/movies/550        → MovieDetail          // credits embedded
// /api/movies/550/similar → MovieSearchResult[]
```

## Testing Strategy

Testing is out of scope per proposal. Manual verification via `npm run dev`:

| Check | How |
|-------|-----|
| Trending loads on `/` | Scroll below hero, verify movie cards appear |
| Search works | Type in navbar → Enter → results grid |
| Detail renders | Click a card → verify backdrop, info, cast, similar |
| No API key | Verify graceful empty state (no crash) |

## Migration / Rollout

No migration required. New files only, no existing data affected.

## Open Questions

- [ ] Should similar movies reuse TMDB's `/movie/{id}/recommendations` instead of `/movie/{id}/similar`? (Recommendations are algorithm-based, similar is genre-based. We'll use `similar` — more predictable for MVP.)
