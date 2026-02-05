package rewviewjom.backend.member.ui;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import rewviewjom.backend.global.response.ApiResponse;
import rewviewjom.backend.member.application.MemberService;
import rewviewjom.backend.member.application.dto.*;

@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/signup")
    public ApiResponse<MemberResponse> signUp(@Valid @RequestBody SignUpRequest request) {
        return ApiResponse.success(memberService.signUp(request));
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success(memberService.login(request));
    }

    @GetMapping("/me")
    public ApiResponse<MemberResponse> getMyInfo(@RequestAttribute("memberId") Long memberId) {
        return ApiResponse.success(memberService.getMember(memberId));
    }

    @PatchMapping("/me")
    public ApiResponse<MemberResponse> updateNickname(
            @RequestAttribute("memberId") Long memberId,
            @RequestBody MemberUpdateRequest request) {
        return ApiResponse.success(memberService.updateNickname(memberId, request));
    }

    @GetMapping("/{id}")
    public ApiResponse<MemberResponse> findById(@PathVariable Long id) {
        return ApiResponse.success(memberService.getMember(id));
    }
}
