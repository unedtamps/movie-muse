import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/MovieCard";
import { MovieDetailsModal } from "@/components/MovieDetailsModal";
import { RecommendedMovie } from "@/types/movie";
import { getMovieDetails } from "@/lib/api";
import { Home, Shuffle, ChevronLeft, ChevronRight, Loader2, Film } from "lucide-react";

const ITEMS_PER_PAGE = 5;

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { recommendations = [] } = location.state || {};

  const [movies, setMovies] = useState<RecommendedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<RecommendedMovie | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentMovies = movies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    if (!recommendations.length) {
      navigate("/");
      return;
    }

    const fetchMovieDetails = async () => {
      setIsLoading(true);
      
      const moviePromises = recommendations.map(async (filmId: string) => {
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
          };
        } catch (error) {
          // Return basic movie with placeholder if details fail
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
  }, [recommendations, navigate]);

  const handleRandomPick = () => {
    const randomIndex = Math.floor(Math.random() * movies.length);
    const pageForIndex = Math.floor(randomIndex / ITEMS_PER_PAGE);
    setCurrentPage(pageForIndex);
    setHighlightedIndex(randomIndex);
    
    // Clear highlight after animation
    setTimeout(() => setHighlightedIndex(null), 2000);
  };

  const handleMovieClick = (movie: RecommendedMovie) => {
    setSelectedMovie(movie);
    setIsDetailsOpen(true);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
    setHighlightedIndex(null);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
    setHighlightedIndex(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Film className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Your Recommendations</h1>
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Action Buttons */}
          <div className="flex justify-center mb-8">
            <Button onClick={handleRandomPick} variant="secondary" size="lg">
              <Shuffle className="h-4 w-4 mr-2" />
              Random Pick
            </Button>
          </div>

          {/* Movie Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
            {currentMovies.map((movie, index) => {
              const globalIndex = startIndex + index;
              return (
                <div
                  key={movie.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <MovieCard
                    poster={movie.poster}
                    onClick={() => handleMovieClick(movie)}
                    isHighlighted={highlightedIndex === globalIndex}
                  />
                  {movie.name && (
                    <div className="mt-2 text-center">
                      <p className="font-medium text-sm truncate">{movie.name}</p>
                      {movie.year && (
                        <p className="text-xs text-muted-foreground">{movie.year}</p>
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
            </div>
          )}
        </div>
      </main>

      {/* Movie Details Modal */}
      <MovieDetailsModal
        movie={selectedMovie}
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};

export default Results;
