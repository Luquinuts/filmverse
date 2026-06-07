import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Crea un cliente de Supabase para usar en Server Components y Route Handlers.
 * Si las variables de entorno no están configuradas, devuelve un stub.
 */
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn(
      'Supabase no está configurado. Configurá NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
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
    } as unknown as Awaited<ReturnType<typeof createServerClient<any, 'public'>>>;
  }

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[],
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Ignorado cuando se llama desde Server Components;
          // el middleware se encarga del refresh de sesión.
        }
      },
    },
  });
}
