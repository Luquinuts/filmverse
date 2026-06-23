// ─────────────────────────────────────────────
// FilmVerse — POST /api/premium/create-preference
// ─────────────────────────────────────────────
// Crea una preferencia de suscripción recurrente en Mercado Pago
// y devuelve la URL de checkout (initPoint) para redirigir al usuario.
// ─────────────────────────────────────────────

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MercadoPagoClient } from '@/lib/mercadopago';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 },
      );
    }

    const { email } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email de Mercado Pago inválido' },
        { status: 400 },
      );
    }

    const mpClient = new MercadoPagoClient();
    const preference = await mpClient.createSubscriptionPreference(
      user.id,
      email,
    );

    return NextResponse.json({
      preferenceId: preference.id,
      initPoint: preference.initPoint,
    });
  } catch (error) {
    console.error('[API /premium/create-preference]', error);
    return NextResponse.json(
      { error: 'Error al crear la preferencia de pago' },
      { status: 500 },
    );
  }
}
