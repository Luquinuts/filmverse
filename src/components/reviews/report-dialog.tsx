'use client';

import { useState } from 'react';
import { Flag } from 'lucide-react';

interface ReportDialogProps {
  reviewId: string;
  onClose: () => void;
}

export function ReportDialog({ reviewId: _reviewId, onClose }: ReportDialogProps) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId: _reviewId, reason: reason.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Error al enviar reporte');
      }

      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
        <div
          className="mx-4 w-full max-w-sm rounded-2xl bg-card p-6 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="mb-4 text-sm text-muted-foreground">
            Gracias por tu reporte. El equipo lo va a revisar.
          </p>
          <button
            onClick={onClose}
            className="rounded-lg bg-cinema-gold px-5 py-2 text-sm font-semibold text-black"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="mx-4 w-full max-w-sm rounded-2xl bg-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-2">
          <Flag className="size-5 text-red-400" />
          <h3 className="font-semibold text-white">Reportar reseña</h3>
        </div>

        {error && (
          <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="¿Por qué reportás esta reseña? (spam, hate, discriminación, etc.)"
          rows={4}
          className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:border-cinema-gold/50 focus:outline-none"
        />

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={submitting || !reason.trim()}
            className="rounded-lg bg-red-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? 'Enviando…' : 'Reportar'}
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 px-5 py-2 text-sm text-muted-foreground transition-colors hover:text-white"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
