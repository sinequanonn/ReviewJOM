package rewviewjom.backend.tag.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rewviewjom.backend.tag.domain.Tag;
import rewviewjom.backend.tag.domain.TagCategory;

import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findByCategory(TagCategory category);

    List<Tag> findAllByIdIn(List<Long> ids);
}
