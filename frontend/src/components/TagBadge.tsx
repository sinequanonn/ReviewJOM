import type { TagResponse } from "@/lib/types";

export default function TagBadge({ tag }: { tag: TagResponse }) {
  const isLang = tag.category === "LANGUAGE";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.2rem 0.6rem",
        fontSize: "0.75rem",
        fontWeight: 500,
        borderRadius: "0.3rem",
        background: "var(--tag-bg)",
        color: "var(--foreground)",
      }}
    >
      <span
        style={{
          width: "0.45rem",
          height: "0.45rem",
          borderRadius: "50%",
          background: isLang ? "var(--tag-language-dot)" : "var(--tag-framework-dot)",
          flexShrink: 0,
        }}
      />
      {tag.name}
    </span>
  );
}
