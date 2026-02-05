package rewviewjom.backend.member.application.dto;

import lombok.Builder;
import lombok.Getter;
import rewviewjom.backend.member.domain.Member;

import java.time.LocalDateTime;

@Getter
@Builder
public class MemberResponse {
    private Long id;
    private String nickname;
    private String profileImage;
    private LocalDateTime createdAt;

    public static MemberResponse from(Member member) {
        return MemberResponse.builder()
                .id(member.getId())
                .nickname(member.getNickname())
                .profileImage(member.getProfileImage())
                .createdAt(member.getCreatedAt())
                .build();
    }
}
