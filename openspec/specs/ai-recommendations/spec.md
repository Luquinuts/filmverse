# AI Movie Recommendations — Especificación

## Propósito

Generar 5 recomendaciones personalizadas vía Gemini desde reseñas y watchlist del usuario. Las recomendaciones se persisten en `public.recommendations` con cache diario por `unique(user_id, report_date)`.

## Datos

| Concepto | Detalle |
|----------|---------|
| `Recommendation.matchPercentage` | `number`, 0–100 |
| Persistencia | `public.recommendations` — JSONB, `unique(user_id, report_date)` |
| Cache TTL | Diario (por `report_date`) |
| Cache invalidation | Nueva reseña o click "Actualizar recomendaciones" |
| Store | Asíncrono via `src/lib/supabase/store.ts` |

## API Route: POST /api/ai/recommend

**Request body**: `{ userId?: string }` — si no se envía userId, el server obtiene `auth.uid()`.
**Response éxito**: `{ recommendations: Recommendation[] }` (200)
**Response error**: `{ error: string }` (400/500/503)

| Status | Condición |
|--------|-----------|
| 200 | Gemini responde OK |
| 400 | reviews vacío |
| 500 | Error interno o Gemini caído |
| 503 | `GEMINI_API_KEY` no configurada |

**Comportamiento**: El server obtiene reviews + watchlist de Supabase vía server client (`createClient` de `server.ts`) con `auth.uid()`. Backward compatible con clients que envían datos.

## API Route: POST /api/ai/recommend/daily

**POST**: Genera recomendaciones con Gemini y persiste en `public.recommendations` con `setDailyRecommendation`. Si ya existe para `(user_id, report_date)`, devuelve el caché sin llamar a Gemini.

**GET**: Devuelve recomendaciones desde `public.recommendations` con query param `userId`. Cache diario vía `unique(user_id, report_date)`.

## Gemini: getRecommendations

Nueva función en `src/lib/gemini.ts`:
`getRecommendations(reviews, watchlist): Promise<Recommendation[]>`

- Prompt en español rioplatense
- `response_mime_type: "application/json"` con schema
- EXACTAMENTE 5 resultados: `title`, `reason`, `matchPercentage`
- Fallback: JSON inválido → `[]`

## Componente: RecommendationsSection

`'use client'` — Props: `{ reviews: ReviewRow[]; watchlist: WatchlistRow[] }`.

| Estado | Comportamiento |
|--------|---------------|
| Loading | Shimmer skeleton 5 placeholders |
| Success | Grilla responsive 2→3→4 cols, cada card: poster placeholder, título, "XX% de match", razón |
| Empty (0 reviews) | "Agregá reseñas para recibir recomendaciones personalizadas" — sin llamada API |
| Error | "No pudimos generar recomendaciones. Intentalo de nuevo." + botón "Reintentar" |

Botón "Actualizar recomendaciones" en top right del section header. Invalida cache y refetch.

### Cache flow
- Mount → GET `/api/ai/recommend/daily` con userId
- Válido (misma fecha) → mostrar sin fetch a Gemini
- Expirado/ausente → POST a `/api/ai/recommend/daily` → generar y cachear

## Dashboard

Importar `getReviews` y `getWatchlist` de `supabase/store.ts`, pasar a `<RecommendationsSection />`, renderizar después de `TrendingSection`.

## Textos UI (español rioplatense)

| Contexto | Texto |
|----------|-------|
| Section title | "Próximas películas para ver" |
| Botón actualizar | "Actualizar recomendaciones" |
| Empty state | "Agregá reseñas para recibir recomendaciones personalizadas" |
| Error state | "No pudimos generar recomendaciones. Intentalo de nuevo." |
| Match label | "{XX}% de match" |
| Card label | "Recomendación" |

## Scenarios de verificación

| # | Escenario | Expectativa |
|---|-----------|-------------|
| 1 | Usuario con 5+ reseñas | 5 cards visibles con match % |
| 2 | Usuario sin reseñas | Empty state, no API call |
| 3 | API error | Error state + reintentar |
| 4 | Cache diario válido | GET sin llamar a Gemini |
| 5 | Nueva reseña | Cache invalida, próxima GET refresca |
| 6 | Click "Actualizar" | POST regenera desde Gemini |

## Store API

| Función | Input | Output |
|---------|-------|--------|
| `getDailyRecommendation(client, userId, date)` | `SupabaseClient, string, string (YYYY-MM-DD)` | `RecommendationRow \| null` |
| `setDailyRecommendation(client, userId, date, data)` | `SupabaseClient, string, string, Recommendation[]` | `void` |
