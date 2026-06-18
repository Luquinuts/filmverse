/**
 * mock-tmdb — Datos de películas falsos para desarrollo sin API key de TMDB.
 *
 * Cuando no hay TMDB_API_KEY ni TMDB_API_TOKEN configurados,
 * el TmdbClient devuelve estos datos mock para que la app sea usable.
 */

import type { MovieSearchResult, MovieDetail } from '@/lib/types';

// ─── Películas mock ───

const MOCK_MOVIES: MovieSearchResult[] = [
  {
    id: 1,
    title: 'El Padrino',
    overview:
      'Don Vito Corleone es el jefe de una de las cinco familias de la mafia de Nueva York. Su hija se casa y la celebración reúne a lo más selecto del hampa.',
    poster_path: '/r4r0M5CwwBx76VjBgRqkpLx3RYr.jpg',
    backdrop_path: '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    release_date: '1972-03-24',
    vote_average: 8.7,
    vote_count: 19843,
    genre_ids: [18, 80],
    original_language: 'en',
  },
  {
    id: 2,
    title: 'Interestelar',
    overview:
      'Un grupo de exploradores viaja a través de un agujero de gusano en el espacio exterior en un intento de garantizar la supervivencia de la humanidad.',
    poster_path: '/nCbkOyOMTEonEVlZ8YbTXM5eS1o.jpg',
    backdrop_path: '/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
    release_date: '2014-11-06',
    vote_average: 8.4,
    vote_count: 34038,
    genre_ids: [12, 18, 878],
    original_language: 'en',
  },
  {
    id: 3,
    title: 'Pulp Fiction',
    overview:
      'Las vidas de dos asesinos a sueldo, un boxeador, la esposa de un gánster y un par de delincuentes se entrelazan en cuatro historias de violencia y redención.',
    poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    backdrop_path: '/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
    release_date: '1994-09-10',
    vote_average: 8.5,
    vote_count: 26618,
    genre_ids: [53, 80],
    original_language: 'en',
  },
  {
    id: 4,
    title: 'El Señor de los Anillos: La Comunidad del Anillo',
    overview:
      'Un hobbit llamado Frodo hereda el Anillo Único y debe emprender un peligroso viaje para destruirlo antes de que caiga en manos del Señor Oscuro Sauron.',
    poster_path: '/8bXyLRgqt2C3Bx0EPwN5M1FeI7G.jpg',
    backdrop_path: '/vRQnzOn4HjIMX4LBq9bR66Cpp1X.jpg',
    release_date: '2001-12-19',
    vote_average: 8.4,
    vote_count: 24561,
    genre_ids: [12, 14, 28],
    original_language: 'en',
  },
  {
    id: 5,
    title: 'Parásitos',
    overview:
      'Una familia pobre se infiltra en la vida de una familia rica, pero los secretos y las mentiras amenazan con destruir todo.',
    poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdrop_path: '/hiUmMnCkU0HRqMV2YY6PqXIRlR.jpg',
    release_date: '2019-05-30',
    vote_average: 8.5,
    vote_count: 17207,
    genre_ids: [35, 18, 53],
    original_language: 'ko',
  },
  {
    id: 6,
    title: 'Matrix',
    overview:
      'Un programador descubre que la realidad que conoce es una simulación creada por máquinas inteligentes. Se une a un grupo de rebeldes para liberar a la humanidad.',
    poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    backdrop_path: '/fNG7i7RqMgrkc1E0oBxU8JafHvx.jpg',
    release_date: '1999-03-31',
    vote_average: 8.2,
    vote_count: 24864,
    genre_ids: [28, 878],
    original_language: 'en',
  },
  {
    id: 7,
    title: 'Forrest Gump',
    overview:
      'Un hombre con un coeficiente intelectual bajo pero un gran corazón vive algunas de las décadas más importantes de la historia de Estados Unidos.',
    poster_path: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    backdrop_path: '/3h1JZGDhZvF2J0E8Kp6UJIEfmA.jpg',
    release_date: '1994-07-06',
    vote_average: 8.5,
    vote_count: 26295,
    genre_ids: [35, 18, 10749],
    original_language: 'en',
  },
  {
    id: 8,
    title: 'El Caballero de la Noche',
    overview:
      'Batman asume la responsabilidad de proteger Gotham City del caos mientras el Joker emerge sembrando el terror.',
    poster_path: '/eeJ0dR4VRAbgVo9HtHpBysTKX2.jpg',
    backdrop_path: '/nMKdUUepR0i5zn0y1T4CsSB5ez.jpg',
    release_date: '2008-07-18',
    vote_average: 8.5,
    vote_count: 31743,
    genre_ids: [28, 80, 18],
    original_language: 'en',
  },
  {
    id: 9,
    title: 'Volver al Futuro',
    overview:
      'Un adolescente viaja accidentalmente al pasado en un DeLorean modificado por su amigo científico y debe asegurarse de que sus padres se enamoren.',
    poster_path: '/7lyqKpBRlCE5fj7k7t3BXSBhGJ4.jpg',
    backdrop_path: '/5Bwq4wXc3U6sXsftYcB4JX7y6b.jpg',
    release_date: '1985-07-03',
    vote_average: 8.3,
    vote_count: 19281,
    genre_ids: [12, 35, 878],
    original_language: 'en',
  },
  {
    id: 10,
    title: 'Inception',
    overview:
      'Un ladrón especializado en robar secretos del subconsciente recibe la misión de implantar una idea en la mente de una persona.',
    poster_path: '/oU7Oq2kFAAlGqb3V2Vt1WmI1MkF.jpg',
    backdrop_path: '/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    release_date: '2010-07-16',
    vote_average: 8.4,
    vote_count: 35670,
    genre_ids: [28, 878, 12],
    original_language: 'en',
  },
];

