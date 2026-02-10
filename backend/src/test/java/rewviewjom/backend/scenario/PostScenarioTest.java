package rewviewjom.backend.scenario;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.util.ReflectionTestUtils;
import rewviewjom.backend.fixture.MemberFixture;
import rewviewjom.backend.fixture.TagFixture;
import rewviewjom.backend.global.exception.BusinessException;
import rewviewjom.backend.global.exception.ErrorCode;
import rewviewjom.backend.global.response.PageResponse;
import rewviewjom.backend.member.domain.Member;
import rewviewjom.backend.member.domain.repository.MemberRepository;
import rewviewjom.backend.post.application.PostService;
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

@DisplayName("게시글 시나리오 테스트 - 게시글 생성부터 삭제까지 전체 흐름 검증")
@ExtendWith(MockitoExtension.class)
class PostScenarioTest {

    private PostService postService;

    @Mock
    private PostRepository postRepository;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private TagService tagService;

    private Member author;
    private Member otherUser;
    private Tag tag;

    @BeforeEach
    void setUp() {
        postService = new PostService(memberRepository, postRepository, tagService);
        author = MemberFixture.createMemberWithId(1L, "author");
        otherUser = MemberFixture.createMemberWithId(2L, "otherUser");
        tag = TagFixture.createTagWithId(1L, "Java", TagCategory.LANGUAGE);
    }

    @Test
    @DisplayName("시나리오: 게시글 생성 → 조회 → 수정 → 상태변경 → 삭제")
    void fullPostLifecycle_createToDelete_success() {
        // === 조각 1: 게시글 생성 ===
        PostCreateRequest createRequest = new PostCreateRequest();
        ReflectionTestUtils.setField(createRequest, "title", "코드 리뷰 요청합니다");
        ReflectionTestUtils.setField(createRequest, "content", "Java Stream 코드 리뷰 부탁드립니다");
        ReflectionTestUtils.setField(createRequest, "tagIds", List.of(1L));

        Post createdPost = Post.builder()
                .member(author)
                .title("코드 리뷰 요청합니다")
                .content("Java Stream 코드 리뷰 부탁드립니다")
                .build();
        createdPost.addTag(tag);
        ReflectionTestUtils.setField(createdPost, "id", 1L);

        given(memberRepository.findById(1L)).willReturn(Optional.of(author));
        given(tagService.getTagsByIds(List.of(1L))).willReturn(List.of(tag));
        given(postRepository.save(any(Post.class))).willReturn(createdPost);

        PostResponse createResponse = postService.createPost(1L, createRequest);
        assertThat(createResponse.getId()).isEqualTo(1L);
        assertThat(createResponse.getPostStatus()).isEqualTo(PostStatus.UNSOLVED);

        // === 조각 2: 게시글 조회 ===
        given(postRepository.findById(1L)).willReturn(Optional.of(createdPost));

        PostResponse getResponse = postService.getPost(1L);
        assertThat(getResponse.getTitle()).isEqualTo("코드 리뷰 요청합니다");
        assertThat(getResponse.getMember().getNickname()).isEqualTo("author");

        // === 조각 3: 게시글 수정 ===
        PostUpdateRequest updateRequest = new PostUpdateRequest();
        ReflectionTestUtils.setField(updateRequest, "title", "코드 리뷰 요청합니다 (수정)");
        ReflectionTestUtils.setField(updateRequest, "content", "수정된 리뷰 내용입니다");
        ReflectionTestUtils.setField(updateRequest, "tagIds", List.of(1L));

        PostResponse updateResponse = postService.updatePost(1L, 1L, updateRequest);
        assertThat(updateResponse.getTitle()).isEqualTo("코드 리뷰 요청합니다 (수정)");
        assertThat(updateResponse.getContent()).isEqualTo("수정된 리뷰 내용입니다");

        // === 조각 4: 게시글 상태 변경 ===
        PostStatusUpdateRequest statusRequest = new PostStatusUpdateRequest();
        ReflectionTestUtils.setField(statusRequest, "status", PostStatus.SOLVED);

        PostResponse statusResponse = postService.updatePostStatus(1L, 1L, statusRequest);
        assertThat(statusResponse.getPostStatus()).isEqualTo(PostStatus.SOLVED);

        // === 조각 5: 게시글 삭제 ===
        postService.deletePost(1L, 1L);
        assertThat(createdPost.isDeleted()).isTrue();
    }

    @Test
    @DisplayName("시나리오: 다른 사용자가 게시글 수정/삭제를 시도하면 실패한다")
    void unauthorizedAccess_otherUser_denied() {
        // === 조각 1: 게시글 생성 (작성자) ===
        Post post = Post.builder()
                .member(author)
                .title("작성자의 게시글")
                .content("내용")
                .build();
        ReflectionTestUtils.setField(post, "id", 1L);

        // === 조각 2: 다른 사용자가 수정 시도 ===
        PostUpdateRequest updateRequest = new PostUpdateRequest();
        ReflectionTestUtils.setField(updateRequest, "title", "수정");
        ReflectionTestUtils.setField(updateRequest, "content", "수정 내용");
        ReflectionTestUtils.setField(updateRequest, "tagIds", List.of(1L));

        given(postRepository.findById(1L)).willReturn(Optional.of(post));

        assertThatThrownBy(() -> postService.updatePost(2L, 1L, updateRequest))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode())
                        .isEqualTo(ErrorCode.POST_ACCESS_DENIED));

        // === 조각 3: 다른 사용자가 삭제 시도 ===
        assertThatThrownBy(() -> postService.deletePost(2L, 1L))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode())
                        .isEqualTo(ErrorCode.POST_ACCESS_DENIED));

        // 게시글이 삭제되지 않았음을 확인
        assertThat(post.isDeleted()).isFalse();
    }

    @Test
    @DisplayName("시나리오: 게시글 목록 조회 및 페이징 검증")
    void listAndPaging_multiplePosts_correctPagination() {
        // === 조각 1: 게시글 목록 조회 ===
        Post post1 = Post.builder().member(author).title("제목1").content("내용1").build();
        Post post2 = Post.builder().member(author).title("제목2").content("내용2").build();
        ReflectionTestUtils.setField(post1, "id", 1L);
        ReflectionTestUtils.setField(post2, "id", 2L);

        PageRequest pageable = PageRequest.of(0, 10);
        Page<Post> page = new PageImpl<>(List.of(post1, post2), pageable, 2);

        given(postRepository.findAllWithFilter(null, null, pageable)).willReturn(page);

        PageResponse<PostListResponse> response = postService.getPosts(null, null, pageable);
        assertThat(response.getContent()).hasSize(2);
        assertThat(response.getTotalElements()).isEqualTo(2);

        // === 조각 2: 상태 필터 조회 ===
        post1.updateStatus(PostStatus.SOLVED);
        Page<Post> solvedPage = new PageImpl<>(List.of(post1), pageable, 1);
        given(postRepository.findAllWithFilter(PostStatus.SOLVED, null, pageable)).willReturn(solvedPage);

        PageResponse<PostListResponse> filteredResponse = postService.getPosts(PostStatus.SOLVED, null, pageable);
        assertThat(filteredResponse.getContent()).hasSize(1);
    }
}
