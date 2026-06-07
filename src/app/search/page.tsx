'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { MovieSearchResult } from '@/lib/types';
import { SearchInput } from '@/components/catalog/search-input';
import { MovieCard } from '@/components/catalog/movie-card';
import { MovieGrid } from '@/components/catalog/movie-grid';

type SearchState = 'initial' | 'loading' | 'results' | 'no-results' | 'error';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get('q') ?? '';

  const [query, setQuery] = useState(queryParam);
  const [movies, setMovies] = useState<MovieSearchResult[]>([]);
  const [state, setState] = useState<SearchState>(
    queryParam ? 'loading' : 'initial',
  );

  const doSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (trimmed.length === 0) {
      setState('initial');
      setMovies([]);
      return;
    }

    setState('loading');
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
      if (!res.ok) throw new Error('Search failed');
      const data: MovieSearchResult[] = await res.json();

      setMovies(data);
      setState(data.length === 0 ? 'no-results' : 'results');
    } catch {
      setState('error');
      setMovies([]);
    }
  }, []);

  // Re-fetch when URL param changes
  useEffect(() => {
    if (queryParam) {
      doSearch(queryParam);
      setQuery(queryParam);
    } else {
      setState('initial');
      setMovies([]);
      setQuery('');
    }
  }, [queryParam, doSearch]);

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (trimmed.length === 0) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Search bar */}
      <div className="mb-8 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Buscador de películas</h1>
        <SearchInput
          value={query}
          onChange={setQuery}
          onSubmit={handleSubmit}
          placeholder="Buscá por título..."
        />
      </div>

      {/* States */}
      {state === 'initial' && (
        <p className="mt-12 text-center text-gray-500">
          Escribí un título y presioná Enter para buscar.
        </p>
      )}

      {state === 'loading' && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] w-full rounded-xl bg-gray-800" />
              <div className="mt-2 space-y-2 p-2">
                <div className="h-4 w-3/4 rounded bg-gray-800" />
                <div className="h-3 w-1/2 rounded bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      )}

      {state === 'error' && (
        <p className="mt-12 rounded-lg border border-gray-800 bg-gray-900/50 p-6 text-center text-gray-400">
          No pudimos completar la búsqueda. Intentalo de nuevo más tarde.
        </p>
      )}

      {state === 'no-results' && (
        <div className="mt-12 text-center">
          <p className="text-gray-400">
            No encontramos resultados para &ldquo;{query}&rdquo;.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Probá con otro término de búsqueda.
          </p>
        </div>
      )}

      {state === 'results' && (
        <>
          <p className="mb-6 text-sm text-gray-400">
            {movies.length} resultado{movies.length !== 1 ? 's' : ''} para
            &ldquo;{query}&rdquo;
          </p>
          <MovieGrid>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </MovieGrid>
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-64 animate-pulse rounded bg-gray-800" />
            <div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-gray-800" />
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
