package rewviewjom.backend.comment.ui;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import rewviewjom.backend.comment.application.CommentService;
import rewviewjom.backend.comment.application.dto.CommentCreateRequest;
import rewviewjom.backend.comment.application.dto.CommentResponse;
import rewviewjom.backend.comment.application.dto.CommentUpdateRequest;
import rewviewjom.backend.global.response.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/posts/{postId}/comments")
    public ApiResponse<CommentResponse> createComment(
            @RequestAttribute("memberId") Long memberId,
            @PathVariable Long postId,
            @Valid @RequestBody CommentCreateRequest request) {
        return ApiResponse.success(commentService.createComment(memberId, postId, request));
    }

    @GetMapping("/posts/{postId}/comments")
    public ApiResponse<List<CommentResponse>> getComments(@PathVariable Long postId) {
        return ApiResponse.success(commentService.getCommentsByPostId(postId));
    }

    @PatchMapping("/comments/{commentId}")
    public ApiResponse<CommentResponse> updateComment(
            @RequestAttribute("memberId") Long memberId,
            @PathVariable Long commentId,
            @Valid @RequestBody CommentUpdateRequest request) {
        return ApiResponse.success(commentService.updateComment(memberId, commentId, request));
    }

    @DeleteMapping("/comments/{commentId}")
    public ApiResponse<Void> deleteComment(
            @RequestAttribute("memberId") Long memberId,
            @PathVariable Long commentId) {
        commentService.deleteComment(memberId, commentId);
        return ApiResponse.success();
    }
}
