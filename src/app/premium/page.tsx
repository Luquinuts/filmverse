'use client';

import { useState, useRef, useEffect } from 'react';
import { Crown, ArrowLeft, Sparkles, Check, Loader2, Calendar } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { isPremium } from '@/lib/premium';

const SUBSCRIPTION_URL = process.env.NEXT_PUBLIC_MP_SUBSCRIPTION_LINK;

export default function PremiumPage() {
  const supabase = useRef(createClient()).current;

  const [alreadyPremium, setAlreadyPremium] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [nextBilling, setNextBilling] = useState<string | null>(null);

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

      const isPremiumUser = profile && isPremium(profile);

      // Fallback: si el rol no es premium, chequear si hay suscripción activa
      if (!isPremiumUser) {
        try {
          const res = await fetch('/api/premium/subscription');
          if (res.ok) {
            const subData = await res.json();
            if (subData.subscribed && subData.status === 'active') {
              // Hay suscripción pero rol desactualizado — sincronizar
              await fetch('/api/premium/sync', { method: 'POST' });
              setAlreadyPremium(true);
              setAuthLoading(false);
              return;
            }
          }
        } catch {
          // Silently fail
        }
      }

      if (isPremiumUser) {
        setAlreadyPremium(true);

        // Fetch subscription details
        try {
          const res = await fetch('/api/premium/subscription');
          if (res.ok) {
            const subData = await res.json();
            if (subData.subscribed && subData.nextBillingDate) {
              setNextBilling(
                new Date(subData.nextBillingDate).toLocaleDateString('es-AR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }),
              );
            }
          }
        } catch {
          // Silently fail — subscription info is non-critical
        }
      }

      setAuthLoading(false);
    }).catch(() => {
      setAuthLoading(false);
    });
  }, [supabase]);

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
      {alreadyPremium ? (
        <div className="mb-8 rounded-2xl border border-cinema-gold/30 bg-cinema-gold/10 p-6 text-center">
          <Crown className="mx-auto mb-2 size-10 text-cinema-gold" />
          <h2 className="text-xl font-bold text-white">Ya sos Premium</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Disfrutá de todas las funcionalidades exclusivas de FilmVerse Premium.
          </p>
          {nextBilling && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-cinema-gold/80">
              <Calendar className="size-4" />
              <span>Próxima facturación: {nextBilling}</span>
            </div>
          )}
          <Link
            href="/dashboard"
            className="mt-4 inline-block rounded-lg bg-cinema-gold px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-cinema-amber"
          >
            Ir al Dashboard
          </Link>
        </div>
      ) : (
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

            {SUBSCRIPTION_URL ? (
              <a
                href={SUBSCRIPTION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg bg-cinema-gold px-6 py-3 text-base font-semibold text-black transition-colors hover:bg-cinema-amber text-center"
              >
                Suscribirse
              </a>
            ) : (
              <p className="text-sm text-red-400">
                El enlace de suscripción no está configurado.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
