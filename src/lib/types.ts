// ─────────────────────────────────────────────
// FilmVerse — Tipos de Dominio y Base de Datos
// ─────────────────────────────────────────────

// ─── Enums como tipos literales ───

export type UserRole = 'cinefilo' | 'premium' | 'moderador' | 'admin';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';
export type ReportReason =
  | 'spam'
  | 'inappropriate'
  | 'harassment'
  | 'fake_review'
  | 'other';
export type LikeTargetType = 'review' | 'list';

// ─── Interfaces de Dominio ───

export interface User {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Film {
  id: number;
  tmdb_id: number;
  title: string;
  overview: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string | null;
  vote_average: number | null;
  vote_count: number | null;
  genres: string[] | null;
  runtime: number | null;
  original_language: string | null;
  created_at: string;
  updated_at: string;
}

export interface WatchedFilm {
  id: number;
  user_id: string;
  film_id: number;
  watched_at: string;
}

export interface WatchlistFilm {
  id: number;
  user_id: string;
  film_id: number;
  added_at: string;
}

export interface Review {
  id: number;
  user_id: string;
  film_id: number;
  content: string;
  is_spoiler: boolean;
  created_at: string;
  updated_at: string;
}

export interface Rating {
  id: number;
  user_id: string;
  film_id: number;
  score: number; // 1–10
  created_at: string;
}

export interface CustomList {
  id: number;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListFilm {
  id: number;
  list_id: number;
  film_id: number;
  added_at: string;
}

export interface Follow {
  id: number;
  follower_id: string;
  followed_id: string;
  created_at: string;
}

export interface Like {
  id: number;
  user_id: string;
  target_id: number;
  target_type: LikeTargetType;
  created_at: string;
}

export interface Report {
  id: number;
  reporter_id: string;
  target_id: number;
  target_type: string; // 'review' | 'list' | 'user'
  reason: ReportReason;
  description: string | null;
  resolved: boolean;
  resolved_by: string | null;
  created_at: string;
  resolved_at: string | null;
}

export interface PremiumSubscription {
  id: number;
  user_id: string;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string | null;
  mercadopago_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: number;
  user_id: string;
  title: string | null;
  messages: unknown[]; // JSONB array
  created_at: string;
  updated_at: string;
}

export interface DailyReport {
  id: number;
  user_id: string;
  date: string;
  films_watched: number;
  reviews_written: number;
  ratings_given: number;
  minutes_watched: number;
  created_at: string;
}

// ─── Tipos TMDB ───

export interface MovieSearchResult {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  media_type?: string;
}

export interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
  runtime: number;
  original_language: string;
  tagline: string | null;
  budget: number;
  revenue: number;
  status: string;
  credits?: Credits;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

// ─── Tipos Gemini ───

export interface UserContext {
  userId: string;
  watchedGenres?: string[];
  favoriteFilms?: string[];
  recentActivity?: string[];
}

export interface Recommendation {
  filmId: number;
  title: string;
  reason: string;
  matchPercentage?: number;
  posterPath?: string | null;
}

// ─── Tipos Mercado Pago ───

export interface PreferenceItem {
  id: string;
  title: string;
  description?: string;
  quantity: number;
  currency_id: string;
  unit_price: number;
}

export interface Preference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
  collector_id: number;
}

export interface MercadoPagoWebhookEvent {
  type: string;
  action: string;
  data: { id: string };
}

// ─── Tipos Supabase (Database interface) ───
// Schema basado en supabase/migration.sql

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          role: string;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          role?: string;
        };
        Update: {
          username?: string;
          avatar_url?: string | null;
          role?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          film_id: number;
          film_title: string;
          film_year: number | null;
          film_poster: string | null;
          rating: number;
          content: string;
          is_spoiler: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          film_id: number;
          film_title: string;
          film_year?: number | null;
          film_poster?: string | null;
          rating: number;
          content?: string;
          is_spoiler?: boolean;
        };
        Update: {
          film_title?: string;
          film_year?: number | null;
          film_poster?: string | null;
          rating?: number;
          content?: string;
          is_spoiler?: boolean;
        };
      };
      watchlist: {
        Row: {
          id: string;
          user_id: string;
          film_id: number;
          film_title: string;
          film_year: number | null;
          film_poster: string | null;
          added_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          film_id: number;
          film_title: string;
          film_year?: number | null;
          film_poster?: string | null;
        };
        Update: {
          film_title?: string;
          film_year?: number | null;
          film_poster?: string | null;
        };
      };
      custom_lists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string;
        };
        Update: {
          name?: string;
          description?: string;
        };
      };
      list_films: {
        Row: {
          id: string;
          list_id: string;
          film_id: number;
          film_title: string;
          film_poster: string | null;
          film_year: number | null;
          added_at: string;
        };
        Insert: {
          id?: string;
          list_id: string;
          film_id: number;
          film_title: string;
          film_poster?: string | null;
          film_year?: number | null;
        };
        Update: {
          film_title?: string;
          film_poster?: string | null;
          film_year?: number | null;
        };
      };
      follows: {
        Row: {
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          follower_id: string;
          following_id: string;
        };
        Update: Record<string, never>;
      };
      recommendations: {
        Row: {
          id: string;
          user_id: string;
          report_date: string;
          recommendations: unknown;
          generated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          report_date: string;
          recommendations?: unknown;
        };
        Update: {
          recommendations?: unknown;
        };
      };
      reports: {
        Row: {
          id: string;
          review_id: string;
          reported_by: string;
          reason: string;
          status: string;
          created_at: string;
          reviewed_by: string | null;
          reviewed_at: string | null;
        };
        Insert: {
          id?: string;
          review_id: string;
          reported_by: string;
          reason: string;
          status?: string;
        };
        Update: {
          status?: string;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
        };
      };
    };
  };
}

// ─── Type Aliases (row types for CRUD operations) ───

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type ReviewRow = Database['public']['Tables']['reviews']['Row'];
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
export type WatchlistRow = Database['public']['Tables']['watchlist']['Row'];
export type WatchlistInsert = Database['public']['Tables']['watchlist']['Insert'];
export type CustomListRow = Database['public']['Tables']['custom_lists']['Row'];
export type CustomListInsert = Database['public']['Tables']['custom_lists']['Insert'];
export type ListFilmRow = Database['public']['Tables']['list_films']['Row'];
export type ListFilmInsert = Database['public']['Tables']['list_films']['Insert'];
export type FollowRow = Database['public']['Tables']['follows']['Row'];
export type RecommendationRow = Database['public']['Tables']['recommendations']['Row'];
export type ReportRow = Database['public']['Tables']['reports']['Row'];
export type ReportInsert = Database['public']['Tables']['reports']['Insert'];

export interface ReportWithReview extends ReportRow {
  reviews: ReviewRow;
}
