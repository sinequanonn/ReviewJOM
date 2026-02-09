package rewviewjom.backend.member.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rewviewjom.backend.member.domain.Member;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByNickname(String nickname);

    boolean existsByNickname(String nickname);
}
