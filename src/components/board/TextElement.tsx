
import React, { useState, useRef, useEffect } from "react";
import { Trash, Move } from "lucide-react";
import { Element } from "@/contexts/BoardContext";

interface TextElementProps {
  element: Element;
  isSelected: boolean;
  scale: number;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onUpdate: (updates: Partial<Element>) => void;
  readOnly?: boolean;
}

const TextElement: React.FC<TextElementProps> = ({
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
  const color = element.color || "#000000";
  
  useEffect(() => {
    // Stop editing when element is deselected
    if (!isSelected && isEditing) {
      setIsEditing(false);
    }
  }, [isSelected, isEditing]);
  
  // Handle click on the text
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
      className={`text-block board-element ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        minHeight: `${element.height}px`,
        zIndex: element.zIndex,
        color: color,
        transform: `rotate(${element.rotation || 0}deg)`,
        transition: isDragging ? "none" : "all 0.2s ease",
      }}
      onClick={handleClick}
      onMouseDown={isDragging ? handleDrag : undefined}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onDoubleClick={handleDoubleClick}
    >
      {isSelected && !readOnly && (
        <div className="absolute -top-6 right-0 flex space-x-1">
          <button
            className="h-5 w-5 flex items-center justify-center rounded bg-white shadow text-black/60"
            onClick={handleDelete}
          >
            <Trash size={14} />
          </button>
        </div>
      )}
      
      {isSelected && (
        <div
          className="absolute -top-6 left-0 h-5 w-5 flex items-center justify-center rounded bg-white shadow text-black/60 cursor-move"
          onMouseDown={handleDragStart}
        >
          <Move size={14} />
        </div>
      )}
      
      <div
        ref={contentRef}
        className="h-full w-full p-2 overflow-auto break-words"
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
    </div>
  );
};

export default TextElement;
