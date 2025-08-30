export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface CourseModuleData {
  moduleTitle: string;
  summary: string;
  quiz: QuizQuestion[];
}

export interface CourseData {
  title: string;
  description: string;
  keyTakeaways: string[];
  modules: CourseModuleData[];
}
