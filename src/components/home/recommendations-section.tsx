'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Film, RotateCcw, Sparkles } from 'lucide-react';
import type { ReviewRow, WatchlistRow } from '@/lib/types';
import type { Recommendation } from '@/lib/types';

interface Props {
  userId: string;
  reviews: ReviewRow[];
  watchlist: WatchlistRow[];
}

export function RecommendationsSection({ userId, reviews, watchlist }: Props) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // CU 32 — Reporte diario de recomendaciones
      const res = await fetch('/api/ai/recommend/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reviews, watchlist }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? 'Error desconocido');
      }

      const data = (await res.json()) as {
        recommendations: Recommendation[];
        date: string;
        generatedAt?: string;
        cached?: boolean;
      };
      setRecommendations(data.recommendations);
      setLastUpdated(data.generatedAt ?? null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [userId, reviews, watchlist]);

  useEffect(() => {
    if (reviews.length === 0) return;

    fetchRecommendations();
  }, [reviews.length, fetchRecommendations]);

  const handleRefresh = () => {
    fetchRecommendations();
  };

  // Empty state: no reviews
  if (reviews.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4">
        <div className="glass rounded-2xl border border-dashed border-white/10 p-12 text-center">
          <Film className="mx-auto mb-4 size-12 text-cinema-gold/50" />
          <p className="text-lg text-muted-foreground">
            Agregá reseñas para recibir recomendaciones personalizadas
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-lg font-bold text-white">
          <Sparkles className="size-5 text-cinema-gold" />
          Próximas películas para ver
        </div>
        {lastUpdated && (
          <p className="mt-1 text-xs text-muted-foreground">
            Actualizado el{' '}
            {new Date(lastUpdated).toLocaleString('es-AR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'America/Argentina/Buenos_Aires',
            })}
          </p>
        )}
      </div>

      {/* Loading shimmer */}
      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-shimmer">
              <div className="aspect-[2/3] w-full rounded-xl bg-glass-bg" />
              <div className="mt-2 space-y-2 p-2">
                <div className="h-4 w-3/4 rounded bg-glass-bg" />
                <div className="h-3 w-1/3 rounded bg-glass-bg" />
                <div className="h-3 w-full rounded bg-glass-bg" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="mb-4 text-muted-foreground">
            No pudimos generar recomendaciones. Intentalo de nuevo.
          </p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-lg bg-cinema-gold px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-cinema-amber"
          >
            <RotateCcw className="size-4" />
            Reintentar
          </button>
        </div>
      )}

      {/* Success: recommendations cards */}
      {!loading && !error && recommendations.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {recommendations.map((rec, i) => (
            <Link
              key={`${rec.title}-${i}`}
              href={rec.filmId ? `/film/${rec.filmId}` : '#'}
              className="glass glow-amber group flex flex-col overflow-hidden rounded-xl transition-all duration-300 hover:scale-105"
            >
              {/* Poster */}
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-gradient-to-br from-cinema-gold/20 via-cinema-amber/10 to-purple-900/30">
                {rec.posterPath ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w342${rec.posterPath}`}
                    alt={rec.title}
                    className="size-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Film className="size-10 text-white/20" />
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col gap-2 p-3">
                <h3 className="line-clamp-1 text-sm font-semibold text-white">
                  {rec.title}
                </h3>

                {rec.matchPercentage !== undefined && (
                  <span className="inline-flex w-fit rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                    {rec.matchPercentage}% de match
                  </span>
                )}

                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {rec.reason}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty recommendations from API */}
      {!loading && !error && recommendations.length === 0 && (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-muted-foreground">
            No pudimos generar recomendaciones en este momento.
          </p>
          <button
            onClick={handleRefresh}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-cinema-gold px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-cinema-amber"
          >
            <RotateCcw className="size-4" />
            Reintentar
          </button>
        </div>
      )}
    </section>
  );
}
