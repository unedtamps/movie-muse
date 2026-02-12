import { useState, useCallback, useRef, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { RecommendedMovie } from "@/types/movie";
import { Sparkles, RotateCcw, Play, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SpinWheelProps {
  items: string[];
  open: boolean;
  movies: RecommendedMovie[] | null;
  handleMovieClick: (movie: RecommendedMovie) => void;
  onClose: () => void;
}

// Extended color palette for up to 100 items (20 colors cycling)
const WHEEL_COLORS = [
  "#0992C2", "#0AC4E0", "#F6E7BC", "#0B2D72", "#14B8A6",
  "#6366F1", "#EC4899", "#F59E0B", "#10B981", "#8B5CF6",
  "#06B6D4", "#84CC16", "#F97316", "#EF4444", "#D946EF",
  "#3B82F6", "#22C55E", "#EAB308", "#94A3B8", "#64748B",
];

const TEXT_COLORS = [
  "#FFFFFF", "#0B2D72", "#0B2D72", "#FFFFFF", "#FFFFFF",
  "#FFFFFF", "#FFFFFF", "#0B2D72", "#FFFFFF", "#FFFFFF",
  "#0B2D72", "#0B2D72", "#FFFFFF", "#FFFFFF", "#FFFFFF",
  "#FFFFFF", "#FFFFFF", "#0B2D72", "#FFFFFF", "#FFFFFF",
];

export function SpinWheelComp({
  items,
  open,
  movies,
  handleMovieClick,
  onClose,
}: SpinWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const rotationRef = useRef(0);

  // Limit to 100 items max
  const validItems = useMemo(() => 
    items.filter(item => item && item.trim() !== "").slice(0, 100),
    [items]
  );
  
  const segmentCount = validItems.length;
  const segmentAngle = 360 / segmentCount;

  const spin = useCallback(() => {
    if (isSpinning || validItems.length === 0) return;

    setIsSpinning(true);
    setResult(null);

    const winnerIndex = Math.floor(Math.random() * validItems.length);
    const winner = validItems[winnerIndex];

    const currentRotation = rotationRef.current;
    const winnerCenterAngle = winnerIndex * segmentAngle + segmentAngle / 2;
    const targetRemainder = (360 - winnerCenterAngle) % 360;
    
    const spins = 5 + Math.floor(Math.random() * 4);
    const currentRemainder = currentRotation % 360;
    let delta = targetRemainder - currentRemainder;
    
    if (delta < 0) {
      delta += 360;
    }
    
    const targetRotation = currentRotation + spins * 360 + delta;
    
    rotationRef.current = targetRotation;
    setRotation(targetRotation);

    setTimeout(() => {
      setResult(winner);
      setIsSpinning(false);

      const selectedMovie = movies?.find((m) => m.name === winner);
      if (selectedMovie) {
        setTimeout(() => {
          handleMovieClick(selectedMovie);
        }, 800);
      }
    }, 4000);
  }, [isSpinning, validItems, segmentAngle, movies, handleMovieClick]);

  const renderWheel = () => {
    const radius = 180;
    const center = 200;
    
    return validItems.map((item, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = (index + 1) * segmentAngle;
      
      const startRad = ((startAngle - 90) * Math.PI) / 180;
      const endRad = ((endAngle - 90) * Math.PI) / 180;
      
      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);
      
      const largeArcFlag = segmentAngle > 180 ? 1 : 0;
      const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      // Calculate text position and rotation
      const textAngle = startAngle + segmentAngle / 2;
      const textRad = ((textAngle - 90) * Math.PI) / 180;
      
      // Position text at 55% of radius (closer to center for small slices)
      const textRadius = radius * 0.55;
      const textX = center + textRadius * Math.cos(textRad);
      const textY = center + textRadius * Math.sin(textRad);
      
      // Rotate text to be VERTICAL (perpendicular to radial)
      // textAngle points outward from center, add 90 to make it tangent/vertical
      const textRotation = textAngle + 90;
      
      // Dynamic font size based on segment count (slightly larger for vertical)
      const fontSize = segmentCount > 50 ? 8 : segmentCount > 20 ? 10 : 12;
      
      // Truncate text based on segment size (more chars for vertical)
      const maxChars = segmentCount > 50 ? 10 : segmentCount > 20 ? 14 : 18;
      const displayText = item.length > maxChars ? item.slice(0, maxChars - 2) + ".." : item;
      
      const colorIndex = index % WHEEL_COLORS.length;
      
      return (
        <g key={index}>
          <path
            d={pathData}
            fill={WHEEL_COLORS[colorIndex]}
            stroke="#0a0a12"
            strokeWidth={segmentCount > 50 ? 0.5 : 1}
          />
          {/* Diagonal text following the slice angle */}
          <text
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={TEXT_COLORS[colorIndex]}
            fontSize={fontSize}
            fontWeight="600"
            transform={`rotate(${textRotation}, ${textX}, ${textY})`}
            style={{
              textShadow: TEXT_COLORS[colorIndex] === "#FFFFFF" 
                ? "0 1px 2px rgba(0,0,0,0.5)" 
                : "none",
            }}
          >
            {displayText}
          </text>
        </g>
      );
    });
  };

  // List of all movies for reference when many items
  const renderMovieList = () => {
    if (segmentCount <= 10) return null;
    
    return (
      <div className="w-full mt-4">
        <p className="text-xs text-muted-foreground mb-2 text-center">
          Movies on the wheel ({segmentCount}):
        </p>
        <ScrollArea className="h-24 w-full rounded-md border border-border/30 p-2">
          <div className="flex flex-wrap gap-1">
            {validItems.map((item, idx) => (
              <span 
                key={idx} 
                className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary"
              >
                {idx + 1}. {item.length > 20 ? item.slice(0, 18) + ".." : item}
              </span>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  };

  if (validItems.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md glass-card border-gradient">
          <DialogHeader>
            <DialogTitle className="text-center">No Movies to Spin</DialogTitle>
          </DialogHeader>
          <p className="text-center text-muted-foreground py-8">
            Add some movies first to use the spin wheel!
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  // Warning for large number of items
  const showWarning = segmentCount > 50;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto flex flex-col items-center glass-card border-gradient p-6">
        <DialogHeader className="w-full">
          <DialogTitle className="text-2xl text-center flex items-center justify-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#0992C2] to-[#0AC4E0]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-[#0992C2] via-[#0AC4E0] to-[#F6E7BC] bg-clip-text text-transparent">
              Let Fate Decide
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Warning for many items */}
        {showWarning && (
          <div className="flex items-center gap-2 text-amber-400 text-xs mb-2">
            <AlertCircle className="h-4 w-4" />
            <span>Many movies! Text may be small on wheel.</span>
          </div>
        )}

        {/* Result Display */}
        <div className="min-h-[3rem] flex items-center justify-center my-2">
          {result && !isSpinning ? (
            <div className="text-center animate-fade-in">
              <p className="text-sm text-muted-foreground mb-1">The wheel has chosen:</p>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#0992C2] via-[#0AC4E0] to-[#F6E7BC] bg-clip-text text-transparent">
                {result}
              </span>
            </div>
          ) : (
            <div className="text-center">
              {isSpinning ? (
                <p className="text-muted-foreground flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 animate-spin" />
                  Spinning...
                </p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Click spin to discover your next watch
                </p>
              )}
            </div>
          )}
        </div>

        {/* Spin Wheel Container */}
        <div className="relative my-4">
          <div 
            className="absolute -inset-4 rounded-full opacity-40 blur-xl"
            style={{
              background: "linear-gradient(135deg, #0992C2, #0AC4E0, #F6E7BC)",
            }}
          />
          
          <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px]">
            {/* Pointer at top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
              <div 
                className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[24px] border-l-transparent border-r-transparent drop-shadow-lg"
                style={{ borderTopColor: "#F6E7BC" }}
              />
            </div>

            {/* The Wheel */}
            <div
              className="w-full h-full rounded-full relative overflow-hidden shadow-2xl"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning 
                  ? "transform 4s cubic-bezier(0.15, 0.5, 0.15, 1)" 
                  : "transform 0.5s ease-out",
                boxShadow: "inset 0 0 50px rgba(0,0,0,0.5), 0 0 50px rgba(9, 146, 194, 0.3)",
              }}
            >
              <svg 
                viewBox="0 0 400 400" 
                className="w-full h-full"
              >
                {renderWheel()}
              </svg>

              {/* Center circle */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center z-10 shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #0B2D72 0%, #0992C2 100%)",
                  boxShadow: "inset 0 2px 4px rgba(255,255,255,0.2), 0 4px 20px rgba(0,0,0,0.4)",
                }}
              >
                <span className="text-xl sm:text-2xl">🎬</span>
              </div>
            </div>

            <div 
              className="absolute inset-0 rounded-full border-4 pointer-events-none"
              style={{ borderColor: "rgba(246, 231, 188, 0.2)" }}
            />
          </div>
        </div>

        {/* Spin Button */}
        <Button
          onClick={spin}
          disabled={isSpinning}
          size="lg"
          className="mt-2 px-8 h-12 text-base font-semibold text-white border-0 shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: result 
              ? "linear-gradient(135deg, #0B2D72 0%, #0992C2 100%)"
              : "linear-gradient(135deg, #0992C2 0%, #0AC4E0 50%, #0B2D72 100%)",
            boxShadow: "0 0 30px rgba(9, 146, 194, 0.4)",
          }}
        >
          {isSpinning ? (
            <>
              <RotateCcw className="h-5 w-5 mr-2 animate-spin" />
              Spinning...
            </>
          ) : result ? (
            <>
              <RotateCcw className="h-5 w-5 mr-2" />
              Spin Again
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              Spin the Wheel
            </>
          )}
        </Button>

        {/* Movie count */}
        <p className="text-xs text-muted-foreground mt-3">
          {segmentCount} {segmentCount === 1 ? "movie" : "movies"} on the wheel
          {segmentCount === 100 && " (max)"}
        </p>

        {/* Movie list for many items */}
        {renderMovieList()}
      </DialogContent>
    </Dialog>
  );
}
