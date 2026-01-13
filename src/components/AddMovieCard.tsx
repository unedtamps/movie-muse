import { Plus } from "lucide-react";

interface AddMovieCardProps {
  onClick: () => void;
  disabled?: boolean;
}

export function AddMovieCard({ onClick, disabled }: AddMovieCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`aspect-[2/3] rounded-lg border-2 border-dashed flex items-center justify-center transition-all ${
        disabled
          ? "border-muted bg-muted/30 cursor-not-allowed"
          : "border-primary/30 hover:border-primary hover:bg-primary/5 cursor-pointer"
      }`}
    >
      <Plus className={`h-10 w-10 ${disabled ? "text-muted-foreground/50" : "text-primary/50"}`} />
    </button>
  );
}
