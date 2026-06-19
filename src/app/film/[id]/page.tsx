'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Star, Clock, Calendar, Bookmark, ListPlus } from 'lucide-react';
import type { MovieDetail, MovieSearchResult } from '@/lib/types';
import { CastCard } from '@/components/catalog/cast-card';
import { SimilarCarousel } from '@/components/catalog/similar-carousel';
import { ReviewSection } from '@/components/reviews/review-section';
import { createClient } from '@/lib/supabase/client';
import { AddToListDialog } from '@/components/lists/add-to-list-dialog';
import { isInWatchlist, toggleWatchlist } from '@/lib/local-store';

type DetailState = 'loading' | 'error' | 'not-found' | 'success';

export default function FilmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [similar, setSimilar] = useState<MovieSearchResult[]>([]);
  const [state, setState] = useState<DetailState>('loading');
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [inWatchlist, setInWatchlist] = useState(false);
  const [listDialogOpen, setListDialogOpen] = useState(false);

  // Get current user from mock auth
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        setUsername(
          (data.user.user_metadata?.username as string) ??
            data.user.email?.split('@')[0] ??
            'Usuario',
        );
      }
    });
  }, []);

  const fetchDetail = useCallback(async (id: string) => {
    setState('loading');
    try {
      const [movieRes, similarRes] = await Promise.all([
        fetch(`/api/movies/${id}`),
        fetch(`/api/movies/${id}/similar`),
      ]);

      if (movieRes.status === 400) {
        setState('not-found');
        return;
      }

      if (!movieRes.ok) {
        throw new Error('Failed to fetch movie');
      }

      const movieData: MovieDetail = await movieRes.json();
      const similarData: MovieSearchResult[] = await similarRes.json();

      setMovie(movieData);
      setSimilar(similarData);
      setInWatchlist(isInWatchlist(movieData.id));
      setState('success');
    } catch {
      setState('error');
    }
  }, []);

  useEffect(() => {
    params.then(({ id }) => fetchDetail(id));
  }, [params, fetchDetail]);

  // ── Loading skeleton ──
  if (state === 'loading') {
    return (
      <div className="animate-shimmer">
        <div className="h-[50vh] w-full bg-glass-bg" />
        <div className="mx-auto mt-8 max-w-7xl space-y-6 px-4">
          <div className="h-8 w-64 rounded bg-glass-bg" />
          <div className="h-4 w-96 rounded bg-glass-bg" />
          <div className="flex gap-4">
            <div className="size-48 rounded-xl bg-glass-bg" />
            <div className="flex-1 space-y-4">
              <div className="h-4 w-full rounded bg-glass-bg" />
              <div className="h-4 w-3/4 rounded bg-glass-bg" />
              <div className="h-4 w-1/2 rounded bg-glass-bg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (state === 'error') {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="glass p-6 text-center text-muted-foreground">
          No pudimos cargar la información de esta película. Intentalo de nuevo
          más tarde.
        </p>
      </div>
    );
  }

  // ── Not found ──
  if (state === 'not-found' || !movie) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="glass p-6 text-center text-muted-foreground">
          Película no encontrada.
        </p>
      </div>
    );
  }

  // ── Success ──
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;
  const cast = movie.credits?.cast ?? [];
  const sortedCast = [...cast].sort((a, b) => a.order - b.order).slice(0, 12);

  return (
    <div>
      {/* Backdrop hero */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        {movie.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">Sin imagen disponible</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative mx-auto -mt-40 max-w-7xl px-4 pb-16">
        <div className="flex flex-col gap-6 sm:flex-row">
          {/* Poster */}
          <div className="relative aspect-[2/3] w-48 flex-shrink-0 overflow-hidden rounded-xl border border-white/[4%] shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <svg
                  className="size-12 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1Z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 pt-4 sm:pt-16">
            <div>
              <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
              {movie.tagline && (
                <p className="mt-1 text-sm italic text-muted-foreground">
                  {movie.tagline}
                </p>
              )}
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-cinema-gold/70">
              {year && (
                <span className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  {year}
                </span>
              )}
              {movie.runtime > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="size-4" />
                  {movie.runtime} min
                </span>
              )}
              <span className="flex items-center gap-1">
                <Star className="size-4 fill-cinema-gold text-cinema-gold" />
                {movie.vote_average.toFixed(1)}
              </span>
            </div>

            {/* Genres */}
            {movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="glass rounded-full px-3 py-1 text-xs text-muted-foreground"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <p className="max-w-2xl leading-relaxed text-muted-foreground">
              {movie.overview || 'Sin sinopsis disponible.'}
            </p>

            {/* Watchlist button */}
            {userId && (
              <>
                <button
                  onClick={() => {
                    const added = toggleWatchlist({
                      filmId: movie.id,
                      filmTitle: movie.title,
                      filmPoster: movie.poster_path,
                      filmYear: year,
                    });
                    setInWatchlist(added);
                  }}
                  className={`mt-3 flex items-center gap-2 self-start rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    inWatchlist
                      ? 'bg-cinema-gold/20 text-cinema-gold border border-cinema-gold/40'
                      : 'border border-white/10 text-muted-foreground hover:border-cinema-gold/40 hover:text-cinema-gold'
                  }`}
                >
                  <Bookmark className={`size-4 ${inWatchlist ? 'fill-cinema-gold' : ''}`} />
                  {inWatchlist ? 'Guardada' : 'Guardar en lista'}
                </button>

                {/* Add to list button */}
                <button
                  onClick={() => setListDialogOpen(true)}
                  className="mt-3 flex items-center gap-2 self-start rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-cinema-gold/40 hover:text-cinema-gold"
                >
                  <ListPlus className="size-4" />
                  Agregar a lista...
                </button>

                <AddToListDialog
                  open={listDialogOpen}
                  onClose={() => setListDialogOpen(false)}
                  film={{
                    filmId: movie.id,
                    filmTitle: movie.title,
                    filmPoster: movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : '',
                    filmYear: year ?? 0,
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* Cast section */}
        {sortedCast.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold text-white">Reparto</h2>
            <div className="grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {sortedCast.map((member) => (
                <CastCard
                  key={member.id}
                  name={member.name}
                  character={member.character}
                  profilePath={member.profile_path}
                />
              ))}
            </div>
          </section>
        )}

        {/* Similar movies */}
        {similar.length > 0 && (
          <section className="mt-12">
            <SimilarCarousel movies={similar} />
          </section>
        )}

        {/* Reviews */}
        {userId && movie && (
          <section className="mt-12">
            <ReviewSection
              filmId={movie.id}
              filmTitle={movie.title}
              filmPoster={movie.poster_path}
              filmYear={movie.release_date ? new Date(movie.release_date).getFullYear() : null}
              userId={userId}
              username={username}
            />
          </section>
        )}
      </div>
    </div>
  );
}
