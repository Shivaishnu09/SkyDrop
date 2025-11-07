import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetcher } from "@/lib/api";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<"login" | "signup">(
    (searchParams.get("mode") as "login" | "signup") || "login"
  );
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        await fetcher("/me");
        navigate("/dashboard");
      } catch (error) {
        // Not logged in
      }
    };
    checkUser();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = mode === 'signup' ? '/signup' : '/login';
    const body = mode === 'signup' ? { email, password, username } : { email, password };

    try {
      const data = await fetcher(url, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (mode === 'signup') {
        toast({
          title: "Account created!",
          description: "You can now log in.",
        });
        setMode('login');
      } else {
        localStorage.setItem('token', data.token);
        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        variant: "destructive",
        title: mode === 'login' ? "Login failed" : "Sign up failed",
        description: error.info?.message || 
                    (error.status === 401 ? "Invalid email or password" : 
                     error.status === 400 ? "Please check your input" :
                     "An unexpected error occurred"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl backdrop-blur-sm bg-card/95 border-2 animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl mb-4 animate-glow">
            <Share2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Sky Drop
          </h1>
          <p className="text-muted-foreground">
            {mode === "login" ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="username">Username (optional)</Label>
              <Input
                id="username"
                placeholder="Your display name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            variant="hero"
            disabled={loading}
          >
            {loading ? "Loading..." : mode === "login" ? "Login" : "Sign Up"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-sm text-primary hover:underline"
          >
            {mode === "login"
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to home
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
