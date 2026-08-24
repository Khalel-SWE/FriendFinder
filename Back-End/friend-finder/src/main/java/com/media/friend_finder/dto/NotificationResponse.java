package com.media.friend_finder.dto;

import com.media.friend_finder.entity.Notification.NotificationType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {

    private Long id;

    private String message;

    private NotificationType type;

    private Long relatedId;

    /*
     * ID of the user who caused the notification.
     * Angular uses this to open the user's profile.
     */
    private Long actorId;

    private String actorName;

    private String actorProfilePicture;

    private boolean isRead;

    private LocalDateTime createdAt;
}