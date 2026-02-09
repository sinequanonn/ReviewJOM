package rewviewjom.backend.post.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;
import rewviewjom.backend.global.BaseEntity;
import rewviewjom.backend.member.domain.Member;
import rewviewjom.backend.tag.domain.Tag;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLRestriction("deleted = false")
public class Post extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PostStatus status;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostTag> postTags = new ArrayList<>();

    private boolean deleted = false;

    @Builder
    public Post(Member member, String title, String content) {
        this.member = member;
        this.title = title;
        this.content = content;
        this.status = PostStatus.UNSOLVED;
    }

    public void update(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public void updateStatus(PostStatus status) {
        this.status = status;
    }

    public boolean isAuthor(Long memberId) {
        return memberId.equals(this.member.getId());
    }

    public void softDelete() {
        this.deleted = true;
    }

    public void addTag(Tag tag) {
        PostTag postTag = new PostTag(this, tag);
        this.postTags.add(postTag);
    }

    public void clearTags() {
        this.postTags.clear();
    }
}
