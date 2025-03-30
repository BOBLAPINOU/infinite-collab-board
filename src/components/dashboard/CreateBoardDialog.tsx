
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBoard } from "@/contexts/BoardContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Board } from "@/contexts/BoardContext";
import { toast } from "sonner";

interface CreateBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingBoard?: Board | null;
}

export const CreateBoardDialog: React.FC<CreateBoardDialogProps> = ({
  open,
  onOpenChange,
  editingBoard,
}) => {
  const [title, setTitle] = useState(editingBoard?.title || "");
  const [description, setDescription] = useState(editingBoard?.description || "");
  const { createBoard, updateBoard } = useBoard();
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Le titre est requis");
      return;
    }
    
    if (editingBoard) {
      updateBoard(editingBoard.id, { title, description });
      toast.success("Tableau mis à jour");
    } else {
      const boardId = createBoard(title, description);
      if (boardId) {
        navigate(`/board/${boardId}`);
      }
    }
    
    onOpenChange(false);
  };
  
  const resetForm = () => {
    if (!editingBoard) {
      setTitle("");
      setDescription("");
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {editingBoard ? "Modifier le tableau" : "Créer un nouveau tableau"}
            </DialogTitle>
            <DialogDescription>
              {editingBoard 
                ? "Modifiez les informations de votre tableau."
                : "Créez un nouvel espace de collaboration visuelle."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                placeholder="Mon tableau collaboratif"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnelle)</Label>
              <Textarea
                id="description"
                placeholder="Une description pour votre tableau..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {editingBoard ? "Mettre à jour" : "Créer le tableau"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
