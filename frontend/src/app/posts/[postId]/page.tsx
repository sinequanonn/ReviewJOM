"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { PostResponse } from "@/lib/types";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import StatusBadge from "@/components/StatusBadge";
import TagBadge from "@/components/TagBadge";
import CommentSection from "@/components/CommentSection";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const d = new Date(dateStr).getTime();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
  return dateStr?.slice(0, 10);
}

function ContentRenderer({ content }: { content: string }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  function handleCopy(code: string, idx: number) {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  const parts = content.split(/(```[\s\S]*?```)/g);
  let codeBlockIndex = 0;

  return (
    <div style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "var(--foreground)" }}>
      {parts.map((part, i) => {
        if (part.startsWith("```")) {
          const idx = codeBlockIndex++;
          const inner = part.slice(3, -3);
          const firstNewline = inner.indexOf("\n");
          const firstLine = firstNewline >= 0 ? inner.slice(0, firstNewline).trim() : "";
          const hasFilename = firstLine && !firstLine.includes(" ");
          const filename = hasFilename ? firstLine : null;
          const code = hasFilename ? inner.slice(firstNewline + 1) : inner;

          return (
            <div key={i} style={{ margin: "1.25rem 0", borderRadius: "0.5rem", overflow: "hidden" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.5rem 1rem",
                  background: "var(--code-header-bg)",
                  fontSize: "0.8rem",
                  color: "var(--code-text)",
                }}
              >
                <span style={{ fontFamily: "var(--font-mono, monospace)", opacity: 0.8 }}>
                  {filename || "code"}
                </span>
                <button
                  onClick={() => handleCopy(code.trim(), idx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    background: "none",
                    border: "none",
                    color: "var(--code-copy)",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    fontFamily: "var(--font-sans, sans-serif)",
                  }}
                >
                  {copiedIdx === idx ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M10 4V3a1.5 1.5 0 00-1.5-1.5H3A1.5 1.5 0 001.5 3v5.5A1.5 1.5 0 003 10h1" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: "1rem",
                  background: "var(--code-bg)",
                  color: "var(--code-text)",
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  overflowX: "auto",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                <code>{code.trim()}</code>
              </pre>
            </div>
          );
        }

        if (!part.trim()) return null;

        const lines = part.split("\n");
        const elements: React.ReactNode[] = [];
        let listItems: string[] = [];

        function flushList() {
          if (listItems.length > 0) {
            elements.push(
              <ul key={`list-${elements.length}`} style={{ margin: "0.75rem 0", paddingLeft: "1.5rem" }}>
                {listItems.map((item, li) => (
                  <li key={li} style={{ marginBottom: "0.3rem" }}>{item}</li>
                ))}
              </ul>
            );
            listItems = [];
          }
        }

        lines.forEach((line, li) => {
          const trimmed = line.trim();
          if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            listItems.push(trimmed.slice(2));
          } else {
            flushList();
            if (trimmed) {
              elements.push(
                <p key={`p-${li}`} style={{ margin: "0.5rem 0" }}>{trimmed}</p>
              );
            }
          }
        });
        flushList();

        return <div key={i}>{elements}</div>;
      })}
    </div>
  );
}

