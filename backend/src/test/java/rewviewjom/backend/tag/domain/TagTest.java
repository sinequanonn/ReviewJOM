package rewviewjom.backend.tag.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import rewviewjom.backend.fixture.TagFixture;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Tag 도메인 테스트")
class TagTest {

    @Test
    @DisplayName("언어 태그를 생성할 수 있다")
    void create_languageTag_tagCreated() {
        // Given
        String name = "Java";
        TagCategory category = TagCategory.LANGUAGE;

        // When
        Tag tag = new Tag(name, category);

        // Then
        assertThat(tag.getName()).isEqualTo(name);
        assertThat(tag.getCategory()).isEqualTo(TagCategory.LANGUAGE);
    }

    @Test
    @DisplayName("프레임워크 태그를 생성할 수 있다")
    void create_frameworkTag_tagCreated() {
        // Given
        String name = "Spring";
        TagCategory category = TagCategory.FRAMEWORK;

        // When
        Tag tag = new Tag(name, category);

        // Then
        assertThat(tag.getName()).isEqualTo(name);
        assertThat(tag.getCategory()).isEqualTo(TagCategory.FRAMEWORK);
    }
}
