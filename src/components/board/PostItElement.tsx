
import React, { useState, useRef, useEffect } from "react";
import { Trash, Move } from "lucide-react";
import { Element } from "@/contexts/BoardContext";

interface PostItElementProps {
  element: Element;
  isSelected: boolean;
  scale: number;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onUpdate: (updates: Partial<Element>) => void;
  readOnly?: boolean;
}

const PostItElement: React.FC<PostItElementProps> = ({
  element,
  isSelected,
  scale,
  onSelect,
  onMove,
  onUpdate,
  readOnly = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Default color if none specified
  const color = element.color || "#FEF7CD";
  
  useEffect(() => {
    // Stop editing when element is deselected
    if (!isSelected && isEditing) {
      setIsEditing(false);
    }
  }, [isSelected, isEditing]);
  
  // Handle click on the post-it
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };
  
  // Handle start of drag
  const handleDragStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  // Handle dragging
  const handleDrag = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const dx = (e.clientX - dragStart.x) / scale;
    const dy = (e.clientY - dragStart.y) / scale;
    
    onMove(element.x + dx, element.y + dy);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  // Handle end of drag
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  // Handle content change
  const handleContentChange = () => {
    if (contentRef.current) {
      onUpdate({
        content: contentRef.current.innerText,
      });
    }
  };
  
  // Handle double click to edit
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (readOnly) return;
    e.stopPropagation();
    setIsEditing(true);
    if (contentRef.current) {
      contentRef.current.focus();
    }
  };
  
  // Handle delete
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ x: -10000 }); // Move off-screen first (visual feedback)
    setTimeout(() => {
      // Then actually delete
      onUpdate({ width: 0, height: 0 });
    }, 200);
  };
  
  return (
    <div
      className={`post-it board-element ${isSelected ? "ring-2 ring-primary" : ""}`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        backgroundColor: color,
        zIndex: element.zIndex,
        transform: `rotate(${element.rotation || 0}deg)`,
        transition: isDragging ? "none" : "all 0.2s ease",
      }}
      onClick={handleClick}
      onMouseDown={handleDragStart}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onDoubleClick={handleDoubleClick}
    >
      {/* Header with drag handle */}
      <div className="absolute top-1 left-1 right-1 h-5 flex justify-between items-center">
        <div 
          className="cursor-move h-5 w-5 flex items-center justify-center rounded hover:bg-black/10"
          onMouseDown={handleDragStart}
        >
          <Move size={14} className="text-black/60" />
        </div>
        
        {isSelected && !readOnly && (
          <button
            className="h-5 w-5 flex items-center justify-center rounded hover:bg-black/10 text-black/60"
            onClick={handleDelete}
          >
            <Trash size={14} />
          </button>
        )}
      </div>
      
      {/* Content */}
      <div
        ref={contentRef}
        className="pt-6 px-2 pb-2 h-full w-full overflow-auto break-words"
        contentEditable={isEditing && !readOnly}
        suppressContentEditableWarning
        onBlur={() => {
          setIsEditing(false);
          handleContentChange();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.ctrlKey) {
            e.currentTarget.blur();
          }
        }}
      >
        {element.content || "Double-cliquez pour éditer"}
      </div>
      
      {/* Footer with author */}
      <div className="absolute bottom-1 right-2 text-xs text-black/60">
        {element.createdBy}
      </div>
    </div>
  );
};

export default PostItElement;
