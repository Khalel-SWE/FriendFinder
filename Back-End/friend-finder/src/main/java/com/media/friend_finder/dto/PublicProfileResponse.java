package com.media.friend_finder.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PublicProfileResponse {

    // =========================
    // PROFILE DATA
    // =========================

    private Long id;

    private String email;

    private String firstName;

    private String lastName;

    private String bio;

    private String jobTitle;

    private String location;

    private String profilePicture;

    private String coverPhoto;

    private String interests;

    private String languages;

    private LocalDateTime createdAt;


    // =========================
    // RELATIONSHIP
    // =========================

    private String relationshipStatus;

    private Long pendingRequestId;


    // =========================
    // ACCESS CONTROL
    // =========================

    private boolean canViewPosts;


    // =========================
    // RECENT ACTIVITY
    // =========================

    private List<ActivityResponse> recentActivities;
}