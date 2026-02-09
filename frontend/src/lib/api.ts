import type { ApiResponse } from "./types";

export class ApiError extends Error {
  errorCode: string | null;

  constructor(message: string, errorCode: string | null = null) {
    super(message);
    this.errorCode = errorCode;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (options?.body && typeof options.body === "string") {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new ApiError("인증이 만료되었습니다. 다시 로그인해주세요.");
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }

  const body: ApiResponse<T> = await res.json();

  if (!body.success) {
    throw new ApiError(
      body.message || "요청에 실패했습니다.",
      body.errorCode,
    );
  }

  return body.data;
}

export const api = {
  get<T>(url: string): Promise<T> {
    return fetchApi<T>(url);
  },

  post<T>(url: string, body?: unknown): Promise<T> {
    return fetchApi<T>(url, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(url: string, body: unknown): Promise<T> {
    return fetchApi<T>(url, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  patch<T>(url: string, body: unknown): Promise<T> {
    return fetchApi<T>(url, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  delete(url: string): Promise<void> {
    return fetchApi<void>(url, { method: "DELETE" });
  },
};
