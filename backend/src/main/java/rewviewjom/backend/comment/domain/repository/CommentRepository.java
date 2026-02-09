package rewviewjom.backend.comment.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import rewviewjom.backend.comment.domain.Comment;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c " +
            "JOIN FETCH c.member " +
            "WHERE c.post.id = :postId " +
            "ORDER BY c.createdAt ASC ")
    List<Comment> findByPostIdWithMember(@Param("postId") Long postId);

    @Query("SELECT c FROM Comment c " +
            "JOIN FETCH c.member " +
            "JOIN FETCH c.post " +
            "WHERE c.id = :id")
    Optional<Comment> findByIdWithMemberAndPost(@Param("id") Long id);
}
