package rewviewjom.backend.member.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class SignUpRequest {

    @NotBlank(message = "닉네임은 필수입니다.")
    @Size(min = 2, max = 20, message = "닉네임은 2~20자여야 합니다.")
    private String nickname;

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Size(min = 2, max = 20, message = "비밀번호는 2~20자여야 합니다.")
    private String password;
}
