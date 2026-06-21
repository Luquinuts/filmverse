# User Follows — Especificación

## Propósito

Sistema de follows entre usuarios contra `public.follows`. Permite seguir/dejar de seguir y construir el feed de reviews de seguidos.

## Datos

| Concepto | Detalle |
|----------|---------|
| Tabla | `public.follows` |
| `follower_id` | Siempre `auth.uid()` |
| CHECK | `follower_id <> following_id` — impide auto-follow |
| RLS | SELECT público, INSERT/DELETE solo `auth.uid() = follower_id` |

## Contrato de API

| Función | Input | Output |
|---------|-------|--------|
| `getFollowedUsers(client, userId)` | `SupabaseClient, string` | `FollowRow[]` |
| `getFollowers(client, userId)` | `SupabaseClient, string` | `FollowRow[]` |
| `isFollowing(client, followerId, followingId)` | `SupabaseClient, string, string` | `boolean` |
| `toggleFollow(client, followerId, followingId)` | `SupabaseClient, string, string` | `{ following: boolean }` |
| `getFeedReviews(client, userId)` | `SupabaseClient, string` | `ReviewRow[]` |

## Scenarios de verificación

| # | Escenario | Expectativa |
|---|-----------|-------------|
| 1 | Seguir usuario | INSERT con `follower_id = auth.uid()` |
| 2 | Dejar de seguir | DELETE por PK compuesta |
| 3 | Auto-follow | CHECK constraint lo rechaza |
| 4 | Feed de seguidos | SELECT reviews de `following_id IN (...)` |
