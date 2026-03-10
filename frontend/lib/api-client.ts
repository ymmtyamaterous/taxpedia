import { AuthResponse, AuthUser, Badge, UserProgress } from "@/lib/auth-types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8080";

type HttpMethod = "GET" | "POST";

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
