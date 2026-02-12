import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clapperboard, Home, Film } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="text-center relative z-10 max-w-md mx-auto px-4">
        {/* Icon */}
        <div className="relative inline-flex mb-8">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
          <div className="relative p-6 rounded-2xl bg-card/50 border border-border/30">
            <Film className="h-16 w-16 text-primary/60" />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-7xl font-bold text-gradient-ocean mb-4">404</h1>
        
        {/* Title */}
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Scene Not Found
        </h2>
        
        {/* Description */}
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The movie you're looking for seems to have been cut from the final edit. 
          Let's get you back to the main feature.
        </p>

        {/* Button */}
        <Button 
          onClick={() => navigate('/')}
          size="lg"
          className="btn-primary-glow"
        >
          <Home className="h-4 w-4 mr-2" />
          Return to Home
        </Button>

        {/* Footer branding */}
        <div className="mt-12 flex items-center justify-center gap-2 text-muted-foreground/60">
          <Clapperboard className="h-4 w-4" />
          <span className="text-sm">Lensboxd</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
