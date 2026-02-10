"use client";

import type { MemberResponse } from "@/lib/types";

interface MyPageProfileProps {
    user: MemberResponse;
    nickname: string;
    setNickname: (v: string) => void;
    nickError: string;
    onSave: () => void;
    onCancel: () => void;
}

export default function MyPageProfile({
    user,
    nickname,
    setNickname,
    nickError,
    onSave,
    onCancel,
}: MyPageProfileProps) {
    const initial = user.nickname?.charAt(0).toUpperCase() ?? "?";
    const joinedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
        : "";

    return (
        <div>
            {/* Profile Card */}
            <div className="profile-card">
                {/* Banner */}
                <div className="profile-banner">
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar">
                            {user.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt={user.nickname}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                initial
                            )}
                            <span className="profile-avatar-edit">
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path
                                        d="M7.5 1.25L8.75 2.5L3.75 7.5H2.5V6.25L7.5 1.25Z"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="profile-form">
                    <p className="form-hint">Max size 5MB. JPG, PNG.</p>

                    {/* Nickname */}
                    <div className="field-group">
                        <label>Nickname</label>
                        <input
                            type="text"
                            className="profile-input"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            minLength={2}
                            maxLength={20}
                        />
                        {nickError && (
                            <p style={{ color: "var(--danger)", fontSize: "0.75rem", margin: "0.25rem 0 0" }}>
                                {nickError}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="profile-actions">
                        <button className="btn-save" onClick={onSave}>
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Joined */}
                <div className="profile-joined">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="1.75" y="2.5" width="10.5" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M1.75 5.5h10.5" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M4.5 1.5v2M9.5 1.5v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    Joined on {joinedDate}
                </div>
            </div>
        </div>
    );
}
