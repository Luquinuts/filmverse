import { NextRequest, NextResponse } from 'next/server';
import { getRecommendations } from '@/lib/gemini';
import type { ReviewEntry, WatchlistEntry } from '@/lib/local-store';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      reviews: ReviewEntry[];
      watchlist: WatchlistEntry[];
    };

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

    const recommendations = await getRecommendations(
      body.reviews,
      body.watchlist ?? [],
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
