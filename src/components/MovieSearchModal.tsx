import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Film, Sparkles } from "lucide-react";
import { searchMovies } from "@/lib/api";
import { MovieSearchResult } from "@/types/movie";

interface MovieSearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelectMovie: (movie: { id: string; poster: string; title: string }) => void;
}

export function MovieSearchModal({
  open,
  onClose,
  onSelectMovie,
}: MovieSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MovieSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await searchMovies(query);
      setResults(data.filter((m) => m.film_id));
    } catch (err) {
      setError("Failed to search movies. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (movie: MovieSearchResult) => {
    onSelectMovie({
      id: movie.film_id,
      poster: movie.poster,
      title: movie.title,
    });
    setQuery("");
    setResults([]);
    onClose();
  };

  const handleClose = () => {
    setQuery("");
    setResults([]);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col glass-card border-gradient">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <span>Find a Movie</span>
          </DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for a film..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50"
              autoFocus
            />
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={isLoading}
            className="h-12 px-6 btn-primary-glow"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4">
            {error}
          </div>
        )}

        {/* Results Grid */}
        <div className="flex-1 overflow-y-auto min-h-[200px]">
          {results.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {results.map((movie, index) => (
                <button
                  key={movie.film_id}
                  onClick={() => handleSelect(movie)}
                  className="
                    group relative aspect-[2/3] rounded-xl overflow-hidden
                    ring-1 ring-border/30 hover:ring-primary/50
                    transition-all duration-300 hover:scale-[1.02]
                  "
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <img
                    src={movie.poster || "/placeholder.png"}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-end p-2">
                    <span className="w-full text-sm font-medium text-white text-center text-shadow opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all line-clamp-2">
                      {movie.title}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-1.5 rounded-full bg-primary/80">
                      <Sparkles className="h-3 w-3 text-primary-foreground" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            !isLoading && (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                {query ? (
                  <>
                    <Film className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">No films found</p>
                    <p className="text-sm text-muted-foreground/60 mt-1">Try a different search term</p>
                  </>
                ) : (
                  <>
                    <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">Start typing to search</p>
                    <p className="text-sm text-muted-foreground/60 mt-1">Find films to add to your list</p>
                  </>
                )}
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
