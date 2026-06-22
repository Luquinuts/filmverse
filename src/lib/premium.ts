// ─────────────────────────────────────────────
// FilmVerse — Premium Subscription Guards
// ─────────────────────────────────────────────

/**
 * Verifica si un perfil tiene rol premium.
 *
 * Fuente de verdad: `profile.role === 'premium'`.
 * No hace consultas a la BD — confía en el rol ya cargado en el perfil.
 */
export function isPremium(profile: { role: string }): boolean {
  return profile.role === 'premium';
}

/**
 * Guard para rutas de API que requieren suscripción premium.
 *
 * Lanza un error que debe ser capturado por el manejador de la ruta
 * (generalmente traducido a un 403 Forbidden con mensaje de upgrade).
 *
 * @example
 * ```ts
 * export async function POST(req: Request) {
 *   const profile = await getProfile(client, userId);
 *   if (!isPremium(profile)) return requirePremium();
 *   // ... handle premium feature
 * }
 * ```
 */
export function requirePremium(): never {
  throw new PremiumRequiredError(
    'Se requiere una suscripción premium para acceder a esta función.',
  );
}

/**
 * Error específico para contenido premium.
 * Las rutas API deben capturarlo y responder con 403.
 */
export class PremiumRequiredError extends Error {
  constructor(message?: string) {
    super(message ?? 'Premium subscription required');
    this.name = 'PremiumRequiredError';
  }
}
