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
