-- =============================================================================
-- FilmVerse — Migración Inicial
-- Tablas, enumeraciones y políticas RLS
-- =============================================================================

-- ═════════════════════════════════════════════════════════════════════════════
-- ENUMS
-- ═════════════════════════════════════════════════════════════════════════════

CREATE TYPE user_role AS ENUM ('cinefilo', 'premium', 'moderador', 'admin');
CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'cancelled');
CREATE TYPE report_reason AS ENUM (
  'spam', 'inappropriate', 'harassment', 'fake_review', 'other'
);
CREATE TYPE like_target_type AS ENUM ('review', 'list');

-- ═════════════════════════════════════════════════════════════════════════════
-- TABLAS
-- ═════════════════════════════════════════════════════════════════════════════

-- Tabla 1: users — extiende auth.users de Supabase
CREATE TABLE public.users (
  id          UUID          PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT          UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url  TEXT,
  bio         TEXT,
  role        user_role     NOT NULL DEFAULT 'cinefilo',
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Tabla 2: films — catálogo de películas desde TMDB
CREATE TABLE public.films (
  id                BIGSERIAL     PRIMARY KEY,
  tmdb_id           INTEGER       UNIQUE NOT NULL,
  title             TEXT          NOT NULL,
  overview          TEXT,
  poster_path       TEXT,
  backdrop_path     TEXT,
  release_date      DATE,
  vote_average      DECIMAL(3,1),
  vote_count        INTEGER       DEFAULT 0,
  genres            TEXT[],       -- array de nombres de género
  runtime           INTEGER,
  original_language TEXT,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Tabla 3: watched_films — películas marcadas como vistas
CREATE TABLE public.watched_films (
  id          BIGSERIAL     PRIMARY KEY,
  user_id     UUID          NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  film_id     BIGINT        NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
  watched_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, film_id)
);

-- Tabla 4: watchlist_films — películas en la lista de pendientes
CREATE TABLE public.watchlist_films (
  id        BIGSERIAL     PRIMARY KEY,
  user_id   UUID          NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  film_id   BIGINT        NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
  added_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, film_id)
);

-- Tabla 5: reviews — reseñas de películas
CREATE TABLE public.reviews (
  id          BIGSERIAL     PRIMARY KEY,
  user_id     UUID          NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  film_id     BIGINT        NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
  content     TEXT          NOT NULL,
  is_spoiler  BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, film_id)
);

-- Tabla 6: ratings — puntuaciones del 1 al 10
CREATE TABLE public.ratings (
  id          BIGSERIAL     PRIMARY KEY,
  user_id     UUID          NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  film_id     BIGINT        NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
  score       INTEGER       NOT NULL CHECK (score >= 1 AND score <= 10),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, film_id)
);

-- Tabla 7: custom_lists — listas personalizadas de películas
CREATE TABLE public.custom_lists (
  id          BIGSERIAL     PRIMARY KEY,
  user_id     UUID          NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name        TEXT          NOT NULL,
  description TEXT,
  is_public   BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Tabla 8: list_films — películas dentro de una lista
CREATE TABLE public.list_films (
  id        BIGSERIAL     PRIMARY KEY,
  list_id   BIGINT        NOT NULL REFERENCES public.custom_lists(id) ON DELETE CASCADE,
  film_id   BIGINT        NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
  added_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE(list_id, film_id)
);

-- Tabla 9: follows — seguidores
CREATE TABLE public.follows (
  id           BIGSERIAL     PRIMARY KEY,
  follower_id  UUID          NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  followed_id  UUID          NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE(follower_id, followed_id),
  CHECK (follower_id <> followed_id)
);

-- Tabla 10: likes — megusta polimórfico (review o lista)
CREATE TABLE public.likes (
  id          BIGSERIAL        PRIMARY KEY,
  user_id     UUID             NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_id   BIGINT           NOT NULL,
  target_type like_target_type NOT NULL,
  created_at  TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, target_id, target_type)
);

-- Tabla 11: reports — denuncias de contenido
CREATE TABLE public.reports (
  id            BIGSERIAL     PRIMARY KEY,
  reporter_id   UUID          NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_id     BIGINT        NOT NULL,
  target_type   TEXT          NOT NULL,  -- 'review', 'list', 'user'
  reason        report_reason NOT NULL,
  description   TEXT,
  resolved      BOOLEAN       NOT NULL DEFAULT FALSE,
  resolved_by   UUID          REFERENCES public.users(id),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  resolved_at   TIMESTAMPTZ
);

