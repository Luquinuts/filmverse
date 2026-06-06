import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /auth/callback?code={string}&redirect_to={string?}
 *
 * Intercambia el código de autorización OAuth por una sesión de Supabase
 * y redirige al usuario a la página de destino.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const redirectTo = searchParams.get('redirect_to') ?? '/dashboard';

  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=Código de autorización faltante', request.url),
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error.message);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url),
      );
    }

    return NextResponse.redirect(new URL(redirectTo, request.url));
  } catch (err) {
    console.error('Auth callback unexpected error:', err);
    return NextResponse.redirect(
      new URL('/login?error=Error inesperado al iniciar sesión', request.url),
    );
  }
}
