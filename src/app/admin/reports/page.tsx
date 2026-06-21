'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Flag, Shield, ArrowLeft, Trash2, X, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { ReportWithReview } from '@/lib/types';

export default function AdminReportsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [reports, setReports] = useState<ReportWithReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/login?redirect=/admin/reports');
        return;
      }

      try {
        const res = await fetch('/api/admin/reports');
        if (res.status === 403) {
          setError('No tenés permisos de administrador.');
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error('Error al cargar reportes');

        const data = await res.json();
        setReports(data.reports ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    });
  }, [router, supabase.auth]);

  const handleAction = async (reportId: string, action: 'dismiss' | 'delete', reviewId?: string) => {
    setActionLoading(reportId);
    try {
      const res = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, action, reviewId }),
      });

      if (!res.ok) throw new Error('Error al procesar');

      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (err) {
      console.error('[admin]', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="animate-shimmer space-y-4">
          <div className="h-8 w-48 rounded bg-glass-bg" />
          <div className="h-64 w-full rounded-2xl bg-glass-bg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="glass rounded-2xl p-8 text-center">
          <Shield className="mx-auto mb-4 size-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">{error}</p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block text-sm text-cinema-gold hover:text-cinema-amber transition-colors"
          >
            Volver al dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/dashboard"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-cinema-gold"
      >
        <ArrowLeft className="size-4" />
        Volver al Dashboard
      </Link>

      <div className="mb-6 flex items-center gap-3">
        <Shield className="size-6 text-cinema-gold" />
        <div>
          <h1 className="text-2xl font-bold text-white">Reportes pendientes</h1>
          <p className="text-sm text-muted-foreground">
            {reports.length} reporte{reports.length !== 1 ? 's' : ''} sin revisar
          </p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <Flag className="mx-auto mb-4 size-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">No hay reportes pendientes.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="glass rounded-2xl p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-red-400">
                      Reportado
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(report.created_at).toLocaleString('es-AR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-white">
                    Motivo: {report.reason}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => handleAction(report.id, 'dismiss')}
                    disabled={actionLoading === report.id}
                    className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-white disabled:opacity-40"
                  >
                    <X className="size-3.5" />
                    Desestimar
                  </button>
                  <button
                    onClick={() => handleAction(report.id, 'delete', report.review_id)}
                    disabled={actionLoading === report.id}
                    className="flex items-center gap-1 rounded-lg bg-red-500/20 px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/30 disabled:opacity-40"
                  >
                    <Trash2 className="size-3.5" />
                    Eliminar reseña
                  </button>
                </div>
              </div>

              {/* Review preview */}
              <div className="rounded-xl bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Star className="size-3.5 fill-cinema-gold text-cinema-gold" />
                  <span className="text-xs text-cinema-gold/70">
                    {report.reviews.rating}/10
                  </span>
                  <span className="text-xs text-muted-foreground">
                    en {report.reviews.film_title}
                    {report.reviews.film_year && ` (${report.reviews.film_year})`}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {report.reviews.content || (
                    <span className="italic opacity-50">Sin contenido</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
