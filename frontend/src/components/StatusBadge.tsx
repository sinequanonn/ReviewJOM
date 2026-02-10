import type { PostStatus } from "@/lib/types";

export default function StatusBadge({ status }: { status: PostStatus }) {
  const isSolved = status === "SOLVED";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        padding: "0.2rem 0.6rem",
        fontSize: "0.7rem",
        fontWeight: 600,
        borderRadius: "9999px",
        color: isSolved ? "var(--solved)" : "var(--unsolved)",
        background: isSolved ? "var(--solved-bg)" : "var(--unsolved-bg)",
        letterSpacing: "0.02em",
        textTransform: "uppercase",
      }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        {isSolved ? (
          <path d="M2.5 5l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        )}
      </svg>
      {isSolved ? "SOVLED" : "UNSOLVED"}
    </span>
  );
}
