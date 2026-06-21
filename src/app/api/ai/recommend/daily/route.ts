import { NextRequest, NextResponse } from 'next/server';
import { getRecommendations } from '@/lib/gemini';
import { createClient } from '@/lib/supabase/server';
import {
  getDailyRecommendation,
  setDailyRecommendation,
  getReviews,
  getWatchlist,
} from '@/lib/supabase/store';
import type { ReviewRow, WatchlistRow } from '@/lib/types';

/**
 * Generar fecha UTC-3 como YYYY-MM-DD.
 */
function getArgentinaDateStr(): string {
  const now = new Date();
  const argentina = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }),
  );
  return argentina.toISOString().split('T')[0];
}

/**
 * POST /api/ai/recommend/daily
 *
 * Genera o recupera la recomendación diaria del usuario.
 * Si ya existe para la fecha actual, devuelve el cache (server-side).
 * Si no existe, genera con Gemini y persiste en public.recommendations.
 */
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
    const dateStr = getArgentinaDateStr();

    // Check server-side cache first
    const existing = await getDailyRecommendation(supabase, body.userId, dateStr);
    if (existing) {
      return NextResponse.json({
        recommendations: existing.recommendations,
        date: dateStr,
        generatedAt: existing.generated_at,
        cached: true,
      });
    }

    // Get reviews (from client or server)
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

    // Generate with Gemini
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

    // Persist to Supabase
    await setDailyRecommendation(supabase, body.userId, dateStr, recommendations);

    return NextResponse.json({
      recommendations,
      date: dateStr,
      generatedAt: new Date().toISOString(),
      cached: false,
    });
  } catch (error) {
    console.error('[API /ai/recommend/daily]', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}

/**
 * GET /api/ai/recommend/daily
 *
 * Devuelve la recomendación diaria si existe para el userId dado,
 * o el estado del sistema si no se proporciona userId.
 */
export async function GET(request: NextRequest) {
  const dateStr = getArgentinaDateStr();
  const hour = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }),
  ).getHours();

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (userId) {
    try {
      const supabase = await createClient();
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser) {
        return NextResponse.json(
          { error: 'No autenticado' },
          { status: 401 },
        );
      }

      if (authUser.id !== userId) {
        return NextResponse.json(
          { error: 'No autorizado' },
          { status: 403 },
        );
      }
      const existing = await getDailyRecommendation(supabase, userId, dateStr);

      if (existing) {
        return NextResponse.json({
          recommendations: existing.recommendations,
          date: dateStr,
          generatedAt: existing.generated_at,
          found: true,
        });
      }

      return NextResponse.json({
        recommendations: [],
        date: dateStr,
        found: false,
      });
    } catch (error) {
      console.error('[API /ai/recommend/daily GET]', error);
      return NextResponse.json(
        { error: 'Error al obtener recomendación diaria' },
        { status: 500 },
      );
    }
  }

  // Health check sin userId
  return NextResponse.json({
    status: 'ok',
    today: dateStr,
    currentHourUTC3: hour,
    nextGenerationHour: 21,
    nextGenerationAt: `${dateStr}T21:00:00.000-03:00`,
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
}
