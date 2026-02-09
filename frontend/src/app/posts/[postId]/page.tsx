"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { PostResponse } from "@/lib/types";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import StatusBadge from "@/components/StatusBadge";
import TagBadge from "@/components/TagBadge";
import CommentSection from "@/components/CommentSection";

export default function PostDetailPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
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

  async function handleDelete() {
    if (!confirm("게시글을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/api/v1/posts/${postId}`);
      router.push("/");
    } catch {
      alert("삭제에 실패했습니다.");
    }
  }

  async function toggleStatus() {
    if (!post) return;
    const newStatus = post.postStatus === "SOLVED" ? "UNSOLVED" : "SOLVED";
    try {
      const updated = await api.patch<PostResponse>(`/api/v1/posts/${postId}/status`, { status: newStatus });
      setPost(updated);
    } catch {
      alert("상태 변경에 실패했습니다.");
    }
  }

  if (loading) {
    return <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0" }}>로딩 중...</p>;
  }

  if (error || !post) {
    return <p style={{ textAlign: "center", color: "var(--danger)", padding: "3rem 0" }}>{error || "게시글을 찾을 수 없습니다."}</p>;
  }

  const isAuthor = user?.id === post.member.id;

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <StatusBadge status={post.postStatus} />
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>{post.title}</h1>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.75rem" }}>
          {post.tags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", color: "var(--muted)" }}>
          <span>{post.member.nickname} &middot; {post.createdAt?.slice(0, 16).replace("T", " ")}</span>
          {isAuthor && (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={toggleStatus}
                style={{
                  padding: "0.3rem 0.6rem",
                  fontSize: "0.75rem",
                  background: post.postStatus === "SOLVED" ? "var(--unsolved-bg)" : "var(--solved-bg)",
                  color: post.postStatus === "SOLVED" ? "var(--unsolved)" : "var(--solved)",
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                }}
              >
                {post.postStatus === "SOLVED" ? "미해결로 변경" : "해결됨으로 변경"}
              </button>
              <Link
                href={`/posts/${postId}/edit`}
                style={{
                  padding: "0.3rem 0.6rem",
                  fontSize: "0.75rem",
                  background: "var(--background)",
                  color: "var(--primary)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "0.25rem",
                  textDecoration: "none",
                }}
              >
                수정
              </Link>
              <button
                onClick={handleDelete}
                style={{
                  padding: "0.3rem 0.6rem",
                  fontSize: "0.75rem",
                  background: "var(--background)",
                  color: "var(--danger)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                }}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          padding: "1.25rem",
          border: "1px solid var(--card-border)",
          borderRadius: "0.5rem",
          background: "var(--card)",
          whiteSpace: "pre-wrap",
          fontSize: "0.9rem",
          lineHeight: 1.7,
          minHeight: "8rem",
        }}
      >
        {post.content}
      </div>

      <CommentSection postId={Number(postId)} />
    </div>
  );
}
