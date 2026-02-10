package rewviewjom.backend.scenario;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import rewviewjom.backend.comment.application.CommentService;
import rewviewjom.backend.comment.application.dto.CommentCreateRequest;
import rewviewjom.backend.comment.application.dto.CommentResponse;
import rewviewjom.backend.comment.application.dto.CommentUpdateRequest;
import rewviewjom.backend.comment.domain.Comment;
import rewviewjom.backend.comment.domain.repository.CommentRepository;
import rewviewjom.backend.fixture.CommentFixture;
import rewviewjom.backend.fixture.MemberFixture;
import rewviewjom.backend.fixture.PostFixture;
import rewviewjom.backend.global.exception.BusinessException;
import rewviewjom.backend.global.exception.ErrorCode;
import rewviewjom.backend.member.domain.Member;
import rewviewjom.backend.member.domain.repository.MemberRepository;
import rewviewjom.backend.post.domain.Post;
import rewviewjom.backend.post.domain.repository.PostRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@DisplayName("댓글 시나리오 테스트 - 댓글 생성부터 삭제까지 전체 흐름 검증")
@ExtendWith(MockitoExtension.class)
class CommentScenarioTest {

    private CommentService commentService;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private PostRepository postRepository;

    private Member author;
    private Member otherUser;
    private Post post;

    @BeforeEach
    void setUp() {
        commentService = new CommentService(commentRepository, memberRepository, postRepository);
        author = MemberFixture.createMemberWithId(1L, "author");
        otherUser = MemberFixture.createMemberWithId(2L, "otherUser");
        post = PostFixture.createPostWithId(1L, author);
    }

    @Test
    @DisplayName("시나리오: 댓글 생성 → 조회 → 수정 → 삭제")
    void fullCommentLifecycle_createToDelete_success() {
        // === 조각 1: 댓글 생성 ===
        CommentCreateRequest createRequest = new CommentCreateRequest();
        ReflectionTestUtils.setField(createRequest, "content", "좋은 코드입니다!");

        Comment createdComment = Comment.builder()
                .member(author)
                .post(post)
                .content("좋은 코드입니다!")
                .build();
        ReflectionTestUtils.setField(createdComment, "id", 1L);
        LocalDateTime now = LocalDateTime.now();
        ReflectionTestUtils.setField(createdComment, "createdAt", now);
        ReflectionTestUtils.setField(createdComment, "updatedAt", now);

        given(memberRepository.findById(1L)).willReturn(Optional.of(author));
        given(postRepository.findById(1L)).willReturn(Optional.of(post));
        given(commentRepository.save(any(Comment.class))).willReturn(createdComment);

        CommentResponse createResponse = commentService.createComment(1L, 1L, createRequest);
        assertThat(createResponse.getId()).isEqualTo(1L);
        assertThat(createResponse.getContent()).isEqualTo("좋은 코드입니다!");
        assertThat(createResponse.isModified()).isFalse();

        // === 조각 2: 댓글 목록 조회 ===
        given(commentRepository.findByPostIdWithMember(1L)).willReturn(List.of(createdComment));

        List<CommentResponse> comments = commentService.getCommentsByPostId(1L);
        assertThat(comments).hasSize(1);
        assertThat(comments.get(0).getContent()).isEqualTo("좋은 코드입니다!");
        assertThat(comments.get(0).getMember().getNickname()).isEqualTo("author");

        // === 조각 3: 댓글 수정 ===
        CommentUpdateRequest updateRequest = new CommentUpdateRequest();
        ReflectionTestUtils.setField(updateRequest, "content", "수정된 댓글입니다");

        given(commentRepository.findByIdWithMemberAndPost(1L)).willReturn(Optional.of(createdComment));

        CommentResponse updateResponse = commentService.updateComment(1L, 1L, updateRequest);
        assertThat(updateResponse.getContent()).isEqualTo("수정된 댓글입니다");

        // === 조각 4: 댓글 삭제 ===
        given(commentRepository.findById(1L)).willReturn(Optional.of(createdComment));

        commentService.deleteComment(1L, 1L);
        assertThat(createdComment.isDeleted()).isTrue();
    }

    @Test
    @DisplayName("시나리오: 다른 사용자가 댓글 수정/삭제를 시도하면 실패한다")
    void unauthorizedAccess_otherUser_denied() {
        // === 조각 1: 작성자가 댓글 생성 ===
        Comment comment = CommentFixture.createCommentWithId(1L, author, post, "작성자의 댓글");
        LocalDateTime now = LocalDateTime.now();
        ReflectionTestUtils.setField(comment, "createdAt", now);
        ReflectionTestUtils.setField(comment, "updatedAt", now);

        // === 조각 2: 다른 사용자가 수정 시도 ===
        CommentUpdateRequest updateRequest = new CommentUpdateRequest();
        ReflectionTestUtils.setField(updateRequest, "content", "다른 사용자의 수정");

        given(commentRepository.findByIdWithMemberAndPost(1L)).willReturn(Optional.of(comment));

        assertThatThrownBy(() -> commentService.updateComment(2L, 1L, updateRequest))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode())
                        .isEqualTo(ErrorCode.COMMENT_ACCESS_DENIED));

        // === 조각 3: 다른 사용자가 삭제 시도 ===
        given(commentRepository.findById(1L)).willReturn(Optional.of(comment));

        assertThatThrownBy(() -> commentService.deleteComment(2L, 1L))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode())
                        .isEqualTo(ErrorCode.COMMENT_ACCESS_DENIED));

        // 댓글이 삭제되지 않았음을 확인
        assertThat(comment.isDeleted()).isFalse();
    }

    @Test
    @DisplayName("시나리오: 여러 사용자가 하나의 게시글에 댓글을 작성한다")
    void multipleUsers_commentOnSamePost_success() {
        // === 조각 1: 작성자 댓글 ===
        Comment comment1 = CommentFixture.createCommentWithId(1L, author, post, "작성자 댓글");
        LocalDateTime now1 = LocalDateTime.now();
        ReflectionTestUtils.setField(comment1, "createdAt", now1);
        ReflectionTestUtils.setField(comment1, "updatedAt", now1);

        // === 조각 2: 다른 사용자 댓글 ===
        Comment comment2 = CommentFixture.createCommentWithId(2L, otherUser, post, "다른 사용자 댓글");
        LocalDateTime now2 = LocalDateTime.now();
        ReflectionTestUtils.setField(comment2, "createdAt", now2);
        ReflectionTestUtils.setField(comment2, "updatedAt", now2);

        // === 조각 3: 댓글 목록 조회 ===
        given(commentRepository.findByPostIdWithMember(1L))
                .willReturn(List.of(comment1, comment2));

        List<CommentResponse> comments = commentService.getCommentsByPostId(1L);
        assertThat(comments).hasSize(2);
        assertThat(comments.get(0).getMember().getNickname()).isEqualTo("author");
        assertThat(comments.get(1).getMember().getNickname()).isEqualTo("otherUser");
    }
}
