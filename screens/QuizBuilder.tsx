
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BigButton } from '../components/BigButton';
import { QUESTION_BANK } from '../constants';
import { useAccessibility } from '../context/AccessibilityContext';
import { ContrastMode, Student } from '../types';
import { Sparkles, UserCheck, GraduationCap } from 'lucide-react';
import { generateQuestions } from '../services/geminiService';
import { storageService } from '../services/storageService';

export const QuizBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { fontSize, contrastMode } = useAccessibility();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // Student Selection State
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  useEffect(() => {
    const loadedStudents = storageService.getStudents();
    setStudents(loadedStudents);
    if (loadedStudents.length > 0) {
      setSelectedStudentId(loadedStudents[0].id);
    }
  }, []);

  const modules = Array.from(new Set(QUESTION_BANK.map(q => q.module)));
  const isHighContrast = contrastMode === ContrastMode.HIGH_CONTRAST;

  const handleStart = (moduleName: string) => {
    if (!selectedStudentId) {
      alert("Please create a student profile first in the 'Students' section.");
      return;
    }

    const questions = QUESTION_BANK.filter(q => q.module === moduleName);
    // Shuffle and take 10 for standard quiz
    const quizQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 10);
    
    navigate('/quiz', { 
      state: { 
        questions: quizQuestions, 
        moduleName,
        studentId: selectedStudentId
      } 
    });
  };

  const handleFinalExam = () => {
    if (!selectedStudentId) {
      alert("Please create a student profile first.");
      return;
    }

    // Shuffle ALL questions from ALL modules
    const allQuestions = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
    
    // Take 50 questions (or less if not enough)
    const examQuestions = allQuestions.slice(0, 50);

    navigate('/quiz', { 
      state: { 
        questions: examQuestions, 
        moduleName: "Final Semester Exam",
        studentId: selectedStudentId
      } 
    });
  }

  const handleAiGenerate = async () => {
    if (!selectedStudentId) {
        alert("Please create a student profile first.");
        return;
    }
    setIsAiLoading(true);
    const questions = await generateQuestions("English Grammar for Prep 3");
    setIsAiLoading(false);
    if(questions.length > 0) {
       navigate('/quiz', { 
         state: { 
           questions, 
           moduleName: "AI Generated Quiz",
           studentId: selectedStudentId
         } 
       });
    } else {
        alert("Could not generate questions. Please check network/API Key.");
    }
  };

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 p-10 text-center">
        <h2 className={`${fontSize} font-bold`}>No Students Found</h2>
        <p className="text-xl">Please add a student before starting a test.</p>
        <BigButton label="GO TO STUDENTS" onClick={() => navigate('/students')} primary />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Select Student */}
      <div className={`p-6 rounded-xl border-4 ${isHighContrast ? 'bg-gray-900 border-white' : 'bg-white border-blue-200'}`}>
        <h2 className={`${fontSize} font-bold mb-4 flex items-center gap-2`}>
          <UserCheck size={32} />
          Who is taking the test?
        </h2>
        <select 
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
          className={`w-full p-4 rounded-lg border-2 text-xl font-bold cursor-pointer ${
            isHighContrast ? 'bg-black text-yellow-400 border-yellow-400' : 'bg-gray-50 text-blue-900 border-blue-300'
          }`}
        >
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* 2. Final Exam Option */}
      <div>
        <h2 className={`${fontSize} font-bold text-center mb-4`}>End of Year</h2>
        <BigButton 
          label="START FINAL SEMESTER EXAM (50 Questions)" 
          icon={<GraduationCap size={40} />} 
          onClick={handleFinalExam} 
          primary
          className="bg-purple-600 border-purple-800 text-white hover:bg-purple-500 mb-8"
        />
      </div>

      {/* 3. Select Specific Unit */}
      <div>
        <h2 className={`${fontSize} font-bold text-center mb-4`}>Practice by Unit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map(mod => (
            <BigButton 
              key={mod}
              label={mod}
              onClick={() => handleStart(mod)}
              primary={selectedModule === mod}
            />
          ))}
        </div>
      </div>

      {/* 4. AI Option */}
      <div className={`p-6 border-4 rounded-xl ${isHighContrast ? 'border-dashed border-yellow-400' : 'border-dashed border-blue-300'}`}>
        <h3 className={`${fontSize} font-bold text-center mb-4`}>Need extra questions?</h3>
        <BigButton 
            label={isAiLoading ? "THINKING..." : "ASK AI TO CREATE A QUIZ"}
            icon={<Sparkles />}
            onClick={handleAiGenerate}
            disabled={isAiLoading}
        />
      </div>
    </div>
  );
};
