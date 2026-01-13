import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecommendationStore {
  recommendations: string[];
  setRecommendations: (r: string[]) => void;
}

export const useRecommendations = create<RecommendationStore>()(
  persist(
    (set) => ({
      recommendations: [] as string[],
      setRecommendations: (r: string[]) => set({ recommendations: r }),
    }),
    {
      name: "recommendations-store",
    },
  ),
);
