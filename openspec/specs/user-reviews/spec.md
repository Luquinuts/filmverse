# User Reviews — Especificación

## Propósito

CRUD completo de reseñas de películas contra `public.reviews`. Store asíncrono en `src/lib/supabase/store.ts`.

## Datos

| Concepto | Detalle |
|----------|---------|
| Tabla | `public.reviews` |
| Rating | CHECK constraint 1–10 |
| `updated_at` | Trigger `set_updated_at_reviews` se actualiza automáticamente |
| RLS | SELECT público, INSERT/UPDATE/DELETE solo `auth.uid() = user_id` |
| Campos | `film_id`, `film_title`, `rating`, `content` |

## Contrato de API

| Función | Input | Output |
|---------|-------|--------|
| `getFilmReviews(client, filmId)` | `SupabaseClient, number` | `ReviewRow[]` |
| `getReviews(client, userId?)` | `SupabaseClient, string (opcional)` | `ReviewRow[]` |
| `saveReview(client, userId, review)` | `SupabaseClient, string, Omit<ReviewInsert, user_id>` | `ReviewRow` |
| `deleteReview(client, reviewId)` | `SupabaseClient, string` | `void` |
| `getUserRating(client, userId, filmId)` | `SupabaseClient, string, number` | `ReviewRow \| null` |

## Scenarios de verificación

| # | Escenario | Expectativa |
|---|-----------|-------------|
| 1 | Crear reseña | INSERT retorna reseña con `user_id = auth.uid()` |
| 2 | Leer reseñas de film | SELECT `WHERE film_id = X` devuelve todas |
| 3 | Actualizar reseña propia | `updated_at` se actualiza automáticamente |
| 4 | Eliminar reseña propia | DELETE exitoso, 1 fila afectada |
| 5 | UPDATE reseña ajena | RLS rechaza, 0 filas afectadas |
| 6 | Rating fuera de rango | CHECK constraint rechaza INSERT/UPDATE |
