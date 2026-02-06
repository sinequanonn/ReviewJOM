package rewviewjom.backend.post.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rewviewjom.backend.global.exception.BusinessException;
import rewviewjom.backend.global.exception.ErrorCode;
import rewviewjom.backend.member.domain.Member;
import rewviewjom.backend.member.domain.repository.MemberRepository;
import rewviewjom.backend.post.application.dto.PostCreateRequest;
import rewviewjom.backend.post.application.dto.PostResponse;
import rewviewjom.backend.post.application.dto.PostStatusUpdateRequest;
import rewviewjom.backend.post.application.dto.PostUpdateRequest;
import rewviewjom.backend.post.domain.Post;
import rewviewjom.backend.post.domain.repository.PostRepository;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PostService {

    private final MemberRepository memberRepository;
    private final PostRepository postRepository;

    @Transactional
    public PostResponse createPost(Long memberId, PostCreateRequest request) {
        Member member = findMemberById(memberId);

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .member(member)
                .build();

        return PostResponse.from(postRepository.save(post), member);
    }

    @Transactional
    public PostResponse updatePost(Long memberId, Long postId, PostUpdateRequest request) {
        Member member = findMemberById(memberId);

        Post post = findPostById(postId);

        validateAuthor(post, memberId);
        post.update(request.getTitle(), request.getContent());

        return PostResponse.from(post, member);
    }

    @Transactional
    public PostResponse updatePostStatus(Long memberId, Long postId, PostStatusUpdateRequest request) {
        Member member = findMemberById(memberId);

        Post post = findPostById(postId);

        validateAuthor(post, memberId);
        post.updateStatus(request.getStatus());
        return PostResponse.from(post, member);
    }

    @Transactional
    public void deletePost(Long memberId, Long postId) {
        Post post = findPostById(postId);
        validateAuthor(post, memberId);

        post.softDelete();
    }

    private Member findMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
    }

    private Post findPostById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
    }

    private void validateAuthor(Post post, Long memberId) {
        if (!post.isAuthor(memberId)) {
            throw new BusinessException(ErrorCode.POST_ACCESS_DENIED);
        }
    }
}
