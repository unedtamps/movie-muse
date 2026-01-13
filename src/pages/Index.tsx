import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MovieSearchModal } from "@/components/MovieSearchModal";
import { MovieCard } from "@/components/MovieCard";
import { AddMovieCard } from "@/components/AddMovieCard";
import { Loader2, Film, User, Sparkles } from "lucide-react";
import { SeedMovie } from "@/types/movie";
import { getRecommendationsByUser, getRecommendationsBySeed } from "@/lib/api";

const Index = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [seedMovies, setSeedMovies] = useState<SeedMovie[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasUsername = username.trim().length > 0;
  const hasSeedMovies = seedMovies.length > 0;
  const canSubmit = hasUsername || hasSeedMovies;

  const handleAddMovie = (movie: { id: string; poster: string }) => {
    if (!seedMovies.find((m) => m.id === movie.id)) {
      setSeedMovies([...seedMovies, movie]);
      setUsername(""); // Clear username when adding seed movies
    }
  };

  const handleRemoveMovie = (id: string) => {
    setSeedMovies(seedMovies.filter((m) => m.id !== id));
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    if (value.trim()) {
      setSeedMovies([]); // Clear seed movies when entering username
    }
  };

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let recommendations: string[];
      
      if (hasUsername) {
        recommendations = await getRecommendationsByUser(username.trim());
      } else {
        recommendations = await getRecommendationsBySeed(seedMovies.map((m) => m.id));
      }

      // Navigate to results page with recommendations
      navigate("/results", { 
        state: { 
          recommendations,
          source: hasUsername ? "letterboxd" : "seed",
          sourceValue: hasUsername ? username : seedMovies
        } 
      });
    } catch (err) {
      setError("Failed to get recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 animate-fade-in">
            <Film className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Movie Recommender</h1>
          </div>
          <p className="text-muted-foreground mt-2 animate-fade-in">
            Get personalized movie recommendations based on your taste
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Letterboxd Username Card */}
          <Card className={`transition-all duration-300 ${hasSeedMovies ? "opacity-50" : ""}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Letterboxd Username
              </CardTitle>
              <CardDescription>
                Enter your Letterboxd username to get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your Letterboxd username"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  disabled={hasSeedMovies}
                  className="max-w-md"
                />
              </div>
            </CardContent>
          </Card>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-sm font-medium">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Seed Movies Card */}
          <Card className={`transition-all duration-300 ${hasUsername ? "opacity-50" : ""}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Seed Movies
              </CardTitle>
              <CardDescription>
                Add movies you love to get similar recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {seedMovies.map((movie) => (
                  <div key={movie.id} className="group animate-scale-in">
                    <MovieCard
                      poster={movie.poster}
                      onRemove={() => handleRemoveMovie(movie.id)}
                    />
                  </div>
                ))}
                <AddMovieCard
                  onClick={() => setIsSearchModalOpen(true)}
                  disabled={hasUsername}
                />
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <p className="text-destructive text-center">{error}</p>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={handleGetRecommendations}
              disabled={!canSubmit || isLoading}
              className="min-w-[200px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Getting Recommendations...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Recommendations
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      {/* Search Modal */}
      <MovieSearchModal
        open={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectMovie={handleAddMovie}
      />
    </div>
  );
};

export default Index;
