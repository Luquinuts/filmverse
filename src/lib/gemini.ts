/**
 * FilmIntelligence — Cliente para la API de Google Gemini.
 *
 * Se usa exclusivamente del lado del servidor (Route Handlers).
 */

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const SYSTEM_PROMPT = `Sos FilmIntelligence, un asistente de IA especializado en cine, parte de la plataforma FilmVerse.

REGLAS:
- Recomendá películas basadas en gustos, géneros, directores o películas similares.
- Respondé preguntas sobre películas (sinopsis, reparto, datos curiosos).
- Ayudá a los usuarios a descubrir contenido en FilmVerse.
- Usá español rioplatense (argentino), tono amable y entusiasta.
- Sé conciso: 2-3 párrafos como máximo, salvo que pidan más detalle.
- NO inventes datos falsos. Si no sabés algo, decilo directamente.
- NO menciones que sos una IA. Actuá como un experto en cine.
- Cuando recomiendes, mencioná el título y una razón breve.`;

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ChatContext {
  filmTitle?: string;
  filmYear?: number;
  username?: string;
}

export async function sendMessage(
  message: string,
  history: ChatMessage[],
  context?: ChatContext,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return '🔌 FilmIntelligence no está conectado. Configurá GEMINI_API_KEY en el panel de Vercel o en .env.local para activarme.';
  }

  // Contexto adicional
  let contextBlock = '';
  if (context?.username) {
    contextBlock += `El usuario se llama ${context.username}. `;
  }
  if (context?.filmTitle) {
    contextBlock += `Está viendo "${context.filmTitle}" (${context.filmYear ?? 'año desconocido'}). `;
  }

  // Historial de la conversación
  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [
    ...history.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    })),
    {
      role: 'user',
      parts: [
        {
          text: contextBlock
            ? `[Contexto: ${contextBlock}]\n\n${message}`
            : message,
        },
      ],
    },
  ];

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents,
        generation_config: {
          temperature: 0.8,
          max_output_tokens: 500,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[FilmIntelligence] Gemini error:', response.status, errorText);
      return `Ups, Gemini respondió con error (${response.status}). Revisá que la API key sea válida y tenga el modelo habilitado.`;
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
        finishReason?: string;
      }>;
    };

    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
      console.warn('[FilmIntelligence] Finish reason:', candidate.finishReason);
    }

    return text ?? 'No entendí bien la consulta. ¿Podés reformularla?';
  } catch (error) {
    console.error('[FilmIntelligence] Network error:', error);
    return 'Ups, hubo un error de conexión. Revisá tu conexión a internet e intentá de nuevo.';
  }
}
