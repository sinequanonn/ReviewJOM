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
import rewviewjom.backend.tag.application.dto.TagResponse;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private PostStatus postStatus;
    private MemberResponse member;
    private List<TagResponse> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostResponse from(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .postStatus(post.getStatus())
                .member(MemberResponse.from(post.getMember()))
                .tags(post.getPostTags().stream()
                        .map(pt -> TagResponse.from(pt.getTag()))
                        .toList())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
