import type { TagResponse } from "@/lib/types";

export default function TagBadge({ tag }: { tag: TagResponse }) {
  const isLang = tag.category === "LANGUAGE";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.15rem 0.5rem",
        fontSize: "0.7rem",
        fontWeight: 500,
        borderRadius: "0.25rem",
        color: isLang ? "var(--tag-language)" : "var(--tag-framework)",
        background: isLang ? "var(--tag-language-bg)" : "var(--tag-framework-bg)",
      }}
    >
      {tag.name}
    </span>
  );
}
