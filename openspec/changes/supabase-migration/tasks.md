# Tasks: Supabase Migration — localStorage a Supabase

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1,580 (4 PRs × ~400) |
| 400-line budget risk | Medium |
| Chained PRs recommended | Yes |
| Suggested split | PR #1 → PR #2 → PR #3 → PR #4 |
| Delivery strategy | feature-branch-chain (pre-resolved) |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Database interface corregida + store async + deprecar local-store | PR #1 | Base de toda la migración. Base = `main` → feature branch. |
| 2 | Migrar reviews + watchlist (review-section, review-card, film/[id], dashboard) | PR #2 | Base = PR #1 branch. Depende de store.ts y Database. |
| 3 | Migrar listas + perfil + recomendaciones | PR #3 | Base = PR #2 branch. Depende de store.ts. |
| 4 | Feed + API routes diarias + migration script + eliminar seed data | PR #4 | Base = PR #3 branch. Cierra el ciclo. |

## Phase 1: Foundation — Tipos, Store, Deprecación (PR #1)

- [x] 1.1 Corregir `Database` en `src/lib/types.ts`: mantener solo `profiles`, `reviews`, `watchlist`, `custom_lists`, `list_films`, `follows`, `recommendations`. IDs uuid, PK compuesta en follows. Eliminar `users`, `films`, `watched_films`, `watchlist_films`, `ratings`, `likes`, `reports`, `premium_subscriptions`, `chat_sessions`, `daily_reports`, y todos los Enums. Mantener interfaces de dominio (MovieSearchResult, Recommendation, etc.)
- [x] 1.2 Crear `src/lib/supabase/store.ts`: exportar funciones async que reciben `SupabaseClient` + `userId`. Funciones: `getProfile`, `updateProfile`, `getFilmReviews`, `getReviews`, `saveReview`, `deleteReview`, `getUserRating`, `getWatchlist`, `isInWatchlist`, `toggleWatchlist`, `getLists`, `getListById`, `createList`, `deleteList`, `addFilmToList`, `removeFilmFromList`, `getFilmLists`, `getFollowedUsers`, `getFollowers`, `isFollowing`, `toggleFollow`, `getFeedReviews`, `getUserStats`, `getDailyRecommendation`, `setDailyRecommendation`. Tipar con `Database['public']['Tables']['X']['Row'|'Insert']`.
- [x] 1.3 Deprecar `src/lib/local-store.ts`: agregar `/** @deprecated Usar supabase/store.ts en su lugar */` al inicio del archivo. No cambiar lógica interna — se mantiene para el script de migración y rollback.
- [x] 1.4 Evaluar imports en `gemini.ts`: `ReviewEntry` y `WatchlistEntry` son tipos internos de local-store que aún se usan en `getRecommendations()`. No hay equivalente directo en types.ts. La migración de gemini.ts está planificada para PR#4. El import actual funciona porque local-store está deprecated pero funcional. No requiere cambios en esta etapa.

## Phase 2: Migrar Reviews + Watchlist (PR #2)

- [x] 2.1 Migrar `src/components/reviews/review-card.tsx`: importar `ReviewRow` de types en vez de `ReviewEntry` de local-store. Ajustar props.
- [x] 2.2 Migrar `src/components/reviews/review-section.tsx`: reemplazar `getFilmReviews`/`saveReview`/`deleteReview` por store async + `useState`/`useEffect`. Crear cliente Supabase con `createClient()` de `client.ts`.
- [x] 2.3 Migrar `src/app/film/[id]/page.tsx`: reemplazar `isInWatchlist`/`toggleWatchlist` por store async. Obtener userId de `auth.uid()`.
- [x] 2.4 Migrar `src/app/dashboard/page.tsx`: reemplazar `getUserReviews`/`getUserStats`/`getWatchlist` por store async. Mostrar loading states.

## Phase 3: Migrar Listas + Perfil (PR #3)

- [x] 3.1 Migrar `src/components/lists/add-to-list-dialog.tsx`: store async (`getLists`, `addFilmToList`, `isFilmInList`).
- [x] 3.2 Migrar `src/components/lists/lists-tab.tsx`: store async (`getLists`, `createList`, `deleteList`, `renameList`).
- [x] 3.3 Migrar `src/components/lists/list-card.tsx`: importar `CustomListRow` de types.
- [x] 3.4 Migrar `src/app/lists/[listId]/page.tsx`: store async (`getListById`, `deleteList`, `removeFilmFromList`, `addFilmToList`).
- [x] 3.5 Migrar `src/app/profile/page.tsx`: store async (`getUserReviews`, `getUserStats`, `getWatchlist`, `deleteReview`).
- [x] 3.6 Migrar `src/components/home/recommendations-section.tsx`: quitar `getCachedRecommendations`/`setCachedRecommendations`, leer de API `/api/ai/recommend/daily` vía fetch.

## Phase 4: Feed + API + Migración (PR #4)

- [ ] 4.1 Migrar `src/app/feed/page.tsx`: store async (`getFollowedUsers`, `toggleFollow`, `getFeedReviews`). Eliminar `ensureSeedData()` y `getSeedUsers()`.
- [ ] 4.2 Modificar `src/app/api/ai/recommend/route.ts`: server obtiene reviews + watchlist de Supabase vía server client (`createClient` de `server.ts`) en vez de recibirlos del cliente.
- [ ] 4.3 Modificar `src/app/api/ai/recommend/daily/route.ts`: POST genera recomendaciones + persiste en `public.recommendations`. GET devuelve desde DB. Cache diario vía `unique(user_id, report_date)`.
- [ ] 4.4 Crear `src/scripts/migrate-local-data.ts`: script one-time con `tsx`. Lee localStorage (`filmverse_reviews`, `filmverse_watchlist`, `filmverse_custom_lists`, `filmverse_follows`), escribe a Supabase con `service_role`. Idempotente: upsert por ID/unique. Logea cada paso.
- [ ] 4.5 Eliminar `ensureSeedData()` del feed (`call` + import). Seed data se reemplaza por datos SQL reales en Supabase.
- [ ] 4.6 `npx tsc --noEmit` final + smoke test manual en `/dashboard`, `/feed`, `/profile`, `/film/[id]`.
