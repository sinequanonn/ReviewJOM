package rewviewjom.backend.post.application.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import rewviewjom.backend.post.domain.PostStatus;

@Getter
@NoArgsConstructor
public class PostStatusUpdateRequest {

    @NotNull(message = "상태는 필수입니다.")
    private PostStatus status;
}
