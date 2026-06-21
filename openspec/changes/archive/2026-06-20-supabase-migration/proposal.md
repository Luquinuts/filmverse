# Proposal: Supabase Migration

## Intent

Migrar toda la persistencia de datos de localStorage a Supabase. Hoy las reseñas, watchlist, listas, follows y recomendaciones viven en localStorage con `userId: 'mock-user-001'`. No persisten entre dispositivos, no escalan e impiden tener autenticación real.

## Scope

### In Scope
- Nuevo store asíncrono `src/lib/supabase/store.ts` (CRUD contra Supabase)
- Migrar 14 componentes/páginas que importan de `local-store.ts`
- Reemplazar `mock-user-001` por `auth.uid()`
- Eliminar seed data (`ensureSeedData`, `SEED_USERS`, `SEED_REVIEWS`)
- Corregir interfaz `Database` en `types.ts` contra schema real
- Script one-time de migración de datos existentes

### Out of Scope
- UI de login/registro (ya existe con Supabase Auth)
- Nuevas features de negocio (solo migración de data layer)
- Tests automatizados (proyecto sin test runner)

## Capabilities

### New Capabilities
- `data-migration`: Script one-time para migrar localStorage a Supabase
- `user-profiles`: Perfiles vinculados a `auth.users`
- `user-reviews`: CRUD de reseñas contra `public.reviews`
- `user-watchlist`: CRUD de watchlist contra `public.watchlist`
- `user-follows`: Follows contra `public.follows`

### Modified Capabilities
- `custom-user-lists`: CRUD migra de localStorage a `public.custom_lists` + `list_films`
- `ai-recommendations`: Fuente de datos migra a Supabase; recomendaciones se persisten en `public.recommendations`

## Approach

Crear `src/lib/supabase/store.ts` como reemplazo asíncrono de `local-store.ts`. Cada función síncrona (`getReviews()`, `saveReview()`, `toggleWatchlist()`, etc.) tiene su equivalente async. Los componentes se migran 1x1 empezando por dashboard y review-section. El seed data se elimina (los datos demo via seed SQL en Supabase). `local-store.ts` se depreca con `@deprecated` pero se mantiene temporalmente para el script de migración.

## Affected Areas

| Area | Impact |
|------|--------|
| `src/lib/supabase/store.ts` | **New** |
| `src/lib/types.ts` | **Modified** — `Database` contra schema real |
| `src/lib/local-store.ts` | **Deprecated** |
| `src/lib/gemini.ts` | **Modified** — tipos del nuevo store |
| `src/app/dashboard/page.tsx` | **Modified** |
| `src/app/film/[id]/page.tsx` | **Modified** |
| `src/app/feed/page.tsx` | **Modified** — seed data out |
| `src/app/profile/page.tsx` | **Modified** |
| `src/app/lists/[listId]/page.tsx` | **Modified** |
| `src/components/reviews/review-section.tsx` | **Modified** |
| `src/components/reviews/review-card.tsx` | **Modified** — tipos |
| `src/components/home/recommendations-section.tsx` | **Modified** |
| `src/components/lists/{add-to-list-dialog,lists-tab,list-card}.tsx` | **Modified** |
| `src/app/api/ai/recommend/{route,daily/route}.ts` | **Modified** |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Data loss en migración | Low | Script valida y logea cada paso |
| RLS bloquea queries legítimas | Med | Verificar policies por tabla antes del merge |
| Componentes se rompen al cambiar sync→async | Med | Migrar 1 componente a la vez, probar cada uno |

## Rollback Plan

1. Revertir commits de componentes al estado anterior
2. Restaurar `local-store.ts` como store activo
3. Datos en Supabase quedan como respaldo intacto

## Dependencies

- `@supabase/ssr` ya instalado
- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en `.env.local`
- Migration SQL ya ejecutado en Supabase Dashboard

## Success Criteria

- [ ] Dashboard carga stats y reseñas desde Supabase
- [ ] CRUD de reseñas persiste y se refleja en UI
- [ ] Toggle watchlist persiste en `public.watchlist`
- [ ] CRUD de listas funciona contra Supabase
- [ ] Follow/unfollow persiste en `public.follows`
- [ ] Recomendaciones diarias se guardan en `public.recommendations`
- [ ] Script migra datos de localStorage a Supabase sin pérdida
