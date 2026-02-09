"use client";

import { useEffect, useState, useCallback } from "react";
import type { CommentResponse } from "@/lib/types";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import CommentItem from "./CommentItem";

export default function CommentSection({ postId }: { postId: number }) {
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
    <div style={{ marginTop: "2rem" }}>
      <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem" }}>
        댓글 ({comments.length})
      </h3>

      <div>
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} onUpdate={fetchComments} />
        ))}
      </div>

      {comments.length === 0 && (
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", padding: "1rem 0" }}>
          아직 댓글이 없습니다.
        </p>
      )}

      {user ? (
        <form onSubmit={handleSubmit} style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 입력하세요"
            rows={3}
            required
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              border: "1px solid var(--input-border)",
              borderRadius: "0.375rem",
              background: "var(--background)",
              color: "var(--foreground)",
              fontSize: "0.875rem",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
          {error && <p style={{ color: "var(--danger)", fontSize: "0.8rem", margin: 0 }}>{error}</p>}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "0.4rem 1rem",
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                borderRadius: "0.375rem",
                fontSize: "0.85rem",
                fontWeight: 500,
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "등록 중..." : "댓글 등록"}
            </button>
          </div>
        </form>
      ) : (
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "1rem" }}>
          댓글을 작성하려면 로그인이 필요합니다.
        </p>
      )}
    </div>
  );
}
