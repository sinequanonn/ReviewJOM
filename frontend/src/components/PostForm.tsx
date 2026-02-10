"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { TagResponse } from "@/lib/types";

interface FormData {
  title: string;
  content: string;
  tagIds: number[];
}

interface Props {
  initialData?: FormData;
  onSubmit: (data: FormData) => Promise<void>;
  submitLabel: string;
  onCancel?: () => void;
}

export default function PostForm({ initialData, onSubmit, submitLabel, onCancel }: Props) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [tagIds, setTagIds] = useState<number[]>(initialData?.tagIds ?? []);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [tags, setTags] = useState<TagResponse[]>([]);

  useEffect(() => {
    api.get<TagResponse[]>("/api/v1/tags").then(setTags).catch(() => { });
  }, []);

  const languages = tags.filter((t) => t.category === "LANGUAGE");
  const frameworks = tags.filter((t) => t.category === "FRAMEWORK");

  function toggleTag(id: number) {
    setTagIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  }

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

  return (
    <form onSubmit={handleSubmit}>
      <div className="newpost-form-card">
        {/* Card Header */}
        <div className="newpost-form-card-header">
          <div className="icon-circle">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 2l2 2-8 8H4v-2l8-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          Review Details
        </div>

        {/* Form Body */}
        <div className="newpost-form-body">
          {error && (
            <div className="newpost-error">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
                <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          )}

          {/* Title */}
          <div className="newpost-field">
            <label>Title <span className="required">*</span></label>
            <input
              type="text"
              className="newpost-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={255}
              placeholder="Enter a descriptive title for your review"
            />
            <div className="char-count">{title.length}/255</div>
          </div>

          {/* Content */}
          <div className="newpost-field">
            <label>Content <span className="required">*</span></label>
            <div className="newpost-content-toolbar">
              <button type="button" className="toolbar-btn" title="Bold">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M4 2.5h4a2.5 2.5 0 010 5H4V2.5zM4 7.5h4.5a2.5 2.5 0 010 5H4V7.5z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              <button type="button" className="toolbar-btn" title="Italic">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5.5 12.5L8.5 1.5M4 12.5h3M7 1.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
              <button type="button" className="toolbar-btn" title="Code">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M4.5 4L1.5 7l3 3M9.5 4l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="toolbar-separator" />
              <button type="button" className="toolbar-btn" title="Link">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M6 8a3 3 0 004.24 0l1.5-1.5a3 3 0 00-4.24-4.24L6.75 3M8 6a3 3 0 00-4.24 0l-1.5 1.5a3 3 0 004.24 4.24L7.25 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
              <button type="button" className="toolbar-btn" title="List">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3.5h7M5 7h7M5 10.5h7M2 3.5h.5M2 7h.5M2 10.5h.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <textarea
              className="newpost-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe the code you want reviewed. Use Markdown for formatting."
            />
          </div>
        </div>

        {/* Tags Section */}
        <div className="newpost-tags-section">
          <label>Tags <span style={{ color: "var(--danger)", marginLeft: "0.15rem" }}>*</span></label>
          <p className="tag-hint">Select at least one tag to categorize your review</p>

          {languages.length > 0 && (
            <>
              <div className="tag-group-label">Languages</div>
              <div className="tag-chips">
                {languages.map((tag) => {
                  const selected = tagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      className={`tag-chip${selected ? " selected language" : ""}`}
                      onClick={() => toggleTag(tag.id)}
                    >
                      <span className={`dot${selected ? "" : " lang-dot"}`} />
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {frameworks.length > 0 && (
            <>
              <div className="tag-group-label">Frameworks</div>
              <div className="tag-chips">
                {frameworks.map((tag) => {
                  const selected = tagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      className={`tag-chip${selected ? " selected framework" : ""}`}
                      onClick={() => toggleTag(tag.id)}
                    >
                      <span className={`dot${selected ? "" : " fw-dot"}`} />
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Actions Footer */}
        <div className="newpost-form-actions">
          {onCancel && (
            <button type="button" className="newpost-btn-cancel" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className="newpost-btn-submit" disabled={submitting}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M12.5 1.5l-5 11-2-4.5-4.5-2 11-5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {submitting ? "처리 중..." : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
