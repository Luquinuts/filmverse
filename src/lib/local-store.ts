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

// ─── Follows ───

export interface FollowEntry {
  userId: string;
  username: string;
  avatarUrl: string | null;
  followedAt: string;
}

const FOLLOWS_KEY = 'filmverse_follows';

export function getFollowedUsers(): FollowEntry[] {
  return getItem<FollowEntry[]>(FOLLOWS_KEY, []);
}

export function isFollowing(userId: string): boolean {
  return getFollowedUsers().some((f) => f.userId === userId);
}

export function toggleFollow(user: {
  userId: string;
  username: string;
  avatarUrl?: string | null;
}): boolean {
  const list = getFollowedUsers();
  const existing = list.find((f) => f.userId === user.userId);

  if (existing) {
    setItem(FOLLOWS_KEY, list.filter((f) => f.userId !== user.userId));
    return false; // unfollowed
  }

  list.push({
    userId: user.userId,
    username: user.username,
    avatarUrl: user.avatarUrl ?? null,
    followedAt: new Date().toISOString(),
  });
  setItem(FOLLOWS_KEY, list);
  return true; // followed
}

/** Reseñas de usuarios seguidos + propias, ordenadas por fecha */
export function getFeedReviews(userId: string): ReviewEntry[] {
  const followedIds = getFollowedUsers().map((f) => f.userId);
  const allIds = [...new Set([userId, ...followedIds])];

  return getReviews()
    .filter((r) => allIds.includes(r.userId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ─── Seed data (usuarios y reseñas de ejemplo) ───

const SEED_USERS = [
  { userId: 'seed-user-001', username: 'CinéfiloAnónimo', avatarUrl: null },
  { userId: 'seed-user-002', username: 'FilmBuff_AR', avatarUrl: null },
  { userId: 'seed-user-003', username: 'CineClub', avatarUrl: null },
  { userId: 'seed-user-004', username: 'PelículasYMates', avatarUrl: null },
];

const SEED_REVIEWS: Array<Omit<ReviewEntry, 'id' | 'createdAt' | 'updatedAt'>> = [
  {
    filmId: 6, filmTitle: 'Matrix', filmPoster: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', filmYear: 1999,
    userId: 'seed-user-001', username: 'CinéfiloAnónimo',
    rating: 10, content: 'Una obra maestra que cambió el cine de ciencia ficción para siempre. La escena de las balas sigue siendo icónica.', isSpoiler: false,
  },
  {
    filmId: 2, filmTitle: 'Interestelar', filmPoster: '/nCbkOyOMTEonEVlZ8YbTXM5eS1o.jpg', filmYear: 2014,
    userId: 'seed-user-001', username: 'CinéfiloAnónimo',
    rating: 9, content: 'Nolan en su máximo esplendor. La escena del "no es el momento" me destruyó emocionalmente.', isSpoiler: true,
  },
  {
    filmId: 3, filmTitle: 'Pulp Fiction', filmPoster: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', filmYear: 1994,
    userId: 'seed-user-002', username: 'FilmBuff_AR',
    rating: 9, content: 'Tarantino teje las historias como nadie. El baile de Mia y Vincent es cine puro.', isSpoiler: false,
  },
  {
    filmId: 7, filmTitle: 'Forrest Gump', filmPoster: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', filmYear: 1994,
    userId: 'seed-user-002', username: 'FilmBuff_AR',
    rating: 8, content: 'Una mirada tierna a la historia de EE.UU. Hanks está increíble, pero ya no me pega tan fuerte como antes.', isSpoiler: false,
  },
  {
    filmId: 8, filmTitle: 'El Caballero de la Noche', filmPoster: '/eeJ0dR4VRAbgVo9HtHpBysTKX2.jpg', filmYear: 2008,
    userId: 'seed-user-003', username: 'CineClub',
    rating: 10, content: 'Ledger es EL Joker. No hay discusión. La mejor película de superhéroes de la historia.', isSpoiler: false,
  },
  {
    filmId: 4, filmTitle: 'El Señor de los Anillos: La Comunidad del Anillo', filmPoster: '/8bXyLRgqt2C3Bx0EPwN5M1FeI7G.jpg', filmYear: 2001,
    userId: 'seed-user-003', username: 'CineClub',
    rating: 10, content: 'Jackson logró lo imposible: adaptar lo inadaptable y crear la mejor trilogía del cine.', isSpoiler: false,
  },
  {
    filmId: 5, filmTitle: 'Parásitos', filmPoster: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', filmYear: 2019,
    userId: 'seed-user-004', username: 'PelículasYMates',
    rating: 10, content: 'Bong Joon-ho es un genio. Una crítica social disfrazada de thriller que te atrapa de principio a fin.', isSpoiler: false,
  },
  {
    filmId: 1, filmTitle: 'El Padrino', filmPoster: '/r4r0M5CwwBx76VjBgRqkpLx3RYr.jpg', filmYear: 1972,
    userId: 'seed-user-004', username: 'PelículasYMates',
    rating: 10, content: 'Si no viste El Padrino, no sabés lo que es el cine. Cada escena es una lección de actuación y dirección.', isSpoiler: false,
  },
  {
    filmId: 10, filmTitle: 'Inception', filmPoster: '/oU7Oq2kFAAlGqb3V2Vt1WmI1MkF.jpg', filmYear: 2010,
    userId: 'seed-user-001', username: 'CinéfiloAnónimo',
    rating: 9, content: 'El final sigue generando debate 15 años después. Eso es cine que trasciende.', isSpoiler: true,
  },
  {
    filmId: 9, filmTitle: 'Volver al Futuro', filmPoster: '/7lyqKpBRlCE5fj7k7t3BXSBhGJ4.jpg', filmYear: 1985,
    userId: 'seed-user-002', username: 'FilmBuff_AR',
    rating: 9, content: 'Sigue siendo perfecta décadas después. La mejor película de viajes en el tiempo, lejos.', isSpoiler: false,
  },
  {
    filmId: 1, filmTitle: 'El Padrino', filmPoster: '/r4r0M5CwwBx76VjBgRqkpLx3RYr.jpg', filmYear: 1972,
    userId: 'seed-user-003', username: 'CineClub',
    rating: 10, content: 'La escena del restaurante es probablemente la mejor actuación de la historia del cine.', isSpoiler: true,
  },
];

/** Inicializa datos seed si no hay reseñas todavía */
export function ensureSeedData(): void {
  const existing = getItem<ReviewEntry[]>(REVIEWS_KEY, []);
  if (existing.length > 0) return;

  const reviews: ReviewEntry[] = SEED_REVIEWS.map((r, i) => ({
    ...r,
    id: `seed-${i}`,
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - i * 3600000).toISOString(),
  }));

  setItem(REVIEWS_KEY, reviews);
}

export function getSeedUsers() {
  return SEED_USERS;
}
