'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Trash2, List, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  getListById,
  deleteList,
  removeFilmFromList,
} from '@/lib/supabase/store';
import type { CustomListRow, ListFilmRow } from '@/lib/types';

export default function ListDetailPage({
  params,
}: {
  params: Promise<{ listId: string }>;
}) {
  const router = useRouter();
  const supabase = useRef(createClient()).current;
  const [userId, setUserId] = useState<string | null>(null);
  const [listId, setListId] = useState<string | null>(null);
  const [list, setList] = useState<CustomListRow | null>(null);
  const [films, setFilms] = useState<ListFilmRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
      }
    }).catch((err) => {
      console.error('[list-detail] auth:', err);
    });
  }, [supabase]);

  useEffect(() => {
    let ignore = false;
    params.then(async ({ listId: id }) => {
      if (ignore) return;
      setListId(id);
      try {
        const entry = await getListById(supabase, id);
        if (!entry) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setList(entry.list);
        setFilms(entry.films);
      } catch (err) {
        console.error('[list-detail] load:', err);
        setError('No pudimos cargar esta lista. Intentalo de nuevo.');
      } finally {
        setLoading(false);
      }
    });
    return () => { ignore = true; };
  }, [params, supabase]);

  const handleDelete = useCallback(async () => {
    if (!listId) return;
    const confirmed = window.confirm(
      '¿Estás seguro de eliminar esta lista?',
    );
    if (!confirmed) return;
    try {
      await deleteList(supabase, listId);
      router.push('/profile');
    } catch (err) {
      console.error('[list-detail] delete:', err);
    }
  }, [listId, router, supabase]);

  const handleRemoveFilm = useCallback(
    async (filmId: number) => {
      if (!listId) return;
      try {
        await removeFilmFromList(supabase, listId, filmId);
        setFilms((prev) => prev.filter((f) => f.film_id !== filmId));
      } catch (err) {
        console.error('[list-detail] remove film:', err);
      }
    },
    [listId, supabase],
  );

  // ── Loading ──
  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="animate-shimmer space-y-6">
          <div className="h-8 w-48 rounded bg-glass-bg" />
          <div className="h-32 w-full rounded-2xl bg-glass-bg" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] w-full rounded-xl bg-glass-bg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="py-16 text-center">
          <p className="text-muted-foreground mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="rounded-lg bg-cinema-gold px-5 py-2 text-sm font-semibold text-black">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // ── Not found ──
  if (notFound || !list) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Link
          href="/profile"
          className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-cinema-gold"
        >
          <ArrowLeft className="size-4" />
          Volver al perfil
        </Link>
        <div className="py-16 text-center">
          <List className="mx-auto mb-3 size-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">Lista no encontrada</p>
          <Link
            href="/profile"
            className="mt-3 inline-block text-sm text-cinema-gold hover:text-cinema-amber transition-colors"
          >
            Volver a mi perfil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Back link */}
      <Link
        href="/profile"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-cinema-gold"
      >
        <ArrowLeft className="size-4" />
        Volver al perfil
      </Link>

      {/* Glass header */}
      <div className="glass mb-8 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-white">{list.name}</h1>
            {list.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {list.description}
              </p>
            )}
            <p className="mt-2 text-sm text-cinema-gold/70">
              {films.length === 1
                ? '1 película'
                : `${films.length} películas`}
            </p>
          </div>

          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:border-red-500/40"
          >
            <Trash2 className="size-4" />
            Eliminar lista
          </button>
        </div>
      </div>

      {/* Film grid or empty state */}
      {films.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {films.map((entry) => (
            <div key={entry.film_id} className="group relative">
              <Link
                href={`/film/${entry.film_id}`}
                className="block"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-glass-bg">
                  {entry.film_poster ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w342${entry.film_poster}`}
                      alt={entry.film_title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground text-xs p-2 text-center">
                      {entry.film_title}
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm text-white truncate group-hover:text-cinema-gold transition-colors">
                  {entry.film_title}
                </p>
                {entry.film_year && (
                  <p className="text-xs text-muted-foreground">
                    {entry.film_year}
                  </p>
                )}
              </Link>

              {/* Remove button overlay */}
              <button
                onClick={() => handleRemoveFilm(entry.film_id)}
                className="absolute right-2 top-2 z-10 flex size-7 items-center justify-center rounded-full bg-black/60 text-white/80 opacity-0 transition-opacity hover:bg-red-500/70 hover:text-white group-hover:opacity-100"
                title="Quitar de la lista"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <List className="mx-auto mb-3 size-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">
            Esta lista está vacía. Agregá películas desde la página de cada
            film.
          </p>
          <Link
            href="/search"
            className="mt-3 inline-block text-sm text-cinema-gold hover:text-cinema-amber transition-colors"
          >
            Explorar películas
          </Link>
        </div>
      )}
    </div>
  );
}
