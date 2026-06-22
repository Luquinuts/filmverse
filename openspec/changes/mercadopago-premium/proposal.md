# Proposal: MercadoPago Premium

## Intent

Enable recurring premium subscriptions via MercadoPago. Users pay for premium features; the system tracks subscription state and gates premium content behind an active subscription.

## Scope

### In Scope
- Migration: `premium_subscriptions` table referencing `profiles(id)`, with RLS
- Complete MercadoPago webhook and preference handling (replace stubs)
- API routes: `POST /api/premium/create-preference` and `POST /api/premium/webhook`
- Frontend: `/premium` plans page, post-payment pages (success/failure/pending), premium badge
- Server-side premium gating utility

### Out of Scope
- Actual money handling (done by MercadoPago)
- Premium-specific features (gating is structural; actual premium features are separate changes)
- Expiration cron job (webhook-driven for MVP; cron deferred)
- Multiple plan tiers (MVP: single subscription plan)

## Capabilities

### New Capabilities
- `premium-subscriptions`: Subscription lifecycle — plan selection, preference creation, webhook processing, subscription state tracking, role transitions, RLS

### Modified Capabilities
- `user-profiles`: Profile role now driven by subscription state — premium subscription activates `'premium'` role; cancellation/expiration reverts to `'cinefilo'`

## Approach

User clicks "Subscribe" → `POST /api/premium/create-preference` creates MP preference → redirect to MP checkout → MP sends webhook on payment → handler validates signature, inserts/updates `premium_subscriptions`, sets `profiles.role = 'premium'` → premium badge appears. Recurring billing via MP subscription API. Expiry handled by webhook notification.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `supabase/migrations/` | New | `premium_subscriptions` table + RLS policies |
| `src/lib/mercadopago.ts` | Modified | Stub → full webhook + preference implementation |
| `src/lib/types.ts` | Modified | Subscription and MP types |
| `src/app/premium/` | New | Plans page and post-payment landing pages |
| `src/app/api/premium/` | New | Route handlers for preference and webhook |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Webhook lost/delayed | Low | Store pending subscription on redirect; verify via MP API on landing |
| Signature verification fails | Low | Raw body parser + HMAC-SHA256 verification |
| Double webhook processing | Low | Idempotency on `mercadopago_subscription_id` (ON CONFLICT DO NOTHING) |
| RLS blocking role updates | Med | Server-side client uses `service_role` key for writes |

## Rollback Plan

1. Remove `openspec/changes/mercadopago-premium/`
2. Discard migration file from `supabase/migrations/`
3. Revert `src/lib/mercadopago.ts` and `src/lib/types.ts`
4. Remove `src/app/premium/` and `src/app/api/premium/` directories

## Dependencies

- MercadoPago developer account credentials (`MERCADOPAGO_ACCESS_TOKEN`)
- `NEXT_PUBLIC_APP_URL` configured for back URLs
- `MERCADOPAGO_WEBHOOK_SECRET` for HMAC verification

## Success Criteria

- [ ] User creates a preference and is redirected to MP checkout
- [ ] Webhook creates subscription record and promotes role to `'premium'`
- [ ] Premium badge appears on profile for active subscribers
- [ ] Non-premium users are blocked from premium-gated content
- [ ] Subscription expiry reverts role back to `'cinefilo'`
