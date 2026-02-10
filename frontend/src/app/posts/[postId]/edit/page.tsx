"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api, ApiError } from "@/lib/api";
import type { PostResponse } from "@/lib/types";
import PostForm from "@/components/PostForm";

export default function EditPostPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = use(params);
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [post, setPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<PostResponse>(`/api/v1/posts/${postId}`)
      .then(setPost)
      .catch((err) => setError(err instanceof ApiError ? err.message : "게시글을 불러올 수 없습니다."))
      .finally(() => setLoading(false));
  }, [postId]);

  if (isLoading || loading) {
    return (
      <div className="newpost-container">
        <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0" }}>로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    router.replace("/login");
    return null;
  }

  if (error || !post) {
    return (
      <div className="newpost-container">
        <p style={{ textAlign: "center", color: "var(--danger)", padding: "3rem 0" }}>
          {error || "게시글을 찾을 수 없습니다."}
        </p>
      </div>
    );
  }

  if (user.id !== post.member.id) {
    return (
      <div className="newpost-container">
        <p style={{ textAlign: "center", color: "var(--danger)", padding: "3rem 0" }}>
          수정 권한이 없습니다.
        </p>
      </div>
    );
  }

  async function handleSubmit(data: { title: string; content: string; tagIds: number[] }) {
    await api.put<PostResponse>(`/api/v1/posts/${postId}`, data);
    router.push(`/posts/${postId}`);
  }

  return (
    <div className="newpost-container">
      {/* Header */}
      <div className="newpost-header">
        <h1>Edit Review</h1>
        <p>Update your review details and content.</p>
      </div>

      {/* Body */}
      <div className="newpost-body">
        <PostForm
          initialData={{
            title: post.title,
            content: post.content,
            tagIds: post.tags.map((t) => t.id),
          }}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          onCancel={() => router.back()}
        />

        {/* Sidebar */}
        <div className="newpost-sidebar">
          <div className="sidebar-panel">
            <div className="sidebar-panel-header">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Editing Tips
            </div>
            <div className="sidebar-panel-body">
              <ul>
                <li>
                  <span className="bullet" />
                  <span>Changes are <strong>saved immediately</strong> upon submission</span>
                </li>
                <li>
                  <span className="bullet" />
                  <span>Existing <strong>comments will be preserved</strong></span>
                </li>
                <li>
                  <span className="bullet" />
                  <span>Update tags to improve <strong>discoverability</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
