import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center shadow-2xl backdrop-blur-sm bg-card/90 border-2 animate-scale-in">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/5 flex items-center justify-center mb-6 animate-float">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-6xl font-bold bg-gradient-to-r from-destructive to-pink-500 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Button 
          variant="hero" 
          size="lg" 
          onClick={() => navigate("/")}
          className="w-full shadow-lg"
        >
          <Home className="w-4 h-4 mr-2" />
          Return to Home
        </Button>
      </Card>
    </div>
  );
};

export default NotFound;
