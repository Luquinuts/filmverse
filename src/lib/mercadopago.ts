// ─────────────────────────────────────────────
// FilmVerse — Mercado Pago Client (Stub)
// ─────────────────────────────────────────────

import type {
  PreferenceItem,
  Preference,
  MercadoPagoWebhookEvent,
} from '@/lib/types';

const MP_API_BASE_URL = 'https://api.mercadopago.com';

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

/**
 * Cliente stub para la API de Mercado Pago.
 *
 * Las suscripciones premium se implementarán en una fase posterior.
 * Por ahora, este cliente devuelve resultados simulados para permitir
 * el desarrollo y prueba del flujo de suscripción.
 */
export class MercadoPagoClient {
  private readonly accessToken: string;

  constructor() {
    this.accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN ?? '';

    if (!this.accessToken) {
      console.warn(
        '[MercadoPago] No se configuró MERCADOPAGO_ACCESS_TOKEN. ' +
          'Las operaciones de pago fallarán.',
      );
    }
  }

  /**
   * Crea una preferencia de pago en Mercado Pago.
   *
   * @param items - Items a incluir en la preferencia
   * @returns Preferencia creada (stub: devuelve datos simulados)
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
        // Si la API no está disponible (fase de desarrollo), devolver stub
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

      // Stub: devuelve datos simulados para desarrollo
      console.warn(
        '[MercadoPago] Usando stub — llamada real falló:',
        error,
      );
      return this.getStubPreference(items);
    }
  }

  /**
   * Procesa un webhook entrante de Mercado Pago.
   *
   * @param event - Evento de webhook recibido
   */
  async processWebhook(event: MercadoPagoWebhookEvent): Promise<void> {
    console.info(
      `[MercadoPago] Webhook recibido: ${event.type} / ${event.action}`,
      `Data ID: ${event.data.id}`,
    );

    // En una implementación real:
    // 1. Verificar la firma del webhook
    // 2. Obtener los detalles del pago usando event.data.id
    // 3. Actualizar el estado de la suscripción en la BD
    // 4. Notificar al usuario

    switch (event.type) {
      case 'payment':
        await this.handlePaymentEvent(event);
        break;
      case 'subscription':
        await this.handleSubscriptionEvent(event);
        break;
      default:
        console.info(
          `[MercadoPago] Tipo de evento no manejado: ${event.type}`,
        );
    }
  }

  /**
   * Maneja eventos de pago.
   */
  private async handlePaymentEvent(
    event: MercadoPagoWebhookEvent,
  ): Promise<void> {
    console.info(
      `[MercadoPago] Procesando pago ${event.data.id} (acción: ${event.action})`,
    );
    // TODO: Implementar lógica de negocio para pagos
  }

  /**
   * Maneja eventos de suscripción.
   */
  private async handleSubscriptionEvent(
    event: MercadoPagoWebhookEvent,
  ): Promise<void> {
    console.info(
      `[MercadoPago] Procesando suscripción ${event.data.id} (acción: ${event.action})`,
    );
    // TODO: Implementar lógica de negocio para suscripciones
  }

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
