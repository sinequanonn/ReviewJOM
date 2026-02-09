"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, hasNext, hasPrevious, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(0, page - 2);
  const end = Math.min(totalPages - 1, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  const btnStyle = (active: boolean, disabled: boolean): React.CSSProperties => ({
    padding: "0.35rem 0.65rem",
    fontSize: "0.8rem",
    border: "1px solid var(--card-border)",
    borderRadius: "0.25rem",
    background: active ? "var(--primary)" : "var(--background)",
    color: active ? "#fff" : "var(--foreground)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
  });

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "0.35rem", marginTop: "1.5rem" }}>
      <button style={btnStyle(false, !hasPrevious)} disabled={!hasPrevious} onClick={() => onPageChange(page - 1)}>
        이전
      </button>
      {pages.map((p) => (
        <button key={p} style={btnStyle(p === page, false)} onClick={() => onPageChange(p)}>
          {p + 1}
        </button>
      ))}
      <button style={btnStyle(false, !hasNext)} disabled={!hasNext} onClick={() => onPageChange(page + 1)}>
        다음
      </button>
    </div>
  );
}
