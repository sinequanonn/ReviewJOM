package rewviewjom.backend.member.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;
import rewviewjom.backend.global.BaseEntity;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLRestriction("deleted = false")
public class Member extends BaseEntity {

    @Column(nullable = false, unique = true, length = 20)
    private String nickname;

    @Column(nullable = false)
    private String password;

    @Column(length = 500)
    private String profileImage;

    private boolean deleted = false;

    @Builder
    public Member(String nickname, String password, String profileImage) {
        this.nickname = nickname;
        this.password = password;
        this.profileImage = profileImage;
    }

    public void softDelete() {
        this.deleted = true;
    }

    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }
}
