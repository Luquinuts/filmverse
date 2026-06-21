# Design: Supabase Migration

## Technical Approach

Reemplazar el store síncrono `local-store.ts` por un store asíncrono `src/lib/supabase/store.ts` que opera contra las tablas reales de Supabase. La `Database` interface se corrige para reflejar el schema de `migration.sql`. Componentes se migran hoja→raíz (primero los que no importan a otros, después los contenedores). API routes dejan de recibir datos del cliente y los obtienen de Supabase vía `auth.uid()`. Seed data se mueve a SQL seed o se elimina.

## Architecture Decisions

### Decision: userId management

| Opción | Tradeoff | Decisión |
|--------|----------|----------|
| `auth.uid()` implícito en store | Store no recibe userId → funciones más limpias, pero no funciona fuera de RLS (admin, server) | **Store recibe userId como parámetro** — funciones puras, reutilizables desde server y admin |
| `auth.uid()` en API routes | Las routes usan `getUser()` del server client, store no depende de auth | **Es la que va** — las routes pasan userId al store |

### Decision: Type interface vs generated types

| Opción | Tradeoff | Decisión |
|--------|----------|----------|
| supabase-js `gen:types` | Tipos exactos, pero hay que regenerar tras cada migration | **Manual `Database` + Row/Insert derives** — control total, una sola vez al migrar |
| `type ReviewRow = Database['public']['Tables']['reviews']['Row']` | DRY, reutilizable en store | **Sí** — Row para outputs, Insert para inputs |

### Decision: Migration script location

| Opción | Tradeoff | Decisión |
|--------|----------|----------|
| `src/scripts/migrate-local-data.ts` | Ejecutable con `tsx` o `node --loader tsx` | **Script autónomo** — importa `admin.ts`, lee localStorage (vía `@supabase/ssr` no sirve acá), escribe a Supabase |
| Botón en UI | Depende de usuario autenticado, más complejo | Fuera de scope — one-time, consola |

## Data Flow

```
Browser localStorage ──→ migrate-local-data.ts ──→ Supabase (service_role)
                                                      │
Component (client) ──→ supabase/store.ts ──→ Supabase (anon key + RLS)
                           │
API route ──→ server client ──→ supabase/store.ts ──→ Supabase (cookie session)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/lib/types.ts` | Modify | `Database` interface: eliminar tablas que no existen, agregar las de `migration.sql` |
| `src/lib/supabase/store.ts` | Create | Store asíncrono: profiles, reviews, watchlist, lists, follows, recommendations, stats |
| `src/scripts/migrate-local-data.ts` | Create | Script one-time: lee localStorage, escribe a Supabase via admin client |
| `src/components/reviews/review-section.tsx` | Modify | Reemplazar `getFilmReviews`/`saveReview`/`deleteReview` por store async + useState/useEffect |
| `src/components/reviews/review-card.tsx` | Modify | Importar `ReviewRow` de types.ts en vez de `ReviewEntry` de local-store |
| `src/components/lists/add-to-list-dialog.tsx` | Modify | Store async en vez de `getLists`/`addFilmToList`/etc |
| `src/components/lists/lists-tab.tsx` | Modify | Store async + Loading state |
| `src/components/lists/list-card.tsx` | Modify | Importar `CustomListRow` de types |
| `src/components/home/recommendations-section.tsx` | Modify | Quitar `getCachedRecommendations`, leer de Supabase vía API |
| `src/app/dashboard/page.tsx` | Modify | `getUserReviews`/`getUserStats`/`getWatchlist` → store async |
| `src/app/film/[id]/page.tsx` | Modify | `isInWatchlist`/`toggleWatchlist` → store async |
| `src/app/feed/page.tsx` | Modify | `ensureSeedData`/`getFeedReviews`/`toggleFollow`/`getSeedUsers` → store async |
| `src/app/profile/page.tsx` | Modify | `getUserReviews`/`getUserStats`/`getWatchlist`/`deleteReview` → store async |
| `src/app/lists/[listId]/page.tsx` | Modify | `getListById`/`deleteList`/`removeFilmFromList` → store async |
| `src/app/api/ai/recommend/route.ts` | Modify | Server obtiene reviews/watchlist de Supabase |
| `src/app/api/ai/recommend/daily/route.ts` | Modify | POST: genera + persiste; GET: lee de `public.recommendations` |
| `src/lib/local-store.ts` | Deprecate | `@deprecated` tag, mantener hasta completar migración |
| `supabase/seed.sql` | Create | Seed data SQL para usuarios demo + reseñas |

## Interfaces / Contracts

### Tipos corregidos en `types.ts`

```typescript
// Nuevas Row/Insert para el store
import type { Database } from './types';

type ReviewRow = Database['public']['Tables']['reviews']['Row'];
type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
type WatchlistRow = Database['public']['Tables']['watchlist']['Row'];
type WatchlistInsert = Database['public']['Tables']['watchlist']['Insert'];
type CustomListRow = Database['public']['Tables']['custom_lists']['Row'];
type CustomListInsert = Database['public']['Tables']['custom_lists']['Insert'];
type ListFilmRow = Database['public']['Tables']['list_films']['Row'];
type ListFilmInsert = Database['public']['Tables']['list_films']['Insert'];
type FollowRow = Database['public']['Tables']['follows']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type RecommendationRow = Database['public']['Tables']['recommendations']['Row'];
```

