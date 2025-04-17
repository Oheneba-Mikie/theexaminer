/**
 * Types for the exam portal application
 */

/**
 * Represents an option in a multiple choice question
 */
export interface Option {
  id: string;
  text: string;
}

/**
 * Represents a multiple choice question
 */
export interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
}

/**
 * Represents an exam with multiple questions
 */
export interface Exam {
  id: string;
  title: string;
  createdAt: string;
  questions: Question[];
  status: "active" | "draft";
  url?: string;
  submissions?: number;
}

/**
 * Represents a student submission for an exam
 */
export interface Submission {
  id: string;
  studentName: string;
  studentId: string;
  examId: string;
  examTitle: string;
  submittedAt: string;
  answers: Record<string, string>; // questionId -> selectedOptionId
  score?: number;
  totalQuestions: number;
}
