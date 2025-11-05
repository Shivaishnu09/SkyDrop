import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Lock, Timer, Zap } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Sky Drop
            </h1>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate("/auth?mode=login")} className="hover:bg-primary/10">
              Login
            </Button>
            <Button variant="hero" onClick={() => navigate("/auth?mode=signup")} className="shadow-lg">
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-pink-500/5 blur-3xl -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
          <div className="inline-block animate-float">
            <div className="px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 text-primary text-sm font-medium mb-4 shadow-lg">
              ✨ Instant File Sharing
            </div>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-pink-500 bg-clip-text text-transparent leading-tight animate-fade-in">
            Share files instantly and securely through private rooms
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            No permanent storage. No waiting. No complexity. Connect through a shared Room ID and exchange files in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Button size="lg" variant="hero" onClick={() => navigate("/auth?mode=signup")} className="animate-glow">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/dashboard")} className="backdrop-blur-sm hover:bg-primary/5">
              Try Demo
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 max-w-6xl mx-auto">
          <Card className="group p-6 hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 backdrop-blur-sm bg-card/80 hover:-translate-y-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Share2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">Room-Based Sharing</h3>
            <p className="text-sm text-muted-foreground">
              Create private rooms with unique IDs and passwords. Share with anyone instantly.
            </p>
          </Card>

          <Card className="group p-6 hover:shadow-2xl transition-all duration-500 border-2 hover:border-accent/50 backdrop-blur-sm bg-card/80 hover:-translate-y-2" style={{ animationDelay: "0.1s" }}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">Real-Time Transfer</h3>
            <p className="text-sm text-muted-foreground">
              Files transfer instantly with live progress tracking. See updates as they happen.
            </p>
          </Card>

          <Card className="group p-6 hover:shadow-2xl transition-all duration-500 border-2 hover:border-success/50 backdrop-blur-sm bg-card/80 hover:-translate-y-2" style={{ animationDelay: "0.2s" }}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Lock className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-success transition-colors">Private & Secure</h3>
            <p className="text-sm text-muted-foreground">
              Password-protected rooms with end-to-end security. Your data stays private.
            </p>
          </Card>

          <Card className="group p-6 hover:shadow-2xl transition-all duration-500 border-2 hover:border-pink-500/50 backdrop-blur-sm bg-card/80 hover:-translate-y-2" style={{ animationDelay: "0.3s" }}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-500/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Timer className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-pink-500 transition-colors">Auto-Expiring</h3>
            <p className="text-sm text-muted-foreground">
              Rooms expire after 30 minutes. No permanent storage means no permanent risk.
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Sky Drop. Fast, Private, Temporary File Sharing.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
