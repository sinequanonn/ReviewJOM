package rewviewjom.backend.comment.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rewviewjom.backend.comment.application.dto.CommentCreateRequest;
import rewviewjom.backend.comment.application.dto.CommentResponse;
import rewviewjom.backend.comment.application.dto.CommentUpdateRequest;
import rewviewjom.backend.comment.domain.Comment;
import rewviewjom.backend.comment.domain.repository.CommentRepository;
import rewviewjom.backend.global.exception.BusinessException;
import rewviewjom.backend.global.exception.ErrorCode;
import rewviewjom.backend.member.domain.Member;
import rewviewjom.backend.member.domain.repository.MemberRepository;
import rewviewjom.backend.post.domain.Post;
import rewviewjom.backend.post.domain.repository.PostRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;
    private final PostRepository postRepository;

    @Transactional
    public CommentResponse createComment(Long memberId, Long postId, CommentCreateRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));

        Comment comment = Comment.builder()
                .member(member)
                .post(post)
                .content(request.getContent())
                .build();

        return CommentResponse.from(commentRepository.save(comment));
    }


    public List<CommentResponse> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostIdWithMember(postId).stream()
                .map(CommentResponse::from)
                .toList();
    }

    @Transactional
    public CommentResponse updateComment(Long memberId, Long commentId, CommentUpdateRequest request) {
        Comment comment = commentRepository.findByIdWithMemberAndPost(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));
        validateAuthor(comment, memberId);

        comment.updateContent(request.getContent());
        return CommentResponse.from(comment);
    }



    private void validateAuthor(Comment comment, Long memberId) {
        if (!comment.isAuthor(memberId)) {
            throw new BusinessException(ErrorCode.COMMENT_ACCESS_DENIED);
        }
    }

    public void deleteComment(Long memberId, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));
        validateAuthor(comment, memberId);

        comment.softDelete();
    }
}
