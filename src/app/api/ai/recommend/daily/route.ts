import { NextRequest, NextResponse } from 'next/server';
import { getRecommendations } from '@/lib/gemini';
import type { ReviewEntry, WatchlistEntry } from '@/lib/local-store';

/**
 * CU 32 — Generar reporte de películas recomendadas para ver durante el día.
 *
 * El sistema genera un reporte personalizado diario con recomendaciones
 * basadas en las reseñas y watchlist del usuario.
 *
 * Se ejecuta bajo demanda (el cliente cachea con TTL diario).
 * Cuando se implemente un DB real, este endpoint debe ser llamado
 * por un cron job a las 21:00 UTC-3.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      userId: string;
      reviews: ReviewEntry[];
      watchlist: WatchlistEntry[];
    };

    if (!body.userId) {
      return NextResponse.json(
        { error: 'Se requiere userId' },
        { status: 400 },
      );
    }

    if (!body.reviews || body.reviews.length === 0) {
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

    // Generar fecha del reporte (UTC-3)
    const now = new Date();
    const argentinaDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
    const dateStr = argentinaDate.toISOString().split('T')[0]; // YYYY-MM-DD

    const recommendations = await getRecommendations(
      body.reviews,
      body.watchlist ?? [],
    );

    // CU 32 — Postcondición: reporte generado
    // Cuando exista DB persistente, guardar en PeliculaRecomendaciones:
    // { userId, date: dateStr, recommendations, generatedAt: new Date().toISOString() }

    return NextResponse.json({
      recommendations,
      date: dateStr,
      generatedAt: new Date().toISOString(),
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
 * GET /api/ai/recommend/daily — health check / estado del reporte diario.
 */
export async function GET() {
  const now = new Date();
  const argentinaDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
  const dateStr = argentinaDate.toISOString().split('T')[0];
  const hour = argentinaDate.getHours();

  return NextResponse.json({
    status: 'ok',
    today: dateStr,
    currentHourUTC3: hour,
    nextGenerationHour: 21,
    nextGenerationAt: `${dateStr}T21:00:00.000-03:00`,
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
}
