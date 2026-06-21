import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPendingReports, dismissReport, isAdmin } from '@/lib/supabase/store';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const admin = await isAdmin(supabase, user.id);
    if (!admin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const reports = await getPendingReports(supabase);
    return NextResponse.json({ reports });
  } catch (error) {
    console.error('[API /admin/reports]', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const admin = await isAdmin(supabase, user.id);
    if (!admin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = (await request.json()) as {
      reportId: string;
      action: 'dismiss' | 'delete';
      reviewId?: string;
    };

    if (!body.reportId || !body.action) {
      return NextResponse.json(
        { error: 'Faltan datos' },
        { status: 400 },
      );
    }

    if (body.action === 'dismiss') {
      await dismissReport(supabase, body.reportId, user.id);
    } else if (body.action === 'delete') {
      if (!body.reviewId) {
        return NextResponse.json(
          { error: 'reviewId requerido para eliminar' },
          { status: 400 },
        );
      }
      const { adminDeleteReview } = await import('@/lib/supabase/store');
      await adminDeleteReview(supabase, body.reviewId, body.reportId, user.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API /admin/reports]', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
