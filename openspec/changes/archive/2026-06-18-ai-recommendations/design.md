# Design: AI Movie Recommendations

## Technical Approach

Server-side Gemini call with JSON mode, cached on the client via localStorage. The dashboard collects the user's reviews and watchlist from `local-store`, POSTs them to a new API route, which delegates to a new `getRecommendations()` function in the existing Gemini client. Results are cached for 30 minutes and invalidated on new review creation or manual refresh.

## Architecture Decisions

### Decision: Client-side cache over server cache

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Server-side cache (Redis/DB) | Requires infra, auth token per user | ❌ Rejected |
| localStorage cache | Survives refreshes, zero infra, matches local-store pattern | ✅ Selected |

**Rationale**: The entire app currently uses localStorage for persistence (no Supabase connected yet). Adding Redis would be premature and inconsistent with the existing pattern.

### Decision: Single POST body vs. multiple fetches

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Client sends reviews + watchlist in one POST | One round-trip, Gemini sees full context | ✅ Selected |
| Server fetches from DB | Needs DB connection, auth validation | ❌ Rejected |

**Rationale**: Simpler, matches the local-store-only architecture. When Supabase is wired, the route can fetch from DB instead of receiving from client.

### Decision: Shimmer loading over skeleton text

**Choice**: 5 animated pulse cards matching the card grid shape
**Rationale**: Matches `TrendingSection` pattern (`animate-shimmer` + `bg-glass-bg`). Users perceive faster load times with skeleton UIs.

## Data Flow

```
Dashboard (client)
  ├── getUserReviews(userId) → ReviewEntry[]
  ├── getWatchlist() → WatchlistEntry[]
  ├── check localStorage cache (filmverse_recommendations)
  │   ├── valid (< 30 min) → render cached recommendations
  │   └── expired/missing → POST /api/ai/recommend
  │       ├── body: { reviews, watchlist }
  │       └── response: { recommendations: Recommendation[] }
  │           └── write cache → render RecommendationsSection
  └── on "Actualizar" click → clear cache → re-fetch
```

## File Changes

| File | Action | Description |
|------|--------|------------|
| `src/lib/types.ts` | Modify | Add `matchPercentage?: number` to `Recommendation` |
| `src/lib/local-store.ts` | Modify | Add `getCachedRecommendations`, `setCachedRecommendations`, `clearRecommendationsCache`; call clear in `saveReview` |
| `src/lib/gemini.ts` | Modify | Add `getRecommendations(reviews, watchlist)` with JSON-mode prompt |
| `src/app/api/ai/recommend/route.ts` | Create | POST handler → validate → call `getRecommendations` → return |
| `src/components/home/recommendations-section.tsx` | Create | Client component with shimmer/cards/error/empty states |
| `src/app/dashboard/page.tsx` | Modify | Import and render `<RecommendationsSection>` after trending |

## Interfaces / Contracts

### Recommendation type (extended)

```typescript
export interface Recommendation {
  filmId: number;
  title: string;
  reason: string;
  matchPercentage?: number; // NEW — Gemini-estimated compatibility
}
```

### getRecommendations signature

```typescript
async function getRecommendations(
  reviews: ReviewEntry[],
  watchlist: WatchlistEntry[],
): Promise<Recommendation[]>
```

### API contract

```
POST /api/ai/recommend
Body: { reviews: ReviewEntry[], watchlist: WatchlistEntry[] }
200 → { recommendations: Recommendation[] }
400 → { error: "No hay reseñas" }
500 → { error: "Error interno del servidor" }
```

## Gemini Integration

New function in `src/lib/gemini.ts` — separate from `sendMessage` (no shared prompt/state). Uses `response_mime_type: "application/json"` with `response_schema` matching `Recommendation[]`. Temperature 0.7, max output tokens 1000. Prompt in Rioplatense Spanish instructing Gemini to return exactly 5 recommendations.

Error handling: parse failure → `[]`, Gemini throws → `[]`, empty response → `[]`. The component handles empty array as empty state.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `getRecommendations` prompt building | Mock fetch, assert prompt contains review titles + watchlist |
| Unit | Cache helpers | Read/write/expire/toggle with mocked localStorage |
| Integration | API route validation | POST without reviews → 400; valid body → 200 shape |
| E2E | Dashboard flow | Seed reviews, verify recommendations render |

## Migration / Rollout

No migration required. Feature is additive — no existing behavior changes.

## Open Questions

- [ ] `matchPercentage`: should Gemini estimate it, or we just order by position (1st = best match)? Out of scope per proposal; decide post-MVP.
- [ ] What happens when the watchlist is huge (50+ films)? Truncate to top 15 in the prompt to avoid token limits.
