// ─────────────────────────────────────────────
// FilmVerse — Mercado Pago Client
// ─────────────────────────────────────────────
// Cliente para la API de Mercado Pago:
//   - createSubscriptionPreference(): preapproval para suscripciones
//   - verifyWebhookSignature(): HMAC-SHA256 de webhooks entrantes
//   - handleWebhook(): dispatch según tipo de evento
// ─────────────────────────────────────────────

import type {
  PreferenceItem,
  Preference,
  MercadoPagoWebhookEvent,
} from '@/lib/types';

const MP_API_BASE_URL = 'https://api.mercadopago.com';

/** Precio fijo de suscripción premium mensual (en ARS). */
const PREMIUM_PRICE = 299;
const PREMIUM_CURRENCY = 'ARS';

// ─── Tipos internos de la API de MP ───

interface PreapprovalRequest {
  reason: string;
  external_reference: string;
  auto_recurring: {
    frequency: number;
    frequency_type: string;
    transaction_amount: number;
    currency_id: string;
  };
  back_url: string;
  status: string;
}

interface PreapprovalResponse {
  id: string;
  init_point: string;
  status: string;
  reason: string;
  external_reference: string;
}

// ─── Error ───

/**
 * Error específico de la API de Mercado Pago.
 */
export class MercadoPagoApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = 'MercadoPagoApiError';
  }
}

// ─── Cliente ───

/**
 * Cliente para la API de Mercado Pago.
 *
 * Soporta:
 * 1. Creación de preferencias de suscripción (preapproval)
 * 2. Verificación de firmas HMAC-SHA256 en webhooks
 * 3. Dispatch de eventos de webhook ({@link handleWebhook})
 *
 * En desarrollo, si no hay token configurado, devuelve stubs.
 */
export class MercadoPagoClient {
  private readonly accessToken: string;

  constructor() {
    this.accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN ?? '';

    if (!this.accessToken) {
      console.warn(
        '[MercadoPago] No se configuró MERCADOPAGO_ACCESS_TOKEN. ' +
          'Las operaciones reales fallarán; se usarán stubs.',
      );
    }
  }

  // ─── Preferencia de pago único (one-time) ───