// ─── Detalles extendidos ───

const MOCK_DETAILS: Record<number, Partial<MovieDetail>> = {
  1: {
    genres: [
      { id: 18, name: 'Drama' },
      { id: 80, name: 'Crimen' },
    ],
    runtime: 175,
    tagline: 'Una oferta que no podrás rechazar.',
    budget: 6000000,
    revenue: 250341816,
    status: 'Released',
    credits: {
      cast: [
        {
          id: 101,
          name: 'Marlon Brando',
          character: 'Don Vito Corleone',
          profile_path: '/fuTEPMsWdVumWYRAm8sN5D8S8s.jpg',
          order: 0,
        },
        {
          id: 102,
          name: 'Al Pacino',
          character: 'Michael Corleone',
          profile_path: '/fMDFeVf0pjopv6b3CdP3mgsXqEL.jpg',
          order: 1,
        },
        {
          id: 103,
          name: 'James Caan',
          character: 'Sonny Corleone',
          profile_path: '/tYDiO1oQsmFoC1FAOxNIMdIJlKy.jpg',
          order: 2,
        },
        {
          id: 104,
          name: 'Robert Duvall',
          character: 'Tom Hagen',
          profile_path: '/3XKm6C7Bc5YxxWY3QLWrJfjM6Jv.jpg',
          order: 3,
        },
        {
          id: 105,
          name: 'Diane Keaton',
          character: 'Kay Adams',
          profile_path: '/7Eds5KjMmmq7fJ7bNMG6CM9NYZm.jpg',
          order: 4,
        },
      ],
      crew: [],
    },
  },
  2: {
    genres: [
      { id: 12, name: 'Aventura' },
      { id: 18, name: 'Drama' },
      { id: 878, name: 'Ciencia ficción' },
    ],
    runtime: 169,
    tagline: 'El viaje más importante de la humanidad acaba de comenzar.',
    budget: 165000000,
    revenue: 773709074,
    status: 'Released',
    credits: {
      cast: [
        {
          id: 201,
          name: 'Matthew McConaughey',
          character: 'Joseph Cooper',
          profile_path: '/uN1q3BXR5CxPhRmEZMBJ3q7QNEt.jpg',
          order: 0,
        },
        {
          id: 202,
          name: 'Anne Hathaway',
          character: 'Dr. Amelia Brand',
          profile_path: '/4t6sYEns73WvVXm0Fe1XGT3GurT.jpg',
          order: 1,
        },
        {
          id: 203,
          name: 'Jessica Chastain',
          character: 'Murphy Cooper',
          profile_path: '/v5V6p5KLjKSs4I9wY7HCMFKSp8p.jpg',
          order: 2,
        },
        {
          id: 204,
          name: 'Michael Caine',
          character: 'Profesor Brand',
          profile_path: '/bGZn5RVzMMXjhLEFOdFhpxpYH3.jpg',
          order: 3,
        },
      ],
      crew: [],
    },
  },
  3: {
    genres: [
      { id: 53, name: 'Suspenso' },
      { id: 80, name: 'Crimen' },
    ],
    runtime: 154,
    tagline: 'Ningún argumento es tan violento como la realidad.',
    budget: 8000000,
    revenue: 213928762,
    status: 'Released',
    credits: {
      cast: [
        {
          id: 301,
          name: 'John Travolta',
          character: 'Vincent Vega',
          profile_path: '/nsjN1h9kHn7MnsnJ14GQkqZqXZ.jpg',
          order: 0,
        },
        {
          id: 302,
          name: 'Samuel L. Jackson',
          character: 'Jules Winnfield',
          profile_path: '/nCJJ3NV1WkE6S5fVx3JnKPvW4K.jpg',
          order: 1,
        },
        {
          id: 303,
          name: 'Uma Thurman',
          character: 'Mia Wallace',
          profile_path: '/gM4HSY6T1z4C3o0Uj6yXHDZbWZ.jpg',
          order: 2,
        },
        {
          id: 304,
          name: 'Bruce Willis',
          character: 'Butch Coolidge',
          profile_path: '/kJkxSzv3K5C1FOG2Rmvj2UmHef.jpg',
          order: 3,
        },
      ],
      crew: [],
    },
  },
  4: {
    genres: [
      { id: 12, name: 'Aventura' },
      { id: 14, name: 'Fantasía' },
      { id: 28, name: 'Acción' },
    ],
    runtime: 178,
    tagline: 'Un anillo para gobernarlos a todos.',
    budget: 93000000,
    revenue: 880316237,
    status: 'Released',
    credits: {
      cast: [
        {
          id: 401,
          name: 'Elijah Wood',
          character: 'Frodo Bolsón',
          profile_path: '/4T0YNAld6Tx02Tu0hSR3SKOxXy.jpg',
          order: 0,
        },
        {
          id: 402,
          name: 'Ian McKellen',
          character: 'Gandalf',
          profile_path: '/c0QkQrN6IMB5sM1Q7UZ9q3C7kN.jpg',
          order: 1,
        },
        {
          id: 403,
          name: 'Viggo Mortensen',
          character: 'Aragorn',
          profile_path: '/lLJ7xN5YqW2HysMqFWW7XfGHgJ.jpg',
          order: 2,
        },
        {
          id: 404,
          name: 'Orlando Bloom',
          character: 'Legolas',
          profile_path: '/5p6XvoGcxPqHKLY1RAH0CjWgR2.jpg',
          order: 3,
        },
      ],
      crew: [],
    },
  },
  6: {
    genres: [
      { id: 28, name: 'Acción' },
      { id: 878, name: 'Ciencia ficción' },
    ],
    runtime: 136,
    tagline: 'Bienvenido al mundo real.',
    budget: 63000000,
    revenue: 467611289,
    status: 'Released',
    credits: {
      cast: [
        {
          id: 601,
          name: 'Keanu Reeves',
          character: 'Neo',
          profile_path: '/cEIZlUQ2lP9tPMhYgPd3fFmO7K.jpg',
          order: 0,
        },
        {
          id: 602,
          name: 'Laurence Fishburne',
          character: 'Morpheus',
          profile_path: '/mhGj1qyP0GzJ7k4OcX9q3C7kN.jpg',
          order: 1,
        },
        {
          id: 603,
          name: 'Carrie-Anne Moss',
          character: 'Trinity',
          profile_path: '/k8zXr7MqY1pBq1ZQ9q3C7kN.jpg',
          order: 2,
        },
        {
          id: 604,
          name: 'Hugo Weaving',
          character: 'Agente Smith',
          profile_path: '/3YzY2QlP9tPMhYgPd3fFmO7K.jpg',
          order: 3,
        },
      ],
      crew: [],
    },
  },
};

