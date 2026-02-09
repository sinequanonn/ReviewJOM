"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import type { PostListResponse, PageResponse, PostStatus } from "@/lib/types";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";

type StatusFilter = PostStatus | "ALL";

export default function HomePage() {
  return (
    <Suspense fallback={<p style={{ textAlign: "center", color: "var(--muted)", padding: "2rem 0" }}>로딩 중...</p>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page") ?? "0");
  const currentStatus = (searchParams.get("status") ?? "ALL") as StatusFilter;
  const currentKeyword = searchParams.get("keyword") ?? "";

  const [data, setData] = useState<PageResponse<PostListResponse> | null>(null);
  const [keyword, setKeyword] = useState(currentKeyword);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("size", "10");
      if (currentStatus !== "ALL") params.set("status", currentStatus);
      if (currentKeyword) params.set("keyword", currentKeyword);

      const res = await api.get<PageResponse<PostListResponse>>(`/api/v1/posts?${params}`);
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentStatus, currentKeyword]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(updates)) {
      if (val === null || val === "" || val === "ALL") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    }
    router.push(`/?${params}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ keyword: keyword, page: null });
  }

  const filterBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: "0.35rem 0.75rem",
    fontSize: "0.8rem",
    fontWeight: active ? 600 : 400,
    border: "1px solid var(--card-border)",
    borderRadius: "9999px",
    background: active ? "var(--primary)" : "var(--background)",
    color: active ? "#fff" : "var(--foreground)",
    cursor: "pointer",
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 700 }}>게시글</h1>
      </div>

      <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
          style={{
            flex: 1,
            padding: "0.5rem 0.75rem",
            border: "1px solid var(--input-border)",
            borderRadius: "0.375rem",
            background: "var(--background)",
            color: "var(--foreground)",
            fontSize: "0.875rem",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            borderRadius: "0.375rem",
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          검색
        </button>
      </form>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
        {(["ALL", "UNSOLVED", "SOLVED"] as StatusFilter[]).map((s) => (
          <button
            key={s}
            style={filterBtnStyle(currentStatus === s)}
            onClick={() => updateParams({ status: s, page: null })}
          >
            {s === "ALL" ? "전체" : s === "UNSOLVED" ? "미해결" : "해결됨"}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "var(--muted)", padding: "2rem 0" }}>로딩 중...</p>
      ) : !data || data.content.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--muted)", padding: "2rem 0" }}>게시글이 없습니다.</p>
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
            onPageChange={(p) => updateParams({ page: String(p) })}
          />
        </>
      )}
    </div>
  );
}
