'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageSquareText } from 'lucide-react';
import { ReviewForm } from './review-form';
import { ReviewCard } from './review-card';
import {
  getFilmReviews,
  saveReview,
  deleteReview,
  getUserRating,
  type ReviewEntry,
} from '@/lib/local-store';

interface ReviewSectionProps {
  filmId: number;
  filmTitle: string;
  filmPoster: string | null;
  filmYear: number | null;
  userId: string;
  username: string;
}

export function ReviewSection({
  filmId,
  filmTitle,
  filmPoster,
  filmYear,
  userId,
  username,
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [showForm, setShowForm] = useState(false);

  const loadReviews = useCallback(() => {
    setReviews(getFilmReviews(filmId));
  }, [filmId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const existing = getUserRating(filmId, userId);
  const existingReview = reviews.find((r) => r.userId === userId);

  const handleSave = (data: { rating: number; content: string; isSpoiler: boolean }) => {
    saveReview({
      filmId,
      filmTitle,
      filmPoster,
      filmYear,
      userId,
      username,
      ...data,
    });
    setShowForm(false);
    loadReviews();
  };

  const handleDelete = (reviewId: string) => {
    deleteReview(reviewId);
    loadReviews();
  };

  const otherReviews = reviews.filter((r) => r.userId !== userId);

  return (
    <section>
      <h2 className="mb-6 text-xl font-bold text-white flex items-center gap-2">
        <MessageSquareText className="size-5" />
        Reseñas
      </h2>

      {/* User's own review */}
      {showForm || existingReview ? (
        <div className="mb-8">
          {showForm ? (
            <ReviewForm
              existingRating={existing}
              existingContent={existingReview?.content ?? null}
              existingSpoiler={existingReview?.isSpoiler ?? false}
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
            />
          ) : existingReview ? (
            <div>
              <ReviewCard
                review={existingReview}
                isOwner
                onDelete={handleDelete}
              />
              <button
                onClick={() => setShowForm(true)}
                className="mt-3 text-sm text-cinema-gold/70 hover:text-cinema-gold transition-colors"
              >
                Editar reseña
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mb-8 w-full rounded-2xl border-2 border-dashed border-white/10 py-8 text-center text-sm text-muted-foreground transition-colors hover:border-cinema-gold/40 hover:text-cinema-gold"
        >
          + Escribí tu reseña
        </button>
      )}

      {/* Other reviews */}
      {otherReviews.length > 0 ? (
        <div className="space-y-4">
          {otherReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isOwner={false}
              showFilmInfo={false}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-8">
          {existingReview
            ? 'Sé el primero en reseñar esta película.'
            : 'Todavía no hay reseñas. ¡Sé el primero!'}
        </p>
      )}
    </section>
  );
}
