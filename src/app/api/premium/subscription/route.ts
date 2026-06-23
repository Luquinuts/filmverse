// ─────────────────────────────────────────────
// FilmVerse — GET /api/premium/subscription
// ─────────────────────────────────────────────
// Devuelve la suscripción activa del usuario
// con estado y próxima fecha de facturación.
// ─────────────────────────────────────────────

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getActiveSubscription } from '@/lib/supabase/store';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 },
      );
    }

    const subscription = await getActiveSubscription(supabase, user.id);

    if (!subscription) {
      return NextResponse.json(
        { subscribed: false },
        { status: 200 },
      );
    }

    return NextResponse.json({
      subscribed: true,
      status: subscription.status,
      startDate: subscription.start_date,
      nextBillingDate: subscription.next_billing_date,
    });
  } catch (error) {
    console.error('[API /premium/subscription]', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
