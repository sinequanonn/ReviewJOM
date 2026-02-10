package rewviewjom.backend.fixture;

import org.springframework.test.util.ReflectionTestUtils;
import rewviewjom.backend.tag.domain.Tag;
import rewviewjom.backend.tag.domain.TagCategory;

public class TagFixture {

    public static Tag createTag(String name, TagCategory category) {
        return new Tag(name, category);
    }

    public static Tag createLanguageTag(String name) {
        return new Tag(name, TagCategory.LANGUAGE);
    }

    public static Tag createFrameworkTag(String name) {
        return new Tag(name, TagCategory.FRAMEWORK);
    }

    public static Tag createTagWithId(Long id, String name, TagCategory category) {
        Tag tag = new Tag(name, category);
        ReflectionTestUtils.setField(tag, "id", id);
        return tag;
    }
}
