'use client';

import { Clock } from 'lucide-react';
import Link from 'next/link';

export default function PremiumPendingPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-4">
      <div className="glass rounded-2xl p-10 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-yellow-500/20">
          <Clock className="size-10 text-yellow-400" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-white">
          Pago pendiente
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          El pago está siendo procesado. Te notificaremos cuando se confirme la suscripción.
        </p>
        <Link
          href="/dashboard"
          className="inline-block rounded-lg bg-cinema-gold px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-cinema-amber"
        >
          Ir al Dashboard
        </Link>
      </div>
    </div>
  );
}
