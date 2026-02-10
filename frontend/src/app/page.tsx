"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import type { PostListResponse, PageResponse, PostStatus, TagResponse } from "@/lib/types";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";

type StatusFilter = PostStatus | "ALL";

export default function HomePage() {
  return (
    <Suspense fallback={<p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0" }}>로딩 중...</p>}>
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
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<TagResponse[]>("/api/v1/tags").then((res) => setTags(res ?? [])).catch(() => { });
  }, []);

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

  const statusFilters: { key: StatusFilter; label: string; icon: "all" | "solved" | "unsolved" }[] = [
    { key: "ALL", label: `전체 요청${data ? ` ${data.totalElements}` : ""}`, icon: "all" },
    { key: "SOLVED", label: "Resolved", icon: "solved" },
    { key: "UNSOLVED", label: "Unresolved", icon: "unsolved" },
  ];

  const languages = tags.filter((t) => t.category === "LANGUAGE");
  const frameworks = tags.filter((t) => t.category === "FRAMEWORK");

  return (
    <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "1.5rem", display: "flex", gap: "2rem" }}>
      {/* ===== LEFT SIDEBAR ===== */}
      <aside style={{ width: "14rem", flexShrink: 0 }}>
        {/* Filters header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.25rem" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M4 8h8M6 12h4" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Filters</span>
        </div>

        {/* Resolution Status */}
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Resolution Status
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
            {statusFilters.map((f) => {
              const active = currentStatus === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => updateParams({ status: f.key, page: null })}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 0.65rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    background: active ? "var(--sidebar-active)" : "transparent",
                    color: active ? "var(--primary)" : "var(--foreground)",
                    fontWeight: active ? 600 : 400,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  {f.icon === "all" && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 4h10M3 8h10M3 12h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  )}
                  {f.icon === "solved" && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="var(--solved)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {f.icon === "unsolved" && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="5" stroke="var(--unsolved)" strokeWidth="1.3" />
                    </svg>
                  )}
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Technology Tags */}
        <div>
          <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Technology Tags
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {[...languages, ...frameworks].map((tag) => {
              const isLang = tag.category === "LANGUAGE";
              const isSelected = selectedTagIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => {
                    setSelectedTagIds((prev) =>
                      prev.includes(tag.id)
                        ? prev.filter((id) => id !== tag.id)
                        : [...prev, tag.id]
                    );
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.45rem 0.65rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    background: isSelected ? "var(--sidebar-active)" : "transparent",
                    color: isSelected ? "var(--primary)" : "var(--foreground)",
                    fontWeight: isSelected ? 600 : 400,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: isSelected ? 600 : 500 }}>{tag.name}</span>
                      <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                        {isLang ? "Language" : "Framework"}
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      width: "0.5rem",
                      height: "0.5rem",
                      borderRadius: "50%",
                      background: isLang ? "var(--tag-language-dot)" : "var(--tag-framework-dot)",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title + sort */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 0.25rem" }}>Recent Code Reviews</h1>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: 0 }}>
                코드 리뷰를 공유하고, 피드백을 주고받으세요.
              </p>
            </div>
          </div>
        </div>

        {/* Post list */}
        {loading ? (
          <p style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 0" }}>로딩 중...</p>
        ) : !data || data.content.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--muted)" }}>
            <p style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>게시글이 없습니다.</p>
            <p style={{ fontSize: "0.85rem" }}>첫 번째 코드 리뷰를 작성해보세요!</p>
          </div>
        ) : (() => {
          const filtered = selectedTagIds.length === 0
            ? data.content
            : data.content.filter((post) =>
              post.tags.some((t) => selectedTagIds.includes(t.id))
            );
          return filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--muted)" }}>
              <p style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>선택한 태그에 해당하는 게시글이 없습니다.</p>
              <p style={{ fontSize: "0.85rem" }}>다른 태그를 선택해보세요.</p>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {filtered.map((post) => (
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
          );
        })()}
      </div>
    </div>
  );
}
