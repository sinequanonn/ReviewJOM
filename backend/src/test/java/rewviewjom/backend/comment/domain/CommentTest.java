package rewviewjom.backend.comment.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import rewviewjom.backend.fixture.CommentFixture;
import rewviewjom.backend.fixture.MemberFixture;
import rewviewjom.backend.fixture.PostFixture;
import rewviewjom.backend.member.domain.Member;
import rewviewjom.backend.post.domain.Post;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Comment 도메인 테스트")
class CommentTest {

    @Test
    @DisplayName("댓글을 생성할 수 있다")
    void create_validInput_commentCreated() {
        // Given
        Member member = MemberFixture.createMemberWithId(1L);
        Post post = PostFixture.createPostWithId(1L, member);

        // When
        Comment comment = Comment.builder()
                .member(member)
                .post(post)
                .content("테스트 댓글")
                .build();

        // Then
        assertThat(comment.getContent()).isEqualTo("테스트 댓글");
        assertThat(comment.getMember()).isEqualTo(member);
        assertThat(comment.getPost()).isEqualTo(post);
        assertThat(comment.isDeleted()).isFalse();
    }

    @Test
    @DisplayName("댓글 작성자를 확인할 수 있다 - 작성자인 경우")
    void isAuthor_sameAuthor_returnsTrue() {
        // Given
        Member member = MemberFixture.createMemberWithId(1L);
        Post post = PostFixture.createPostWithId(1L, member);
        Comment comment = CommentFixture.createComment(member, post);

        // When
        boolean result = comment.isAuthor(1L);

        // Then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("댓글 작성자를 확인할 수 있다 - 작성자가 아닌 경우")
    void isAuthor_differentAuthor_returnsFalse() {
        // Given
        Member member = MemberFixture.createMemberWithId(1L);
        Post post = PostFixture.createPostWithId(1L, member);
        Comment comment = CommentFixture.createComment(member, post);

        // When
        boolean result = comment.isAuthor(999L);

        // Then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("댓글 내용을 수정할 수 있다")
    void updateContent_newContent_contentUpdated() {
        // Given
        Member member = MemberFixture.createMemberWithId(1L);
        Post post = PostFixture.createPostWithId(1L, member);
        Comment comment = CommentFixture.createComment(member, post);

        // When
        comment.updateContent("수정된 댓글 내용");

        // Then
        assertThat(comment.getContent()).isEqualTo("수정된 댓글 내용");
    }

    @Test
    @DisplayName("댓글을 소프트 삭제할 수 있다")
    void softDelete_comment_deletedTrue() {
        // Given
        Member member = MemberFixture.createMemberWithId(1L);
        Post post = PostFixture.createPostWithId(1L, member);
        Comment comment = CommentFixture.createComment(member, post);

        // When
        comment.softDelete();

        // Then
        assertThat(comment.isDeleted()).isTrue();
    }

    @Test
    @DisplayName("생성일과 수정일이 같으면 수정되지 않은 것이다")
    void isModified_sameCreateAndUpdate_returnsFalse() {
        // Given
        Member member = MemberFixture.createMemberWithId(1L);
        Post post = PostFixture.createPostWithId(1L, member);
        Comment comment = CommentFixture.createComment(member, post);
        LocalDateTime now = LocalDateTime.now();
        ReflectionTestUtils.setField(comment, "createdAt", now);
        ReflectionTestUtils.setField(comment, "updatedAt", now);

        // When
        boolean result = comment.isModified();

        // Then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("생성일과 수정일이 다르면 수정된 것이다")
    void isModified_differentCreateAndUpdate_returnsTrue() {
        // Given
        Member member = MemberFixture.createMemberWithId(1L);
        Post post = PostFixture.createPostWithId(1L, member);
        Comment comment = CommentFixture.createComment(member, post);
        LocalDateTime createdAt = LocalDateTime.of(2024, 1, 1, 0, 0);
        LocalDateTime updatedAt = LocalDateTime.of(2024, 1, 2, 0, 0);
        ReflectionTestUtils.setField(comment, "createdAt", createdAt);
        ReflectionTestUtils.setField(comment, "updatedAt", updatedAt);

        // When
        boolean result = comment.isModified();

        // Then
        assertThat(result).isTrue();
    }
}
