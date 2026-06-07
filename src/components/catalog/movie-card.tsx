'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { MovieSearchResult } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: MovieSearchResult;
  priority?: boolean;
}

export function MovieCard({ movie, priority = false }: MovieCardProps) {
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  return (
    <Link
      href={`/film/${movie.id}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl',
        'border border-gray-800 bg-gray-900/80',
        'transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20 hover:border-indigo-500/30',
      )}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        {movie.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            priority={priority}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-800">
            <svg
              className="size-12 text-gray-600"
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
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-gray-100 group-hover:text-white">
          {movie.title}
        </h3>

        <div className="mt-auto flex items-center justify-between text-xs text-gray-400">
          {year ? <span>{year}</span> : <span />}
          <span className="flex items-center gap-1">
            <Star className="size-3 fill-yellow-500 text-yellow-500" />
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}
