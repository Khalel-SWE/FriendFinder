package com.media.friend_finder.controller;

import com.media.friend_finder.dto.ActivityResponse;
import com.media.friend_finder.entity.User;
import com.media.friend_finder.service.ActivityService;
import com.media.friend_finder.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;
    private final UserService userService;

    @GetMapping
    public List<ActivityResponse> getActivities(Authentication authentication) {

        User user = userService.getCurrentUser(authentication);

        return activityService.getUserActivities(user);
    }
}