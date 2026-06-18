'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Rss, Users, UserPlus, Search, ArrowLeft, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ReviewCard } from '@/components/reviews/review-card';
import {
  ensureSeedData,
  getFeedReviews,
  getFollowedUsers,
  toggleFollow,
  isFollowing,
  getSeedUsers,
  type ReviewEntry,
} from '@/lib/local-store';

export default function FeedPage() {
  const router = useRouter();
  const supabase = useRef(createClient()).current;
  const authChecked = useRef(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (authChecked.current) return;
    authChecked.current = true;

    // Seed data si es primera vez
    ensureSeedData();

    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login?redirect=/feed');
        return;
      }

      const uid = data.user.id;
      setUserId(uid);
      setReviews(getFeedReviews(uid));
      setLoading(false);
    });
  }, [router, supabase.auth]);

  const handleFollowUser = (target: { userId: string; username: string }) => {
    toggleFollow(target);
    // Refrescar reseñas del feed ahora que cambió la lista de seguidos
    setReviews(getFeedReviews(userId!));
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="animate-shimmer space-y-4">
          <div className="h-8 w-48 rounded bg-glass-bg" />
          <div className="h-32 rounded-2xl bg-glass-bg" />
          <div className="h-32 rounded-2xl bg-glass-bg" />
        </div>
      </div>
    );
  }

  const followedUsers = getFollowedUsers();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard"
            className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-cinema-gold"
          >
            <ArrowLeft className="size-4" />
            Dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-white flex items-center gap-2">
            <Rss className="size-5" />
            Feed
          </h1>
          <p className="text-sm text-muted-foreground">
            Reseñas de usuarios que seguís
          </p>
        </div>
      </div>

      {/* Buscador de usuarios */}
      <div className="mb-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscá usuarios por nombre..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-10 text-sm text-white placeholder:text-muted-foreground focus:border-cinema-gold/50 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Resultados de búsqueda */}
        {searchQuery.trim().length > 0 && (
          <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
            {getSeedUsers()
              .filter(
                (u) =>
                  u.username
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) &&
                  u.userId !== userId,
              )
              .map((user) => {
                const following = isFollowing(user.userId);
                return (
                  <div
                    key={user.userId}
                    className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full bg-cinema-gold/20">
                        <Users className="size-4 text-cinema-gold" />
                      </div>
                      <span className="text-sm text-white">
                        {user.username}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        handleFollowUser({
                          userId: user.userId,
                          username: user.username,
                        })
                      }
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        following
                          ? 'border border-red-400/30 text-red-400 hover:bg-red-400/10'
                          : 'bg-cinema-gold text-black hover:bg-cinema-amber'
                      }`}
                    >
                      {following ? 'Dejar de seguir' : 'Seguir'}
                    </button>
                  </div>
                );
              })}

            {getSeedUsers().filter(
              (u) =>
                u.username
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) &&
                u.userId !== userId,
            ).length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No encontramos usuarios con &ldquo;{searchQuery}&rdquo;
              </p>
            )}
          </div>
        )}
      </div>

      {/* Sugerencias para seguir */}
      {followedUsers.length === 0 && (
        <section className="mb-8 rounded-2xl border-2 border-dashed border-white/10 p-6">
          <div className="mb-4 flex items-center gap-2 text-cinema-gold">
            <Users className="size-5" />
            <h2 className="font-semibold text-white">Usuarios sugeridos</h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Seguí usuarios para ver sus reseñas en tu feed:
          </p>
          <div className="flex flex-wrap gap-2">
            {getSeedUsers().map((seed) => (
              <button
                key={seed.userId}
                onClick={() =>
                  handleFollowUser({
                    userId: seed.userId,
                    username: seed.username,
                  })
                }
                className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-cinema-gold/40 hover:text-cinema-gold"
              >
                <UserPlus className="size-4" />
                {seed.username}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Gente que seguís */}
      {followedUsers.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Users className="size-4" />
            Siguiendo ({followedUsers.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {followedUsers.map((user) => (
              <span
                key={user.userId}
                className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white"
              >
                {user.username}
                <button
                  onClick={() =>
                    handleFollowUser({
                      userId: user.userId,
                      username: user.username,
                    })
                  }
                  className="text-xs text-muted-foreground hover:text-red-400 transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
            {/* Sugerencia de más usuarios */}
            {getSeedUsers()
              .filter((s) => !isFollowing(s.userId))
              .slice(0, 3)
              .map((seed) => (
                <button
                  key={seed.userId}
                  onClick={() =>
                    handleFollowUser({
                      userId: seed.userId,
                      username: seed.username,
                    })
                  }
                  className="flex items-center gap-2 rounded-full border border-dashed border-white/10 px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-cinema-gold/40 hover:text-cinema-gold"
                >
                  <UserPlus className="size-3" />
                  {seed.username}
                </button>
              ))}
          </div>
        </section>
      )}

      {/* Reseñas del feed */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isOwner={review.userId === userId}
              showFilmInfo
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <Rss className="mx-auto mb-3 size-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">
            No hay reseñas en tu feed todavía.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Seguí usuarios para ver sus reseñas acá.
          </p>
          <Link
            href="/search"
            className="mt-4 inline-block rounded-lg bg-cinema-gold px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-cinema-amber"
          >
            Explorar películas
          </Link>
        </div>
      )}
    </div>
  );
}
