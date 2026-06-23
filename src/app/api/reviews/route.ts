// ─────────────────────────────────────────────
// FilmVerse — POST /api/reviews
// ─────────────────────────────────────────────
// Crea o actualiza una reseña con rate limiting.
// Usuarios gratuitos: 3 reseñas/día.
// Usuarios premium: sin límite.
// ─────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getDailyUsage } from '@/lib/supabase/store';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { film_id, film_title, film_poster, film_year, rating, content, is_spoiler } = body;

    if (!film_id || rating === undefined || content === undefined) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos (film_id, rating, content)' },
        { status: 400 },
      );
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 10) {
      return NextResponse.json(
        { error: 'Rating debe ser un número entre 1 y 10' },
        { status: 400 },
      );
    }

    // Rate limiting: verificar si puede crear una NUEVA reseña
    // (editar una existente no cuenta contra el límite)
    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', user.id)
      .eq('film_id', film_id)
      .is('deleted_at', null)
      .maybeSingle();

    if (!existing) {
      const { used, limit } = await getDailyUsage(supabase, user.id, 'review');
      if (used >= limit) {
        return NextResponse.json(
          { error: `Límite diario alcanzado (${limit} reseñas/día). Actualizá a Premium para reseñas ilimitadas.` },
          { status: 429 },
        );
      }
    }

    // Crear/actualizar reseña con admin client (bypass RLS)
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from('reviews')
      .upsert(
        {
          user_id: user.id,
          film_id,
          film_title,
          film_poster: film_poster ?? null,
          film_year: film_year ?? null,
          rating,
          content,
          is_spoiler: is_spoiler ?? false,
          deleted_at: null,
        },
        { onConflict: 'user_id, film_id' },
      )
      .select()
      .single();

    if (error) {
      console.error('[API /reviews] upsert error:', error);
      return NextResponse.json(
        { error: 'Error al guardar la reseña' },
        { status: 500 },
      );
    }

    return NextResponse.json({ review: data });
  } catch (error) {
    console.error('[API /reviews]', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
