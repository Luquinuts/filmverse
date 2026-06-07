import { NextRequest, NextResponse } from 'next/server';
import { TmdbClient } from '@/lib/tmdb';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const tmdbId = Number(id);

  if (Number.isNaN(tmdbId)) {
    return NextResponse.json(
      { error: 'ID de película inválido' },
      { status: 400 },
    );
  }

  try {
    const tmdb = new TmdbClient();
    const movies = await tmdb.getSimilarMovies(tmdbId);
    return NextResponse.json(movies);
  } catch (error) {
    console.error('[API /movies/:id/similar]', error);
    return NextResponse.json([]);
  }
}
