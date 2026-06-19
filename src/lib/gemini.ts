/**
 * FilmIntelligence — Cliente para la API de Google Gemini.
 *
 * Se usa exclusivamente del lado del servidor (Route Handlers).
 * Si no hay API key configurada, devuelve un mensaje de error amigable.
 */

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `
Sos FilmIntelligence, un asistente de IA especializado en cine, parte de la plataforma FilmVerse.
Tus funciones principales:

1. RECOMENDAR películas basadas en gustos, géneros, directores o películas similares.
2. RESPONDER preguntas sobre películas (sinopsis, reparto, datos curiosos, etc.).
3. AYUDAR a los usuarios a descubrir contenido en FilmVerse.
4. MANTENER un tono amable, cercano y entusiasta del cine. Usá español rioplatense (argentino).
5. SER CONCISO — respuestas de 2-3 párrafos como máximo, salvo que el usuario pida más detalle.
6. NO inventar datos falsos. Si no sabés algo, decilo.
7. NO mencionar que sos una IA o que estás usando Gemini. Actuá como un experto en cine.

Cuando recomiendes películas, mencioná el título y una razón breve.
`.trim();

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ChatContext {
  filmTitle?: string;
  filmYear?: number;
  username?: string;
}

/**
 * Envía un mensaje a Gemini y devuelve la respuesta.
 * Si no hay API key, devuelve un mensaje de error amigable.
 */
export async function sendMessage(
  message: string,
  history: ChatMessage[],
  context?: ChatContext,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return '🔌 FilmIntelligence no está conectado. Configurá GEMINI_API_KEY en el panel de Vercel o en .env.local para activarme.';
  }

  // Construir el context para el prompt
  let contextBlock = '';
  if (context?.username) {
    contextBlock += `El usuario se llama ${context.username}. `;
  }
  if (context?.filmTitle) {
    contextBlock += `Está viendo "${context.filmTitle}" (${context.filmYear ?? 'año desconocido'}). `;
  }

  // Convertir historial al formato de Gemini
  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [
    {
      role: 'user',
      parts: [{ text: `[System] ${SYSTEM_PROMPT}\n\n[Context] ${contextBlock}` }],
    },
    {
      role: 'model',
      parts: [
        {
          text: 'Entendido. Soy FilmIntelligence, el asistente de cine de FilmVerse. ¡Mandame cualquier consulta!',
        },
      ],
    },
    ...history.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ];

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[FilmIntelligence] Gemini API error:', response.status, errorText);
      return 'Ups, hubo un problema al consultar a FilmIntelligence. Intentá de nuevo en un momento.';
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text ?? 'No entendí bien la consulta. ¿Podés reformularla?';
  } catch (error) {
    console.error('[FilmIntelligence] Network error:', error);
    return 'Ups, hubo un error de conexión. Revisá tu conexión a internet e intentá de nuevo.';
  }
}
