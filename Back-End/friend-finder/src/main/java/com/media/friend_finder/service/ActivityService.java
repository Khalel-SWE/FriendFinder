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


    // =====================================================
    // SAVE ACTIVITY
    // =====================================================

    public void saveActivity(
            User user,
            ActivityType type,
            Long referenceId
    ) {

        UserActivity activity = new UserActivity();

        activity.setUser(user);
        activity.setActivityType(type);
        activity.setReferenceId(referenceId);

        activityRepository.save(activity);
    }


    // =====================================================
    // GET ALL ACTIVITIES
    // =====================================================

    public List<ActivityResponse> getUserActivities(User user) {

        return activityRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // GET RECENT 5 ACTIVITIES
    // =====================================================

    public List<ActivityResponse> getRecentUserActivities(User user) {

        return activityRepository
                .findTop5ByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // MAPPER
    // =====================================================

    private ActivityResponse mapToResponse(UserActivity activity) {

        return ActivityResponse.builder()
                .id(activity.getId())
                .activityType(
                        activity.getActivityType().name()
                )
                .referenceId(
                        activity.getReferenceId()
                )
                .createdAt(
                        activity.getCreatedAt()
                )
                .build();
    }
}