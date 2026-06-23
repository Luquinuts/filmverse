// ─────────────────────────────────────────────
// FilmVerse — POST /api/premium/sync
// ─────────────────────────────────────────────
// Sincroniza el estado premium del usuario tras un pago exitoso.
// Crea/actualiza la suscripción y el rol en profiles.
// ─────────────────────────────────────────────

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

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
      .select('id, status')
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

    return NextResponse.json({ synced: true, status: 'created' });
  } catch (error) {
    console.error('[API /premium/sync]', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
