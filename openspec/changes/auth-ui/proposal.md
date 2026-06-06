# Proposal: Auth UI (FilmVerse)

## Intent

Build auth pages so visitors can register, log in, and recover passwords. Supabase Auth backend exists (from `initial-setup`) but has no UI. Also fixes a middleware bug where refreshed session cookies were discarded.

## Scope

### In Scope
- Login (`/login`) + Register (`/register`) + Password reset (`/auth/reset-password`)
- Auth callback handler (`/auth/callback/route.ts`) for OAuth redirect
- Centered card layout `(auth)` — no navbar
- shadcn/ui (button, card, input, label) + lucide-react
- Form components: login-form, register-form, reset-password-form, oauth-button
- Middleware bug: return `updateSession` response instead of discarding it
- Add `/register` & `/auth` to middleware matcher exclusions

### Out of Scope
- Dashboard/profile pages
- Film catalog, social features
- Email templates (Supabase-managed)
- Tests

## Capabilities

### New Capabilities
- `user-auth`: (extending with UI) — pages, forms, OAuth callback, middleware fix

### Modified Capabilities
None — `user-auth` was declared in `initial-setup` but no spec file exists.

## Approach

1. `npx shadcn@latest init` (Tailwind v4 `@theme` compat)
2. `npx shadcn@latest add button card input label`
3. Create `(auth)` layout — centered card, no nav
4. Build form components: login, register, password reset
5. Build `auth/callback/route.ts` — swap OAuth code for session
6. Fix middleware: `return await updateSession(request)`
7. Exclude `/register`, `/auth` from middleware matcher
8. Wire Supabase: `signInWithPassword`, `signUp`, `signInWithOAuth`, `resetPasswordForEmail`

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/middleware.ts` | Modified | Return `updateSession`; widen matcher exclusions |
| `src/app/(auth)/` | New | Auth route group (layout + pages) |
| `src/app/auth/callback/route.ts` | New | OAuth GET handler |
| `src/components/auth/` | New | Form components |
| `components/ui/` | New | shadcn/ui primitives |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| shadcn/ui + Tailwind v4 CSS var issues | Med | Verify `@theme` directive; fall back to inline classes |
| OAuth callback URL must be in Supabase dashboard + env vars | Low | Document in `.env.template` |
| SMTP not configured for password reset emails | Med | Out of scope; document as prerequisite |

## Rollback Plan

- `git revert HEAD` — removes all auth UI files, returns middleware to original state

## Dependencies

- Supabase project (from `initial-setup`), Google OAuth credentials in env vars
- `lucide-react` for icons

## Success Criteria

- [ ] User can register with email/password
- [ ] User can log in with email/password
- [ ] User can log in with Google OAuth
- [ ] User can request password reset
- [ ] OAuth callback creates session, redirects to dashboard
- [ ] Middleware bug fixed — cookies refresh on every request
- [ ] `npm run lint` passes with zero errors
