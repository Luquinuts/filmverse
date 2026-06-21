import { NextRequest, NextResponse } from 'next/server';
import { getRecommendations } from '@/lib/gemini';
import { createClient } from '@/lib/supabase/server';
import { getReviews, getWatchlist } from '@/lib/supabase/store';
import type { ReviewRow, WatchlistRow } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      userId: string;
      reviews?: ReviewRow[];
      watchlist?: WatchlistRow[];
    };

    if (!body.userId) {
      return NextResponse.json(
        { error: 'Se requiere userId' },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 },
      );
    }

    if (authUser.id !== body.userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 },
      );
    }

    // Backward compatibility: server can fetch reviews/watchlist if not provided
    let reviews = body.reviews;
    let watchlist = body.watchlist;

    if (!reviews || reviews.length === 0) {
      reviews = await getReviews(supabase, body.userId);
      watchlist = watchlist ?? (await getWatchlist(supabase, body.userId));
    }

    if (!reviews || reviews.length === 0) {
      return NextResponse.json(
        { error: 'No hay reseñas para generar recomendaciones' },
        { status: 400 },
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini no está configurado' },
        { status: 503 },
      );
    }

    // Map snake_case DB rows to camelCase gemini types
    const recommendations = await getRecommendations(
      reviews.map((r) => ({
        filmTitle: r.film_title,
        filmYear: r.film_year,
        filmPoster: r.film_poster,
        rating: r.rating,
        content: r.content,
      })),
      (watchlist ?? []).map((w) => ({
        filmTitle: w.film_title,
        filmYear: w.film_year,
        filmPoster: w.film_poster,
      })),
    );

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('[API /ai/recommend]', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
