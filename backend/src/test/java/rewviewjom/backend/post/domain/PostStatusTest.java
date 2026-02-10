package rewviewjom.backend.post.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("PostStatus 열거형 테스트")
class PostStatusTest {

    @ParameterizedTest(name = "PostStatus.{0}은 유효한 상태값이다")
    @EnumSource(PostStatus.class)
    @DisplayName("PostStatus는 유효한 상태값을 가진다")
    void values_allStatus_valid(PostStatus status) {
        // Given & When & Then
        assertThat(status).isNotNull();
        assertThat(PostStatus.valueOf(status.name())).isEqualTo(status);
    }

    @ParameterizedTest(name = "PostStatus는 {0}을 포함한다")
    @EnumSource(value = PostStatus.class, names = {"SOLVED", "UNSOLVED"})
    @DisplayName("PostStatus는 SOLVED와 UNSOLVED를 포함한다")
    void values_expectedValues_exist(PostStatus status) {
        // Given & When & Then
        assertThat(status).isIn(PostStatus.SOLVED, PostStatus.UNSOLVED);
    }
}
