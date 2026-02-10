package rewviewjom.backend.fixture;

import org.springframework.test.util.ReflectionTestUtils;
import rewviewjom.backend.comment.domain.Comment;
import rewviewjom.backend.member.domain.Member;
import rewviewjom.backend.post.domain.Post;

public class CommentFixture {

    public static Comment createComment(Member member, Post post) {
        return createComment(member, post, "테스트 댓글 내용");
    }

    public static Comment createComment(Member member, Post post, String content) {
        return Comment.builder()
                .member(member)
                .post(post)
                .content(content)
                .build();
    }

    public static Comment createCommentWithId(Long id, Member member, Post post) {
        return createCommentWithId(id, member, post, "테스트 댓글 내용");
    }

    public static Comment createCommentWithId(Long id, Member member, Post post, String content) {
        Comment comment = Comment.builder()
                .member(member)
                .post(post)
                .content(content)
                .build();
        ReflectionTestUtils.setField(comment, "id", id);
        return comment;
    }
}
