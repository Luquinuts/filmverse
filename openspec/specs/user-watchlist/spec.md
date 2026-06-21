# User Watchlist — Especificación

## Propósito

Permite agregar y remover películas de la watchlist del usuario contra `public.watchlist`.

## Datos

| Concepto | Detalle |
|----------|---------|
| Tabla | `public.watchlist` |
| Unique | `unique(user_id, film_id)` — idempotencia sin duplicados |
| RLS | SELECT/INSERT/DELETE solo `auth.uid() = user_id` |

## Contrato de API

| Función | Input | Output |
|---------|-------|--------|
| `getWatchlist(client, userId)` | `SupabaseClient, string` | `WatchlistRow[]` |
| `isInWatchlist(client, userId, filmId)` | `SupabaseClient, string, number` | `boolean` |
| `toggleWatchlist(client, userId, entry)` | `SupabaseClient, string, Omit<WatchlistInsert, user_id>` | `{ added: boolean }` |

## Scenarios de verificación

| # | Escenario | Expectativa |
|---|-----------|-------------|
| 1 | Agregar film | INSERT exitoso, film aparece en watchlist |
| 2 | Remover film | DELETE exitoso, film ya no está |
| 3 | Agregar mismo film dos veces | Unique constraint rechaza duplicado |
| 4 | Leer watchlist de otro usuario | RLS devuelve 0 filas |
