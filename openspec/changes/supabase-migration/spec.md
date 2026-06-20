# Supabase Migration — Especificación

Migración de localStorage a Supabase. Store asíncrono unificado en `src/lib/supabase/store.ts`.

---

## user-profiles (NUEVO)

### Requerimientos

- El sistema DEBE crear un perfil en `public.profiles` automáticamente al registrarse el usuario, vía trigger `on_auth_user_created`.
- `profiles` DEBE tener RLS: SELECT público, INSERT/UPDATE solo `auth.uid() = id`.
- El trigger DEBE garantizar `username` único (auto-incremento si existe conflicto).
- El perfil inicial DEBE incluir `id = auth.uid()`, `username` (de `raw_user_meta_data` o email), `avatar_url = null`.

### Escenarios

| # | Escenario | Expectativa |
|---|-----------|-------------|
| 1 | Registro con username único | Trigger crea profile con ese username |
| 2 | Registro con username duplicado | Trigger auto-incrementa (ej: `user` → `user1`) |
| 3 | SELECT público | Cualquier usuario ve todos los profiles |
| 4 | UPDATE perfil ajeno | RLS rechaza (0 filas afectadas) |

### Criterios de Aceptación

- [ ] Profile creado en `public.profiles` tras cada signup
- [ ] Username único garantizado por el trigger
- [ ] SELECT público funciona sin autenticación
- [ ] UPDATE/INSERT rechazado para `id ≠ auth.uid()`

### Contrato de API

| Función | Input | Output |
|---------|-------|--------|
| `getProfile(userId)` | `string` | `Profile \| null` |
| `updateProfile(data)` | `Partial<Profile>` | `Profile` |

---

## user-reviews (NUEVO)

### Requerimientos

- El sistema DEBE permitir CRUD completo de reseñas en `public.reviews`.
- `rating` DEBE estar entre 1 y 10 (CHECK constraint).
- `updated_at` DEBE actualizarse automáticamente vía trigger `set_updated_at_reviews`.
- RLS DEBE permitir SELECT público, INSERT/UPDATE/DELETE solo `auth.uid() = user_id`.
- Cada reseña DEBE incluir `film_id`, `film_title`, `rating`, `content`.

### Escenarios

| # | Escenario | Expectativa |
|---|-----------|-------------|
| 1 | Crear reseña | INSERT retorna reseña con `user_id = auth.uid()` |
| 2 | Leer reseñas de film | SELECT `WHERE film_id = X` devuelve todas |
| 3 | Actualizar reseña propia | `updated_at` se actualiza automáticamente |
| 4 | Eliminar reseña propia | DELETE exitoso, 1 fila afectada |
| 5 | UPDATE reseña ajena | RLS rechaza, 0 filas afectadas |
| 6 | Rating fuera de rango | CHECK constraint rechaza INSERT/UPDATE |

### Criterios de Aceptación

- [ ] CRUD completo contra `public.reviews`
- [ ] RLS permite solo dueño para escritura
- [ ] `updated_at` se actualiza en UPDATE
- [ ] Rating validado (1–10) a nivel DB

### Contrato de API

| Función | Input | Output |
|---------|-------|--------|
| `getFilmReviews(filmId)` | `number` | `ReviewRow[]` |
| `getUserReviews(userId)` | `string` | `ReviewRow[]` |
| `saveReview(review)` | `ReviewInsert` | `ReviewRow` |
| `deleteReview(id)` | `string` | `void` |
| `getUserRating(filmId)` | `number` | `number \| null` |

---

## user-watchlist (NUEVO)

### Requerimientos

- El sistema DEBE permitir agregar y remover películas de `public.watchlist`.
- `unique(user_id, film_id)` DEBE garantizar idempotencia (sin duplicados).
- RLS DEBE limitar SELECT/INSERT/DELETE a `auth.uid() = user_id`.

### Escenarios

| # | Escenario | Expectativa |
|---|-----------|-------------|
| 1 | Agregar film | INSERT exitoso, film aparece en watchlist |
| 2 | Remover film | DELETE exitoso, film ya no está |
| 3 | Agregar mismo film dos veces | Unique constraint rechaza duplicado |
| 4 | Leer watchlist de otro usuario | RLS devuelve 0 filas |

### Criterios de Aceptación

- [ ] Toggle agrega/remueve correctamente
- [ ] Unique constraint evita duplicados por (user_id, film_id)
- [ ] RLS: solo dueño ve y modifica

### Contrato de API

| Función | Input | Output |
|---------|-------|--------|
| `getWatchlist()` | — | `WatchlistRow[]` |
| `isInWatchlist(filmId)` | `number` | `boolean` |
| `toggleWatchlist(entry)` | `WatchlistInsert` | `boolean` |

---

## user-follows (NUEVO)

### Requerimientos

- El sistema DEBE permitir seguir/dejar de seguir en `public.follows`.
- `follower_id` SIEMPRE DEBE ser `auth.uid()`.
- `check(follower_id <> following_id)` DEBE impedir auto-follow.
- RLS DEBE permitir SELECT público, INSERT/DELETE solo `auth.uid() = follower_id`.

### Escenarios

| # | Escenario | Expectativa |
|---|-----------|-------------|
| 1 | Seguir usuario | INSERT con `follower_id = auth.uid()` |
| 2 | Dejar de seguir | DELETE por PK compuesta |
| 3 | Auto-follow | CHECK constraint lo rechaza |
| 4 | Feed de seguidos | SELECT reviews de `following_id IN (...)` |

### Criterios de Aceptación

