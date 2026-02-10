package rewviewjom.backend.tag.application;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import rewviewjom.backend.fixture.TagFixture;
import rewviewjom.backend.global.exception.BusinessException;
import rewviewjom.backend.global.exception.ErrorCode;
import rewviewjom.backend.tag.application.dto.TagResponse;
import rewviewjom.backend.tag.domain.Tag;
import rewviewjom.backend.tag.domain.TagCategory;
import rewviewjom.backend.tag.domain.repository.TagRepository;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

@DisplayName("TagService 테스트")
@ExtendWith(MockitoExtension.class)
class TagServiceTest {

    @InjectMocks
    private TagService tagService;

    @Mock
    private TagRepository tagRepository;

    @Test
    @DisplayName("전체 태그 목록을 조회할 수 있다")
    void getAllTags_existingTags_returnsAll() {
        // Given
        Tag javaTag = TagFixture.createTagWithId(1L, "Java", TagCategory.LANGUAGE);
        Tag springTag = TagFixture.createTagWithId(2L, "Spring", TagCategory.FRAMEWORK);

        given(tagRepository.findAll()).willReturn(List.of(javaTag, springTag));

        // When
        List<TagResponse> responses = tagService.getAllTags();

        // Then
        assertThat(responses).hasSize(2);
        assertThat(responses.get(0).getName()).isEqualTo("Java");
        assertThat(responses.get(1).getName()).isEqualTo("Spring");
    }

    @Test
    @DisplayName("카테고리별 태그 목록을 조회할 수 있다")
    void getTagsByCategory_languageCategory_returnsFilteredTags() {
        // Given
        Tag javaTag = TagFixture.createTagWithId(1L, "Java", TagCategory.LANGUAGE);
        Tag pythonTag = TagFixture.createTagWithId(2L, "Python", TagCategory.LANGUAGE);

        given(tagRepository.findByCategory(TagCategory.LANGUAGE)).willReturn(List.of(javaTag, pythonTag));

        // When
        List<TagResponse> responses = tagService.getTagsByCategory(TagCategory.LANGUAGE);

        // Then
        assertThat(responses).hasSize(2);
        assertThat(responses).allSatisfy(
                tag -> assertThat(tag.getCategory()).isEqualTo(TagCategory.LANGUAGE)
        );
    }

    @Test
    @DisplayName("ID 목록으로 태그를 조회할 수 있다")
    void getTagsByIds_validIds_returnsTags() {
        // Given
        List<Long> tagIds = List.of(1L, 2L);
        Tag javaTag = TagFixture.createTagWithId(1L, "Java", TagCategory.LANGUAGE);
        Tag springTag = TagFixture.createTagWithId(2L, "Spring", TagCategory.FRAMEWORK);

        given(tagRepository.findAllByIdIn(tagIds)).willReturn(List.of(javaTag, springTag));

        // When
        List<Tag> result = tagService.getTagsByIds(tagIds);

        // Then
        assertThat(result).hasSize(2);
    }

    @Test
    @DisplayName("존재하지 않는 태그 ID가 포함되면 예외가 발생한다")
    void getTagsByIds_invalidIds_throwsException() {
        // Given
        List<Long> tagIds = List.of(1L, 999L);
        Tag javaTag = TagFixture.createTagWithId(1L, "Java", TagCategory.LANGUAGE);

        given(tagRepository.findAllByIdIn(tagIds)).willReturn(List.of(javaTag));

        // When & Then
        assertThatThrownBy(() -> tagService.getTagsByIds(tagIds))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode())
                        .isEqualTo(ErrorCode.TAG_NOT_FOUND));
    }

    @Test
    @DisplayName("태그가 없을 때 전체 조회하면 빈 목록을 반환한다")
    void getAllTags_noTags_returnsEmptyList() {
        // Given
        given(tagRepository.findAll()).willReturn(List.of());

        // When
        List<TagResponse> responses = tagService.getAllTags();

        // Then
        assertThat(responses).isEmpty();
    }
}
