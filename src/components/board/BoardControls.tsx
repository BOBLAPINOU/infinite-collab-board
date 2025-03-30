
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  ZoomIn, 
  ZoomOut, 
  Home, 
  Share, 
  User, 
  Users, 
  QrCode,
  Settings
} from "lucide-react";
import { useBoard } from "@/contexts/BoardContext";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface BoardControlsProps {
  title: string;
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  isParticipationEnabled: boolean;
  onToggleParticipation: () => void;
  isAdmin: boolean;
  boardId: string;
}

export const BoardControls: React.FC<BoardControlsProps> = ({
  title,
  scale,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  isParticipationEnabled,
  onToggleParticipation,
  isAdmin,
  boardId,
}) => {
  const { toggleParticipation } = useBoard();
  const { user } = useAuth();
  
  const shareBoard = () => {
    const shareUrl = `${window.location.origin}/board/${boardId}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast.success("Lien copié dans le presse-papier");
      });
    } else {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success("Lien copié dans le presse-papier");
    }
  };
  
  return (
    <div className="absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm p-2 flex items-center justify-between border-b">
      <div className="flex items-center space-x-4">
        <Link to="/dashboard">
          <Button variant="outline" size="sm">
            <Home className="mr-1 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
        <h1 className="text-xl font-bold truncate max-w-xs">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="bg-white/80 rounded-md flex items-center border px-2 py-1">
          <Button variant="ghost" size="sm" onClick={onZoomOut}>
            <ZoomOut size={16} />
          </Button>
          <span className="mx-2 text-sm">{Math.round(scale * 100)}%</span>
          <Button variant="ghost" size="sm" onClick={onZoomIn}>
            <ZoomIn size={16} />
          </Button>
        </div>
        
        {/* Share Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Share className="mr-1 h-4 w-4" />
              Partager
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Partager ce tableau</DialogTitle>
              <DialogDescription>
                Partagez ce lien pour inviter d'autres personnes à collaborer.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/board/${boardId}`}
                  className="flex-1 p-2 border rounded-md"
                />
                <Button onClick={shareBoard}>Copier</Button>
              </div>
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-md">
                  <QrCode size={150} />
                  <p className="text-center text-sm mt-2">Scannez avec votre téléphone</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Settings for admins */}
        {isAdmin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="mr-1 h-4 w-4" />
                Paramètres
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Paramètres du tableau</DialogTitle>
                <DialogDescription>
                  Configurez les options de votre tableau.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="participation-mode">Mode participatif</Label>
                    <p className="text-sm text-muted-foreground">
                      Permet aux participants de créer et déplacer des Post-its
                    </p>
                  </div>
                  <Switch
                    id="participation-mode"
                    checked={isParticipationEnabled}
                    onCheckedChange={() => toggleParticipation(boardId)}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        {/* User info */}
        <div className="flex items-center space-x-2 bg-white/80 rounded-md border px-3 py-1">
          {isAdmin ? (
            <User size={16} className="text-blue-600" />
          ) : (
            <Users size={16} className="text-green-600" />
          )}
          <span className="text-sm font-medium">{user?.username}</span>
        </div>
      </div>
    </div>
  );
};
