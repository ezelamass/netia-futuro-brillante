export interface CourseModule {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  targetRole: 'player' | 'coach';
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  // Computed
  sectionCount: number;
  lessonCount: number;
  completedCount: number;
}

export interface CourseSection {
  id: string;
  moduleId: string;
  title: string;
  sortOrder: number;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  sectionId: string;
  title: string;
  contentMd: string | null;
  videoUrl: string | null;
  durationMin: number;
  sortOrder: number;
  hasQuiz: boolean;
}

export interface LessonQuiz {
  id: string;
  lessonId: string;
  questions: QuizQuestion[];
  passPercent: number;
}

export interface QuizQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  answers: number[];
  score: number;
  passed: boolean;
  xpAwarded: number;
  createdAt: string;
}

export interface QuizResult {
  score: number;
  passed: boolean;
  xpAwarded: number;
}
