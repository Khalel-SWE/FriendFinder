package com.media.friend_finder.service;

import com.media.friend_finder.dto.ActivityResponse;
import com.media.friend_finder.entity.ActivityType;
import com.media.friend_finder.entity.User;
import com.media.friend_finder.entity.UserActivity;
import com.media.friend_finder.repository.UserActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final UserActivityRepository activityRepository;

    public void saveActivity(User user,
                             ActivityType type,
                             Long referenceId){

        UserActivity activity = new UserActivity();

        activity.setUser(user);
        activity.setActivityType(type);
        activity.setReferenceId(referenceId);

        activityRepository.save(activity);
    }

    public List<ActivityResponse> getUserActivities(User user){

        return activityRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(activity -> ActivityResponse.builder()
                        .id(activity.getId())
                        .activityType(activity.getActivityType().name())
                        .referenceId(activity.getReferenceId())
                        .createdAt(activity.getCreatedAt())
                        .build())
                .toList();

    }

}