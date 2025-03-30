
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

type User = {
  username: string;
  isAdmin: boolean;
  avatar?: string;
  email?: string;
};

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerParticipant: (username: string) => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("infinityboard_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("infinityboard_user");
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // For MVP, we'll use a simple hardcoded login (bob/1234)
    if (username === "bob" && password === "1234") {
      const userData: User = {
        username,
        isAdmin: true,
        email: "bob@example.com",
        avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${username}`,
      };
      setUser(userData);
      localStorage.setItem("infinityboard_user", JSON.stringify(userData));
      toast.success("Connexion réussie");
      return true;
    }
    
    toast.error("Identifiants incorrects");
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("infinityboard_user");
    toast.success("Déconnexion réussie");
  };

  const registerParticipant = async (username: string): Promise<boolean> => {
    if (!username.trim()) {
      toast.error("Veuillez entrer un pseudo");
      return false;
    }
    
    const userData: User = {
      username,
      isAdmin: false,
      avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${username}`,
    };
    
    setUser(userData);
    localStorage.setItem("infinityboard_user", JSON.stringify(userData));
    toast.success("Bienvenue, " + username);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        registerParticipant,
        isAuthenticated: !!user,
        isAdmin: !!user?.isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
