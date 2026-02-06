package rewviewjom.backend.tag.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rewviewjom.backend.global.exception.BusinessException;
import rewviewjom.backend.global.exception.ErrorCode;
import rewviewjom.backend.tag.application.dto.TagResponse;
import rewviewjom.backend.tag.domain.Tag;
import rewviewjom.backend.tag.domain.TagCategory;
import rewviewjom.backend.tag.domain.repository.TagRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TagService {

    private final TagRepository tagRepository;


    public List<TagResponse> getAllTags() {
        return tagRepository.findAll().stream()
                .map(TagResponse::from)
                .toList();
    }

    public List<TagResponse> getTagsByCategory(TagCategory category) {
        return tagRepository.findByCategory(category).stream()
                .map(TagResponse::from)
                .toList();
    }

    public List<Tag> getTagsByIds(List<Long> tagIds) {
        List<Tag> tags = tagRepository.findAllByIdIn(tagIds);
        if (tags.size() != tagIds.size()) {
            throw new BusinessException(ErrorCode.TAG_NOT_FOUND);
        }
        return tags;
    }
}
