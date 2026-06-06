import { createBrowserClient } from '@supabase/ssr';

/**
 * Crea un cliente de Supabase para usar en Componentes del Cliente (Client Components).
 * No necesita cookie store — el navegador maneja las cookies automáticamente.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