// ─── Helpers ───

export function isMockTmdb(): boolean {
  return !process.env.TMDB_API_KEY && !process.env.TMDB_API_TOKEN;
}

/** Devuelve películas mock en el formato de trending/search */
export function getMockMovies(): MovieSearchResult[] {
  return MOCK_MOVIES;
}

/** Busca entre las películas mock */
export function searchMockMovies(query: string): MovieSearchResult[] {
  const q = query.toLowerCase();
  return MOCK_MOVIES.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      m.overview.toLowerCase().includes(q),
  );
}

/** Devuelve detalle mock de una película */
export function getMockMovieDetail(tmdbId: number): MovieDetail | null {
  const movie = MOCK_MOVIES.find((m) => m.id === tmdbId);
  if (!movie) return null;

  const detail = MOCK_DETAILS[tmdbId] ?? {
    genres: [],
    runtime: 120,
    tagline: null,
    budget: 0,
    revenue: 0,
    status: 'Released',
    credits: { cast: [], crew: [] },
  };

  return {
    ...movie,
    genres: detail.genres ?? [],
    runtime: detail.runtime ?? 120,
    tagline: detail.tagline ?? null,
    budget: detail.budget ?? 0,
    revenue: detail.revenue ?? 0,
    status: detail.status ?? 'Released',
    credits: detail.credits ?? { cast: [], crew: [] },
  };
}

/** Devuelve películas similares mock */
export function getMockSimilarMovies(tmdbId: number): MovieSearchResult[] {
  return MOCK_MOVIES.filter(
    (m) => m.id !== tmdbId,
  ).slice(0, 6);
}