-- Tabla 12: premium_subscriptions — suscripciones premium
CREATE TABLE public.premium_subscriptions (
  id                        BIGSERIAL           PRIMARY KEY,
  user_id                   UUID                NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status                    subscription_status NOT NULL DEFAULT 'active',
  start_date                TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  end_date                  TIMESTAMPTZ,
  mercadopago_subscription_id TEXT,
  created_at                TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Tabla 13: chat_sessions — sesiones del chatbot IA
CREATE TABLE public.chat_sessions (
  id          BIGSERIAL     PRIMARY KEY,
  user_id     UUID          NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title       TEXT,
  messages    JSONB         NOT NULL DEFAULT '[]'::jsonb,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Tabla 14: daily_reports — reportes diarios de actividad
CREATE TABLE public.daily_reports (
  id              BIGSERIAL     PRIMARY KEY,
  user_id         UUID          NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date            DATE          NOT NULL DEFAULT CURRENT_DATE,
  films_watched   INTEGER       NOT NULL DEFAULT 0,
  reviews_written INTEGER       NOT NULL DEFAULT 0,
  ratings_given   INTEGER       NOT NULL DEFAULT 0,
  minutes_watched INTEGER       NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ═════════════════════════════════════════════════════════════════════════════
-- ÍNDICES
-- ═════════════════════════════════════════════════════════════════════════════

CREATE INDEX idx_films_tmdb_id        ON public.films(tmdb_id);
CREATE INDEX idx_films_title          ON public.films(title);
CREATE INDEX idx_watched_films_user   ON public.watched_films(user_id);
CREATE INDEX idx_watchlist_films_user ON public.watchlist_films(user_id);
CREATE INDEX idx_reviews_film         ON public.reviews(film_id);
CREATE INDEX idx_reviews_user         ON public.reviews(user_id);
CREATE INDEX idx_ratings_film         ON public.ratings(film_id);
CREATE INDEX idx_custom_lists_user    ON public.custom_lists(user_id);
CREATE INDEX idx_list_films_list      ON public.list_films(list_id);
CREATE INDEX idx_follows_follower     ON public.follows(follower_id);
CREATE INDEX idx_follows_followed     ON public.follows(followed_id);
CREATE INDEX idx_likes_target         ON public.likes(target_id, target_type);
CREATE INDEX idx_reports_resolved     ON public.reports(resolved);
CREATE INDEX idx_chat_sessions_user   ON public.chat_sessions(user_id);
CREATE INDEX idx_daily_reports_user   ON public.daily_reports(user_id);
CREATE INDEX idx_daily_reports_date   ON public.daily_reports(date);

-- ═════════════════════════════════════════════════════════════════════════════
-- RLS — SEGURIDAD A NIVEL DE FILA
-- ═════════════════════════════════════════════════════════════════════════════

-- Habilitar RLS en todas las tablas
ALTER TABLE public.users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.films               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watched_films       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist_films     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_lists        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.list_films          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reports       ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────
-- users
-- ─────────────────────────────
CREATE POLICY "users_read_own"   ON public.users FOR SELECT
  USING (auth.uid() = id);
CREATE POLICY "users_insert_own" ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- ─────────────────────────────
-- films (lectura pública, solo mods insertan)
-- ─────────────────────────────
CREATE POLICY "films_read_all"    ON public.films FOR SELECT
  USING (TRUE);
CREATE POLICY "films_insert_mod"  ON public.films FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'moderador'))
  );
CREATE POLICY "films_update_mod"  ON public.films FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'moderador'))
  );

-- ─────────────────────────────
-- watched_films (CRUD propio)
-- ─────────────────────────────
CREATE POLICY "watched_films_read_own"   ON public.watched_films FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "watched_films_insert_own" ON public.watched_films FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "watched_films_delete_own" ON public.watched_films FOR DELETE
  USING (auth.uid() = user_id);

