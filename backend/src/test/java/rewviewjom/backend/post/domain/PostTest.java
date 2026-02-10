package rewviewjom.backend.post.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import rewviewjom.backend.fixture.MemberFixture;
import rewviewjom.backend.fixture.TagFixture;
import rewviewjom.backend.member.domain.Member;
import rewviewjom.backend.tag.domain.Tag;
import rewviewjom.backend.tag.domain.TagCategory;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Post 도메인 테스트")
class PostTest {

    @Test
    @DisplayName("게시글을 생성하면 초기 상태는 UNSOLVED이다")
    void create_validInput_statusUnsolved() {
        // Given
        Member member = MemberFixture.createMemberWithId(1L);

        // When
        Post post = Post.builder()
                .member(member)
                .title("테스트 제목")
                .content("테스트 내용")
                .build();

        // Then
        assertThat(post.getTitle()).isEqualTo("테스트 제목");
        assertThat(post.getContent()).isEqualTo("테스트 내용");
        assertThat(post.getMember()).isEqualTo(member);
        assertThat(post.getStatus()).isEqualTo(PostStatus.UNSOLVED);
        assertThat(post.isDeleted()).isFalse();
        assertThat(post.getPostTags()).isEmpty();
    }

    @Test
    @DisplayName("게시글 제목과 내용을 수정할 수 있다")
    void update_titleAndContent_updated() {
        // Given
        Member member = MemberFixture.createMemberWithId(1L);
        Post post = Post.builder()
                .member(member)
                .title("원래 제목")
                .content("원래 내용")
                .build();

        // When
        post.update("수정된 제목", "수정된 내용");

        // Then
        assertThat(post.getTitle()).isEqualTo("수정된 제목");
        assertThat(post.getContent()).isEqualTo("수정된 내용");
    }

    @Test
    @DisplayName("게시글 상태를 변경할 수 있다")
    void updateStatus_solved_statusChanged() {
        // Given
        Member member = MemberFixture.createMemberWithId(1L);
        Post post = Post.builder()
                .member(member)
                .title("제목")
                .content("내용")
                .build();

        // When
        post.updateStatus(PostStatus.SOLVED);

        // Then
        assertThat(post.getStatus()).isEqualTo(PostStatus.SOLVED);
    }

    @Test
    @DisplayName("게시글 작성자를 확인할 수 있다 - 작성자인 경우")
    void isAuthor_sameAuthor_returnsTrue() {
        // Given
        Member member = MemberFixture.createMemberWithId(1L);
        Post post = Post.builder()
                .member(member)
                .title("제목")
                .content("내용")
                .build();

        // When
        boolean result = post.isAuthor(1L);

        // Then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("게시글 작성자를 확인할 수 있다 - 작성자가 아닌 경우")
    void isAuthor_differentAuthor_returnsFalse() {
        // Given
        Member member = MemberFixture.createMemberWithId(1L);
        Post post = Post.builder()
                .member(member)
                .title("제목")
                .content("내용")
                .build();

        // When
        boolean result = post.isAuthor(999L);

        // Then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("게시글을 소프트 삭제할 수 있다")
    void softDelete_post_deletedTrue() {
        // Given
        Member member = MemberFixture.createMemberWithId(1L);
        Post post = Post.builder()
                .member(member)
                .title("제목")
                .content("내용")
                .build();

        // When
        post.softDelete();

        // Then
        assertThat(post.isDeleted()).isTrue();
    }

    @Test
    @DisplayName("게시글에 태그를 추가할 수 있다")
    void addTag_validTag_tagAdded() {
        // Given
        Member member = MemberFixture.createMemberWithId(1L);
        Post post = Post.builder()
                .member(member)
                .title("제목")
                .content("내용")
                .build();
        Tag tag = TagFixture.createLanguageTag("Java");

        // When
        post.addTag(tag);

        // Then
        assertThat(post.getPostTags()).hasSize(1);
        assertThat(post.getPostTags().get(0).getTag()).isEqualTo(tag);
    }

    @Test
    @DisplayName("게시글의 태그를 모두 제거할 수 있다")
    void clearTags_existingTags_tagsCleared() {
        // Given
        Member member = MemberFixture.createMemberWithId(1L);
        Post post = Post.builder()
                .member(member)
                .title("제목")
                .content("내용")
                .build();
        post.addTag(TagFixture.createLanguageTag("Java"));
        post.addTag(TagFixture.createFrameworkTag("Spring"));

        // When
        post.clearTags();

        // Then
        assertThat(post.getPostTags()).isEmpty();
    }
}
