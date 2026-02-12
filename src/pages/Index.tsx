import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRecommendations } from "@/stores/recommendations";
import { useSeeds } from "@/stores/seeds";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MovieSearchModal } from "@/components/MovieSearchModal";
import { MovieCard } from "@/components/MovieCard";
import { AddMovieCard } from "@/components/AddMovieCard";
import {
  Loader2,
  Film,
  User,
  Sparkles,
  Clapperboard,
  Search,
  Heart,
} from "lucide-react";
import { SeedMovie } from "@/types/movie";
import { getRecommendationsByUser, getRecommendationsBySeed } from "@/lib/api";

const Index = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const seedMovies = useSeeds((s) => s.seeds);
  const setSeedMovies = useSeeds((s) => s.setSeedMovies);
  const setRecommendations = useRecommendations((s) => s.setRecommendations);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasUsername = username.trim().length > 0;
  const hasSeedMovies = seedMovies.length > 0;
  const canSubmit = hasUsername || hasSeedMovies;

  const handleAddMovie = (movie: {
    id: string;
    poster: string;
    title: string;
  }) => {
    if (!seedMovies.find((m) => m.id === movie.id)) {
      setSeedMovies([...seedMovies, movie]);
      setUsername("");
    }
  };

  const handleRemoveMovie = (id: string) => {
    setSeedMovies(seedMovies.filter((m) => m.id !== id));
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    if (value.trim()) {
      setSeedMovies([]);
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
        recommendations = await getRecommendationsBySeed(
          seedMovies.map((m) => m.id),
        );
      }
      setRecommendations(recommendations);

      navigate("/results?page=0&&itemsPerPage=10");
    } catch (err) {
      setError("Failed to get recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.02] rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/50 backdrop-blur-sm bg-background/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Clapperboard className="relative h-10 w-10 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient-ocean tracking-tight">
                  Lensboxd
                </h1>
                <p className="text-xs text-[#0992C2]/80 tracking-wider uppercase">
                  AI-Powered Film Discovery
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <Heart className="h-3 w-3 text-primary" />
              <span>For cinephiles, by cinephiles</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">
              Smart Recommendations
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Discover Your Next
            <span className="block text-gradient-ocean">Favorite Film</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Connect your Letterboxd profile or select seed movies to get
            personalized recommendations powered by AI
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Letterboxd Username Card */}
          <Card
            className={`glass-card border-gradient card-lift transition-all duration-500 animate-fade-in-up stagger-1 ${
              hasSeedMovies ? "opacity-40 pointer-events-none" : ""
            }`}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <span>Letterboxd Username</span>
              </CardTitle>
              <CardDescription className="text-base ml-12">
                Enter your Letterboxd username to analyze your taste and get
                personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 ml-12">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="e.g., kubrickfan"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    disabled={hasSeedMovies}
                    className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* OR Divider */}
          <div className="flex items-center gap-4 py-2 animate-fade-in-up stagger-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-muted-foreground text-sm font-medium px-4 py-1 rounded-full border border-border/50 bg-card/50">
              OR
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* Seed Movies Card */}
          <Card
            className={`glass-card border-gradient card-lift transition-all duration-500 animate-fade-in-up stagger-3 ${
              hasUsername ? "opacity-40 pointer-events-none" : ""
            }`}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Film className="h-5 w-5 text-primary" />
                </div>
                <span>Seed Movies</span>
              </CardTitle>
              <CardDescription className="text-base ml-12">
                Add movies you love to discover similar films and hidden gems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 ml-12">
                {seedMovies.map((movie, index) => (
                  <div
                    key={movie.id}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <MovieCard
                      title={movie.title}
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
              {seedMovies.length === 0 && !hasUsername && (
                <p className="text-center text-muted-foreground text-sm mt-8 py-4 border border-dashed border-border/50 rounded-lg ml-12">
                  Click the + button to add movies you enjoy
                </p>
              )}
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-center animate-fade-in">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-6 animate-fade-in-up stagger-4">
            <Button
              size="lg"
              onClick={handleGetRecommendations}
              disabled={!canSubmit || isLoading}
              className="min-w-[260px] h-14 text-base btn-primary-glow bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Finding Gems...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Discover Movies
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-4xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up stagger-5">
          {[
            {
              icon: User,
              title: "Letterboxd Sync",
              description:
                "Seamlessly integrates with your Letterboxd profile for accurate recommendations",
            },
            {
              icon: Sparkles,
              title: "AI-Powered",
              description:
                "Advanced algorithms analyze your taste to find films you'll love",
            },
            {
              icon: Film,
              title: "Discover Gems",
              description:
                "Uncover hidden masterpieces and cult classics tailored to you",
            },
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="text-center p-6 rounded-xl bg-card/30 border border-border/30 hover:border-primary/20 transition-colors"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/30 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Clapperboard className="h-5 w-5 text-primary/60" />
              <span className="text-sm text-muted-foreground">
                © 2026 Lensboxd. Not affiliated with Letterboxd.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Made for film lovers</span>
            </div>
          </div>
        </div>
      </footer>

      <MovieSearchModal
        open={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectMovie={handleAddMovie}
      />
    </div>
  );
};

export default Index;
