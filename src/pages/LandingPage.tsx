
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ParticipantForm } from "@/components/auth/ParticipantForm";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-10 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              InfinityBoard
            </h1>
            <p className="text-xl mb-8">
              Un espace collaboratif infini pour visualiser vos idées et travailler en équipe.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                    Accéder à mes tableaux
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                      Se connecter
                    </Button>
                  </Link>
                  <Link to="/join">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      Rejoindre un tableau
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="bg-white rounded-lg shadow-xl p-4 transform rotate-3 animate-float">
                <div className="bg-postit-yellow h-20 w-32 absolute top-8 left-8 shadow-md z-10 rounded-sm transform -rotate-6"></div>
                <div className="bg-postit-blue h-24 w-36 absolute top-16 right-12 shadow-md z-20 rounded-sm transform rotate-3"></div>
                <div className="bg-postit-green h-28 w-32 absolute bottom-12 left-20 shadow-md z-30 rounded-sm transform rotate-12"></div>
                <div className="bg-white rounded-lg p-4 border-2 border-gray-200 h-64 w-full">
                  <div className="border-b-2 border-dashed border-gray-200 w-full h-8 mb-4"></div>
                  <div className="flex flex-wrap gap-2">
                    <div className="h-6 w-20 bg-gray-100 rounded"></div>
                    <div className="h-6 w-32 bg-gray-100 rounded"></div>
                    <div className="h-6 w-16 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tableau infini</h3>
              <p className="text-gray-600">
                Zoomez, déplacez-vous et organisez vos idées sans limites dans un espace de travail infini.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaboration en temps réel</h3>
              <p className="text-gray-600">
                Invitez des participants et collaborez en temps réel sur vos projets, brainstorming et ateliers.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Éléments visuels</h3>
              <p className="text-gray-600">
                Créez et manipulez facilement des post-its, des formes, du texte et des images.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Join a board section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Rejoindre un tableau</h2>
            <p className="text-gray-600 mb-8">
              Vous avez reçu un lien pour rejoindre un tableau existant ? Entrez votre pseudo pour participer à la collaboration.
            </p>
            <ParticipantForm />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">InfinityBoard</h2>
              <p className="text-gray-400">Collaborez sans limites</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-400">À propos</a>
              <a href="#" className="hover:text-blue-400">Contact</a>
              <a href="#" className="hover:text-blue-400">Mentions légales</a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} InfinityBoard. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
