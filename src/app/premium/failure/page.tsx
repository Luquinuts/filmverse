'use client';

import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PremiumFailurePage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-4">
      <div className="glass rounded-2xl p-10 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-500/20">
          <XCircle className="size-10 text-red-400" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-white">
          El pago no pudo completarse
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Ocurrió un problema al procesar el pago. Podés intentarlo de nuevo cuando quieras.
        </p>
        <Link
          href="/premium"
          className="inline-block rounded-lg bg-cinema-gold px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-cinema-amber"
        >
          Intentar de nuevo
        </Link>
      </div>
    </div>
  );
}
