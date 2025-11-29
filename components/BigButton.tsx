import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { ContrastMode } from '../types';

interface BigButtonProps {
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  primary?: boolean;
  disabled?: boolean;
  className?: string;
}

export const BigButton: React.FC<BigButtonProps> = ({ onClick, label, icon, primary = false, disabled = false, className = '' }) => {
  const { fontSize, contrastMode } = useAccessibility();

  const isHighContrast = contrastMode === ContrastMode.HIGH_CONTRAST;

  let baseClasses = `flex flex-col items-center justify-center rounded-xl p-6 transition-transform active:scale-95 shadow-md w-full border-4 ${className}`;
  
  if (disabled) {
    baseClasses += ` opacity-50 cursor-not-allowed border-gray-400 bg-gray-200 text-gray-500`;
  } else if (isHighContrast) {
    baseClasses += primary 
      ? ` bg-yellow-400 border-yellow-600 text-black hover:bg-yellow-300 font-bold` 
      : ` bg-black border-white text-yellow-400 hover:bg-gray-900`;
  } else {
    baseClasses += primary 
      ? ` bg-blue-600 border-blue-800 text-white hover:bg-blue-500` 
      : ` bg-white border-blue-200 text-blue-900 hover:bg-blue-50`;
  }

  return (
    <button onClick={onClick} disabled={disabled} className={baseClasses}>
      {icon && <div className="mb-3 scale-150">{icon}</div>}
      <span className={`${fontSize} font-bold text-center`}>{label}</span>
    </button>
  );
};