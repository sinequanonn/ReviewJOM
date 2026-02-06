package rewviewjom.backend.post.ui;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import rewviewjom.backend.global.response.ApiResponse;
import rewviewjom.backend.post.application.PostService;
import rewviewjom.backend.post.application.dto.PostCreateRequest;
import rewviewjom.backend.post.application.dto.PostResponse;
import rewviewjom.backend.post.application.dto.PostStatusUpdateRequest;
import rewviewjom.backend.post.application.dto.PostUpdateRequest;

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
