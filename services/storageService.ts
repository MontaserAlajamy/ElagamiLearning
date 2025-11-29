
import { Student, QuizResult } from '../types';

const STORAGE_KEY = 'teacher_assist_data';

interface AppData {
  students: Student[];
}

const getData = (): AppData => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  }
  return { students: [] };
};

const saveData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const storageService = {
  getStudents: (): Student[] => {
    return getData().students;
  },

  addStudent: (name: string): Student => {
    const data = getData();
    const newStudent: Student = {
      id: Date.now().toString(),
      name,
      results: []
    };
    data.students.push(newStudent);
    saveData(data);
    return newStudent;
  },

  deleteStudent: (id: string) => {
    const data = getData();
    data.students = data.students.filter(s => s.id !== id);
    saveData(data);
  },

  saveQuizResult: (studentId: string, result: Omit<QuizResult, 'id'>) => {
    const data = getData();
    const studentIndex = data.students.findIndex(s => s.id === studentId);
    
    if (studentIndex !== -1) {
      const newResult: QuizResult = {
        ...result,
        id: Date.now().toString(),
      };
      // Add to beginning of array so newest is first
      data.students[studentIndex].results.unshift(newResult);
      saveData(data);
    }
  },

  getStudentStats: (studentId: string) => {
    const data = getData();
    const student = data.students.find(s => s.id === studentId);
    if (!student || student.results.length === 0) return null;

    const totalQuizzes = student.results.length;
    const averageScore = Math.round(
      student.results.reduce((acc, curr) => acc + curr.percentage, 0) / totalQuizzes
    );

    return {
      totalQuizzes,
      averageScore,
      lastQuiz: student.results[0]
    };
  }
};
