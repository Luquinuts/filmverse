# Proposal: Film Catalog (FilmVerse)

## Intent

Build public movie browsing pages so visitors can explore films before logging in. The TMDB client is ready but there are no pages to use it — catalog is the core hook that brings users into the app.

## Scope

### In Scope
- Trending grid on landing page (`/`) — hero stays, trending below
- Search page (`/search`) with debounced input + results grid
- Film detail page (`/film/[id]`) — backdrop, info, cast, similar
- Reusable catalog components (movie-card, movie-grid, search-input, cast-card, similar-carousel)
- Navbar with FilmVerse logo, search link, auth links
- Wire all pages with existing `TmdbClient` methods

### Out of Scope
- Ratings, reviews, watchlist (need Supabase + auth)
- Social features, user profiles, lists
- Database storage of films (TMDB API only)
- Tests

## Capabilities

No existing specs in `openspec/specs/` — `film-catalog` is new.

### New Capabilities
- `film-catalog`: public movie browsing, search, film detail view

### Modified Capabilities
None

## Approach

1. Create `src/components/catalog/` components (MovieCard, MovieGrid, SearchInput, CastCard, SimilarCarousel)
2. Update `src/app/page.tsx` — add trending grid below existing hero
3. Create `src/app/search/page.tsx` — debounced input, results grid, states
4. Create `src/app/film/[id]/page.tsx` — detail view with backdrop, info, cast, similar
5. Create `src/components/layout/navbar.tsx` — logo, search, auth links
6. Update `src/app/layout.tsx` — integrate navbar

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/page.tsx` | Modified | Add trending grid below hero |
| `src/app/layout.tsx` | Modified | Include navbar |
| `src/app/search/page.tsx` | New | Full search page |
| `src/app/film/[id]/page.tsx` | New | Film detail page |
| `src/components/catalog/` | New | 5 reusable components |
| `src/components/layout/navbar.tsx` | New | Navigation bar |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| TMDB rate limits (free: 4 req/s) | Low | Client-side cache; defer similar carousel if needed |
| No TMDB_API_KEY in env → build failures | Med | Graceful fallback: empty state with message |
| n/a image domains for next/image | Low | Already configured from initial-setup |

## Rollback Plan

- `git revert HEAD` — removes all catalog files, restores landing page to hero-only state

## Dependencies

- TMDB API key in `.env.local` — warn if missing
- `lucide-react` for search icon

## Success Criteria

- [ ] Trending movies visible on landing page
- [ ] Search returns results; empty/no-results states render correctly
- [ ] Film detail shows poster, synopsis, cast, similar movies
- [ ] Navbar present on all pages with working links
- [ ] `npm run lint` passes with zero errors
- [ ] Build succeeds on Vercel (or `npm run build`)
