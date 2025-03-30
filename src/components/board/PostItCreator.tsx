
import React, { useState } from "react";
import { Plus, StickyNote } from "lucide-react";
import { useBoard } from "@/contexts/BoardContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface PostItCreatorProps {
  boardId: string;
}

export const PostItCreator: React.FC<PostItCreatorProps> = ({ boardId }) => {
  const { addElement } = useBoard();
  const [isOpen, setIsOpen] = useState(false);
  
  const colors = [
    { name: "Jaune", value: "#FEF7CD" },
    { name: "Bleu", value: "#D3E4FD" },
    { name: "Vert", value: "#F2FCE2" },
    { name: "Rose", value: "#FFDEE2" },
    { name: "Violet", value: "#E5DEFF" },
    { name: "Orange", value: "#FEC6A1" },
  ];
  
  const createPostIt = (color: string) => {
    const centeredX = (window.innerWidth / 2) - 75; // 75 = half the width of post-it
    const centeredY = (window.innerHeight / 2) - 75; // 75 = half the height of post-it
    
    const id = addElement(boardId, {
      type: "postit",
      x: centeredX,
      y: centeredY,
      width: 150,
      height: 150,
      content: "",
      color,
      rotation: Math.random() * 6 - 3, // Slight random rotation (-3 to +3 degrees)
    });
    
    setIsOpen(false);
    toast.success("Post-it créé !");
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow">
            <Plus size={24} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="p-2 text-center font-medium">Nouveau Post-it</div>
          <div className="grid grid-cols-3 gap-1 p-2">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => createPostIt(color.value)}
                className="w-12 h-12 rounded-md flex items-center justify-center hover:scale-110 transition-transform"
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                <StickyNote className="h-6 w-6 text-black/30" />
              </button>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
