-- ============================================================
-- FilmVerse — Premium Subscriptions (UUID PK, past_due status)
-- ============================================================
-- 1. Drop old table and add past_due to subscription_status
-- 2. Recreate premium_subscriptions with UUID PK, FK→profiles
-- 3. RLS: SELECT only (writes via service_role)
-- 4. Index + updated_at trigger
-- ============================================================

-- ─── 1. Drop old table first (PK type and FK change) ───

DROP TABLE IF EXISTS public.premium_subscriptions CASCADE;

-- ─── 2. Add past_due to existing enum ───

ALTER TYPE subscription_status ADD VALUE IF NOT EXISTS 'past_due';

-- ─── 3. Recreate table with UUID PK ───

CREATE TABLE public.premium_subscriptions (
  id                        UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID                NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status                    subscription_status NOT NULL DEFAULT 'active',
  mercadopago_subscription_id TEXT,
  start_date                TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  end_date                  TIMESTAMPTZ,
  created_at                TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ─── 4. Index ───

CREATE INDEX IF NOT EXISTS idx_premium_subscriptions_user_id
  ON public.premium_subscriptions(user_id);

-- ─── 5. Updated-at trigger ───

CREATE TRIGGER set_updated_at_premium_subscriptions
  BEFORE UPDATE ON public.premium_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ─── 6. RLS ───

ALTER TABLE public.premium_subscriptions ENABLE ROW LEVEL SECURITY;

-- SELECT: own user or admin/moderator (for support/inspection)
CREATE POLICY "premium_subscriptions_select_own" ON public.premium_subscriptions
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderador')
    )
  );

-- NOTE: No INSERT/UPDATE/DELETE policies on purpose.
-- All writes go through the server-side service_role client (bypasses RLS).
