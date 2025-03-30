
import React, { useState } from "react";
import { useBoard, Board } from "@/contexts/BoardContext";
import { Button } from "@/components/ui/button";
import { BoardCard } from "@/components/dashboard/BoardCard";
import { CreateBoardDialog } from "@/components/dashboard/CreateBoardDialog";
import { Plus, LayoutGrid, List } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Dashboard = () => {
  const { boards, deleteBoard } = useBoard();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [boardToDelete, setBoardToDelete] = useState<string | null>(null);
  
  const handleEditBoard = (board: Board) => {
    setEditingBoard(board);
    setIsCreateDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (boardToDelete) {
      deleteBoard(boardToDelete);
      setBoardToDelete(null);
    }
  };
  
  const sortedBoards = [...boards].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 px-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mes tableaux</h1>
          <div className="flex space-x-2">
            <div className="bg-background border rounded-md p-1 flex">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid size={16} />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List size={16} />
              </Button>
            </div>
            <Button onClick={() => {
              setEditingBoard(null);
              setIsCreateDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau tableau
            </Button>
          </div>
        </div>
        
        {sortedBoards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md">
              <h2 className="text-xl font-semibold mb-2">
                Vous n'avez pas encore de tableau
              </h2>
              <p className="text-muted-foreground mb-6">
                Créez votre premier tableau collaboratif pour commencer à travailler visuellement avec votre équipe.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Créer mon premier tableau
              </Button>
            </div>
          </div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "flex flex-col space-y-4"
          }>
            {sortedBoards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                onDelete={(id) => setBoardToDelete(id)}
                onEdit={handleEditBoard}
              />
            ))}
          </div>
        )}
        
        <CreateBoardDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          editingBoard={editingBoard}
        />
        
        <AlertDialog open={!!boardToDelete} onOpenChange={(isOpen) => !isOpen && setBoardToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Le tableau et tout son contenu seront définitivement supprimés.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Dashboard;
