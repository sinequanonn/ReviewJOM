package rewviewjom.backend.post.application.dto;

import lombok.Builder;
import lombok.Getter;
import rewviewjom.backend.member.application.dto.MemberResponse;
import rewviewjom.backend.post.domain.Post;
import rewviewjom.backend.post.domain.PostStatus;

import java.time.LocalDateTime;

@Getter
@Builder
public class PostListResponse {
    private Long id;
    private String title;
    private PostStatus status;
    private int commentCount;
    private MemberResponse member;
    private LocalDateTime updatedAt;

    public static PostListResponse from(Post post) {
        return PostListResponse.builder()
                .id(post.getId())
                .status(post.getStatus())
                .member(MemberResponse.from(post.getMember()))
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
