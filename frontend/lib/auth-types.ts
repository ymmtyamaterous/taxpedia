export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type Course = {
  id: number;
  title: string;
  description: string;
  level: CourseLevel;
};

export type Lesson = {
  id: number;
  courseId: number;
  title: string;
  content: string;
  estimatedMinutes: number;
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
