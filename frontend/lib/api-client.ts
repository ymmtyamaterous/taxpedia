import { AuthResponse, AuthUser, Badge, Course, GlossaryTerm, Lesson, LessonMemo, LessonProgressItem, QuizQuestion, UserProgress } from "@/lib/auth-types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8080";

type HttpMethod = "GET" | "POST" | "PUT";

async function request<T>(
  path: string,
  method: HttpMethod,
  body?: unknown,
  token?: string,
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = "リクエストに失敗しました";
    try {
      const parsed: unknown = await response.json();
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        "error" in parsed &&
        typeof parsed.error === "string"
      ) {
        message = parsed.error;
      }
    } catch {
      // no-op
    }
    throw new Error(message);
  }

  const data: unknown = await response.json();
  return data as T;
}

export async function registerApi(input: {
  email: string;
  password: string;
  displayName: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/register", "POST", input);
}

export async function loginApi(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/login", "POST", input);
}

export async function meApi(token: string): Promise<AuthUser> {
  return request<AuthUser>("/api/auth/me", "GET", undefined, token);
}

export async function myProgressApi(token: string): Promise<UserProgress> {
  return request<UserProgress>("/api/users/me/progress", "GET", undefined, token);
}

export async function myBadgesApi(token: string): Promise<{ items: Badge[] }> {
  return request<{ items: Badge[] }>("/api/users/me/badges", "GET", undefined, token);
}

export async function getCoursesApi(): Promise<{ items: Course[] }> {
  return request<{ items: Course[] }>("/api/courses", "GET");
}

export async function getCourseApi(id: number): Promise<Course> {
  return request<Course>(`/api/courses/${id}`, "GET");
}

export async function getCourseLessonsApi(courseId: number): Promise<{ items: Lesson[] }> {
  return request<{ items: Lesson[] }>(`/api/courses/${courseId}/lessons`, "GET");
}

export async function getLessonApi(id: number): Promise<Lesson> {
  return request<Lesson>(`/api/lessons/${id}`, "GET");
}

export async function getLessonQuizApi(lessonId: number): Promise<{ items: QuizQuestion[] }> {
  return request<{ items: QuizQuestion[] }>(`/api/lessons/${lessonId}/quiz`, "GET");
}

export async function startLessonApi(
  lessonId: number,
  token: string,
): Promise<void> {
  await request<{ lessonId: number; status: string }>(
    `/api/lessons/${lessonId}/start`,
    "POST",
    undefined,
    token,
  );
}

export async function completeLessonApi(
  lessonId: number,
  token: string,
): Promise<void> {
  await request<{ lessonId: number; status: string }>(
    `/api/lessons/${lessonId}/complete`,
    "POST",
    undefined,
    token,
  );
}

export async function submitQuizApi(
  questionId: number,
  selectedChoiceId: number,
  token?: string,
): Promise<{ correct: boolean; explanation: string }> {
  return request<{ correct: boolean; explanation: string }>(
    "/api/quiz/submit",
    "POST",
    { questionId, selectedChoiceId },
    token,
  );
}

export async function getUserLessonProgressApi(
  token: string,
): Promise<{ items: LessonProgressItem[] }> {
  return request<{ items: LessonProgressItem[] }>(
    "/api/users/me/lesson-progress",
    "GET",
    undefined,
    token,
  );
}

export async function getLessonMemoApi(
  lessonId: number,
  token: string,
): Promise<LessonMemo> {
  return request<LessonMemo>(`/api/lessons/${lessonId}/memo`, "GET", undefined, token);
}

export async function saveLessonMemoApi(
  lessonId: number,
  content: string,
  token: string,
): Promise<LessonMemo> {
  return request<LessonMemo>(`/api/lessons/${lessonId}/memo`, "PUT", { content }, token);
}

export async function getGlossaryApi(q?: string): Promise<{ items: GlossaryTerm[] }> {
  const path = q ? `/api/glossary?q=${encodeURIComponent(q)}` : "/api/glossary";
  return request<{ items: GlossaryTerm[] }>(path, "GET");
}

export async function getGlossaryTermApi(id: number): Promise<GlossaryTerm> {
  return request<GlossaryTerm>(`/api/glossary/${id}`, "GET");
}
