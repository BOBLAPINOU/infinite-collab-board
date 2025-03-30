
import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ParticipantForm } from "@/components/auth/ParticipantForm";
import { useAuth } from "@/contexts/AuthContext";

const JoinBoard = () => {
  const { boardId } = useParams<{ boardId?: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // If already authenticated, redirect to the board
  useEffect(() => {
    if (isAuthenticated && boardId) {
      navigate(`/board/${boardId}`);
    }
  }, [isAuthenticated, boardId, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Rejoindre un tableau</h1>
          <p className="mt-2 text-gray-600">
            Choisissez un pseudo pour participer à la collaboration
          </p>
        </div>
        
        <ParticipantForm boardId={boardId} />
        
        <div className="text-center mt-4">
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JoinBoard;
