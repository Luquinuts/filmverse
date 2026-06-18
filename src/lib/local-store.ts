/**
 * local-store — Persistencia en localStorage para desarrollo sin backend.
 *
 * Store de reseñas, ratings, y watchlist.
 * Cuando Supabase esté conectado, migrar a llamadas a la API.
 */

// ─── Tipos ───

export interface ReviewEntry {
  id: string;
  filmId: number;
  filmTitle: string;
  filmPoster: string | null;
  filmYear: number | null;
  userId: string;
  username: string;
  rating: number; // 1–10
  content: string;
  isSpoiler: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WatchlistEntry {
  filmId: number;
  filmTitle: string;
  filmPoster: string | null;
  filmYear: number | null;
  addedAt: string;
}

// ─── Helpers ───

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage lleno o deshabilitado — ignorar
  }
}

// ─── Reviews ───

const REVIEWS_KEY = 'filmverse_reviews';

export function getReviews(): ReviewEntry[] {
  return getItem<ReviewEntry[]>(REVIEWS_KEY, []);
}

export function getFilmReviews(filmId: number): ReviewEntry[] {
  return getReviews().filter((r) => r.filmId === filmId);
}

export function getUserReviews(userId: string): ReviewEntry[] {
  return getReviews()
    .filter((r) => r.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function saveReview(review: Omit<ReviewEntry, 'id' | 'createdAt' | 'updatedAt'>): ReviewEntry {
  const reviews = getReviews();
  const existing = reviews.find(
    (r) => r.filmId === review.filmId && r.userId === review.userId,
  );

  const now = new Date().toISOString();
  const entry: ReviewEntry = existing
    ? { ...existing, ...review, updatedAt: now }
    : { ...review, id: crypto.randomUUID(), createdAt: now, updatedAt: now };

  if (existing) {
    const idx = reviews.findIndex((r) => r.id === existing.id);
    reviews[idx] = entry;
  } else {
    reviews.push(entry);
  }

  setItem(REVIEWS_KEY, reviews);
  return entry;
}

export function deleteReview(reviewId: string): void {
  const reviews = getReviews().filter((r) => r.id !== reviewId);
  setItem(REVIEWS_KEY, reviews);
}

export function getUserRating(filmId: number, userId: string): number | null {
  const review = getReviews().find(
    (r) => r.filmId === filmId && r.userId === userId,
  );
  return review?.rating ?? null;
}

// ─── Watchlist ───

const WATCHLIST_KEY = 'filmverse_watchlist';

export function getWatchlist(): WatchlistEntry[] {
  return getItem<WatchlistEntry[]>(WATCHLIST_KEY, []);
}

export function isInWatchlist(filmId: number): boolean {
  return getWatchlist().some((w) => w.filmId === filmId);
}

export function toggleWatchlist(entry: Omit<WatchlistEntry, 'addedAt'>): boolean {
  const list = getWatchlist();
  const existing = list.find((w) => w.filmId === entry.filmId);

  if (existing) {
    setItem(WATCHLIST_KEY, list.filter((w) => w.filmId !== entry.filmId));
    return false; // removed
  }

  list.push({ ...entry, addedAt: new Date().toISOString() });
  setItem(WATCHLIST_KEY, list);
  return true; // added
}

// ─── Stats ───

export function getUserStats(userId: string) {
  const reviews = getUserReviews(userId);
  const watchlist = getWatchlist();
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);

  return {
    reviewsCount: reviews.length,
    watchlistCount: watchlist.length,
    averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
  };
}
