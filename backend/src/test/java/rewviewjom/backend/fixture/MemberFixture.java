package rewviewjom.backend.fixture;

import org.springframework.test.util.ReflectionTestUtils;
import rewviewjom.backend.member.domain.Member;

public class MemberFixture {

    public static Member createMember() {
        return createMember("testUser", "password123");
    }

    public static Member createMember(String nickname, String password) {
        return Member.builder()
                .nickname(nickname)
                .password(password)
                .build();
    }

    public static Member createMemberWithId(Long id) {
        return createMemberWithId(id, "testUser" + id);
    }

    public static Member createMemberWithId(Long id, String nickname) {
        Member member = Member.builder()
                .nickname(nickname)
                .password("password123")
                .build();
        ReflectionTestUtils.setField(member, "id", id);
        return member;
    }
}
