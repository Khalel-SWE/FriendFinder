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

    Optional<Profile> findByUser(User user);

    Optional<Profile> findByUserEmail(String email);

    // =====================================================
    // GET PROFILES FOR MULTIPLE USERS
    // =====================================================

    List<Profile> findByUserIn(List<User> users);

    // =====================================================
    // GET ALL PROFILES WITH USERS
    // =====================================================

    @Query(
            value = "SELECT p FROM Profile p JOIN FETCH p.user",
            countQuery = "SELECT count(p) FROM Profile p"
    )
    Page<Profile> findAllProfilesWithUsers(Pageable pageable);

    // =====================================================
    // FRIEND SUGGESTIONS
    // =====================================================
    //
    // We exclude only:
    //
    // 1. The current user
    // 2. Users with PENDING relationship
    // 3. Users with ACCEPTED relationship
    //
    // REJECTED is intentionally NOT excluded.
    //
    // Why?
    //
    // Because REJECTED does not mean BLOCKED.
    //
    // After a rejection:
    //
    //     A -> B
    //     REJECTED
    //
    // B should be able to appear again
    // in A's suggestions.
    //
    // The same applies in the opposite direction.
    //
    // =====================================================

    @Query("""
            SELECT p
            FROM Profile p
            WHERE p.user != :currentUser

            AND p.user NOT IN (
                SELECT f.requester
                FROM Friendship f
                WHERE f.addressee = :currentUser
                AND f.status IN ('PENDING', 'ACCEPTED')
            )

            AND p.user NOT IN (
                SELECT f.addressee
                FROM Friendship f
                WHERE f.requester = :currentUser
                AND f.status IN ('PENDING', 'ACCEPTED')
            )
            """)
    List<Profile> findSuggestedFriends(
            @Param("currentUser") User currentUser,
            Pageable pageable
    );
}