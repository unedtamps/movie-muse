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
      className={`
        aspect-[2/3] rounded-xl border-2 border-dashed 
        flex flex-col items-center justify-center gap-3
        transition-all duration-300
        group
        ${disabled
          ? "border-muted bg-muted/20 cursor-not-allowed opacity-50"
          : "border-[#0992C2]/30 bg-[#0992C2]/5 hover:border-[#0992C2] hover:bg-[#0992C2]/20 cursor-pointer hover:scale-[1.02]"
        }
      `}
    >
      <div 
        className={`
          p-3 rounded-full transition-all duration-300
          ${disabled 
            ? "bg-muted" 
            : "bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110"
          }
        `}
      >
        <Plus 
          className={`
            h-6 w-6 transition-colors duration-300
            ${disabled ? "text-muted-foreground/50" : "text-primary/70 group-hover:text-primary"}
          `} 
        />
      </div>
      <span 
        className={`
          text-xs font-medium transition-colors duration-300
          ${disabled ? "text-muted-foreground/50" : "text-muted-foreground group-hover:text-primary/80"}
        `}
      >
        Add Movie
      </span>
    </button>
  );
}
