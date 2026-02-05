package rewviewjom.backend.member.application;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rewviewjom.backend.global.exception.BusinessException;
import rewviewjom.backend.global.exception.ErrorCode;
import rewviewjom.backend.global.jwt.JwtTokenProvider;
import rewviewjom.backend.member.application.dto.*;
import rewviewjom.backend.member.domain.Member;
import rewviewjom.backend.member.domain.repository.MemberRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public MemberResponse signUp(SignUpRequest request) {
        if (memberRepository.existsByNickname(request.getNickname())) {
            throw new BusinessException(ErrorCode.DUPLICATE_NICKNAME);
        }

        Member member = Member.builder()
                .nickname(request.getNickname())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        return MemberResponse.from(memberRepository.save(member));
    }

    public LoginResponse login(LoginRequest request) {
        Member member = memberRepository.findByNickname(request.getNickname())
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw new BusinessException(ErrorCode.MEMBER_NOT_FOUND);
        }

        String accessToken = jwtTokenProvider.createToken(member.getId());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .member(MemberResponse.from(member))
                .build();
    }

    public MemberResponse getMember(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
        return MemberResponse.from(member);
    }

    @Transactional
    public MemberResponse updateNickname(Long memberId, MemberUpdateRequest request) {
        if (memberRepository.existsByNickname(request.getNickname())) {
            throw new BusinessException(ErrorCode.DUPLICATE_NICKNAME);
        }
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
        member.updateNickname(request.getNickname());

        return MemberResponse.from(member);
    }
}
