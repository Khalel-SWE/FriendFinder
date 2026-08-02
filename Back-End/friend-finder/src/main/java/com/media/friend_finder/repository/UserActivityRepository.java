package com.media.friend_finder.repository;

import com.media.friend_finder.entity.User;
import com.media.friend_finder.entity.UserActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {

    List<UserActivity> findByUserOrderByCreatedAtDesc(User user);

}