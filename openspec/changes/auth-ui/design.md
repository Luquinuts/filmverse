# Design: Auth UI (FilmVerse)

## Technical Approach

Four auth pages (login, register, password reset, OAuth callback) using server/page components for structure, client form components for interactivity, and shadcn/ui primitives for consistent dark-theme styling. Middleware bug fix: return the `updateSession` response instead of discarding it.

## Architecture Decisions

| Decision | Options | Chosen | Rationale |
|----------|---------|--------|-----------|
| Form state | useState vs useTransition vs RHF | useTransition + useState | Auth forms are 3-4 fields; RHF is overkill. `useTransition` for pending state without extra deps. |
| Auth form location | In page.tsx vs separate components | Separate `src/components/auth/` | Keeps page.tsx as server components. Forms need `useState`, `useTransition`, browser Supabase client — must be client components. |
| Error handling | Toast vs inline errors | Inline below inputs | No toast dependency. Users see errors next to the relevant field — more accessible. |
| OAuth flow | Server route vs client-only | Server route handler (`/auth/callback`) | Supabase PKCE flow requires a server endpoint to exchange the code for a session. |
| shadcn CSS vars | `@layer base` vs `@theme` | `@theme` directive | Tailwind v4 dropped `@layer base` for custom properties. `@theme` is the idiomatic Tailwind v4 approach. |

## Data Flows

```
1. Login (email/password)
   /login → LoginForm → supabase.signInWithPassword
       → session → redirect to ?redirect= or /

2. Register
   /register → RegisterForm → supabase.signUp
       → confirmation email → redirect to /login?registered=ok

3. OAuth (Google)
   Click Google button → supabase.signInWithOAuth({ provider: "google" })
       → Google consent → redirect to /auth/callback?code=...
       → route.ts exchanges code → session → redirect to /

4. Password Reset
   /auth/reset-password → form → supabase.resetPasswordForEmail
       → success message ("Revisá tu email")
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/(auth)/layout.tsx` | Create | Centered card layout, no nav, glass-effect card |
| `src/app/(auth)/login/page.tsx` | Create | Renders `<LoginForm />` |
| `src/app/(auth)/register/page.tsx` | Create | Renders `<RegisterForm />` |
| `src/app/(auth)/auth/callback/route.ts` | Create | GET handler — exchanges OAuth code for session |
| `src/app/(auth)/auth/reset-password/page.tsx` | Create | Renders `<ResetPasswordForm />` |
| `src/components/auth/login-form.tsx` | Create | Email + password, submit, error, loading, Google button, links |
| `src/components/auth/register-form.tsx` | Create | Username + email + password + confirm, Google button |
| `src/components/auth/reset-password-form.tsx` | Create | Email only, submit, success message |
| `src/components/auth/oauth-button.tsx` | Create | Reusable Google button — logo, loading, disabled |
| `components/ui/button.tsx` | Create | shadcn Button primitive |
| `components/ui/card.tsx` | Create | shadcn Card primitive |
| `components/ui/input.tsx` | Create | shadcn Input primitive |
| `components/ui/label.tsx` | Create | shadcn Label primitive |
| `components.json` | Create | shadcn configuration file |
| `src/lib/utils.ts` | Create | `cn()` helper (`clsx + twMerge`) |
| `src/middleware.ts` | Modify | `return await updateSession(request)`; add `register` to matcher |
| `src/app/globals.css` | Modify | Add `@theme` block with shadcn CSS variables |
| `package.json` | Modify | Add `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge` |

## Interfaces / Contracts

### Auth Callback Route

```
GET /auth/callback?code={string}&next={string?}
  → 302 redirect to next (default /)
  → 302 redirect to /login?error=... on failure
```

### Form Component Props

```typescript
// All forms accept optional redirectUrl for post-auth redirect
interface AuthFormProps {
  redirectUrl?: string;
}

// OAuthButton
interface OAuthButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  provider?: 'google' | 'github'; // extensible
}
```

### Supabase Client Usage

| Component | Client | Methods |
|-----------|--------|---------|
| `login-form.tsx` | browser (`@/lib/supabase/client`) | `signInWithPassword`, `signInWithOAuth` |
| `register-form.tsx` | browser | `signUp` |
| `reset-password-form.tsx` | browser | `resetPasswordForEmail` |
| `auth/callback/route.ts` | server (`@/lib/supabase/server`) | `auth.exchangeCodeForSession` |

## Testing Strategy

Out of scope — no test infrastructure exists. Will be added in a future change.

## Migration / Rollout

No migration required. Auth tables are managed by Supabase. Environment variables must be set:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Open Questions

- [ ] Verify `npx shadcn@latest init` compatibility with Tailwind v4 `@import` syntax. If init fails, manually create `components.json` and add CSS variables via `@theme`.
