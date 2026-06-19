# Proposal: AI Movie Recommendations (FilmVerse)

## Intent

Mostrar en el dashboard 5 recomendaciones generadas por Gemini basadas en las reseñas (puntaje + texto) y watchlist del usuario. El usuario ve películas que probablemente le gusten sin tener que buscarlas.

## Scope

### In Scope
- `getRecommendations(reviews, watchlist)` en `src/lib/gemini.ts` — prompt con JSON mode
- `POST /api/ai/recommend` — recibe `ReviewEntry[]` + `WatchlistEntry[]`, llama a Gemini, devuelve `Recommendation[]`
- `RecommendationsSection` component — shimmer, cards, error/empty states
- Dashboard: sección "Próximas películas para ver" debajo de tendencias
- Caché en localStorage con clave `filmverse_recommendations`, se invalida al crear reseña o click en "Actualizar"
- Botón "Actualizar" manual para refrescar recomendaciones

### Out of Scope
- Match percentage exacto (Gemini no vota — pendiente diseño: porcentaje estimado vs. solo mostrar orden)
- Recomendaciones basadas en amigos, listas ajenas, o historial de navegación
- Feed diario por email
- Feedback loop ("¿Te gustó esta recomendación?")
- Integración con TMDB (Gemini recomienda por conocimiento, no por matching)

## Capabilities

> Research en `openspec/specs/`: solo existe `custom-user-lists`. No hay spec de catálogo, auth UI, ni IA.

### New Capabilities
- `ai-recommendations`: recomendaciones personalizadas con Gemini desde el dashboard

### Modified Capabilities
None

## Approach

1. **`getRecommendations`** — nuevo export en `gemini.ts`. Prompt instructivo en español rioplatense + `response_mime_type: "application/json"` + `response_schema` apuntando a `Recommendation[]`. Recibe reviews y watchlist como parámetros, los inyecta en el prompt como contexto del usuario.
2. **Route** — `POST /api/ai/recommend`. Recibe `{ reviews, watchlist }` del cliente, llama a `getRecommendations`. Manejo de errores: Gemini caído → 500, API key faltante → 503.
3. **Component** — `RecommendationsSection` (sigue el patrón de `TrendingSection`). Estados: shimmer loading, 5 recommendation cards (poster, título, razón), empty ("Agregá reseñas para recibir recomendaciones"), error ("No pudimos generar recomendaciones" + botón reintentar).
4. **Dashboard** — renderiza `<RecommendationsSection />` después de tendencias.
5. **Caché** — `getCachedRecommendations()` / `setCachedRecommendations(data)` en util aparte. Expira al crear reseña o al clickear "Actualizar".
6. **Tipo** — `Recommendation` ya existe en `types.ts`. Pendiente: agregar `matchPercentage?: number` si se resuelve incluirlo en el schema JSON de Gemini.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/lib/gemini.ts` | Modified | Nueva función `getRecommendations` |
| `src/lib/types.ts` | Modified | Extender `Recommendation` con `matchPercentage?` |
| `src/app/api/ai/recommend/route.ts` | New | POST handler |
| `src/components/home/recommendations-section.tsx` | New | Componente con todos los estados |
| `src/app/dashboard/page.tsx` | Modified | Agregar sección debajo de tendencias |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Gemini JSON mode devuelve schema inválido | Bajo | Validar con `safeParse` + reintentar 1 vez |
| TTL de caché: reseña nueva no refresca | Bajo | Invalidar en `saveReview` del `local-store` (o event listener) |
| Sin reseñas → Gemini no tiene base | Medio | Mostrar empty state "Agregá reseñas primero" sin llamar a la API |

## Rollback Plan

- `git revert HEAD` — remueve archivos nuevos, restaura `gemini.ts` y `dashboard/page.tsx`
- Alternativa: comentar la sección en dashboard y dejar la ruta (no rompe nada)

## Dependencies

- `GEMINI_API_KEY` en `.env.local` (ya existe)
- Modelo `gemini-2.5-flash` con soporte JSON mode (ya usado en el proyecto)

## Success Criteria

- [ ] Dashboard muestra "Próximas películas para ver" con 5 recomendaciones
- [ ] Cards muestran título, razón personalizada y póster
- [ ] Sin reseñas → empty state sin llamar a Gemini
- [ ] Error de API → estado de error con botón reintentar
- [ ] Clic en "Actualizar" refresca las recomendaciones
- [ ] Crear reseña nueva invalida la caché
- [ ] `npm run lint` pasa sin errores
