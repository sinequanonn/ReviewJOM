package rewviewjom.backend.comment.domain.repository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import rewviewjom.backend.comment.domain.Comment;
import rewviewjom.backend.member.domain.Member;
import rewviewjom.backend.post.domain.Post;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("CommentRepository 테스트")
@DataJpaTest
@ActiveProfiles("test")
class CommentRepositoryTest {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TestEntityManager em;

    private Member member1;
    private Member member2;
    private Post post;
    private Comment comment1;
    private Comment comment2;

    @BeforeEach
    void setUp() {
        member1 = Member.builder()
                .nickname("user1")
                .password("password123")
                .build();
        em.persist(member1);

        member2 = Member.builder()
                .nickname("user2")
                .password("password123")
                .build();
        em.persist(member2);

        post = Post.builder()
                .member(member1)
                .title("테스트 게시글")
                .content("테스트 내용")
                .build();
        em.persist(post);

        comment1 = Comment.builder()
                .member(member1)
                .post(post)
                .content("첫 번째 댓글")
                .build();
        em.persist(comment1);

        comment2 = Comment.builder()
                .member(member2)
                .post(post)
                .content("두 번째 댓글")
                .build();
        em.persist(comment2);

        em.flush();
        em.clear();
    }

    @Test
    @DisplayName("게시글 ID로 댓글 목록을 Member와 함께 조회할 수 있다")
    void findByPostIdWithMember_existingPost_returnsCommentsWithMember() {
        // Given
        Long postId = post.getId();

        // When
        List<Comment> comments = commentRepository.findByPostIdWithMember(postId);

        // Then
        assertThat(comments).hasSize(2);
        assertThat(comments).allSatisfy(comment -> {
            assertThat(comment.getMember()).isNotNull();
            assertThat(comment.getMember().getNickname()).isNotNull();
        });
    }

    @Test
    @DisplayName("댓글이 createdAt 오름차순으로 정렬된다")
    void findByPostIdWithMember_ordering_sortedByCreatedAtAsc() {
        // Given
        Long postId = post.getId();

        // When
        List<Comment> comments = commentRepository.findByPostIdWithMember(postId);

        // Then
        assertThat(comments).hasSize(2);
        assertThat(comments.get(0).getContent()).isEqualTo("첫 번째 댓글");
        assertThat(comments.get(1).getContent()).isEqualTo("두 번째 댓글");
    }

    @Test
    @DisplayName("댓글이 없는 게시글로 조회하면 빈 목록을 반환한다")
    void findByPostIdWithMember_noComments_returnsEmptyList() {
        // Given
        Post emptyPost = Post.builder()
                .member(member1)
                .title("댓글 없는 게시글")
                .content("내용")
                .build();
        em.persist(emptyPost);
        em.flush();
        em.clear();

        // When
        List<Comment> comments = commentRepository.findByPostIdWithMember(emptyPost.getId());

        // Then
        assertThat(comments).isEmpty();
    }

    @Test
    @DisplayName("댓글 ID로 Member와 Post를 함께 조회할 수 있다")
    void findByIdWithMemberAndPost_existingComment_returnsCommentWithRelations() {
        // Given
        Long commentId = comment1.getId();

        // When
        Optional<Comment> result = commentRepository.findByIdWithMemberAndPost(commentId);

        // Then
        assertThat(result).isPresent();
        Comment found = result.get();
        assertThat(found.getMember()).isNotNull();
        assertThat(found.getMember().getNickname()).isEqualTo("user1");
        assertThat(found.getPost()).isNotNull();
        assertThat(found.getPost().getTitle()).isEqualTo("테스트 게시글");
    }

    @Test
    @DisplayName("존재하지 않는 댓글 ID로 조회하면 빈 Optional을 반환한다")
    void findByIdWithMemberAndPost_nonExistingId_returnsEmpty() {
        // Given
        Long nonExistingId = 9999L;

        // When
        Optional<Comment> result = commentRepository.findByIdWithMemberAndPost(nonExistingId);

        // Then
        assertThat(result).isEmpty();
    }
}
