'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Star,
  Bookmark,
  MessageSquareText,
  LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ReviewCard } from '@/components/reviews/review-card';
import {
  getUserReviews,
  getUserStats,
  getWatchlist,
  deleteReview,
  type ReviewEntry,
  type WatchlistEntry,
} from '@/lib/local-store';

type ProfileTab = 'reviews' | 'watchlist';

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ProfileTab>('reviews');
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login?redirect=/profile');
        return;
      }
      const uid = data.user.id;
      setUserId(uid);
      setUsername(
        (data.user.user_metadata?.username as string) ??
          data.user.email?.split('@')[0] ??
          'Usuario',
      );
      setEmail(data.user.email ?? '');
      setReviews(getUserReviews(uid));
      setWatchlist(getWatchlist());
      setLoading(false);
    });
  }, [router, supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleDeleteReview = (reviewId: string) => {
    deleteReview(reviewId);
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="animate-shimmer space-y-6">
          <div className="h-32 w-full rounded-2xl bg-glass-bg" />
          <div className="h-8 w-48 rounded bg-glass-bg" />
          <div className="h-64 w-full rounded-2xl bg-glass-bg" />
        </div>
      </div>
    );
  }

  const stats = getUserStats(userId!);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-cinema-gold"
      >
        <ArrowLeft className="size-4" />
        Volver al Dashboard
      </Link>

      {/* Profile header */}
      <div className="glass mb-8 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-cinema-gold/20">
              <User className="size-8 text-cinema-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{username}</h1>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-red-400"
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-white/5 p-4 text-center">
            <Star className="mx-auto mb-1 size-5 text-cinema-gold" />
            <p className="text-xl font-bold text-white">
              {stats.averageRating > 0
                ? stats.averageRating.toFixed(1)
                : '—'}
            </p>
            <p className="text-xs text-muted-foreground">Promedio</p>
          </div>
          <div className="rounded-xl bg-white/5 p-4 text-center">
            <MessageSquareText className="mx-auto mb-1 size-5 text-cinema-gold" />
            <p className="text-xl font-bold text-white">
              {stats.reviewsCount}
            </p>
            <p className="text-xs text-muted-foreground">Reseñas</p>
          </div>
          <div className="rounded-xl bg-white/5 p-4 text-center">
            <Bookmark className="mx-auto mb-1 size-5 text-cinema-gold" />
            <p className="text-xl font-bold text-white">
              {stats.watchlistCount}
            </p>
            <p className="text-xs text-muted-foreground">Guardadas</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-white/5 p-1">
        <button
          onClick={() => setTab('reviews')}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'reviews'
              ? 'bg-cinema-gold text-black'
              : 'text-muted-foreground hover:text-white'
          }`}
        >
          Reseñas ({reviews.length})
        </button>
        <button
          onClick={() => setTab('watchlist')}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'watchlist'
              ? 'bg-cinema-gold text-black'
              : 'text-muted-foreground hover:text-white'
          }`}
        >
          Guardadas ({watchlist.length})
        </button>
      </div>

      {/* Tab content */}
      {tab === 'reviews' && (
        <>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  isOwner
                  onDelete={handleDeleteReview}
                  showFilmInfo
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <MessageSquareText className="mx-auto mb-3 size-10 text-muted-foreground/40" />
              <p className="text-muted-foreground">
                Todavía no escribiste ninguna reseña.
              </p>
              <Link
                href="/search"
                className="mt-3 inline-block text-sm text-cinema-gold hover:text-cinema-amber transition-colors"
              >
                Buscar películas para reseñar
              </Link>
            </div>
          )}
        </>
      )}

      {tab === 'watchlist' && (
        <>
          {watchlist.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {watchlist.map((entry) => (
                <Link
                  key={entry.filmId}
                  href={`/film/${entry.filmId}`}
                  className="group"
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-glass-bg">
                    {entry.filmPoster ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w342${entry.filmPoster}`}
                        alt={entry.filmTitle}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground text-xs p-2 text-center">
                        {entry.filmTitle}
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-white truncate group-hover:text-cinema-gold transition-colors">
                    {entry.filmTitle}
                  </p>
                  {entry.filmYear && (
                    <p className="text-xs text-muted-foreground">
                      {entry.filmYear}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <Bookmark className="mx-auto mb-3 size-10 text-muted-foreground/40" />
              <p className="text-muted-foreground">
                No guardaste ninguna película todavía.
              </p>
              <Link
                href="/search"
                className="mt-3 inline-block text-sm text-cinema-gold hover:text-cinema-amber transition-colors"
              >
                Explorar películas
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
