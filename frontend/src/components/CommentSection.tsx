"use client";

import { useEffect, useState, useCallback } from "react";
import type { CommentResponse } from "@/lib/types";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import CommentItem from "./CommentItem";

export default function CommentSection({ postId, postAuthorId }: { postId: number; postAuthorId: number }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const res = await api.get<CommentResponse[]>(`/api/v1/posts/${postId}/comments`);
      setComments(res);
    } catch {
      /* ignore */
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      await api.post(`/api/v1/posts/${postId}/comments`, { content });
      setContent("");
      fetchComments();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "댓글 작성에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {/* Discussion header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>
          Discussion ({comments.length})
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", color: "var(--muted)" }}>
          Sort by:
          <span style={{ fontWeight: 600, color: "var(--foreground)", cursor: "default" }}>
            Best ▾
          </span>
        </div>
      </div>

      {/* Comment input */}
      {user ? (
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            marginBottom: "1.5rem",
            padding: "1rem",
            background: "var(--card)",
            border: "1px solid var(--card-border)",
            borderRadius: "0.75rem",
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
              flexShrink: 0,
            }}
          >
            {user.nickname.charAt(0).toUpperCase()}
          </div>
          <form onSubmit={handleSubmit} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {/* Formatting toolbar */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              {[
                { label: "B", title: "Bold", style: { fontWeight: 700 } },
                { label: "I", title: "Italic", style: { fontStyle: "italic" as const } },
                { label: "<>", title: "Code", style: { fontFamily: "var(--font-mono, monospace)", fontSize: "0.7rem" } },
              ].map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  title={btn.title}
                  style={{
                    width: "1.75rem",
                    height: "1.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "none",
                    border: "1px solid var(--card-border)",
                    borderRadius: "0.25rem",
                    color: "var(--muted)",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    ...btn.style,
                  }}
                >
                  {btn.label}
                </button>
              ))}
              <span style={{ width: "1px", height: "1rem", background: "var(--card-border)", margin: "0 0.25rem" }} />
              {/* Link icon */}
              <button
                type="button"
                title="Link"
                style={{
                  width: "1.75rem",
                  height: "1.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "none",
                  border: "1px solid var(--card-border)",
                  borderRadius: "0.25rem",
                  color: "var(--muted)",
                  cursor: "pointer",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M5 7l2-2m-1.5-.5L7 3a2 2 0 012.83 2.83L8.5 7.5m-5 0L5 9a2 2 0 01-2.83-2.83L3.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
              {/* Image icon */}
              <button
                type="button"
                title="Image"
                style={{
                  width: "1.75rem",
                  height: "1.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "none",
                  border: "1px solid var(--card-border)",
                  borderRadius: "0.25rem",
                  color: "var(--muted)",
                  cursor: "pointer",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="4" cy="4" r="1" fill="currentColor" />
                  <path d="M1 9l3-3 2 2 2-2 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add to the discussion..."
              rows={3}
              required
              style={{
                width: "100%",
                padding: "0.6rem 0.75rem",
                border: "1px solid var(--card-border)",
                borderRadius: "0.5rem",
                background: "var(--background)",
                color: "var(--foreground)",
                fontSize: "0.875rem",
                resize: "vertical",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
            {error && <p style={{ color: "var(--danger)", fontSize: "0.8rem", margin: 0 }}>{error}</p>}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Markdown is supported</span>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "0.5rem 1.25rem",
                  background: "var(--primary)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? "Submitting..." : "Submit Comment"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          댓글을 작성하려면 <a href="/login" style={{ color: "var(--primary)" }}>로그인</a>이 필요합니다.
        </p>
      )}

      {/* Comment list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} postAuthorId={postAuthorId} onUpdate={fetchComments} />
        ))}
      </div>

      {comments.length === 0 && (
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", padding: "1.5rem 0", textAlign: "center" }}>
          아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
        </p>
      )}
    </div>
  );
}
