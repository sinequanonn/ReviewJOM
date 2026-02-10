"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import type { PostResponse } from "@/lib/types";
import PostForm from "@/components/PostForm";

export default function NewPostPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  if (!isLoading && !user) {
    router.replace("/login");
    return null;
  }

  if (isLoading) {
    return (
      <div className="newpost-container">
        <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0" }}>로딩 중...</p>
      </div>
    );
  }

  async function handleSubmit(data: { title: string; content: string; tagIds: number[] }) {
    const created = await api.post<PostResponse>("/api/v1/posts", data);
    router.push(`/posts/${created.id}`);
  }

  return (
    <div className="newpost-container">
      {/* Header */}
      <div className="newpost-header">
        <h1>New Review</h1>
        <p>Share your code and get feedback from the community.</p>
      </div>

      {/* Body */}
      <div className="newpost-body">
        {/* Main Form */}
        <PostForm
          onSubmit={handleSubmit}
          submitLabel="Publish Review"
          onCancel={() => router.back()}
        />

        {/* Sidebar */}
        <div className="newpost-sidebar">
        </div>
      </div>
    </div>
  );
}
