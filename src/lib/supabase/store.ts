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
import type {
  Recommendation,
  ProfileRow,
  ReviewRow,
  ReviewInsert,
  WatchlistRow,
  WatchlistInsert,
  CustomListRow,
  ListFilmRow,
  ListFilmInsert,
  FollowRow,
  RecommendationRow,
  ReportWithReview,
  PremiumSubscriptionRow,
} from '@/lib/types';

// ─── Profiles ───

export async function getProfile(
  client: SupabaseClient,
  userId: string,
): Promise<ProfileRow | null> {
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

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
  let query = client
    .from('reviews')
    .select('*')
    .is('deleted_at', null);

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
    .is('deleted_at', null)
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
    .is('deleted_at', null)
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
  review: Omit<ReviewInsert, 'user_id'>,
): Promise<ReviewRow> {
  // Upsert: la constraint unique(user_id, film_id) evita duplicados por TOCTOU
  // deleted_at: null reactiva una reseña previamente soft-deleteada
  const { data, error } = await client
    .from('reviews')
    .upsert(
      { ...review, user_id: userId, deleted_at: null },
      { onConflict: 'user_id, film_id' },
    )
    .select()
    .single();

  if (error) {
    console.error('[store] saveReview:', error);
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
  const { count, error } = await client
    .from('watchlist')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('film_id', filmId);

  if (error) {
    console.error('[store] isInWatchlist:', error);
    throw error;
  }

  return (count ?? 0) > 0;
}

export async function toggleWatchlist(
  client: SupabaseClient,
  userId: string,
  entry: Omit<WatchlistInsert, 'user_id'>,
): Promise<{ added: boolean }> {
  // Try to delete first (toggle OFF path)
  const { count: deleteCount } = await client
    .from('watchlist')
    .delete({ count: 'exact' })
    .eq('user_id', userId)
    .eq('film_id', entry.film_id);

  // If a row was deleted, toggle was ON → now OFF
  if (deleteCount && deleteCount > 0) {
    return { added: false };
  }

  // No row to delete → toggle was OFF → insert
  const { error } = await client
    .from('watchlist')
    .insert({ ...entry, user_id: userId });

  if (error) {
    // If unique violation, someone else already inserted it (concurrent request)
    // Treat as "added" since the film is now in the watchlist
    if (error.code === '23505') {
      return { added: true };
    }
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

export async function getListFilmCounts(
  client: SupabaseClient,
  userId: string,
): Promise<Record<string, number>> {
  const { data, error } = await client
    .from('custom_lists')
    .select('id, list_films(id)')
    .eq('user_id', userId);

  if (error) {
    console.error('[store] getListFilmCounts:', error);
    throw error;
  }

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.id] = (row as any).list_films?.length ?? 0;
  }
  return counts;
}

export async function getListById(
  client: SupabaseClient,
  listId: string,
): Promise<{ list: CustomListRow; films: ListFilmRow[] } | null> {
  const { data: list, error: listError } = await client
    .from('custom_lists')
    .select('*')
    .eq('id', listId)
    .maybeSingle();

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
    .upsert(film, { onConflict: 'list_id, film_id', ignoreDuplicates: true });

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
  const { count, error } = await client
    .from('list_films')
    .select('*', { count: 'exact', head: true })
    .eq('list_id', listId)
    .eq('film_id', filmId);

  if (error) {
    console.error('[store] isFilmInList:', error);
    throw error;
  }

  return (count ?? 0) > 0;
}

export async function getFilmLists(
  client: SupabaseClient,
  userId: string,
  filmId: number,
): Promise<(CustomListRow & { list_films: ListFilmRow[] })[]> {
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

// ─── Profiles (batch + search) ───

export async function getProfiles(
  client: SupabaseClient,
  userIds: string[],
): Promise<ProfileRow[]> {
  if (userIds.length === 0) return [];
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .in('id', userIds);

  if (error) {
    console.error('[store] getProfiles:', error);
    throw error;
  }

  return data ?? [];
}

export async function searchProfiles(
  client: SupabaseClient,
  query: string,
  excludeUserId?: string,
): Promise<ProfileRow[]> {
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .ilike('username', `%${query}%`)
    .limit(10);

  if (error) {
    console.error('[store] searchProfiles:', error);
    throw error;
  }

  return (data ?? []).filter((p) => p.id !== excludeUserId);
}

export async function getSuggestedUsers(
  client: SupabaseClient,
  userId: string,
): Promise<ProfileRow[]> {
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .neq('id', userId)
    .limit(5);

  if (error) {
    console.error('[store] getSuggestedUsers:', error);
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
  const { count, error } = await client
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', followerId)
    .eq('following_id', followingId);

  if (error) {
    console.error('[store] isFollowing:', error);
    throw error;
  }

  return (count ?? 0) > 0;
}

export async function toggleFollow(
  client: SupabaseClient,
  followerId: string,
  followingId: string,
): Promise<{ following: boolean }> {
  // Try to delete first (unfollow path)
  const { count: deleteCount } = await client
    .from('follows')
    .delete({ count: 'exact' })
    .eq('follower_id', followerId)
    .eq('following_id', followingId);

  // If a row was deleted, unfollow succeeded
  if (deleteCount && deleteCount > 0) {
    return { following: false };
  }

  // No row to delete → follow
  const { error } = await client
    .from('follows')
    .insert({ follower_id: followerId, following_id: followingId });

  if (error) {
    if (error.code === '23505') {
      return { following: true };
    }
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
    .is('deleted_at', null)
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
  followersCount: number;
  followingCount: number;
}> {
  // Obtener ratings de reseñas
  const { data: reviews, error: reviewsError } = await client
    .from('reviews')
    .select('rating')
    .eq('user_id', userId)
    .is('deleted_at', null);

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

  // Contar seguidores
  const { count: followersCount, error: followersError } = await client
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId);

  if (followersError) {
    console.error('[store] getUserStats (followers):', followersError);
    throw followersError;
  }

  // Contar seguidos
  const { count: followingCount, error: followingError } = await client
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId);

  if (followingError) {
    console.error('[store] getUserStats (following):', followingError);
    throw followingError;
  }

  const totalRating = reviews?.reduce((sum, r) => sum + r.rating, 0) ?? 0;

  return {
    reviewsCount: reviews?.length ?? 0,
    watchlistCount: watchlistCount ?? 0,
    averageRating:
      reviews && reviews.length > 0 ? totalRating / reviews.length : 0,
    listsCount: listsCount ?? 0,
    followersCount: followersCount ?? 0,
    followingCount: followingCount ?? 0,
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

// ─── Reports ───

export async function reportReview(
  client: SupabaseClient,
  reviewId: string,
  reportedBy: string,
  reason: string,
): Promise<void> {
  const { error } = await client.from('reports').insert({
    review_id: reviewId,
    reported_by: reportedBy,
    reason,
  });
  if (error) {
    console.error('[store] reportReview:', error);
    throw error;
  }
}

export async function getPendingReports(
  client: SupabaseClient,
): Promise<ReportWithReview[]> {
  const { data, error } = await client
    .from('reports')
    .select('*, reviews(*)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[store] getPendingReports:', error);
    throw error;
  }

  return data ?? [];
}

export async function dismissReport(
  client: SupabaseClient,
  reportId: string,
  adminId: string,
): Promise<void> {
  const { error } = await client
    .from('reports')
    .update({
      status: 'dismissed',
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', reportId);

  if (error) {
    console.error('[store] dismissReport:', error);
    throw error;
  }
}

export async function adminDeleteReview(
  client: SupabaseClient,
  reviewId: string,
  reportId: string,
  adminId: string,
): Promise<void> {
  // Soft delete via security definer function (bypasses RLS)
  const { error: rpcError } = await client.rpc('admin_soft_delete_review', {
    p_review_id: reviewId,
    p_admin_id: adminId,
  });

  if (rpcError) {
    console.error('[store] adminDeleteReview:', rpcError);
    throw rpcError;
  }

  // Update report status
  const { error: updateError } = await client
    .from('reports')
    .update({
      status: 'reviewed',
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', reportId);

  if (updateError) {
    console.error('[store] adminDeleteReview (report update):', updateError);
    throw updateError;
  }
}

export async function isAdmin(
  client: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const { data, error } = await client
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('[store] isAdmin:', error);
    return false;
  }

  return data?.role === 'admin';
}

// ─── Premium Subscriptions ───

export type SubscriptionAction = 'activate' | 'cancel' | 'expire';

/**
 * Obtiene la suscripción de un usuario (independientemente del estado).
 * Para verificar si está activa, chequea `status === 'active'` en el resultado.
 */
export async function getUserSubscription(
  client: SupabaseClient,
  userId: string,
): Promise<PremiumSubscriptionRow | null> {
  const { data, error } = await client
    .from('premium_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('[store] getUserSubscription:', error);
    throw error;
  }

  return data;
}

/**
 * Busca una suscripción por su ID de Mercado Pago (para webhooks).
 */
export async function getSubscriptionByMpId(
  client: SupabaseClient,
  mpSubscriptionId: string,
): Promise<PremiumSubscriptionRow | null> {
  const { data, error } = await client
    .from('premium_subscriptions')
    .select('*')
    .eq('mercadopago_subscription_id', mpSubscriptionId)
    .maybeSingle();

  if (error) {
    console.error('[store] getSubscriptionByMpId:', error);
    throw error;
  }

  return data;
}

/**
 * Cancela la suscripción de un usuario en la base de datos.
 * Marca como 'cancelled' y revierte el rol a 'cinefilo'.
 * Para cancelar también en Mercado Pago, el llamante debe hacer la
 * llamada a la API de MP antes o después de esta función.
 */
export async function cancelSubscription(
  client: SupabaseClient,
  userId: string,
): Promise<void> {
  await updateSubscriptionAndRole(client, userId, 'cancel');
}

/**
 * Helper atómico que actualiza suscripción y rol del perfil en una sola
 * operación lógica. Usado por webhooks y cancelaciones.
 *
 * - 'activate': INSERT suscripción activa + UPDATE role = 'premium'
 * - 'cancel': UPDATE status = 'cancelled', end_date = now() + UPDATE role = 'cinefilo'
 * - 'expire': UPDATE status = 'expired', end_date = now() + UPDATE role = 'cinefilo'
 *
 * Requiere un cliente con permisos de escritura (service_role o SECURITY DEFINER).
 *
 * @param client - Cliente Supabase con permisos de escritura (admin client)
 * @param userId - ID del usuario objetivo
 * @param action - Acción a ejecutar
 * @param mercadopagoSubscriptionId - Solo para 'activate': ID de la suscripción en MP
 */
export async function updateSubscriptionAndRole(
  client: SupabaseClient,
  userId: string,
  action: SubscriptionAction,
  mercadopagoSubscriptionId?: string,
): Promise<void> {
  if (action === 'activate') {
    // Insert o upsert: si ya existe una suscripción, actualizarla
    const existing = await getUserSubscription(client, userId);

    if (existing) {
      const { error: subError } = await client
        .from('premium_subscriptions')
        .update({
          status: 'active',
          mercadopago_subscription_id: mercadopagoSubscriptionId ?? existing.mercadopago_subscription_id,
          end_date: null,
        })
        .eq('user_id', userId);

      if (subError) {
        console.error('[store] updateSubscriptionAndRole (update sub):', subError);
        throw subError;
      }
    } else {
      const { error: subError } = await client
        .from('premium_subscriptions')
        .insert({
          user_id: userId,
          status: 'active',
          mercadopago_subscription_id: mercadopagoSubscriptionId ?? null,
          start_date: new Date().toISOString(),
        });

      if (subError) {
        console.error('[store] updateSubscriptionAndRole (insert):', subError);
        throw subError;
      }
    }

    const { error: profileError } = await client
      .from('profiles')
      .update({ role: 'premium' })
      .eq('id', userId);

    if (profileError) {
      console.error('[store] updateSubscriptionAndRole (profile role):', profileError);
      throw profileError;
    }
    return;
  }

  // cancel o expire
  const status = action === 'cancel' ? 'cancelled' : 'expired';

  const { error: subError } = await client
    .from('premium_subscriptions')
    .update({
      status,
      end_date: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (subError) {
    console.error(`[store] updateSubscriptionAndRole (${action} sub):`, subError);
    throw subError;
  }

  const { error: profileError } = await client
    .from('profiles')
    .update({ role: 'cinefilo' })
    .eq('id', userId);

  if (profileError) {
    console.error(`[store] updateSubscriptionAndRole (${action} profile):`, profileError);
    throw profileError;
  }
}
