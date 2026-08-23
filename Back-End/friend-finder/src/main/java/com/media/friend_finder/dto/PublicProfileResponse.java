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

    /*
     * SELF
     * FRIEND
     * INCOMING_PENDING
     * OUTGOING_PENDING
     * NONE
     */
    private String relationshipStatus;


    // =========================
    // FRIEND REQUEST
    // =========================

    /*
     * لو فيه Incoming Request
     * هنحتاج الـ ID بتاع الطلب
     * علشان Angular يقدر يعمل Accept / Reject.
     */
    private Long pendingRequestId;


    // =========================
    // ACCESS CONTROL
    // =========================

    /*
     * هل الـ viewer مسموح له يشوف Posts الشخص ده؟
     */
    private boolean canViewPosts;


    // =========================
    // RECENT ACTIVITY
    // =========================

    /*
     * آخر 5 Activities فقط.
     */
    private List<ActivityResponse> recentActivities;
}