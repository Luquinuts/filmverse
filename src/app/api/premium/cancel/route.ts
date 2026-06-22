// ─────────────────────────────────────────────
// FilmVerse — POST /api/premium/cancel
// ─────────────────────────────────────────────
// Cancela la suscripción premium del usuario autenticado.
//
// Flujo:
//   1. Verificar autenticación
//   2. Crear admin client (service_role para writes)
//   3. Obtener suscripción activa del usuario
//   4. Cancelar en Mercado Pago (via API)
//   5. Cancelar en BD (store function: status + role revert)
// ─────────────────────────────────────────────

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { MercadoPagoClient } from '@/lib/mercadopago';
import { getUserSubscription, cancelSubscription } from '@/lib/supabase/store';

export async function POST() {
  try {
    // 1. Autenticación
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 },
      );
    }

    // 2. Admin client para writes
    const adminClient = createAdminClient();

    // 3. Obtener suscripción activa
    const subscription = await getUserSubscription(adminClient, user.id);

    if (!subscription || subscription.status !== 'active') {
      return NextResponse.json(
        { error: 'No tenés una suscripción activa para cancelar' },
        { status: 400 },
      );
    }

    // 4. Cancelar en Mercado Pago (si tiene ID de MP)
    if (subscription.mercadopago_subscription_id) {
      const mpClient = new MercadoPagoClient();
      try {
        await mpClient.cancelPreapproval(subscription.mercadopago_subscription_id);
      } catch (mpError) {
        console.error(
          '[API /premium/cancel] Error cancelando en MP:',
          mpError,
        );
        // Continuamos con la cancelación local aunque MP falle
        // (el webhook de MP eventualmente confirmará)
      }
    }

    // 5. Cancelar en BD
    await cancelSubscription(adminClient, user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API /premium/cancel]', error);
    return NextResponse.json(
      { error: 'Error al cancelar la suscripción' },
      { status: 500 },
    );
  }
}
