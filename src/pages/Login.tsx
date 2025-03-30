
import React from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">InfinityBoard</h1>
          <p className="mt-2 text-gray-600">Connectez-vous pour accéder à vos tableaux</p>
        </div>
        
        <LoginForm />
        
        <div className="text-center mt-4">
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
