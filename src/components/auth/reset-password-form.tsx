'use client';

import { useCallback, useState, useTransition } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ResetPasswordForm() {
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleReset = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!email) {
        setError('Ingresá tu email.');
        return;
      }

      startTransition(async () => {
        const { error: authError } =
          await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?redirect_to=/`,
          });

        if (authError) {
          setError(authError.message);
          return;
        }

        setSubmitted(true);
      });
    },
    [email, supabase.auth],
  );

  if (submitted) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Revisá tu email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-muted-foreground">
              Te enviamos un enlace de recuperación a{' '}
              <span className="font-medium text-gray-200">{email}</span>.
              Seguí las instrucciones para restablecer tu contraseña.
            </p>
            <p className="text-xs text-gray-500">
              ¿No recibiste el correo? Revisá tu carpeta de spam o intentá de
              nuevo.
            </p>
            <Link
              href="/login"
              className="mt-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition"
            >
              Volver a inicio de sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-xl">
          Recuperar contraseña
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground text-center">
            Te enviaremos un enlace para restablecer tu contraseña.
          </p>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending
              ? 'Enviando…'
              : 'Enviar enlace de recuperación'}
          </Button>

          {/* Back to login */}
          <p className="mt-2 text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="font-medium text-indigo-400 hover:text-indigo-300 transition"
            >
              Volver a inicio de sesión
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
