// ─────────────────────────────────────────────
// FilmVerse — POST /api/premium/create-preference
// ─────────────────────────────────────────────
// Crea una preferencia de suscripción recurrente en Mercado Pago
// y devuelve la URL de checkout (initPoint) para redirigir al usuario.
// ─────────────────────────────────────────────

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MercadoPagoClient, MercadoPagoApiError } from '@/lib/mercadopago';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 },
      );
    }

    const mpClient = new MercadoPagoClient();
    const preference = await mpClient.createSubscriptionPreference(user.id);

    return NextResponse.json({
      preferenceId: preference.id,
      initPoint: preference.initPoint,
    });
  } catch (error) {
    const message =
      error instanceof MercadoPagoApiError
        ? error.message
        : 'Error al crear la preferencia de pago';
    console.error('[API /premium/create-preference]', error);
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
