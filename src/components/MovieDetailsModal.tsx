import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { RecommendedMovie } from "@/types/movie";
import { Clock, User, Film, Star } from "lucide-react";

interface MovieDetailsModalProps {
  movie: RecommendedMovie | null;
  open: boolean;
  onClose: () => void;
}

export function MovieDetailsModal({
  movie,
  open,
  onClose,
}: MovieDetailsModalProps) {
  if (!movie) return null;

  const rating = movie.rating ? parseFloat(movie.rating) : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            <a href={`https://letterboxd.com${movie.id}`}>
              {movie.name || "Movie Details"}
              {movie.year && (
                <span className="text-muted-foreground ml-2">
                  ({movie.year})
                </span>
              )}
            </a>
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-[200px_1fr] gap-6">
          <div className="aspect-[2/3] rounded-lg overflow-hidden border border-border">
            <a href={`https://letterboxd.com${movie.id}`}>
              <img
                src={movie.poster || "/placeholder.png"}
                alt={movie.name || "Movie poster"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.png";
                }}
              />
            </a>
          </div>

          <div className="space-y-4">
            {movie.tagline && (
              <p className="text-muted-foreground italic text-lg">
                "{movie.tagline}"
              </p>
            )}

            {movie.genres && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.split(", ").map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {movie.director && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{movie.director}</span>
                </div>
              )}
              {movie.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{movie.duration} min</span>
                </div>
              )}

              {rating !== null && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((i) => {
                      const fill =
                        rating >= i
                          ? "fill-yellow-400 text-yellow-400"
                          : rating >= i - 0.5
                            ? "fill-yellow-400/50 text-yellow-400"
                            : "text-muted-foreground";

                      return <Star key={i} className={`h-4 w-4 ${fill}`} />;
                    })}
                  </div>

                  <span className="text-sm text-muted-foreground">
                    {rating.toFixed(1)} / 5
                  </span>
                </div>
              )}
            </div>

            {movie.synopsis && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Film className="h-4 w-4" />
                  Synopsis
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {movie.synopsis}
                </p>
              </div>
            )}

            {movie.casts && (
              <div>
                <h4 className="font-semibold mb-2">Cast</h4>
                <p className="text-muted-foreground text-sm">{movie.casts}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
