import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { reportReview } from '@/lib/supabase/store';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = (await request.json()) as {
      reviewId: string;
      reason: string;
    };

    if (!body.reviewId || !body.reason) {
      return NextResponse.json(
        { error: 'Faltan datos: reviewId y reason son requeridos' },
        { status: 400 },
      );
    }

    await reportReview(supabase, body.reviewId, user.id, body.reason);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API /reports]', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
