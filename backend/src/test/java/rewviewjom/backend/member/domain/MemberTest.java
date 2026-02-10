package rewviewjom.backend.member.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import rewviewjom.backend.fixture.MemberFixture;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Member 도메인 테스트")
class MemberTest {

    @Test
    @DisplayName("회원을 생성할 수 있다")
    void create_validInput_memberCreated() {
        // Given
        String nickname = "testUser";
        String password = "password123";

        // When
        Member member = Member.builder()
                .nickname(nickname)
                .password(password)
                .build();

        // Then
        assertThat(member.getNickname()).isEqualTo(nickname);
        assertThat(member.getPassword()).isEqualTo(password);
        assertThat(member.isDeleted()).isFalse();
        assertThat(member.getProfileImage()).isNull();
    }

    @Test
    @DisplayName("회원을 소프트 삭제할 수 있다")
    void softDelete_member_deletedTrue() {
        // Given
        Member member = MemberFixture.createMember();

        // When
        member.softDelete();

        // Then
        assertThat(member.isDeleted()).isTrue();
    }

    @Test
    @DisplayName("회원 닉네임을 변경할 수 있다")
    void updateNickname_newNickname_nicknameUpdated() {
        // Given
        Member member = MemberFixture.createMember();
        String newNickname = "updatedUser";

        // When
        member.updateNickname(newNickname);

        // Then
        assertThat(member.getNickname()).isEqualTo(newNickname);
    }

    @Test
    @DisplayName("프로필 이미지와 함께 회원을 생성할 수 있다")
    void create_withProfileImage_memberCreated() {
        // Given
        String profileImage = "https://example.com/image.png";

        // When
        Member member = Member.builder()
                .nickname("testUser")
                .password("password123")
                .profileImage(profileImage)
                .build();

        // Then
        assertThat(member.getProfileImage()).isEqualTo(profileImage);
    }
}
