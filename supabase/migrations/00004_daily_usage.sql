-- ============================================================
-- FilmVerse — Daily Usage Tracking
-- ============================================================
-- Control de límites diarios para usuarios gratuitos:
--   - Reseñas: 3/día (cinefilo)
--   - FilmIntelligence: 3/día (cinefilo)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.daily_usage (
  user_id   UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  feature   TEXT        NOT NULL,
  date      DATE        NOT NULL DEFAULT CURRENT_DATE,
  count     INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, feature, date)
);

-- Trigger para updated_at
CREATE TRIGGER set_updated_at_daily_usage
  BEFORE UPDATE ON public.daily_usage
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS
ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY;

-- El usuario ve solo su propio uso
CREATE POLICY "daily_usage_select_own" ON public.daily_usage
  FOR SELECT
  USING (auth.uid() = user_id);

-- Las escrituras se hacen via service_role (API routes)
-- No hay policies de INSERT/UPDATE/DELETE desde el cliente

-- Índice para consultas rápidas por usuario+fecha
CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date
  ON public.daily_usage(user_id, date);
