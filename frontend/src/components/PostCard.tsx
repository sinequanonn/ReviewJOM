import Link from "next/link";
import type { PostListResponse } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import TagBadge from "./TagBadge";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const d = new Date(dateStr).getTime();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
  return dateStr?.slice(0, 10);
}

export default function PostCard({ post }: { post: PostListResponse }) {
  const firstTag = post.tags?.[0];

  return (
    <Link
      href={`/posts/${post.id}`}
      style={{
        display: "block",
        padding: "1.25rem 1.5rem",
        background: "var(--card)",
        borderRadius: "0.75rem",
        border: "1px solid var(--card-border)",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {/* author + status */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "1.75rem",
              height: "1.75rem",
              borderRadius: "50%",
              background: "var(--avatar-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.7rem",
              fontWeight: 600,
              color: "var(--muted)",
              flexShrink: 0,
            }}
          >
            {post.member?.nickname?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{post.member?.nickname}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              {post.updatedAt && timeAgo(post.updatedAt)}
              {firstTag && ` · ${firstTag.name}`}
            </span>
          </div>
        </div>
        <StatusBadge status={post.status} />
      </div>

      {/* title */}
      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0 0 0.75rem", lineHeight: 1.4 }}>
        {post.title || "(제목 없음)"}
      </h3>

      {/* tags + comments */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {post.tags?.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>
        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--muted)" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1.75 3.5A1.75 1.75 0 013.5 1.75h7A1.75 1.75 0 0112.25 3.5v5A1.75 1.75 0 0110.5 10.25H5.25L2.625 12.25V10.25H3.5A1.75 1.75 0 011.75 8.5V3.5z" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          {post.commentCount ?? 0} Comments
        </span>
      </div>
    </Link>
  );
}
