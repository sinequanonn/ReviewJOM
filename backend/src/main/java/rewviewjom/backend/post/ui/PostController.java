package rewviewjom.backend.post.ui;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import rewviewjom.backend.global.response.ApiResponse;
import rewviewjom.backend.global.response.PageResponse;
import rewviewjom.backend.post.application.PostService;
import rewviewjom.backend.post.application.dto.*;
import rewviewjom.backend.post.domain.PostStatus;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ApiResponse<PostResponse> createPost(
            @RequestAttribute("memberId") Long memberId,
            @Valid @RequestBody PostCreateRequest request) {
        return ApiResponse.success(postService.createPost(memberId, request));
    }

    @GetMapping("/{postId}")
    public ApiResponse<PostResponse> getPost(@PathVariable Long postId) {
        return ApiResponse.success(postService.getPost(postId));
    }

    @GetMapping
    public ApiResponse<PageResponse<PostListResponse>> getPosts(
            @RequestParam(required = false) PostStatus status,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10) Pageable pageable) {
        return ApiResponse.success(postService.getPosts(status, keyword, pageable));
    }

    @GetMapping("/me")
    public ApiResponse<PageResponse<PostListResponse>> getMyPosts(
            @RequestAttribute("memberId") Long memberId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ApiResponse.success(postService.getMyPosts(memberId, pageable));
    }

    @PutMapping("/{postId}")
    public ApiResponse<PostResponse> updatePost(
            @RequestAttribute("memberId") Long memberId,
            @PathVariable Long postId,
            @Valid @RequestBody PostUpdateRequest request) {
        return ApiResponse.success(postService.updatePost(memberId, postId, request));
    }

    @PatchMapping("/{postId}/status")
    public ApiResponse<PostResponse> updatePostStatus(
            @RequestAttribute("memberId") Long memberId,
            @PathVariable Long postId,
            @Valid @RequestBody PostStatusUpdateRequest request) {
        return ApiResponse.success(postService.updatePostStatus(memberId, postId, request));
    }

    @DeleteMapping("/{postId}")
    public ApiResponse<Void> deletePost(
            @RequestAttribute("memberId") Long memberId,
            @PathVariable Long postId) {
        postService.deletePost(memberId, postId);
        return ApiResponse.success();
    }
}
