import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

/**
 * Rutas protegidas que requieren autenticación.
 * Cualquier request que coincida con estos prefijos será redirigido
 * a /login si el usuario no tiene una sesión válida.
 */
const protectedPaths = [
  '/dashboard',
  '/profile',
  '/chat',
  '/feed',
  '/admin',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si la ruta no está protegida, pasar sin verificar
  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Refrescar sesión — devolvemos el response de updateSession
  // para que las cookies actualizadas no se pierdan.
  try {
    return await updateSession(request);
  } catch {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Coincidir con todos los paths excepto:
     * - _next/static (archivos estáticos de Next)
     * - _next/image (optimización de imágenes)
     * - favicon.ico
     * - /login y /auth/* (páginas de autenticación)
     */
    '/((?!_next/static|_next/image|favicon.ico|login|register|auth).*)',
  ],
};
