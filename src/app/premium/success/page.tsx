'use client';

import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PremiumSuccessPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-4">
      <div className="glass rounded-2xl p-10 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-500/20">
          <CheckCircle className="size-10 text-green-400" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-white">
          ¡Suscripción exitosa!
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Ya forms parte de FilmVerse Premium. Disfrutá de todas las funcionalidades exclusivas.
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
