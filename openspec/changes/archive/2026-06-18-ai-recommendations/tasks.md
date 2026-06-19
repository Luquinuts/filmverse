# Tasks: AI Movie Recommendations

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~310 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Phase 1: Foundation (Types + Cache)

- [x] 1.1 **Extend `Recommendation` type** — `src/lib/types.ts`. Add `matchPercentage?: number` to the existing `Recommendation` interface (line 220–224), after `reason`.
- [x] 1.2 **Add cache helpers to `local-store.ts`** — `src/lib/local-store.ts`. Add `RECOMMENDATIONS_CACHE_KEY`, `RECOMMENDATIONS_TTL` (30 min), and three functions: `getCachedRecommendations()`, `setCachedRecommendations(data)`, `clearRecommendationsCache()`. Follow existing `getItem`/`setItem` pattern.
- [x] 1.3 **Wire cache invalidation into `saveReview`** — `src/lib/local-store.ts`. Call `clearRecommendationsCache()` at the end of `saveReview()` (line 91, before `return entry`).

## Phase 2: Backend (Gemini + API)

- [x] 2.1 **Add `getRecommendations` to `gemini.ts`** — `src/lib/gemini.ts`. New exported async function: `getRecommendations(reviews: ReviewEntry[], watchlist: WatchlistEntry[]): Promise<Recommendation[]>`. Build prompt in Rioplatense Spanish with review context (title + rating + content snippet) and watchlist titles. Use `response_mime_type: "application/json"` in `generation_config`, request exactly 5 results with fields `title`, `reason`, `matchPercentage`. Parse JSON, validate shape, return `[]` on any error. Import `ReviewEntry` and `WatchlistEntry` from `@/lib/local-store`, `Recommendation` from `@/lib/types`.
- [x] 2.2 **Create `POST /api/ai/recommend` route** — `src/app/api/ai/recommend/route.ts`. New file. Accept `{ reviews: ReviewEntry[], watchlist: WatchlistEntry[] }`. Return 400 if reviews empty, 503 if `GEMINI_API_KEY` missing, 500 on internal error. On success return `{ recommendations: Recommendation[] }` with 200.

## Phase 3: Frontend (Component + Dashboard)

- [x] 3.1 **Create `RecommendationsSection` component** — `src/components/home/recommendations-section.tsx`. `'use client'` client component. Props: `{ reviews: ReviewEntry[]; watchlist: WatchlistEntry[] }`. States: loading (5 shimmer placeholders matching `TrendingSection` pattern), empty (0 reviews → no API call, "Agregá reseñas para recibir recomendaciones personalizadas"), error ("No pudimos generar recomendaciones. Intentalo de nuevo." + retry button), success (responsive grid 2→3→4 cols, each card: gradient poster placeholder, title, "XX% de match" badge, reason text). Cache check on mount: if `filmverse_recommendations` valid (< 30 min), render cached data without fetch. "Actualizar recomendaciones" button clears cache and refetches. Section title: "Próximas películas para ver".
- [x] 3.2 **Wire into dashboard** — `src/app/dashboard/page.tsx`. Import `RecommendationsSection`. Import `getWatchlist` from `@/lib/local-store`. After the trending section (line 162), add `<RecommendationsSection reviews={reviews} watchlist={watchlist} />`. Get `watchlist` from `getWatchlist()` alongside `reviews` in the render section around line 162.

## Phase 4: Verification

- [ ] 4.1 **Verify cache behavior** — Confirm `saveReview()` clears `filmverse_recommendations` from localStorage. Confirm component loads from cache on mount when valid.
- [ ] 4.2 **Verify component states** — Confirm shimmer shows during fetch, cards render with 5 recommendations, empty message shows when no reviews, error state shows with retry button on API failure.
- [ ] 4.3 **Verify `getRecommendations` error resilience** — Confirm `getRecommendations` returns `[]` when: Gemini returns invalid JSON, network fails, empty response.
- [ ] 4.4 **Verify `npm run lint`** passes with no errors.
