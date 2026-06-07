import { createBrowserClient } from '@supabase/ssr';

/**
 * Crea un cliente de Supabase para usar en Componentes del Cliente (Client Components).
 * Si las variables de entorno no están configuradas, devuelve un stub que no rompe el build.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (typeof window !== 'undefined') {
      console.warn(
        'Supabase no está configurado. Configurá NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      );
    }
    // Stub que no rompe — todas las llamadas fallan silenciosamente
    return {
      auth: {
        signInWithPassword: async () => ({ error: new Error('Supabase no configurado') }),
        signUp: async () => ({ error: new Error('Supabase no configurado') }),
        signInWithOAuth: async () => ({ error: new Error('Supabase no configurado') }),
        signOut: async () => {},
        resetPasswordForEmail: async () => ({ error: new Error('Supabase no configurado') }),
        getUser: async () => ({ data: { user: null }, error: new Error('Supabase no configurado') }),
        getSession: async () => ({ data: { session: null }, error: null }),
        exchangeCodeForSession: async () => ({ data: {}, error: new Error('Supabase no configurado') }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }), data: null, error: null }) }),
        insert: async () => ({ error: null }),
        update: async () => ({ error: null }),
        delete: async () => ({ error: null }),
      }),
    } as unknown as ReturnType<typeof createBrowserClient>;
  }

  return createBrowserClient(url, key);
}
