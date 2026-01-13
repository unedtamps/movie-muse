import { SeedMovie } from "@/types/movie";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SeedsStore {
  seeds: SeedMovie[];
  setSeedMovies: (r: SeedMovie[]) => void;
}

export const useSeeds = create<SeedsStore>()(
  persist(
    (set) => ({
      seeds: [] as SeedMovie[],
      setSeedMovies: (r: SeedMovie[]) => set({ seeds: r }),
    }),
    {
      name: "seeds-store",
    },
  ),
);
