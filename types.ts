
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface CourseModule {
  moduleTitle: string;
  summary: string;
  quiz: QuizQuestion[];
}

export interface Course {
  title: string;
  description: string;
  keyTakeaways: string[];
  modules: CourseModule[];
}
