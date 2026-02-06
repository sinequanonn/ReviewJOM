package rewviewjom.backend.post.application.dto;

import lombok.Builder;
import lombok.Getter;
import rewviewjom.backend.member.application.dto.MemberResponse;
import rewviewjom.backend.post.domain.Post;
import rewviewjom.backend.post.domain.PostStatus;
import rewviewjom.backend.tag.application.dto.TagResponse;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class PostListResponse {
    private Long id;
    private String title;
    private PostStatus status;
    private int commentCount;
    private MemberResponse member;
    private List<TagResponse> tags;
    private LocalDateTime updatedAt;

    public static PostListResponse from(Post post) {
        return PostListResponse.builder()
                .id(post.getId())
                .status(post.getStatus())
                .member(MemberResponse.from(post.getMember()))
                .tags(post.getPostTags().stream()
                        .map(pt -> TagResponse.from(pt.getTag()))
                        .toList())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
