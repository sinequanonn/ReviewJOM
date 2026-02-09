package rewviewjom.backend.comment.application.dto;

import lombok.Builder;
import lombok.Getter;
import rewviewjom.backend.comment.domain.Comment;
import rewviewjom.backend.member.application.dto.MemberResponse;

import java.time.LocalDateTime;

@Getter
@Builder
public class CommentResponse {
    private Long id;
    private String content;
    private MemberResponse member;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean modified;

    public static CommentResponse from(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .member(MemberResponse.from(comment.getMember()))
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .modified(comment.isModified())
                .build();
    }
}
