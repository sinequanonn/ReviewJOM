"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { api, ApiError } from "./api";
import type { MemberResponse, LoginResponse } from "./types";

interface AuthContextType {
  user: MemberResponse | null;
  token: string | null;
  login: (nickname: string, password: string) => Promise<void>;
  signup: (nickname: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: MemberResponse) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MemberResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    if (!savedToken) {
      setIsLoading(false);
      return;
    }
    setToken(savedToken);
    api
      .get<MemberResponse>("/api/v1/members/me")
      .then((member) => setUser(member))
      .catch(() => {
        localStorage.removeItem("accessToken");
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (nickname: string, password: string) => {
    const res = await api.post<LoginResponse>("/api/v1/members/login", {
      nickname,
      password,
    });
    localStorage.setItem("accessToken", res.accessToken);
    setToken(res.accessToken);
    setUser(res.member);
  }, []);

  const signup = useCallback(
    async (nickname: string, password: string) => {
      await api.post("/api/v1/members/signup", { nickname, password });
      await login(nickname, password);
    },
    [login],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);
    window.location.href = "/";
  }, []);

  const updateUser = useCallback((updated: MemberResponse) => {
    setUser(updated);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, signup, logout, updateUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
