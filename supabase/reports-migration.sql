-- FilmVerse — Reports + Admin Roles Migration
-- Ejecutar en Supabase SQL Editor

-- Add role column to profiles (if not exists)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text not null default 'user' check (role in ('user', 'admin', 'moderator'));

-- Reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  reported_by uuid not null references public.profiles(id) on delete cascade,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'dismissed')),
  created_at timestamptz not null default now(),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_reports_status on public.reports(status);

-- RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden reportar"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Reportes visibles solo para admins"
  ON public.reports FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins actualizan reportes"
  ON public.reports FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
