"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function Header() {
  const { user, logout, isLoading } = useAuth();

  return (
    <header
      style={{
        borderBottom: "1px solid var(--card-border)",
        background: "var(--background)",
      }}
    >
      <nav
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "0.75rem 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "var(--primary)",
            textDecoration: "none",
          }}
        >
          ReviewJOM
        </Link>

        {!isLoading && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {user ? (
              <>
                <Link
                  href="/posts/new"
                  style={{
                    padding: "0.4rem 0.85rem",
                    background: "var(--primary)",
                    color: "#fff",
                    borderRadius: "0.375rem",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  글쓰기
                </Link>
                <Link
                  href="/mypage"
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--foreground)",
                    textDecoration: "none",
                  }}
                >
                  {user.nickname}
                </Link>
                <button
                  onClick={logout}
                  style={{
                    padding: "0.4rem 0.85rem",
                    background: "transparent",
                    color: "var(--muted)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    padding: "0.4rem 0.85rem",
                    color: "var(--foreground)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "0.375rem",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                  }}
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  style={{
                    padding: "0.4rem 0.85rem",
                    background: "var(--primary)",
                    color: "#fff",
                    borderRadius: "0.375rem",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
