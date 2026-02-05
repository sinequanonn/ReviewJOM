package rewviewjom.backend.member.application.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {

    private String accessToken;
    private MemberResponse member;
}
