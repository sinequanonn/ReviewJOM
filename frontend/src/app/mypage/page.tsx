"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api, ApiError } from "@/lib/api";
import type { PostListResponse, PageResponse, MemberResponse } from "@/lib/types";
import MyPageProfile from "@/components/MyPageProfile";
import MyPageStats from "@/components/MyPageStats";
import MyPageReviewList from "@/components/MyPageReviewList";

export default function MyPage() {
  const router = useRouter();
  const { user, isLoading, updateUser } = useAuth();
  const [nickname, setNickname] = useState("");
  const [nickError, setNickError] = useState("");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PageResponse<PostListResponse> | null>(null);
  const [postsLoading, setPostsLoading] = useState(true);

  const fetchMyPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const res = await api.get<PageResponse<PostListResponse>>(`/api/v1/posts/me?page=${page}&size=4`);
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
    return (
      <div className="mypage-container">
        <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0" }}>
          로딩 중...
        </p>
      </div>
    );
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
    } catch (err) {
      setNickError(err instanceof ApiError ? err.message : "닉네임 변경에 실패했습니다.");
    }
  }

  function handleCancel() {
    if (user) {
      setNickname(user.nickname);
      setNickError("");
    }
  }

  // Mocked stats — in a real app these come from an API
  const totalReviews = data?.totalElements ?? 0;
  const resolvedCount = data?.content.filter((p) => p.status === "SOLVED").length ?? 0;
  const totalComments = data?.content.reduce((sum, p) => sum + (p.commentCount ?? 0), 0) ?? 0;

  return (
    <div className="mypage-container">
      {/* Header */}
      <div className="mypage-header">
        <h1>Profile &amp; Settings</h1>
        <p></p>
      </div>

      {/* Body */}
      <div className="mypage-body">
        {/* Left — Profile */}
        <MyPageProfile
          user={user}
          nickname={nickname}
          setNickname={setNickname}
          nickError={nickError}
          onSave={handleNicknameUpdate}
          onCancel={handleCancel}
        />

        {/* Right — Stats + Reviews */}
        <div>
          <MyPageStats
            reviewCount={totalReviews}
            resolvedCount={resolvedCount}
            commentCount={totalComments}
          />
          <MyPageReviewList
            data={data}
            loading={postsLoading}
            page={page}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
