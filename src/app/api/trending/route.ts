import { NextResponse } from 'next/server';
import { TmdbClient } from '@/lib/tmdb';

export async function GET() {
  try {
    const tmdb = new TmdbClient();
    const movies = await tmdb.getTrending();
    return NextResponse.json(movies);
  } catch (error) {
    console.error('[API /trending]', error);
    return NextResponse.json([]);
  }
}
