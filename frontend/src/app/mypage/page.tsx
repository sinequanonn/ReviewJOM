"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api, ApiError } from "@/lib/api";
import type { PostListResponse, PageResponse, MemberResponse } from "@/lib/types";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";

export default function MyPage() {
  const router = useRouter();
  const { user, isLoading, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [nickError, setNickError] = useState("");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PageResponse<PostListResponse> | null>(null);
  const [postsLoading, setPostsLoading] = useState(true);

  const fetchMyPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const res = await api.get<PageResponse<PostListResponse>>(`/api/v1/posts/me?page=${page}&size=10`);
      setData(res);
    } catch {
      setData(null);
    } finally {
      setPostsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname);
      fetchMyPosts();
    }
  }, [user, fetchMyPosts]);

  if (isLoading) {
    return <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0" }}>로딩 중...</p>;
  }

  if (!user) {
    router.replace("/login");
    return null;
  }

  async function handleNicknameUpdate() {
    if (!nickname.trim() || nickname.length < 2 || nickname.length > 20) {
      setNickError("닉네임은 2~20자로 입력하세요.");
      return;
    }
    setNickError("");
    try {
      const updated = await api.patch<MemberResponse>("/api/v1/members/me", { nickname });
      updateUser(updated);
      setEditing(false);
    } catch (err) {
      setNickError(err instanceof ApiError ? err.message : "닉네임 변경에 실패했습니다.");
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>마이페이지</h1>

      <div style={{ padding: "1.25rem", border: "1px solid var(--card-border)", borderRadius: "0.5rem", background: "var(--card)", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          {editing ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                minLength={2}
                maxLength={20}
                style={{
                  padding: "0.4rem 0.6rem",
                  border: "1px solid var(--input-border)",
                  borderRadius: "0.375rem",
                  background: "var(--background)",
                  color: "var(--foreground)",
                  fontSize: "0.9rem",
                }}
              />
              <button
                onClick={handleNicknameUpdate}
                style={{ padding: "0.35rem 0.7rem", fontSize: "0.8rem", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "0.25rem", cursor: "pointer" }}
              >
                저장
              </button>
              <button
                onClick={() => { setEditing(false); setNickname(user.nickname); setNickError(""); }}
                style={{ padding: "0.35rem 0.7rem", fontSize: "0.8rem", background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--card-border)", borderRadius: "0.25rem", cursor: "pointer" }}
              >
                취소
              </button>
            </div>
          ) : (
            <>
              <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>{user.nickname}</span>
              <button
                onClick={() => setEditing(true)}
                style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", color: "var(--primary)", background: "none", border: "1px solid var(--card-border)", borderRadius: "0.25rem", cursor: "pointer" }}
              >
                수정
              </button>
            </>
          )}
        </div>
        {nickError && <p style={{ color: "var(--danger)", fontSize: "0.8rem", margin: "0.25rem 0 0" }}>{nickError}</p>}
        <p style={{ fontSize: "0.8rem", color: "var(--muted)", margin: 0 }}>
          가입일: {user.createdAt?.slice(0, 10)}
        </p>
      </div>

      <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem" }}>내 게시글</h2>

      {postsLoading ? (
        <p style={{ textAlign: "center", color: "var(--muted)", padding: "2rem 0" }}>로딩 중...</p>
      ) : !data || data.content.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--muted)", padding: "2rem 0" }}>작성한 게시글이 없습니다.</p>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {data.content.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            hasNext={data.hasNext}
            hasPrevious={data.hasPrevious}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
