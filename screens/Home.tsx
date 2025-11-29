import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BigButton } from '../components/BigButton';
import { useAccessibility } from '../context/AccessibilityContext';
import { Play, PlusCircle, Users, Trophy } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { fontSize } = useAccessibility();

  return (
    <div className="flex flex-col gap-6">
      <div className={`text-center mb-4 ${fontSize}`}>
        <h2 className="font-bold">Welcome, Teacher!</h2>
        <p className="opacity-80">What would you like to do today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BigButton 
          label="START TEST" 
          icon={<Play size={48} />} 
          primary 
          onClick={() => navigate('/builder')} 
          className="h-48"
        />
        
        <BigButton 
          label="STUDENTS" 
          icon={<Users size={48} />} 
          onClick={() => navigate('/students')}
          className="h-48"
        />

        <BigButton 
          label="CREATE QUESTIONS (AI)" 
          icon={<PlusCircle size={48} />} 
          onClick={() => alert("AI Question Generation is available in the Quiz Builder section!")}
          className="h-48"
        />

        <BigButton 
          label="PAST RESULTS" 
          icon={<Trophy size={48} />} 
          onClick={() => navigate('/students')}
          className="h-48"
        />
      </div>
    </div>
  );
};