import { NextRequest, NextResponse } from 'next/server';
import { sendMessage, type ChatMessage, type ChatContext } from '@/lib/gemini';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getDailyUsage, incrementDailyUsage } from '@/lib/supabase/store';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      message: string;
      history?: ChatMessage[];
      context?: ChatContext;
    };

    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { error: 'Se requiere un mensaje' },
        { status: 400 },
      );
    }

    // Verificar límite diario
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 },
      );
    }

    const { used, limit } = await getDailyUsage(supabase, user.id, 'ai_chat');

    if (used >= limit) {
      return NextResponse.json(
        { error: `Límite diario alcanzado (${limit} consultas/día). Actualizá a Premium para consultas ilimitadas.` },
        { status: 429 },
      );
    }

    const response = await sendMessage(
      body.message.trim(),
      body.history ?? [],
      body.context,
    );

    // Incrementar contador (solo si la respuesta fue exitosa)
    const adminClient = createAdminClient();
    await incrementDailyUsage(adminClient, user.id, 'ai_chat');

    return NextResponse.json({ response });
  } catch (error) {
    console.error('[API /ai/chat]', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}

/**
 * GET /api/ai/chat — endpoint de diagnóstico para verificar
 * que la API key de Gemini está configurada.
 */
export async function GET() {
  const hasKey = !!process.env.GEMINI_API_KEY;
  return NextResponse.json({
    configured: hasKey,
    hint: hasKey
      ? '✅ GEMINI_API_KEY está configurada'
      : '❌ GEMINI_API_KEY no está configurada. Agregala en Vercel > Settings > Environment Variables',
  });
}
