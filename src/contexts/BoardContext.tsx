
import React, { createContext, useContext, useReducer, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

// Types
export type ElementType = "postit" | "shape" | "text" | "image" | "file";

export type ShapeType = "rectangle" | "circle" | "triangle" | "arrow";

export type Element = {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  color?: string;
  zIndex: number;
  createdBy: string;
  createdAt: Date;
  rotation?: number;
  shapeType?: ShapeType;
  url?: string;
};

export type Board = {
  id: string;
  title: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isParticipationEnabled: boolean;
  elements: Element[];
  participantCount?: number;
};

// Actions
type Action =
  | { type: "SET_BOARDS"; payload: Board[] }
  | { type: "ADD_BOARD"; payload: Board }
  | { type: "UPDATE_BOARD"; payload: { id: string; updates: Partial<Board> } }
  | { type: "DELETE_BOARD"; payload: string }
  | { type: "ADD_ELEMENT"; payload: { boardId: string; element: Element } }
  | { type: "UPDATE_ELEMENT"; payload: { boardId: string; elementId: string; updates: Partial<Element> } }
  | { type: "DELETE_ELEMENT"; payload: { boardId: string; elementId: string } }
  | { type: "SET_ACTIVE_BOARD"; payload: string | null };

// Initial state
interface BoardState {
  boards: Board[];
  activeBoardId: string | null;
}

const initialState: BoardState = {
  boards: [],
  activeBoardId: null,
};

// Reducer
function boardReducer(state: BoardState, action: Action): BoardState {
  switch (action.type) {
    case "SET_BOARDS":
      return { ...state, boards: action.payload };
    
    case "ADD_BOARD":
      return { ...state, boards: [...state.boards, action.payload] };
    
    case "UPDATE_BOARD":
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.payload.id
            ? { ...board, ...action.payload.updates, updatedAt: new Date() }
            : board
        ),
      };
    
    case "DELETE_BOARD":
      return {
        ...state,
        boards: state.boards.filter((board) => board.id !== action.payload),
        activeBoardId: state.activeBoardId === action.payload ? null : state.activeBoardId,
      };
    
    case "ADD_ELEMENT":
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.payload.boardId
            ? {
                ...board,
                elements: [...board.elements, action.payload.element],
                updatedAt: new Date(),
              }
            : board
        ),
      };
    
    case "UPDATE_ELEMENT":
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.payload.boardId
            ? {
                ...board,
                elements: board.elements.map((element) =>
                  element.id === action.payload.elementId
                    ? { ...element, ...action.payload.updates }
                    : element
                ),
                updatedAt: new Date(),
              }
            : board
        ),
      };
    
    case "DELETE_ELEMENT":
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.payload.boardId
            ? {
                ...board,
                elements: board.elements.filter(
                  (element) => element.id !== action.payload.elementId
                ),
                updatedAt: new Date(),
              }
            : board
        ),
      };
    
    case "SET_ACTIVE_BOARD":
      return { ...state, activeBoardId: action.payload };
    
    default:
      return state;
  }
}

// Context
interface BoardContextType {
  boards: Board[];
  activeBoard: Board | null;
  activeBoardId: string | null;
  dispatch: React.Dispatch<Action>;
  createBoard: (title: string, description?: string) => string;
  getBoard: (id: string) => Board | undefined;
  deleteBoard: (id: string) => void;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  addElement: (boardId: string, element: Omit<Element, "id" | "createdAt" | "createdBy" | "zIndex">) => string;
  updateElement: (boardId: string, elementId: string, updates: Partial<Element>) => void;
  deleteElement: (boardId: string, elementId: string) => void;
  setActiveBoard: (id: string | null) => void;
  toggleParticipation: (boardId: string) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

// Provider
export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(boardReducer, initialState);
  const { user } = useAuth();
  
