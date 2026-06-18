'use client';

import { useState, useEffect, useCallback } from 'react';
import type { MovieSearchResult } from '@/lib/types';
import { MovieCard } from '@/components/catalog/movie-card';
import { MovieGrid } from '@/components/catalog/movie-grid';

export function TrendingSection() {
  const [movies, setMovies] = useState<MovieSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchTrending = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const res = await fetch('/api/trending');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setMovies(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4">
        <h2 className="mb-6 text-2xl font-bold text-cinema-gold">Tendencias</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="animate-shimmer">
              <div className="aspect-[2/3] w-full rounded-xl bg-glass-bg" />
              <div className="mt-2 space-y-2 p-2">
                <div className="h-4 w-3/4 rounded bg-glass-bg" />
                <div className="h-3 w-1/2 rounded bg-glass-bg" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4">
        <h2 className="mb-6 text-2xl font-bold text-cinema-gold">Tendencias</h2>
        <p className="glass p-6 text-center text-muted-foreground">
          No pudimos cargar las tendencias. Intentalo de nuevo más tarde.
        </p>
      </section>
    );
  }

  if (movies.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4">
        <h2 className="mb-6 text-2xl font-bold text-cinema-gold">Tendencias</h2>
        <p className="glass p-6 text-center text-muted-foreground">
          No hay películas para mostrar.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4">
      <h2 className="mb-6 text-2xl font-bold text-cinema-gold">Tendencias</h2>
      <MovieGrid>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </MovieGrid>
    </section>
  );
}
