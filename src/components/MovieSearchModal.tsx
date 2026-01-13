import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { searchMovies, MovieSearchResult } from "@/lib/api";

interface MovieSearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelectMovie: (movie: { id: string; poster: string }) => void;
}

export function MovieSearchModal({ open, onClose, onSelectMovie }: MovieSearchModalProps) {
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
      setResults(data.filter(m => m.film_id && m.poster));
    } catch (err) {
      setError("Failed to search movies. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (movie: MovieSearchResult) => {
    onSelectMovie({ id: movie.film_id, poster: movie.poster });
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Search Movies</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Type a movie name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {error && (
          <p className="text-destructive text-sm mb-4">{error}</p>
        )}

        <div className="flex-1 overflow-y-auto">
          {results.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {results.map((movie) => (
                <button
                  key={movie.film_id}
                  onClick={() => handleSelect(movie)}
                  className="group relative aspect-[2/3] rounded-lg overflow-hidden border border-border hover:border-primary transition-all hover:scale-105"
                >
                  <img
                    src={movie.poster}
                    alt="Movie poster"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors" />
                </button>
              ))}
            </div>
          ) : (
            !isLoading && query && (
              <p className="text-muted-foreground text-center py-8">
                No results found. Try a different search term.
              </p>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
