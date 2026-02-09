"use client";

import { useState } from "react";
import TagSelector from "./TagSelector";

interface FormData {
  title: string;
  content: string;
  tagIds: number[];
}

interface Props {
  initialData?: FormData;
  onSubmit: (data: FormData) => Promise<void>;
  submitLabel: string;
}

export default function PostForm({ initialData, onSubmit, submitLabel }: Props) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [tagIds, setTagIds] = useState<number[]>(initialData?.tagIds ?? []);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("제목을 입력하세요."); return; }
    if (!content.trim()) { setError("내용을 입력하세요."); return; }
    if (tagIds.length === 0) { setError("태그를 하나 이상 선택하세요."); return; }

    setError("");
    setSubmitting(true);
    try {
      await onSubmit({ title, content, tagIds });
    } catch (err) {
      setError(err instanceof Error ? err.message : "요청에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.5rem 0.75rem",
    border: "1px solid var(--input-border)",
    borderRadius: "0.375rem",
    background: "var(--background)",
    color: "var(--foreground)",
    fontSize: "0.875rem",
    boxSizing: "border-box",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {error && <p style={{ color: "var(--danger)", fontSize: "0.85rem", margin: 0 }}>{error}</p>}

      <div>
        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.35rem" }}>제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={255}
          placeholder="제목을 입력하세요"
          required
          style={inputStyle}
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.35rem" }}>내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          rows={12}
          required
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.35rem" }}>태그</label>
        <TagSelector selectedIds={tagIds} onChange={setTagIds} />
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
          fontSize: "0.9rem",
          fontWeight: 600,
          cursor: submitting ? "not-allowed" : "pointer",
          opacity: submitting ? 0.7 : 1,
        }}
      >
        {submitting ? "처리 중..." : submitLabel}
      </button>
    </form>
  );
}
