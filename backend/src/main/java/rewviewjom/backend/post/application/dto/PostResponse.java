package rewviewjom.backend.post.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import rewviewjom.backend.member.application.dto.MemberResponse;
import rewviewjom.backend.member.domain.Member;
import rewviewjom.backend.post.domain.Post;
import rewviewjom.backend.post.domain.PostStatus;

import java.time.LocalDateTime;

@Getter
@Builder
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private PostStatus postStatus;
    private MemberResponse member;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostResponse from(Post post, Member member) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .postStatus(post.getStatus())
                .member(MemberResponse.from(member))
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
