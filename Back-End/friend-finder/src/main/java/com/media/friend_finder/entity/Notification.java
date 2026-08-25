package com.media.friend_finder.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // صاحب الإشعار
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    /*
     * ID of the related object.
     *
     * FRIEND_REQUEST      -> Friendship ID
     * ACCEPT_FRIEND_REQUEST -> Friendship ID
     * LIKE                -> Post ID
     * COMMENT             -> Post ID
     * NEW_CONTACT_MESSAGE -> ContactMessage ID
     * ADMIN_REPLY         -> ContactMessage ID
     */
    @Column(name = "related_id")
    private Long relatedId;

    /*
     * ID of the user who caused the notification.
     *
     * Example:
     *
     * Ihab liked my post
     *
     * actorId = Ihab's user ID
     */
    @Column(name = "actor_id")
    private Long actorId;

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum NotificationType {
        LIKE,
        COMMENT,
        FRIEND_REQUEST,
        ACCEPT_FRIEND_REQUEST,
        NEW_CONTACT_MESSAGE,
        ADMIN_REPLY
    }
}