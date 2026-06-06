// ─────────────────────────────────────────────
// FilmVerse — Gemini API Client (Stub)
// ─────────────────────────────────────────────

import type { UserContext, Recommendation } from '@/lib/types';

const GEMINI_BASE_URL =
  'https://generativelanguage.googleapis.com/v1beta';

/**
 * Mensaje en una conversación con Gemini.
 */
interface GeminiMessage {
  role: 'user' | 'model';
  content: string;
}

/**
 * Error específico de la API de Gemini.
 */
export class GeminiApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = 'GeminiApiError';
  }
}

/**
 * Sesión de chat con Gemini que mantiene el historial de conversación.
 * Preparada para migrar a streaming cuando se implemente en la UI.
 */
export class ChatSession {
  private history: GeminiMessage[] = [];
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY ?? '';

    if (!this.apiKey) {
      console.warn(
        '[Gemini] No se configuró GEMINI_API_KEY. ' +
          'Las llamadas a la API fallarán.',
      );
    }
  }

  /**
   * Envía un mensaje al modelo y devuelve la respuesta.
   */
  async sendMessage(message: string): Promise<string> {
    this.history.push({ role: 'user', content: message });

    try {
      const response = await fetch(
        `${GEMINI_BASE_URL}/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: this.history.map((msg) => ({
                  text: `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}`,
                })),
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        throw new GeminiApiError(
          `Gemini API error: ${response.statusText}`,
          response.status,
        );
      }

      const data = await response.json();
      const reply: string =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

      this.history.push({ role: 'model', content: reply });
      return reply;
    } catch (error) {
      if (error instanceof GeminiApiError) throw error;
      throw new GeminiApiError(
        `Error de red al llamar a Gemini: ${error}`,
      );
    }
  }

  /**
   * Obtiene una recomendación de película basada en el contexto del usuario.
   */
  async getRecommendation(
    userContext: UserContext,
  ): Promise<Recommendation> {
    const prompt = this.buildRecommendationPrompt(userContext);
    const reply = await this.sendMessage(prompt);

    // Intenta parsear una recomendación estructurada de la respuesta
    return this.parseRecommendation(reply);
  }

  /**
   * Interfaz de streaming — preparada para implementación futura.
   * Devuelve un AsyncGenerator que emitirá tokens a medida que
   * Gemini los genera.
   */
  async *sendMessageStream(
    message: string,
  ): AsyncGenerator<string, void, unknown> {
    this.history.push({ role: 'user', content: message });

    const response = await fetch(
      `${GEMINI_BASE_URL}/models/gemini-pro:streamGenerateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      throw new GeminiApiError(
        `Gemini streaming error: ${response.statusText}`,
        response.status,
      );
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(line.slice(6));
              const text =
                parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) yield text;
            } catch {
              // Ignorar líneas que no se puedan parsear
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Construye el prompt para obtener una recomendación personalizada.
   */
  private buildRecommendationPrompt(context: UserContext): string {
    return (
      `Actúa como un recomendador de cine experto. ` +
      `Basándote en el siguiente perfil de usuario, recomiéndame UNA sola película ` +
      `que creas que le va a encantar. Devuélveme SOLO un objeto JSON con ` +
      `"filmId" (0 si no conoces el ID), "title" y "reason" (en español).\n\n` +
      `Perfil del usuario:\n` +
      `- Géneros vistos: ${context.watchedGenres?.join(', ') ?? 'desconocidos'}\n` +
      `- Películas favoritas: ${context.favoriteFilms?.join(', ') ?? 'desconocidas'}\n` +
      `- Actividad reciente: ${context.recentActivity?.join(', ') ?? 'desconocida'}`
    );
  }

  /**
   * Intenta parsear la respuesta de Gemini como una recomendación estructurada.
   */
  private parseRecommendation(reply: string): Recommendation {
    try {
      // Intenta extraer JSON de la respuesta
      const jsonMatch = reply.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as Recommendation;
      }
    } catch {
      // Si falla el parseo, devuelve una recomendación con la respuesta cruda
    }

    return {
      filmId: 0,
      title: 'Recomendación personalizada',
      reason: reply,
    };
  }

  /**
   * Devuelve el historial de la conversación.
   */
  getHistory(): GeminiMessage[] {
    return [...this.history];
  }
}
