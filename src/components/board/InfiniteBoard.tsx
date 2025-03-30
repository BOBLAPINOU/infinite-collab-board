
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBoard, Board, Element } from "@/contexts/BoardContext";
import { BoardControls } from "./BoardControls";
import PostItElement from "./PostItElement";
import ShapeElement from "./ShapeElement";
import TextElement from "./TextElement";
import { PostItCreator } from "./PostItCreator";

const InfiniteBoard: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { user, isAdmin } = useAuth();
  const { getBoard, setActiveBoard, activeBoard, updateElement } = useBoard();
  
  // Board state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  
  // Refs
  const boardRef = useRef<HTMLDivElement>(null);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  
  // Set active board on mount
  useEffect(() => {
    if (boardId) {
      setActiveBoard(boardId);
    }
    
    return () => {
      setActiveBoard(null);
    };
  }, [boardId, setActiveBoard]);
  
  // Handle board not found
  if (!activeBoard && boardId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Tableau introuvable</h1>
        <p>Le tableau que vous cherchez n'existe pas ou a été supprimé.</p>
      </div>
    );
  }
  
  // Handle board loading
  if (!activeBoard) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    // Calculate zoom factor
    const zoomFactor = 0.1;
    const delta = e.deltaY < 0 ? zoomFactor : -zoomFactor;
    const newScale = Math.max(0.1, Math.min(5, scale + delta));
    
    // Calculate mouse position relative to board
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate new position to zoom to cursor
    const x = mouseX - (mouseX - position.x) * (newScale / scale);
    const y = mouseY - (mouseY - position.y) * (newScale / scale);
    
    setScale(newScale);
    setPosition({ x, y });
  };
  
  // Handle mouse down for drag
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag with left mouse button
    if (e.button !== 0) return;
    
    // Don't drag if we're clicking on an element
    if ((e.target as HTMLElement).closest(".board-element")) return;
    
    setIsDragging(true);
    setStartDragPosition({ x: e.clientX, y: e.clientY });
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };
  
  // Handle mouse move for drag
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - lastMousePosition.current.x;
    const dy = e.clientY - lastMousePosition.current.y;
    
    setPosition({
      x: position.x + dx,
      y: position.y + dy,
    });
    
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };
  
  // Handle mouse up for drag
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Handle element selection
  const handleElementSelect = (elementId: string) => {
    setSelectedElement(elementId === selectedElement ? null : elementId);
  };
  
  // Handle element move
  const handleElementMove = (elementId: string, newX: number, newY: number) => {
    updateElement(activeBoard.id, elementId, { x: newX, y: newY });
  };
  
  // Render elements
  const renderElements = () => {
    return activeBoard.elements.map((element) => {
      const isSelected = element.id === selectedElement;
      
      switch (element.type) {
        case "postit":
          return (
            <PostItElement
              key={element.id}
              element={element}
              isSelected={isSelected}
              scale={scale}
              onSelect={() => handleElementSelect(element.id)}
              onMove={(x, y) => handleElementMove(element.id, x, y)}
              onUpdate={(updates) => updateElement(activeBoard.id, element.id, updates)}
              readOnly={!isAdmin && !activeBoard.isParticipationEnabled}
            />
          );
        case "shape":
          return (
            <ShapeElement
              key={element.id}
              element={element}
              isSelected={isSelected}
              scale={scale}
              onSelect={() => handleElementSelect(element.id)}
              onMove={(x, y) => handleElementMove(element.id, x, y)}
              onUpdate={(updates) => updateElement(activeBoard.id, element.id, updates)}
              readOnly={!isAdmin}
            />
          );
        case "text":
          return (
            <TextElement
              key={element.id}
              element={element}
              isSelected={isSelected}
              scale={scale}
              onSelect={() => handleElementSelect(element.id)}
              onMove={(x, y) => handleElementMove(element.id, x, y)}
              onUpdate={(updates) => updateElement(activeBoard.id, element.id, updates)}
              readOnly={!isAdmin}
            />
          );
        default:
          return null;
      }
    });
  };
  
  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <BoardControls
        title={activeBoard.title}
        scale={scale}
        onZoomIn={() => setScale(Math.min(5, scale + 0.1))}
        onZoomOut={() => setScale(Math.max(0.1, scale - 0.1))}
        onZoomReset={() => {
          setScale(1);
          setPosition({ x: 0, y: 0 });
        }}
        isParticipationEnabled={activeBoard.isParticipationEnabled}
        onToggleParticipation={() => {}}
        isAdmin={isAdmin}
        boardId={activeBoard.id}
      />
      
      <div
        className="canvas-container"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          ref={boardRef}
          className="infinite-canvas"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            width: "10000px",
            height: "10000px",
            backgroundSize: `${40 * scale}px ${40 * scale}px`,
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          {renderElements()}
        </div>
      </div>
      
      {/* Post-it creator button - fixed position */}
      {(isAdmin || activeBoard.isParticipationEnabled) && (
        <PostItCreator boardId={activeBoard.id} />
      )}
    </div>
  );
};

export default InfiniteBoard;
