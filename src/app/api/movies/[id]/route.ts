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
    const movie = await tmdb.getMovieDetail(tmdbId);
    return NextResponse.json(movie);
  } catch (error) {
    console.error('[API /movies/:id]', error);
    return NextResponse.json(
      { error: 'No se pudo obtener el detalle de la película' },
      { status: 500 },
    );
  }
}