### Store function signatures

```typescript
// src/lib/supabase/store.ts — cada función async que tipa contra el client
export async function getProfile(client: SupabaseClient, userId: string): Promise<ProfileRow | null>
export async function updateProfile(client: SupabaseClient, userId: string, data: Partial<ProfileRow>): Promise<ProfileRow>

export async function getFilmReviews(client: SupabaseClient, filmId: number): Promise<ReviewRow[]>
export async function getUserReviews(client: SupabaseClient, userId: string): Promise<ReviewRow[]>
export async function saveReview(client: SupabaseClient, review: ReviewInsert): Promise<ReviewRow>
export async function deleteReview(client: SupabaseClient, reviewId: string): Promise<void>
export async function getUserRating(client: SupabaseClient, userId: string, filmId: number): Promise<number | null>

export async function getWatchlist(client: SupabaseClient, userId: string): Promise<WatchlistRow[]>
export async function isInWatchlist(client: SupabaseClient, userId: string, filmId: number): Promise<boolean>
export async function toggleWatchlist(client: SupabaseClient, userId: string, entry: WatchlistInsert): Promise<boolean>

export async function getLists(client: SupabaseClient, userId: string): Promise<CustomListRow[]>
export async function getListById(client: SupabaseClient, listId: string): Promise<{ list: CustomListRow; films: ListFilmRow[] } | null>
export async function createList(client: SupabaseClient, userId: string, name: string, description?: string): Promise<CustomListRow>
export async function deleteList(client: SupabaseClient, listId: string): Promise<void>
export async function addFilmToList(client: SupabaseClient, film: ListFilmInsert): Promise<void>
export async function removeFilmFromList(client: SupabaseClient, listId: string, filmId: number): Promise<void>

export async function getFollowedUsers(client: SupabaseClient, userId: string): Promise<FollowRow[]>
export async function isFollowing(client: SupabaseClient, followerId: string, followingId: string): Promise<boolean>
export async function toggleFollow(client: SupabaseClient, followerId: string, followingId: string): Promise<boolean>
export async function getFeedReviews(client: SupabaseClient, userId: string): Promise<ReviewRow[]>

export async function getUserStats(client: SupabaseClient, userId: string): Promise<{ reviewsCount: number; watchlistCount: number; averageRating: number; listsCount: number }>
export async function getDailyRecommendations(client: SupabaseClient, userId: string, date: string): Promise<RecommendationRow | null>
export async function setDailyRecommendations(client: SupabaseClient, userId: string, date: string, recommendations: Recommendation[]): Promise<void>
```

### `Database` interface corregida

Solo incluye las tablas que existen en `migration.sql`: `profiles`, `reviews`, `watchlist`, `custom_lists`, `list_films`, `follows`, `recommendations`. Sin enums. IDs son `string` (uuid). `FollowRow` usa PK compuesta (no `id`). Eliminar `users`, `films`, `watched_films`, `watchlist_films`, `ratings`, `likes`, `reports`, `premium_subscriptions`, `chat_sessions`, `daily_reports`.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Compile | Types corregidos, store compila | `npx tsc --noEmit` |
| Smoke | Dashboard carga sin error | Manual — abrir /dashboard después de migrar store |
| RLS | Cada tabla respeta policies | Verificar con `auth.uid()` statements en Supabase SQL Editor |
| Migration | Script corre sin errores | Ejecutar `tsx src/scripts/migrate-local-data.ts` en desarrollo |

## Migration / Rollout

No hay migración de datos automatizada (es one-time manual). Feature branch chain para mantener PRs bajo 400 líneas.

## Feature Branch Chain

4 PRs encadenados, branch base `main`, PRs apuntan al anterior:

| PR | Scope | ~Lines | Files |
|----|-------|--------|-------|
| **#1** Foundation | Tipos + store + deprecar local-store | ~400 | `types.ts`, `supabase/store.ts`, `local-store.ts` |
| **#2** Reviews + Watchlist | Components de review, film detail, dashboard stats | ~400 | `review-section.tsx`, `review-card.tsx`, `film/[id]/page.tsx`, `dashboard/page.tsx` |
| **#3** Lists + Profile | CRUD de listas, perfil, recomendaciones | ~380 | `lists/*`, `lists/[listId]/page.tsx`, `profile/page.tsx`, `recommendations-section.tsx` |
| **#4** Feed + API + Seed | Feed, follows, API routes diarias, migration script, seed SQL | ~400 | `feed/page.tsx`, `api/ai/recommend/*`, `migrate-local-data.ts`, `seed.sql` |

Cada PR es autónomo: PR#1 no toca componentes, PR#2 funciona con PR#1 como base, etc. PR#4 cierra el ciclo y elimina `ensureSeedData()`.

## Open Questions

- [ ] ¿La seed data demo (seed-user-001..004) se migra a Supabase como usuarios reales o solo reseñas de prueba? El spec dice "seed SQL", pero auth.users necesita usuarios existentes primero.
- [ ] `getFeedReviews` en Supabase necesita un JOIN entre reviews y follows — ¿lo hace el store o una API route? (propongo: store con dos queries)
