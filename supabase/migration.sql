-- ============================================================
-- FilmVerse — Esquema de Base de Datos (Supabase)
-- ============================================================
-- Corré esto en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── 1. EXTENSIONES ───

create extension if not exists "pgcrypto"; -- para gen_random_uuid()

-- ─── 2. TABLAS ───

-- 2.1 Perfiles de usuario (extiende auth.users)
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique not null,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- 2.2 Reseñas
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  film_id     integer not null,
  film_title  text not null,
  film_year   integer,
  film_poster text,
  rating      integer not null check (rating >= 1 and rating <= 10),
  content     text not null default '',
  is_spoiler  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(user_id, film_id)
);

create index if not exists idx_reviews_user_id on public.reviews(user_id);
create index if not exists idx_reviews_film_id on public.reviews(film_id);

-- 2.3 Watchlist
create table if not exists public.watchlist (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  film_id     integer not null,
  film_title  text not null,
  film_year   integer,
  film_poster text,
  added_at    timestamptz not null default now(),
  unique(user_id, film_id)
);

create index if not exists idx_watchlist_user_id on public.watchlist(user_id);

-- 2.4 Listas personalizadas
create table if not exists public.custom_lists (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  description text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_custom_lists_user_id on public.custom_lists(user_id);

-- 2.5 Películas dentro de listas personalizadas
create table if not exists public.list_films (
  id          uuid primary key default gen_random_uuid(),
  list_id     uuid not null references public.custom_lists(id) on delete cascade,
  film_id     integer not null,
  film_title  text not null,
  film_poster text,
  film_year   integer,
  added_at    timestamptz not null default now(),
  unique(list_id, film_id)
);

create index if not exists idx_list_films_list_id on public.list_films(list_id);

-- 2.6 Seguimiento entre usuarios (follows)
create table if not exists public.follows (
  follower_id  uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

create index if not exists idx_follows_follower_id  on public.follows(follower_id);
create index if not exists idx_follows_following_id on public.follows(following_id);

-- 2.7 Reporte diario de recomendaciones (CU 32)
create table if not exists public.recommendations (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  report_date     date not null default current_date,
  recommendations jsonb not null default '[]'::jsonb,
  generated_at    timestamptz not null default now(),
  unique(user_id, report_date)
);

create index if not exists idx_recommendations_user_date on public.recommendations(user_id, report_date);

-- ─── 3. TRIGGERS (updated_at automático) ───

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_reviews
  before update on public.reviews
  for each row execute function public.update_updated_at();

create trigger set_updated_at_custom_lists
  before update on public.custom_lists
  for each row execute function public.update_updated_at();

-- ─── 4. ROW LEVEL SECURITY ───

alter table public.profiles        enable row level security;
alter table public.reviews         enable row level security;
alter table public.watchlist       enable row level security;
alter table public.custom_lists    enable row level security;
alter table public.list_films      enable row level security;
alter table public.follows         enable row level security;
alter table public.recommendations enable row level security;

-- 4.1 Profiles: lectura pública, escritura solo propio usuario
create policy "Profiles son públicos"
  on public.profiles for select
  using (true);

create policy "Usuarios crean su propio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Usuarios actualizan su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- 4.2 Reviews: lectura pública, CRUD solo dueño
create policy "Reseñas visibles para todos"
  on public.reviews for select
  using (true);

create policy "Usuarios insertan sus reseñas"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Usuarios actualizan sus reseñas"
  on public.reviews for update
  using (auth.uid() = user_id);

create policy "Usuarios eliminan sus reseñas"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- 4.3 Watchlist: solo dueño
create policy "Watchlist solo visible por el dueño"
  on public.watchlist for select
  using (auth.uid() = user_id);

create policy "Usuarios insertan en su watchlist"
  on public.watchlist for insert
  with check (auth.uid() = user_id);

create policy "Usuarios eliminan de su watchlist"
  on public.watchlist for delete
  using (auth.uid() = user_id);

-- 4.4 Custom lists: solo dueño
create policy "Listas solo visibles por el dueño"
  on public.custom_lists for select
  using (auth.uid() = user_id);

create policy "Usuarios crean sus listas"
  on public.custom_lists for insert
  with check (auth.uid() = user_id);

create policy "Usuarios actualizan sus listas"
  on public.custom_lists for update
  using (auth.uid() = user_id);

create policy "Usuarios eliminan sus listas"
  on public.custom_lists for delete
  using (auth.uid() = user_id);

-- 4.5 List films: solo dueño (via la lista padre)
create policy "Films de lista solo visibles por el dueño"
  on public.list_films for select
  using (
    exists (
      select 1 from public.custom_lists
      where id = list_id and user_id = auth.uid()
    )
  );

create policy "Dueño de la lista inserta films"
  on public.list_films for insert
  with check (
    exists (
      select 1 from public.custom_lists
      where id = list_id and user_id = auth.uid()
    )
  );

create policy "Dueño de la lista elimina films"
  on public.list_films for delete
  using (
    exists (
      select 1 from public.custom_lists
      where id = list_id and user_id = auth.uid()
    )
  );

-- 4.6 Follows: lectura pública (quién sigue a quién), escritura solo propio
create policy "Follows visibles para todos"
  on public.follows for select
  using (true);

create policy "Usuario sigue/deja de seguir"
  on public.follows for insert
  with check (auth.uid() = follower_id);

create policy "Usuario deja de seguir"
  on public.follows for delete
  using (auth.uid() = follower_id);

-- 4.7 Recommendations: solo dueño
create policy "Recomendaciones solo visibles por el dueño"
  on public.recommendations for select
  using (auth.uid() = user_id);

create policy "Sistema inserta recomendaciones"
  on public.recommendations for insert
  with check (auth.uid() = user_id);

create policy "Usuarios actualizan sus recomendaciones"
  on public.recommendations for update
  using (auth.uid() = user_id);

-- ─── 5. SEED DATA (usuarios demo) ───
-- Nota: los usuarios en auth.users deben existir primero.
-- Estos inserts asumen que ya hay usuarios creados vía Supabase Auth.
-- Si querés datos de prueba, creá usuarios primero desde el dashboard
-- o desde el formulario de registro de la app.

-- Trigger: crear profile automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger as $$
declare
  base_username text;
  final_username text;
  counter int := 0;
begin
  base_username := coalesce(
    new.raw_user_meta_data ->> 'username',
    split_part(new.email, '@', 1),
    'user_' || substr(new.id::text, 1, 8)
  );
  final_username := base_username;

  -- Asegurar username único
  while exists (select 1 from public.profiles where username = final_username) loop
    counter := counter + 1;
    final_username := base_username || counter::text;
  end loop;

  insert into public.profiles (id, username, avatar_url, created_at)
  values (new.id, final_username, null, now());
  return new;
end;
$$ language plpgsql security definer;

-- Borrar el trigger si ya existe para recrearlo limpio
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- FIN del migration
-- ============================================================
