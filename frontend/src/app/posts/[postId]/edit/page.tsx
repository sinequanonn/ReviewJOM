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
    return <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0" }}>로딩 중...</p>;
  }

  if (!user) {
    router.replace("/login");
    return null;
  }

  if (error || !post) {
    return <p style={{ textAlign: "center", color: "var(--danger)", padding: "3rem 0" }}>{error || "게시글을 찾을 수 없습니다."}</p>;
  }

  if (user.id !== post.member.id) {
    return <p style={{ textAlign: "center", color: "var(--danger)", padding: "3rem 0" }}>수정 권한이 없습니다.</p>;
  }

  async function handleSubmit(data: { title: string; content: string; tagIds: number[] }) {
    await api.put<PostResponse>(`/api/v1/posts/${postId}`, data);
    router.push(`/posts/${postId}`);
  }

  return (
    <div>
      <h1 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>게시글 수정</h1>
      <PostForm
        initialData={{
          title: post.title,
          content: post.content,
          tagIds: post.tags.map((t) => t.id),
        }}
        onSubmit={handleSubmit}
        submitLabel="수정"
      />
    </div>
  );
}