-- ─────────────────────────────
-- watchlist_films (CRUD propio)
-- ─────────────────────────────
CREATE POLICY "watchlist_films_read_own"   ON public.watchlist_films FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "watchlist_films_insert_own" ON public.watchlist_films FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "watchlist_films_delete_own" ON public.watchlist_films FOR DELETE
  USING (auth.uid() = user_id);

-- ─────────────────────────────
-- reviews (lectura pública, CRUD propio, moderadores pueden borrar)
-- ─────────────────────────────
CREATE POLICY "reviews_read_all"     ON public.reviews FOR SELECT
  USING (TRUE);
CREATE POLICY "reviews_insert_own"   ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_own"   ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "reviews_delete_own"   ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);
CREATE POLICY "reviews_delete_mod"   ON public.reviews FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'moderador'))
  );

-- ─────────────────────────────
-- ratings (lectura pública, CRUD propio)
-- ─────────────────────────────
CREATE POLICY "ratings_read_all"     ON public.ratings FOR SELECT
  USING (TRUE);
CREATE POLICY "ratings_insert_own"   ON public.ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ratings_update_own"   ON public.ratings FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "ratings_delete_own"   ON public.ratings FOR DELETE
  USING (auth.uid() = user_id);

-- ─────────────────────────────
-- custom_lists (lectura propia o pública, CRUD propio)
-- ─────────────────────────────
CREATE POLICY "lists_read_accessible" ON public.custom_lists FOR SELECT
  USING (auth.uid() = user_id OR is_public = TRUE);
CREATE POLICY "lists_insert_own"      ON public.custom_lists FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lists_update_own"      ON public.custom_lists FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "lists_delete_own"      ON public.custom_lists FOR DELETE
  USING (auth.uid() = user_id);

-- ─────────────────────────────
-- list_films (lectura según lista, inserción/borrado si lista propia)
-- ─────────────────────────────
CREATE POLICY "list_films_read_accessible" ON public.list_films FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.custom_lists
      WHERE id = list_id AND (user_id = auth.uid() OR is_public = TRUE))
  );
CREATE POLICY "list_films_insert_own" ON public.list_films FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.custom_lists WHERE id = list_id AND user_id = auth.uid())
  );
CREATE POLICY "list_films_delete_own" ON public.list_films FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.custom_lists WHERE id = list_id AND user_id = auth.uid())
  );

-- ─────────────────────────────
-- follows (lectura de quien sigue o es seguido, CRUD propio)
-- ─────────────────────────────
CREATE POLICY "follows_read_involved"  ON public.follows FOR SELECT
  USING (auth.uid() = follower_id OR auth.uid() = followed_id);
CREATE POLICY "follows_insert_own"     ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows_delete_own"     ON public.follows FOR DELETE
  USING (auth.uid() = follower_id);

-- ─────────────────────────────
-- likes (lectura pública, CRUD propio)
-- ─────────────────────────────
CREATE POLICY "likes_read_all"     ON public.likes FOR SELECT
  USING (TRUE);
CREATE POLICY "likes_insert_own"   ON public.likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_delete_own"   ON public.likes FOR DELETE
  USING (auth.uid() = user_id);

-- ─────────────────────────────
-- reports (lectura propia o de mod, inserción propia, mods actualizan)
-- ─────────────────────────────
CREATE POLICY "reports_read_accessible" ON public.reports FOR SELECT
  USING (
    auth.uid() = reporter_id
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'moderador'))
  );
CREATE POLICY "reports_insert_own"      ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "reports_update_mod"      ON public.reports FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'moderador'))
  );

-- ─────────────────────────────
-- premium_subscriptions (lectura propia o de admin)
-- ─────────────────────────────
CREATE POLICY "subscriptions_read_own" ON public.premium_subscriptions FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'moderador'))
  );

-- ─────────────────────────────
-- chat_sessions (CRUD propio)
-- ─────────────────────────────
CREATE POLICY "chats_read_own"    ON public.chat_sessions FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "chats_insert_own"  ON public.chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "chats_update_own"  ON public.chat_sessions FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "chats_delete_own"  ON public.chat_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- ─────────────────────────────
-- daily_reports (lectura propia; inserción por servicio/sistema)
-- ─────────────────────────────
CREATE POLICY "reports_read_own" ON public.daily_reports FOR SELECT
  USING (auth.uid() = user_id);
