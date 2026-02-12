import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/MovieCard";
import { MovieDetailsModal } from "@/components/MovieDetailsModal";
import { RecommendedMovie } from "@/types/movie";
import { getMovieDetails } from "@/lib/api";
import { useRecommendations } from "@/stores/recommendations";
import {
  Home,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Clapperboard,
  Sparkles,
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

  const handleRandomPick = async () => {
    if (!movies.length) return;
    setIsWheelOpen(true);
  };

  const handleMovieClick = (movie: RecommendedMovie) => {
    setSelectedMovie(movie);
    setIsDetailsOpen(true);
  };

  const handlePrevPage = () => {
    const prev = Math.max(0, currentPage - 1);
    setSearchParams({ page: String(prev), itemsPerPage: String(itemsPerPage) });
    setHighlightedIndex(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    const next = Math.min(totalPages - 1, currentPage + 1);
    setSearchParams({ page: String(next), itemsPerPage: String(itemsPerPage) });
    setHighlightedIndex(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="text-center space-y-6 relative">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <Clapperboard className="relative h-16 w-16 text-primary mx-auto animate-pulse" />
          </div>
          <div>
            <p className="text-xl font-medium text-foreground">Curating your films</p>
            <p className="text-muted-foreground mt-2">Analyzing your taste profile...</p>
          </div>
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-primary animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Clapperboard className="relative h-10 w-10 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient-ocean tracking-tight">
                  Your Recommendations
                </h1>
                <p className="text-sm text-muted-foreground">
                  {recommendations.length} films curated for you
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="border-border/50 hover:border-[#0992C2] hover:bg-[#0992C2]/20 hover:text-white transition-all duration-200"
            >
              <Home className="h-4 w-4 mr-2" />
              Back Home
            </Button>
          </div>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Random Pick Button */}
          <div className="flex justify-center mb-10 animate-fade-in">
            <Button 
              onClick={handleRandomPick} 
              size="lg"
              className="btn-primary-glow bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border/50 px-8"
            >
              <Shuffle className="h-5 w-5 mr-2" />
              Spin the Wheel
              <Sparkles className="h-4 w-4 ml-2 text-primary" />
            </Button>
          </div>

          {/* Movie Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10">
            {movies.map((movie, index) => {
              return (
                <div
                  key={movie.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                >
                  <MovieCard
                    title={movie.name || "Untitled"}
                    poster={movie.poster}
                    onClick={() => handleMovieClick(movie)}
                    isHighlighted={highlightedIndex === index}
                  />
                  {movie.name && (
                    <div className="mt-3 text-center space-y-1">
                      <p className="font-medium text-sm truncate text-foreground">
                        {movie.name}
                      </p>
                      {movie.year && (
                        <div className="flex items-center justify-center gap-2">
                          <Film className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">
                            {movie.year}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="border-border/50 hover:border-[#0992C2] hover:bg-[#0992C2]/20 hover:text-white transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </Button>
                
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-border/30">
                  <span className="text-sm text-muted-foreground">Page</span>
                  <span className="text-sm font-semibold text-primary">{currentPage + 1}</span>
                  <span className="text-sm text-muted-foreground">of</span>
                  <span className="text-sm font-semibold text-foreground">{totalPages}</span>
                </div>

                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                  className="border-border/50 hover:border-[#0992C2] hover:bg-[#0992C2]/20 hover:text-white transition-all duration-200"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setSearchParams({ itemsPerPage: e.target.value, page: "0" });
                  setHighlightedIndex(null);
                }}
                className="border border-border/50 rounded-lg px-3 py-2 text-sm bg-card/50 hover:border-primary/30 transition-colors cursor-pointer focus:outline-none focus:border-primary/50"
              >
                {[10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n} films per page
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/30 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-2">
            <Clapperboard className="h-5 w-5 text-primary/60" />
            <span className="text-sm text-muted-foreground">
              Lensboxd — Discover cinema, one film at a time
            </span>
          </div>
        </div>
      </footer>

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
