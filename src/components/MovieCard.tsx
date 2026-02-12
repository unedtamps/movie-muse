import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieCardProps {
  poster: string;
  title: string;
  onRemove?: () => void;
  onClick?: () => void;
  isHighlighted?: boolean;
}

export function MovieCard({
  poster,
  title,
  onRemove,
  onClick,
  isHighlighted,
}: MovieCardProps) {
  return (
    <div
      className={`
        relative aspect-[2/3] rounded-xl overflow-hidden 
        transition-all duration-500 ease-out cursor-pointer
        group movie-poster-hover
        ${isHighlighted 
          ? "ring-2 ring-primary scale-105 shadow-2xl shadow-primary/20" 
          : "ring-1 ring-border/30 hover:ring-primary/30"
        }
      `}
      onClick={onClick}
    >
      {/* Poster Image */}
      <img
        src={poster || "/placeholder.png"}
        alt={title || "Movie poster"}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder.png";
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Hover Title Overlay */}
      <div className="absolute inset-0 flex items-end p-3">
        <span 
          className={`
            w-full text-sm font-medium text-white text-center
            transition-all duration-300 line-clamp-2 text-shadow
            ${isHighlighted 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
            }
          `}
        >
          {title}
        </span>
      </div>

      {/* Remove Button */}
      {onRemove && (
        <Button
          variant="destructive"
          size="icon"
          className="
            absolute top-2 right-2 h-7 w-7 rounded-full
            opacity-0 group-hover:opacity-100 
            transition-all duration-200
            shadow-lg hover:scale-110
            bg-destructive/90 backdrop-blur-sm
          "
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}

      {/* Highlight Effect */}
      {isHighlighted && (
        <div className="absolute inset-0 bg-primary/10 animate-pulse rounded-xl" />
      )}

      {/* Corner Accent */}
      <div className="absolute top-0 left-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-primary/60" />
      </div>
    </div>
  );
}
