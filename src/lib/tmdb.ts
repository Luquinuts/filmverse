// ─────────────────────────────────────────────
// FilmVerse — TMDB API Client
// ─────────────────────────────────────────────

import type {
  MovieSearchResult,
  MovieDetail,
  Credits,
} from '@/lib/types';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Errores específicos de la API de TMDB.
 */
export class TmdbApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = 'TmdbApiError';
  }
}

/**
 * Cliente para la API de The Movie Database (TMDB) v3.
 * Usa la API key o el token de acceso desde las variables de entorno.
 */
export class TmdbClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly apiToken: string;

  constructor() {
    this.baseUrl = TMDB_BASE_URL;
    this.apiKey = process.env.TMDB_API_KEY ?? '';
    this.apiToken = process.env.TMDB_API_TOKEN ?? '';

    if (!this.apiKey && !this.apiToken) {
      console.warn(
        '[TMDB] No se configuró TMDB_API_KEY ni TMDB_API_TOKEN. ' +
          'Las llamadas a la API fallarán.',
      );
    }
  }

  /**
   * Autenticación — usa el token de acceso si está disponible,
   * sino cae en la API key.
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      accept: 'application/json',
    };

    if (this.apiToken) {
      headers['Authorization'] = `Bearer ${this.apiToken}`;
    }

    return headers;
  }

  private getAuthQuery(): string {
    if (!this.apiToken && this.apiKey) {
      return `?api_key=${this.apiKey}`;
    }
    return '';
  }

  /**
   * Ejecuta una request a la API de TMDB y parsea la respuesta.
   */
  private async fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
    const query = path.includes('?') ? '' : this.getAuthQuery();
    const url = `${this.baseUrl}${path}${query}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new TmdbApiError(
        `TMDB API error: ${response.statusText}`,
        response.status,
      );
    }

    return response.json() as Promise<T>;
  }

  /**
   * Busca películas por término de búsqueda.
   */
  async searchMovies(query: string): Promise<MovieSearchResult[]> {
    const data = await this.fetchJson<{ results: MovieSearchResult[] }>(
      `/search/movie?query=${encodeURIComponent(query)}&language=es-ES&page=1`,
    );
    return data.results;
  }

  /**
   * Obtiene el detalle completo de una película por su ID de TMDB.
   */
  async getMovieDetail(tmdbId: number): Promise<MovieDetail> {
    return this.fetchJson<MovieDetail>(
      `/movie/${tmdbId}?language=es-ES&append_to_response=credits`,
    );
  }

  /**
   * Obtiene las películas en tendencia del día.
   */
  async getTrending(): Promise<MovieSearchResult[]> {
    const data = await this.fetchJson<{ results: MovieSearchResult[] }>(
      '/trending/movie/day?language=es-ES',
    );
    return data.results;
  }

  /**
   * Obtiene el reparto y equipo técnico de una película.
   */
  async getMovieCredits(tmdbId: number): Promise<Credits> {
    return this.fetchJson<Credits>(
      `/movie/${tmdbId}/credits?language=es-ES`,
    );
  }
}
