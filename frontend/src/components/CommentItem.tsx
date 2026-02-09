"use client";

import { useState } from "react";
import type { CommentResponse } from "@/lib/types";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface Props {
  comment: CommentResponse;
  onUpdate: () => void;
}

export default function CommentItem({ comment, onUpdate }: Props) {
  const { user } = useAuth();
  const isAuthor = user?.id === comment.member.id;
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!content.trim()) return;
    setError("");
    try {
      await api.patch(`/api/v1/comments/${comment.id}`, { content });
      setEditing(false);
      onUpdate();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "수정에 실패했습니다.");
    }
  }

  async function handleDelete() {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/api/v1/comments/${comment.id}`);
      onUpdate();
    } catch {
      alert("삭제에 실패했습니다.");
    }
  }

  return (
    <div style={{ padding: "0.75rem 0", borderBottom: "1px solid var(--card-border)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{comment.member.nickname}</span>
          <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
            {comment.createdAt?.slice(0, 16).replace("T", " ")}
            {comment.modified && " (수정됨)"}
          </span>
        </div>
        {isAuthor && !editing && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setEditing(true)}
              style={{ fontSize: "0.75rem", color: "var(--primary)", background: "none", border: "none", cursor: "pointer" }}
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              style={{ fontSize: "0.75rem", color: "var(--danger)", background: "none", border: "none", cursor: "pointer" }}
            >
              삭제
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid var(--input-border)",
              borderRadius: "0.375rem",
              background: "var(--background)",
              color: "var(--foreground)",
              fontSize: "0.85rem",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
          {error && <p style={{ color: "var(--danger)", fontSize: "0.75rem" }}>{error}</p>}
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              onClick={handleSave}
              style={{ padding: "0.3rem 0.7rem", fontSize: "0.8rem", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "0.25rem", cursor: "pointer" }}
            >
              저장
            </button>
            <button
              onClick={() => { setEditing(false); setContent(comment.content); setError(""); }}
              style={{ padding: "0.3rem 0.7rem", fontSize: "0.8rem", background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--card-border)", borderRadius: "0.25rem", cursor: "pointer" }}
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: "0.875rem", margin: 0, whiteSpace: "pre-wrap" }}>{comment.content}</p>
      )}
    </div>
  );
}
