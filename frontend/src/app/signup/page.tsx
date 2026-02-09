"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const { user, signup, isLoading } = useAuth();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && user) {
    router.replace("/");
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (nickname.length < 2 || nickname.length > 20) {
      setError("닉네임은 2~20자여야 합니다.");
      return;
    }
    if (password.length < 2 || password.length > 20) {
      setError("비밀번호는 2~20자여야 합니다.");
      return;
    }

    setSubmitting(true);
    try {
      await signup(nickname, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "회원가입에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: "24rem", margin: "3rem auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", textAlign: "center" }}>
        회원가입
      </h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {error && (
          <p style={{ color: "var(--danger)", fontSize: "0.875rem", textAlign: "center" }}>{error}</p>
        )}
        <div>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" }}>
            닉네임
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            minLength={2}
            maxLength={20}
            placeholder="2~20자"
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              border: "1px solid var(--input-border)",
              borderRadius: "0.375rem",
              background: "var(--background)",
              color: "var(--foreground)",
              fontSize: "0.875rem",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" }}>
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={2}
            maxLength={20}
            placeholder="2~20자"
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              border: "1px solid var(--input-border)",
              borderRadius: "0.375rem",
              background: "var(--background)",
              color: "var(--foreground)",
              fontSize: "0.875rem",
              boxSizing: "border-box",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "0.6rem",
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            borderRadius: "0.375rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: submitting ? "not-allowed" : "pointer",
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? "가입 중..." : "회원가입"}
        </button>
      </form>
      <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.875rem", color: "var(--muted)" }}>
        이미 계정이 있으신가요?{" "}
        <Link href="/login" style={{ color: "var(--primary)", textDecoration: "none" }}>
          로그인
        </Link>
      </p>
    </div>
  );
}
