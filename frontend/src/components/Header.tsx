"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function Header() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(search.trim() ? `/?keyword=${encodeURIComponent(search.trim())}` : "/");
  }

  return (
    <header
      style={{
        background: "var(--header-bg)",
        borderBottom: "1px solid var(--card-border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <nav
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "0.6rem 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L4 8v12l10 6 10-6V8L14 2z" fill="var(--primary)" opacity="0.15" />
            <path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="var(--primary)" strokeWidth="1.5" fill="none" />
            <path d="M9 14l3 3 7-7" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--foreground)" }}>
            ReviewJOM
          </span>
        </Link>

        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: "28rem", position: "relative" }}>
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }}
          >
            <circle cx="7" cy="7" r="5.5" stroke="var(--muted)" strokeWidth="1.5" />
            <path d="M11 11l3.5 3.5" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="리뷰, 태그 검색..."
            style={{
              width: "100%",
              padding: "0.45rem 0.75rem 0.45rem 2.25rem",
              border: "1px solid var(--card-border)",
              borderRadius: "0.5rem",
              background: "var(--background)",
              color: "var(--foreground)",
              fontSize: "0.85rem",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </form>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {!isLoading && (
            <>
              {user ? (
                <>
                  <Link
                    href="/posts/new"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      padding: "0.45rem 1rem",
                      background: "var(--primary)",
                      color: "#fff",
                      borderRadius: "0.5rem",
                      textDecoration: "none",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 10.5V12h1.5l7.37-7.37-1.5-1.5L2 10.5zM12.15 3.35a.5.5 0 000-.7l-.8-.8a.5.5 0 00-.7 0l-.75.75 1.5 1.5.75-.75z" fill="#fff" />
                    </svg>
                    글쓰기
                  </Link>
                  <Link
                    href="/mypage"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      textDecoration: "none",
                      color: "var(--foreground)",
                    }}
                  >
                    <div
                      style={{
                        width: "2rem",
                        height: "2rem",
                        borderRadius: "50%",
                        background: "var(--avatar-bg)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "var(--muted)",
                      }}
                    >
                      {user.nickname.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>{user.nickname}</span>
                  </Link>
                  <button
                    onClick={logout}
                    style={{
                      padding: "0.35rem 0.7rem",
                      background: "transparent",
                      color: "var(--muted)",
                      border: "1px solid var(--card-border)",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      fontSize: "0.8rem",
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
                      fontSize: "0.85rem",
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
                      fontSize: "0.85rem",
                      fontWeight: 500,
                    }}
                  >
                    회원가입
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
