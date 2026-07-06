package com.media.friend_finder.repository;

import com.media.friend_finder.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import com.media.friend_finder.entity.User;

import java.util.List;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {

    Optional<Profile> findByUserEmail(String email);

    // عشان نجيب بروفايلات مجموعة يوزرز في Query واحدة (لحل الـ N+1)
    List<Profile> findByUserIn(List<User> users);


}