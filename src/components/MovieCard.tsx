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
      className={`relative aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all duration-300 ${
        isHighlighted
          ? "border-primary ring-4 ring-primary/30 scale-110 shadow-2xl "
          : "border-border hover:border-primary/20"
      } ${onClick ? "cursor-pointer hover:scale-102" : ""}`}
      onClick={onClick}
    >
      <img
        src={poster || "/placeholder.png"}
        alt="Movie poster"
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder.png";
        }}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300" />

      <div
        className={`pointer-events-none absolute inset-0 transition-colors duration-300
      ${isHighlighted ? "bg-black/60" : "bg-black/0"}`}
      >
        <span
          className={`w-full text-sm font-medium text-white transition-all line-clamp-2
        ${
          isHighlighted
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
        }`}
        >
          {title}
        </span>
      </div>
      {onRemove && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}

      {isHighlighted && (
        <div className="absolute inset-0 bg-primary/10 animate-pulse" />
      )}
    </div>
  );
}
