'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  Bookmark,
  MessageSquareText,
  TrendingUp,
  Crown,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  getReviews,
  getUserStats,
  getWatchlist,
} from '@/lib/supabase/store';
import type { ReviewRow, WatchlistRow } from '@/lib/types';
import { ReviewCard } from '@/components/reviews/review-card';
import { TrendingSection } from '@/components/home/trending-section';
import { RecommendationsSection } from '@/components/home/recommendations-section';

interface DashboardStats {
  reviewsCount: number;
  watchlistCount: number;
  averageRating: number;
  listsCount: number;
}

const INITIAL_STATS: DashboardStats = {
  reviewsCount: 0,
  watchlistCount: 0,
  averageRating: 0,
  listsCount: 0,
};

export default function DashboardPage() {
  const router = useRouter();
  const supabase = useRef(createClient()).current;
  const authChecked = useRef(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistRow[]>([]);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (authChecked.current) return;
    authChecked.current = true;

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/login?redirect=/dashboard');
        return;
      }

      const uid = data.user.id;
      setUserId(uid);
      setUsername(
        (data.user.user_metadata?.username as string) ??
          data.user.email?.split('@')[0] ??
          'Usuario',
      );

      // Load dashboard data in parallel
      try {
        const [statsData, reviewsData, watchlistData, profileData] = await Promise.all([
          getUserStats(supabase, uid),
          getReviews(supabase, uid),
          getWatchlist(supabase, uid),
          supabase.from('profiles').select('role').eq('id', uid).single(),
        ]);
        if (profileData.data?.role) setRole(profileData.data.role);
        setStats(statsData);
        setReviews(reviewsData.slice(0, 5));
        setWatchlist(watchlistData);
      } catch (err) {
        console.error('[dashboard] load data:', err);
      } finally {
        setLoading(false);
      }
    }).catch((err) => {
      console.error('[dashboard] auth:', err);
      setLoading(false);
    });
  }, [router, supabase]);

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

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Welcome */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          Bienvenido, {username}
          {role === 'premium' && <Crown className="size-7 text-cinema-gold" />}
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
                username={username}
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

      {/* AI Recommendations */}
      <section className="mt-10">
        {userId && (
          <RecommendationsSection
            userId={userId}
            reviews={reviews}
            watchlist={watchlist}
          />
        )}
      </section>
    </div>
  );
}
