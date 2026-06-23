'use client';

import { useState, useEffect, useRef } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PremiumSuccessPage() {
  const [syncing, setSyncing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const synced = useRef(false);

  useEffect(() => {
    if (synced.current) return;
    synced.current = true;

    fetch('/api/premium/sync', { method: 'POST' })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json();
          setError(body.error ?? 'Error al sincronizar');
        }
      })
      .catch(() => setError('Error de conexión'))
      .finally(() => setSyncing(false));
  }, []);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-4">
      <div className="glass rounded-2xl p-10 text-center">
        {syncing ? (
          <>
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-cinema-gold/20">
              <Loader2 className="size-10 animate-spin text-cinema-gold" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white">
              Activando tu suscripción...
            </h1>
            <p className="text-sm text-muted-foreground">
              Esto toma solo unos segundos.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle className="size-10 text-green-400" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white">
              ¡Suscripción exitosa!
            </h1>
            <p className="mb-6 text-sm text-muted-foreground">
              Ya forms parte de FilmVerse Premium. Disfrutá de todas las funcionalidades exclusivas.
            </p>
            {error && (
              <p className="mb-4 text-sm text-yellow-400">
                {error} — pero no te preocupes, tu pago fue recibido. Si el premium no aparece, contactanos.
              </p>
            )}
            <Link
              href="/dashboard"
              className="inline-block rounded-lg bg-cinema-gold px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-cinema-amber"
            >
              Ir al Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
