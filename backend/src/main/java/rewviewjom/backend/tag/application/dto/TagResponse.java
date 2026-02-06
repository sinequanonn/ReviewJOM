package rewviewjom.backend.tag.application.dto;

import lombok.Builder;
import lombok.Getter;
import rewviewjom.backend.tag.domain.Tag;
import rewviewjom.backend.tag.domain.TagCategory;

@Getter
@Builder
public class TagResponse {
    private Long id;
    private String name;
    private TagCategory category;

    public static TagResponse from(Tag tag) {
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .category(tag.getCategory())
                .build();
    }
}
