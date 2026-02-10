"use client";

import { useState } from "react";
import type { CommentResponse } from "@/lib/types";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface Props {
  comment: CommentResponse;
  postAuthorId: number;
  onUpdate: () => void;
}

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

export default function CommentItem({ comment, postAuthorId, onUpdate }: Props) {
  const { user } = useAuth();
  const isCommentAuthor = user?.id === comment.member.id;
  const isPostAuthor = comment.member.id === postAuthorId;
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [error, setError] = useState("");
  const [showMenu, setShowMenu] = useState(false);

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
    <div
      style={{
        padding: "1rem 1.25rem",
        background: "var(--card)",
        border: "1px solid var(--card-border)",
        borderRadius: "0.75rem",
        borderLeft: isPostAuthor ? "3px solid var(--author-comment-border)" : undefined,
      }}
    >
      {/* Header: avatar + name + time + AUTHOR badge + menu */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "1.75rem",
              height: "1.75rem",
              borderRadius: "50%",
              background: "var(--avatar-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.7rem",
              fontWeight: 600,
              color: "var(--muted)",
              flexShrink: 0,
            }}
          >
            {comment.member.nickname?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{comment.member.nickname}</span>
          <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
            · {comment.createdAt && timeAgo(comment.createdAt)}
            {comment.modified && " (수정됨)"}
          </span>
          {isPostAuthor && (
            <span
              style={{
                padding: "0.1rem 0.45rem",
                fontSize: "0.65rem",
                fontWeight: 700,
                borderRadius: "0.25rem",
                background: "var(--primary)",
                color: "#fff",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              Author
            </span>
          )}
        </div>

        {/* Three-dot menu */}
        {isCommentAuthor && !editing && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.2rem",
                color: "var(--muted)",
                fontSize: "1rem",
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
                  minWidth: "6rem",
                  zIndex: 10,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => { setEditing(true); setShowMenu(false); }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "0.5rem 0.85rem",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    fontSize: "0.8rem",
                    color: "var(--foreground)",
                    cursor: "pointer",
                  }}
                >
                  수정
                </button>
                <button
                  onClick={() => { setShowMenu(false); handleDelete(); }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "0.5rem 0.85rem",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    fontSize: "0.8rem",
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
      {editing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              border: "1px solid var(--input-border)",
              borderRadius: "0.5rem",
              background: "var(--background)",
              color: "var(--foreground)",
              fontSize: "0.85rem",
              resize: "vertical",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
          {error && <p style={{ color: "var(--danger)", fontSize: "0.75rem", margin: 0 }}>{error}</p>}
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              onClick={handleSave}
              style={{
                padding: "0.35rem 0.85rem",
                fontSize: "0.8rem",
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              저장
            </button>
            <button
              onClick={() => { setEditing(false); setContent(comment.content); setError(""); }}
              style={{
                padding: "0.35rem 0.85rem",
                fontSize: "0.8rem",
                background: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--card-border)",
                borderRadius: "0.375rem",
                cursor: "pointer",
              }}
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: "0.9rem", margin: "0 0 0.75rem", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
          {comment.content}
        </p>
      )}
    </div>
  );
}
