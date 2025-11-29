
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BigButton } from '../components/BigButton';
import { useAccessibility } from '../context/AccessibilityContext';
import { ContrastMode } from '../types';
import { storageService } from '../services/storageService';
import { Star, Save, GraduationCap } from 'lucide-react';

export const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fontSize, contrastMode } = useAccessibility();
  const isHighContrast = contrastMode === ContrastMode.HIGH_CONTRAST;

  const { score, total, moduleName, studentId } = location.state as { 
    score: number, 
    total: number, 
    moduleName: string,
    studentId: string
  };
  
  const percentage = Math.round((score / total) * 100);
  const [isSaved, setIsSaved] = useState(false);
  const isFinalExam = moduleName === "Final Semester Exam";

  // Auto-save on mount if studentId exists
  useEffect(() => {
    if (studentId && !isSaved) {
      storageService.saveQuizResult(studentId, {
        date: new Date().toISOString(),
        score,
        totalQuestions: total,
        module: moduleName,
        percentage
      });
      setIsSaved(true);
    }
  }, [studentId, score, total, moduleName, percentage, isSaved]);

  let message = "Good effort!";
  if (percentage > 85) message = "Outstanding!";
  else if (percentage > 70) message = "Well Done!";
  else if (percentage < 50) message = "Keep Practicing!";

  return (
    <div className="flex flex-col items-center gap-8 py-10">
      <div className="flex items-center gap-3">
        {isFinalExam && <GraduationCap size={48} />}
        <h2 className={`${fontSize} font-bold text-center`}>{moduleName} Results</h2>
      </div>
      
      <div className={`relative flex items-center justify-center w-64 h-64 rounded-full border-8 ${
        isHighContrast ? 'border-yellow-400 bg-gray-900' : 'border-blue-600 bg-white'
      }`}>
        <div className="text-center">
          <span className="text-6xl font-bold block">{score}/{total}</span>
          <span className="text-2xl font-bold block mt-2">{percentage}%</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {percentage > 90 && <Star size={40} className="text-yellow-500 fill-current" />}
        <h3 className="text-4xl font-bold text-center">{message}</h3>
        {percentage > 90 && <Star size={40} className="text-yellow-500 fill-current" />}
      </div>

      <div className={`p-4 rounded-lg flex items-center gap-3 ${isHighContrast ? 'bg-gray-800 text-green-400' : 'bg-green-100 text-green-800'}`}>
        <Save size={24} />
        <span className="font-bold text-lg">Result Saved Automatically</span>
      </div>

      <div className="w-full grid grid-cols-1 gap-4 mt-8">
        <BigButton label="START NEW QUIZ" onClick={() => navigate('/builder')} />
        <BigButton label="BACK TO HOME" onClick={() => navigate('/')} primary />
      </div>
    </div>
  );
};
