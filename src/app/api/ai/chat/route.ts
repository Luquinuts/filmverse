import { NextRequest, NextResponse } from 'next/server';
import { sendMessage, type ChatMessage, type ChatContext } from '@/lib/gemini';

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

    const response = await sendMessage(
      body.message.trim(),
      body.history ?? [],
      body.context,
    );

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
