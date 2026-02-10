interface MyPageStatsProps {
    reviewCount: number;
    resolvedCount: number;
    commentCount: number;
}

export default function MyPageStats({
    reviewCount,
    resolvedCount,
    commentCount,
}: MyPageStatsProps) {
    return (
        <div className="stats-row">
            {/* Reviews */}
            <div className="stat-card">
                <div className="stat-icon reviews">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <rect x="3" y="2" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M6 6h6M6 9h6M6 12h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                </div>
                <div>
                    <div className="stat-value">{reviewCount}</div>
                    <div className="stat-label">Reviews</div>
                </div>
            </div>

            {/* Resolved */}
            <div className="stat-card">
                <div className="stat-icon resolved">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div>
                    <div className="stat-value">{resolvedCount}</div>
                    <div className="stat-label">Resolved</div>
                </div>
            </div>

            {/* Comments */}
            <div className="stat-card">
                <div className="stat-icon comments">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path
                            d="M3 4.5A1.5 1.5 0 014.5 3h9A1.5 1.5 0 0115 4.5v7a1.5 1.5 0 01-1.5 1.5H7l-3 2.5V13H4.5A1.5 1.5 0 013 11.5v-7z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                        <path d="M6.5 7h5M6.5 9.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                </div>
                <div>
                    <div className="stat-value">{commentCount}</div>
                    <div className="stat-label">Comments</div>
                </div>
            </div>
        </div>
    );
}
