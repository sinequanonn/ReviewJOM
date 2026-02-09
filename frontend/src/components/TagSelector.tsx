"use client";

import { useEffect, useState } from "react";
import type { TagResponse } from "@/lib/types";
import { api } from "@/lib/api";

interface Props {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export default function TagSelector({ selectedIds, onChange }: Props) {
  const [tags, setTags] = useState<TagResponse[]>([]);

  useEffect(() => {
    api.get<TagResponse[]>("/api/v1/tags").then(setTags).catch(() => {});
  }, []);

  function toggle(id: number) {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((v) => v !== id)
        : [...selectedIds, id],
    );
  }

  const languages = tags.filter((t) => t.category === "LANGUAGE");
  const frameworks = tags.filter((t) => t.category === "FRAMEWORK");

  const chipStyle = (selected: boolean, isLang: boolean): React.CSSProperties => ({
    padding: "0.3rem 0.65rem",
    fontSize: "0.8rem",
    borderRadius: "9999px",
    border: selected ? "none" : "1px solid var(--card-border)",
    background: selected
      ? isLang ? "var(--tag-language)" : "var(--tag-framework)"
      : "var(--background)",
    color: selected ? "#fff" : "var(--foreground)",
    cursor: "pointer",
  });

  function renderGroup(label: string, items: TagResponse[], isLang: boolean) {
    if (items.length === 0) return null;
    return (
      <div style={{ marginBottom: "0.5rem" }}>
        <p style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.35rem", color: "var(--muted)" }}>{label}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {items.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggle(tag.id)}
              style={chipStyle(selectedIds.includes(tag.id), isLang)}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {renderGroup("언어", languages, true)}
      {renderGroup("프레임워크", frameworks, false)}
    </div>
  );
}
