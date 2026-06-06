# Tasks: FilmVerse Initial Project Setup

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 800–1200 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: Foundation + Database → PR 2: Auth + API + Shell |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

```
Decision needed before apply: No (user approved stacked PRs)
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High
```

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Scaffolding + DB migration | PR 1 | Invoke `create-next-app`, add deps, config files, SQL migration |
| 2 | Auth helpers + API wrappers + Shell + CI | PR 2 | Depends on PR 1 for project structure |

## Phase 1: Foundation

- [x] 1.1 Scaffold Next.js 15 with `create-next-app` (src/, App Router, TS)
- [x] 1.2 Add deps to `package.json`: supabase, @supabase/ssr, vitest, prettier
- [x] 1.3 Configure `tsconfig.json` with `@/` path alias
- [x] 1.4 Create `next.config.js` with TMDB image domains
- [x] 1.5 Create `.eslintrc.json` (Next.js + TS recommended rules)
- [x] 1.6 Create `.prettierrc` (single quotes, trailing commas)
- [x] 1.7 Create `.env.template` with all required vars

## Phase 2: Database & Auth

- [x] 2.1 Create `supabase/migrations/00001_initial_schema.sql` (14 tables, enums, RLS)
- [x] 2.2 Create `src/lib/supabase/server.ts` (createServerClient for RSC/routes)
- [x] 2.3 Create `src/lib/supabase/client.ts` (createBrowserClient for client components)
- [x] 2.4 Create `src/lib/supabase/middleware.ts` (cookie-based session refresh)
- [x] 2.5 Create `src/lib/supabase/admin.ts` (service-role client for admin ops)
- [x] 2.6 Create `src/middleware.ts` (auth guard for /dashboard, /profile, /chat, /feed)

## Phase 3: API Wrappers

- [x] 3.1 Create `src/lib/types.ts` (domain types, enums, DB row types)
- [x] 3.2 Create `src/lib/tmdb.ts` (search, detail, trending methods)
- [x] 3.3 Create `src/lib/gemini.ts` (stub with stream interface for future)
- [x] 3.4 Create `src/lib/mercadopago.ts` (stub for future premium integration)

## Phase 4: App Shell & CI

- [x] 4.1 Create `src/app/layout.tsx` (root layout with metadata, Inter font)
- [x] 4.2 Create `src/app/page.tsx` (clean landing page)
- [x] 4.3 Create `src/app/not-found.tsx` (custom 404 page)
- [x] 4.4 Create `.github/workflows/lint.yml` (lint on push to main/PR)
- [x] 4.5 Create `README.md` (setup guide, env vars, architecture overview)
