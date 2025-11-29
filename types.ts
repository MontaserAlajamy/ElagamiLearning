
export enum QuestionType {
  MCQ = 'MCQ',
  TRUE_FALSE = 'TRUE_FALSE',
}

export interface Question {
  id: string;
  module: string; // e.g., "Module 1", "Module 2"
  section: string; // e.g., "Grammar", "Vocabulary", "Reading"
  text: string;
  type: QuestionType;
  options?: string[]; // For MCQ
  correctAnswer: string | boolean; // string for MCQ, boolean for TF
  explanation?: string;
}

export interface QuizResult {
  id: string;
  date: string; // ISO string
  score: number;
  totalQuestions: number;
  module: string;
  percentage: number;
}

export interface Student {
  id: string;
  name: string;
  results: QuizResult[];
}

export enum FontSize {
  NORMAL = 'text-base',
  LARGE = 'text-xl',
  EXTRA_LARGE = 'text-3xl',
}

export enum ContrastMode {
  NORMAL = 'NORMAL',
  HIGH_CONTRAST = 'HIGH_CONTRAST',
}
