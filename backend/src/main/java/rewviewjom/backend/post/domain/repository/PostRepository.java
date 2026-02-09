package rewviewjom.backend.post.domain.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import rewviewjom.backend.post.domain.Post;
import rewviewjom.backend.post.domain.PostStatus;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query(value = "SELECT DISTINCT p FROM Post p " +
            "LEFT JOIN FETCH p.member m " +
            "WHERE (:status IS NULL OR p.status = :status) " +
            "AND (:keyword IS NULL OR p.title LIKE %:keyword% OR p.content LIKE %:keyword%) " +
            "ORDER BY p.updatedAt DESC",
            countQuery = "SELECT COUNT(DISTINCT p) FROM Post p " +
                    "WHERE (:status IS NULL OR p.status = :status) " +
                    "AND (:keyword IS NULL OR p.title LIKE %:keyword% OR p.content LIKE %:keyword%)")
    Page<Post> findAllWithFilter(
            @Param("status") PostStatus status,
            @Param("keyword") String keyword,
            Pageable pageable);

    @Query("SELECT p FROM Post p " +
            "LEFT JOIN FETCH p.member " +
            "WHERE p.member.id = :memberId " +
            "ORDER BY p.updatedAt DESC")
    Page<Post> findByMemberId(@Param("memberId") Long memberId, Pageable pageable);
}
