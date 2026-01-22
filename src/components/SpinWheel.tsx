import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { SpinWheel } from "react-spin-wheel";
import "react-spin-wheel/dist/index.css";
import { RecommendedMovie } from "@/types/movie";

interface SpinWheelProps {
  items: string[];
  open: boolean;
  movies: RecommendedMovie[] | null;
  handleMovieClick: (movie: RecommendedMovie) => void;
  onClose: () => void;
}

export function SpinWheelComp({
  items,
  open,
  movies,
  onClose,
  handleMovieClick,
}: SpinWheelProps) {
  const [result, setResult] = useState<string | null>(null);

  function handleResult(item: string) {
    setResult(item);
    const selectedMovie = movies.find((m) => m.name === item);
    console.log(selectedMovie);
    handleMovieClick(selectedMovie);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col items-center">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Spin Wheel To Watch
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-[3rem] flex items-center justify-center my-4">
          {result ? (
            <span className="text-xl font-bold text-green-600 animate-pulse">
              {result}
            </span>
          ) : (
            <span className="text-gray-500">Spin the wheel...</span>
          )}
        </div>

        <div className="flex justify-center w-full">
          <SpinWheel
            items={items}
            onFinishSpin={handleResult}
            onReset={() => setResult("")}
            size={500}
            spinTime={2000}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