  /**
   * Crea una preferencia de pago único en Mercado Pago.
   *
   * @deprecated Usar {@link createSubscriptionPreference} para suscripciones.
   * @param items - Items a incluir en la preferencia
   * @returns Preferencia creada (stub si no hay token)
   */
  async createPreference(items: PreferenceItem[]): Promise<Preference> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    };

    try {
      const response = await fetch(`${MP_API_BASE_URL}/checkout/preferences`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description ?? item.title,
            quantity: item.quantity,
            currency_id: item.currency_id,
            unit_price: item.unit_price,
          })),
          back_urls: {
            success: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/premium/success`,
            failure: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/premium/failure`,
            pending: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/premium/pending`,
          },
          auto_return: 'approved',
        }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          return this.getStubPreference(items);
        }
        throw new MercadoPagoApiError(
          `Mercado Pago API error: ${response.statusText}`,
          response.status,
        );
      }

      return response.json() as Promise<Preference>;
    } catch (error) {
      if (error instanceof MercadoPagoApiError) throw error;

      console.warn('[MercadoPago] Usando stub — llamada real falló:', error);
      return this.getStubPreference(items);
    }
  }

  // ─── Suscripción recurrente (preapproval) ───

  /**
   * Crea una preferencia de suscripción recurrente (preapproval).
   *
   * Llama a `POST /preapproval` en la API de MP.
   * El usuario es redirigido a `initPoint` para completar el pago.
   *
   * @param userId - ID del usuario que se suscribe (se envía como external_reference)
   * @returns ID de la preferencia y URL de checkout
   */
  async createSubscriptionPreference(
    userId: string,
  ): Promise<{ id: string; initPoint: string }> {
    // Fallback a stub en desarrollo
    if (!this.accessToken) {
      console.warn(
        '[MercadoPago] createSubscriptionPreference: sin token, devolviendo stub.',
      );
      return {
        id: `stub_preapproval_${Date.now()}`,
        initPoint: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/premium/success?preapproval_id=stub`,
      };
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    const body: PreapprovalRequest = {
      reason: 'FilmVerse Premium',
      external_reference: userId,
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: PREMIUM_PRICE,
        currency_id: PREMIUM_CURRENCY,
      },
      back_url: `${appUrl}/premium/success`,
      status: 'pending',
    };

    const response = await fetch(`${MP_API_BASE_URL}/preapproval`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new MercadoPagoApiError(
        `Error al crear preapproval: ${response.statusText}`,
        response.status,
      );
    }

    const data = (await response.json()) as PreapprovalResponse;

    return {
      id: data.id,
      initPoint: data.init_point,
    };
  }

  // ─── Webhooks ───

  /**
   * Procesa un webhook entrante de Mercado Pago.
   *
   * NOTA: Esta función es un alias de {@link handleWebhook} para mantener
   * compatibilidad con código existente. Preferir `handleWebhook`.
   */
  async processWebhook(event: MercadoPagoWebhookEvent): Promise<void> {
    return this.handleWebhook(event);
  }

  /**
   * Procesa un webhook entrante y despacha según el tipo de evento.
   *
   * Eventos de suscripción (`subscription_*`) actualizan el estado
   * en la BD llamando a las funciones de store.
   *
   * @param event - Evento de webhook recibido
   */
  async handleWebhook(event: MercadoPagoWebhookEvent): Promise<void> {
    console.info(
      `[MercadoPago] Webhook recibido: ${event.type} / ${event.action}`,
      `Data ID: ${event.data.id}`,
    );

    switch (event.type) {
      case 'subscription_created':
      case 'subscription_authorized':
        await this.handleSubscriptionActivated(event);
        break;

      case 'subscription_cancelled':
        await this.handleSubscriptionCancelled(event);
        break;

      case 'subscription_expired':
        await this.handleSubscriptionExpired(event);
        break;

      case 'subscription_updated':
        await this.handleSubscriptionUpdated(event);
        break;

      case 'payment':
        await this.handlePaymentEvent(event);
        break;

      default:
        console.info(
          `[MercadoPago] Tipo de evento no manejado: ${event.type}`,
        );
    }
  }

  // ─── Manejadores de suscripción ───

  /**
   * Procesa `subscription_created` / `subscription_authorized`.
   *
   * TODO: Implementar en PR 2 — llamar a store.ts:
   *   - `getUserSubscription(client, userId)` para verificar duplicados
   *   - `updateSubscriptionAndRole(client, userId, data)` para
   *     upsert + actualizar `profiles.role = 'premium'`
   */
  private async handleSubscriptionActivated(
    event: MercadoPagoWebhookEvent,
  ): Promise<void> {
    console.info(
      `[MercadoPago] Suscripción activada: ${event.data.id}`,
    );
    // PR 2: const userId = await this.resolveUserId(event);
    // PR 2: await updateSubscriptionAndRole(adminClient, userId, {
    // PR 2:   status: 'active',
    // PR 2:   mercadopago_subscription_id: event.data.id,
    // PR 2: });
  }

  /**
   * Procesa `subscription_cancelled`.
   *
   * TODO: Implementar en PR 2 — llamar a store.ts:
   *   - `cancelSubscription(client, userId)` para:
   *     1. UPDATE premium_subscriptions SET status='cancelled', end_date=NOW()
   *     2. UPDATE profiles SET role='cinefilo'
   */
  private async handleSubscriptionCancelled(
    event: MercadoPagoWebhookEvent,
  ): Promise<void> {
    console.info(
      `[MercadoPago] Suscripción cancelada: ${event.data.id}`,
    );
    // PR 2: const userId = await this.resolveUserId(event);
    // PR 2: await cancelSubscription(adminClient, userId);
  }

  /**
   * Procesa `subscription_expired`.
   *
   * TODO: Implementar en PR 2 — llamar a store.ts:
   *   - `cancelSubscription(client, userId)` es reutilizable
   *     (cambia status a 'expired' en lugar de 'cancelled')
   */
  private async handleSubscriptionExpired(
    event: MercadoPagoWebhookEvent,
  ): Promise<void> {
    console.info(
      `[MercadoPago] Suscripción expirada: ${event.data.id}`,
    );
    // PR 2: const userId = await this.resolveUserId(event);
    // PR 2: await updateSubscriptionAndRole(adminClient, userId, {
    // PR 2:   status: 'expired',
    // PR 2: });
  }

  /**
   * Procesa `subscription_updated` (cambios no terminales).
   *
   * Refleja el nuevo estado sin cambiar el rol del perfil.
   */
  private async handleSubscriptionUpdated(
    event: MercadoPagoWebhookEvent,
  ): Promise<void> {
    console.info(
      `[MercadoPago] Suscripción actualizada (no terminal): ${event.data.id}`,
    );
    // PR 2: const userId = await this.resolveUserId(event);
    // PR 2: await getUserSubscription(adminClient, userId); // sync estado actual
  }

  // ─── Manejador de pagos ───

  /**
   * Procesa eventos de pago (no suscripción).
   */
  private async handlePaymentEvent(
    event: MercadoPagoWebhookEvent,
  ): Promise<void> {
    console.info(
      `[MercadoPago] Procesando pago ${event.data.id} (acción: ${event.action})`,
    );
    // TODO: Implementar lógica de negocio para pagos únicos si aplica
  }

  // ─── Verificación de firma ───

  /**
   * Verifica la firma HMAC-SHA256 de un webhook de Mercado Pago.
   *
   * MP envía el header `x-signature` con formato:
   * ```
   * ts=1700000000|v1=abcdef1234567890abcdef1234567890
   * ```
   *
   * El HMAC se calcula sobre `{ts}\n{rawBody}` usando el webhook secret.
   *
   * @param rawBody - Cuerpo crudo de la solicitud (string sin parsear)
   * @param signature - Valor completo del header `x-signature`
   * @param secret - Clave secreta del webhook (default: MERCADOPAGO_WEBHOOK_SECRET env)
   * @returns `true` si la firma es válida
   */
  static async verifyWebhookSignature(
    rawBody: string,
    signature: string,
    secret?: string,
  ): Promise<boolean> {
    const webhookSecret =
      secret ?? process.env.MERCADOPAGO_WEBHOOK_SECRET ?? '';

    if (!webhookSecret) {
      console.warn(
        '[MercadoPago] No se configuró MERCADOPAGO_WEBHOOK_SECRET.',
      );
      return false;
    }

    // Parsear header x-signature
    const parts = signature.split('|');
    let ts = '';
    let receivedHash = '';

    for (const part of parts) {
      const [key, value] = part.split('=');
      if (key === 'ts') ts = value;
      if (key === 'v1') receivedHash = value;
    }

    if (!ts || !receivedHash) {
      console.warn(
        '[MercadoPago] Formato de firma inválido: se esperaba ts=...|v1=...',
      );
      return false;
    }

    const payload = `${ts}\n${rawBody}`;
    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );

    const signatureBytes = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(payload),
    );

    // Convertir a hex
    const hashArray = Array.from(new Uint8Array(signatureBytes));
    const computedHash = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return computedHash === receivedHash;
  }

  // ─── Helpers privados ───

  /**
   * Devuelve una preferencia simulada para desarrollo.
   */
  private getStubPreference(items: PreferenceItem[]): Preference {
    const total = items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0,
    );
    const stubId = `stub_${Date.now()}`;

    return {
      id: stubId,
      init_point: `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${stubId}&amount=${total}`,
      sandbox_init_point: `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=${stubId}&amount=${total}`,
      collector_id: 0,
    };
  }
}
