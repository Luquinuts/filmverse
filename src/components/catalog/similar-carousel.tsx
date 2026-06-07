import type { MovieSearchResult } from '@/lib/types';
import { MovieCard } from '@/components/catalog/movie-card';

interface SimilarCarouselProps {
  movies: MovieSearchResult[];
}

export function SimilarCarousel({ movies }: SimilarCarouselProps) {
  if (movies.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-white">Películas similares</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="min-w-[160px] max-w-[160px] flex-shrink-0 snap-start"
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}
