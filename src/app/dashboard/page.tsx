'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  Bookmark,
  MessageSquareText,
  TrendingUp,
  Search,
  Film,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  getUserReviews,
  getUserStats,
} from '@/lib/local-store';
import { ReviewCard } from '@/components/reviews/review-card';
import { TrendingSection } from '@/components/home/trending-section';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = useRef(createClient()).current;
  const authChecked = useRef(false);

  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authChecked.current) return;
    authChecked.current = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login?redirect=/dashboard');
        return;
      }
      setUsername(
        (data.user.user_metadata?.username as string) ??
          data.user.email?.split('@')[0] ??
          'Usuario',
      );
      setLoading(false);
    });
  }, [router, supabase.auth]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="animate-shimmer space-y-6">
          <div className="h-24 w-full rounded-2xl bg-glass-bg" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 rounded-xl bg-glass-bg" />
            <div className="h-24 rounded-xl bg-glass-bg" />
            <div className="h-24 rounded-xl bg-glass-bg" />
          </div>
          <div className="h-64 rounded-2xl bg-glass-bg" />
        </div>
      </div>
    );
  }

  const userId = 'mock-user-001';
  const stats = getUserStats(userId);
  const reviews = getUserReviews(userId).slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Welcome */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Bienvenido, {username}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Esto es lo tuyo en FilmVerse
        </p>
      </section>

      {/* Stats cards */}
      <section className="mb-10 grid grid-cols-3 gap-4">
        <Link
          href="/profile?tab=reviews"
          className="glass rounded-xl p-5 transition-colors hover:border-cinema-gold/30"
        >
          <Star className="mb-2 size-6 text-cinema-gold" />
          <p className="text-2xl font-bold text-white">
            {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—'}
          </p>
          <p className="text-xs text-muted-foreground">Puntaje promedio</p>
        </Link>
        <Link
          href="/profile?tab=reviews"
          className="glass rounded-xl p-5 transition-colors hover:border-cinema-gold/30"
        >
          <MessageSquareText className="mb-2 size-6 text-cinema-gold" />
          <p className="text-2xl font-bold text-white">
            {stats.reviewsCount}
          </p>
          <p className="text-xs text-muted-foreground">Reseñas escritas</p>
        </Link>
        <Link
          href="/profile?tab=watchlist"
          className="glass rounded-xl p-5 transition-colors hover:border-cinema-gold/30"
        >
          <Bookmark className="mb-2 size-6 text-cinema-gold" />
          <p className="text-2xl font-bold text-white">
            {stats.watchlistCount}
          </p>
          <p className="text-xs text-muted-foreground">Películas guardadas</p>
        </Link>
      </section>

      {/* Quick actions */}
      <section className="mb-10 grid gap-3 sm:grid-cols-2">
        <Link
          href="/search"
          className="flex items-center gap-3 rounded-xl border border-white/10 p-4 transition-colors hover:border-cinema-gold/40"
        >
          <Search className="size-5 text-cinema-gold" />
          <div>
            <p className="text-sm font-medium text-white">Buscar películas</p>
            <p className="text-xs text-muted-foreground">
              Encontrá cualquier título
            </p>
          </div>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl border border-white/10 p-4 transition-colors hover:border-cinema-gold/40"
        >
          <Film className="size-5 text-cinema-gold" />
          <div>
            <p className="text-sm font-medium text-white">Explorar tendencias</p>
            <p className="text-xs text-muted-foreground">
              Películas populares ahora
            </p>
          </div>
        </Link>
      </section>

      {/* Recent reviews */}
      {reviews.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              Tus últimas reseñas
            </h2>
            <Link
              href="/profile"
              className="text-sm text-cinema-gold/70 hover:text-cinema-gold transition-colors"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isOwner
                showFilmInfo
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty state if no activity */}
      {reviews.length === 0 && (
        <section className="mb-10 rounded-2xl border-2 border-dashed border-white/10 py-16 text-center">
          <TrendingUp className="mx-auto mb-3 size-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">
            Todavía no hay actividad. Empezá explorando películas.
          </p>
          <Link
            href="/search"
            className="mt-3 inline-block rounded-lg bg-cinema-gold px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-cinema-amber"
          >
            Explorar películas
          </Link>
        </section>
      )}

      {/* Trending */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp className="size-5" />
          Tendencias
        </h2>
        <TrendingSection />
      </section>
    </div>
  );
}
