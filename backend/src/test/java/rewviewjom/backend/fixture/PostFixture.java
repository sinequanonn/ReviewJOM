package rewviewjom.backend.fixture;

import org.springframework.test.util.ReflectionTestUtils;
import rewviewjom.backend.member.domain.Member;
import rewviewjom.backend.post.domain.Post;

public class PostFixture {

    public static Post createPost(Member member) {
        return createPost(member, "테스트 게시글 제목", "테스트 게시글 내용");
    }

    public static Post createPost(Member member, String title, String content) {
        return Post.builder()
                .member(member)
                .title(title)
                .content(content)
                .build();
    }

    public static Post createPostWithId(Long id, Member member) {
        return createPostWithId(id, member, "테스트 게시글 제목", "테스트 게시글 내용");
    }

    public static Post createPostWithId(Long id, Member member, String title, String content) {
        Post post = Post.builder()
                .member(member)
                .title(title)
                .content(content)
                .build();
        ReflectionTestUtils.setField(post, "id", id);
        return post;
    }
}
