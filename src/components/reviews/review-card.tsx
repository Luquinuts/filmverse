'use client';

import { Star, Trash2, AlertTriangle, Flag, Crown } from 'lucide-react';
import type { ReviewRow } from '@/lib/types';

interface ReviewCardProps {
  review: ReviewRow;
  isOwner: boolean;
  onDelete?: (id: string) => void;
  onReport?: (id: string) => void;
  showFilmInfo?: boolean;
  username?: string;
  isPremium?: boolean;
}

export function ReviewCard({
  review,
  isOwner,
  onDelete,
  onReport,
  showFilmInfo,
  username,
  isPremium,
}: ReviewCardProps) {
  return (
    <article
      className={`glass rounded-2xl p-5 ${
        review.is_spoiler ? 'border-orange-500/20' : ''
      }`}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white text-sm">
              {username ?? review.user_id.slice(0, 8)}
            </span>
            {isPremium && <Crown className="size-3.5 text-cinema-gold" />}
            {showFilmInfo && (
              <span className="text-xs text-muted-foreground truncate">
                en {review.film_title}
                {review.film_year && ` (${review.film_year})`}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-1">
            <Star className="size-3.5 fill-cinema-gold text-cinema-gold" />
            <span className="text-xs text-cinema-gold/70">
              {review.rating}/10
            </span>
          </div>
        </div>

        <time className="shrink-0 text-xs text-muted-foreground">
          {new Date(review.created_at).toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </time>
      </div>

      {/* Spoiler warning */}
      {review.is_spoiler && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-orange-500/10 px-3 py-2 text-xs text-orange-300">
          <AlertTriangle className="size-3.5 shrink-0" />
          Esta reseña contiene spoilers
        </div>
      )}

      {/* Content */}
      <p
        className={`text-sm leading-relaxed text-muted-foreground ${
          review.is_spoiler ? 'blur-sm transition-all hover:blur-none' : ''
        }`}
      >
        {review.content}
      </p>

      {/* Actions */}
      <div className="mt-3 flex justify-end gap-3">
        {isOwner && onDelete && (
          <button
            onClick={() => onDelete(review.id)}
            className="flex items-center gap-1 text-xs text-red-400/60 transition-colors hover:text-red-400"
            aria-label="Eliminar reseña"
          >
            <Trash2 className="size-3.5" />
            Eliminar
          </button>
        )}
        {!isOwner && onReport && (
          <button
            onClick={() => onReport(review.id)}
            className="flex items-center gap-1 text-xs text-muted-foreground/50 transition-colors hover:text-red-400"
            aria-label="Reportar reseña"
          >
            <Flag className="size-3.5" />
            Reportar
          </button>
        )}
      </div>
    </article>
  );
}
