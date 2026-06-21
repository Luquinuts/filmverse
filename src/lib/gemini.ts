/**
 * FilmIntelligence — Cliente para la API de Google Gemini.
 *
 * Se usa exclusivamente del lado del servidor (Route Handlers).
 */

import type { Recommendation } from '@/lib/types';
import { TmdbClient } from '@/lib/tmdb';

// ─── Tipos locales para getRecommendations ───
// Compatibles con ReviewRow y WatchlistRow de @/lib/types
// (los nombres camelCase mapean a snake_case de Supabase)

interface GeminiReview {
  filmTitle: string;
  filmYear: number | null;
  filmPoster?: string | null;
  rating: number;
  content: string;
}

interface GeminiWatchlistEntry {
  filmTitle: string;
  filmYear: number | null;
  filmPoster?: string | null;
}

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

export async function getRecommendations(
  reviews: GeminiReview[],
  watchlist: GeminiWatchlistEntry[],
): Promise<Recommendation[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('[getRecommendations] GEMINI_API_KEY no configurada');
    return [];
  }

  // Construir contexto con reseñas + watchlist
  const reviewsContext = reviews
    .map(
      (r) =>
        `- "${r.filmTitle}" (${r.filmYear ?? 'año desconocido'}) — puntuación: ${r.rating}/10 — reseña: "${r.content.slice(0, 300)}"`,
    )
    .join('\n');

  const watchlistContext = watchlist
    .map((w) => `- "${w.filmTitle}" (${w.filmYear ?? 'año desconocido'})`)
    .join('\n');

  const prompt = `Analizá estas reseñas y watchlist de un usuario de cine, y recomendale películas que le puedan gustar.

RESEÑAS DEL USUARIO:
${reviewsContext || '(ninguna)'}

WATCHLIST:
${watchlistContext || '(vacía)'}

INSTRUCCIONES:
- Recomendá películas reales, variadas y conocidas.
- NO incluyas películas que el usuario ya reseñó o tiene en watchlist.
- Devolvé únicamente un JSON array. Cada objeto debe tener: "title", "reason", "matchPercentage".
- "reason": explicación breve en español rioplatense (1 oración).
- "matchPercentage": número del 1 al 100.
- Ejemplo: [{"title":"The Matrix","reason":"Te gustaron las de ciencia ficción","matchPercentage":85}]
- Devolvé entre 1 y 5 recomendaciones.
- No incluyas NADA fuera del JSON. No expliques, no saludes, solo el JSON.`;

  const requestBody = {
    system_instruction: {
      parts: [
        {
          text: 'Eres un experto en cine. Respondes exclusivamente con JSON válido, sin texto adicional ni explicaciones.',
        },
      ],
    },
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generation_config: {
      temperature: 0.5,
      max_output_tokens: 8192,
    },
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[getRecommendations] Gemini error:', response.status, errorText);
      return [];
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
        finishReason?: string;
      }>;
    };

    console.log('[getRecommendations] Finish reason:', data.candidates?.[0]?.finishReason);

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('[getRecommendations] Raw:', text);

    if (!text) {
      console.warn('[getRecommendations] Empty response');
      return [];
    }

    // Strip markdown code block wrapping if present (Gemini sometimes returns ```json ... ```)
    const cleaned = text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/, '').trim();

    // Intentar parsear como array directo
    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.warn('[getRecommendations] JSON parse failed on raw text');
      return [];
    }

    // Si es un objeto con una key que contiene un array, extraerlo
    if (!Array.isArray(parsed)) {
      const arrayKey = Object.values(parsed as Record<string, unknown>).find(Array.isArray);
      if (arrayKey) {
        parsed = arrayKey;
      } else {
        console.warn('[getRecommendations] Not an array and no array found in object:', parsed);
        return [];
      }
    }

    const items = parsed as Array<Record<string, unknown>>;
    console.log('[getRecommendations] Count:', items.length);

    // Buscar cada película en TMDB para obtener poster e ID real
    const tmdb = new TmdbClient();

    const recommendations: Recommendation[] = await Promise.all(
      items.map(async (item) => {
        const title = String(item.title ?? '');
        let filmId = typeof item.filmId === 'number' ? item.filmId : 0;
        let posterPath: string | null = null;

        try {
          const results = await tmdb.searchMovies(title);
          if (results.length > 0) {
            filmId = results[0].id;
            posterPath = results[0].poster_path;
          }
        } catch {
          // Si falla la búsqueda, usamos los valores por defecto
        }

        return {
          filmId,
          title,
          reason: String(item.reason ?? ''),
          matchPercentage:
            typeof item.matchPercentage === 'number'
              ? Math.min(100, Math.max(0, Math.round(item.matchPercentage)))
              : undefined,
          posterPath,
        };
      }),
    );

    return recommendations;
  } catch (error) {
    console.error('[getRecommendations] Error:', error);
    return [];
  }
}
