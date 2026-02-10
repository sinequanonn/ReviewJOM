"use client";

import Link from "next/link";
import type { PostListResponse, PageResponse } from "@/lib/types";
import StatusBadge from "./StatusBadge";

function timeAgo(dateStr: string): string {
    const now = Date.now();
    const d = new Date(dateStr).getTime();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 2592000) return `${Math.floor(diff / 604800)} weeks ago`;
    return `${Math.floor(diff / 2592000)} months ago`;
}

interface MyPageReviewListProps {
    data: PageResponse<PostListResponse> | null;
    loading: boolean;
    page: number;
    onPageChange: (page: number) => void;
}

export default function MyPageReviewList({
    data,
    loading,
    page,
    onPageChange,
}: MyPageReviewListProps) {
    const pageSize = data?.size ?? 4;
    const totalElements = data?.totalElements ?? 0;
    const startItem = page * pageSize + 1;
    const endItem = Math.min((page + 1) * pageSize, totalElements);

    return (
        <div className="review-panel">
            {/* Header */}
            <div className="review-panel-header">
                <h2>Authored Reviews</h2>
                <select className="filter-select" defaultValue="all">
                    <option value="all">All</option>
                    <option value="solved">SOLVED</option>
                    <option value="unsolved">UNSOLVED</option>
                </select>
            </div>

            {/* Table Head */}
            <div className="review-table-head">
                <span>Title</span>
                <span>Status</span>
                <span>Posted</span>
                <span></span>
            </div>

            {/* Rows */}
            {loading ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted)", fontSize: "0.85rem" }}>
                    로딩 중...
                </div>
            ) : !data || data.content.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted)", fontSize: "0.85rem" }}>
                    작성한 리뷰가 없습니다.
                </div>
            ) : (
                data.content.map((post) => {
                    const firstTag = post.tags?.[0];
                    return (
                        <Link
                            key={post.id}
                            href={`/posts/${post.id}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <div className="review-row">
                                {/* Title Cell */}
                                <div>
                                    <div className="review-title">{post.title || "(제목 없음)"}</div>
                                    <div className="review-meta">
                                        {firstTag && (
                                            <span className="tag-dot">
                                                <svg width="8" height="8" viewBox="0 0 8 8">
                                                    <circle cx="4" cy="4" r="3" fill="currentColor" />
                                                </svg>
                                                {firstTag.name}
                                            </span>
                                        )}
                                        <span className="comment-count">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path
                                                    d="M1.5 3A1.5 1.5 0 013 1.5h6A1.5 1.5 0 0110.5 3v4A1.5 1.5 0 019 8.5H5L2.5 10.5V8.5H3A1.5 1.5 0 011.5 7V3z"
                                                    stroke="currentColor"
                                                    strokeWidth="1"
                                                />
                                            </svg>
                                            {post.commentCount ?? 0} comments
                                        </span>
                                    </div>
                                </div>

                                {/* Status Cell */}
                                <div>
                                    <StatusBadge status={post.status} />
                                </div>

                                {/* Posted Cell */}
                                <div className="review-posted">
                                    {post.updatedAt && timeAgo(post.updatedAt)}
                                </div>

                                {/* More Button */}
                                <button
                                    className="review-more-btn"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                >
                                    ⋯
                                </button>
                            </div>
                        </Link>
                    );
                })
            )}

            {/* Footer Pagination */}
            {data && data.content.length > 0 && (
                <div className="review-footer">
                    <span>
                        Showing {startItem}-{endItem} of {totalElements} reviews
                    </span>
                    <div className="page-nav">
                        <button
                            className="page-btn"
                            disabled={!data.hasPrevious}
                            onClick={() => onPageChange(page - 1)}
                        >
                            Previous
                        </button>
                        <button
                            className="page-btn"
                            disabled={!data.hasNext}
                            onClick={() => onPageChange(page + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
