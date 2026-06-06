'use client';

import { useCallback, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OAuthButton } from '@/components/auth/oauth-button';

export interface LoginFormProps {
  redirectUrl?: string;
}

export function LoginForm({ redirectUrl = '/' }: LoginFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!email || !password) {
        setError('Completá todos los campos.');
        return;
      }

      startTransition(async () => {
        const { error: authError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (authError) {
          setError(authError.message);
          return;
        }

        router.push(redirectUrl);
        router.refresh();
      });
    },
    [email, password, redirectUrl, router, supabase.auth],
  );

  const handleOAuthLogin = useCallback(async () => {
    setError(null);
    setIsOAuthLoading(true);

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect_to=${encodeURIComponent(redirectUrl)}`,
      },
    });

    if (authError) {
      setError(authError.message);
      setIsOAuthLoading(false);
    }
    // Si no hay error, el navegador redirige a Google — no reseteamos loading
  }, [redirectUrl, supabase.auth]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-xl">Iniciar sesión</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password">Contraseña</Label>
              <Link
                href="/auth/reset-password"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </Button>

          {/* Divider */}
          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                o continuá con
              </span>
            </div>
          </div>

          {/* OAuth */}
          <OAuthButton
            onClick={handleOAuthLogin}
            isLoading={isOAuthLoading}
            disabled={isPending}
          />

          {/* Register link */}
          <p className="mt-2 text-center text-sm text-muted-foreground">
            ¿No tenés cuenta?{' '}
            <Link
              href="/register"
              className="font-medium text-indigo-400 hover:text-indigo-300 transition"
            >
              Crear cuenta
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
