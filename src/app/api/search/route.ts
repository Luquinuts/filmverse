import { NextRequest, NextResponse } from 'next/server';
import { TmdbClient } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');

  if (!q || q.trim().length === 0) {
    return NextResponse.json(
      { error: 'Se requiere un término de búsqueda' },
      { status: 400 },
    );
  }

  try {
    const tmdb = new TmdbClient();
    const movies = await tmdb.searchMovies(q.trim());
    return NextResponse.json(movies);
  } catch (error) {
    console.error('[API /search]', error);
    return NextResponse.json([]);
  }
}
