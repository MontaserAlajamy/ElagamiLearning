
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Question, QuestionType, ContrastMode } from '../types';
import { useAccessibility } from '../context/AccessibilityContext';
import { BigButton } from '../components/BigButton';
import { CheckCircle, XCircle } from 'lucide-react';

export const ActiveQuiz: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fontSize, contrastMode } = useAccessibility();
  const isHighContrast = contrastMode === ContrastMode.HIGH_CONTRAST;

  const { questions, moduleName, studentId } = location.state as { 
    questions: Question[], 
    moduleName: string,
    studentId: string 
  } || { questions: [], moduleName: '', studentId: '' };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);

  if (!questions || questions.length === 0) {
    return <div className="text-center p-10">No questions loaded. <BigButton label="Back" onClick={() => navigate('/')}/></div>;
  }

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answer: string | boolean) => {
    const isCorrect = answer === currentQuestion.correctAnswer;
    if (isCorrect) setScore(prev => prev + 1);
    setLastCorrect(isCorrect);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      navigate('/results', { 
        state: { 
          score, 
          total: questions.length, 
          moduleName,
          studentId
        } 
      });
    }
  };

  if (showFeedback) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-8 py-10">
        {lastCorrect ? (
          <CheckCircle size={120} className="text-green-500" />
        ) : (
          <XCircle size={120} className="text-red-500" />
        )}
        <h2 className={`text-4xl font-bold ${lastCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {lastCorrect ? 'CORRECT!' : 'WRONG!'}
        </h2>
        <div className={`${fontSize} text-center`}>
            {!lastCorrect && <p>The correct answer was: <strong>{currentQuestion.correctAnswer.toString()}</strong></p>}
        </div>
        <BigButton label={currentIndex === questions.length - 1 ? "SEE RESULTS" : "NEXT QUESTION"} onClick={nextQuestion} primary />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className={`flex justify-between font-bold ${fontSize}`}>
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <span>{moduleName}</span>
      </div>

      {/* Progress Bar */}
      <div className={`w-full h-6 rounded-full border-2 ${isHighContrast ? 'border-yellow-400 bg-gray-800' : 'border-blue-200 bg-gray-200'}`}>
        <div 
          className={`h-full rounded-full transition-all duration-300 ${isHighContrast ? 'bg-yellow-400' : 'bg-blue-600'}`}
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className={`p-6 rounded-xl border-4 min-h-[200px] flex items-center justify-center ${
        isHighContrast ? 'bg-gray-900 border-white' : 'bg-white border-blue-100'
      }`}>
        <h2 className={`${fontSize} font-bold text-center leading-relaxed`}>
          {currentQuestion.text}
        </h2>
      </div>

      {/* Answers */}
      <div className="grid grid-cols-1 gap-4">
        {currentQuestion.type === QuestionType.TRUE_FALSE ? (
          <>
            <BigButton label="TRUE" onClick={() => handleAnswer(true)} />
            <BigButton label="FALSE" onClick={() => handleAnswer(false)} />
          </>
        ) : (
          currentQuestion.options?.map((opt, idx) => (
            <BigButton key={idx} label={opt} onClick={() => handleAnswer(opt)} />
          ))
        )}
      </div>
    </div>
  );
};
