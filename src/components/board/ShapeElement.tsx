
import React, { useState, useRef } from "react";
import { Trash, Move } from "lucide-react";
import { Element } from "@/contexts/BoardContext";

interface ShapeElementProps {
  element: Element;
  isSelected: boolean;
  scale: number;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onUpdate: (updates: Partial<Element>) => void;
  readOnly?: boolean;
}

const ShapeElement: React.FC<ShapeElementProps> = ({
  element,
  isSelected,
  scale,
  onSelect,
  onMove,
  onUpdate,
  readOnly = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Default color if none specified
  const color = element.color || "#D3E4FD";
  const shapeType = element.shapeType || "rectangle";
  
  // Handle click on the shape
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
  
  // Handle delete
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ x: -10000 }); // Move off-screen first (visual feedback)
    setTimeout(() => {
      // Then actually delete
      onUpdate({ width: 0, height: 0 });
    }, 200);
  };
  
  // Render the appropriate shape
  const renderShape = () => {
    switch (shapeType) {
      case "circle":
        return (
          <div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: color }}
          />
        );
      case "triangle":
        return (
          <div
            className="absolute inset-0"
            style={{
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              backgroundColor: color,
            }}
          />
        );
      case "rectangle":
      default:
        return (
          <div
            className="absolute inset-0 rounded-md"
            style={{ backgroundColor: color }}
          />
        );
    }
  };
  
  return (
    <div
      className={`shape board-element ${isSelected ? "ring-2 ring-primary" : ""}`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        zIndex: element.zIndex,
        transform: `rotate(${element.rotation || 0}deg)`,
        transition: isDragging ? "none" : "all 0.2s ease",
      }}
      onClick={handleClick}
      onMouseDown={handleDragStart}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {renderShape()}
      
      {isSelected && !readOnly && (
        <div className="absolute top-1 right-1 flex space-x-1">
          <button
            className="h-5 w-5 flex items-center justify-center rounded bg-white/70 hover:bg-white/90 text-black/60"
            onClick={handleDelete}
          >
            <Trash size={14} />
          </button>
        </div>
      )}
      
      {isSelected && (
        <div
          className="absolute top-1 left-1 h-5 w-5 flex items-center justify-center rounded bg-white/70 hover:bg-white/90 text-black/60 cursor-move"
          onMouseDown={handleDragStart}
        >
          <Move size={14} />
        </div>
      )}
    </div>
  );
};

export default ShapeElement;
