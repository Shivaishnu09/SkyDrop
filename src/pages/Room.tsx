import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Share2, Upload, Download, User, Clock, LogOut, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { fetcher } from "@/lib/api";

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [user, setUser] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await fetcher("/me");
        setUser(userData);
      } catch (error) {
        navigate("/auth");
      }
    };
    getUser();
  }, [navigate]);

  useEffect(() => {
    if (!user || !roomId) return;

    const fetchRoomData = async () => {
      try {
        const data = await fetcher(`/rooms/${roomId}`);
        setRoom(data);
        setParticipants(data.participants || []);
        setFiles(data.files || []);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch room data",
        });
        navigate("/dashboard");
      }
    };

    fetchRoomData();

    const interval = setInterval(fetchRoomData, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [user, roomId, navigate, toast]);

  useEffect(() => {
    if (!room) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(room.expires_at).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [room]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || !user || !roomId) return;

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }
    formData.append("user_id", user.id);

    try {
      await fetcher(`/rooms/${roomId}/upload`, {
        method: "POST",
        body: formData,
      });

      toast({
        title: "Files uploaded!",
        description: `Successfully uploaded ${selectedFiles.length} file(s)`,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.info?.message || "An error occurred",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleLeaveRoom = () => {
    navigate("/dashboard");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  if (!room) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Room: {room.room_code}
                </h1>
                <div className="px-3 py-1 bg-success/10 rounded-full text-xs font-medium text-success flex items-center gap-1 shadow-sm backdrop-blur-sm border border-success/20">
                  <Clock className="w-3 h-3" />
                  {timeLeft}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Password: <span className="font-mono font-semibold text-foreground">{room.room_password}</span></p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLeaveRoom} className="hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Leave Room
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Participants Sidebar */}
          <Card className="p-4 h-fit backdrop-blur-sm bg-card/90 border-2 animate-fade-in">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Participants ({participants.length})
            </h3>
            <div className="space-y-2">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-2 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-success to-emerald-400 flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {participant.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {participant.username || "User"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* File Transfer Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Upload Zone */}
            <Card className="group p-8 border-2 border-dashed hover:border-primary transition-all duration-300 backdrop-blur-sm bg-card/90 hover:shadow-2xl animate-fade-in">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Upload Files</h3>
                  <p className="text-sm text-muted-foreground">
                    Drag and drop files or click to browse
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  size="lg"
                  variant="hero"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Select Files"}
                </Button>
                {uploading && (
                  <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                )}
              </div>
            </Card>

            {/* Files List */}
            <Card className="p-6 backdrop-blur-sm bg-card/90 border-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                Shared Files ({files.length})
              </h3>
              <div className="space-y-3">
                {files.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No files shared yet. Upload files to get started!
                  </p>
                ) : (
                  files.map((file) => (
                    <div
                      key={file.id}
                      className="group flex items-center gap-4 p-4 bg-gradient-to-r from-secondary/50 to-secondary/30 rounded-xl hover:from-secondary hover:to-secondary/50 transition-all duration-300 border border-border/50 hover:border-primary/30 hover:shadow-lg"
                    >
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Download className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate text-foreground">{file.file_name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span className="font-medium">{formatFileSize(file.file_size)}</span>
                          <span>•</span>
                          <span>From: <span className="text-primary">{file.sender_id}</span></span>
                        </div>
                      </div>
                      {file.file_type.startsWith("image/") && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="hover:bg-primary hover:text-white transition-colors"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>{file.file_name}</DialogTitle>
                            </DialogHeader>
                            <img src={file.file_url} alt={file.file_name} className="max-w-full h-auto" />
                          </DialogContent>
                        </Dialog>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/download/${file.file_url.split('/').pop()}`}
                        className="hover:bg-primary hover:text-white transition-colors"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Room;
