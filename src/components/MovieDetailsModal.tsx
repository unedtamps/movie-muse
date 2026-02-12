import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MagnetURL, RecommendedMovie } from "@/types/movie";
import {
  Magnet,
  Clock,
  User,
  Film,
  Star,
  Loader2,
  ExternalLink,
  Download,
} from "lucide-react";
import { Button } from "./ui/button";
import { getMoviesMagnet } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [magnets, setMagnets] = useState<MagnetURL[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const magnetCache = useRef(new Map<string, MagnetURL[]>());

  const getMagnetUrl = async () => {
    if (!movie) return;

    const cached = magnetCache.current.get(movie.id);
    if (cached) {
      setMagnets(cached);
      return;
    }
    setIsLoading(true);
    try {
      const data = await getMoviesMagnet(movie.name);
      magnetCache.current.set(movie.id, data);
      setMagnets(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!movie?.id) return;

    const cached = magnetCache.current.get(movie.id);
    if (cached) {
      setMagnets(cached);
    } else {
      setMagnets([]);
    }
  }, [movie?.id]);

  if (!movie) return null;

  const rating = movie.rating ? parseFloat(movie.rating) : null;
  const truncate = (s: string, n = 60) =>
    s?.length > n ? s.slice(0, n) + "…" : s;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 glass-card border-gradient overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader className="pb-2">
              <DialogTitle className="text-2xl font-bold leading-tight pr-8">
                <a
                  href={`https://letterboxd.com${movie.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors inline-flex items-center gap-2 group break-words"
                >
                  <span className="break-words">{movie.name || "Movie Details"}</span>
                  <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  {movie.year && (
                    <span className="text-muted-foreground text-lg font-normal shrink-0">
                      ({movie.year})
                    </span>
                  )}
                </a>
              </DialogTitle>
            </DialogHeader>

            <div className="grid md:grid-cols-[200px_1fr] gap-6 mt-4">
              {/* Poster */}
              <div className="aspect-[2/3] rounded-xl overflow-hidden ring-1 ring-border/30 movie-poster-hover shrink-0 mx-auto md:mx-0 w-full max-w-[200px]">
                <a
                  href={`https://letterboxd.com${movie.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
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

              {/* Details */}
              <div className="space-y-4 min-w-0">
                {/* Tagline */}
                {movie.tagline && (
                  <p className="text-primary italic text-base font-medium break-words">
                    &ldquo;{movie.tagline}&rdquo;
                  </p>
                )}

                {/* Genres */}
                {movie.genres && (
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.split(", ").map((genre) => (
                      <Badge
                        key={genre}
                        variant="secondary"
                        className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap gap-3 text-sm">
                  {movie.director && (
                    <div className="flex items-center gap-2 text-muted-foreground bg-card/50 px-3 py-1.5 rounded-lg">
                      <User className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate max-w-[150px]">{movie.director}</span>
                    </div>
                  )}
                  {movie.duration && (
                    <div className="flex items-center gap-2 text-muted-foreground bg-card/50 px-3 py-1.5 rounded-lg shrink-0">
                      <Clock className="h-4 w-4 text-primary shrink-0" />
                      <span>{movie.duration} min</span>
                    </div>
                  )}

                  {rating !== null && (
                    <div className="flex items-center gap-2 bg-card/50 px-3 py-1.5 rounded-lg shrink-0">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((i) => {
                          const fill =
                            rating >= i
                              ? "fill-primary text-primary"
                              : rating >= i - 0.5
                                ? "fill-primary/50 text-primary"
                                : "text-muted-foreground";

                          return <Star key={i} className={`h-4 w-4 ${fill}`} />;
                        })}
                      </div>
                      <span className="text-sm font-medium">
                        {rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Synopsis */}
                {movie.synopsis && (
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2 text-foreground">
                      <Film className="h-4 w-4 text-primary shrink-0" />
                      Synopsis
                    </h4>
                    <p className="text-muted-foreground leading-relaxed text-sm break-words">
                      {movie.synopsis}
                    </p>
                  </div>
                )}

                {/* Cast */}
                {movie.casts && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Cast</h4>
                    <p className="text-muted-foreground text-sm break-words">{movie.casts}</p>
                  </div>
                )}

                {/* Download Section */}
                <div className="pt-4 border-t border-border/30">
                  <Button
                    onClick={getMagnetUrl}
                    variant="outline"
                    className="border-[#0992C2]/50 hover:bg-[#0992C2]/20 hover:border-[#0992C2] hover:text-white mb-3 transition-all duration-200"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Find Download Links
                  </Button>

                  {/* Magnet Links List with max height */}
                  {magnets.length > 0 && (
                    <div className="mt-3 max-h-[200px] overflow-y-auto pr-1 space-y-2 scrollbar-thin">
                      {magnets.map((magnet) => (
                        <div
                          key={magnet.id + magnet.tracker}
                          className="flex items-center gap-3 py-2 px-3 rounded-lg bg-card/50 border border-border/30 hover:border-primary/20 transition-colors overflow-hidden"
                        >
                          {/* Tracker Badge */}
                          <span className="text-xs px-2 py-1 rounded-md border border-primary/30 bg-primary/10 text-primary shrink-0 font-medium">
                            {magnet.tracker}
                          </span>

                          {/* Title Link - takes remaining space */}
                          <a
                            href={magnet.id}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm hover:text-primary transition-colors truncate flex-1 min-w-0"
                            title={magnet.title}
                          >
                            {truncate(magnet.title, 50)}
                          </a>

                          {/* Seeders - hidden on very small screens */}
                          <span className="text-xs text-muted-foreground font-medium shrink-0 hidden sm:inline">
                            {magnet.seeders} seeders
                          </span>

                          {/* Magnet Button */}
                          <a
                            href={magnet.magnet_uri}
                            title="Open magnet link"
                            onContextMenu={(e) => {
                              e.preventDefault();
                              navigator.clipboard.writeText(magnet.magnet_uri);
                            }}
                            className="p-1.5 rounded-lg hover:bg-[#0992C2]/30 hover:text-white transition-colors shrink-0"
                          >
                            <Magnet className="h-4 w-4 text-primary" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
