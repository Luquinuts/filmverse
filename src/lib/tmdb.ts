// ─────────────────────────────────────────────
// FilmVerse — TMDB API Client
// ─────────────────────────────────────────────

import type {
  MovieSearchResult,
  MovieDetail,
  Credits,
} from '@/lib/types';
import {
  isMockTmdb,
  getMockMovies,
  searchMockMovies,
  getMockMovieDetail,
  getMockSimilarMovies,
} from '@/lib/mock-tmdb';

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
 * Si no hay API key configurada, usa datos mock para desarrollo.
 */
export class TmdbClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly apiToken: string;
  private readonly mock: boolean;

  constructor() {
    this.baseUrl = TMDB_BASE_URL;
    this.apiKey = process.env.TMDB_API_KEY ?? '';
    this.apiToken = process.env.TMDB_API_TOKEN ?? '';
    this.mock = isMockTmdb();

    if (this.mock && typeof window !== 'undefined') {
      console.info(
        '🎬 TMDB no configurado — usando datos mock. 10 películas clásicas disponibles.',
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
    if (this.mock) return searchMockMovies(query);
    const data = await this.fetchJson<{ results: MovieSearchResult[] }>(
      `/search/movie?query=${encodeURIComponent(query)}&language=es-ES&page=1`,
    );
    return data.results;
  }

  /**
   * Obtiene el detalle completo de una película por su ID de TMDB.
   */
  async getMovieDetail(tmdbId: number): Promise<MovieDetail> {
    const mockDetail = getMockMovieDetail(tmdbId);
    if (this.mock) {
      if (!mockDetail) throw new TmdbApiError('Película no encontrada', 404);
      return mockDetail;
    }
    return this.fetchJson<MovieDetail>(
      `/movie/${tmdbId}?language=es-ES&append_to_response=credits`,
    );
  }

  /**
   * Obtiene las películas en tendencia del día.
   */
  async getTrending(): Promise<MovieSearchResult[]> {
    if (this.mock) return getMockMovies();
    const data = await this.fetchJson<{ results: MovieSearchResult[] }>(
      '/trending/movie/day?language=es-ES',
    );
    return data.results;
  }

  /**
   * Obtiene el reparto y equipo técnico de una película.
   */
  async getMovieCredits(tmdbId: number): Promise<Credits> {
    if (this.mock) {
      const detail = getMockMovieDetail(tmdbId);
      return detail?.credits ?? { cast: [], crew: [] };
    }
    return this.fetchJson<Credits>(
      `/movie/${tmdbId}/credits?language=es-ES`,
    );
  }

  /**
   * Obtiene películas similares a una película por su ID de TMDB.
   */
  async getSimilarMovies(tmdbId: number): Promise<MovieSearchResult[]> {
    if (this.mock) return getMockSimilarMovies(tmdbId);
    const data = await this.fetchJson<{ results: MovieSearchResult[] }>(
      `/movie/${tmdbId}/similar?language=es-ES&page=1`,
    );
    return data.results;
  }
}
