import Link from "next/link";
import type { PostListResponse } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import TagBadge from "./TagBadge";

export default function PostCard({ post }: { post: PostListResponse }) {
  return (
    <Link
      href={`/posts/${post.id}`}
      style={{
        display: "block",
        padding: "1rem",
        border: "1px solid var(--card-border)",
        borderRadius: "0.5rem",
        background: "var(--card)",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <StatusBadge status={post.status} />
        <h2 style={{ fontSize: "1rem", fontWeight: 600, margin: 0, flex: 1 }}>
          {post.title || "(제목 없음)"}
        </h2>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.5rem" }}>
        {post.tags?.map((tag) => (
          <TagBadge key={tag.id} tag={tag} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--muted)" }}>
        <span>{post.member?.nickname}</span>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <span>댓글 {post.commentCount ?? 0}</span>
          <span>{post.updatedAt?.slice(0, 10)}</span>
        </div>
      </div>
    </Link>
  );
}
