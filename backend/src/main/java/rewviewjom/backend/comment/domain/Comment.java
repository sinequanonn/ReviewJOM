package rewviewjom.backend.comment.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;
import rewviewjom.backend.global.BaseEntity;
import rewviewjom.backend.member.domain.Member;
import rewviewjom.backend.post.domain.Post;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLRestriction("deleted = false")
public class Comment extends BaseEntity {

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    private boolean deleted = false;

    @Builder
    public Comment(String content, Member member, Post post) {
        this.content = content;
        this.member = member;
        this.post = post;
    }

    public boolean isModified() {
        return !this.getCreatedAt().equals(this.getUpdatedAt());
    }

    public boolean isAuthor(Long memberId) {
        return memberId.equals(this.member.getId());
    }

    public void updateContent(String content) {
        this.content = content;
    }

    public void softDelete() {
        this.deleted = true;
    }
}
