
import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { storageService } from '../services/storageService';
import { Student, ContrastMode } from '../types';
import { User, Plus, Trash2, TrendingUp, Calendar } from 'lucide-react';
import { BigButton } from '../components/BigButton';

export const Students: React.FC = () => {
  const { fontSize, contrastMode } = useAccessibility();
  const isHighContrast = contrastMode === ContrastMode.HIGH_CONTRAST;
  
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    setStudents(storageService.getStudents());
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim()) {
      storageService.addStudent(newStudentName.trim());
      setNewStudentName('');
      setIsAdding(false);
      loadStudents();
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student and all their results?')) {
      storageService.deleteStudent(id);
      loadStudents();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className={`${fontSize} font-bold text-center`}>My Students</h2>

      {/* Add Student Section */}
      {!isAdding ? (
        <BigButton 
          label="ADD NEW STUDENT" 
          icon={<Plus size={32} />} 
          onClick={() => setIsAdding(true)} 
          primary
        />
      ) : (
        <form onSubmit={handleAddStudent} className={`p-6 rounded-xl border-4 ${isHighContrast ? 'bg-gray-900 border-yellow-400' : 'bg-white border-blue-200'}`}>
          <label className={`block font-bold mb-2 ${fontSize}`}>Student Name:</label>
          <input 
            type="text" 
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
            className={`w-full p-4 mb-4 rounded-lg border-2 text-xl ${
              isHighContrast ? 'bg-black text-yellow-400 border-yellow-400' : 'bg-white text-black border-gray-300'
            }`}
            placeholder="Enter name..."
            autoFocus
          />
          <div className="flex gap-4">
            <BigButton label="SAVE" onClick={() => {}} primary className="flex-1" />
            <BigButton label="CANCEL" onClick={() => setIsAdding(false)} className="flex-1" />
          </div>
        </form>
      )}

      {/* Student List */}
      <div className="grid grid-cols-1 gap-4 mt-4">
        {students.length === 0 && !isAdding && (
          <p className={`text-center opacity-70 ${fontSize}`}>No students added yet.</p>
        )}

        {students.map(student => {
          const stats = storageService.getStudentStats(student.id);
          
          return (
            <div 
              key={student.id} 
              className={`p-6 rounded-xl border-4 shadow-sm flex flex-col gap-4 ${
                isHighContrast ? 'bg-gray-900 border-white' : 'bg-white border-blue-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${isHighContrast ? 'bg-yellow-400 text-black' : 'bg-blue-100 text-blue-600'}`}>
                    <User size={32} />
                  </div>
                  <h3 className={`${fontSize} font-bold`}>{student.name}</h3>
                </div>
                <button 
                  onClick={() => handleDelete(student.id)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                  aria-label="Delete Student"
                >
                  <Trash2 size={28} />
                </button>
              </div>

              {stats ? (
                <div className={`grid grid-cols-2 gap-4 p-4 rounded-lg ${isHighContrast ? 'bg-black' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={24} />
                    <div>
                      <span className="block text-sm font-bold opacity-70">Average</span>
                      <span className={`text-xl font-bold ${stats.averageScore >= 80 ? 'text-green-600' : 'text-orange-500'}`}>
                        {stats.averageScore}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={24} />
                    <div>
                      <span className="block text-sm font-bold opacity-70">Last Quiz</span>
                      <span className="text-lg font-bold">
                        {stats.lastQuiz.module}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="opacity-70 italic">No quizzes taken yet.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
