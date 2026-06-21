# Archive Report: supabase-migration

**Archived**: 2026-06-20
**Change**: supabase-migration
**Artifact Store**: hybrid (Engram + OpenSpec)

## Executive Summary

Migración completa de localStorage a Supabase. Se reemplazó el store síncrono `local-store.ts` por un store asíncrono `src/lib/supabase/store.ts` con funciones que reciben `SupabaseClient` + `userId` explícito. La migración se entregó en 4 PRs encadenados (feature branch chain), todos aprobados por judgment-day. Compilación `tsc --noEmit` limpia.

## Artifact Lineage

| Artifact | Engram ID | Filesystem |
|----------|-----------|------------|
| Proposal | #200 | `proposal.md` ✅ |
| Spec | N/A (filesystem only) | `spec.md` ✅ (corregido: `updateProfile`→`void`, `getReviews` en vez de `getUserReviews`) |
| Design | N/A (filesystem only) | `design.md` ✅ |
| Tasks | N/A (filesystem only) | `tasks.md` ✅ (6/6 phases, 22/22 tasks complete) |
| Apply Progress | #203 | — |
| Verify Report | #204 | — |
| **Archive Report** | **→ this save** | **`archive-report.md` ✅** |

## Specs Synced

| Domain | Action | Details |
|--------|--------|---------|
| `user-profiles` | **Created** | Nuevo main spec para perfiles vinculados a `auth.users` |
| `user-reviews` | **Created** | Nuevo main spec para CRUD de reseñas en Supabase |
| `user-watchlist` | **Created** | Nuevo main spec para watchlist en Supabase |
| `user-follows` | **Created** | Nuevo main spec para follows y feed |
| `data-migration` | **Created** | Nuevo main spec para script de migración one-time |
| `ai-recommendations` | **Updated** | Cache migrado de localStorage a `public.recommendations`; API routes ahora leen/escriben de Supabase |
| `custom-user-lists` | **Updated** | CRUD migrado de localStorage a `public.custom_lists` + `public.list_films` con RLS |

## Deviations Corrected

| Spec | Deviation | Correction |
|------|-----------|------------|
| `user-profiles` | `updateProfile` spec decía `Promise<ProfileRow>`, implementación retorna `void` | Spec corregido a `void` |
| `user-reviews` | `getUserReviews(userId)` spec decía `string` → `ReviewRow[]`, implementación es `getReviews(client, userId?)` con userId opcional | Spec corregido a `getReviews(userId?)` |
| `custom-user-lists` (verify) | Verify report decía "no `is_public` en schema" | `is_public` SÍ existe en `migration.sql` (línea 97) y en `types.ts` (línea 84). Verify report incorrecto — no se requirió corrección. |

## Tasks Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 1: Foundation (PR #1) | 1.1–1.4 (4 tasks) | ✅ Completas |
| Phase 2: Reviews + Watchlist (PR #2) | 2.1–2.4 (4 tasks) | ✅ Completas |
| Phase 3: Lists + Profile (PR #3) | 3.1–3.6 (6 tasks) | ✅ Completas |
| Phase 4: Feed + API + Migration (PR #4) | 4.1–4.6 (6 tasks) | ✅ Completas |
| **Total** | **20 tasks** | **✅ 100% complete** |

## Delivery Strategy

Feature branch chain de 4 PRs, todos aprobados por judgment-day:
- PR #1: Foundation (store async, Database interface)
- PR #2: Reviews + Watchlist
- PR #3: Lists + Profile
- PR #4: Feed + API + Migration

## Source of Truth Updated

Los siguientes specs reflejan el nuevo comportamiento post-migración:

| Path | Action |
|------|--------|
| `openspec/specs/user-profiles/spec.md` | 🆕 Creado |
| `openspec/specs/user-reviews/spec.md` | 🆕 Creado |
| `openspec/specs/user-watchlist/spec.md` | 🆕 Creado |
| `openspec/specs/user-follows/spec.md` | 🆕 Creado |
| `openspec/specs/data-migration/spec.md` | 🆕 Creado |
| `openspec/specs/ai-recommendations/spec.md` | 📝 Actualizado |
| `openspec/specs/custom-user-lists/spec.md` | 📝 Actualizado |

## SDD Cycle Complete

La migración Supabase ha sido completamente planificada, diseñada, implementada, verificada y archivada. Lista para el próximo cambio.
