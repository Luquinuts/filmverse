'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  existingRating: number | null;
  existingContent: string | null;
  existingSpoiler: boolean;
  onSave: (data: {
    rating: number;
    content: string;
    isSpoiler: boolean;
  }) => void;
  onCancel?: () => void;
  error?: string | null;
}

export function ReviewForm({
  existingRating,
  existingContent,
  existingSpoiler,
  onSave,
  onCancel,
  error,
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingRating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState(existingContent ?? '');
  const [isSpoiler, setIsSpoiler] = useState(existingSpoiler);

  const isEditing = existingRating !== null || (existingContent ?? '').length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    onSave({ rating, content: content.trim(), isSpoiler });
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-5">
      <h3 className="mb-4 font-semibold text-white">
        {isEditing ? 'Editar reseña' : 'Escribí tu reseña'}
      </h3>

      {/* Star rating */}
      <div className="mb-4">
        <label className="mb-2 block text-sm text-muted-foreground">
          Puntuación
        </label>
        <div className="flex gap-1">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
              aria-label={`${star} punto${star !== 1 ? 's' : ''}`}
            >
              <Star
                className={`size-5 ${
                  star <= (hoverRating || rating)
                    ? 'fill-cinema-gold text-cinema-gold'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="mt-1 text-xs text-cinema-gold/70">{rating}/10</p>
        )}
      </div>

      {/* Review text */}
      <div className="mb-4">
        <label htmlFor="review-content" className="mb-2 block text-sm text-muted-foreground">
          Reseña
        </label>
        <textarea
          id="review-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="¿Qué te pareció la película?"
          rows={4}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:border-cinema-gold/50 focus:outline-none"
        />
      </div>

      {/* Spoiler toggle */}
      <label className="mb-5 flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={isSpoiler}
          onChange={(e) => setIsSpoiler(e.target.checked)}
          className="rounded border-white/10 bg-white/5 text-cinema-gold focus:ring-cinema-gold/50"
        />
        Contiene spoilers
      </label>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={rating === 0}
          className="rounded-lg bg-cinema-gold px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-cinema-amber disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isEditing ? 'Guardar cambios' : 'Publicar reseña'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-white/10 px-5 py-2 text-sm text-muted-foreground transition-colors hover:text-white"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
