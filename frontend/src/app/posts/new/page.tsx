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
    return <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0" }}>로딩 중...</p>;
  }

  async function handleSubmit(data: { title: string; content: string; tagIds: number[] }) {
    const created = await api.post<PostResponse>("/api/v1/posts", data);
    router.push(`/posts/${created.id}`);
  }

  return (
    <div>
      <h1 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>새 게시글 작성</h1>
      <PostForm onSubmit={handleSubmit} submitLabel="등록" />
    </div>
  );
}
