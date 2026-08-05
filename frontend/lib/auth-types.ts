export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type Course = {
  id: number;
  title: string;
  description: string;
  level: CourseLevel;
  orderIndex?: number;
};

export type Lesson = {
  id: number;
  courseId: number;
  title: string;
  content: string;
  estimatedMinutes: number;
  orderIndex?: number;
};

export type QuizChoice = {
  id: number;
  label: string;
  text: string;
};

export type QuizQuestion = {
  id: number;
  lessonId: number;
  question: string;
  explanation: string;
  choices: QuizChoice[];
};

export type AuthUser = {
  id: number;
  email: string;
  displayName: string;
  role: "user" | "admin";
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type UserProgress = {
  completedCourses: number;
  streakDays: number;
  earnedBadges: number;
};

export type Badge = {
  id: number;
  name: string;
  icon: string;
};

export type LessonProgressItem = {
  lessonId: number;
  status: "in_progress" | "completed";
};

export type LessonMemo = {
  lessonId: number;
  content: string;
};

export type GlossaryTerm = {
  id: number;
  term: string;
  reading: string;
  definition: string;
  category: string;
};
