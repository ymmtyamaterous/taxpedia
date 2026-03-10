"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { loginApi, meApi, registerApi } from "@/lib/api-client";
import { AuthUser } from "@/lib/auth-types";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "taxpedia_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return window.localStorage.getItem(TOKEN_KEY);
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return true;
    }
    return window.localStorage.getItem(TOKEN_KEY) !== null;
  });

  useEffect(() => {
    if (!token) {
      return;
    }

    meApi(token)
      .then((me) => {
        setUser(me);
      })
      .catch(() => {
        window.localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginApi({ email, password });
    window.localStorage.setItem(TOKEN_KEY, result.token);
    setToken(result.token);
    setUser(result.user);
  }, []);

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      const result = await registerApi({ email, password, displayName });
      window.localStorage.setItem(TOKEN_KEY, result.token);
      setToken(result.token);
      setUser(result.user);
    },
    [],
  );

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, isLoading, login, register, logout }),
    [user, token, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
