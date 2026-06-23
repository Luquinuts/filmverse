'use client';

import { Crown, X } from 'lucide-react';
import Link from 'next/link';

interface PremiumUpsellProps {
  /** Qué funcionalidad estaba usando cuando se topó con el límite */
  feature: 'review' | 'ai_chat';
  onClose?: () => void;
}

const COPY = {
  review: {
    title: 'Límite de reseñas alcanzado',
    description: 'Los usuarios gratuitos pueden escribir hasta 3 reseñas por día.',
  },
  ai_chat: {
    title: 'Límite de FilmIntelligence alcanzado',
    description: 'Los usuarios gratuitos pueden hacer hasta 3 consultas por día a FilmIntelligence.',
  },
} as const;

export function PremiumUpsell({ feature, onClose }: PremiumUpsellProps) {
  const { title, description } = COPY[feature];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center rounded-2xl border border-white/10 bg-card p-8 text-center shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Cerrar"
        >
          <X className="size-5" />
        </button>

        {/* Crown */}
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-cinema-gold to-cinema-amber shadow-lg shadow-cinema-gold/30">
          <Crown className="size-7 text-black" />
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>

        {/* Description */}
        <p className="mb-1 text-sm text-muted-foreground">{description}</p>
        <p className="mb-6 text-xs text-muted-foreground">
          Actualizá a Premium para acceder sin límites.
        </p>

        {/* CTA */}
        <Link
          href="/premium"
          onClick={onClose}
          className="w-full rounded-xl bg-gradient-to-r from-cinema-gold to-cinema-amber py-3 text-center text-sm font-bold text-black transition-all hover:opacity-90"
        >
          Ver planes Premium
        </Link>
      </div>
    </div>
  );
}
