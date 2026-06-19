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

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      films: {
        Row: Film;
        Insert: Omit<Film, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Film, 'id' | 'tmdb_id'>>;
      };
      watched_films: {
        Row: WatchedFilm;
        Insert: Omit<WatchedFilm, 'id' | 'watched_at'>;
        Update: Partial<Omit<WatchedFilm, 'id'>>;
      };
      watchlist_films: {
        Row: WatchlistFilm;
        Insert: Omit<WatchlistFilm, 'id' | 'added_at'>;
        Update: Partial<Omit<WatchlistFilm, 'id'>>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Review, 'id'>>;
      };
      ratings: {
        Row: Rating;
        Insert: Omit<Rating, 'id' | 'created_at'>;
        Update: Partial<Omit<Rating, 'id'>>;
      };
      custom_lists: {
        Row: CustomList;
        Insert: Omit<CustomList, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CustomList, 'id'>>;
      };
      list_films: {
        Row: ListFilm;
        Insert: Omit<ListFilm, 'id' | 'added_at'>;
        Update: Partial<Omit<ListFilm, 'id'>>;
      };
      follows: {
        Row: Follow;
        Insert: Omit<Follow, 'id' | 'created_at'>;
        Update: Partial<Omit<Follow, 'id'>>;
      };
      likes: {
        Row: Like;
        Insert: Omit<Like, 'id' | 'created_at'>;
        Update: Partial<Omit<Like, 'id'>>;
      };
      reports: {
        Row: Report;
        Insert: Omit<Report, 'id' | 'resolved' | 'created_at' | 'resolved_at'>;
        Update: Partial<Omit<Report, 'id'>>;
      };
      premium_subscriptions: {
        Row: PremiumSubscription;
        Insert: Omit<PremiumSubscription, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PremiumSubscription, 'id'>>;
      };
      chat_sessions: {
        Row: ChatSession;
        Insert: Omit<ChatSession, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ChatSession, 'id'>>;
      };
      daily_reports: {
        Row: DailyReport;
        Insert: Omit<DailyReport, 'id' | 'created_at'>;
        Update: Partial<Omit<DailyReport, 'id'>>;
      };
    };
    Enums: {
      user_role: UserRole;
      subscription_status: SubscriptionStatus;
      report_reason: ReportReason;
      like_target_type: LikeTargetType;
    };
  };
}
