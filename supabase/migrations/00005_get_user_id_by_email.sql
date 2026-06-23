-- ============================================================
-- FilmVerse — Función para resolver userId desde email
-- ============================================================
-- Usada por webhooks de Mercado Pago como fallback para
-- encontrar un usuario cuando no tenemos el MP subscription ID
-- guardado (por ejemplo, suscripciones creadas vía link estático
-- antes de que empecemos a guardar el ID).
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_user_id_by_email(p_email TEXT)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM auth.users WHERE email = p_email LIMIT 1;
$$;
