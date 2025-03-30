
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ParticipantFormProps {
  boardId?: string; // Optional boardId to redirect to a specific board
}

export const ParticipantForm: React.FC<ParticipantFormProps> = ({ boardId }) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { registerParticipant } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await registerParticipant(username);
      if (success) {
        if (boardId) {
          navigate(`/board/${boardId}`);
        } else {
          navigate("/"); // Back to home if no board specified
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Rejoindre un board</CardTitle>
        <CardDescription>
          Choisissez un pseudo pour rejoindre ce board collaboratif
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Votre pseudo</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrez votre pseudo"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Un instant..." : "Rejoindre le board"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Vous pourrez participer à la collaboration en tant que {username || "participant"}
        </p>
      </CardFooter>
    </Card>
  );
};
