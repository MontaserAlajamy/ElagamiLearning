import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FontSize, ContrastMode } from '../types';

interface AccessibilityContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  contrastMode: ContrastMode;
  toggleContrast: () => void;
  increaseFont: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState<FontSize>(FontSize.LARGE);
  const [contrastMode, setContrastMode] = useState<ContrastMode>(ContrastMode.NORMAL);

  const toggleContrast = () => {
    setContrastMode(prev => prev === ContrastMode.NORMAL ? ContrastMode.HIGH_CONTRAST : ContrastMode.NORMAL);
  };

  const increaseFont = () => {
    if (fontSize === FontSize.NORMAL) setFontSize(FontSize.LARGE);
    else if (fontSize === FontSize.LARGE) setFontSize(FontSize.EXTRA_LARGE);
    else setFontSize(FontSize.NORMAL); // Cycle back
  };

  return (
    <AccessibilityContext.Provider value={{ fontSize, setFontSize, contrastMode, toggleContrast, increaseFont }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};