-- ============================================================
-- FilmVerse — Soft Delete para reseñas
-- ============================================================
-- 1. Agrega columna deleted_at a reviews
-- 2. Crea función security definer para que admins soft-deleteen
-- 3. Actualiza RLS policy para permitir UPDATE de deleted_at
-- ============================================================

-- ─── 1. Columna deleted_at ───

alter table public.reviews
  add column if not exists deleted_at timestamptz;

create index if not exists idx_reviews_deleted_at
  on public.reviews(deleted_at);

-- ─── 2. Función security definer para admins ───
-- Bypassea RLS: cualquier usuario autenticado puede llamarla,
-- pero internamente verifica que sea admin antes de soft-deletear.

create or replace function public.admin_soft_delete_review(
  p_review_id uuid,
  p_admin_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  -- Verificar que el usuario sea admin
  select role into v_role
  from public.profiles
  where id = p_admin_id;

  if v_role is distinct from 'admin' then
    raise exception 'No autorizado: se requiere rol admin' using errcode = '42501';
  end if;

  -- Soft delete: marcar como eliminado
  update public.reviews
  set deleted_at = now()
  where id = p_review_id;

  if not found then
    raise exception 'Reseña no encontrada' using errcode = 'P0002';
  end if;
end;
$$;

-- ─── 3. Permitir que la función security definer haga UPDATE ───
-- La función corre como security definer, así que no necesita policy.
-- La policy existente (auth.uid() = user_id) NO afecta a security definer.
-- No se requieren cambios en RLS.
