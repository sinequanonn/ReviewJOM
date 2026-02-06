package rewviewjom.backend.post.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rewviewjom.backend.post.domain.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
}
