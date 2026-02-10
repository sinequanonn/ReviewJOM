package rewviewjom.backend.member.application;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import rewviewjom.backend.fixture.MemberFixture;
import rewviewjom.backend.global.exception.BusinessException;
import rewviewjom.backend.global.exception.ErrorCode;
import rewviewjom.backend.global.jwt.JwtTokenProvider;
import rewviewjom.backend.member.application.dto.*;
import rewviewjom.backend.member.domain.Member;
import rewviewjom.backend.member.domain.repository.MemberRepository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;

@DisplayName("MemberService 테스트")
@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    @InjectMocks
    private MemberService memberService;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Test
    @DisplayName("회원가입에 성공한다")
    void signUp_validRequest_memberCreated() {
        // Given
        SignUpRequest request = new SignUpRequest();
        ReflectionTestUtils.setField(request, "nickname", "newUser");
        ReflectionTestUtils.setField(request, "password", "password123");

        Member savedMember = MemberFixture.createMemberWithId(1L, "newUser");

        given(memberRepository.existsByNickname("newUser")).willReturn(false);
        given(passwordEncoder.encode("password123")).willReturn("encodedPassword");
        given(memberRepository.save(any(Member.class))).willReturn(savedMember);

        // When
        MemberResponse response = memberService.signUp(request);

        // Then
        assertThat(response.getNickname()).isEqualTo("newUser");
        assertThat(response.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("중복 닉네임으로 회원가입 시 예외가 발생한다")
    void signUp_duplicateNickname_throwsException() {
        // Given
        SignUpRequest request = new SignUpRequest();
        ReflectionTestUtils.setField(request, "nickname", "existingUser");
        ReflectionTestUtils.setField(request, "password", "password123");

        given(memberRepository.existsByNickname("existingUser")).willReturn(true);

        // When & Then
        assertThatThrownBy(() -> memberService.signUp(request))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode())
                        .isEqualTo(ErrorCode.DUPLICATE_NICKNAME));
    }

    @Test
    @DisplayName("로그인에 성공한다")
    void login_validCredentials_loginSuccess() {
        // Given
        LoginRequest request = new LoginRequest();
        ReflectionTestUtils.setField(request, "nickname", "testUser");
        ReflectionTestUtils.setField(request, "password", "password123");

        Member member = MemberFixture.createMemberWithId(1L, "testUser");
        ReflectionTestUtils.setField(member, "password", "encodedPassword");

        given(memberRepository.findByNickname("testUser")).willReturn(Optional.of(member));
        given(passwordEncoder.matches("password123", "encodedPassword")).willReturn(true);
        given(jwtTokenProvider.createToken(1L)).willReturn("jwt-token");

        // When
        LoginResponse response = memberService.login(request);

        // Then
        assertThat(response.getAccessToken()).isEqualTo("jwt-token");
        assertThat(response.getMember().getNickname()).isEqualTo("testUser");
    }

    @Test
    @DisplayName("존재하지 않는 닉네임으로 로그인 시 예외가 발생한다")
    void login_memberNotFound_throwsException() {
        // Given
        LoginRequest request = new LoginRequest();
        ReflectionTestUtils.setField(request, "nickname", "nonExistent");
        ReflectionTestUtils.setField(request, "password", "password123");

        given(memberRepository.findByNickname("nonExistent")).willReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> memberService.login(request))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode())
                        .isEqualTo(ErrorCode.MEMBER_NOT_FOUND));
    }

    @Test
    @DisplayName("비밀번호가 일치하지 않으면 예외가 발생한다")
    void login_wrongPassword_throwsException() {
        // Given
        LoginRequest request = new LoginRequest();
        ReflectionTestUtils.setField(request, "nickname", "testUser");
        ReflectionTestUtils.setField(request, "password", "wrongPassword");

        Member member = MemberFixture.createMemberWithId(1L, "testUser");

        given(memberRepository.findByNickname("testUser")).willReturn(Optional.of(member));
        given(passwordEncoder.matches("wrongPassword", member.getPassword())).willReturn(false);

        // When & Then
        assertThatThrownBy(() -> memberService.login(request))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode())
                        .isEqualTo(ErrorCode.MEMBER_NOT_FOUND));
    }

    @Test
    @DisplayName("회원 정보를 조회할 수 있다")
    void getMember_existingMember_returnsResponse() {
        // Given
        Member member = MemberFixture.createMemberWithId(1L, "testUser");
        given(memberRepository.findById(1L)).willReturn(Optional.of(member));

        // When
        MemberResponse response = memberService.getMember(1L);

        // Then
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getNickname()).isEqualTo("testUser");
    }

    @Test
    @DisplayName("존재하지 않는 회원 조회 시 예외가 발생한다")
    void getMember_memberNotFound_throwsException() {
        // Given
        given(memberRepository.findById(999L)).willReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> memberService.getMember(999L))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode())
                        .isEqualTo(ErrorCode.MEMBER_NOT_FOUND));
    }

    @Test
    @DisplayName("닉네임을 변경할 수 있다")
    void updateNickname_validNickname_nicknameUpdated() {
        // Given
        Member member = MemberFixture.createMemberWithId(1L, "oldNickname");
        MemberUpdateRequest request = new MemberUpdateRequest();
        ReflectionTestUtils.setField(request, "nickname", "newNickname");

        given(memberRepository.existsByNickname("newNickname")).willReturn(false);
        given(memberRepository.findById(1L)).willReturn(Optional.of(member));

        // When
        MemberResponse response = memberService.updateNickname(1L, request);

        // Then
        assertThat(response.getNickname()).isEqualTo("newNickname");
    }

    @Test
    @DisplayName("중복 닉네임으로 변경 시 예외가 발생한다")
    void updateNickname_duplicateNickname_throwsException() {
        // Given
        MemberUpdateRequest request = new MemberUpdateRequest();
        ReflectionTestUtils.setField(request, "nickname", "existingNickname");

        given(memberRepository.existsByNickname("existingNickname")).willReturn(true);

        // When & Then
        assertThatThrownBy(() -> memberService.updateNickname(1L, request))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode())
                        .isEqualTo(ErrorCode.DUPLICATE_NICKNAME));
    }
}
