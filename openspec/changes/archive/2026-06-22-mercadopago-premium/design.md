# Design: MercadoPago Premium

## Technical Approach

MVP recurring subscriptions via MercadoPago **preapproval** API. User flow: select plan → create MP preapproval → redirect to MP checkout → webhook processes result → `profiles.role` updated atomically. Premium gating reads `profile.role` (source of truth). Webhook uses raw body + `x-signature` HMAC-SHA256. Admin client (`service_role`) for DB writes bypassing RLS.

## Architecture Decisions

| Option (A vs B) | Tradeoff | Decision |
|---|---|---|
| PK: BIGSERIAL (existing) vs UUID | BIGSERIAL matches current pattern; UUID is spec requirement, cleaner external refs | **UUID** — spec requirement, cleaner for MP subscription ID references |
| Constraint: `UNIQUE(user_id)` vs partial `WHERE status = 'active'` | Simpler vs allows historical subs | **UNIQUE(user_id)** — MVP simplicity, one sub per user |
| Gating: `profiles.role` vs query subscriptions table | Role already loaded in most pages; sub query is more precise | **profiles.role** — already on profile, updated atomically by webhook |
| Store: append to `store.ts` vs new `subscriptions.ts` | store.ts is 831 lines; new file is cleaner | **Append to `store.ts`** — follows existing single-file pattern |
| MP API: `/checkout/preferences` vs `/preapproval` | Preferences for one-time; preapproval for recurring | **`/preapproval`** — correct endpoint for subscriptions |
| Migration: new file vs modify 00001 | New file preserves existing; modify is cleaner for fresh installs | **New `00003`** — non-destructive, drops and recreates table |

## Data Flow

```
User → /premium → "Subscribe" →
  POST /api/premium/create-preference →
    createSubscriptionPreference() → POST /preapproval (MP API) →
    Return { id, initPoint } → Redirect to MP checkout

MP Checkout → POST /api/premium/webhook (raw body + x-signature) →
  Route: verify HMAC-SHA256 → parse JSON → handleWebhook(event) →
    subscription_created/authorized →
      upsert premium_subscriptions (service_role) →
        UPDATE profiles SET role = 'premium'
    subscription_cancelled/expired →
      UPDATE sub SET status='cancelled', end_date=NOW() →
        UPDATE profiles SET role = 'cinefilo'
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `supabase/migrations/00003_premium_subscriptions.sql` | Create | Drop old table, recreate: UUID PK, FK→profiles, past_due enum value, SELECT-only RLS |
| `src/lib/types.ts` | Modify | Update `PremiumSubscription.id`→string, add `past_due` to `SubscriptionStatus`, add to `Database` |
| `src/lib/mercadopago.ts` | Modify | `createSubscriptionPreference()`, `handleWebhook()`, HMAC verify helper |
| `src/lib/supabase/store.ts` | Modify | Add `getUserSubscription`, `cancelSubscription` (uses admin client) |
| `src/lib/premium.ts` | Create | `isPremium(profile)`, `requirePremium()` server guard |
| `src/app/api/premium/create-preference/route.ts` | Create | POST: auth → create preapproval → return init_point |
| `src/app/api/premium/webhook/route.ts` | Create | POST: raw body → HMAC → process event |
| `src/app/api/premium/cancel/route.ts` | Create | POST: auth → cancel MP sub → update DB |
| `src/app/premium/page.tsx` | Create | Plans page + Subscribe CTA |
| `src/app/premium/success/page.tsx` | Create | Post-checkout success |
| `src/app/premium/failure/page.tsx` | Create | Post-checkout failure |
| `src/app/premium/pending/page.tsx` | Create | Post-checkout pending |

## Interfaces / Contracts

New types in `types.ts`:

```typescript
type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'past_due';

interface PremiumSubscription {
  id: string;                    // UUID
  user_id: string;
  status: SubscriptionStatus;
  mercadopago_subscription_id: string | null;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}
```

Store contract (added to `store.ts`, uses `createAdminClient` for writes):

| Function | Input | Output | Client |
|----------|-------|--------|--------|
| `getUserSubscription` | `client, userId` | `PremiumSubscription \| null` | user |
| `cancelSubscription` | `userId` | `void` | admin |

MercadoPagoClient:

| Method | Input | Output |
|--------|-------|--------|
| `createSubscriptionPreference` | `(userId: string)` | `{ id: string, initPoint: string }` |
| `handleWebhook` | `(event: MercadoPagoWebhookEvent)` | `void` |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | HMAC verification | Isolated function, known test vectors |
| Integration | Webhook → role update | Mock Supabase admin client, verify `from('profiles').update()` calls |
| Manual | Full checkout | Sandbox MP credentials, browser walkthrough |

## Migration / Rollout

**Migration `00003`**: DROP existing `premium_subscriptions` + `subscription_status` (recreate with `past_due`). Recreate table referencing `profiles(id)`. RLS: SELECT only for own user or admin — no INSERT/UPDATE/DELETE policies (blocked by RLS, only service_role can write).

**Env vars required**: `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL`.

## Open Questions

- [ ] Does production have `profiles` table already? The existing schema uses `public.users` but store.ts queries `profiles` — confirm current schema state before migration.
