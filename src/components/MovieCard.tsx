import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieCardProps {
  poster: string;
  onRemove?: () => void;
  onClick?: () => void;
  isHighlighted?: boolean;
}

export function MovieCard({ poster, onRemove, onClick, isHighlighted }: MovieCardProps) {
  return (
    <div
      className={`relative aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all duration-300 ${
        isHighlighted
          ? "border-primary ring-4 ring-primary/30 scale-105 shadow-xl"
          : "border-border hover:border-primary/50"
      } ${onClick ? "cursor-pointer hover:scale-102" : ""}`}
      onClick={onClick}
    >
      <img
        src={poster}
        alt="Movie poster"
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder.svg";
        }}
      />
      
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
