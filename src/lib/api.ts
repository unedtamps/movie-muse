import { MagnetURL, MovieDetails, MovieSearchResult } from "@/types/movie";

// API Configuration - Replace with your production URL
const API_BASE_URL = "https://movie-muse-api.unedotampubolon.com";
const API_INDEXER_URL = "https://torrent-api.unedotampubolon.com";

// Types

export async function getMoviesMagnet(filmId: string): Promise<MagnetURL[]> {
  let cleanId = filmId.startsWith("/film/") ? filmId.slice(6) : filmId;
  cleanId = cleanId.split("/")[0];
  const response = await fetch(`${API_INDEXER_URL}/movies/${cleanId}`, {
    method: "GET",
    headers: { accept: "application/json" },
  });
  if (!response.ok) throw new Error("Failed to get movie details");
  return response.json();
}

export async function searchMovies(
  query: string,
): Promise<MovieSearchResult[]> {
  const response = await fetch(
    `${API_BASE_URL}/search?query=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: { accept: "application/json" },
    },
  );
  if (!response.ok) throw new Error("Failed to search movies");
  return response.json();
}

// Get movie details by ID
export async function getMovieDetails(filmId: string): Promise<MovieDetails> {
  let cleanId = filmId.startsWith("/film/") ? filmId.slice(6) : filmId;
  cleanId = cleanId.split("/")[0];
  const response = await fetch(`${API_BASE_URL}/film/${cleanId}`, {
    method: "GET",
    headers: { accept: "application/json" },
  });
  if (!response.ok) throw new Error("Failed to get movie details");
  return response.json();
}

// Get recommendations by Letterboxd username
export async function getRecommendationsByUser(
  username: string,
): Promise<string[]> {
  const response = await fetch(
    `${API_BASE_URL}/recommend/personalize/${encodeURIComponent(username)}?k=1`,
    {
      method: "GET",
      headers: { accept: "application/json" },
    },
  );
  if (!response.ok) throw new Error("Failed to get recommendations");
  return response.json();
}

// Get recommendations by seed movies
export async function getRecommendationsBySeed(
  seedFilmIds: string[],
): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/recommend/seed`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      k: 1,
      seed_film_ids: seedFilmIds,
    }),
  });
  if (!response.ok) throw new Error("Failed to get recommendations");
  return response.json();
}
