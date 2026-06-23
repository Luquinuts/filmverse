// ─────────────────────────────────────────────
// FilmVerse — POST /api/premium/sync
// ─────────────────────────────────────────────
// Sincroniza el estado premium del usuario tras un pago exitoso.
// Crea/actualiza la suscripción y el rol en profiles.
// ─────────────────────────────────────────────

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { MercadoPagoClient } from '@/lib/mercadopago';

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

    const adminClient = createAdminClient();

    // Verificar si ya tiene suscripción activa
    const { data: existing } = await adminClient
      .from('premium_subscriptions')
      .select('id, status, mercadopago_subscription_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing && existing.status === 'active') {
      // Ya está activa — asegurar que el rol también esté correcto
      await adminClient
        .from('profiles')
        .update({ role: 'premium' })
        .eq('id', user.id);

      return NextResponse.json({ synced: true, status: 'already_active' });
    }

    // Crear suscripción (viene de un pago exitoso vía link estático)
    if (!existing) {
      await adminClient
        .from('premium_subscriptions')
        .insert({
          user_id: user.id,
          status: 'active',
          start_date: new Date().toISOString(),
        });
    } else {
      // reactivar si estaba cancelada/expirada
      await adminClient
        .from('premium_subscriptions')
        .update({ status: 'active', end_date: null })
        .eq('user_id', user.id);
    }

    // Actualizar rol
    await adminClient
      .from('profiles')
      .update({ role: 'premium' })
      .eq('id', user.id);

    // ─── Best-effort: buscar y guardar el ID de suscripción de MP ───
    // Con link estático no recibimos el preapproval_id, así que buscamos
    // por email para que los webhooks puedan identificar al usuario.
    if (user.email) {
      try {
        const mp = new MercadoPagoClient();
        const preapproval = await mp.searchPreapprovalsByEmail(user.email);

        if (preapproval?.id) {
          await adminClient
            .from('premium_subscriptions')
            .update({ mercadopago_subscription_id: preapproval.id })
            .eq('user_id', user.id);

          console.info(
            `[API /premium/sync] MP subscription ID guardado: ${preapproval.id}`,
          );
        }
      } catch (err) {
        // No crítico — la suscripción ya está activa sin el MP ID
        console.warn(
          '[API /premium/sync] No se pudo obtener MP subscription ID:',
          err,
        );
      }
    }

    return NextResponse.json({ synced: true, status: 'created' });
  } catch (error) {
    console.error('[API /premium/sync]', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
