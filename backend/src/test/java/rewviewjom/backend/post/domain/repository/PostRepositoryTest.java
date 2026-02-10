package rewviewjom.backend.post.domain.repository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import rewviewjom.backend.member.domain.Member;
import rewviewjom.backend.post.domain.Post;
import rewviewjom.backend.post.domain.PostStatus;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("PostRepository 테스트")
@DataJpaTest
@ActiveProfiles("test")
class PostRepositoryTest {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private TestEntityManager em;

    private Member member1;
    private Member member2;

    @BeforeEach
    void setUp() {
        member1 = Member.builder()
                .nickname("user1")
                .password("password123")
                .build();
        em.persist(member1);

        member2 = Member.builder()
                .nickname("user2")
                .password("password123")
                .build();
        em.persist(member2);

        Post post1 = Post.builder()
                .member(member1)
                .title("Java 질문입니다")
                .content("Java Stream 사용법을 알고 싶습니다")
                .build();
        em.persist(post1);

        Post post2 = Post.builder()
                .member(member1)
                .title("Spring 질문")
                .content("Spring Boot 설정 방법")
                .build();
        post2.updateStatus(PostStatus.SOLVED);
        em.persist(post2);

        Post post3 = Post.builder()
                .member(member2)
                .title("Python 관련 질문")
                .content("Python List 사용법")
                .build();
        em.persist(post3);

        em.flush();
        em.clear();
    }

    @Test
    @DisplayName("필터 없이 전체 게시글을 조회할 수 있다")
    void findAllWithFilter_noFilter_returnsAll() {
        // Given
        PageRequest pageable = PageRequest.of(0, 10);

        // When
        Page<Post> result = postRepository.findAllWithFilter(null, null, pageable);

        // Then
        assertThat(result.getContent()).hasSize(3);
        assertThat(result.getTotalElements()).isEqualTo(3);
    }

    @Test
    @DisplayName("상태로 게시글을 필터링할 수 있다")
    void findAllWithFilter_statusFilter_returnsFiltered() {
        // Given
        PageRequest pageable = PageRequest.of(0, 10);

        // When
        Page<Post> result = postRepository.findAllWithFilter(PostStatus.SOLVED, null, pageable);

        // Then
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getStatus()).isEqualTo(PostStatus.SOLVED);
    }

    @Test
    @DisplayName("키워드로 제목을 검색할 수 있다")
    void findAllWithFilter_titleKeyword_returnsMatching() {
        // Given
        PageRequest pageable = PageRequest.of(0, 10);

        // When
        Page<Post> result = postRepository.findAllWithFilter(null, "Java", pageable);

        // Then
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).contains("Java");
    }

    @Test
    @DisplayName("키워드로 내용을 검색할 수 있다")
    void findAllWithFilter_contentKeyword_returnsMatching() {
        // Given
        PageRequest pageable = PageRequest.of(0, 10);

        // When
        Page<Post> result = postRepository.findAllWithFilter(null, "Stream", pageable);

        // Then
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getContent()).contains("Stream");
    }

    @Test
    @DisplayName("상태와 키워드를 동시에 필터링할 수 있다")
    void findAllWithFilter_statusAndKeyword_returnsFiltered() {
        // Given
        PageRequest pageable = PageRequest.of(0, 10);

        // When
        Page<Post> result = postRepository.findAllWithFilter(PostStatus.UNSOLVED, "Java", pageable);

        // Then
        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    @DisplayName("게시글 조회 시 Member가 함께 로드된다")
    void findAllWithFilter_fetchJoin_memberLoaded() {
        // Given
        PageRequest pageable = PageRequest.of(0, 10);

        // When
        Page<Post> result = postRepository.findAllWithFilter(null, null, pageable);

        // Then
        assertThat(result.getContent()).allSatisfy(post ->
                assertThat(post.getMember()).isNotNull()
        );
    }

    @Test
    @DisplayName("페이징이 정상적으로 동작한다")
    void findAllWithFilter_paging_returnsPagedResult() {
        // Given
        PageRequest pageable = PageRequest.of(0, 2);

        // When
        Page<Post> result = postRepository.findAllWithFilter(null, null, pageable);

        // Then
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getTotalElements()).isEqualTo(3);
        assertThat(result.getTotalPages()).isEqualTo(2);
        assertThat(result.hasNext()).isTrue();
    }

    @Test
    @DisplayName("회원 ID로 게시글을 조회할 수 있다")
    void findByMemberId_existingMember_returnsMemberPosts() {
        // Given
        PageRequest pageable = PageRequest.of(0, 10);

        // When
        Page<Post> result = postRepository.findByMemberId(member1.getId(), pageable);

        // Then
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent()).allSatisfy(post ->
                assertThat(post.getMember().getId()).isEqualTo(member1.getId())
        );
    }

    @Test
    @DisplayName("게시글이 없는 회원 ID로 조회하면 빈 결과를 반환한다")
    void findByMemberId_noPost_returnsEmpty() {
        // Given
        Member member3 = Member.builder()
                .nickname("user3")
                .password("password123")
                .build();
        em.persist(member3);
        em.flush();
        em.clear();

        PageRequest pageable = PageRequest.of(0, 10);

        // When
        Page<Post> result = postRepository.findByMemberId(member3.getId(), pageable);

        // Then
        assertThat(result.getContent()).isEmpty();
        assertThat(result.getTotalElements()).isZero();
    }
}
