import { createClient } from '@supabase/supabase-js';

/**
 * Cliente de Supabase con rol de servicio (service_role).
 * Úsalo SOLO en operaciones de administración que necesitan
 * bypass de RLS (actualizar roles, moderar contenido, etc.).
 *
 * NO expongas este cliente en el navegador o en componentes de cliente.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Supabase no configurado. Se requiere SUPABASE_SERVICE_ROLE_KEY para operaciones de administración.',
    );
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
