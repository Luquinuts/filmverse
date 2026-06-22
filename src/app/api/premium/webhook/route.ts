// ─────────────────────────────────────────────
// FilmVerse — POST /api/premium/webhook
// ─────────────────────────────────────────────
// Webhook de Mercado Pago para eventos de suscripción.
//
// Flujo:
//   1. Obtener raw body (req.text() — necesario para HMAC)
//   2. Verificar firma HMAC-SHA256 (header x-signature)
//   3. Parsear JSON del evento
//   4. Despachar según tipo de evento (via handleWebhook + admin client)
//
// MP espera 200 OK en menos de 30 segundos. Devolvemos 200 incluso
// si hay error interno para evitar reintentos masivos.
// ─────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoClient } from '@/lib/mercadopago';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    // 1. Raw body (obligatorio para HMAC — NO usar req.json())
    const rawBody = await request.text();

    // 2. Verificar firma
    const signature = request.headers.get('x-signature') ?? '';
    const isValid = await MercadoPagoClient.verifyWebhookSignature(
      rawBody,
      signature,
    );

    if (!isValid) {
      console.warn('[Webhook] Firma HMAC inválida — ignorando evento');
      return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
    }

    // 3. Parsear evento
    const event = JSON.parse(rawBody);

    if (!event.type) {
      console.warn('[Webhook] Evento sin tipo — ignorando');
      return NextResponse.json({ error: 'Evento inválido' }, { status: 400 });
    }

    // 4. Despachar con admin client para escrituras en BD
    const adminClient = createAdminClient();
    const mpClient = new MercadoPagoClient();

    // handleWebhook ahora recibe adminClient y llama a store functions
    // para subscription_*, sin modificar el dispatch centralizado
    await mpClient.handleWebhook(event, adminClient);

    // MP espera 200 — responder siempre éxito
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Error no esperado:', error);
    // Devolver 200 para evitar que MP reintente indefinidamente
    return NextResponse.json({ received: true });
  }
}
