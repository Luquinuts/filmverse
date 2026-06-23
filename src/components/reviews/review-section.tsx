'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { MessageSquareText } from 'lucide-react';
import { ReviewForm } from './review-form';
import { ReviewCard } from './review-card';
import { ReportDialog } from './report-dialog';
import { createClient } from '@/lib/supabase/client';
import {
  getFilmReviews,
  saveReview,
  deleteReview,
  getUserRating,
} from '@/lib/supabase/store';
import type { ReviewRow } from '@/lib/types';

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
  const supabase = useRef(createClient()).current;
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [existingReview, setExistingReview] = useState<ReviewRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [reportTargetId, setReportTargetId] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    try {
      const [reviewData, userRating] = await Promise.all([
        getFilmReviews(supabase, filmId),
        getUserRating(supabase, userId, filmId),
      ]);
      setReviews(reviewData);
      setExistingReview(userRating);
    } catch (err) {
      console.error('[review-section] loadReviews:', err);
    }
  }, [supabase, filmId, userId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleSave = async (data: {
    rating: number;
    content: string;
    isSpoiler: boolean;
  }) => {
    try {
      setSaveError(null);
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          film_id: filmId,
          film_title: filmTitle,
          film_poster: filmPoster,
          film_year: filmYear,
          rating: data.rating,
          content: data.content,
          is_spoiler: data.isSpoiler,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? 'Error al guardar la reseña');
      }

      setShowForm(false);
      loadReviews();
    } catch (err) {
      console.error('[review-section] handleSave:', err);
      setSaveError(
        err instanceof Error ? err.message : 'Error al guardar la reseña',
      );
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      await deleteReview(supabase, reviewId);
      loadReviews();
    } catch (err) {
      console.error('[review-section] handleDelete:', err);
    }
  };

  const otherReviews = reviews.filter((r) => r.user_id !== userId);

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
              existingRating={existingReview?.rating ?? null}
              existingContent={existingReview?.content ?? null}
              existingSpoiler={existingReview?.is_spoiler ?? false}
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
              error={saveError}
            />
          ) : existingReview ? (
            <div>
              <ReviewCard
                review={existingReview}
                isOwner
                onDelete={handleDelete}
                username={username}
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
              onReport={setReportTargetId}
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

      {/* Report dialog */}
      {reportTargetId && (
        <ReportDialog
          reviewId={reportTargetId}
          onClose={() => setReportTargetId(null)}
        />
      )}
    </section>
  );
}
