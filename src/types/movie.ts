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
