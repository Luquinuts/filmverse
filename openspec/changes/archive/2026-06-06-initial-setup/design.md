# Design: Initial Project Setup (FilmVerse)

## Technical Approach

Next.js 14+ App Router monolith (`src/` dir) + Supabase PostgreSQL with RLS. Service-layer wrappers for external APIs (TMDB, Gemini, Mercado Pago). Auth via Supabase Auth integrated with Next.js middleware. Single migration for all tables/enums/RLS. CI lint-on-push via GitHub Actions.

---

## Architecture Decisions

| Decision | Options | Tradeoffs | Chosen |
|----------|---------|-----------|--------|
| Folder layout | Flat `/src/` vs domain-grouped | Flat simpler for bootstrap; domain can come later | `/src/app/`, `/src/lib/`, `/src/components/` |
| Supabase client | `createServerClient` (server) vs `createBrowserClient` (browser) | Server client uses cookies (RSC-safe), browser client needs `@supabase/ssr` helpers | Both — server client in RSC/middleware, browser client for client components |
| API wrappers | Inline fetch vs service classes | Services are testable, swappable, centralize error handling | Service pattern: `src/lib/{tmdb,gemini,mercadopago}.ts` |
| State mgmt | React Context vs Zustand vs RSC-only | RSC eliminates client state for most data; Context for auth; Zustand overkill at bootstrap | RSC-first, Auth context only |
| Migrations | Single file vs numbered per table | Single file = atomic apply; per-table = granular rollback | Single `00001_initial_schema.sql` |
| PR review budget | Default 400 lines | Bootstrap will exceed 400 — exception accepted | `exception-ok` delivery strategy |

---

## Database Schema (14 tables)

All tables use `uuid` PKs, `created_at` timestamps. Enums: `user_role`, `subscription_status`, `report_reason`.

```
users (extends Supabase auth.users via id FK)
films          watched_films    reviews     ratings
watchlist_films custom_lists    list_films  follows
likes           reports         premium_subscriptions
chat_sessions   daily_reports
```

**Key relationships:**
- `users.id` ← `auth.users.id` (Supabase managed)
- `watched_films`, `watchlist_films`, `reviews`, `ratings` → `users.id` + `films.id`
- `custom_lists` → `users.id`; `list_films` → `custom_lists.id` + `films.id`
- `follows` → `users.id` (follower/followed)
- `likes` → polymorphic (review or list via `target_type` enum)
- `premium_subscriptions` → `users.id`
- `chat_sessions` → `users.id`

**RLS strategy:** All tables enable RLS. Authenticated users can CRUD own data. Public reads for published content. Moderators/admins can read/flag/delete any content. See `00001_initial_schema.sql` for policy details.

---

## Data Flows

### 1. Auth flow
```
User → Login page → Supabase Auth (email/OAuth) → session cookie
→ Next.js middleware reads cookie → redirect to /login if no session
→ Protected routes: `/dashboard`, `/profile`, `/social`
```

### 2. Film search
```
User → /search page → client calls /api/search?q=... → route handler
→ TMDB service (fetch with API key) → TMDB API → response → UI cards
```

### 3. AI Chatbot
```
User → /chat page → POST /api/chat → route handler → Gemini service
→ Gemini API (streaming) → `ReadableStream` response → UI renders tokens
```

### 4. Social feed
```
User → /feed page → RSC queries Supabase (SELECT + JOIN via RLS)
→ watched_films + reviews + ratings + follows → composed feed → SSR
```

---

## File Changes (all CREATE — fresh project)

### Scaffolding
| File | Description |
|------|-------------|
| `package.json` | Next.js 14+, React, Supabase, deps |
| `tsconfig.json` | Strict TS, path aliases (`@/`) |
| `next.config.js` | Image domains (TMDB), env checks |
| `.env.template` | All required env vars documented |

### Config & Linting
| File | Description |
|------|-------------|
| `.eslintrc.json` | Next.js + TS recommended |
| `.prettierrc` | Single quotes, trailing commas |
| `.github/workflows/lint.yml` | Lint on push to main/PR |

### App Routes
| File | Description |
|------|-------------|
| `src/app/layout.tsx` | Root layout (metadata, inter font) |
| `src/app/page.tsx` | Landing page (clean slate) |
| `src/app/not-found.tsx` | 404 page |

### Shared Library
| File | Description |
|------|-------------|
| `src/lib/supabase/server.ts` | `createServerClient` for RSC/routes |
| `src/lib/supabase/client.ts` | `createBrowserClient` for client components |
| `src/lib/supabase/middleware.ts` | Session refresh in middleware |
| `src/lib/supabase/admin.ts` | Service-role client for admin ops |
| `src/lib/tmdb.ts` | TMDB API client (search, detail, trending) |
| `src/lib/gemini.ts` | Gemini API client stub |
| `src/lib/mercadopago.ts` | Mercado Pago stub |
| `src/lib/types.ts` | Domain types, enums, DB row types |
| `src/middleware.ts` | Auth guard + session refresh |

### Database
| File | Description |
|------|-------------|
| `supabase/migrations/00001_initial_schema.sql` | All 14 tables, enums, RLS policies |

### Docs
| File | Description |
|------|-------------|
| `README.md` | Setup guide, env vars, architecture overview |

---

## Auth Flow Detail

```
middleware.ts (matches /dashboard, /profile, /chat, /feed):
  1. Read supabase session cookie via @supabase/ssr
  2. If no session → redirect /login (preserve original URL)
  3. If session expired → attempt refresh (if fails → redirect)
  4. If valid → set request headers, pass through
```

`src/lib/supabase/middleware.ts` wraps `createServerClient` with cookie getters/setters per Next.js App Router conventions.

---

## Testing Strategy

| Layer | Available | Approach |
|-------|-----------|----------|
| Unit | No | Out of scope — bootstrap phase |
| Integration | No | Out of scope — bootstrap phase |
| E2E | No | Out of scope — bootstrap phase |

**Note:** Testing infrastructure is explicitly out of scope for the `initial-setup` change. The `package.json` will include `vitest` as a dependency for future phases, but no test files or config are created here.

---

## Migration / Rollout

First-time setup only: `supabase migration up` applies `00001_initial_schema.sql`. Rollback = `supabase migration down` or recreate project. No existing data to migrate.

---

## Open Questions (Resolved)

- [x] **Next.js 15** — confirmed by team
- [x] **OAuth: Google only** — confirmed by team
- [x] **Gemini streaming** — deferred to implementation phase (track as issue)
