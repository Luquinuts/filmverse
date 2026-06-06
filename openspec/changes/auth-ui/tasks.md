# Tasks: Auth UI — Login, Register, Password Reset + Middleware Fix

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 500–700 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 → PR 3 |
| Delivery strategy | ask-on-risk → size:exception |
| Chain strategy | size-exception |

Decision needed before apply: No (user approved size:exception)
Chained PRs recommended: Yes → No (single PR with exception)
Chain strategy: size-exception
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | shadcn/ui init + CSS vars + middleware fix | PR 1 | Base: main. Independent infra. |
| 2 | Auth layout + callback + form components | PR 2 | Depends on PR 1 shadcn primitives. |
| 3 | Auth pages (login, register, reset-password) | PR 3 | Depends on PR 2 forms + layout. |

## Phase 1: Foundation — shadcn/ui + Middleware Fix

- [x] 1.1 Init shadcn: `npx shadcn@latest init` with Tailwind v4 `@theme` compat, write `components.json`
- [x] 1.2 Add shadcn CSS variables via `@theme` block to `src/app/globals.css`
- [x] 1.3 Create `src/lib/utils.ts` — `cn()` helper (`clsx` + `tailwind-merge`)
- [x] 1.4 Add shadcn primitives: `src/components/ui/button.tsx`, `card.tsx`, `input.tsx`, `label.tsx`
- [x] 1.5 Install `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`
- [x] 1.6 Fix `src/middleware.ts` — `return await updateSession(request)` instead of calling + `NextResponse.next()`
- [x] 1.7 Fix `src/middleware.ts` matcher — add `register` to exclusion pattern

## Phase 2: Auth Layout + Callback

- [x] 2.1 Create `src/app/(auth)/layout.tsx` — centered card, no navbar, dark glass-effect, FilmVerse branding
- [x] 2.2 Create `src/app/(auth)/auth/callback/route.ts` — GET handler exchanges OAuth code via Supabase server client

## Phase 3: Form Components

- [x] 3.1 Create `src/components/auth/oauth-button.tsx` — reusable Google button (lucide icon, loading, disabled)
- [x] 3.2 Create `src/components/auth/login-form.tsx` — email + password, `signInWithPassword`, inline errors, `useTransition`
- [x] 3.3 Create `src/components/auth/register-form.tsx` — username + email + password + confirm, `signUp`, errors
- [x] 3.4 Create `src/components/auth/reset-password-form.tsx` — email only, `resetPasswordForEmail`, success message

## Phase 4: Auth Pages

- [x] 4.1 Create `src/app/(auth)/login/page.tsx` — server component rendering `<LoginForm />`
- [x] 4.2 Create `src/app/(auth)/register/page.tsx` — server component rendering `<RegisterForm />`
- [x] 4.3 Create `src/app/(auth)/auth/reset-password/page.tsx` — server component rendering `<ResetPasswordForm />`
