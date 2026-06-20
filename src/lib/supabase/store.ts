/**
 * supabase/store — Store asíncrono para operaciones CRUD contra Supabase.
 *
 * Cada función recibe el SupabaseClient como primer parámetro y userId explícito.
 * NO usa auth.uid() internamente — las funciones son puras y reutilizables
 * desde server, client, y admin contexts.
 *
 * @see Database en @/lib/types — schema basado en supabase/migration.sql
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Recommendation } from '@/lib/types';

// ─── Type Aliases ───

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ReviewRow = Database['public']['Tables']['reviews']['Row'];
type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
type WatchlistRow = Database['public']['Tables']['watchlist']['Row'];
type WatchlistInsert = Database['public']['Tables']['watchlist']['Insert'];
type CustomListRow = Database['public']['Tables']['custom_lists']['Row'];
type CustomListInsert = Database['public']['Tables']['custom_lists']['Insert'];
type ListFilmRow = Database['public']['Tables']['list_films']['Row'];
type ListFilmInsert = Database['public']['Tables']['list_films']['Insert'];
type FollowRow = Database['public']['Tables']['follows']['Row'];
type RecommendationRow = Database['public']['Tables']['recommendations']['Row'];

// ─── Profiles ───

export async function getProfile(
  client: SupabaseClient,
  userId: string,
): Promise<ProfileRow | null> {
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('[store] getProfile:', error);
    throw error;
  }

  return data;
}

export async function updateProfile(
  client: SupabaseClient,
  userId: string,
  data: { username?: string; avatar_url?: string | null },
): Promise<void> {
  const { error } = await client
    .from('profiles')
    .update(data)
    .eq('id', userId);

  if (error) {
    console.error('[store] updateProfile:', error);
    throw error;
  }
}

// ─── Reviews ───

export async function getReviews(
  client: SupabaseClient,
  userId?: string,
): Promise<ReviewRow[]> {
  let query = client.from('reviews').select('*');

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('[store] getReviews:', error);
    throw error;
  }

  return data ?? [];
}

export async function getFilmReviews(
  client: SupabaseClient,
  filmId: number,
): Promise<ReviewRow[]> {
  const { data, error } = await client
    .from('reviews')
    .select('*')
    .eq('film_id', filmId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[store] getFilmReviews:', error);
    throw error;
  }

  return data ?? [];
}

export async function getUserRating(
  client: SupabaseClient,
  userId: string,
  filmId: number,
): Promise<ReviewRow | null> {
  const { data, error } = await client
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('film_id', filmId)
    .maybeSingle();

  if (error) {
    console.error('[store] getUserRating:', error);
    throw error;
  }

  return data;
}

export async function saveReview(
  client: SupabaseClient,
  userId: string,
  review: ReviewInsert,
): Promise<ReviewRow> {
  // Upsert: si ya existe una reseña del usuario para este film, actualiza; si no, inserta
  const existing = await getUserRating(client, userId, review.film_id);

  if (existing) {
    const { data, error } = await client
      .from('reviews')
      .update({ ...review, user_id: userId })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('[store] saveReview (update):', error);
      throw error;
    }

    return data;
  }

  const { data, error } = await client
    .from('reviews')
    .insert({ ...review, user_id: userId })
    .select()
    .single();

  if (error) {
    console.error('[store] saveReview (insert):', error);
    throw error;
  }

  return data;
}

export async function deleteReview(
  client: SupabaseClient,
  reviewId: string,
): Promise<void> {
  const { error } = await client
    .from('reviews')
    .delete()
    .eq('id', reviewId);

  if (error) {
    console.error('[store] deleteReview:', error);
    throw error;
  }
}

// ─── Watchlist ───

export async function getWatchlist(
  client: SupabaseClient,
  userId: string,
): Promise<WatchlistRow[]> {
  const { data, error } = await client
    .from('watchlist')
    .select('*')
    .eq('user_id', userId)
    .order('added_at', { ascending: false });

  if (error) {
    console.error('[store] getWatchlist:', error);
    throw error;
  }

  return data ?? [];
}

export async function isInWatchlist(
  client: SupabaseClient,
  userId: string,
  filmId: number,
): Promise<boolean> {
  const { data, error } = await client
    .from('watchlist')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('film_id', filmId);

  if (error) {
    console.error('[store] isInWatchlist:', error);
    throw error;
  }

  return (data ?? []).length > 0;
}

export async function toggleWatchlist(
  client: SupabaseClient,
  userId: string,
  entry: WatchlistInsert,
): Promise<{ added: boolean }> {
  // Check if already in watchlist
  const existing = await isInWatchlist(client, userId, entry.film_id);

  if (existing) {
    const { error } = await client
      .from('watchlist')
      .delete()
      .eq('user_id', userId)
      .eq('film_id', entry.film_id);

    if (error) {
      console.error('[store] toggleWatchlist (remove):', error);
      throw error;
    }

    return { added: false };
  }

  const { error } = await client
    .from('watchlist')
    .insert({ ...entry, user_id: userId });

  if (error) {
    console.error('[store] toggleWatchlist (add):', error);
    throw error;
  }

  return { added: true };
}

// ─── Custom Lists ───

export async function getLists(
  client: SupabaseClient,
  userId: string,
): Promise<CustomListRow[]> {
  const { data, error } = await client
    .from('custom_lists')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[store] getLists:', error);
    throw error;
  }

  return data ?? [];
}

export async function getListById(
  client: SupabaseClient,
  listId: string,
): Promise<{ list: CustomListRow; films: ListFilmRow[] } | null> {
  const { data: list, error: listError } = await client
    .from('custom_lists')
    .select('*')
    .eq('id', listId)
    .single();

  if (listError) {
    console.error('[store] getListById (list):', listError);
    throw listError;
  }

  if (!list) return null;

  const { data: films, error: filmsError } = await client
    .from('list_films')
    .select('*')
    .eq('list_id', listId)
    .order('added_at', { ascending: false });

  if (filmsError) {
    console.error('[store] getListById (films):', filmsError);
    throw filmsError;
  }

  return { list, films: films ?? [] };
}

export async function createList(
  client: SupabaseClient,
  userId: string,
  name: string,
  description?: string,
): Promise<CustomListRow> {
  const { data, error } = await client
    .from('custom_lists')
    .insert({ user_id: userId, name, description: description ?? '' })
    .select()
    .single();

  if (error) {
    console.error('[store] createList:', error);
    throw error;
  }

  return data;
}

export async function deleteList(
  client: SupabaseClient,
  listId: string,
): Promise<void> {
  const { error } = await client
    .from('custom_lists')
    .delete()
    .eq('id', listId);

  if (error) {
    console.error('[store] deleteList:', error);
    throw error;
  }
}

export async function addFilmToList(
  client: SupabaseClient,
  film: ListFilmInsert,
): Promise<void> {
  const { error } = await client
    .from('list_films')
    .insert(film);

  if (error) {
    console.error('[store] addFilmToList:', error);
    throw error;
  }
}

export async function removeFilmFromList(
  client: SupabaseClient,
  listId: string,
  filmId: number,
): Promise<void> {
  const { error } = await client
    .from('list_films')
    .delete()
    .eq('list_id', listId)
    .eq('film_id', filmId);

  if (error) {
    console.error('[store] removeFilmFromList:', error);
    throw error;
  }
}

export async function isFilmInList(
  client: SupabaseClient,
  listId: string,
  filmId: number,
): Promise<boolean> {
  const { data, error } = await client
    .from('list_films')
    .select('id', { count: 'exact', head: true })
    .eq('list_id', listId)
    .eq('film_id', filmId);

  if (error) {
    console.error('[store] isFilmInList:', error);
    throw error;
  }

  return (data ?? []).length > 0;
}

export async function getFilmLists(
  client: SupabaseClient,
  userId: string,
  filmId: number,
): Promise<CustomListRow[]> {
  const { data, error } = await client
    .from('custom_lists')
    .select('*, list_films!inner(*)')
    .eq('user_id', userId)
    .eq('list_films.film_id', filmId);

  if (error) {
    console.error('[store] getFilmLists:', error);
    throw error;
  }

  return data ?? [];
}

// ─── Follows ───

export async function getFollowedUsers(
  client: SupabaseClient,
  userId: string,
): Promise<FollowRow[]> {
  const { data, error } = await client
    .from('follows')
    .select('*')
    .eq('follower_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[store] getFollowedUsers:', error);
    throw error;
  }

  return data ?? [];
}

export async function getFollowers(
  client: SupabaseClient,
  userId: string,
): Promise<FollowRow[]> {
  const { data, error } = await client
    .from('follows')
    .select('*')
    .eq('following_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[store] getFollowers:', error);
    throw error;
  }

  return data ?? [];
}

export async function isFollowing(
  client: SupabaseClient,
  followerId: string,
  followingId: string,
): Promise<boolean> {
  const { data, error } = await client
    .from('follows')
    .select('follower_id', { count: 'exact', head: true })
    .eq('follower_id', followerId)
    .eq('following_id', followingId);

  if (error) {
    console.error('[store] isFollowing:', error);
    throw error;
  }

  return (data ?? []).length > 0;
}

export async function toggleFollow(
  client: SupabaseClient,
  followerId: string,
  followingId: string,
): Promise<{ following: boolean }> {
  const existing = await isFollowing(client, followerId, followingId);

  if (existing) {
    const { error } = await client
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) {
      console.error('[store] toggleFollow (unfollow):', error);
      throw error;
    }

    return { following: false };
  }

  const { error } = await client
    .from('follows')
    .insert({ follower_id: followerId, following_id: followingId });

  if (error) {
    console.error('[store] toggleFollow (follow):', error);
    throw error;
  }

  return { following: true };
}

// ─── Feed ───

export async function getFeedReviews(
  client: SupabaseClient,
  userId: string,
): Promise<ReviewRow[]> {
  // Obtener usuarios seguidos
  const { data: followed, error: followError } = await client
    .from('follows')
    .select('following_id')
    .eq('follower_id', userId);

  if (followError) {
    console.error('[store] getFeedReviews (follows):', followError);
    throw followError;
  }

  const followedIds = followed?.map((f) => f.following_id) ?? [];
  const allIds = [...new Set([userId, ...followedIds])];

  if (allIds.length === 0) return [];

  const { data, error } = await client
    .from('reviews')
    .select('*')
    .in('user_id', allIds)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[store] getFeedReviews:', error);
    throw error;
  }

  return data ?? [];
}

// ─── Stats ───

export async function getUserStats(
  client: SupabaseClient,
  userId: string,
): Promise<{
  reviewsCount: number;
  watchlistCount: number;
  averageRating: number;
  listsCount: number;
}> {
  // Obtener ratings de reseñas
  const { data: reviews, error: reviewsError } = await client
    .from('reviews')
    .select('rating')
    .eq('user_id', userId);

  if (reviewsError) {
    console.error('[store] getUserStats (reviews):', reviewsError);
    throw reviewsError;
  }

  // Contar watchlist
  const { count: watchlistCount, error: watchlistError } = await client
    .from('watchlist')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (watchlistError) {
    console.error('[store] getUserStats (watchlist):', watchlistError);
    throw watchlistError;
  }

  // Contar listas
  const { count: listsCount, error: listsError } = await client
    .from('custom_lists')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (listsError) {
    console.error('[store] getUserStats (lists):', listsError);
    throw listsError;
  }

  const totalRating = reviews?.reduce((sum, r) => sum + r.rating, 0) ?? 0;

  return {
    reviewsCount: reviews?.length ?? 0,
    watchlistCount: watchlistCount ?? 0,
    averageRating:
      reviews && reviews.length > 0 ? totalRating / reviews.length : 0,
    listsCount: listsCount ?? 0,
  };
}

// ─── Recommendations ───

export async function getDailyRecommendation(
  client: SupabaseClient,
  userId: string,
  date: string,
): Promise<RecommendationRow | null> {
  const { data, error } = await client
    .from('recommendations')
    .select('*')
    .eq('user_id', userId)
    .eq('report_date', date)
    .maybeSingle();

  if (error) {
    console.error('[store] getDailyRecommendation:', error);
    throw error;
  }

  return data;
}

export async function setDailyRecommendation(
  client: SupabaseClient,
  userId: string,
  date: string,
  recommendations: Recommendation[],
): Promise<void> {
  const { error } = await client.from('recommendations').upsert(
    {
      user_id: userId,
      report_date: date,
      recommendations: recommendations as unknown,
    },
    { onConflict: 'user_id, report_date' },
  );

  if (error) {
    console.error('[store] setDailyRecommendation:', error);
    throw error;
  }
}