  // Load boards from localStorage on initial render
  useEffect(() => {
    const savedBoards = localStorage.getItem("infinityboard_boards");
    if (savedBoards) {
      try {
        const parsedBoards = JSON.parse(savedBoards);
        // Convert string dates to Date objects
        const boardsWithDates = parsedBoards.map((board: any) => ({
          ...board,
          createdAt: new Date(board.createdAt),
          updatedAt: new Date(board.updatedAt),
          elements: board.elements.map((element: any) => ({
            ...element,
            createdAt: new Date(element.createdAt),
          })),
        }));
        dispatch({ type: "SET_BOARDS", payload: boardsWithDates });
      } catch (error) {
        console.error("Failed to parse boards from localStorage:", error);
      }
    }
  }, []);

  // Save boards to localStorage whenever state.boards changes
  useEffect(() => {
    localStorage.setItem("infinityboard_boards", JSON.stringify(state.boards));
  }, [state.boards]);

  // Get the active board
  const activeBoard = state.activeBoardId
    ? state.boards.find((board) => board.id === state.activeBoardId) || null
    : null;

  // Create a new board
  const createBoard = (title: string, description?: string): string => {
    if (!user) {
      toast.error("Vous devez être connecté pour créer un tableau");
      return "";
    }

    const newBoard: Board = {
      id: `board-${Date.now()}`,
      title,
      description,
      createdBy: user.username,
      createdAt: new Date(),
      updatedAt: new Date(),
      isParticipationEnabled: true,
      elements: [],
      participantCount: 1, // Creator
    };

    dispatch({ type: "ADD_BOARD", payload: newBoard });
    toast.success("Tableau créé avec succès");
    return newBoard.id;
  };

  // Get a board by id
  const getBoard = (id: string): Board | undefined => {
    return state.boards.find((board) => board.id === id);
  };

  // Delete a board
  const deleteBoard = (id: string): void => {
    dispatch({ type: "DELETE_BOARD", payload: id });
    toast.success("Tableau supprimé");
  };

  // Update a board
  const updateBoard = (id: string, updates: Partial<Board>): void => {
    dispatch({ type: "UPDATE_BOARD", payload: { id, updates } });
  };

  // Add an element to a board
  const addElement = (
    boardId: string,
    element: Omit<Element, "id" | "createdAt" | "createdBy" | "zIndex">
  ): string => {
    if (!user) {
      toast.error("Vous devez être connecté pour ajouter un élément");
      return "";
    }

    const board = getBoard(boardId);
    if (!board) {
      toast.error("Tableau introuvable");
      return "";
    }

    // Calculate highest zIndex and add 1
    const highestZIndex = board.elements.length > 0
      ? Math.max(...board.elements.map(el => el.zIndex))
      : 0;

    const newElement: Element = {
      ...element,
      id: `element-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdBy: user.username,
      createdAt: new Date(),
      zIndex: highestZIndex + 1,
    };

    dispatch({
      type: "ADD_ELEMENT",
      payload: { boardId, element: newElement },
    });

    return newElement.id;
  };

  // Update an element
  const updateElement = (
    boardId: string,
    elementId: string,
    updates: Partial<Element>
  ): void => {
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: { boardId, elementId, updates },
    });
  };

  // Delete an element
  const deleteElement = (boardId: string, elementId: string): void => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { boardId, elementId },
    });
  };

  // Set the active board
  const setActiveBoard = (id: string | null): void => {
    dispatch({ type: "SET_ACTIVE_BOARD", payload: id });
  };

  // Toggle participation mode for a board
  const toggleParticipation = (boardId: string): void => {
    const board = getBoard(boardId);
    if (board) {
      updateBoard(boardId, {
        isParticipationEnabled: !board.isParticipationEnabled,
      });
      toast.success(
        `Mode participatif ${board.isParticipationEnabled ? "désactivé" : "activé"}`
      );
    }
  };

  return (
    <BoardContext.Provider
      value={{
        boards: state.boards,
        activeBoard,
        activeBoardId: state.activeBoardId,
        dispatch,
        createBoard,
        getBoard,
        deleteBoard,
        updateBoard,
        addElement,
        updateElement,
        deleteElement,
        setActiveBoard,
        toggleParticipation,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

// Hook
export const useBoard = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
};
