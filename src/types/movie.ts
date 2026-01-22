export interface SeedMovie {
  id: string;
  poster: string;
  title: string;
}

export interface RecommendedMovie {
  id: string;
  poster: string;
  name?: string;
  year?: string;
  director?: string;
  synopsis?: string;
  genres?: string;
  casts?: string;
  tagline?: string;
  duration?: string;
  rating?: string;
}

export interface MovieSearchResult {
  film_id: string;
  poster: string;
  title: string;
}

export interface MovieDetails {
  id: string;
  name: string;
  year: string;
  director: string;
  duration: string;
  genres: string;
  casts: string;
  synopsis: string;
  tagline: string;
  themes: string;
  poster: string;
  rating: string;
}

export interface MagnetURL {
  id: string;
  title: string;
  tracker: string;
  magnet_uri: string;
  seeders: number;
}
