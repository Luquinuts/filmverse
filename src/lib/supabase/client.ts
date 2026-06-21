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
      console.info(
        '🔓 Supabase no configurado — usando mock de autenticación. Cualquier usuario y contraseña funciona.',
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
        upsert: () => ({
          select: () => ({
            single: async () => ({
              data: {
                id: 'mock-review-id',
                user_id: mockUser.id,
                film_id: 0,
                film_title: '',
                rating: 0,
                content: '',
                is_spoiler: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              error: null,
            }),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof createBrowserClient>;
  }

  return createBrowserClient(url, key);
}
