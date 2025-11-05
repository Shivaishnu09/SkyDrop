import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, Plus, LogIn, LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetcher } from "@/lib/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [roomPassword, setRoomPassword] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await fetcher("http://localhost:3001/me");
        setUser(userData);
      } catch (error) {
        navigate("/auth");
      }
    };
    getUser();
  }, [navigate]);

  const handleCreateRoom = async () => {
    if (!user) {
      navigate("/auth?mode=signup");
      return;
    }

    setLoading(true);
    try {
      const room = await fetcher("http://localhost:3001/rooms", {
        method: "POST",
        body: JSON.stringify({ host_id: user.id }),
      });

      navigate("/room-created", { state: { createdRoom: { code: room.room_code, password: room.room_password, id: room.id } } });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.info?.message || "Failed to create room",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/auth?mode=signup");
      return;
    }

    setLoading(true);
    try {
      const room = await fetcher("http://localhost:3001/rooms/join", {
        method: "POST",
        body: JSON.stringify({ room_code: roomCode.toUpperCase(), room_password: roomPassword, user_id: user.id }),
      });
      navigate(`/room/${room.id}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.info?.message || "Invalid room code or password",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetcher("http://localhost:3001/logout", { method: "POST" });
    } catch (error) {
      // Ignore errors on logout
    }
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Sky Drop
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground px-3 py-2 bg-secondary/50 rounded-lg backdrop-blur-sm">
                <User className="w-4 h-4 text-primary" />
                <span className="font-medium">{user.email}</span>
              </div>
            )}
            {user ? (
              <Button variant="ghost" onClick={handleLogout} className="hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button variant="hero" onClick={() => navigate("/auth")} className="shadow-lg">
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-pink-500 bg-clip-text text-transparent">Your Dashboard</h2>
            <p className="text-muted-foreground text-lg">
              Create a new room or join an existing one to start sharing files
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Create Room Card */}
            <Card className="group relative p-8 hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary backdrop-blur-sm bg-card/90 hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative text-center space-y-6 animate-fade-in">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 animate-glow">
                  <Plus className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Create Room</h3>
                  <p className="text-sm text-muted-foreground">
                    Start a new temporary room and invite others to share files
                  </p>
                </div>
                <Button
                  size="lg"
                  variant="hero"
                  className="w-full shadow-xl hover:shadow-2xl"
                  onClick={handleCreateRoom}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create New Room"}
                </Button>
              </div>
            </Card>

            {/* Join Room Card */}
            <Card className="group relative p-8 hover:shadow-2xl transition-all duration-500 border-2 hover:border-success backdrop-blur-sm bg-card/90 hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative text-center space-y-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-success to-emerald-400 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <LogIn className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-success to-emerald-400 bg-clip-text text-transparent">Join Room</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter a room code and password to join an existing room
                  </p>
                </div>
                <form onSubmit={handleJoinRoom} className="space-y-4">
                  <div className="space-y-2 text-left">
                    <Label htmlFor="roomCode">Room Code</Label>
                    <Input
                      id="roomCode"
                      placeholder="ABC123"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value)}
                      required
                      className="text-center font-mono text-lg"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <Label htmlFor="roomPassword">Password</Label>
                    <Input
                      id="roomPassword"
                      type="password"
                      placeholder="••••••••"
                      value={roomPassword}
                      onChange={(e) => setRoomPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    variant="success"
                    className="w-full"
                    disabled={loading}
                  >
                    Join Room
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;