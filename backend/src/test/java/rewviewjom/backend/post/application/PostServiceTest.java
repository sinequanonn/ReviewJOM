package rewviewjom.backend.post.application;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;
import rewviewjom.backend.fixture.MemberFixture;
import rewviewjom.backend.fixture.PostFixture;
import rewviewjom.backend.fixture.TagFixture;
import rewviewjom.backend.global.exception.BusinessException;
import rewviewjom.backend.global.exception.ErrorCode;
import rewviewjom.backend.global.response.PageResponse;
import rewviewjom.backend.member.domain.Member;
import rewviewjom.backend.member.domain.repository.MemberRepository;
import rewviewjom.backend.post.application.dto.*;
import rewviewjom.backend.post.domain.Post;
import rewviewjom.backend.post.domain.PostStatus;
import rewviewjom.backend.post.domain.repository.PostRepository;
import rewviewjom.backend.tag.application.TagService;
import rewviewjom.backend.tag.domain.Tag;
import rewviewjom.backend.tag.domain.TagCategory;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@DisplayName("PostService 테스트")
@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @InjectMocks
    private PostService postService;

    @Mock
    private PostRepository postRepository;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private TagService tagService;

    private Member member;
    private Post post;
    private Tag tag;

    @BeforeEach
    void setUp() {
        member = MemberFixture.createMemberWithId(1L, "testUser");
        post = PostFixture.createPostWithId(1L, member);
        tag = TagFixture.createTagWithId(1L, "Java", TagCategory.LANGUAGE);
    }

    @Test
    @DisplayName("게시글을 생성할 수 있다")
    void createPost_validRequest_postCreated() {
        // Given
        PostCreateRequest request = new PostCreateRequest();
        ReflectionTestUtils.setField(request, "title", "테스트 제목");
        ReflectionTestUtils.setField(request, "content", "테스트 내용");
        ReflectionTestUtils.setField(request, "tagIds", List.of(1L));

        given(memberRepository.findById(1L)).willReturn(Optional.of(member));
        given(tagService.getTagsByIds(List.of(1L))).willReturn(List.of(tag));
        given(postRepository.save(any(Post.class))).willReturn(post);

        // When
        PostResponse response = postService.createPost(1L, request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("존재하지 않는 회원으로 게시글 생성 시 예외가 발생한다")
    void createPost_memberNotFound_throwsException() {
        // Given
        PostCreateRequest request = new PostCreateRequest();
        ReflectionTestUtils.setField(request, "title", "제목");
        ReflectionTestUtils.setField(request, "content", "내용");
        ReflectionTestUtils.setField(request, "tagIds", List.of(1L));

        given(memberRepository.findById(999L)).willReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> postService.createPost(999L, request))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode())
                        .isEqualTo(ErrorCode.MEMBER_NOT_FOUND));
    }

    @Test
    @DisplayName("게시글을 단건 조회할 수 있다")
    void getPost_existingPost_returnsResponse() {
        // Given
        given(postRepository.findById(1L)).willReturn(Optional.of(post));

        // When
        PostResponse response = postService.getPost(1L);

        // Then
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitle()).isEqualTo("테스트 게시글 제목");
    }

    @Test
    @DisplayName("존재하지 않는 게시글 조회 시 예외가 발생한다")
    void getPost_postNotFound_throwsException() {
        // Given
        given(postRepository.findById(999L)).willReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> postService.getPost(999L))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode())
                        .isEqualTo(ErrorCode.POST_NOT_FOUND));
    }

    @Test
    @DisplayName("게시글 목록을 필터링하여 조회할 수 있다")
    void getPosts_withFilter_returnsPageResponse() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<Post> page = new PageImpl<>(List.of(post), pageable, 1);

        given(postRepository.findAllWithFilter(null, null, pageable)).willReturn(page);

        // When
        PageResponse<PostListResponse> response = postService.getPosts(null, null, pageable);

        // Then
        assertThat(response.getContent()).hasSize(1);
        assertThat(response.getTotalElements()).isEqualTo(1);
    }

    @Test
    @DisplayName("내 게시글 목록을 조회할 수 있다")
    void getMyPosts_existingMember_returnsPageResponse() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<Post> page = new PageImpl<>(List.of(post), pageable, 1);

        given(postRepository.findByMemberId(1L, pageable)).willReturn(page);

        // When
        PageResponse<PostListResponse> response = postService.getMyPosts(1L, pageable);

        // Then
        assertThat(response.getContent()).hasSize(1);
    }

    @Test
    @DisplayName("게시글을 수정할 수 있다")
    void updatePost_validRequest_postUpdated() {
        // Given
        PostUpdateRequest request = new PostUpdateRequest();
        ReflectionTestUtils.setField(request, "title", "수정된 제목");
        ReflectionTestUtils.setField(request, "content", "수정된 내용");
        ReflectionTestUtils.setField(request, "tagIds", List.of(1L));

        given(postRepository.findById(1L)).willReturn(Optional.of(post));
        given(tagService.getTagsByIds(List.of(1L))).willReturn(List.of(tag));

        // When
        PostResponse response = postService.updatePost(1L, 1L, request);

        // Then
        assertThat(response.getTitle()).isEqualTo("수정된 제목");
        assertThat(response.getContent()).isEqualTo("수정된 내용");
    }

    @Test
    @DisplayName("작성자가 아닌 사용자가 게시글을 수정하면 예외가 발생한다")
    void updatePost_notAuthor_throwsException() {
        // Given
        PostUpdateRequest request = new PostUpdateRequest();
        ReflectionTestUtils.setField(request, "title", "수정된 제목");
        ReflectionTestUtils.setField(request, "content", "수정된 내용");
        ReflectionTestUtils.setField(request, "tagIds", List.of(1L));

        given(postRepository.findById(1L)).willReturn(Optional.of(post));

        // When & Then
        assertThatThrownBy(() -> postService.updatePost(999L, 1L, request))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode())
                        .isEqualTo(ErrorCode.POST_ACCESS_DENIED));
    }

    @Test
    @DisplayName("게시글 상태를 변경할 수 있다")
    void updatePostStatus_validRequest_statusUpdated() {
        // Given
        PostStatusUpdateRequest request = new PostStatusUpdateRequest();
        ReflectionTestUtils.setField(request, "status", PostStatus.SOLVED);

        given(postRepository.findById(1L)).willReturn(Optional.of(post));

        // When
        PostResponse response = postService.updatePostStatus(1L, 1L, request);

        // Then
        assertThat(response.getPostStatus()).isEqualTo(PostStatus.SOLVED);
    }

    @Test
    @DisplayName("작성자가 아닌 사용자가 게시글 상태를 변경하면 예외가 발생한다")
    void updatePostStatus_notAuthor_throwsException() {
        // Given
        PostStatusUpdateRequest request = new PostStatusUpdateRequest();
        ReflectionTestUtils.setField(request, "status", PostStatus.SOLVED);

        given(postRepository.findById(1L)).willReturn(Optional.of(post));

        // When & Then
        assertThatThrownBy(() -> postService.updatePostStatus(999L, 1L, request))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode())
                        .isEqualTo(ErrorCode.POST_ACCESS_DENIED));
    }

    @Test
    @DisplayName("게시글을 삭제할 수 있다")
    void deletePost_validAuthor_postDeleted() {
        // Given
        given(postRepository.findById(1L)).willReturn(Optional.of(post));

        // When
        postService.deletePost(1L, 1L);

        // Then
        assertThat(post.isDeleted()).isTrue();
    }

    @Test
    @DisplayName("작성자가 아닌 사용자가 게시글을 삭제하면 예외가 발생한다")
    void deletePost_notAuthor_throwsException() {
        // Given
        given(postRepository.findById(1L)).willReturn(Optional.of(post));

        // When & Then
        assertThatThrownBy(() -> postService.deletePost(999L, 1L))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode())
                        .isEqualTo(ErrorCode.POST_ACCESS_DENIED));
    }
}
