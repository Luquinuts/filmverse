import Image from 'next/image';

interface CastCardProps {
  name: string;
  character: string;
  profilePath: string | null;
}

export function CastCard({ name, character, profilePath }: CastCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {/* Photo */}
      <div className="size-16 overflow-hidden rounded-full border-2 border-white/[6%] transition-all duration-300 hover:ring-2 hover:ring-cinema-gold/30 hover:scale-105">
        {profilePath ? (
          <Image
            src={`https://image.tmdb.org/t/p/w185${profilePath}`}
            alt={name}
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <svg
              className="size-6 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{character}</p>
      </div>
    </div>
  );
}
