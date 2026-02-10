package rewviewjom.backend.comment.application;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
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

@DisplayName("CommentService 테스트")
@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @InjectMocks
    private CommentService commentService;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private PostRepository postRepository;

    private Member member;
    private Post post;
    private Comment comment;

    @BeforeEach
    void setUp() {
        member = MemberFixture.createMemberWithId(1L, "testUser");
        post = PostFixture.createPostWithId(1L, member);
        comment = CommentFixture.createCommentWithId(1L, member, post, "테스트 댓글");
        LocalDateTime now = LocalDateTime.now();
        ReflectionTestUtils.setField(comment, "createdAt", now);
        ReflectionTestUtils.setField(comment, "updatedAt", now);
    }

    @Test
    @DisplayName("댓글을 생성할 수 있다")
    void createComment_validRequest_commentCreated() {
        // Given
        CommentCreateRequest request = new CommentCreateRequest();
        ReflectionTestUtils.setField(request, "content", "새 댓글");

        given(memberRepository.findById(1L)).willReturn(Optional.of(member));
        given(postRepository.findById(1L)).willReturn(Optional.of(post));
        given(commentRepository.save(any(Comment.class))).willReturn(comment);

        // When
        CommentResponse response = commentService.createComment(1L, 1L, request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getContent()).isEqualTo("테스트 댓글");
    }

    @Test
    @DisplayName("존재하지 않는 회원으로 댓글 생성 시 예외가 발생한다")
    void createComment_memberNotFound_throwsException() {
        // Given
        CommentCreateRequest request = new CommentCreateRequest();
        ReflectionTestUtils.setField(request, "content", "댓글 내용");

        given(memberRepository.findById(999L)).willReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> commentService.createComment(999L, 1L, request))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode())
                        .isEqualTo(ErrorCode.MEMBER_NOT_FOUND));
    }

    @Test
    @DisplayName("존재하지 않는 게시글에 댓글 생성 시 예외가 발생한다")
    void createComment_postNotFound_throwsException() {
        // Given
        CommentCreateRequest request = new CommentCreateRequest();
        ReflectionTestUtils.setField(request, "content", "댓글 내용");

        given(memberRepository.findById(1L)).willReturn(Optional.of(member));
        given(postRepository.findById(999L)).willReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> commentService.createComment(1L, 999L, request))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode())
                        .isEqualTo(ErrorCode.POST_NOT_FOUND));
    }

    @Test
    @DisplayName("게시글의 댓글 목록을 조회할 수 있다")
    void getCommentsByPostId_existingPost_returnsComments() {
        // Given
        given(commentRepository.findByPostIdWithMember(1L)).willReturn(List.of(comment));

        // When
        List<CommentResponse> responses = commentService.getCommentsByPostId(1L);

        // Then
        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getContent()).isEqualTo("테스트 댓글");
    }

    @Test
    @DisplayName("댓글 내용을 수정할 수 있다")
    void updateComment_validRequest_commentUpdated() {
        // Given
        CommentUpdateRequest request = new CommentUpdateRequest();
        ReflectionTestUtils.setField(request, "content", "수정된 댓글");

        given(commentRepository.findByIdWithMemberAndPost(1L)).willReturn(Optional.of(comment));

        // When
        CommentResponse response = commentService.updateComment(1L, 1L, request);

        // Then
        assertThat(response.getContent()).isEqualTo("수정된 댓글");
    }

    @Test
    @DisplayName("존재하지 않는 댓글 수정 시 예외가 발생한다")
    void updateComment_commentNotFound_throwsException() {
        // Given
        CommentUpdateRequest request = new CommentUpdateRequest();
        ReflectionTestUtils.setField(request, "content", "수정 내용");

        given(commentRepository.findByIdWithMemberAndPost(999L)).willReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> commentService.updateComment(1L, 999L, request))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode())
                        .isEqualTo(ErrorCode.COMMENT_NOT_FOUND));
    }

    @Test
    @DisplayName("작성자가 아닌 사용자가 댓글을 수정하면 예외가 발생한다")
    void updateComment_notAuthor_throwsException() {
        // Given
        CommentUpdateRequest request = new CommentUpdateRequest();
        ReflectionTestUtils.setField(request, "content", "수정 내용");

        given(commentRepository.findByIdWithMemberAndPost(1L)).willReturn(Optional.of(comment));

        // When & Then
        assertThatThrownBy(() -> commentService.updateComment(999L, 1L, request))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode())
                        .isEqualTo(ErrorCode.COMMENT_ACCESS_DENIED));
    }

    @Test
    @DisplayName("댓글을 삭제할 수 있다")
    void deleteComment_validAuthor_commentDeleted() {
        // Given
        given(commentRepository.findById(1L)).willReturn(Optional.of(comment));

        // When
        commentService.deleteComment(1L, 1L);

        // Then
        assertThat(comment.isDeleted()).isTrue();
    }

    @Test
    @DisplayName("작성자가 아닌 사용자가 댓글을 삭제하면 예외가 발생한다")
    void deleteComment_notAuthor_throwsException() {
        // Given
        given(commentRepository.findById(1L)).willReturn(Optional.of(comment));

        // When & Then
        assertThatThrownBy(() -> commentService.deleteComment(999L, 1L))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode())
                        .isEqualTo(ErrorCode.COMMENT_ACCESS_DENIED));
    }

    @Test
    @DisplayName("존재하지 않는 댓글 삭제 시 예외가 발생한다")
    void deleteComment_commentNotFound_throwsException() {
        // Given
        given(commentRepository.findById(999L)).willReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> commentService.deleteComment(1L, 999L))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode())
                        .isEqualTo(ErrorCode.COMMENT_NOT_FOUND));
    }
}
