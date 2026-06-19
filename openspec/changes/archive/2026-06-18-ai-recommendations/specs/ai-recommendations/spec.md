# AI Movie Recommendations — Especificación

## Propósito

Generar 5 recomendaciones personalizadas vía Gemini desde reseñas (puntaje + texto) y watchlist del usuario. Se muestran en el dashboard tras la sección de tendencias.

## Datos

| Concepto | Detalle |
|----------|---------|
| `Recommendation.matchPercentage?` | Extender `src/lib/types.ts` — `number`, 0–100 |
| Cache key | `filmverse_recommendations` |
| Cache shape | `{ data: Recommendation[], timestamp: number }` |
| Cache TTL | 30 minutos |
| Cache invalidation | `saveReview()` o click "Actualizar recomendaciones" |

## API Route: POST /api/ai/recommend

**Request**: `{ reviews: ReviewEntry[], watchlist: WatchlistEntry[] }`
**Response éxito**: `{ recommendations: Recommendation[] }` (200)
**Response error**: `{ error: string }` (400/500/503)

| Status | Condición |
|--------|-----------|
| 200 | Gemini responde OK |
| 400 | reviews vacío |
| 500 | Error interno o Gemini caído |
| 503 | `GEMINI_API_KEY` no configurada |

## Gemini: getRecommendations

Nueva función en `src/lib/gemini.ts`:
`getRecommendations(reviews, watchlist): Promise<Recommendation[]>`

- Prompt en español rioplatense
- `response_mime_type: "application/json"` con schema
- EXACTAMENTE 5 resultados: `title`, `reason`, `matchPercentage`
- Fallback: JSON inválido → `[]`

## Componente: RecommendationsSection

`'use client'` — Props: `{ reviews: ReviewEntry[]; watchlist: WatchlistEntry[] }`.

| Estado | Comportamiento |
|--------|---------------|
| Loading | Shimmer skeleton 5 placeholders |
| Success | Grilla responsive 2→3→4 cols, cada card: poster placeholder, título, "XX% de match", razón |
| Empty (0 reviews) | "Agregá reseñas para recibir recomendaciones personalizadas" — sin llamada API |
| Error | "No pudimos generar recomendaciones. Intentalo de nuevo." + botón "Reintentar" |

Botón "Actualizar recomendaciones" en top right del section header. Invalida cache y refetch.

### Cache flow
- Mount → check `filmverse_recommendations` en localStorage
- Válido (< 30 min) → mostrar sin fetch
- Expirado/ausente → POST a `/api/ai/recommend` → cachear resultado

## Dashboard

Importar `getReviews` y `getWatchlist` de local-store, pasar a `<RecommendationsSection />`, renderizar después de `TrendingSection`.

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
| 4 | Cache válido | Instant load sin fetch |
| 5 | Nueva reseña | Cache invalidado al volver al dashboard |
| 6 | Click "Actualizar" | Refresca desde Gemini |
