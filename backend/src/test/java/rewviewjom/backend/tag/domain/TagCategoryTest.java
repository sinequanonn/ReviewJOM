package rewviewjom.backend.tag.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("TagCategory 열거형 테스트")
class TagCategoryTest {

    @ParameterizedTest(name = "TagCategory.{0}은 유효한 카테고리이다")
    @EnumSource(TagCategory.class)
    @DisplayName("TagCategory는 유효한 카테고리 값을 가진다")
    void values_allCategories_valid(TagCategory category) {
        // Given & When & Then
        assertThat(category).isNotNull();
        assertThat(TagCategory.valueOf(category.name())).isEqualTo(category);
    }

    @ParameterizedTest(name = "TagCategory는 {0}을 포함한다")
    @EnumSource(value = TagCategory.class, names = {"LANGUAGE", "FRAMEWORK"})
    @DisplayName("TagCategory는 LANGUAGE와 FRAMEWORK를 포함한다")
    void values_expectedValues_exist(TagCategory category) {
        // Given & When & Then
        assertThat(category).isIn(TagCategory.LANGUAGE, TagCategory.FRAMEWORK);
    }
}