- [ ] Follow/unfollow con toggle correcto
- [ ] Auto-follow rechazado por DB
- [ ] Feed de reviews incluye seguidos
- [ ] RLS: SELECT público, INSERT/DELETE solo dueño

### Contrato de API

| Función | Input | Output |
|---------|-------|--------|
| `getFollowedUsers()` | — | `FollowRow[]` |
| `isFollowing(userId)` | `string` | `boolean` |
| `toggleFollow(followedId)` | `string` | `boolean` |
| `getFeedReviews()` | — | `ReviewRow[]` |

---

## data-migration (NUEVO)

### Requerimientos

- El sistema DEBE proveer un script one-time que lea datos de localStorage (`filmverse_reviews`, `filmverse_watchlist`, `filmverse_custom_lists`, `filmverse_follows`) y los inserte en Supabase.
- El script DEBE ejecutarse con `service_role` (bypass RLS) para migrar datos históricos.
- El script DEBE ser idempotente: si un registro ya existe, lo omite.
- El script DEBE loggear cada paso (registros migrados, omitidos, errores).

### Escenarios

| # | Escenario | Expectativa |
|---|-----------|-------------|
| 1 | Migración completa | Todos los registros existen en Supabase |
| 2 | Datos duplicados | Omite sin errores (idempotente) |
| 3 | Sin datos locales | Log "Sin datos para migrar", sin inserts |
| 4 | Error de conexión | Logea error, detiene migración |

### Criterios de Aceptación

- [ ] Script migra reseñas, watchlist, listas y follows
- [ ] Idempotente: ejecutar dos veces no duplica datos
- [ ] Log por consola de cada paso de migración
- [ ] Detiene ante error, no deja datos parciales inconsistentes

### Contrato de API

Script autónomo (`src/scripts/migrate-local-to-supabase.ts` o similar). Sin interfaz de componentes. Ejecución manual.

---

## custom-user-lists (MODIFICADO)

### Requerimiento: CRUD contra Supabase

(Previously: Almacenamiento bajo clave `filmverse_custom_lists` en localStorage)

Usuarios DEBEN poder crear listas con nombre, agregar/remover películas, y navegar cada lista en una ruta dedicada. Los datos ahora viven en `public.custom_lists` y `public.list_films` con RLS.
`custom_lists` incluye campo `is_public` (default false). IDs son UUID generados por `gen_random_uuid()`.

#### Escenario: Ciclo de vida (actualizado)
- GIVEN usuario autenticado
- WHEN `createList("Clásicos")` → `public.custom_lists` tiene `{name: "Clásicos", user_id: auth.uid()}`
- WHEN `addFilmToList(id, {filmId: 1, ...})` → `public.list_films` tiene `{list_id, film_id: 1}`
- WHEN `removeFilmFromList(id, 1)` → registro eliminado de `public.list_films`
- WHEN `deleteList(id)` → CASCADE elimina `list_films` asociados

#### Escenario: RLS propietario
- GIVEN usuario B intenta acceder lista de usuario A
- THEN RLS devuelve 0 filas

### Criterios de Aceptación

- [ ] CRUD funciona contra `public.custom_lists` + `public.list_films`
- [ ] CASCADE elimina films al borrar lista
- [ ] RLS: solo dueño ve y modifica listas
- [ ] UI scenarios del spec original se mantienen (solo cambia data layer)

### Contrato de API

| Función | Input | Output |
|---------|-------|--------|
| `getLists()` | — | `CustomListRow[]` |
| `getListById(id)` | `string` | `{ list: CustomListRow; films: ListFilmRow[] } \| null` |
| `createList(name, description)` | `string, string` | `CustomListRow` |
| `deleteList(id)` | `string` | `void` |
| `renameList(id, name)` | `string, string` | `void` |
| `addFilmToList(listId, film)` | `string, ListFilmInsert` | `void` |
| `removeFilmFromList(listId, filmId)` | `string, number` | `void` |
| `getListFilms(listId)` | `string` | `ListFilmRow[]` |
| `isFilmInList(listId, filmId)` | `string, number` | `boolean` |

---

## ai-recommendations (MODIFICADO)

### Requerimiento: Persistencia en Supabase

(Previously: Cache en localStorage con key `filmverse_recommendations`, TTL 30 min)

El sistema DEBE persistir las recomendaciones de Gemini en `public.recommendations` como JSONB, con `unique(user_id, report_date)` para cache diario. El store es asíncrono: las recomendaciones se leen/escriben via Supabase en lugar del cache síncrono de localStorage.

#### Escenario: Generación diaria
- GIVEN usuario con reseñas genera recomendaciones
- WHEN POST a `/api/ai/recommend` completa
- THEN `public.recommendations` tiene `{user_id, report_date: today, recommendations: [...]}`

#### Escenario: Cache diario
- GIVEN ya existe un registro para `user_id + today`
- WHEN consulta recomendaciones
- THEN devuelve el registro existente sin llamar a Gemini

#### Escenario: Sin reseñas
- GIVEN usuario sin reseñas
- WHEN solicita recomendaciones
- THEN store retorna `[]`, no hay insert en `public.recommendations`

### Criterios de Aceptación

- [ ] Recomendaciones se persisten por `(user_id, report_date)`
- [ ] Unique constraint evita duplicados diarios
- [ ] Sin reseñas → sin llamada a Gemini, sin insert
- [ ] API route lee/escribe de `public.recommendations` en vez de localStorage

### Contrato de API

| Función | Input | Output |
|---------|-------|--------|
| `getDailyRecommendations(date)` | `string` (YYYY-MM-DD) | `Recommendation[] \| null` |
| `setDailyRecommendations(date, data)` | `string, Recommendation[]` | `void` |