export default function PostDetailPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    api
      .get<PostResponse>(`/api/v1/posts/${postId}`)
      .then(setPost)
      .catch((err) => setError(err instanceof ApiError ? err.message : "게시글을 불러올 수 없습니다."))
      .finally(() => setLoading(false));
  }, [postId]);

  async function handleDelete() {
    if (!confirm("게시글을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/api/v1/posts/${postId}`);
      router.push("/");
    } catch {
      alert("삭제에 실패했습니다.");
    }
  }

  async function toggleStatus() {
    if (!post) return;
    const newStatus = post.postStatus === "SOLVED" ? "UNSOLVED" : "SOLVED";
    try {
      const updated = await api.patch<PostResponse>(`/api/v1/posts/${postId}/status`, { status: newStatus });
      setPost(updated);
    } catch {
      alert("상태 변경에 실패했습니다.");
    }
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    alert("링크가 복사되었습니다.");
  }

  if (loading) {
    return <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0" }}>로딩 중...</p>;
  }

  if (error || !post) {
    return <p style={{ textAlign: "center", color: "var(--danger)", padding: "3rem 0" }}>{error || "게시글을 찾을 수 없습니다."}</p>;
  }

  const isAuthor = user?.id === post.member.id;

  return (
    <div style={{ maxWidth: "52rem", margin: "0 auto", padding: "1.5rem" }}>
      {/* Breadcrumb */}
      <nav style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "var(--breadcrumb)", marginBottom: "1.25rem" }}>
        <Link href="/" style={{ color: "var(--breadcrumb)", textDecoration: "none" }}>Home</Link>
        <span>&gt;</span>
        <Link href="/" style={{ color: "var(--breadcrumb)", textDecoration: "none" }}>Reviews</Link>
        <span>&gt;</span>
        <span style={{ color: "var(--foreground)" }}>Post #{postId}</span>
      </nav>

      {/* Status badge + Tags */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <StatusBadge status={post.postStatus} />
        {post.tags.map((tag) => (
          <TagBadge key={tag.id} tag={tag} />
        ))}
      </div>

      {/* Title */}
      <h1 style={{ fontSize: "1.6rem", fontWeight: 800, margin: "0 0 1rem", lineHeight: 1.3 }}>
        {post.title || "(제목 없음)"}
      </h1>

      {/* Author info */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
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
              flexShrink: 0,
            }}
          >
            {post.member.nickname?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{post.member.nickname}</span>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              · {post.createdAt && timeAgo(post.createdAt)}
            </span>
          </div>
        </div>

        {/* Author actions menu */}
        {isAuthor && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.3rem",
                color: "var(--muted)",
                fontSize: "1.2rem",
                lineHeight: 1,
              }}
            >
              ···
            </button>
            {showMenu && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  background: "var(--card)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  minWidth: "8rem",
                  zIndex: 10,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={toggleStatus}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "0.6rem 1rem",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    fontSize: "0.85rem",
                    color: "var(--foreground)",
                    cursor: "pointer",
                  }}
                >
                  {post.postStatus === "SOLVED" ? "미해결로 변경" : "해결됨으로 변경"}
                </button>
                <Link
                  href={`/posts/${postId}/edit`}
                  onClick={() => setShowMenu(false)}
                  style={{
                    display: "block",
                    padding: "0.6rem 1rem",
                    fontSize: "0.85rem",
                    color: "var(--foreground)",
                    textDecoration: "none",
                  }}
                >
                  수정
                </Link>
                <button
                  onClick={handleDelete}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "0.6rem 1rem",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    fontSize: "0.85rem",
                    color: "var(--danger)",
                    cursor: "pointer",
                  }}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          padding: "1.25rem 0",
          borderTop: "1px solid var(--card-border)",
          marginBottom: "0.5rem",
        }}
      >
        <ContentRenderer content={post.content} />
      </div>

      {/* Action bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          padding: "0.75rem 0",
          borderTop: "1px solid var(--action-bar-border)",
          borderBottom: "1px solid var(--action-bar-border)",
          marginBottom: "2rem",
        }}
      >
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            background: "none",
            border: "none",
            color: "var(--muted)",
            cursor: "pointer",
            fontSize: "0.85rem",
            padding: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4.5 7.5V13h-2a.5.5 0 01-.5-.5v-4a.5.5 0 01.5-.5h2zm0 0l2.5-4V2a1 1 0 011-1h.5a1 1 0 011 1v2l-.5 3.5h4a1 1 0 01.98 1.2l-1 5a1 1 0 01-.98.8H7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Likes
        </button>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            background: "none",
            border: "none",
            color: "var(--muted)",
            cursor: "pointer",
            fontSize: "0.85rem",
            padding: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 2.5h10a1 1 0 011 1v9a1 1 0 01-1 1H3a1 1 0 01-1-1v-9a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" />
            <path d="M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Save
        </button>
        <button
          onClick={handleShare}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            background: "none",
            border: "none",
            color: "var(--muted)",
            cursor: "pointer",
            fontSize: "0.85rem",
            padding: 0,
            marginLeft: "auto",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M11 2l3 3-3 3M14 5H6a3 3 0 00-3 3v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Share
        </button>
      </div>

      {/* Comments */}
      <CommentSection postId={Number(postId)} postAuthorId={post.member.id} />
    </div>
  );
}
