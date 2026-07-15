package com.media.friend_finder.repository;

import com.media.friend_finder.entity.Profile;
import com.media.friend_finder.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {

    Optional<Profile> findByUserEmail(String email);

    // عشان نجيب بروفايلات مجموعة يوزرز في Query واحدة (لحل الـ N+1)
    List<Profile> findByUserIn(List<User> users);

    // حط الـ Imports دي فوق لو مش موجودة
    // import org.springframework.data.domain.Page;
    // import org.springframework.data.domain.Pageable;
    // import org.springframework.data.jpa.repository.Query;

    @Query(value = "SELECT p FROM Profile p JOIN FETCH p.user",
            countQuery = "SELECT count(p) FROM Profile p")
    Page<Profile> findAllProfilesWithUsers(Pageable pageable);

    @Query("SELECT p FROM Profile p WHERE p.user != :currentUser AND p.user NOT IN " +
            "(SELECT f.requester FROM Friendship f WHERE f.addressee = :currentUser) AND p.user NOT IN " +
            "(SELECT f.addressee FROM Friendship f WHERE f.requester = :currentUser)")
    List<Profile> findSuggestedFriends(@Param("currentUser") User currentUser, Pageable pageable);
}

