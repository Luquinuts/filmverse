# Tasks: MercadoPago Premium

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 600–800+ |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (Foundation) → PR 2 (API) → PR 3 (Frontend) |
| Delivery strategy | ask-always |
| Chain strategy | feature-branch-chain |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Foundation + MercadoPago client + types | PR 1 | Base: `feat/mercadopago-premium` |
| 2 | Store layer + API routes | PR 2 | Base: PR 1 branch |
| 3 | Frontend pages + premium badge | PR 3 | Base: PR 2 branch |

## Phase 1: Foundation

- [x] 1.1 Create `supabase/migrations/00003_premium_subscriptions.sql` with UUID PK, FK→profiles, RLS, UNIQUE(user_id)
- [x] 1.2 Update `src/lib/types.ts` — change `PremiumSubscription.id` to string, add `past_due`, fix `SubscriptionStatus`, add to `Database`
- [x] 1.3 Create `src/lib/premium.ts` — `isPremium(profile)`, `requirePremium()` server guard

## Phase 2: MercadoPago Client

- [x] 2.1 Complete `src/lib/mercadopago.ts` — replace stub with real `createSubscriptionPreference()` (MP preapproval), HMAC-SHA256 verify helper
- [x] 2.2 Refactor `handleWebhook()` — dispatch on subscription events, call store functions for DB writes

## Phase 3: Store Layer

- [x] 3.1 Add `getUserSubscription(client, userId)` to `src/lib/supabase/store.ts`
- [x] 3.2 Add `cancelSubscription(userId)` to store using admin client (service_role)
- [x] 3.3 Add `updateSubscriptionAndRole()` internal helper for webhook atomic writes

## Phase 4: API Routes

- [x] 4.1 Create `src/app/api/premium/create-preference/route.ts` — auth → create preapproval → return init_point
- [x] 4.2 Create `src/app/api/premium/webhook/route.ts` — raw body parser → HMAC verify → process event
- [x] 4.3 Create `src/app/api/premium/cancel/route.ts` — auth → cancel MP sub → update DB

## Phase 5: Frontend Pages

- [x] 5.1 Created `src/app/premium/page.tsx` — plans page with Subscribe CTA
- [x] 5.2 Created `src/app/premium/success/page.tsx` — post-checkout success landing
- [x] 5.3 Created `src/app/premium/failure/page.tsx` — post-checkout failure landing
- [x] 5.4 Created `src/app/premium/pending/page.tsx` — post-checkout pending landing

### Additional: Premium badge
- [x] Added Crown badge to `src/app/profile/page.tsx`
- [x] Added Crown badge to `src/components/layout/navbar.tsx`

## Phase 6: Verification

- [ ] 6.1 Manual: create preference → redirect to MP sandbox → verify init_point
- [ ] 6.2 Manual: simulate webhook via curl/MP dashboard → verify subscription record + role change
- [ ] 6.3 Manual: verify RLS — non-owner SELECT returns empty; INSERT from client rejected
- [ ] 6.4 Manual: verify premium badge shows for active subs, hides for cinefilo
