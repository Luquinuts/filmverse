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
    if (typeof window !== 'undefined') {
      console.info(
        '🔓 Supabase no configurado — usando mock de autenticación (server).',
      );
    }

    const mockUser = {
      id: 'mock-user-001',
      email: 'demo@filmverse.com',
      user_metadata: { username: 'Demo' },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      role: 'authenticated',
    };

    const mockSession = {
      access_token: 'mock_access_token',
      refresh_token: 'mock_refresh_token',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: mockUser,
    };

    // Stub mock — acepta cualquier credencial, devuelve éxito
    return {
      auth: {
        signInWithPassword: async () => ({
          data: { user: mockUser, session: mockSession },
          error: null,
        }),
        signUp: async () => ({
          data: { user: mockUser, session: mockSession },
          error: null,
        }),
        signInWithOAuth: async () => ({
          data: { provider: 'google', url: '' },
          error: null,
        }),
        signOut: async () => {},
        resetPasswordForEmail: async () => ({ data: {}, error: null }),
        getUser: async () => ({
          data: { user: mockUser },
          error: null,
        }),
        getSession: async () => ({
          data: { session: mockSession },
          error: null,
        }),
        exchangeCodeForSession: async () => ({
          data: { session: mockSession },
          error: null,
        }),
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } },
        }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
            data: null,
            error: null,
          }),
          data: null,
          error: null,
        }),
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
