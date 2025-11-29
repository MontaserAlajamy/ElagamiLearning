import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { ContrastMode, FontSize } from '../types';
import { Settings, Home, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { contrastMode, toggleContrast, fontSize, increaseFont } = useAccessibility();
  const isHighContrast = contrastMode === ContrastMode.HIGH_CONTRAST;
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <div className={`min-h-screen flex flex-col ${isHighContrast ? 'bg-black text-yellow-400' : 'bg-gray-50 text-gray-900'}`}>
      {/* Accessible Sticky Header */}
      <header className={`sticky top-0 z-50 p-4 border-b-4 shadow-sm flex justify-between items-center ${
        isHighContrast ? 'bg-gray-900 border-yellow-400' : 'bg-white border-blue-600'
      }`}>
        <div className="flex items-center gap-4">
          {!isHome && (
            <button 
              onClick={() => navigate(-1)}
              className={`p-3 rounded-lg border-2 ${isHighContrast ? 'border-yellow-400 hover:bg-gray-800' : 'border-blue-200 hover:bg-blue-50'}`}
              aria-label="Go Back"
            >
              <ArrowLeft size={32} />
            </button>
          )}
          <button 
            onClick={() => navigate('/')}
            className={`p-3 rounded-lg border-2 ${isHighContrast ? 'border-yellow-400 hover:bg-gray-800' : 'border-blue-200 hover:bg-blue-50'}`}
            aria-label="Go Home"
          >
            <Home size={32} />
          </button>
          <h1 className={`font-bold hidden sm:block ${fontSize}`}>TeacherAssist</h1>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={increaseFont}
            className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 w-20 ${
              isHighContrast ? 'border-white text-white' : 'border-gray-300 bg-gray-100'
            }`}
          >
            <span className="text-2xl font-bold">A</span>
            <span className="text-xs font-bold">SIZE</span>
          </button>

          <button 
            onClick={toggleContrast}
            className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 w-20 ${
              isHighContrast ? 'bg-yellow-400 text-black border-black' : 'bg-black text-white border-gray-600'
            }`}
          >
            <Settings size={24} />
            <span className="text-xs font-bold">COLOR</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-6 mx-auto w-full max-w-5xl">
        {children}
      </main>
    </div>
  );
};