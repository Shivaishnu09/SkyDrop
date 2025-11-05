import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Copy, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RoomCreated = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createdRoom } = location.state || {};

  if (!createdRoom) {
    navigate("/dashboard");
    return null;
  }

  const { code, password, id } = createdRoom;

  const handleCopy = () => {
    const textToCopy = `Room Code: ${code}\nPassword: ${password}`;
    navigator.clipboard.writeText(textToCopy);
    toast({ title: "Copied to clipboard!" });
  };

  const handleShare = () => {
    const shareData = {
      title: "Sky Drop Room Invitation",
      text: `Join my Sky Drop room!\nRoom Code: ${code}\nPassword: ${password}`,
      url: window.location.origin,
    };
    navigator.share(shareData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl backdrop-blur-sm bg-card/95 border-2 animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl mb-4 animate-glow">
            <Share2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Room Created!
          </h1>
          <p className="text-muted-foreground">
            Share the credentials with others to join the room.
          </p>
        </div>

        <div className="space-y-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Room Code</p>
            <p className="text-2xl font-bold font-mono">{code}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Password</p>
            <p className="text-2xl font-bold font-mono">{password}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        <div className="mt-4">
          <Button className="w-full" onClick={() => navigate(`/room/${id}`)}>
            <LogIn className="w-4 h-4 mr-2" />
            Enter Room
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>This room will expire in 30 minutes.</p>
        </div>
      </Card>
    </div>
  );
};

export default RoomCreated;