
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Board } from "@/contexts/BoardContext";
import { StickyNote, Calendar, Trash, PenSquare } from "lucide-react";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";

interface BoardCardProps {
  board: Board;
  onDelete: (id: string) => void;
  onEdit: (board: Board) => void;
}

export const BoardCard: React.FC<BoardCardProps> = ({ board, onDelete, onEdit }) => {
  const postItCount = board.elements.filter((el) => el.type === "postit").length;
  const lastUpdate = formatDistance(new Date(board.updatedAt), new Date(), {
    addSuffix: true,
    locale: fr,
  });
  
  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-start">
          <div className="truncate">{board.title}</div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(board)}>
              <PenSquare size={16} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(board.id)}>
              <Trash size={16} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="flex items-center space-x-4 text-muted-foreground mb-2">
          <div className="flex items-center">
            <StickyNote size={14} className="mr-1" />
            <span>{postItCount} post-its</span>
          </div>
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{lastUpdate}</span>
          </div>
        </div>
        {board.description && (
          <p className="text-muted-foreground line-clamp-2">
            {board.description}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Link to={`/board/${board.id}`} className="w-full">
          <Button variant="default" className="w-full">
            Ouvrir
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
