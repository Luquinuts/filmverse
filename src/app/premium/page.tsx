'use client';

import { useState, useRef, useEffect } from 'react';
import { Crown, ArrowLeft, Sparkles, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { isPremium } from '@/lib/premium';

export default function PremiumPage() {
  const supabase = useRef(createClient()).current;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyPremium, setAlreadyPremium] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setAuthLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile && isPremium(profile)) {
        setAlreadyPremium(true);
      }

      setAuthLoading(false);
    }).catch(() => {
      setAuthLoading(false);
    });
  }, [supabase]);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/premium/create-preference', {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Error al crear la preferencia de pago');
        setLoading(false);
        return;
      }

      if (data.initPoint) {
        window.location.href = data.initPoint;
      } else {
        setError('No se pudo obtener la URL de pago');
        setLoading(false);
      }
    } catch (err) {
      console.error('[premium] create-preference:', err);
      setError('Error de conexión. Intentá de nuevo.');
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="size-8 animate-spin text-cinema-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-cinema-gold"
      >
        <ArrowLeft className="size-4" />
        Volver al Dashboard
      </Link>

      {/* Already premium banner */}
      {alreadyPremium && (
        <div className="mb-8 rounded-2xl border border-cinema-gold/30 bg-cinema-gold/10 p-6 text-center">
          <Crown className="mx-auto mb-2 size-10 text-cinema-gold" />
          <h2 className="text-xl font-bold text-white">Ya sos Premium</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Disfrutá de todas las funcionalidades exclusivas de FilmVerse Premium.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block rounded-lg bg-cinema-gold px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-cinema-amber"
          >
            Ir al Dashboard
          </Link>
        </div>
      )}

      {/* Hero section (hidden if already premium) */}
      {!alreadyPremium && (
        <>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-cinema-gold/20">
              <Crown className="size-8 text-cinema-gold" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              FilmVerse Premium
            </h1>
            <p className="mt-2 text-muted-foreground">
              Desbloqueá funcionalidades exclusivas y apoyá al cine independiente
            </p>
          </div>

          {/* Plan card */}
          <div className="glass mb-8 rounded-2xl border border-cinema-gold/30 p-8 text-center">
            <div className="mb-2 flex items-center justify-center gap-2">
              <Sparkles className="size-5 text-cinema-gold" />
              <span className="text-sm font-medium uppercase tracking-wider text-cinema-gold">
                Premium
              </span>
            </div>
            <p className="text-5xl font-bold text-white">
              ARS 299
              <span className="text-lg font-normal text-muted-foreground">/mes</span>
            </p>
            <ul className="mx-auto mt-6 mb-8 space-y-3 text-left">
              {[
                'Recomendaciones con IA',
                'Insignia premium en tu perfil',
                'Soporte prioritario',
                'Sin publicidad',
              ].map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check className="size-4 text-cinema-gold" />
                  {benefit}
                </li>
              ))}
            </ul>
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full rounded-lg bg-cinema-gold px-6 py-3 text-base font-semibold text-black transition-colors hover:bg-cinema-amber disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Procesando...' : 'Suscribirse'}
            </button>
            {error && (
              <p className="mt-3 text-sm text-red-400">{error}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
