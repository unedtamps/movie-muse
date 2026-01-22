import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/MovieCard";
import { MovieDetailsModal } from "@/components/MovieDetailsModal";
import { RecommendedMovie } from "@/types/movie";
import { getMovieDetails, getMoviesMagnet } from "@/lib/api";
import { useRecommendations } from "@/stores/recommendations";
import {
  Home,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Film,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { SpinWheelComp } from "@/components/SpinWheel";

const Results = () => {
  const navigate = useNavigate();
  const recommendations = useRecommendations((s) => s.recommendations);

  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState<RecommendedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentPage = Number(searchParams.get("page") ?? 0);
  const itemsPerPage = Number(searchParams.get("itemsPerPage") ?? 10);

  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<RecommendedMovie | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isWheelOpen, setIsWheelOpen] = useState(false);

  const totalPages = Math.ceil(recommendations.length / itemsPerPage);

  useEffect(() => {
    const start = currentPage * itemsPerPage;
    const pageRecommendations = recommendations.slice(
      start,
      start + itemsPerPage,
    );

    if (!pageRecommendations.length) {
      navigate("/");
      return;
    }

    const fetchMovieDetails = async () => {
      setIsLoading(true);

      const moviePromises = pageRecommendations.map(async (filmId: string) => {
        try {
          const details = await getMovieDetails(filmId);
          // const magnet = await getMoviesMagnet(filmId);
          return {
            id: filmId,
            poster: details.poster,
            name: details.name,
            year: details.year,
            director: details.director,
            synopsis: details.synopsis,
            genres: details.genres,
            casts: details.casts,
            tagline: details.tagline,
            duration: details.duration,
            rating: details.rating,
            // magnet: magnet,
          };
        } catch (error) {
          return {
            id: filmId,
            poster: "/placeholder.svg",
          };
        }
      });

      const fetchedMovies = await Promise.all(moviePromises);
      setMovies(fetchedMovies);
      setIsLoading(false);
    };

    fetchMovieDetails();
  }, [currentPage, itemsPerPage, recommendations, navigate]);

  // const sleep = (ms: number) =>
  //   new Promise((resolve) => setTimeout(resolve, ms));
  // setHighlightedIndex(null);

  // for (let i = 0; i < movies.length; i++) {
  //   const idx = Math.floor(Math.random() * movies.length);
  //   setHighlightedIndex(idx);
  //   await sleep(120);
  // }

  // const finalIndex = Math.floor(Math.random() * movies.length);
  // setHighlightedIndex(finalIndex);
  // setTimeout(() => setHighlightedIndex(null), 1000);

  // await sleep(300);

  // setSelectedMovie(movies[finalIndex]);
  // setIsDetailsOpen(true);

  const handleRandomPick = async () => {
    if (!movies.length) return;

    setIsWheelOpen(true);
  };

  const handleMovieClick = (movie: RecommendedMovie) => {
    setSelectedMovie(movie);
    setIsDetailsOpen(true);
  };

  const handlePrevPage = () => {
    // setCurrentPage((prev) => Math.max(0, prev - 1));
    const prev = Math.max(0, currentPage - 1);
    setSearchParams({ page: String(prev), itemsPerPage: String(itemsPerPage) });
    setHighlightedIndex(null);
  };

  const handleNextPage = () => {
    // setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
    const next = Math.min(totalPages - 1, currentPage + 1);
    setSearchParams({ page: String(next), itemsPerPage: String(itemsPerPage) });
    setHighlightedIndex(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">
            Loading your recommendations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Film className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">
                Your Recommendations
              </h1>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </div>
          <p className="text-muted-foreground mt-2">
            {movies.length} movies recommended for you
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-8">
            <Button onClick={handleRandomPick} variant="secondary" size="lg">
              <Shuffle className="h-4 w-4 mr-2" />
              Random Pick
            </Button>
          </div>

          {/* Movie Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
            {movies.map((movie, index) => {
              return (
                <div
                  key={movie.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <MovieCard
                    title={movie.name || "Untitled"}
                    poster={movie.poster}
                    onClick={() => handleMovieClick(movie)}
                    isHighlighted={highlightedIndex === index}
                  />
                  {movie.name && (
                    <div className="mt-2 text-center">
                      <p className="font-medium text-sm truncate">
                        {movie.name}
                      </p>
                      {movie.year && (
                        <p className="text-xs text-muted-foreground">
                          {movie.year}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Prev
              </Button>
              <span className="text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>

              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setSearchParams({ itemsPerPage: e.target.value, page: "0" });
                  setHighlightedIndex(null);
                }}
                className="border rounded-md px-2 py-1 text-sm bg-background"
              >
                {[10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n} / page
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </main>

      <SpinWheelComp
        items={movies.map((movie) => movie.name || "Untitled")}
        open={isWheelOpen}
        movies={movies}
        handleMovieClick={handleMovieClick}
        onClose={() => setIsWheelOpen(false)}
      />

      <MovieDetailsModal
        movie={selectedMovie}
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};

export default Results;
