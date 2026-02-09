import type { PostStatus } from "@/lib/types";

export default function StatusBadge({ status }: { status: PostStatus }) {
  const isSolved = status === "SOLVED";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.15rem 0.5rem",
        fontSize: "0.75rem",
        fontWeight: 600,
        borderRadius: "9999px",
        color: isSolved ? "var(--solved)" : "var(--unsolved)",
        background: isSolved ? "var(--solved-bg)" : "var(--unsolved-bg)",
      }}
    >
      {isSolved ? "해결됨" : "미해결"}
    </span>
  );
}
