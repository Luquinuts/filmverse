# Proposal: Initial Project Setup (FilmVerse)

## Intent

Bootstrap FilmVerse: scaffolding, DB schema, CI, deployment. Establishes monorepo, Supabase schema + RLS, deployable Next.js skeleton.

## Scope

### In Scope
- Next.js 15 App Router (src/, monolith)
- Supabase schema: all tables + RLS policies
- Auth (email/password + OAuth)
- TMDB API wrapper (service layer only)
- Vercel + GitHub Actions CI
- ESLint + Prettier
- README + .env.template
- SDD state.yaml

### Out of Scope
- UI pages, layouts, components
- API route handlers, business logic, seeding
- Auth UI (login, register, recovery)
- Testing infrastructure
- Premium, AI, dashboard, social features

## Capabilities

No existing specs to modify. New capabilities:
- `user-auth`: Supabase Auth + RLS for users/sessions
- `film-catalog`: Film table, TMDB client, search infra
- `social-features`: Follows, reviews, ratings, lists schema + RLS
- `ai-chatbot`: Chat sessions + Gemini client stub
- `premium-subscription`: Premium schema + Mercado Pago stub
- `dashboard`: Watch history + stats analytics views
- `moderation`: Reports, bans, flags schema + RLS



## Approach

1. `create-next-app` (Next.js 15, App Router, TS, src/)
2. Single SQL migration: tables, enums, RLS policies
3. API wrappers: TMDB, Gemini, Mercado Pago (types + stubs)
4. Supabase Auth helpers (server/client per App Router)
5. Vercel link + GitHub Actions lint-on-push
6. ESLint, Prettier, .env.template

## Affected Areas

| Area | Impact | What |
|------|--------|------|
| `/` | New | Next.js root (package.json, tsconfig) |
| `/src/app/` | New | Layout + 404 page |
| `/src/lib/` | New | API clients, types, helpers |
| `/supabase/migrations/` | New | `00001_initial_schema.sql` |
| `/.github/workflows/` | New | `lint.yml` |
| `/README.md` | New | Setup guide |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Gemini API costs/rate limits | Med | Free tier + caching |
| TMDB down = empty catalog | Med | Graceful fallback later |
| Social features feel empty | High | Seed scripts |
| Academic timeline (31/03→23/06) | High | Core first, polish later |
| Schema churn mid-project | Med | Migrations + docs |

## Rollback Plan

- `git revert HEAD` (initial commit)
- Drop misconfigured Supabase project, recreate
- Remove project from Vercel dashboard

## Dependencies

- Supabase (free), Vercel (Hobby)
- TMDB API key, Google Gemini API key (free)
- Node.js 18+, npm/pnpm

## Success Criteria

- [ ] `npm run dev` starts on fresh clone
- [ ] All tables + RLS policies applied, migration clean
- [ ] `npm run lint` passes with zero warnings
- [ ] Auth sign-up works (verified via Supabase dashboard)
- [ ] `.env.template` documents all required variables
- [ ] Vercel preview builds from `main`
