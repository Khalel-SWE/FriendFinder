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
    private NotificationType type; // غيرنا دي لـ Enum
    private Long relatedId;
    private boolean isRead;
    private LocalDateTime createdAt;
}